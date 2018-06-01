import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import withWidth from 'material-ui/utils/withWidth';
import Paper from 'material-ui/Paper';
import without from 'lodash/without';

import TableMenu from './TableMenu';
import StagePicker from './StagePicker';

const DEFAULT_COLS = ['Place', 'Team Icon', 'Team Name', 'Match Win', 'Match Loss', 'Win %', 'Past Matches', 'Game Wins', 'Game Loss', 'Diff', 'Next'];
//const DEFAULT_STAGE_COLS = ['Place', 'Team Icon', 'Team Name', 'Match Win', 'Match Loss', 'Win %', 'Game Wins', 'Game Loss', 'Diff'];
const MOBILE_COLS = ['Team Icon', 'Match Win', 'Match Loss', 'Diff', 'Next'];
//const MOBILE_STAGE_COLS = ['Place', 'Team Icon', 'Team Name', 'Match Win', 'Match Loss', 'Win %', 'Game Wins', 'Game Loss', 'Diff'];

const styles = theme => ({
  root: {
    width: 'fit-content',
    minWidth: '100%'
  },
  table: {
    minWidth: 200,
  },
  tableRow: {
    height: '30px',
    cursor: 'pointer'
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  matchMark: {
    display: 'flex',
    width: '75px',
    height: '30px'
  },
  iconContainer: {
    margin: 'auto'
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

function SimpleTable(props) {
  const { classes, orderedTeams, selectedCols, setCols, stageSelected } = props;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StagePicker
          value={stageSelected}
          handleChange={(i) => props.history.push(`/stage/${i === 0 ? 'overview' : i}`)}
        />
        <TableMenu
          options={DEFAULT_COLS}
          selectedCols={selectedCols}
          selectCol={(option) => setCols(selectedCols.includes(option) ? without(selectedCols, option) : [...selectedCols, option])}
        />
      </div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {selectedCols.includes('Place') && <TableCell padding="dense">Place</TableCell>}
              {selectedCols.includes('Team Icon') &&
                <TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>Team</TableCell>
              }
              {selectedCols.includes('Team Name') && <TableCell></TableCell>}
              {selectedCols.includes('Match Win') &&
                <TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>Match Win</TableCell>
              }
              {selectedCols.includes('Match Loss') &&
                <TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>Match Loss</TableCell>
              }
              {selectedCols.includes('Win %') && <TableCell numeric>Win%</TableCell>}
              {selectedCols.includes('Past Matches') && <TableCell padding="dense">Past Matches</TableCell>}
              {selectedCols.includes('Game Wins') && <TableCell numeric>Game Win</TableCell>}
              {selectedCols.includes('Game Loss') && <TableCell numeric>Game Loss</TableCell>}
              {selectedCols.includes('Diff') &&
                <TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>Diff</TableCell>
              }
              {selectedCols.includes('Next') &&
                <TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>Next</TableCell>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {orderedTeams.map((team, index) => {
              const { ranking, pastMatches, futureMatches } = team;
              let diffColor;
              if (ranking.gameWin - ranking.gameLoss === 0) {
                diffColor = null
              } else {
                diffColor = (ranking.gameWin - ranking.gameLoss)> 0
                  ? classes.green
                  : classes.red
              }
              return (
                <TableRow
                  key={team.id}
                  className={classes.tableRow}
                  onClick={() => props.history.push(`/team/${team.abbreviatedName}`)}
                  >
                  {selectedCols.includes('Place') && <TableCell padding="dense">{`${index + 1}`}</TableCell>}
                  {selectedCols.includes('Team Icon') &&
                    <TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>
                      <img width={35} src={team.logo.main.png} alt={team.abbreviatedName}/>
                  </TableCell>}
                  {selectedCols.includes('Team Name') && <TableCell>{team.abbreviatedName}</TableCell>}
                  {selectedCols.includes('Match Win') &&
                    <TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>
                      {ranking.matchWin}
                  </TableCell>}
                  {selectedCols.includes('Match Loss') &&
                    <TableCell numeric padding="dense" classes={{ paddingDense: classes.paddingDense }}>
                      {ranking.matchLoss}
                  </TableCell>}
                  {selectedCols.includes('Win %') &&
                    <TableCell numeric>
                      {`${Math.round((ranking.matchWin * Math.pow(10, 1.00))/(ranking.matchWin + ranking.matchLoss) * Math.pow(10, 1.00))}`}
                  </TableCell>}
                  {selectedCols.includes('Past Matches') &&
                    <TableCell numeric padding="dense">
                      <div className={classes.matchMark}>
                        {pastMatches.map((match, i) =>
                          <div
                            key={i}
                            className={classes.flexMark}
                            style={{ backgroundColor: match ? 'rgb(112, 219, 112)' : 'rgb(219, 112, 112)' }}
                          />
                        )}
                      </div>
                  </TableCell>}
                  {selectedCols.includes('Game Wins') && <TableCell numeric>{ranking.gameWin}</TableCell>}
                  {selectedCols.includes('Game Loss') && <TableCell numeric>{ranking.gameLoss}</TableCell>}
                  {selectedCols.includes('Diff') &&
                    <TableCell
                      numeric
                      padding="dense" classes={{ paddingDense: classes.paddingDense }}
                      className={diffColor}>
                        {`${(ranking.gameWin - ranking.gameLoss)}`}
                  </TableCell>}
                  {selectedCols.includes('Next') &&
                    <TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>
                      <div className={classes.flexContainer}>
                        {futureMatches.map((match, i) =>
                          <div
                            key={i}
                            className={classes.iconContainer}
                            onClick={(e) => {}}>
                            <img width={35} src={match.logo.main.png} alt={match.abbreviatedName}/>
                          </div>
                        )}
                      </div>
                  </TableCell>}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withWidth(),
  withState('selectedCols', 'setCols',
    (props) => props.width === 'xs' ? MOBILE_COLS : DEFAULT_COLS
  ),
)(SimpleTable);
