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

export const _BoardMembers = ({ changeBoardMemebrs, board, onCloseModalMembers, query }) => {


    const [users, setUsers] = useState([])
    const [boardMembers, setBoardMembers] = useState([])


    useEffect(() => {
        initialBoardMembers()
    }, [users])

    const initialBoardMembers = async () => {
        const members = await Promise.all(board.members.map(async member => await userService.getUserById(member)))
        setBoardMembers(members)
    }

    const onSetFilter = async (txt) => {
        if (!txt) {
            setUsers([])
            return;
        }

        const users = await query(txt);
        const usersNotInBoard = users.filter(user => {
            // if (!board.members.length) return true;
            const mutualMember = board.members.find(member => member._id === user._id);
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
                {boardMembers.map(member => {
                    return <div key={member._id} className="flex align-center space-between member-row" >
                        <Link to={`/user/${member._id}/general`} >
                            <div className="flex align-center space-between">
                                {member.imgUrl ? <img src={member.imgUrl} className="user-thumbnail" alt="" /> :
                                    <span className="user-thumbnail">{utilService.getNameInitials(member.fullname)}</span>}
                                <span className="modal-user-full-name">{member.fullname}</span>
                            </div>
                        </Link>
                        <RemoveIcon onClick={() => onChangeBoardMemebrs(member._id, 'remove')} className="remove-icon" />
                    </div>
                })}
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

