import ReactTooltip from "react-tooltip"
import { useGetUser } from "../../custom-hooks/useGetUser"
import { utilService } from "../../services/utilService"


export function MemberForDisplay({ isFilterDisplay, memberId, backgroundColor }) {
    const user = useGetUser(memberId)
    return (
        <>

            {user && user.imgUrl ?
                <img
                    src={user.imgUrl}
                    className="user-thumbnail"
                    alt=""
                /> : user &&
                <h5
                    style={{ backgroundColor }}
                    className="user-thumbnail">
                    {(utilService.getNameInitials(user.fullname).toUpperCase())}
                </h5>}
            {isFilterDisplay && user && <><span>{user.fullname}</span>
                <ReactTooltip className="sunday-tooltip" id={user._id} place="bottom" effect="solid">
                    {`Member is ${user.fullname}`}
                </ReactTooltip></>}
        </>
    )
}
