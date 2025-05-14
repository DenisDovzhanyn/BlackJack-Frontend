import React, { ChangeEvent, useContext, useState } from "react"
import './login.css'
import playingCard from '../assets/SVG-cards-1.3/black-playing-card-back-25478.svg'
import { sendLoginOrRegister } from "../services/authentication"
import { isLoggedInContext } from "../isLoggedInContext"
import { motion } from "motion/react"
export const Login = () => {
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const {id, setId} = useContext(isLoggedInContext)

    const handleOnClick = (source: string) => async () => {
        setIsLoading(true)
        const resp = await sendLoginOrRegister(username, password, source)
        
        if (resp instanceof Error) {
            setError(resp.message)
        } else {
            sessionStorage.setItem('id', resp)
            setId(resp)
        }
        setIsLoading(false)
    }
    
    return (
        <div id="loginPage">
            <div id="formCard"> 
                <motion.img 
                    src={playingCard} 
                    id="loginCardImage" 
                    initial={{rotate: 0}} 
                    animate= {isLoading ? {rotate: 360} : {rotate: 0}} 
                    transition={isLoading ? {duration: 3, repeat: Infinity} : {}}>
                </motion.img>
                <div id="inputContainer">
                    <input className="loginCardInput" placeholder="username" onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        style={{border: error ? '1px red solid' : ''}}></input>
                    <input className="loginCardInput" placeholder="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        style={{border: error ? '1px red solid' : ''}}></input>
                    
                    {error ? <p style={{color: 'white', margin: 0, padding: 0}}>{error}</p> : ''}
                </div>
                <div id="buttonContainer">
                    <button className="loginCardButton" onClick={handleOnClick('register')}>Register</button>
                    <button className="loginCardButton" onClick={handleOnClick('login')}>Login</button>
                </div>
            </div>

        </div>
    )
}