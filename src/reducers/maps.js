import { actionTypes } from '../actions/maps';

const initialState = {
  status: 'FINISHED',
  data: []
}

const ACTION_HANDLERS = {
  [`${actionTypes.FETCH_MAPS}_PENDING`]: state => ({
    ...state,
    status: 'PENDING',
  }),
  [`${actionTypes.FETCH_MAPS}_FULFILLED`]: (state, action) => ({
    status: 'SUCCESS',
    data: action.payload,
  }),
};
export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
};
