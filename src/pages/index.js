import React from 'react';
import PropTypes from 'prop-types';
import { compose, withStateHandlers } from 'recompose';
import moment from 'moment';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';

import filter from 'lodash/filter';

import withRoot from '../withRoot';
import TeamTable from '../components/TeamTable';
import TeamDialog from '../components/TeamDialog';
import TodaysMatches from '../components/TodaysMatches';

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

const fetchEndpoint = (endpoint) =>
  fetch(`${OWL_API_URL}/${endpoint}`)
  .then(resp => resp.json())
  .then(resp => ({ status: 'SUCCESS', data: resp }))
  .catch(error => ({ status: 'FAILURE', data: error }))

function fetchStandings() {
  return fetchEndpoint('v2/standings?locale=en_US')
  .then((standings) => {
    const stages = standings.data.data.reduce((acc, value) => ({
        overall: [...acc.overall, { id: value.id, ranking: value.league }],
        stage1: [...acc.stage1, { id: value.id, ranking: value.stages.stage1 }],
        stage2: [...acc.stage2, { id: value.id, ranking: value.stages.stage2 }],
        stage3: [...acc.stage3, { id: value.id, ranking: value.stages.stage3 }],
        stage4: [...acc.stage4, { id: value.id, ranking: value.stages.stage4 }],
      }), { overall: [], stage1: [], stage2: [], stage3: [], stage4: [] });
    return { ...standings, data: stages }
  })
}

function fetchTeams() {
  return fetchEndpoint('v2/teams?expand=team.content')
  .then(teams => {
    return { ...teams, data: teams.data.data }
  })
}

function fetchMaps() {
  return fetchEndpoint('maps')
  .then(maps => {
    return { ...maps, data: maps.data }
  })
}

function fetchSchedule() {
  return fetchEndpoint('schedule')
  .then(schedule => ({
      ...schedule,
      data: schedule.data.data.stages
      .slice(1)
      .reduce((acc, stage) => ([
        ...acc,
        ...stage.matches.filter(match => match.conclusionStrategy === 'MINIMUM')
      ]), [])
    })
  )
}

function fetchLiveMatch() {
  return fetchEndpoint('live-match')
  .then(liveMatch => ({
      ...liveMatch,
      data: liveMatch.data.data
    })
  )
}

class Index extends React.Component {
  state = {
    standings: {
      status: 'SUCCESS',
      data: {
        overall: [],
        stage1: [],
        stage2: [],
        stage3: [],
        stage4: [],
      }
    },
    teams: {
      status: 'SUCCESS',
      data: [],
    },
    maps: {
      status: 'SUCCESS',
      data: [],
    },
    schedule: {
      status: 'SUCCESS',
      data: [],
    },
    liveMatch: {
      status: 'SUCCESS',
      data: [],
    },
    lastFetchedTime: null,
    backgroundLoading: false
  };

  async componentWillMount() {
    this.setState({
      loading: true,
      backgroundLoading: true,
    });
    const [standings, teams] = await Promise.all([fetchStandings(), fetchTeams()]);
    this.setState({ standings, teams, loading: false });
    const [maps, schedule, liveMatch] = await Promise.all([fetchMaps(), fetchSchedule(), fetchLiveMatch()]);
    this.setState({ maps, schedule, liveMatch });
  }


  render() {
    const { classes, width, open, team, match, toggleDialog, setTeam, setMatch } = this.props;
    const { teams, maps, standings, schedule, liveMatch, loading } = this.state;

    return (
      <div className={classes.root}>
        {loading || teams.length === 0
          ? <div>
            <Typography variant="headline" gutterBottom align="center">
              Loading the most up to date stats...
            </Typography>
            <CircularProgress className={classes.progress} size={50} />
          </div>
          : <div>
              {schedule.status === 'SUCCESS' && (
                <TodaysMatches
                  teams={teams.data}
                  matches={filter(schedule.data, match => moment(match.startDateTS).isSame(moment(), 'day'))}
                  liveMatch={liveMatch.data.liveMatch}
                  setMatch={setMatch}
                />
              )}
              <TeamTable
                teams={teams.data}
                maps={maps.data}
                standings={standings.data}
                schedule={schedule.data}
                width={width}
                selectTeam={setTeam}
                selectMatch={setMatch}
              />
              <TeamDialog
                team={team}
                match={match}
                teams={teams.data}
                schedule={schedule.data}
                maps={maps.data}
                open={open}
                handleClose={toggleDialog}
                setMatch={setMatch}
                width={width}
              />
          </div>
        }
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

const IndexComponent = compose(
  withStyles(styles),
  withStateHandlers(() => ({ open: false, team: null, match: null }),
  {
    toggleDialog: ({ open }) => () => ({ open: !open, team: null, match: null }),
    setTeam: () => (team) => ({ team, open: true }),
    setMatch: () => (match, team) => ({ match, team, open: true }),
  }),
  withWidth(),
)(Index)

export default withRoot(IndexComponent);
