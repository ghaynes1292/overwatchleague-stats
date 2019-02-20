import { fetchEndpoint } from './util';

export const actionTypes = {
  FETCH_SCHEDULE: 'FETCH_SCHEDULE',
}

export const fetchSchedule = () => ({
  type: actionTypes.FETCH_SCHEDULE,
  payload: fetchEndpoint('schedule', { season: '2019' })
    .then(schedule => (
      schedule.data.stages
      .reduce((acc, stage) => ([
        ...acc,
        ...stage.matches.filter(match => match.conclusionStrategy === 'MINIMUM')
      ]), []))
    )
})
