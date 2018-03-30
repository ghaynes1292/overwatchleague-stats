import React from 'react';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import FilterListIcon from 'material-ui-icons/FilterList';
import Checkbox from 'material-ui/Checkbox';

const ITEM_HEIGHT = 48;

class LongMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleSelect = (option) => {
    const { selectedCols, selectCol } = this.props;
    selectCol(option);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { options, selectedCols } = this.props;

    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
        <IconButton
          aria-label="Table Columns"
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 300,
            },
          }}
        >
          {options.map(option => (
            <MenuItem key={option} onClick={() => this.handleSelect(option)}>
              <Checkbox
                checked={selectedCols.includes(option)}
                tabIndex={-1}
                disableRipple
              />
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default LongMenu;
