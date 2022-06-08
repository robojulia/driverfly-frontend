

import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { Menu, MenuItem, Button } from "@mui/material"

import { generateUUID } from "../../utils/common";

export default function ListActions({ id, options, onClick }) {
    const [ state, setState ] = useState({ anchorEl: null });

    const filteredOptions = options.filter((option) => option.permission || typeof(option.permission) === 'undefined');

    const handleClick = event => {
        setState({ anchorEl: event.currentTarget });
    };
    
    const handleClose = () => {
        setState({ anchorEl: null });
    };

    if (!id) id = generateUUID();

    const { anchorEl } = state;

    if (!filteredOptions?.length) {
      return null;
    } else {
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
              {filteredOptions.map((v, i) => (
                <MenuItem key={i} onClick={e => {
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
}

