

export const sendLogin = async (username: string, password: string) => {
    console.log(import.meta.env.VITE_BASE_API)
    try {
        await fetch(`${import.meta.env.VITE_BASE_API}/auth/login`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password})
                
            }
        )
    } catch (error) {
        console.log(error)
    }
}