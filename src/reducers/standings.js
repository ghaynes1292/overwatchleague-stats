import { actionTypes } from '../actions/standings';

const initialState = {
  status: 'FINISHED',
  data: {
    overall: [],
    stage1: [],
    stage2: [],
    stage3: [],
    stage4: [],
  }
}

const ACTION_HANDLERS = {
  [`${actionTypes.FETCH_STANDINGS}_PENDING`]: state => ({
    ...state,
    status: 'PENDING',
  }),
  [`${actionTypes.FETCH_STANDINGS}_FULFILLED`]: (state, action) => ({
    status: 'SUCCESS',
    data: action.payload,
  }),
};
export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
};
