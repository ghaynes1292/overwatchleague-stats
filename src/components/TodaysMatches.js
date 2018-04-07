import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import find from 'lodash/find';
import some from 'lodash/some';
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
  const { classes, matches, liveMatch, teams } = props;
  console.log(props)
  return (
    <div className={classes.root}>
      {matches.map(match => {
        const team1 = find(teams, ['id', match.competitors[0].id])
        const team2 = find(teams, ['id', match.competitors[1].id])
        return (
          <Paper key={match.id} className={classes.game} elevation={(liveMatch && match.id === liveMatch.id) ? 4 : 0}>
            <div style={{ backgroundColor: team1.colors.primary.color }}>
              <img width={35} src={team1.logo.main.png}/>
            </div>
            <div className={classes.gameTime}>
              <span className={classes.liveIndicator}>{(liveMatch && match.id === liveMatch.id) && '●'}</span>
              <Typography>
                {moment(match.startDateTS).isBefore(moment()) || (liveMatch && match.id === liveMatch.id)
                  ? `${liveMatch.scores[0].value || match.scores[0].value} - ${liveMatch.scores[1].value || match.scores[1].value}`
                  : moment(match.startDateTS).minutes(0).format('hh:mm A')
                }
              </Typography>
            </div>
            <div style={{ backgroundColor: team2.colors.primary.color }}>
              <img width={35} src={(team2.logo.alt || team2.logo.main).png}/>
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

export default compose(
  withStyles(styles),
)(GameComponent);