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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflowX: 'hidden'
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
  },
  paddingDense: {
    paddingLeft: '10px',
    paddingRight: '10px'
  }
});

const wrapInHidden = (component, props) => <Hidden {...props}>{component}</Hidden>

function SimpleTable(props) {
  const { classes, width, teams, maps } = props;
  const { tableCell } = classes;
  console.log('width', width)
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {wrapInHidden(<TableCell>Place</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>Team</TableCell>, {})}
            {wrapInHidden(<TableCell></TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>Match Win</TableCell>, {})}
            {wrapInHidden(<TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>Match Loss</TableCell>, {})}
            {wrapInHidden(<TableCell>Win%</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell>Past Matches</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell>Game Win</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell>Game Loss</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>Diff</TableCell>, {})}
            {wrapInHidden(<TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>Next</TableCell>, {})}
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team, index) => {
            const { ranking, completedMatches, nextMatches } = team;
            let diffColor;
            if (ranking.gameWin - ranking.gameLoss === 0) {
              diffColor = null
            } else {
              diffColor = (ranking.gameWin - ranking.gameLoss)> 0
                ? classes.green
                : classes.red
            }
            return (
              <TableRow key={team.id} className={classes.tableRow}>
                {wrapInHidden(<TableCell>
                  {index + 1}
                </TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>
                  <Tooltip
                    id="tooltip-icon"
                    placement="right-start"
                    classes={{ tooltipOpen: classes.tooltipOpen }}
                    title={<TeamTooltip team={team} />}>
                    <img width={35} src={team.icon}/>
                  </Tooltip>
                </TableCell>, {})}
                {wrapInHidden(<TableCell>{team.abbreviatedName}</TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>{ranking.matchWin}</TableCell>, {})}
                {wrapInHidden(<TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>{ranking.matchLoss}</TableCell>, {})}
                {wrapInHidden(<TableCell numeric>
                  {Math.round((ranking.matchWin * Math.pow(10, 1.00))/(ranking.matchWin + ranking.matchLoss) * Math.pow(10, 1.00))}
                </TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell numeric>
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
                {wrapInHidden(<TableCell numeric>{ranking.gameWin}</TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell numeric>{ranking.gameLoss}</TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell
                  numeric
                  padding="dense" classes={{ paddingDense: classes.paddingDense }}
                  className={diffColor}>
                  {(ranking.gameWin - ranking.gameLoss)}
                </TableCell>, {})}
                {wrapInHidden(<TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>
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
