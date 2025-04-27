import React, { ChangeEvent, useContext, useState } from "react"
import './login.css'
import playingCard from '../assets/SVG-cards-1.3/black-playing-card-back-25478.svg'
import { sendLogin } from "../services/authentication"
import { isLoggedInContext } from "../isLoggedInContext"
export const Login = () => {
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const {cookie, setCookie} = useContext(isLoggedInContext)

    const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const buttonPressed =  event.currentTarget.innerHTML
        const resp = buttonPressed == 'Login' ? await sendLogin(username, password) : 'hahaha what the hell'
        console.log(resp)
        if (resp instanceof Error) setError(resp.message)
            else setCookie(resp)
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
                    <button className="loginCardButton" onClick={handleOnClick}>Register</button>
                    <button className="loginCardButton" onClick={handleOnClick}>Login</button>
                </div>
            </div>

        </div>
    )
}