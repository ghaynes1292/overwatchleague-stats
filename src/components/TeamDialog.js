import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps, withHandlers } from 'recompose';
import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';

import Paper from 'material-ui/Paper';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Button from 'material-ui/Button';

import find from 'lodash/find';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import compact from 'lodash/compact';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';

import MatchPreview from './MatchPreview';
import GameGrid from './GameGrid';
import { HealerIcon, FlexIcon, DpsIcon, TankIcon } from './RoleIcons';

import { brokenImage, getTextColor, getTeamFromTeams, getTeamMatches, getCompetetor, getCompetetorTeam } from '../util'

const roleMap = {
  support: <HealerIcon />,
  flex: <FlexIcon />,
  offense: <DpsIcon />,
  tank: <TankIcon />,
};

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  root: {
    flexWrap: 'wrap',
    height: 'inherit',
    justifyContent: 'space-around',
    backgroundColor: `#F1F1F1`,
    backgroundImage: 'url(https://styleguide.overwatchleague.com/assets/toolkit/images/background/OWL-LBG-2.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% -18%',
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    color: 'white'
  },
  titleBar: {
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  imageTile: {
    top: '60%'
  },
  teamImage: {
    maxWidth: '30px',
    marginLeft: '10px',
  },
  buttonContainer: {
    display: 'flex'
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function GetCompletedGamesFromMap(map, team, teamMatches) {
  const games = reduce(filter(teamMatches, ['state', 'CONCLUDED']), (acc, match) => {
    const updatedMatch = markMapWinner(match, team)
    const rightMap = find(updatedMatch.games, game => {
      return game.attributes.map === map
    })
    return [...acc, rightMap]
  }, [])
  return compact(games);
}

function markMapWinner(match, team) {
  const myTeam = match.competitors[0].id === team.id ? 'team1' : 'team2';
  const newMatch = {
    ...match,
    games: match.games.map(game => {
      const teamWon = game.attributes.mapScore.team1 > game.attributes.mapScore.team2
        ? 'team1'
        : 'team2';
      return ({ ...game, winner: myTeam === teamWon })
    })
  }
  return newMatch;
}

class TeamDialog extends React.Component {
  render() {
    const { classes, width, open, team, opponent, prevOpponent, nextOpponent, teamMapScore, opponentMapScore, schedule, maps, match, prevMatch, nextMatch, handleNextMatch, handlePrevMatch } = this.props;
    if (!open || !team) {
      return null;
    }
    console.log('props in team dialog', this.props)
    return (
      <Dialog
        fullScreen
        open={open}
        transition={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar style={{ backgroundColor: team.colors.secondary.color, color: getTextColor(team.colors.secondary.color) }}>
            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit">
              {team.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper className={classes.root}>
          {team.players && (
            <GridList cellHeight={125} className={classes.gridList} cols={width === 'xs' ? 3.5 : 6.5}>
              {team.players.map(player => (
                <GridListTile key={player.id} classes={{ imgFullWidth: classes.imageTile }}>
                  <img src={player.headshot} alt={player.name} />
                  <GridListTileBar
                    title={`${player.name}`}
                    classes={{ root: classes.titleBar }}
                    actionIcon={roleMap[player.role]}
                  />
                </GridListTile>
              ))}
            </GridList>
          )}
          {match && <MatchPreview team={team} opponent={opponent} width={width} match={match} />}
          <div className={classes.buttonContainer}>
            <Button
              variant="raised"
              style={{ backgroundColor: prevOpponent.colors.primary.color, color: getTextColor(prevOpponent.colors.primary.color) }}
              onClick={handlePrevMatch}>
                Previous Match
                <img className={classes.teamImage} src={(prevOpponent.logo.alt|| prevOpponent.logo.main).png} />
            </Button>
            <Button
              variant="raised"
              style={{ backgroundColor: nextOpponent.colors.primary.color, color: getTextColor(nextOpponent.colors.primary.color) }}
              onClick={handleNextMatch}>
                Next Match
                <img className={classes.teamImage} src={(nextOpponent.logo.alt|| nextOpponent.logo.main).png} />
            </Button>
          </div>
          <GameGrid
            team={team}
            opponent={opponent}
            games={match.games.map((game, index) => {
              console.log('game!', game, this.props)
              const map = find(maps, ['id', game.attributes.map])
              const icon = map ? map.thumbnail : brokenImage
              const mapName = map ? map.name.en_US : 'No Name'
              return ({
                team: teamMapScore[index],
                opponent: opponentMapScore[index],
                icon,
                mapName,
                index
              })
            })}
          />
        </Paper>
      </Dialog>
    );
  }
}

TeamDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withProps((props) => {
    const team = getTeamFromTeams(props.teams, props.team);
    const teamMatches = getTeamMatches(props.schedule, props.team);
    const teamMatch = props.match || filter(teamMatches, ['state', 'PENDING'])[0]
    const opponent = teamMatch && getCompetetor(props.teams, teamMatch, props.team)
    const opponentMatches = teamMatch && getTeamMatches(props.schedule, opponent.id);
    const teamMapScore = teamMatch && teamMatch.games.map(game => GetCompletedGamesFromMap(game.attributes.map, team, teamMatches))
    const opponentMapScore = teamMatch && teamMatch.games.map(game => GetCompletedGamesFromMap(game.attributes.map, opponent, opponentMatches))
    const prevMatch = teamMatch && get(teamMatches, `[${findIndex(teamMatches, ['id', teamMatch.id]) - 1}]`)
    const nextMatch = teamMatch && get(teamMatches, `[${findIndex(teamMatches, ['id', teamMatch.id]) + 1}]`)
    const prevOpponent = prevMatch && getCompetetor(props.teams, prevMatch, props.team)
    const nextOpponent = nextMatch && getCompetetor(props.teams, nextMatch, props.team)
    return ({
      team,
      match: teamMatch,
      prevMatch,
      nextMatch,
      opponent,
      prevOpponent,
      nextOpponent,
      teamMapScore,
      opponentMapScore,
    })
  }),
  withHandlers({
    handlePrevMatch: (props) => (prevMatch) => props.setMatch(props.prevMatch),
    handleNextMatch: (props) => (nextMatch) => props.setMatch(props.nextMatch)
  }),
)(TeamDialog);
