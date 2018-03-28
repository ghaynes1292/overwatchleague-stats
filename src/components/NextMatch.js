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
  }
};

function NextMatch(props) {
  const { classes, team } = props;
  return (
    <Paper elevation={4} className={classes.root}>
      <img width={40} src={team.icon}/>
      <Typography variant="headline" gutterBottom align="center" className={classes.typography}>
        {moment(team.nextMatches && team.nextMatches[0].startDate).startOf('hour').format('ddd hh:MM A')}
      </Typography>
      <img width={40} src={team.nextMatches && team.nextMatches[0].competitor.icon}/>
    </Paper>
  );
}

NextMatch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
)(NextMatch);
