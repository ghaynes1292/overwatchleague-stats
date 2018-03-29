import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from 'material-ui/styles';

import filter from 'lodash/filter';

import GameComponent from './GameComponent';

const styles = {
  root: {
    width: '95%',
    margin: 'auto',
    overflowX: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
  },
  center: {
    textAlign: 'center'
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-around'
  }
};

function getGameStats(team) {
  const wins = filter(team, o => o.points[0] !== o.points[1] && o.winner).length;
  const draws = filter(team, o => o.points[0] === o.points[1]).length;
  const losses = team.length - wins - draws;
  return { wins, draws, losses }
}

function GameGrid(props) {
  const { classes, games, team, opponent } = props;
  if (!games) {
    return null;
  }
  return (
    <div className={classes.root}>
      {games.map(game => {
        const teamStats = getGameStats(game.team)
        const opponentStats = getGameStats(game.opponent)
        return (
          <GameComponent
            key={game.index}
            game={game}
            team={team}
            opponent={opponent}
            teamStats={teamStats}
            opponentStats={opponentStats}
          />
        );
      })}
    </div>
  );
}

GameGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
)(GameGrid);
