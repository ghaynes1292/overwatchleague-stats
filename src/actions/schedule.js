import { fetchEndpoint } from './util';

export const actionTypes = {
  FETCH_SCHEDULE: 'FETCH_SCHEDULE',
}

export const fetchSchedule = () => ({
  type: actionTypes.FETCH_SCHEDULE,
  payload: fetchEndpoint('schedule')
    .then(schedule => (
      schedule.data.stages
      .slice(1)
      .reduce((acc, stage) => ([
        ...acc,
        ...stage.matches.filter(match => match.conclusionStrategy === 'MINIMUM')
      ]), []))
    )
})
