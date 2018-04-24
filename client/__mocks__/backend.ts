import { sync } from './db'
import { User } from '../models/user.model'

import mock, { MockResponse } from 'xhr-mock'

const LIMIT = 20

export const TIMEOUT = 200

mock.setup()

const getNextPageUrl = (originalUrl, query, users, prevTo, limit) => {
  const fromId = prevTo
  if (fromId >= users.length - 1) return null
  
  return `${originalUrl}?${formatQuery({ ...query, fromId, limit })}`
}

const getPreviousPageUrl = (originalUrl, query, users, prevFrom, limit) => {
  const toId = prevFrom
  if (toId <= 0) return null
  
  return `${originalUrl}?${formatQuery({ ...query, toId, limit })}`
}

type ResParams = {
  res: MockResponse
  users: User[]
  url?: string
  search?: string
  from?: number
  to?: number
  limit?: number
}

const formatRes = ({
  res, users, url = baseUrl, search = '', from, to, limit = LIMIT
}: ResParams) => {
  const searchResult = users.filter(({ name, id }) => (search ? name.indexOf(search) > -1 : true))
  const result = searchResult.filter(({id}) =>
    (from ? id >= from : true)
    && (to ? id < to : true)
  )
  const limitedResult = (to && !from) ? result.slice(-LIMIT) : result.slice(0, LIMIT)
  const toItem = limitedResult[limitedResult.length - 1]
  const fromItem = limitedResult[0]
  if (!to) to = toItem ? (toItem.id + 1) : searchResult.length - 1
  if (!from) from = fromItem ? fromItem.id : 0

  res.body({
    result: limitedResult,
    nextPageUrl: getNextPageUrl(baseUrl, { searchTerm: search }, searchResult, to, limit),
    previousPageUrl: getPreviousPageUrl(baseUrl, { searchTerm: search }, searchResult, from, limit)
  })

  return res
}

const formatQuery = (query) => Object.keys(query)
  .map((key) => `${key}=${query[key]}`).join('&')

const timeoutPromise = (timoeut) => new Promise(
  (resolve) => setTimeout(resolve, timoeut)
)

const baseUrl = '/api/users'

mock.get(/\/api\/user.*/, async (req, res) => {
  const users = await sync()
  const { query, path } = req.url()
  const { searchTerm, fromId, toId, limit } = <{ [key: string]: string }>query

  await timeoutPromise(TIMEOUT)
  
  return formatRes({
    url: path,
    res,
    users,
    search: searchTerm,
    limit: Number(limit) || undefined,
    from: Number(fromId) || undefined,
    to: Number(toId) || undefined
  })
})
