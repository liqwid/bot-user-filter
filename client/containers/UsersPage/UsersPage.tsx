import * as React from 'react'
import { connect } from 'react-redux'

import { ListItemText, ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

import { User, UsersState } from 'models/user.model'
import { searchUsers, fetchUsers, fetchUsersNextPage, fetchUsersPreviousPage } from 'actions/users.actions'

import { SearchField } from 'components/SearchField'
import { PageLayout } from 'components/PageLayout'
import { List } from 'components/List'

export interface UsersPageStateProps extends UsersState {}
export interface UsersPageDispatch {
  search: (queryParams: {}) => any
  fetch: () => any
  fetchNextPage: (nextPageUrl?: string) => any
  fetchPreviousPage: (previousPageUrl?: string) => any
}

export interface UsersPageProps extends UsersPageStateProps, UsersPageDispatch {}
export interface UsersPageState {
  searchName: string
}

export const SEARCH_PLACEHOLDER = 'Search users'
export const ERROR_TEXT = 'Failed to load users. Try again'

const SEARCH_HEIGHT = 48

export const mapStateToProps = ({ users }): UsersPageStateProps => users

export const mapDispatchToProps = (dispatch): UsersPageDispatch => ({
  search: (queryParams: {}) => dispatch(searchUsers({ queryParams })),
  fetch: () => dispatch(fetchUsers()),
  fetchNextPage: (nextPageUrl?: string) =>
    nextPageUrl && dispatch(fetchUsersNextPage({ url: nextPageUrl })),
  fetchPreviousPage: (previousPageUrl?: string) =>
    previousPageUrl && dispatch(fetchUsersPreviousPage({ url: previousPageUrl })),
})

export class UsersPageContainer extends React.Component<UsersPageProps, UsersPageState> {
  container: HTMLDivElement
  
  state = {
    searchName: ''
  }

  componentDidMount() {
    this.fetchUsers()
  }

  search = ({ target: { value }}: React.ChangeEvent<any>) => {
    const { search } = this.props
    this.setState({ searchName: value })
    search({ searchTerm: value })
  }

  filterUsers(items: User[]) {
    const { searchName } = this.state
    return items.filter(({ name }) => name.indexOf(searchName) > -1)
  }

  fetchUsers() {
    this.props.fetch()
  }
  
  render() {
    const { searchName } = this.state
    const { items, loading, loadingNext, loadingPrevious, error,
      fetchNextPage, fetchPreviousPage, nextPageUrl, previousPageUrl } = this.props
    const itemsProps = {
      items: this.filterUsers(items),
      loading, loadingNext, loadingPrevious, error
    }
    return (
      <PageLayout ref={(node) => { this.container = node }}>
        <SearchField
          style={{ height: SEARCH_HEIGHT }}
          value={searchName}
          onChange={this.search}
          autoFocus={true}
          placeholder={SEARCH_PLACEHOLDER}
        />
        { error && ERROR_TEXT }
        {
          !error && <List
            style={{ height: `calc(100% - ${SEARCH_HEIGHT}px)` }}
            {...itemsProps}
            onScrollPastTop={() => fetchPreviousPage(previousPageUrl)}
            onScrollPastBottom={() => fetchNextPage(nextPageUrl)}
            renderChild={({ name, avatarUrl, id }: User) =>
              <ListItem key={id}>
                <Avatar alt={name} src={avatarUrl} />
                <ListItemText primary={name} />
              </ListItem>
            }
          />
        }
      </PageLayout>
    )
  }
}

export const UsersPage = connect(mapStateToProps, mapDispatchToProps)(UsersPageContainer)
