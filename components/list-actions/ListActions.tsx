

import React, { ReactNode } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { Menu, MenuItem, Button } from "@mui/material"

import { generateUUID } from "../../utils/common";
import { Icon } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/useTranslation';

export interface ListActionsProps {
  id?: string;
  options?: ListActionOptions[];
  onClick?: (e: React.MouseEvent) => void;
}

export interface ListActionOptions {
  icon?: Icon;
  label: string | ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  hide?: boolean;
}

export default function ListActions({ id, options, onClick }: ListActionsProps) {
    const [ state, setState ] = useState({ anchorEl: null });

    const { t } = useTranslation();
    
    const filteredOptions = options.filter((option) => !option.hide);

    const handleClick = event => {
        setState({ anchorEl: event.currentTarget });
    };
    
    const handleClose = (e: React.MouseEvent) => {
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
              {filteredOptions.map((v, i) => {
                const { icon: Cmp, label } = v;
                return (
                  <MenuItem key={i} onClick={e => {
                      e.preventDefault();
                      handleClose(e);
                      if (v.onClick) v.onClick(e);
                      if (onClick) onClick(e)
                  }}>
                    {Cmp && <Cmp style={{ marginRight: "5px" }} />} {typeof label === "string" ? t(label) : label}
                </MenuItem>);
            })}
          </Menu>
        </div>
      );
    }
}

