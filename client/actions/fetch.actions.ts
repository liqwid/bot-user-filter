import { ScopedAction } from 'actions/scoped.actions'
import { FetchResponse, FetchOptions } from 'models/fetch.model'

/**
 * Action Types
 */
export const FETCH = 'FETCH'
export const FETCH_NEXT_PAGE = 'FETCH_NEXT_PAGE'
export const FETCH_PREVIOUS_PAGE = 'FETCH_PREVIOUS_PAGE'
export const SEARCH = 'SEARCH'
export const UPDATE = 'UPDATE'
export const ERROR = 'ERROR'

/**
 * Action Interfaces
 */
export interface FetchAction extends ScopedAction {
  payload: FetchOptions
}

export interface FetchUpdateAction<Model> extends ScopedAction {
  payload: FetchResponse<Model>
}

export interface ErrorAction extends ScopedAction {
  payload: Error
}

/**
 * Action creators
 */
export function createFetchAction(type: string, options: FetchOptions, scope?: string) {
  return { type, scope, payload: options }
}

export function createUpdateAction<Model>(
  type: string, response: FetchResponse<Model>, concatType?: string, scope?: string
): FetchUpdateAction<Model> {
  return { type, scope, payload: { concatType, ...response } }
}

export function createErrorAction(type: string, error: Error, scope?: string): ErrorAction {
  return { type, scope, payload: error }
}
