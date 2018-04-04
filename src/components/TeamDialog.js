import React from 'react';
import PropTypes from 'prop-types';
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
import reduce from 'lodash/reduce';
import compact from 'lodash/compact';

import MatchPreview from './MatchPreview';
import GameGrid from './GameGrid';
import { HealerIcon, FlexIcon, DpsIcon, TankIcon } from './RoleIcons';

import { brokenImage, getTextColor } from '../util'

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

function GetCompletedGamesFromMap(map, team) {
  const games = reduce(team.completedMatches, (acc, match) => {
    const updatedMatch = markMapWinner(match, team)
    console.log('game,', match)
    const rightMap = find(updatedMatch.games, game => {
      return game.attributes.map === map
    })
    return [...acc, rightMap]
  }, [])
  console.log('team, match',team, games, map)
  return compact(games);
}

function markMapWinner(match, team) {
  const winner = match.scores[0] > match.scores[1] ? 'team1' : 'team2';
  const loser = match.scores[0] > match.scores[1] ? 'team2' : 'team1';
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
    const { classes, open, team, width, maps, opponent, otherOpponent, size, matchIndex, handleNextMatch, handlePrevMatch } = this.props;

    if (!open) {
      return null;
    }
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={this.handleClose}
        transition={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar style={{ backgroundColor: team.secondaryColor, color: getTextColor(team.secondaryColor) }}>
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
                    classes={{
                      root: classes.titleBar,
                    }}
                    subtitle={<span>{player.nationality}</span>}
                    actionIcon={roleMap[player.attributes.role]}
                  />
                </GridListTile>
              ))}
            </GridList>
          )}
          <MatchPreview team={team} opponent={opponent} size={size} matchIndex={matchIndex} />
          <div className={classes.buttonContainer}>
            {matchIndex === 0
              ? <Button
                variant="raised"
                style={{ backgroundColor: otherOpponent.primaryColor, color: getTextColor(otherOpponent.primaryColor) }}
                onClick={handleNextMatch}>
                  Next Match
                  <img className={classes.teamImage} src={otherOpponent.altLogo || otherOpponent.mainLogo}/>
              </Button>
              : <Button
                variant="raised"
                style={{ backgroundColor: otherOpponent.primaryColor, color: getTextColor(otherOpponent.primaryColor) }}
                onClick={handlePrevMatch}>
                  Previous Match
                  <img className={classes.teamImage} src={otherOpponent.altLogo || otherOpponent.mainLogo}/>
              </Button>
            }
          </div>
          <GameGrid
            team={team}
            opponent={opponent}
            games={team.nextMatches && team.nextMatches[matchIndex].games.map((game, index) => {
              const map = find(maps, ['id', game.maps])
              const icon = map ? map.thumbnail : brokenImage
              const mapName = map ? map.name.en_US : 'No Name'
              return ({
                team: GetCompletedGamesFromMap(game.maps, team),
                opponent: GetCompletedGamesFromMap(game.maps, opponent),
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

export default withStyles(styles)(TeamDialog);
