

import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
import { useState } from 'react';
import { Menu, MenuItem, Button } from "@mui/material"

import { generateUUID } from "../../utils/common";

export default function ListActions({ id, options, onClick }) {
    const [ state, setState ] = useState({ anchorEl: null });

    const handleClick = event => {
        setState({ anchorEl: event.currentTarget });
    };
    
    const handleClose = () => {
        setState({ anchorEl: null });
    };

    if (!id) id = generateUUID();

    const { anchorEl } = state;

    return (
        <div>
          <Button
            aria-owns={anchorEl ? id : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </Button>
          <Menu
            id={id}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
              {options.map((v, i) => (
                <MenuItem onClick={e => {
                    e.preventDefault();
                    handleClose(e);
                    if (v.onClick) v.onClick(e);
                    if (onClick) onClick(e)
                }}>{v.label}</MenuItem>                  
              ))}
          </Menu>
        </div>
      );
}

// class SimpleMenu extends React.Component {
//   state = {
//     anchorEl: null,
//   };

//   handleClick = event => {
//     this.setState({ anchorEl: event.currentTarget });
//   };

//   handleClose = () => {
//     this.setState({ anchorEl: null });
//   };

//   render() {
//     const { anchorEl } = this.state;

//     return (
//       <div>
//         <Button
//           aria-owns={anchorEl ? 'simple-menu' : undefined}
//           aria-haspopup="true"
//           onClick={this.handleClick}
//         >
//           <MoreVertIcon />
//         </Button>
//         <Menu
//           id="simple-menu"
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={this.handleClose}
//         >
//             {this.props.children}
//           <MenuItem onClick={this.handleClose}>Profile</MenuItem>
//           <MenuItem onClick={this.handleClose}>My account</MenuItem>
//           <MenuItem onClick={this.handleClose}>Logout</MenuItem>
//         </Menu>
//       </div>
//     );
//   }
// }

// export default SimpleMenu;
