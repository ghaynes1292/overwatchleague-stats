import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
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
    paddingTop: '15px',
    paddingBottom: '15px',
    paddingLeft: '2%',
    paddingRight: '2%',
    gridColumnGap: '20px',
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gridArea: 'team',
    gridColumn: 1,
    alignItems: 'center',
  },
  opponentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gridArea: 'opponent',
    gridColumn: 3,
    alignItems: 'center',
  },
  teamTitle: {
    flex: '2 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  teamScore: {
    flex: '1 0 auto'
  },
  teamImage: {
    maxWidth: '60px',
  },
  gameStatus: {
    margin: 'auto',
    gridArea: 'status',
    gridColumn: 2,
    padding: '1% 2%',
  }
};

function NextMatch(props) {
  const { classes, team, opponent, size } = props;

  return (
    <div className={classes.headerContainer}>
      <div className={classes.headerTeam} style={{ backgroundColor: team.primaryColor }}/>
      <div className={classes.headerOpponent} style={{ backgroundColor: opponent.primaryColor }}/>
      <div className={classes.headerGameContainer}>
        <div className={classes.teamHeader}>
          <div className={classes.teamTitle} style={{ flexDirection: size === 'xs' ? 'column' : 'row' }}>
            <img className={classes.teamImage} src={team.altLogo || team.mainLogo}/>
            <Typography variant="title" gutterBottom>
              {size === 'xs' ? team.abbreviatedName : team.name}
            </Typography>
          </div>
          <div className={classes.teamScore}>
            <Typography variant="title" align="center" gutterBottom>
            </Typography>
          </div>
        </div>
        <div className={classes.opponentHeader}>
          <div className={classes.teamScore}>
            <Typography variant="title" align="center" gutterBottom>
            </Typography>
          </div>
          <div className={classes.teamTitle} style={{ flexDirection: size === 'xs' ? 'column' : 'row-reverse' }}>
            <img className={classes.teamImage} src={opponent.altLogo || opponent.mainLogo}/>
            <Typography variant="title" gutterBottom>
              {size === 'xs' ? opponent.abbreviatedName : opponent.name}
            </Typography>
          </div>
        </div>
        <Paper elevation={4} className={classes.gameStatus}>
          <Typography variant="headline" gutterBottom align="center" className={classes.typography}>
            {moment(team.nextMatches && team.nextMatches[0].startDate).startOf('hour').format('ddd hh:MM')}
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
