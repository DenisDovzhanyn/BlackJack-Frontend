import { ChangeEvent, useState } from "react"
import './login.css'
import playingCard from '../assets/SVG-cards-1.3/black-playing-card-back-25478.svg'
import { sendLogin } from "../services/authentication"
export const Login = () => {
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const handleOnClick = async () => {
        await sendLogin(username, password)
        
    }
    
    return (
        <div id="loginPage">
            <div id="formCard"> 
                <img src={playingCard} id="loginCardImage"></img>
                <div id="inputContainer">
                    <input className="loginCardInput" placeholder="username" onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}></input>
                    <input className="loginCardInput" placeholder="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}></input>
                </div>
                <div id="buttonContainer">
                    <button className="loginCardButton">Register</button>
                    <button className="loginCardButton" onClick={handleOnClick}>Login</button>
                </div>
            </div>

        </div>
    )
}