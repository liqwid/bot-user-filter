import { User } from '../models/user.model'

export function sync(): Promise<User[]> {
  let cachedDb: User[]
  try {
    cachedDb = JSON.parse(localStorage.getItem('cachedDb') || 'null')
  } finally {}
  if (cachedDb) return Promise.resolve(<User[]> cachedDb)
  
  return fetch('https://uinames.com/api/?amount=500&ext')
  .then((response) => response.json())
  .then((users) => users.map(
      ({ name, photo }, id): User => ({ name, id, avatarUrl: photo })
    )
  )
  .then((users) => {
    localStorage.setItem('cachedDb', JSON.stringify(users))
    return users
  })
}
