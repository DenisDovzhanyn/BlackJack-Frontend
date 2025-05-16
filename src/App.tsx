import { useContext, useEffect, useState } from 'react'
import { isLoggedInContext } from './isLoggedInContext'
import './App.css'
import { Login } from './login/login'
import { Game } from './game/game'
import { getUserInfo } from './services/user'
import { User } from './models/user'

function App() {
  const [id, setId] = useState('')
  const [user, setUser] = useState<null | User>(null)

  useEffect(() => {
    const hasId = sessionStorage.getItem('id')
    if (hasId) {
      
      const getUserData = async () => {
        const resp = await getUserInfo(hasId)
        if (resp instanceof Error || resp === undefined) {
          setId('')
        } else {
          setUser(resp)
        }
      }

      getUserData()
    }
  }, [id])

  if (!user) return (
    <isLoggedInContext.Provider value={{id, setId}}>
      <Login/>
    </isLoggedInContext.Provider>
    
  )

  return (
    <Game user={user}>

    </Game>
  )
}



export default App
