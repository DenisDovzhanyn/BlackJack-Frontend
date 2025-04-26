import { useEffect, useState } from 'react'
import './App.css'
import { Login } from './login/login'

function App() {
  const [cookie, setCookie] = useState('')

  useEffect(() => {
    const hasCookie = sessionStorage.getItem('sessionToken') 

    if (hasCookie) setCookie(hasCookie)
  }, [])

  if (!cookie) return (
    <Login>

    </Login>
  )

  return (
    <div>

    </div>
  )
}

export default App
