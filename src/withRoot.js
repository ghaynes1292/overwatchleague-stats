import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import green from 'material-ui/colors/green';
import Reboot from 'material-ui/Reboot';

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
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <Reboot />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
