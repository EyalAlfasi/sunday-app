import React, { useState } from 'react'
import { ConfirmModal } from '../ConfirmModal'
import { GroupMenu } from './GroupMenu'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { EditableElement } from '../EditableElement';

import ReactTooltip from 'react-tooltip';
export const GroupHeader = ({ group, color, onSetGroupSort, provided, onChangeTitle, onRemoveGroup }) => {
    const [isInDeleteMode, setIsInDeleteMode] = useState(false)


    return (
        <div className="group-header">

            <GroupMenu
                groupId={group.id}
                onSetGroupSort={onSetGroupSort}
                onShowConfirmModal={() => setIsInDeleteMode(true)}
                setIsInDeleteMode={setIsInDeleteMode}
                color={color}
            />
            {isInDeleteMode && <ConfirmModal
                id={group}
                onApprove={onRemoveGroup}
                isInDeleteMode={isInDeleteMode}
                close={() => setIsInDeleteMode(false)}
                title={group.title}
                type={'Group'}
            />}
            <div className="drag-icon" {...provided.dragHandleProps}>
                <DragIndicatorIcon />
            </div>
            <h2 style={{ color }}>
                <EditableElement onChangeTitle={onChangeTitle}>
                    {group.title}
                </EditableElement>
            </h2>
            <h4>Members</h4>
            <h4>Status</h4>
            <h4
                onClick={() => { onSetGroupSort('date') }}
                style={{ cursor: 'pointer' }}
                data-tip data-for='sort-by-date'
            >Date range</h4>
            <h4>Working Days</h4>
            <h4>Priority</h4>
            <ReactTooltip
                className="sunday-tooltip"
                id="sort-by-date"
                place="top"
                effect="solid"
            >Sort By Date</ReactTooltip>
        </div>
    )
}
