import { Reducer } from 'redux'
import { PageableState, FetchableState, FetchModel,
  MAX_ITEMS, ConcatType, CONCAT_LEFT, CONCAT_RIGHT } from 'models/fetch.model'
import { createReducer } from 'reducers/createReducer'

import { FETCH, FETCH_NEXT_PAGE, FETCH_PREVIOUS_PAGE, SEARCH, UPDATE, ERROR } from 'actions/fetch.actions'

export interface FetchReducerParams<InitialState> {
  scope?: string,
  initialState?: InitialState,
  handlers?: { [key: string]: Reducer<InitialState> },
}
/**
 * Creates reducer with fetch state params: loading, pagination, items list
 * @param initialState 
 * @param handlers 
 */
export function createFetchReducer<Model extends FetchModel, InitialState = {}>(
  { scope, initialState, handlers }: FetchReducerParams<InitialState>
): Reducer<FetchableState<Model> & PageableState & InitialState> {
  const INITIAL_FETCH_STATE: FetchableState<Model> & PageableState = {
    items: [],
    loading: true,
    loadingPrevious: false,
    loadingNext: false,
    error: undefined
  }

  /**
   * Concats items, used for loading on scroll
   * Removes least recent loaded items that exceed MAX_ITEMS limit
   * @param concatType left concat, right concat or none of them for full replace
   * @param initial inital items
   * @param update updated items
   * @returns resulting items
   */
  function concatItems(concatType: ConcatType, initial: Model[], update: Model[]): Model[] {
    if (concatType === CONCAT_LEFT) return update.concat(initial).slice(0, MAX_ITEMS)
    if (concatType === CONCAT_RIGHT) return initial.concat(update).slice(-MAX_ITEMS)
    return update
  }

  /**
   * Updates nextPageUrl
   * Used for concating items(when nextPageUrl update is not needed)
   * and for excluding exceeding items (when nextPageUrl should be formed on client)
   * @param items new items
   * @param concatType
   * @param nextPageUrl nextPageUrl acquired from request
   * @param state previous state
   * @returns updated nextPageUrl
   */
  function updateNextPageUrl(
    items: Model[],
    concatType: ConcatType,
    nextPageUrl: string,
    state: FetchableState<Model> & PageableState
  ): string | undefined {
      if (concatType === 'left') {
        // If concat overflows MAX_ITEMS
        // reformatting nextPageUrl to contain overflowing items
        const stateItemsLength = state.items.length
        const overflowingItemIndex = stateItemsLength + items.length - MAX_ITEMS
        if (overflowingItemIndex > 0) {
          return nextPageUrl
            .replace(/(fromId=)\d*/, ($0, $1) => $1 + state.items[stateItemsLength - overflowingItemIndex].id)
            .replace(/(toId=)\d*/, ($0, $1) => $1 + (state.items[stateItemsLength - 1].id + 1))
        }
        // Do not update next page url upon previous page concat
        return state.nextPageUrl
      }
      
      return nextPageUrl
  }

  /**
   * Updates previousPageUrl
   * Used for concating items(when previousPageUrl update is not needed)
   * and for excluding exceeding items (when nextPageUrl should be formed on client)
   * @param items new items
   * @param concatType
   * @param previousPageUrl previousPageUrl acquired from request
   * @param state previous state
   * @returns updated previousPageUrl
   */
  function updatePreviousPageUrl(
    items: Model[],
    concatType: ConcatType,
    previousPageUrl: string,
    state: FetchableState<Model> & PageableState
  ) {
      if (concatType === 'right') {
        // If concat overflows MAX_ITEMS
        // reformatting previousPageUrl to contain overflowing items
        const overflowingItemIndex = state.items.length + items.length - MAX_ITEMS
        if (overflowingItemIndex > 0) {
          return previousPageUrl
            .replace(/(fromId=)\d*/, ($0, $1) => $1 + state.items[0].id)
            .replace(/(toId=)\d*/, ($0, $1) => $1 + state.items[overflowingItemIndex].id)
        }
        // Do not update previous page url upon next page concat
        return state.previousPageUrl
      }
      
      return previousPageUrl
  }

  const fetchHandlers: { [key: string]: Reducer } = {
    /**
     * Initiates a full refetch
     */
    [FETCH]: (state) => ({
      ...state,
      loading: true,
      loadingPrevious: false,
      loadingNext: false,
      error: undefined,
    }),

    /**
     * Initiates next page fetch
     */
    [FETCH_NEXT_PAGE]: (state) => ({
      ...state,
      loading: false,
      loadingPrevious: false,
      loadingNext: true,
      error: undefined,
    }),

    /**
     * Initiates previous page fetch
     */
    [FETCH_PREVIOUS_PAGE]: (state) => ({
      ...state,
      loading: false,
      loadingPrevious: true,
      loadingNext: false,
      error: undefined,
    }),
    
    /**
     * Initiates search
     */
    [SEARCH]: (state) => ({
      ...state,
      loading: false,
      loadingPrevious: false,
      loadingNext: true,
      error: undefined,
    }),
        
    /**
     * Updates collection with fetch results
     */
    [UPDATE]: (state, { result, nextPageUrl, previousPageUrl, concatType }) => ({
      ...state,
      loading: false,
      loadingPrevious: false,
      loadingNext: false,
      error: undefined,
      items: concatItems(concatType, state.items, result) || [],
      nextPageUrl: nextPageUrl ? updateNextPageUrl(result, concatType, nextPageUrl, state) : '',
      // Do not update previous page url upon next page concat
      previousPageUrl: previousPageUrl ? updatePreviousPageUrl(result, concatType, previousPageUrl, state) : '',
    }),
        
    /**
     * Sets error info
     */
    [ERROR]: (state, { error }) => ({
      ...state,
      loading: false,
      loadingPrevious: false,
      loadingNext: false,
      error,
    }),
  }

  return createReducer(
    { ...INITIAL_FETCH_STATE, ...<any> initialState },
    { ...fetchHandlers, ...handlers },
    scope
  )
}
