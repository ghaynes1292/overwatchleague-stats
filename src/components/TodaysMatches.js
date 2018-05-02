import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose } from 'recompose';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import find from 'lodash/find';
import filter from 'lodash/filter';
import moment from 'moment';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  game: {
    display: 'flex',
    minWidth: '100px',
    width: '150px',
  },
  gameTime: {
    display: 'flex',
    margin: 'auto',
  },
  liveIndicator: {
    animation: 'blinker 1.5s cubic-bezier(.5, 0, 1, 1) infinite alternate', color: 'red',
    paddingRight: '3px',
  }
};

function GameComponent(props) {
  const { classes, matches, liveMatch, teams, setMatch } = props;
  const currentMatch = liveMatch && liveMatch.liveMatch;
  console.log('props', props)
  return (
    <div className={classes.root}>
      {matches.map(match => {
        const team1 = find(teams, ['id', match.competitors[0].id])
        const team2 = find(teams, ['id', match.competitors[1].id])
        return (
          <Paper
            key={match.id}
            className={classes.game}
            onClick={() => setMatch(match, team1.id)}
            elevation={(currentMatch && match.id === currentMatch.id) ? 4 : 0}>
            <div style={{ backgroundColor: team1.colors.primary.color }}>
              <img width={35} src={(team1.logo.alt || team1.logo.main).png} alt={team1.abbreviatedName}/>
            </div>
            <div className={classes.gameTime}>
              {currentMatch && moment(currentMatch.startDateTS) < moment() && match.id === currentMatch.id
                ? [
                  <span className={classes.liveIndicator}>{'●'}</span>,
                  <Typography>
                    {currentMatch.scores[0].value} - {currentMatch.scores[1].value}
                  </Typography>
                ]
                : <Typography>
                  {moment(match.startDateTS).minutes(0).format('hh:mm A')}
                </Typography>
              }
            </div>
            <div style={{ backgroundColor: team2.colors.primary.color }}>
              <img width={35} src={(team2.logo.alt || team2.logo.main).png} alt={team2.abbreviatedName}/>
            </div>
          </Paper>
        )
      })}
    </div>
  );
}

GameComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  teams: state.teams.data,
  matches: filter(state.schedule.data, match => moment(match.startDateTS).isSame(moment(), 'day')),
  liveMatch: state.liveMatch.data,
})

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(GameComponent);
