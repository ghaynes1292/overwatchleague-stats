import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose, withHandlers } from 'recompose';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';

import Paper from 'material-ui/Paper';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Button from 'material-ui/Button';

import find from 'lodash/find';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import compact from 'lodash/compact';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';

import MatchPreview from '../components/MatchPreview';
import GameGrid from '../components/GameGrid';
import { HealerIcon, FlexIcon, DpsIcon, TankIcon } from '../components/RoleIcons';

import { brokenImage, getTextColor, getTeamMatches, getCompetetor, getTeamFromTeamName } from '../util'

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
      return ({ ...game, winner: game.points[0] !== game.points[1] ? myTeam === teamWon : null })
    })
  }
  return newMatch;
}

class TeamDialog extends React.Component {
  render() {
    const { classes, width, team, opponent, prevOpponent, nextOpponent, teamMapScore, opponentMapScore, maps, teamMatch, handleNextMatch, handlePrevMatch } = this.props;
    if (!team || !opponent) {
      return null
    }
    return (
      <div>
        <AppBar className={classes.appBar}>
          <Toolbar style={{ backgroundColor: team.colors.secondary.color, color: getTextColor(team.colors.secondary.color) }}>
            <IconButton color="inherit" onClick={() => this.props.history.push(`/`)} aria-label="Close">
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
          {teamMatch && <MatchPreview team={team} opponent={opponent} width={width} match={teamMatch} />}
          <div className={classes.buttonContainer}>
            <Button
              variant="raised"
              style={{ backgroundColor: prevOpponent.colors.primary.color, color: getTextColor(prevOpponent.colors.primary.color) }}
              onClick={handlePrevMatch}>
                Previous Match
                <img className={classes.teamImage} src={(prevOpponent.logo.alt|| prevOpponent.logo.main).png} alt={prevOpponent.abbreviatedName} />
            </Button>
            <Button
              variant="raised"
              style={{ backgroundColor: nextOpponent.colors.primary.color, color: getTextColor(nextOpponent.colors.primary.color) }}
              onClick={handleNextMatch}>
                Next Match
                <img className={classes.teamImage} src={(nextOpponent.logo.alt|| nextOpponent.logo.main).png} alt={nextOpponent.abbreviatedName} />
            </Button>
          </div>
          <GameGrid
            team={team}
            opponent={opponent}
            games={teamMatch.games.map((game, index) => {
              const map = find(maps, ['id', game.attributes.map])
              const icon = map ? map.thumbnail : brokenImage
              const mapName = map ? map.name.en_US : 'No Name'
              return ({
                id: game.id,
                team: teamMapScore[index],
                opponent: opponentMapScore[index],
                icon,
                mapName,
                index
              })
            })}
          />
        </Paper>
      </div>
    );
  }
}

TeamDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const team = getTeamFromTeamName(state.teams.data, ownProps.match.params.abbreviatedName);
  const teamMatches = team && getTeamMatches(state.schedule.data, team.id);
  const teamMatch = team && (find(teamMatches, ['id', parseInt(ownProps.match.params.matchId, 10)]) || filter(teamMatches, ['state', 'PENDING'])[0])
  const opponent = teamMatch && getCompetetor(state.teams.data, teamMatch, team.id)
  const opponentMatches = teamMatch && getTeamMatches(state.schedule.data, opponent.id);
  const teamMapScore = teamMatch && teamMatch.games.map(game => GetCompletedGamesFromMap(game.attributes.map, team, teamMatches))
  const opponentMapScore = teamMatch && teamMatch.games.map(game => GetCompletedGamesFromMap(game.attributes.map, opponent, opponentMatches))
  const prevMatch = teamMatch && get(teamMatches, `[${findIndex(teamMatches, ['id', teamMatch.id]) - 1}]`)
  const nextMatch = teamMatch && get(teamMatches, `[${findIndex(teamMatches, ['id', teamMatch.id]) + 1}]`)
  return {
    team,
    teamMatches,
    teamMatch,
    opponent,
    opponentMatches,
    teamMapScore,
    opponentMapScore,
    prevMatch,
    nextMatch,
    prevOpponent: prevMatch && getCompetetor(state.teams.data, prevMatch, team.id),
    nextOpponent: nextMatch && getCompetetor(state.teams.data, nextMatch, team.id),
    maps: state.maps.data
  }
}

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  withHandlers({
    handlePrevMatch: (props) => () => props.history.push(`/team/${props.team.abbreviatedName}/${props.prevMatch.id}`),
    handleNextMatch: (props) => () => props.history.push(`/team/${props.team.abbreviatedName}/${props.nextMatch.id}`),
  }),
)(TeamDialog);
