import { Subject, of } from 'rxjs'
import { take, tap } from 'rxjs/operators'

import { createFetchEpic, DEBOUNCE_TIME } from './fetch.epic'
import { FETCH, FETCH_NEXT_PAGE, FETCH_PREVIOUS_PAGE,
  SEARCH, UPDATE, ERROR, createUpdateAction, createErrorAction } from 'actions/fetch.actions'

const STUB_URL = 'url'
const fetchEpicSpy = jest.fn()

jest.mock('services/restApi')

jest.useFakeTimers()

export function testWithScope(scope?: string) {
  const fetchEpic: any = createFetchEpic(scope)
  const actionWithCorrectScope = of({
    type: FETCH,
    payload: { url: STUB_URL },
    scope,
  })
  const actionWithWrongScope = of({
    type: FETCH,
    payload: { url: STUB_URL },
    scope: 'OTHER_SCOPE',
  })
  const actionWithoutScope = of({
    type: FETCH,
    payload: { url: STUB_URL },
  })
  afterEach(() => {
    fetchEpicSpy.mockClear()
    jest.clearAllTimers()
  })
  
  it('should filter action by scope if scope is set', () => {
    fetchEpic(actionWithCorrectScope).pipe(take(1)).subscribe(fetchEpicSpy)
    jest.runTimersToTime(DEBOUNCE_TIME)
    fetchEpic(actionWithWrongScope).pipe(take(1)).subscribe(fetchEpicSpy)
    jest.runTimersToTime(DEBOUNCE_TIME)
    fetchEpic(actionWithoutScope).pipe(take(1)).subscribe(fetchEpicSpy)
    jest.runTimersToTime(DEBOUNCE_TIME)
    if (scope) {
      expect(fetchEpicSpy).toHaveBeenCalledTimes(1)
    } else {
      expect(fetchEpicSpy).toHaveBeenCalledTimes(3)
    }
  })
}

testWithScope('SCOPE')
testWithScope()
