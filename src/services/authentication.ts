

export const sendLogin = async (username: string, password: string) => {
    let err = ''

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

        if (resp.status != 200) {
            err = respJson.error
            return Error(err)
        }
        
        sessionStorage.setItem('hasCookie', respJson.hasCookie)
        return respJson.hasCookie
        
    } catch (error) {
        console.log(error)
    }
}