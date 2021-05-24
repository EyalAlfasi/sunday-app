import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import RemoveIcon from '@material-ui/icons/Remove';
import { Link } from 'react-router-dom'
import { utilService } from '../services/utilService.js';
import { ClickAwayListener } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { query } from '../store/actions/userAction'
import { BoardSearch } from './BoardSearch.jsx';
import { userService } from '../services/userService.js';
import { MemberList } from './members-components/MemberList.jsx';

export const _BoardMembers = ({ changeBoardMemebrs, board, onCloseModalMembers, query }) => {

    const [users, setUsers] = useState([])

    const onSetFilter = async (txt) => {
        if (!txt) {
            setUsers([])
            return;
        }

        const users = await query(txt);
        const usersNotInBoard = users.filter(user => {
            const mutualMember = board.members.find(memberId => memberId === user._id);
            if (mutualMember) return false;
            return true;
        })
        setUsers(usersNotInBoard)
    }

    const onChangeBoardMemebrs = (userToUpdate, sign) => {
        const updatedUsers = users.filter(user => user._id !== userToUpdate._id)
        setUsers(updatedUsers)
        changeBoardMemebrs(userToUpdate, sign)
    }

    return <ClickAwayListener onClickAway={onCloseModalMembers}>
        <div className="members-modal-basic" >
            <div>
                <h3>Add users to this board</h3>
                <div>
                    <BoardSearch onSetFilter={onSetFilter} />
                </div>
                {users.map(user => {
                    return <div key={user._id} className="flex align-center space-between member-row" >
                        <Link to={`/user/${user._id}/general`} >
                            <div className="flex align-center space-between">
                                {user.imgUrl ? <img src={user.imgUrl} className="user-thumbnail" alt="" /> :
                                    <span className="user-thumbnail">{utilService.getNameInitials(user.fullname)}</span>}
                                <span className="modal-user-full-name">{user.fullname}</span>
                            </div>
                        </Link>
                        <AddIcon onClick={() => onChangeBoardMemebrs(user, 'add')} className="remove-icon" />
                    </div>
                })}
            </div>
            <div>
                <h3>Board Members</h3>
                <MemberList
                    members={board.members}
                    onUpdateMembers={onChangeBoardMemebrs}
                    type='remove' />
            </div>
        </div>
    </ClickAwayListener>

}


const mapGlobalStateToProps = (state) => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
    }
}
const mapDispatchToProps = {
    query
}

export const BoardMembers = connect(mapGlobalStateToProps, mapDispatchToProps)(_BoardMembers)

