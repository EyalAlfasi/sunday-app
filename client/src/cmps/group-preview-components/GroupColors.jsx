import React, { useState } from 'react'
import { Colors } from '../Colors'
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import { ListItemIcon, MenuItem, Popover } from '@material-ui/core';

export const GroupColors = ({ onChangeColor }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (ev) => {
        setAnchorEl(ev.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'group-colors-popover' : undefined;
    return (
        <>
            <MenuItem aria-describedby={id} onClick={handleClick}>
                <ListItemIcon>
                    <BorderColorOutlinedIcon className="btn-change-group-color" />
                </ListItemIcon>
                <span> Change Group Color</span>
            </MenuItem>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div className="group-colors-container">
                    <Colors onChangeColor={onChangeColor} />
                </div>

            </Popover></>
    )
}