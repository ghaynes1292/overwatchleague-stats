import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Typography from 'material-ui/Typography';

import { HealerIcon, FlexIcon, DpsIcon, TankIcon } from './RoleIcons';

const roleMap = {
  support: <HealerIcon />,
  flex: <FlexIcon />,
  offense: <DpsIcon />,
  tank: <TankIcon />,
}

const styles = theme => ({
  root: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 750,
  },
});

function TeamTooltip(props) {
  const { classes, team } = props;
  return (
    <Paper className={classes.root}>
      <Typography variant="headline" gutterBottom align="center">
        {team.name}
      </Typography>
      <GridList cellHeight={110} className={classes.gridList} cols={6}>
        {team.players.map(player => (
          <GridListTile key={player.id}>
            <img src={player.headshot} alt={player.name} />
            <GridListTileBar
              title={`${player.name}`}
              subtitle={<span>{player.nationality}</span>}
              actionIcon={roleMap[player.attributes.role]}
            />
          </GridListTile>
        ))}
      </GridList>
    </Paper>
  );
}

TeamTooltip.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TeamTooltip);
