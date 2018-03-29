import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

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
    marginRight: '5%',
  },
  opponent: {
    gridArea: 'opponent',
    gridColumn: 1,
    gridRow: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: '5%',
  },
  teamImage: {
    maxWidth: '45px',
  },
};

function GameComponent(props) {
  const { classes, game, team, opponent, teamStats, opponentStats } = props;

  return (
    <Paper className={classes.root} elevation={4}>
      <div className={classes.gameThumbnail} style={{ backgroundImage: `url(${game.icon})`.replace(/(["])/, '') }}/>
      <div className={classes.gameDetails}>
        <Typography variant="subheading" gutterBottom>
          {`Game ${game.index + 1}`}
        </Typography>
        <Typography variant="subheading" gutterBottom>
          {game.mapName}
        </Typography>
      </div>
      <div className={classes.team}>
        <div style={{ backgroundColor: team.primaryColor }}>
          <img className={classes.teamImage} src={team.altLogo || team.mainLogo}/>
        </div>
        <Typography variant="subheading" gutterBottom>
          {team.abbreviatedName}
        </Typography>
        <Typography variant="subheading" gutterBottom>
          {`W: ${teamStats.wins} L: ${teamStats.losses} D: ${teamStats.draws}`}
        </Typography>
      </div>
      <div className={classes.opponent}>
        <div style={{ backgroundColor: opponent.primaryColor }}>
          <img className={classes.teamImage} src={opponent.altLogo || opponent.mainLogo}/>
        </div>
        <Typography variant="subheading" gutterBottom>
          {opponent.abbreviatedName}
        </Typography>
        <Typography variant="subheading" gutterBottom>
          {`W: ${opponentStats.wins} L: ${opponentStats.losses} D: ${opponentStats.draws}`}
        </Typography>
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
