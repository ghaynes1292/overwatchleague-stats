import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Typography from 'material-ui/Typography';
import SvgIcon from 'material-ui/SvgIcon';

const styles = theme => ({
  root: {

  },
});

function Healer(props) {
  const { classes, ...otherProps } = props;
  return (
    <SvgIcon viewBox="0 0 64 64" {...otherProps}>
      <path d="M51.9,23.2H40.8V12.1A4.1,4.1,0,0,0,36.7,8H27.3a4.1,4.1,0,0,0-4.1,4.1V23.2H12.1A4.1,4.1,0,0,0,8,27.3v9.4a4.1,4.1,0,0,0,4.1,4.1H23.2V51.9A4.1,4.1,0,0,0,27.3,56h9.4a4.1,4.1,0,0,0,4.1-4.1V40.8H51.9A4.1,4.1,0,0,0,56,36.7V27.3A4.1,4.1,0,0,0,51.9,23.2Z" />
    </SvgIcon>
  );
}

function Tank(props) {
  const { classes, ...otherProps } = props;
  return (
    <SvgIcon viewBox="0 0 64 64" {...otherProps}>
      <path d="M51.4,24.1c0,3.1,0,6.2,0,9.3a4.7,4.7,0,0,1-.6,2.4A57.2,57.2,0,0,1,33.2,55.5a1.8,1.8,0,0,1-2.4,0A57.4,57.4,0,0,1,13.2,36a5.5,5.5,0,0,1-.7-2.8c0-5.8.1-11.7,0-17.5-.1-4.2,3.2-4.9,6.1-5.6A59.4,59.4,0,0,1,32.9,8C37.5,8,44.5,9.6,47,10.4s4.1,1.4,4.3,3.3.1,3.2.1,4.9,0,3.7,0,5.5Z" />
    </SvgIcon>
  );
}

function Flex(props) {
  const { classes, ...otherProps } = props;
  return (
    <SvgIcon viewBox="0 0 64 64" {...otherProps}>
      <path d="M18.55,32.89h0a13.17,13.17,0,0,1,1.77-5.17c.13-.23.5-.6.11-1a15.68,15.68,0,0,1-2.11-4.19.5.5,0,0,0-.89-.19A18.41,18.41,0,0,0,13,34.17h0a9.9,9.9,0,1,0,5.59-1.28Z" />
      <path d="M27,26.85a9.89,9.89,0,0,0,13.16-3h0A13.17,13.17,0,0,1,43.75,28c.13.23.27.73.81.6a15.68,15.68,0,0,1,4.68.28.5.5,0,0,0,.61-.67,18.41,18.41,0,0,0-8-9.82h0A9.9,9.9,0,1,0,27,26.85Z" />
      <path d="M54.73,37.87a9.89,9.89,0,0,0-17.52,9.18h0a13.17,13.17,0,0,1-5.37,1c-.27,0-.76-.14-.92.4a15.67,15.67,0,0,1-2.6,3.9.5.5,0,0,0,.27.87,18.41,18.41,0,0,0,12.51-2h0A9.9,9.9,0,0,0,54.73,37.87Z"></path>
    </SvgIcon>
  );
}

function Dps(props) {
  const { classes, ...otherProps } = props;
  return (
    <SvgIcon viewBox="0 0 64 64" {...otherProps}>
      <rect x="12" y="49.3" width="10.2" height="5.61"></rect>
      <path d="M22.2,19.1a10.2,10.2,0,0,0,0-1c-.8-6.9-5.1-9-5.1-9s-4.3,2.1-5.1,9c0,.3,0,1,0,1V45.4H22.2Z"></path>
      <rect x="26.9" y="49.3" width="10.2" height="5.61"></rect>
      <path d="M37.1,19.1a10.2,10.2,0,0,0,0-1C36.3,11.2,32,9,32,9s-4.3,2.1-5.1,9c0,.3,0,1,0,1V45.4H37.1Z"></path>
      <rect x="41.8" y="49.3" width="10.2" height="5.61"></rect>
      <path d="M52,19.1s0-.8,0-1c-.8-6.9-5.1-9-5.1-9s-4.3,2.1-5.1,9c0,.3,0,1,0,1V45.4H52Z"></path>
    </SvgIcon>
  );
}

export const HealerIcon = withStyles(styles)(Healer);
export const FlexIcon = withStyles(styles)(Flex);
export const DpsIcon = withStyles(styles)(Dps);
export const TankIcon = withStyles(styles)(Tank);
