import { fetchEndpoint } from './util';

export const actionTypes = {
  FETCH_LIVE_MATCH: 'FETCH_LIVE_MATCH',
}

export const fetchLiveMatch = () => ({
  type: actionTypes.FETCH_LIVE_MATCH,
  payload: fetchEndpoint('live-match')
  .then(liveMatch => liveMatch.data)
})
