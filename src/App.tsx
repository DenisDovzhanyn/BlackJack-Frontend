import { useContext, useEffect, useState } from 'react'
import { isLoggedInContext } from './isLoggedInContext'
import './App.css'
import { Login } from './login/login'



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
    <div>
      what the fuck yo
    </div>
  )
}



export default App
