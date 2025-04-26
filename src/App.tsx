import { useContext, useEffect, useState } from 'react'
import { isLoggedInContext } from './isLoggedInContext'
import './App.css'
import { Login } from './login/login'



function App() {
  const [cookie, setCookie] = useState('')
  
  useEffect(() => {
    const hasCookie = sessionStorage.getItem('hasCookie')
    if (hasCookie) setCookie(hasCookie)
  }, [])

  if (!cookie) return (
    <isLoggedInContext.Provider value={{cookie, setCookie}}>
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
