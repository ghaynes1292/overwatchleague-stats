import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

const ReloadPageSnack = ({ classes, open, handleClose }) => (
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={open}
    autoHideDuration={6000}
    onClose={handleClose}
    SnackbarContentProps={{
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">Refresh Required</span>}
    action={[
      <IconButton color="inherit" onClick={handleClose} aria-label="Close">
        <CloseIcon />
      </IconButton>
    ]}
  />
);

ReloadPageSnack.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReloadPageSnack);
