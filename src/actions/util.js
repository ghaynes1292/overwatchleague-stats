const OWL_API_URL = 'https://api.overwatchleague.com'

export const fetchEndpoint = (endpoint, options) =>
  fetch(`${OWL_API_URL}/${endpoint}`)
  .then(resp => resp.json())
  .then(resp => ({ status: 'SUCCESS', data: resp.data || resp }))
  .catch(error => ({ status: 'FAILURE', data: error }))
