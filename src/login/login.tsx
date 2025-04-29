import React, { ChangeEvent, useContext, useState } from "react"
import './login.css'
import playingCard from '../assets/SVG-cards-1.3/black-playing-card-back-25478.svg'
import { sendLoginOrRegister } from "../services/authentication"
import { isLoggedInContext } from "../isLoggedInContext"
export const Login = () => {
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const {id, setId} = useContext(isLoggedInContext)

    const handleOnClick = (source: string) => async () => {
        const resp = await sendLoginOrRegister(username, password, source == 'Login' ? true : false)
        
        if (resp instanceof Error) setError(resp.message)
            else setId(resp)
    }
    
    return (
        <div id="loginPage">
            <div id="formCard"> 
                <img src={playingCard} id="loginCardImage"></img>
                <div id="inputContainer">
                    <input className="loginCardInput" placeholder="username" onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        style={{border: error ? '1px red solid' : ''}}></input>
                    <input className="loginCardInput" placeholder="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        style={{border: error ? '1px red solid' : ''}}></input>
                    
                    {error ? <p style={{color: 'white', margin: 0, padding: 0}}>{error}</p> : ''}
                </div>
                <div id="buttonContainer">
                    <button className="loginCardButton" onClick={handleOnClick('Register')}>Register</button>
                    <button className="loginCardButton" onClick={handleOnClick('Login')}>Login</button>
                </div>
            </div>

        </div>
    )
}