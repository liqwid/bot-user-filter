import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { compose, createStore, applyMiddleware, combineReducers } from 'redux'
import * as reducers from 'reducers'
import * as epics from 'epics'
import { FetchableState, PageableState } from 'models/fetch.model'
import { User } from 'models/user.model'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const epicMiddleware = createEpicMiddleware(combineEpics(...Object.values(epics)))
const reducer = combineReducers({ ...reducers })
const middlewares = composeEnhancers(applyMiddleware(epicMiddleware))

export interface AppState {
  users: FetchableState<User> & PageableState  
}

export const store = createStore(
  reducer,
  middlewares
)
