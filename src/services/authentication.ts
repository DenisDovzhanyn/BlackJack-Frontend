

export const sendLoginOrRegister = async (username: string, password: string, path: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BASE_API}/auth/${path}` ,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password})
                
            }
        )
        const respJson = await resp.json()
        //? gives me error when i do resp.status != 200 || resp.status != 201 so we do this i guess....
        if (resp.status > 299) return Error(respJson.error)
    
        return respJson.id
        
    } catch (error) {
        console.log(error)
        if(error instanceof Error) return error
    }
}

