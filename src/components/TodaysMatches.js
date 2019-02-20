import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import GridList, { GridListTile } from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

import { fetchSchedule } from '../actions/schedule';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  game: {
    display: 'flex',
  },
  gameTime: {
    display: 'flex',
    margin: 'auto',
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    color: 'white'
  },
  liveIndicator: {
    animation: 'blinker 1.5s cubic-bezier(.5, 0, 1, 1) infinite alternate', color: 'red',
    paddingRight: '3px',
  }
};

function GameComponent(props) {
  const { classes, matches, liveMatch, teams } = props;
  const currentMatch = liveMatch && liveMatch.liveMatch;

  const renderPrevMatch = (match) => (<Typography>
    {match.scores[0].value} - {match.scores[1].value}
  </Typography>)
  const renderOngoingMatch = (currentMatch) => [
    <span key="live-indicator" className={classes.liveIndicator}>{'●'}</span>,
    <Typography key="text">
      {currentMatch.scores[0].value} - {currentMatch.scores[1].value}
    </Typography>
  ];
  const renderFutureMatch = (match) => (<Typography>
    {moment(match.startDateTS).minutes(0).format('MM/DD h A')}
  </Typography>)
  return (
    <GridList
      id="matches_list"
      cellHeight={50}
      className={classes.gridList}
      cols={3}>
      {matches.map(match => {
        const team1 = find(teams, ['id', match.competitors[0].id])
        const team2 = find(teams, ['id', match.competitors[1].id])
        return (
          <GridListTile
            key={match.id}
            id={`match_${match.id}`}
            classes={{ imgFullWidth: classes.imageTile }}
          >
            <Paper
              key={match.id}
              className={classes.game}
              onClick={() => props.history.push(`/team/${team1.abbreviatedName}/${match.id}`)}
              elevation={(currentMatch && match.id === currentMatch.id) ? 4 : 0}>
              <div style={{ backgroundColor: team1.colors.primary.color }}>
                <img width={35} src={(team1.logo.alt || team1.logo.main).png} alt={team1.abbreviatedName}/>
              </div>
              <div className={classes.gameTime}>
                {currentMatch && moment(match.startDateTS) < moment()
                  ? currentMatch.id === match.id ? renderOngoingMatch(currentMatch) : renderPrevMatch(match)
                  : renderFutureMatch(match)
                }
              </div>
              <div style={{ backgroundColor: team2.colors.primary.color }}>
                <img width={35} src={(team2.logo.alt || team2.logo.main).png} alt={team2.abbreviatedName}/>
              </div>
            </Paper>
          </GridListTile>
        )
      })}
    </GridList>
  );
}

GameComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  teams: state.teams.data,
  matches: state.schedule.data,
  liveMatch: state.liveMatch.data,
});

const mapDispatchToProps = {
  fetchSchedule
};

function componentDidMount() {
  this.props.fetchSchedule()
  .then(resp => {
    const todaysMatches = filter(resp.value, (match) => match.state !== 'CONCLUDED' && moment(match.startDateTS).isSame(moment(), 'week'));
    if (!isEmpty(todaysMatches)) {
      var myElement = document.getElementById(`match_${todaysMatches[0].id}`);
      var topPos = myElement.offsetLeft;
      document.getElementById('matches_list').scrollLeft = topPos;
    }
  })
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({ componentDidMount }),
  withStyles(styles),
  withWidth(),
)(GameComponent);
