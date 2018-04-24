import { createFetchReducer } from 'reducers/fetch.reducer'
import { User, USER_SCOPE } from 'models/user.model'

export const users = createFetchReducer<User>({ scope: USER_SCOPE })
