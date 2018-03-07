import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import GridList, { GridListTile } from 'material-ui/GridList';
import Typography from 'material-ui/Typography';

import find from 'lodash/find';
import moment from 'moment';

const styles = theme => ({
  root: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 450,
  },
});

function MatchTooltip(props) {
  const { classes, match, maps } = props;

  return (
    <Paper className={classes.root}>
      <Typography variant="headline" gutterBottom>
        Game Time: {moment(match.startDate).format('MM/DD/YY hh:MM a')}
      </Typography>
      <GridList cellHeight={100} className={classes.gridList} cols={4}>
        {match.games.map(game => (
          <GridListTile key={game.id} cols={1}>
            <img src={find(maps, ['id', game.maps]).thumbnail} />
          </GridListTile>
        ))}
      </GridList>
    </Paper>
  );
}

MatchTooltip.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MatchTooltip);
