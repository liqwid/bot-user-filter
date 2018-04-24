import { Action } from 'redux'

export interface ScopedAction extends Action<string> {
  scope?: string
}
