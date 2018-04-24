import * as React from 'react'
import { shallow, mount, ShallowWrapper } from 'enzyme'

import { ListItem } from 'material-ui'

import { UsersPageContainer, UsersPageProps, UsersPageState, ERROR_TEXT, UsersPage } from './UsersPage'
import { SearchField } from 'components/SearchField'
import { List, ListWrap } from 'components/List'
import { PageLayout } from 'components/PageLayout'

const STUB_ITEMS_LENGTH = 10
const STUB_ITEMS = Array(STUB_ITEMS_LENGTH).fill(undefined)
.map((_, id) => ({ id, name: `name${id}`, avatarUrl: `url${id}` }))

const searchSpy = jest.fn()
const fetchSpy = jest.fn()
const fetchNextSpy = jest.fn()
const fetchPreviousSpy = jest.fn()

const NEXT_PAGE_URL_STUB = 'nextPage'
const PREVIOUS_PAGE_URL_STUB = 'previousPage'

const defaultUsersPageProps = {
  loading: false,
  loadingNext: false,
  loadingPrevious: false,
  error: undefined,
  items: [],
  search: searchSpy,
  fetch: fetchSpy,
  fetchNextPage: fetchNextSpy,
  fetchPreviousPage: fetchPreviousSpy,
  nextPageUrl: NEXT_PAGE_URL_STUB,
  previousPageUrl: PREVIOUS_PAGE_URL_STUB,
}

describe('UsersPage', () => {
  let wrapper: ShallowWrapper<UsersPageProps, UsersPageState>
  beforeEach(() => {
    wrapper = shallow(<UsersPageContainer {...defaultUsersPageProps} />)
    wrapper.find(List).dive().find(ListWrap).dive()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('search field', () => {
    it('should render SearchField', () => {
      expect(wrapper.find(SearchField)).toHaveLength(1)
    })
  
    it('SearchField should have value of searchName state', () => {
      const testSearchName = 'test'
      expect(wrapper.find(SearchField).prop('value')).toBe('')

      wrapper.setState({ searchName: testSearchName })
      expect(wrapper.find(SearchField).prop('value')).toBe(testSearchName)
    })
  
    it('should change searchName state upon onChange of SearchField', () => {
      const testSearchName = 'test';
      (wrapper.find(SearchField).prop('onChange') as any)({ target: { value: testSearchName }})

      expect(wrapper.state('searchName')).toBe(testSearchName)
    })
  
    it('should call search action upon onChange of SearchField', () => {
      const testSearchName = 'test';
      (wrapper.find(SearchField).prop('onChange') as any)({ target: { value: testSearchName }})

      expect(searchSpy).toHaveBeenCalledTimes(1)
      expect(searchSpy).toHaveBeenCalledWith({ searchTerm: testSearchName })
    })
  })

  describe('List', () => {
    it('should render items List', () => {
      expect(wrapper.find(List)).toHaveLength(1)
    })
  
    it('should call fetchNextPage action with nextPageUrl prop upon onScrollPastBottom of List', () => {
      expect(fetchNextSpy).toHaveBeenCalledTimes(0);
      (wrapper.find(List).prop('onScrollPastBottom') as any)()

      expect(fetchNextSpy).toHaveBeenCalledTimes(1)
      expect(fetchNextSpy).toHaveBeenCalledWith(NEXT_PAGE_URL_STUB)
    })
  
    it('should call fetchPreviousPage action with nextPageUrl prop upon onScrollPastTop of List', () => {
      expect(fetchPreviousSpy).toHaveBeenCalledTimes(0);
      (wrapper.find(List).prop('onScrollPastTop') as any)()

      expect(fetchPreviousSpy).toHaveBeenCalledTimes(1)
      expect(fetchPreviousSpy).toHaveBeenCalledWith(PREVIOUS_PAGE_URL_STUB)
    })

    it('should call fetch action upon mount', () => {
      expect(fetchSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('error', () => {
    it('should not render items List when error prop is true', () => {
      wrapper.setProps({ error: 'error' })
      expect(wrapper.find(List)).toHaveLength(0)
    })
  
    it('should render error message when error prop is true', () => {
      wrapper.setProps({ error: 'error' })
      expect(wrapper.find(PageLayout).children().last().text()).toBe(ERROR_TEXT)
    })
  })
})
