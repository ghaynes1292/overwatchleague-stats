import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    width: '80%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tab: {
    minWidth: '95px',
  },
  rootClass: {
    backgroundColor: 'inherit',
    boxShadow: 'none'
  }
});

class FullWidthTabs extends React.Component {
  handleChange = (event, value) => {
    this.props.handleChange(value)
  };

  render() {
    const { classes, theme, value } = this.props;

    return (
      <div className={classes.root}>
        <AppBar classes={{ root: classes.rootClass }} position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="Overview" />
            <Tab label="Stage 1" />
            <Tab label="Stage 2" />
            <Tab label="Stage 3" />
            <Tab label="Stage 4" />
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
