import { PageableState, FetchableState } from 'models/fetch.model'

export interface User {
  id: number
  name: string
  avatarUrl: string
}

export type UsersState = FetchableState<User> & PageableState

export const USER_SCOPE = 'USER'

export const USERS_ENDPOINT = '/users'
