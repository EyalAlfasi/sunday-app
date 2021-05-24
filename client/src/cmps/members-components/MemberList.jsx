import React from 'react'
import { MemberPreview } from './MemberPreview'

export const MemberList = ({ members, onUpdateMembers, type }) => {
    return (
        <>
            {members.map(memberId => {
                return <MemberPreview
                    key={memberId}
                    memberId={memberId}
                    onUpdateMembers={onUpdateMembers}
                    type={type} />
            })}
        </>
    )
}
