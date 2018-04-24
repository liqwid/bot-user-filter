import { QueryParams } from 'models/fetch.model'

export function formatQueryParams(queryParams?: QueryParams): string {
  if (!queryParams) return ''
  
  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&')

  return `?${queryString}`
}
