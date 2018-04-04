import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';

import omit from 'lodash/omit';
import pick from 'lodash/pick';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import find from 'lodash/find';
import compact from 'lodash/compact';
import moment from 'moment';

import withRoot from '../withRoot';
import { teamFields, playerFields, scheduleFields, competitorFields, gameFields, teamsNumbers } from '../util';

import TeamTable from '../components/TeamTable';

const OWL_API_URL = 'https://api.overwatchleague.com'

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

const getCompletedMatches = (team) =>
  orderBy(filter(team.schedule, ({ state, conclusionStrategy }) => state === 'CONCLUDED' && conclusionStrategy === 'MINIMUM'), ['startDate'], ['asc'])
  .map(game => {
    return ({
      ...pick(game, ['competitors', 'games', 'startDate', 'endDate', 'id', 'scores', 'bracket']),
      winner: team.id === game.winner.id
    })
  })

const getNextMatches = (team) =>
  orderBy(filter(team.schedule, ['state', 'PENDING']), ['startDate'], ['asc'])
  .slice(0, 4)
  .map(game => {
    return ({
      competitor: find(game.competitors, (competitor) => competitor.id !== team.id),
      games: game.games.map(({ attributes, players, id, state }) => ({ maps: attributes.map, players, id, state })),
      startDate: game.startDate,
    })
  })

const getTeamContent = (team) => {
  if (!team.content) {
    return {}
  }
  return {
    primaryColor: find(team.content.colors, ['usage', 'primary']).color.color,
    secondaryColor: find(team.content.colors, ['usage', 'secondary']).color.color,
    tertiaryColor: find(team.content.colors, ['usage', 'tertiary']).color.color,
    mainLogo: find(team.content.icons, ['usage', 'main']).png,
    altLogo: find(team.content.icons, ['usage', 'alt']) && find(team.content.icons, ['usage', 'alt']).png,
    nameLogo: find(team.content.icons, ['usage', 'mainName']).png,
  }
}

const fetchEndpoint = (endpoint) =>
  fetch(`${OWL_API_URL}/${endpoint}`)
  .then(resp => resp.json())

class Index extends React.Component {
  state = {
    open: false,
    teams: [],
    maps: [],
    lastFetchedTime: null,
    backgroundLoading: false
  };

  async componentWillMount() {
    this.setState({
      loading: true,
      backgroundLoading: true,
      loadingText: 'Loading the most up to date stats...',
    })
    new Promise(resolve => setTimeout(() => this.setState({ loadingText: 'There really is a lot of data...'}), 2200));
    new Promise(resolve => setTimeout(() => this.setState({ loadingText: 'Every visit after this is instantaneous!'}), 6000));
    const localTeams = teamsNumbers.map((num) => JSON.parse(localStorage.getItem(num)));
    const lastFetchedTime = localStorage.getItem('lastFetchedTime')
    this.setState({
      loading: false,
      teams: compact(localTeams),
      lastFetchedTime,
    })
    fetchEndpoint('teams').then(teams => {
      Promise.all(teams.competitors.map(competitor =>
        fetchEndpoint(`team/${competitor.competitor.id}?expand=team.content&locale=en_US`)
        .then(team => omit(team, ['attributes', 'advantage', 'aboutUrl', 'accounts', 'availableLanguages']))
      )).then(teams => {
        const trimmedTeams = teams.map(team => ({
          ...pick(team, teamFields),
          ...getTeamContent(team),
          players: team.players.map(player => pick(player, playerFields)),
          schedule: team.schedule.map(game => ({
            ...pick(game, scheduleFields),
            competitors: game.competitors.map(competitor => pick(competitor, competitorFields)),
            games: game.games.map(game => pick(game, gameFields)),
          })),
        }))
        const time = moment().format('DD/MM/YYYY HH:MM:SS')
        trimmedTeams.map((team, index) => { localStorage.setItem(`team${index}`, JSON.stringify(team)); })
        localStorage.setItem('lastFetchedTime', time);
        this.setState({ teams: trimmedTeams, backgroundLoading: false, lastFetchedTime: time })
      })
    });
    fetchEndpoint('maps').then(maps => {
      this.setState({ maps })
    });
    fetchEndpoint('v2/standings?locale=en_US')
    .then((standings) => {
      const stages = standings.data.reduce((acc, value) => ({
        stage1: [...acc.stage1, { ...value, ranking: value.stages.stage1 }],
        stage2: [...acc.stage2, { ...value, ranking: value.stages.stage2 }],
        stage3: [...acc.stage3, { ...value, ranking: value.stages.stage3 }],
        stage4: [...acc.stage4, { ...value, ranking: value.stages.stage4 }],
      }), { stage1: [], stage2: [], stage3: [], stage4: [] });
      this.setState({ standings: stages })
    })
  }

  render() {
    const { classes } = this.props;
    const { teams, maps, loading, loadingText, lastFetchedTime, backgroundLoading, standings } = this.state;
    const newTeams = teams.map(team => ({
      ...team,
      completedMatches: getCompletedMatches(team),
      nextMatches: getNextMatches(team),
    }))
    const orderedTeams = orderBy(newTeams, ['ranking.matchWin', 'ranking.gameWin'], ['desc', 'desc']);
    return (
      <div className={classes.root}>
        {loading || teams.length === 0
          ? <div>
            <Typography variant="headline" gutterBottom align="center">
              {loadingText}
            </Typography>
            <CircularProgress className={classes.progress} size={50} />
          </div>
          : <div>
              <div className={classes.flex}>
                <Typography variant="body1" align="left" className={classes.typography}>
                  {backgroundLoading && 'Updating in background...'}
                </Typography>
                <Typography variant="body1" align="right" className={classes.typography}>
                  Last Updated:{lastFetchedTime}
                </Typography>
              </div>
              <TeamTable teams={orderedTeams} maps={maps} collapsedIndex={1} standings={standings}/>
          </div>
        }
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
