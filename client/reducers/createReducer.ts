import { Reducer } from 'redux'

/**
 * Creates a reducer that handles actions from a hashmap and checks scope
 * @returns reducer 
 */
export function createReducer(
  initialState: any,

  /**
   * Handlers are action type - reducer pairs
   */
  handlers: { [key: string]: Reducer },
  
  /**
   * Scopes relate to the business entites: USER, BOT etc
   * that can share the same action types, e.g FETCH, SEARCH, UPDATE
   * 
   * When scope is not specified during reducer creation
   * All actions with no scope will match
   */
  scope?: string
): Reducer {
  return (state = initialState, action) => {
    if (action.scope !== scope) return state
    if (!handlers.hasOwnProperty(action.type)) return state

    return handlers[action.type](state, action.payload)
  }
}
