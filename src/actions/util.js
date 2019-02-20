import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import join from 'lodash/join';

const OWL_API_URL = 'https://api.overwatchleague.com'

export const fetchEndpoint = (endpoint, options) => {
  const params = map(options, (value, key) => `${key}=${value}`);
  const paramString = !isEmpty(params) ? `?${join(params, '&')}` : '';
  return fetch(`${OWL_API_URL}/${endpoint}${paramString}`, { cache: 'no-cache' })
  .then(resp => resp.json())
  .then(resp => ({ status: 'SUCCESS', data: resp.data || resp }))
  .catch(error => ({ status: 'FAILURE', data: error }))
}
