import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Tooltip from 'material-ui/Tooltip';

import MatchTooltip from './MatchTooltip';

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
  },
  tooltipOpen: {
    backgroundColor: 'inherit'
  }
});

function SimpleTable(props) {
  const { classes, teams, maps } = props;

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
            <TableCell padding="dense">Game Win</TableCell>
            <TableCell padding="dense">Game Loss</TableCell>
            <TableCell padding="dense">Diff</TableCell>
            <TableCell padding="dense">Next</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team, index) => {
            const { ranking, completedMatches, nextMatches } = team;
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
                <TableCell padding="dense">
                  <div className={classes.flexContainer}>
                    {nextMatches.map(match =>
                      <div key={match.startDate}>
                        <Tooltip
                          id="tooltip-icon"
                          placement="bottom-start"
                          classes={{ tooltipOpen: classes.tooltipOpen }}
                          title={<MatchTooltip match={match} maps={maps} />}>
                          <img width={35} src={match.competitor.icon}/>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </TableCell>
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
