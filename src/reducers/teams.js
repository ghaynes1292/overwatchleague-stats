import { actionTypes } from '../actions/teams';

const initialState = {
  status: 'FINISHED',
  data: []
}

const ACTION_HANDLERS = {
  [`${actionTypes.FETCH_TEAMS}_PENDING`]: state => ({
    ...state,
    status: 'PENDING',
  }),
  [`${actionTypes.FETCH_TEAMS}_FULFILLED`]: (state, action) => ({
    status: 'SUCCESS',
    data: action.payload,
  }),
};
export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
};
