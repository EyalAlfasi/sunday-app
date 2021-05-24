import React, { useEffect, useState } from 'react'
import { userService } from '../services/userService'

export const useGetUser = (userId) => {
   
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetchUser()
    }, [])

    async function fetchUser() {
        const user = await userService.getUserById(userId)
        setUser(user)
    }

    return user
}
