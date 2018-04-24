export const MAX_ITEMS = 100

export type ConcatType = 'left' | 'right' | undefined
export const CONCAT_LEFT = 'left'
export const CONCAT_RIGHT = 'right'

/**
 * GET request query params
 */
export interface QueryParams {
  [ key: string ]: string
}

/**
 * Options for a fetch action
 */
export interface FetchOptions {
  url: string
  concatType?: string
  queryParams?: QueryParams
}

/**
 * GET response for multiple items fetch
 */
export interface FetchResponse<Model> {
  result: Model[],
  nextPageUrl?: string
  previousPageUrl?: string,
  concatType?: string
}

/**
 * State params related to fetch
 */
export interface FetchableState<Model> {
  items: Model[]
  loading: boolean
  error?: string
}

/**
 * State params related to pagincation
 */
export interface PageableState {
  loadingNext: boolean
  loadingPrevious: boolean
  nextPageUrl?: string
  previousPageUrl?: string
}

/**
 * Attributes of a model to be used with fetch
 */
export interface FetchModel {
  id: number
}
