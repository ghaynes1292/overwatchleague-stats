import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Tooltip from 'material-ui/Tooltip';
import Hidden from 'material-ui/Hidden';

import MatchTooltip from './MatchTooltip';
import TeamTooltip from './TeamTooltip';

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
  },
  red: {
    color: 'red'
  },
  green: {
    color: 'green'
  }
});

const wrapInHidden = (component, props) => <Hidden {...props}>{component}</Hidden>

function SimpleTable(props) {
  const { classes, width, teams, maps } = props;
  console.log('width', width)
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {wrapInHidden(<TableCell padding="dense">Place</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense">Team</TableCell>, {})}
            {wrapInHidden(<TableCell padding="dense"></TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense">Match Win</TableCell>, {})}
            {wrapInHidden(<TableCell padding="dense">Match Loss</TableCell>, {})}
            {wrapInHidden(<TableCell padding="dense">Win%</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense">Past Matches</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense">Game Win</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense">Game Loss</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense">Diff</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense">Next</TableCell>, {})}
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team, index) => {
            const { ranking, completedMatches, nextMatches } = team;
            let diffColor;
            if (ranking.gameWin - ranking.gameLoss === 0) {
              diffColor = null
            } else {
              diffColor = (ranking.gameWin - ranking.gameLoss) > 0
                ? classes.green
                : classes.red
            }
            return (
              <TableRow key={team.id} className={classes.tableRow}>
                {wrapInHidden(<TableCell padding="dense">
                  {index + 1}
                </TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell padding="dense">
                  <Tooltip
                    id="tooltip-icon"
                    placement="right-start"
                    classes={{ tooltipOpen: classes.tooltipOpen }}
                    title={<TeamTooltip team={team} />}>
                    <img width={35} src={team.icon}/>
                  </Tooltip>
                </TableCell>, {})}
                {wrapInHidden(<TableCell padding="dense">{team.abbreviatedName}</TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell padding="dense">{ranking.matchWin}</TableCell>, {})}
                {wrapInHidden(<TableCell padding="dense">{ranking.matchLoss}</TableCell>, {})}
                {wrapInHidden(<TableCell padding="dense">
                  {Math.round((ranking.matchWin * Math.pow(10, 1.00))/(ranking.matchWin + ranking.matchLoss) * Math.pow(10, 1.00))}
                </TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell padding="dense">
                  <div className={classes.flexContainer}>
                    {completedMatches.slice(-6).map(match =>
                      <div
                        key={match.id}
                        className={classes.flexMark}
                        style={{ backgroundColor: match.winner ? 'rgb(169, 208, 142)' : 'rgb(255, 232, 235)' }}
                      />
                    )}
                  </div>
                </TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell padding="dense">{ranking.gameWin}</TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell padding="dense">{ranking.gameLoss}</TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell
                  padding="dense"
                  className={diffColor}>
                  {(ranking.gameWin - ranking.gameLoss)}
                </TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell padding="dense">
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
                </TableCell>, {})}
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

export default compose(withStyles(styles), withWidth())(SimpleTable);
