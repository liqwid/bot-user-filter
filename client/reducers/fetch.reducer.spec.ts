import { createFetchReducer } from './fetch.reducer'
import { FETCH, FETCH_NEXT_PAGE, FETCH_PREVIOUS_PAGE, SEARCH, UPDATE, ERROR } from 'actions/fetch.actions'
import { MAX_ITEMS } from 'models/fetch.model'

const initialState = {
  items: [],
  loading: true,
  error: undefined,
  loadingPrevious: false,
  loadingNext: false,
  nextPageUrl: '',
  previousPageUrl: '',
}

const getFetchResult = (count) => Array(count).fill(undefined).map((_, id) => ({ id }))

export function testWithScope(scope?: string) {
  describe('Fetch reducer', () => {
    const reducer = createFetchReducer({ scope })
    it(`should handle ${FETCH} action`, () => {
      const beforeState = {
        ...initialState,
        loading: false,
        loadingPrevious: true,
        loadingNext: true,
        error: 'error',
      }
      const afterState = {
        ...initialState,
        loading: true,
        loadingPrevious: false,
        loadingNext: false,
        error: undefined,
      }

      expect(reducer(beforeState, { type: FETCH, scope })).toEqual(afterState)
    })
    
    it(`should handle ${FETCH_NEXT_PAGE} action`, () => {
      const beforeState = {
        ...initialState,
        loading: true,
        loadingPrevious: true,
        loadingNext: false,
        error: 'error',
      }
      const afterState = {
        ...initialState,
        loading: false,
        loadingPrevious: false,
        loadingNext: true,
        error: undefined,
      }

      expect(reducer(beforeState, { type: FETCH_NEXT_PAGE, scope })).toEqual(afterState)
      
    })
    
    it(`should handle ${FETCH_PREVIOUS_PAGE} action`, () => {
      const beforeState = {
        ...initialState,
        loading: true,
        loadingPrevious: false,
        loadingNext: true,
        error: 'error',
      }
      const afterState = {
        ...initialState,
        loading: false,
        loadingPrevious: true,
        loadingNext: false,
        error: undefined,
      }

      expect(reducer(beforeState, { type: FETCH_PREVIOUS_PAGE, scope })).toEqual(afterState)
      
    })
    
    it(`should handle ${SEARCH} action`, () => {
      const beforeState = {
        ...initialState,
        loading: true,
        loadingPrevious: false,
        loadingNext: true,
        error: 'error',
      }
      const afterState = {
        ...initialState,
        loading: false,
        loadingPrevious: true,
        loadingNext: false,
        error: undefined,
      }

      expect(reducer(beforeState, { type: FETCH_PREVIOUS_PAGE, scope })).toEqual(afterState)
      
    })
    
    it(`should handle ${ERROR} action`, () => {
      const error = 'error'
      const beforeState = {
        ...initialState,
        loading: true,
        loadingPrevious: false,
        loadingNext: true,
        error: undefined,
      }
      const afterState = {
        ...initialState,
        loading: false,
        loadingPrevious: false,
        loadingNext: false,
        error,
      }

      expect(reducer(beforeState, { type: ERROR, scope, payload: { error } })).toEqual(afterState)
      
    })
    
    describe(`${UPDATE} action`, () => {
      it('should reset loading and error attributes', () => {
        const beforeState = {
          ...initialState,
          loading: true,
          loadingPrevious: true,
          loadingNext: true,
          error: 'error',
        }
        const afterState = {
          ...initialState,
          loading: false,
          loadingPrevious: false,
          loadingNext: false,
          error: undefined,
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: {}
        })).toEqual(afterState)
      })

      it('should reset items', () => {
        const result = getFetchResult(20)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: {}
        })
        const afterState = {
          ...beforeState,
          items: result
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { result }
        })).toEqual(afterState)
      })

      it('should concat items from left', () => {
        const result1 = getFetchResult(20)
        const result2 = getFetchResult(20).map(({ id }) => ({ id: id * 2 }))
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { result: result1 }
        })
        const afterState = {
          ...beforeState,
          items: [...result2, ...result1]
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { result: result2, concatType: 'left' }
        })).toEqual(afterState)
      })

      it('should concat items from right', () => {
        const result1 = getFetchResult(20)
        const result2 = getFetchResult(20).map(({ id }) => ({ id: id * 2 }))
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { result: result1 }
        })
        const afterState = {
          ...beforeState,
          items: [...result1, ...result2]
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { result: result2, concatType: 'right' }
        })).toEqual(afterState)
      })

      it(`should not load more then ${MAX_ITEMS} items upon right concat`, () => {
        const result1 = getFetchResult(60)
        const result2 = getFetchResult(60).map(({ id }) => ({ id: id * 2 }))
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { result: result1 }
        })
        const afterState = {
          ...beforeState,
          items: [...result1, ...result2]
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { result: result2, concatType: 'right' }
        }).items).toEqual(afterState.items.slice(-MAX_ITEMS))
      })

      it(`should not load more then ${MAX_ITEMS} items upon left concat`, () => {
        const result1 = getFetchResult(60)
        const result2 = getFetchResult(60).map(({ id }) => ({ id: id * 2 }))
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { result: result1 }
        })
        const afterState = {
          ...beforeState,
          items: [...result2, ...result1]
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { result: result2, concatType: 'left' }
        }).items).toEqual(afterState.items.slice(0, MAX_ITEMS))
      })

      it(`should replcae nextPageUrl and previousPageUrl`, () => {
        const nextPageUrl = 'nextPage'
        const previousPageUrl = 'previousPage'
        const result = getFetchResult(20)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { result }
        })
        const afterState = {
          ...beforeState,
          nextPageUrl,
          previousPageUrl
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { result, nextPageUrl, previousPageUrl }
        })).toEqual(afterState)
      })

      it(`should not replace previousPageUrl on concat right if there's enough place for all items`, () => {
        const nextPageUrl = 'nextPage'
        const previousPageUrl = 'previousPage'
        const result = getFetchResult(20)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { result }
        })
        const afterState = {
          ...beforeState,
          items: [ ...result, ...result ],
          nextPageUrl
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { result, nextPageUrl, previousPageUrl, concatType: 'right' }
        })).toEqual(afterState)
      })

      it(`should not replace nextPageUrl on concat left if there's enough place for all items`, () => {
        const nextPageUrl = 'nextPage'
        const previousPageUrl = 'previousPage'
        const result = getFetchResult(20)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { result }
        })
        const afterState = {
          ...beforeState,
          items: [ ...result, ...result ],
          previousPageUrl
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { result, nextPageUrl, previousPageUrl, concatType: 'left' }
        })).toEqual(afterState)
      })

      it(`should update previousPageUrl toId param on concat right if there's not enough place for all items`, () => {
        const nextPageUrl = 'nextPage'
        const previousPageUrl = 'toId=10'
        const updatedPreviousPageUrl = 'toId=20'
        const result = getFetchResult(60)
        const beforeState = reducer(initialState, {
          type: UPDATE, scope,
          payload: { result }
        })
        const afterState = {
          ...beforeState,
          items: [ ...result, ...result ].slice(-MAX_ITEMS),
          previousPageUrl: updatedPreviousPageUrl,
          nextPageUrl
        }
  
        expect(reducer(beforeState, {
          type: UPDATE, scope,
          payload: { result, nextPageUrl, previousPageUrl, concatType: 'right' }
        })).toEqual(afterState)
      })
    })

    it(`should update previousPageUrl fromId param on concat left if there's not enough place for all items`, () => {
      const previousPageUrl = 'previousPage'
      const nextPageUrl = 'fromId=10'
      const updatedNextPageUrl = 'fromId=40'
      const result = getFetchResult(60)
      const beforeState = reducer(initialState, {
        type: UPDATE, scope,
        payload: { result }
      })
      const afterState = {
        ...beforeState,
        items: [ ...result, ...result ].slice(0, MAX_ITEMS),
        nextPageUrl: updatedNextPageUrl,
        previousPageUrl
      }

      expect(reducer(beforeState, {
        type: UPDATE, scope,
        payload: { result, nextPageUrl, previousPageUrl, concatType: 'left' }
      })).toEqual(afterState)
    })
  })
}

testWithScope('SCOPE')
testWithScope()
