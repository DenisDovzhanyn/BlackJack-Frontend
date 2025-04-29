

export const sendLoginOrRegister = async (username: string, password: string, isLogin: boolean) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BASE_API}/auth/${isLogin ? 'login' : 'register'}` ,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password})
                
            }
        )
        const respJson = await resp.json()
        if (resp.status != 200) return Error(respJson.error)
        
        sessionStorage.setItem('id', respJson.id)
        return respJson.id
        
    } catch (error) {
        console.log(error)
    }
}

