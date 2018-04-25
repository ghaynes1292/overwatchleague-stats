import { combineReducers } from 'redux'
import standings from './standings'
import liveMatch from './liveMatch'
import maps from './maps'
import teams from './teams'
import schedule from './schedule'

export default combineReducers({
  standings,
  liveMatch,
  maps,
  teams,
  schedule,
})
