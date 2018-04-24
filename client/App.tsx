import * as React from 'react'

import { Provider } from 'react-redux'

import { MuiThemeProvider } from 'material-ui/styles'
import CssBaseline from 'material-ui/CssBaseline'

import { theme } from 'styles/theme'

import { UsersPage } from 'containers/UsersPage'
import { store } from 'store'

import '__mocks__/backend'

export interface UsersSearchProps {}

export default function UsersSearch(props: UsersSearchProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <UsersPage />
      </Provider>
    </MuiThemeProvider>
  )
}
