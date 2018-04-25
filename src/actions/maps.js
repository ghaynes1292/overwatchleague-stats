import { fetchEndpoint } from './util';

export const actionTypes = {
  FETCH_MAPS: 'FETCH_MAPS',
}

export const fetchMaps = () => ({
  type: actionTypes.FETCH_MAPS,
  payload: fetchEndpoint('maps')
  .then(maps => maps.data)
})
