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

import find from 'lodash/find';
import reduce from 'lodash/reduce';
import compact from 'lodash/compact';

import NextMatch from './NextMatch';
import GameGrid from './GameGrid';
import { HealerIcon, FlexIcon, DpsIcon, TankIcon } from './RoleIcons';

import { brokenImage } from '../util'

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
    justifyContent: 'space-around',
    overflow: 'hidden',
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
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function GetCompletedGamesFromMap(map, team) {
  const games = reduce(team.completedMatches, (acc, match) => {
    const updatedMatch = markMapWinner(match, team)
    const rightMap = find(updatedMatch.games, game => {
      return game.attributes.map === map
    })
    return [...acc, rightMap]
  }, [])
  return compact(games);
}

function markMapWinner(match, team) {
  const winner = match.scores[0] > match.scores[1] ? 'team1' : 'team2';
  const loser = match.scores[0] > match.scores[1] ? 'team2' : 'team1';
  const myTeam = match.winner ? winner : loser;
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
    const { classes, open, team, width, maps, opponent } = this.props;
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
          <Toolbar style={{ backgroundColor: `#${team.secondaryColor}`, color: `#${team.primaryColor}` }}>
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
          <NextMatch team={team} />
          <GameGrid
            games={team.nextMatches && team.nextMatches[0].games.map(game => {
              console.log('game', game)
              const map = find(maps, ['id', game.maps])
              const icon = map ? map.thumbnail : brokenImage
              return ({
                team: GetCompletedGamesFromMap(game.maps, team),
                opponent: GetCompletedGamesFromMap(game.maps, opponent),
                icon
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
