import { formatQueryParams } from 'services/queryParams'
import { createFetchAction, FETCH, FETCH_NEXT_PAGE, FETCH_PREVIOUS_PAGE, SEARCH } from 'actions/fetch.actions'
import { FetchOptions } from 'models/fetch.model'
import { USER_SCOPE, USERS_ENDPOINT } from 'models/user.model'

export function fetchUsers(options?: FetchOptions) {
  return createFetchAction(FETCH, { url: USERS_ENDPOINT, ...options }, USER_SCOPE)
}

export function fetchUsersNextPage(options?: Partial<FetchOptions>) {
  return createFetchAction(FETCH_NEXT_PAGE, { url: USERS_ENDPOINT, concatType: 'right', ...options }, USER_SCOPE)
}

export function fetchUsersPreviousPage(options?: Partial<FetchOptions>) {
  return createFetchAction(FETCH_PREVIOUS_PAGE, { url: USERS_ENDPOINT, concatType: 'left', ...options }, USER_SCOPE)
}

export function searchUsers({ queryParams, ...options }: Partial<FetchOptions>) {
  return createFetchAction(
    SEARCH, { url: USERS_ENDPOINT + formatQueryParams(queryParams), ...options }, USER_SCOPE
  )
}
