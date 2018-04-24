import { Observable, throwError } from 'rxjs'
import { AjaxResponse, AjaxRequest, AjaxError, ajax } from 'rxjs/ajax'
import { catchError } from 'rxjs/operators'

/**
 * API abstraction layer
 */

const BASE_URL = '/api'

/**
 * Base headers, authorization, content-type, etc
 */
const baseHeaders: { [header: string]: string } = {
  'Content-Type': 'application/json'
}

const onError = (error: AjaxError) => {
  /**
   * Place for custom error logic e.g.
   * ```
   * if (error.status === 401) {
   *  logout()
   * }
   * if (error.status === 400) {
   *  return Observable.throw(formatValidationErrors(error.response))
   * }
   */
  return throwError(error)
}
  
function get({ url, headers }: AjaxRequest): Observable<AjaxResponse> {
  return ajax
    .get(<string> BASE_URL + url, { ...headers, ...baseHeaders })
    .pipe(catchError(onError))
}
  
/**
 * Special post method is used to be able to track upload progress
 */
function post({ url, body, headers, progressSubscriber }: AjaxRequest): Observable<AjaxResponse> {
  return ajax({
    url: BASE_URL + url,
    body: JSON.stringify(body),
    headers: { ...headers, ...baseHeaders },
    method: 'post',
    crossDomain: true,
    progressSubscriber
  }).pipe(catchError(onError))
}
  
function put({ url, body, headers }: AjaxRequest): Observable<AjaxResponse> {
  return ajax
    .put(<string> BASE_URL + url, JSON.stringify(body), { ...headers, ...baseHeaders })
    .pipe(catchError(onError))
}
  
function restDelete({ url, body, headers }: AjaxRequest): Observable<AjaxResponse> {
  return ajax
    .delete(<string> BASE_URL + url, { ...headers, ...baseHeaders })
    .pipe(catchError(onError))
}

export default {
  get,
  put,
  post,
  delete: restDelete
}
