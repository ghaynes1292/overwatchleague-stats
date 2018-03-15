import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Hidden from 'material-ui/Hidden';
import find from 'lodash/find';

import TeamDialog from './TeamDialog';

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
  const { classes, width, teams, maps, teamProp, setTeam, opponent, setOpponent } = props;
  console.log('width', width)
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {wrapInHidden(<TableCell padding="dense">Place</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>Team</TableCell>, {})}
            {wrapInHidden(<TableCell></TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>Match Win</TableCell>, {})}
            {wrapInHidden(<TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>Match Loss</TableCell>, {})}
            {wrapInHidden(<TableCell numeric>Win%</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell padding="dense">Past Matches</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell numeric>Game Win</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell numeric>Game Loss</TableCell>, { only: 'xs' })}
            {wrapInHidden(<TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>Diff</TableCell>, {})}
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
              <TableRow key={team.id} className={classes.tableRow} onClick={() => {
                setTeam(team)
                setOpponent(find(teams, ['id', team.nextMatches[0].competitor.id]))
              }}>
                {wrapInHidden(<TableCell padding="dense">
                  {index + 1}
                </TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>
                  <img width={35} src={team.icon}/>
                </TableCell>, {})}
                {wrapInHidden(<TableCell>{team.abbreviatedName}</TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>{ranking.matchWin}</TableCell>, {})}
                {wrapInHidden(<TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>{ranking.matchLoss}</TableCell>, {})}
                {wrapInHidden(<TableCell numeric>
                  {Math.round((ranking.matchWin * Math.pow(10, 1.00))/(ranking.matchWin + ranking.matchLoss) * Math.pow(10, 1.00))}
                </TableCell>, { only: 'xs' })}
                {wrapInHidden(<TableCell numeric padding="dense">
                  <div className={classes.flexContainer}>
                    {completedMatches.slice(-6).map(match =>
                      <div
                        key={match.id}
                        className={classes.flexMark}
                        style={{ backgroundColor: match.winner ? 'rgb(112, 219, 112)' : 'rgb(219, 112, 112)' }}
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
                        <img width={35} src={match.competitor.icon}/>
                      </div>
                    )}
                  </div>
                </TableCell>, {})}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TeamDialog
        team={teamProp || {}}
        opponent={opponent || {}}
        open={!!teamProp}
        handleClose={() => setTeam(null)}
        width={width}
        maps={maps}
      />
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withWidth(),
  withState('teamProp', 'setTeam', null),
  withState('opponent', 'setOpponent', null),
)(SimpleTable);
