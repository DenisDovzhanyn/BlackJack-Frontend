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
        //! I def should not be setting the id in a useeffect that depends on id lol
        //! I am really tired i need to make sure this is changed
        //TODO CHANGE THIS SO U DONT SET ID IN A USEEFFECT DEPENDENT ON ID
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
