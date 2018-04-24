import { User, USER_SCOPE } from 'models/user.model'
import { createFetchEpic } from 'epics/fetch.epic'

/**
 * Users service
 * 
 * All middlewares for users store reside here
 */

export const fetchUsersEpic = createFetchEpic<User>(USER_SCOPE)
