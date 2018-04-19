import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import { getRandomTeamColor } from './util';

// A theme with custom primary and secondary color.
// It's optional.

const color = getRandomTeamColor();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: `#${color.primary}`,
    },
    secondary: {
      main: `#${color.secondary}`,
    },
  },
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
