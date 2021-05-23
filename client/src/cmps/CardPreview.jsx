import React, { useMemo, useState } from 'react'
import { Delete } from '@material-ui/icons';
import { DatePicker } from './DatePicker';
import { EditableElement } from './EditableElement';
import { LabelMenu } from './LabelMenu';
import { useDispatch, useSelector } from 'react-redux';
import {
    changeCardTitle,
    deleteCard,
    changeTaskMembers,
    changeCardDates,
    changeCardLabels,
    addCardLabel
} from '../store/actions/boardAction'
import ChatBubble from '../assets/img/ChatBubble.jsx';
import PersonIcon from '@material-ui/icons/Person';
import { utilService } from '../services/utilService.js'
import { TaskMembersModal } from './TaskMembersModal.jsx'
import { Draggable } from 'react-beautiful-dnd';
import { ProgressBar } from './ProgressBar';
import { ClickAwayListener } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { setMsg } from '../store/actions/userAction.js'
import { ConfirmModal } from './ConfirmModal.jsx'

export const CardPreview = ({ idx, group, card }) => {
    const [areMembersShown, setAreMembersShown] = useState(false)
    const [isDateShown, setIsDateShown] = useState(false)
    const [isInDeleteMode, setIsInDeleteMode] = useState(false)

    const dispatch = useDispatch()
    const board = useSelector(state => state.boardReducer.board)
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser)

    const onChangeTitle = async (cardTitle) => {
        await dispatch(changeCardTitle({ board, groupId: group.id, cardToUpdate: card, cardTitle, user: loggedInUser }))
    }
    const onDeleteCard = async (cardId, group) => {
        await dispatch(deleteCard({ groupId: group.id, board, cardId, user: loggedInUser }))
        dispatch(setMsg('Card Successfully Removed'))
    }
    const onChangeTaskMembers = (memberId, sign) => {
        dispatch(changeTaskMembers(memberId, sign, board, card, group.id, loggedInUser))
    }
    const onChangeCardDates = (dates) => {
        if (dates.startDate && dates.endDate) {
            dispatch(changeCardDates(dates, board, group.id, card, loggedInUser))
        } else if (!dates.endDate) {
            dispatch(changeCardDates(dates, board, group.id, card, loggedInUser))
        }
        closeDatePicker()
    }

    const onChangeCardLabels = (label, labelType) => {
        dispatch(changeCardLabels(board, card, group.id, label, labelType, loggedInUser))
    }
    const onAddCardLabel = (label, labelGroup) => {
        dispatch(addCardLabel(board, group.id, label, labelGroup))
    }
    const closeDatePicker = () => {
        setIsDateShown(false)
    }
    const workingDays = useMemo(() => {
        const { endDate, startDate } = card.dueDate
        let days;
        let diff;
        if (startDate && !endDate) {
            if (new Date(startDate) < new Date()) return '--'
            diff = new Date(startDate) - new Date()
            days = Math.abs(Math.ceil(diff / (1000 * 60 * 60 * 24)))
        } else if (!endDate && !startDate) days = '--'
        else {
            diff = new Date(startDate) - new Date(endDate)
            days = Math.abs(Math.ceil(diff / (1000 * 60 * 60 * 24)))
        }
        return days
    }, [card.dueDate])

    const availableBoardMembers = useMemo(() => board.members.filter(boardMember => {
        if (!card.members.length) return true;
        const mutualMember = card.members.find(member => {
            return member._id === boardMember._id
        });
        return Boolean(mutualMember)
    }), [board.members, card.members])
    const cardMembersForDisplay = (card.members.length > 2) ? card.members.slice(0, 2) : card.members;
    return (
        <>
            <Draggable
                draggableId={card.id}
                index={idx}
            >
                {(provided, snapshot) => (
                    <div
                        className="card-preview"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <div style={{ backgroundColor: group.style.color }}></div>
                        <div className="card-title">
                            <EditableElement onChangeTitle={onChangeTitle}>{card.title}</EditableElement>
                            <Delete onClick={() => setIsInDeleteMode(true)} />
                        </div>
                        <div>
                            <Link to={`/board/${board._id}/card/${card.id}`}>
                                <ChatBubble />
                            </Link>
                        </div>

                        <div
                            className="card-members relative"
                            onClick={() => setAreMembersShown(!areMembersShown)}
                        >
                            {card.members.length >= 3 &&
                                <span className="members-count-badge">
                                    {`+${card.members.length - 2}`}
                                </span>}
                            <div className={`flex justify-center align-center ${card.members.length >= 2 ? 'multiple-members-display' : ''}`}>
                                {(!cardMembersForDisplay.length) && <PersonIcon className="member-empty-avatar" />}
                                {cardMembersForDisplay.map((member) => (member.imgUrl) ?
                                    <img
                                        key={member._id}
                                        src={member.imgUrl}
                                        className="user-thumbnail"
                                        alt=""
                                    /> :
                                    <h5
                                        style={{ backgroundColor: group.style.color }}
                                        key={member._id}
                                        className="user-thumbnail">
                                        {(utilService.getNameInitials(member.fullname).toUpperCase())}
                                    </h5>)
                                }
                            </div>
                            {areMembersShown &&
                                <TaskMembersModal
                                    availableBoardMembers={availableBoardMembers}
                                    cardMembers={card.members}
                                    changeTaskMembers={onChangeTaskMembers}
                                    onCloseModal={() => setAreMembersShown(!areMembersShown)}
                                />
                            }
                        </div>

                        <div className="card-status">
                            {card.status.label}
                            <LabelMenu
                                onAddLabel={onAddCardLabel}
                                enableAdding={true}
                                onSaveLabel={onChangeCardLabels}
                                labelName={'status'}
                                labelGroup="statuses"
                                labels={group.statuses}
                                currLabel={card.status}
                            />
                        </div>

                        <ClickAwayListener onClickAway={closeDatePicker}>
                            <div
                                className="dateRange-container"
                                onClick={() => setIsDateShown(true)}
                            >
                                <ProgressBar
                                    startDate={card.dueDate.startDate}
                                    endDate={card.dueDate.endDate}
                                    status={card.status}
                                    createdAt={card.createdAt}
                                    groupColor={group.style.color}
                                />
                                {isDateShown &&
                                    <DatePicker
                                        changeDates={onChangeCardDates}
                                        closeDatePicker={closeDatePicker}
                                        cardId={card.id}
                                    />
                                }
                            </div>
                        </ClickAwayListener>

                        <div className="card-workingDays">{workingDays}</div>

                        <div className="card-priority">
                            <LabelMenu
                                onAddLabel={onAddCardLabel}
                                onSaveLabel={onChangeCardLabels}
                                enableAdding={false}
                                labelName={'priority'}
                                labelGroup={'priorities'}
                                labels={group.priorities}
                                currLabel={card.priority}
                            /></div>
                        <div className="card-closer"></div>
                    </div>
                )}
            </Draggable>

            {isInDeleteMode &&
                <ConfirmModal
                    id={card.id}
                    arg={group}
                    onApprove={onDeleteCard}
                    close={() => setIsInDeleteMode(false)}
                    isInDeleteMode={isInDeleteMode}
                    title={card.title}
                    type={'Card'}
                />}
        </>
    )
}