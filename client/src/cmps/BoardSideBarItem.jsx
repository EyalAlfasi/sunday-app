import React, { useState } from 'react'
import { ConfirmModal } from './ConfirmModal';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

export const BoardSideBarItem = ({ board, onDeleteBoard, user, idx }) => {

    const [isDelete, setIsDelete] = useState(false)
    const currBoardId = useSelector(state => state.boardReducer.board?._id)

    return (
        <div className={`board-sidebar-item ${ board._id === currBoardId ? 'selected' : ''}`} >
            <Link to={`/board/${board._id}`}>{board.title}</Link>
            {(user._id === board.createdBy._id) && <DeleteIcon onClick={() => setIsDelete(true)} />}
            {isDelete && <ConfirmModal id={board._id} arg={idx}
                deleteFunc={onDeleteBoard} close={() => setIsDelete(false)} title={board.title} type={'Board'} />}
        </div >
    )
}
