import { useContext, useEffect, useState } from 'react'
import { isLoggedInContext } from './isLoggedInContext'
import './App.css'
import { Login } from './login/login'
import { Game } from './game/game'



function App() {
  const [id, setId] = useState('')
  
  useEffect(() => {
    const hasId = sessionStorage.getItem('id')
    if (hasId) setId(hasId)
  }, [])

  if (!id) return (
    <isLoggedInContext.Provider value={{id, setId}}>
      <Login/>
    </isLoggedInContext.Provider>
    
  )

  return (
    <Game>

    </Game>
  )
}



export default App
