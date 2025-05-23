

export const hitOrStand = async (id: string, source: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BASE_API}/game/${source}`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id})
                
            }
        )
        
        const respJson = await resp.json()

        if (resp.status != 200) {
            throw new Error(respJson.error)
        }

        //* this will return a game object. i should probably define what that'll look like
        return respJson
    } catch (err) {
        console.log(err)
        if (err instanceof Error) return err
    }
}

export const placeBet = async (id: string, betAmount: number, isInsuranceBet: boolean) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BASE_API}/game/${isInsuranceBet ? 'insurance' : 'placebet'}`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id, betAmount})
                
            }
        )

        const respJson = await resp.json()

        if (resp.status != 200) {
            throw new Error(respJson.error)
        }

        return respJson
    } catch (err) {
        console.log(err)
        if (err instanceof Error) return err
    }
}

export const stand = async (id: number) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BASE_API}/game/stand`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id})
                
            }
        )

        const respJson = await resp.json()

        if (resp.status != 200) {
            throw new Error(respJson.error)
        }

        return respJson
    } catch (err) {
        console.log(err)
        if (err instanceof Error) return err
    }
}

export const doubleDown = async (id: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BASE_API}/game/doubledown`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id})
                
            }
        )

        const respJson = await resp.json()

        if (resp.status != 200) throw new Error(respJson.error)
        
        return respJson
    } catch (err) {
        console.log(err)
        if (err instanceof Error) return err
    }
}