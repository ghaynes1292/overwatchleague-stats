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
    width: '225px',
    height: '60px',
    margin: 'auto'
  },
  typography: {
    margin: 'auto'
  }
};

function NextMatch(props) {
  const { classes, team, timer } = props;
  return (
    <Paper elevation={4} className={classes.root}>
      <img width={35} src={team.icon}/>
      <Typography variant="headline" gutterBottom align="center" className={classes.typography}>
        {timer.to(moment(team.nextMatches && team.nextMatches[0].startDate))}
      </Typography>
      <img width={35} src={team.nextMatches && team.nextMatches[0].competitor.icon}/>
    </Paper>
  );
}

NextMatch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withState('timer', 'setTimer', moment()),
  lifecycle({
    componentDidMount() {
      this.interval = setInterval(
        () => this.props.setTimer(moment()),
        1000
      )
    },
    componentWillUnmount() {
      clearInterval(this.interval)
    },
  }),
)(NextMatch);
