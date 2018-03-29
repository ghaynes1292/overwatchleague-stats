import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, lifecycle } from 'recompose';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import moment from 'moment';

const styles = {
  root: {
    display: 'flex',
    width: '300px',
    height: '50px',
    margin: 'auto'
  },
  typography: {
    margin: 'auto'
  },
  headerContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '2fr',
  },
  headerTeam: {
    gridColumn: 1,
    gridRow: 1,
  },
  headerOpponent: {
    gridColumn: 2,
    gridRow: 1,
  },
  headerGameContainer: {
    display: 'grid',
    gridColumn: '1/span 2',
    gridRow: 1,
    gridTemplateColumns: '1fr minmax(min-content,max-content) 1fr',
    gridTemplateRows: '1fr',
    gridTemplateAreas: 'team status opponent',
    paddingTop: '8px',
    paddingBottom: '8px',
    gridColumnGap: '20px',
  },
  teamScore: {
    gridArea: 'team',
    gridColumn: 1,
    margin: 'auto'
  },
  opponentScore: {
    gridArea: 'opponent',
    gridColumn: 3,
    margin: 'auto'
  },
  gameStatus: {
    margin: 'auto',
    gridArea: 'status',
    gridColumn: 2,
  }
};

function NextMatch(props) {
  const { classes, team, opponent } = props;
  console.log('team, opponent', team, opponent)
  return (
    <div className={classes.headerContainer}>
      <div className={classes.headerTeam} style={{ backgroundColor: team.primaryColor }}/>
      <div className={classes.headerOpponent} style={{ backgroundColor: opponent.primaryColor }}/>
      <div className={classes.headerGameContainer}>
        <div className={classes.teamScore}>
          <img width={40} src={team.altLogo || team.mainLogo}/>
        </div>
        <div className={classes.opponentScore}>
          <img width={40} src={opponent.altLogo || opponent.mainLogo}/>
        </div>
        <Paper elevation={4} className={classes.gameStatus}>
          <Typography variant="headline" gutterBottom align="center" className={classes.typography}>
            {moment(team.nextMatches && team.nextMatches[0].startDate).startOf('hour').format('ddd hh:MM A')}
          </Typography>
        </Paper>
      </div>
    </div>
  );
}

NextMatch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
)(NextMatch);
