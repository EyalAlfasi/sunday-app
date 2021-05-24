import { Link } from 'react-router-dom'
import { useGetUser } from '../../custom-hooks/useGetUser'
import { utilService } from '../../services/utilService'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

export const MemberPreview = ({ memberId, onUpdateMembers, type }) => {
        const user = useGetUser(memberId)
       
    return (
        user && <div key={user._id} className="flex align-center space-between member-row" >
            <Link to={`/user/${user._id}/general`} >
                <div className="flex align-center space-between">
                    {user.imgUrl ? <img src={user.imgUrl} className="user-thumbnail" alt="" /> :
                        <span className="user-thumbnail">{utilService.getNameInitials(user.fullname)}</span>}
                    <span className="modal-user-full-name">{user.fullname}</span>
                </div>
            </Link>
            {type === 'remove' ? <RemoveIcon onClick={() => onUpdateMembers(user, 'remove')} className="remove-icon" />
                : <AddIcon onClick={() => onUpdateMembers(user, 'add')} className="remove-icon" />}
        </div>
    )
}
