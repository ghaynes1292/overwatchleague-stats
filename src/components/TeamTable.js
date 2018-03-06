import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 200,
  },
  tableRow: {
    height: '30px'
  },
  flexContainer: {
    display: 'flex',
    width: '75px',
    height: '30px'
  },
  flexMark: {
    flex: '1 auto',
    borderLeft: '1px solid white',
    borderRight: '1px solid white',
  }
});

function SimpleTable(props) {
  const { classes, teams } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="dense">Place</TableCell>
            <TableCell padding="dense">Team</TableCell>
            <TableCell padding="dense"></TableCell>
            <TableCell padding="dense">Match Win</TableCell>
            <TableCell padding="dense">Match Loss</TableCell>
            <TableCell padding="dense">Win%</TableCell>
            <TableCell padding="dense">Past Matches</TableCell>
            <TableCell padding="dense">Map Win</TableCell>
            <TableCell padding="dense">Map Loss</TableCell>
            <TableCell padding="dense">Diff</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team, index) => {
            const { ranking, completedMatches } = team;
            return (
              <TableRow key={team.id} className={classes.tableRow}>
                <TableCell padding="dense">{index + 1}</TableCell>
                <TableCell padding="dense"><img width={35} src={team.icon}/></TableCell>
                <TableCell padding="dense">{team.abbreviatedName}</TableCell>
                <TableCell padding="dense">{ranking.matchWin}</TableCell>
                <TableCell padding="dense">{ranking.matchLoss}</TableCell>
                <TableCell padding="dense">{Math.round((ranking.matchWin * Math.pow(10, 1.00))/(ranking.matchWin + ranking.matchLoss) * Math.pow(10, 1.00))}</TableCell>
                <TableCell padding="dense">
                  <div className={classes.flexContainer}>
                    {completedMatches.slice(-6).map(match =>
                      <div
                        key={match.id}
                        className={classes.flexMark}
                        style={{ backgroundColor: match.winner ? 'rgb(169, 208, 142)' : 'rgb(255, 232, 235)' }}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell padding="dense">{ranking.gameWin}</TableCell>
                <TableCell padding="dense">{ranking.gameLoss}</TableCell>
                <TableCell padding="dense">{(ranking.gameWin - ranking.gameLoss)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
