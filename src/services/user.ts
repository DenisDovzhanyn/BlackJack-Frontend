import { User } from "../models/user"

//TODO lol wtf why am i POSTing to get a users info 
export const getUserInfo = async (id: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BASE_API}/user` ,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            }
        )

        const respJson = await resp.json()

        if (resp.status != 200) {
            sessionStorage.removeItem('id')
            return Error(respJson.error)
        }

        return respJson as User
    } catch (error) {
        console.log(error)
        if (error instanceof Error) return error
    }
}