import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

import omit from 'lodash/omit';
import pick from 'lodash/pick';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import find from 'lodash/find';

import withRoot from '../withRoot';

import TeamTable from '../components/TeamTable';

const OWL_API_URL = 'https://api.overwatchleague.com'

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

const getCompletedMatches = (team) =>
  orderBy(filter(team.schedule, ['state', 'CONCLUDED']), ['startDate'], ['asc'])
  .map(game => {
    return ({
      ...pick(game, ['competitors', 'games', 'startDate', 'endDate', 'id', 'scores', 'bracket']),
      winner: team.id === game.winner.id
    })
  })

const getNextMatches = (team) =>
  orderBy(filter(team.schedule, ['state', 'PENDING']), ['startDate'], ['asc'])
  .slice(0, 2)
  .map(game => {
    return ({
      competitor: find(game.competitors, (competitor) => competitor.id !== team.id),
      games: game.games.map(({ attributes, players, id, state, stats }) => ({ maps: attributes.map, players, id, state, stats })),
      startDate: game.startDate,
    })
  })


const fetchEndpoint = (endpoint) =>
  fetch(`${OWL_API_URL}/${endpoint}`)
  .then(resp => resp.json())

class Index extends React.Component {
  state = {
    open: false,
    teams: [],
    maps: []
  };

  async componentDidMount() {
    this.setState({
      loading: true
    })
    const teamContent = await fetchEndpoint('teams');
    const maps = await fetchEndpoint('maps');
    const teams = await Promise.all(teamContent.competitors.map(competitor =>
      fetchEndpoint(`team/${competitor.competitor.id}`)
      .then(team => omit(team, ['attributes', 'advantage', 'aboutUrl', 'accounts', 'availableLanguages']))
    ))
    this.setState({
      teams,
      maps,
      loading: false
    })
  }

  render() {
    const { classes } = this.props;
    const { teams, maps, loading } = this.state;
    const newTeams = teams.map(team => ({
      ...team,
      completedMatches: getCompletedMatches(team),
      nextMatches: getNextMatches(team),
    }))
    const orderedTeams = orderBy(newTeams, ['ranking.matchWin', 'ranking.gameWin'], ['desc', 'desc']);
    return (
      <div className={classes.root}>
        {loading
          ? <CircularProgress className={classes.progress} size={50} />
          : <TeamTable teams={orderedTeams} maps={maps} />
        }

      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
