import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import find from 'lodash/find';
import get from 'lodash/get';

const styles = {
  root: {
    flex: '1 0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 30%',
    gridTemplateRows: '40px 1fr 1fr',
    gridTemplateAreas: "'details details' 'team thumbnail' 'opponent thumbnail'",
    margin: '20px 10px',
  },
  gameThumbnail: {
    gridArea: 'thumbnail',
    gridColumn: 2,
    gridRow: '2/span 2',
    backgroundSize: 'cover',
    backgroundPosition: '50% 50%',
  },
  gameDetails: {
    gridArea: 'details',
    gridColumn: '1/span 2',
    gridRow: '2/span 2',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 3%',
  },
  team: {
    gridArea: 'team',
    gridColumn: 1,
    gridRow: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: '2%',
  },
  opponent: {
    gridArea: 'opponent',
    gridColumn: 1,
    gridRow: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: '2%',
  },
  teamImage: {
    maxWidth: '45px',
  },
  minTextWidth: {
    minWidth: '110px',
  },
  gameScore: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  }
};

function generateShadow(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const uicolors = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
  const newColors = uicolors.map((color, _, colors) => color === Math.max.apply(null, colors) ? Math.round(color * 1.5) : color)
  const colorRgb = `${newColors[0]}, ${newColors[1]}, ${newColors[2]}`
  return `0px 6px 13px -6px rgba(${colorRgb}, 0.5),
  0px 10px 10px 3px rgba(${colorRgb}, 0.3),
  0px 8px 12px 7px rgba(${colorRgb}, 0.12)`;
}

function GameComponent(props) {
  const { classes, game, team, opponent, teamStats, opponentStats } = props;
  const winner = get(find(game.team, ['id', game.id]), 'winner', null)
  return (
    <Paper className={classes.root} elevation={20} style={{ boxShadow: generateShadow(winner !== null ? winner ? team.colors.primary.color : opponent.colors.primary.color : '#000000')}}>
      <div className={classes.gameThumbnail} style={{ backgroundImage: `url(${game.icon})`.replace(/(["])/, '') }}/>
      <div className={classes.gameDetails}>
        <Typography variant="subheading" gutterBottom>
          {`Game ${game.index + 1}`}
        </Typography>
        <Typography variant="subheading" gutterBottom align="right" className={classes.minTextWidth}>
          {game.mapName}
        </Typography>
      </div>
      <div className={classes.team}>
        <div style={{ backgroundColor: team.colors.primary.color }}>
          <img className={classes.teamImage} src={(team.logo.alt || team.logo.main).png}/>
        </div>
        <div className={classes.gameScore}>
          <Typography variant="subheading" gutterBottom>{`W: ${teamStats.wins}`}</Typography>
          <Typography variant="subheading" gutterBottom>{`L: ${teamStats.losses}`}</Typography>
          <Typography variant="subheading" gutterBottom>{`D: ${teamStats.draws}`}</Typography>
        </div>
      </div>
      <div className={classes.opponent}>
        <div style={{ backgroundColor: opponent.colors.primary.color }}>
          <img className={classes.teamImage} src={(opponent.logo.alt || opponent.logo.main).png}/>
        </div>
        <div className={classes.gameScore}>
          <Typography variant="subheading" gutterBottom>{`W: ${opponentStats.wins}`}</Typography>
          <Typography variant="subheading" gutterBottom>{`L: ${opponentStats.losses}`}</Typography>
          <Typography variant="subheading" gutterBottom>{`D: ${opponentStats.draws}`}</Typography>
        </div>
      </div>
    </Paper>
  );
}

GameComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
)(GameComponent);
