import { connect } from 'react-redux'
import TeamTable from '../components/TeamTable'
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import { getTeamFromTeams, getTeamMatches, getCompetetor } from '../util';

function pastAndFutureMatches(team, schedule, teams) {
  const teamMatches = getTeamMatches(schedule, team.id)

  return {
    pastMatches: filter(teamMatches, ['state', 'CONCLUDED'])
      .slice(-6)
      .map(match => match.winner.id === team.id),
    futureMatches: filter(teamMatches, ['state', 'PENDING'])
      .slice(0, 2)
      .map(match => ({ ...getCompetetor(teams, match, team.id), matchId: match.id }))
  }
}

function stageMapper(stage, standings, teams, schedule) {
  const teamRankings = stage === 'overview'
    ? orderBy(standings.overall, ['ranking.matchWin', 'ranking.gameWin'], ['desc', 'desc'])
    : orderBy(standings[`stage${stage}`], ['ranking.matchWin', 'ranking.gameWin'], ['desc', 'desc'])
  return teamRankings.map(team => ({
    ...team,
    ...getTeamFromTeams(teams, team.id),
    ...pastAndFutureMatches(team, schedule, teams)
  }))
}

const mapStateToProps = (state, ownProps) => ({
  orderedTeams: stageMapper(ownProps.stage, state.standings.data, state.teams.data, state.schedule.data),
  standings: state.standings.data,
  maps: state.maps.data,
  schedule: state.schedule.data,
  stageSelected: ownProps.stage === 'overview' ? 0 : parseInt(ownProps.stage, 10)
})

export default connect(
  mapStateToProps
)(TeamTable);
