import { fetchEndpoint } from './util';

export const actionTypes = {
  FETCH_STANDINGS: 'FETCH_STANDINGS',
}

export const fetchStandings = () => ({
  type: actionTypes.FETCH_STANDINGS,
  payload: fetchEndpoint('v2/standings?locale=en_US')
    .then((standings) => {
      return standings.data.reduce((acc, value) => ({
          overall: [...acc.overall, { id: value.id, ranking: value.league }],
          stage1: [...acc.stage1, { id: value.id, ranking: value.stages.stage1 }],
          stage2: [...acc.stage2, { id: value.id, ranking: value.stages.stage2 }],
          stage3: [...acc.stage3, { id: value.id, ranking: value.stages.stage3 }],
          stage4: [...acc.stage4, { id: value.id, ranking: value.stages.stage4 }],
        }), { overall: [], stage1: [], stage2: [], stage3: [], stage4: [] });
    })
})
