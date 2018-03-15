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
  table: {
    minWidth: 200,
  },
  center: {
    textAlign: 'center'
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between'
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
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="dense">
              <Typography variant="subheading">
                Wins / Loss / Draw
              </Typography>
            </TableCell>
            <TableCell padding="dense" className={classes.center}>Map</TableCell>
            <TableCell padding="dense" numeric>
              <Typography variant="subheading">
                Wins / Loss / Draw
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map(game => {
            const teamStats = getGameStats(game.team)
            const opponentStats = getGameStats(game.opponent)
            return (
              <TableRow key={game.icon}>
                <TableCell padding="dense" >
                  <Typography variant="subheading">
                    {teamStats.wins} / {teamStats.losses} / {teamStats.draws}
                  </Typography>
                </TableCell>
                <TableCell padding="dense" className={classes.center}><img src={game.icon} width={65} height={45}/></TableCell>
                <TableCell padding="dense" numeric>
                  <Typography variant="subheading">
                    {opponentStats.wins} / {opponentStats.losses} / {opponentStats.draws}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

NextMatch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
)(NextMatch);
