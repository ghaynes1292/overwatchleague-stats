import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import filter from 'lodash/filter';

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
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

function NextMatch(props) {
  const { classes, games } = props;
  if (!games) {
    return null;
  }
  return (
    <Paper className={classes.root}>
      <div>
        {games.map(game => {
          const teamStats = getGameStats(game.team)
          const opponentStats = getGameStats(game.opponent)
          return (
            <Paper className={classes.flex}>
              <Typography variant="subheading">
                {teamStats.wins} / {teamStats.losses} / {teamStats.draws}
              </Typography>
              <img src={game.icon} width={200} height={100}/>
              <Typography variant="subheading">
                {opponentStats.wins} / {opponentStats.losses} / {opponentStats.draws}
              </Typography>
            </Paper>
          );
        })}
      </div>
    </Paper>
  );
}

NextMatch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
)(NextMatch);
