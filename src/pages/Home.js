/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose, withStateHandlers, lifecycle } from 'recompose';
import moment from 'moment';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';

import filter from 'lodash/filter';

import withRoot from '../withRoot';
import TeamTableContainer from '../containers/TeamTableContainer';
import TodaysMatches from '../components/TodaysMatches';

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  typography: {
    fontSize: '12px'
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

const Index = (props) => {
  const { classes, width, loading, todaysMatches, match } = props;
  return (
    <div className={classes.root}>
      {loading
        ? <div>
          <Typography variant="headline" gutterBottom align="center">
            Loading the most up to date stats...
          </Typography>
          <CircularProgress className={classes.progress} size={50} />
        </div>
        : <div>
            <TodaysMatches
              history={props.history}
            />
            <TeamTableContainer
              stage={props.match.params.stage}
              history={props.history}
            />
        </div>
      }
    </div>
  );
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  loading: state.standings.status === 'PENDING' || state.teams.status === 'PENDING',
});


const IndexComponent = compose(
  connect(mapStateToProps),
  withStyles(styles),
  withStateHandlers(() => ({ open: false, team: null, matchId: null, refresh: false }),
  {
    toggleDialog: ({ open }) => () => ({ open: !open, team: null, matchId: null }),
    setTeam: () => (team) => ({ team, open: true }),
    setMatch: () => (matchId, team) => ({ matchId, team, open: true }),
  }),
  withWidth(),
)(Index)

export default withRoot(IndexComponent);
