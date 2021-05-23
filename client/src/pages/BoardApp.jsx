import React, { Component, useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { MainSideBar } from '../cmps/MainSideBar'
import { BoardSideBar } from '../cmps/BoardSideBar'
import { BoardPreview } from '../cmps/BoardPreview'
import { loadBoards, removeBoard, getBoardById, addBoard, updateBoards } from '../store/actions/boardAction.js'
import { logOut, setMsg, updateReadNotifications, cleanNotifications, updateUserNotifications } from '../store/actions/userAction.js'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { boardService } from '../services/boardService'
import { socketService } from '../services/socketService'
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import { CardUpdates } from '../cmps/CardUpdates'

export const BoardApp = ({ match, history }) => {
    const [isBoardSideBarOpen, setIsBoardSideBarOpen] = useState(window.innerWidth >= 800)
    const [boardTitle, setBoardTitle] = useState('')
    const dispatch = useDispatch()
    const loggedInUser = useSelector((state) => state.userReducer.loggedInUser)
    const boards = useSelector((state) => state.boardReducer.boards)
    const board = useSelector((state) => state.boardReducer.board)
    const msg = useSelector((state) => state.userReducer.msg)
    const [action, setAction] = useState('firstLoad')

    useEffect(() => {
        const { boardId } = match.params
        if (!boardId) return
        else dispatch(getBoardById(boardId))
    }, [match.params])

    useEffect(() => {
        initializeBoards()
        return () => {
            socketService.off('boardUpdate', updateBoards)
            socketService.off('updateUser', updateUserNotifications)
            socketService.terminate()
        }
    }, [])

    useEffect(() => {
        if (action === 'add') {
            history.push(`/board/${boards[boards.length - 1]._id}`)
            setAction('')
        }
        else if (action === 'firstLoad') {
            if (boards.length) {
                history.push(`/board/${boards[0]._id}`)
                setAction('')
            }
        }
    }, [boards.length])

    const initializeBoards = async () => {
        if (!loggedInUser) {
            history.push('/')
            return
        }
        socketService.setup()
        socketService.emit('userSocket', loggedInUser)
        socketService.on('boardUpdate', updateBoardsInStore)
        socketService.on('updateUser', updateUserNotifications)
        const { boardId } = match.params;
        if (!boardId) dispatch(loadBoards(loggedInUser._id))
        else if (!boards.length && boardId) dispatch(loadBoards(loggedInUser._id))
        if (boardId) dispatch(getBoardById(boardId))
    }

    const updateBoardsInStore=(board)=>{
        updateBoards(board)
    }

    const onDeleteBoard = async (boardId, boardIdx) => {
        await dispatch(removeBoard(boardId))
        if (boardId === board._id) {
            const currBoardId = boardService.getBoardIdByIdx(boardIdx, boards)
            if (currBoardId) history.push(`/board/${currBoardId}`)
            else history.push('/board')
        }
        dispatch(setMsg('Board Successfully Deleted'))
    }

    const onAddBoard = async (boardTitle) => {
        setAction('add')
        await dispatch(addBoard(boardTitle, loggedInUser._id))
        dispatch(setMsg('Board Successfully Added'))
    }

    const getBoardsForDisplay = () => {
        const filterRegex = new RegExp(boardTitle, 'i');
        const copyBoards = boards.filter(board => filterRegex.test(board.title));
        return copyBoards
    }

    if (!loggedInUser) return <Redirect exact to="/" />
    return (
        <div className="board-app-container">
            <MainSideBar
                onLogOut={() => dispatch(logOut())}
                user={loggedInUser}
                onCleanNotifications={() => dispatch(cleanNotifications(loggedInUser))}
                onUpdateNotifications={() => dispatch(updateReadNotifications(loggedInUser))}
            />
            <div className="flex board-and-sidebar-container">
                <div className={`board-sidebar-container ${!isBoardSideBarOpen ? 'closed' : ''}`}>
                    <button className="toggle-board-sidebar" onClick={() => setIsBoardSideBarOpen(!isBoardSideBarOpen)}>
                        {isBoardSideBarOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                    </button>
                    <BoardSideBar
                        boards={getBoardsForDisplay()}
                        onDeleteBoard={onDeleteBoard}
                        onAddBoard={onAddBoard}
                        user={loggedInUser}
                        onSetFilter={() => setBoardTitle(boardTitle)}
                    />
                </div>
                {board && <BoardPreview />}
                <Route path={`${match.path}/card/:cardId`} render={(props) => {
                    return <CardUpdates board={board} {...props} />
                }} />
                {msg && <div className="snackbar slide-top">{msg}</div>}
            </div>
        </div>
    )
}