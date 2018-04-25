import { fetchEndpoint } from './util';

export const actionTypes = {
  FETCH_TEAMS: 'FETCH_TEAMS',
}

export const fetchTeams = () => ({
  type: actionTypes.FETCH_TEAMS,
  payload: fetchEndpoint('v2/teams?expand=team.content')
  .then(teams => teams.data)
})
