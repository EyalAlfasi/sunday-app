import { useGetUser } from "../../custom-hooks/useGetUser"
import { utilService } from "../../services/utilService"


export function MemberForDisplay({ memberId, backgroundColor }) {
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
        </>
    )
}
