

export const sendLogin = async (username: string, password: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BASE_API}/auth/login`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password})
                
            }
        )
        const respJson = await resp.json()

        if (resp.status != 200) return Error(respJson.error)
        
        sessionStorage.setItem('hasCookie', respJson.hasCookie)
        return respJson.hasCookie
        
    } catch (error) {
        console.log(error)
    }
}