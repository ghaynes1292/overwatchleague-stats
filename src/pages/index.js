import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

import omit from 'lodash/omit';
import pick from 'lodash/pick';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';

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

const mapTeamGames = (team) =>
  orderBy(filter(team.schedule, ['state', 'CONCLUDED']), ['startDate'], ['asc'])
  .map(game => {
    return ({
      ...pick(game, ['competitors', 'games', 'startDate', 'endDate', 'id', 'scores', 'bracket']),
      winner: team.id === game.winner.id
    })
  })

const fetchEndpoint = (endpoint) =>
  fetch(`${OWL_API_URL}/${endpoint}`)
  .then(resp => resp.json())

class Index extends React.Component {
  state = {
    open: false,
    teams: [],
  };

  async componentDidMount() {
    this.setState({
      loading: true
    })
    const teamContent = await fetchEndpoint('teams');
    const teams = await Promise.all(teamContent.competitors.map(competitor =>
      fetchEndpoint(`team/${competitor.competitor.id}`)
      .then(team => omit(team, ['attributes', 'advantage', 'aboutUrl', 'accounts', 'availableLanguages']))
    ))
    this.setState({
      teams,
      loading: false
    })
  }

  render() {
    const { classes } = this.props;
    const { teams, loading } = this.state;
    const newTeams = teams.map(team => ({
      ...team,
      completedMatches: mapTeamGames(team)
    }))
    const orderedTeams = orderBy(newTeams, ['ranking.matchWin', 'ranking.gameWin'], ['desc', 'desc']);
    return (
      <div className={classes.root}>
        {loading
          ? <CircularProgress className={classes.progress} size={50} />
          : <TeamTable teams={orderedTeams} />
        }

      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
