import { createMuiTheme } from 'material-ui/styles'
import { DARK_BLUE_GRAY, TEAL, RED_ORANGE } from 'styles/colors'

export const theme = createMuiTheme({
  typography: {
    fontFamily: 'Play, Roboto'
  },
  palette: {
    type: 'dark',
    background: {
      default: DARK_BLUE_GRAY,
      paper: DARK_BLUE_GRAY,
    },
    primary: {
      main: TEAL
    },
    secondary: {
      main: RED_ORANGE
    },
    error: {
      main: RED_ORANGE
    }
  }
})
