import './game.css'
import { User } from '../models/user'
import { useState } from 'react'
export const Game = ({user}: {user: User}) => {
    const [betAmount, setBetAmount] = useState(0)
    const [source, setSource] = useState('Bet Amount')
    const [gameState, setGameState] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div id='game-screen'>
            <div id='left-side'>
                <div id='username-text'>
                    {user.username}
                </div>
                <div id='balance-and-totalprofits-container'>
                    <div id='balance-container'>
                        <div id='balance-text'>
                            {'Balance:'}
                        </div>
                        <div id='balance-amount'>
                            {user.balance}
                        </div>
                    </div>
                    <div id='totalprofits-container'>
                        <div id='totalprofits-text'>
                            {'TotalProfits:'}
                        </div>
                        <div id='totalprofits-amount'>
                            {user.totalProfits}
                        </div>
                    </div>
                </div>
            </div>
            <div id='main-stage'>
                <dialog id='bet-amount-modal' open={isModalOpen}>
                    <label id='modal-label'>
                        {source}
                        <input id='bet-input' type='number' value={betAmount == 0 ? '' : betAmount} onChange={(e) => setBetAmount(Number(e.target.value))}></input>
                    </label>
                    <button id='modal-submit'>Place</button>
                </dialog>
                <div id='dealer-side'>

                </div>
                <div id='player-side'>

                </div>
            </div>
            <div id='right-side'>
                
                <button 
                id='insurance-button' 
                className='game-button' 
                onClick={
                    () => {
                    const sourcePreChange = source
                    setSource('Insurance Bet Amount')
                    setBetAmount(0)
                    setIsModalOpen(isModalOpen && sourcePreChange == 'Insurance Bet Amount' ? false : true)
                }}>
                    Insurance Bet 
                </button>
                <button id='double-down-button' className='game-button'>Double Down</button>
                <button 
                id='bet-button' 
                className='game-button' 
                onClick={
                    () => {
                    const sourcePreChange = source
                    setSource('Bet Amount')
                    setBetAmount(0)
                    setIsModalOpen(isModalOpen && sourcePreChange == 'Bet Amount' ? false : true)
                }}>
                    Place Bet 
                </button>
                
               
            </div>
        </div>
    ) //? How should i take input from user for insurance/regular bet?
    //? I could use a single input field and let them input it there
    //? OR I could use a modal and make a little pop up?
    //? We also need to check whether we can place an insurance bet OR double down in the first
    //? place. the button should be disabled if they cant place either
    //TODO FIX UGLINESS
    
}