import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import find from 'lodash/find';
import without from 'lodash/without';
import intersection from 'lodash/intersection';

import TeamDialog from './TeamDialog';
import TableMenu from './TableMenu';

const DEFAULT_COLUMNS = ['Place', 'Team Icon', 'Team Name', 'Match Win', 'Match Loss', 'Win %', 'Past Matches', 'Game Wins', 'Game Loss', 'Diff', 'Next'];

const MOBILE_COLS = ['Team Icon', 'Match Win', 'Match Loss', 'Diff', 'Next']

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

function SimpleTable(props) {
  const { classes, width, teams, maps, teamProp, setTeam, opponent, setOpponent, setMatchIndex, matchIndex, selectedCols, setCols } = props;
  console.log('width', width)
  return (
    <Paper className={classes.root}>
      <TableMenu
        options={DEFAULT_COLUMNS}
        selectedCols={selectedCols}
        selectCol={(option) => setCols(selectedCols.includes(option) ? without(selectedCols, option) : [...selectedCols, option])}
      />
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
                setOpponent(find(teams, ['id', team.nextMatches[matchIndex].competitor.id]))
              }}>
                {selectedCols.includes('Place') && <TableCell padding="dense">{index + 1}</TableCell>}
                {selectedCols.includes('Team Icon') &&
                  <TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>
                    <img width={35} src={team.mainLogo}/>
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
                    {Math.round((ranking.matchWin * Math.pow(10, 1.00))/(ranking.matchWin + ranking.matchLoss) * Math.pow(10, 1.00))}
                </TableCell>}
                {selectedCols.includes('Past Matches') &&
                  <TableCell numeric padding="dense">
                    <div className={classes.flexContainer}>
                      {completedMatches.slice(-6).map(match =>
                        <div
                          key={match.id}
                          className={classes.flexMark}
                          style={{ backgroundColor: match.winner ? 'rgb(112, 219, 112)' : 'rgb(219, 112, 112)' }}
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
                      {(ranking.gameWin - ranking.gameLoss)}
                </TableCell>}
                {selectedCols.includes('Next') &&
                  <TableCell padding="dense" classes={{ paddingDense: classes.paddingDense }}>
                    <div className={classes.flexContainer}>
                      {nextMatches.map((match, i) =>
                        <div key={match.startDate} onClick={(e) => {
                          setTeam(team)
                          setOpponent(find(teams, ['id', team.nextMatches[i].competitor.id]))
                          setMatchIndex(i);
                          e.stopPropagation();
                        }}>
                          <img width={35} src={match.competitor.icon}/>
                        </div>
                      )}
                    </div>
                </TableCell>}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TeamDialog
        team={teamProp || {}}
        opponent={opponent || {}}
        otherOpponent={teamProp && find(teams, ['id', teamProp.nextMatches[matchIndex === 0 ? 1 : 0].competitor.id])}
        open={!!teamProp}
        matchIndex={matchIndex}
        handleClose={() => setTeam(null)}
        handleNextMatch={() => {
          setMatchIndex(1);
          setOpponent(find(teams, ['id', teamProp.nextMatches[1].competitor.id]));
        }}
        handlePrevMatch={() => {
          setMatchIndex(0);
          setOpponent(find(teams, ['id', teamProp.nextMatches[0].competitor.id]));
        }}
        width={width}
        maps={maps}
        size={width}
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
  withState('matchIndex', 'setMatchIndex', 0),
  withState('selectedCols', 'setCols',
    (props) => props.width === 'xs' ? MOBILE_COLS : DEFAULT_COLUMNS
  ),
)(SimpleTable);
