import React, { useState } from 'react'
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import {  ListItemIcon, MenuItem, MenuList, Popover } from '@material-ui/core';
import { changeGroupColor } from '../../store/actions/boardAction';
import { useDispatch, useSelector } from 'react-redux';
import { setMsg } from '../../store/actions/userAction';
import DeleteIcon from '@material-ui/icons/Delete';
import { GroupSortModal } from './GroupSortModal';
import { GroupColors } from './GroupColors';

export const GroupMenu = ({ groupId, onSetGroupSort, onShowConfirmModal, color }) => {
    const [isMenuOnHover, setIsMenuOnHover] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch()
    const board = useSelector(state => state.boardReducer.board)


    const handleClick = (ev) => {
        setAnchorEl(ev.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onChangeGroupColor = async (color) => {
        dispatch(setMsg('Group color Successfully Change'))
        await dispatch(changeGroupColor(color, board, groupId))
        handleClose()
    }


    const open = Boolean(anchorEl);
    const id = open ? 'group-menu-popover' : undefined;

    return (<>
        <ArrowDropDownOutlinedIcon
            onMouseEnter={() => setIsMenuOnHover(true)}
            onMouseLeave={() => setIsMenuOnHover(false)}
            aria-describedby={id}
            onClick={handleClick}
            className="group-menu-icon" style={{
                backgroundColor: isMenuOnHover ? '#f9f9f9' : color,
                color: !isMenuOnHover ? '#f9f9f9' : color,
                border: `1px solid ${color}`
            }}
        />
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
                    horizontal: 'center',
                }}
            >
                <MenuList className="group-menu-container">
                    <GroupColors onCloseAll={handleClose} 
                    onChangeColor={onChangeGroupColor} />
                    <MenuItem onClick={onShowConfirmModal}>
                        <ListItemIcon >
                            <DeleteIcon />
                        </ListItemIcon>
                        <span>Delete Group</span>
                    </MenuItem>
                    <GroupSortModal onSetGroupSort={onSetGroupSort} />
                </MenuList>
            </Popover>
    </>
    )
}
