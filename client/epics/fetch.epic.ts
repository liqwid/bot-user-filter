import { Store } from 'redux'
import { ofType, Epic } from 'redux-observable'

import { of } from 'rxjs'
import { AjaxResponse } from 'rxjs/ajax'
import { filter, switchMap, map, tap, catchError, debounceTime } from 'rxjs/operators'

import restApi from 'services/restApi'
import { FetchAction, FetchUpdateAction, ErrorAction, createUpdateAction, createErrorAction,
  FETCH, FETCH_NEXT_PAGE, FETCH_PREVIOUS_PAGE, SEARCH, UPDATE, ERROR } from 'actions/fetch.actions'

export const DEBOUNCE_TIME = 500

/**
 * Creates a fetch epic that cancels previous fetch requests
 * Thus there should be 1 fetch epic per resource: users fetch epic, 
 * @param fetchActionTypes - fetch, update and error action type constant for a target resource
 */
export function createFetchEpic<Model>(
  scope?: string
): Epic<FetchUpdateAction<Model> | ErrorAction | FetchAction, Store> {
  return (action$) => action$.pipe(
    scope ? filter((action) => action.scope === scope) : tap(),
    ofType(FETCH, FETCH_NEXT_PAGE, FETCH_PREVIOUS_PAGE, SEARCH),
    debounceTime(DEBOUNCE_TIME),
    /**
     * Cancels previous pending fetch
     */
    switchMap(({ payload: { url, concatType }, type }: FetchAction) =>
      restApi.get({ url }).pipe(
        /**
         * Triggers update action after fetch
         */
        map(({ response }: AjaxResponse) => createUpdateAction<Model>(UPDATE, response, concatType, scope)),
        /**
         * Triggers error action on fetch error
         */
        catchError((error) => of(createErrorAction(ERROR, error, scope)))
      )
    ),
  )
}
