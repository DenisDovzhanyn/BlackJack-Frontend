import './game.css'
import { User } from '../models/user'
import { useState } from 'react'
export const Game = ({user}: {user: User}) => {
    const [betAmount, setBetAmount] = useState(0)
    const [source, setSource] = useState('Bet Amount')

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
                <dialog id='bet-amount-modal' open>
                    <label>
                        {source}
                        <input id='bet-input' type='number' value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))}></input>
                    </label>
                </dialog>
                <div id='dealer-side'>

                </div>
                <div id='player-side'>

                </div>
            </div>
            <div id='right-side'>
                
                <button id='insurance-button' className='game-button' onClick={() => setSource('Insurance Bet Amount')}>Insurance Bet</button>
                <button id='double-down-button' className='game-button'>Double Down</button>
                <button id='bet-button' className='game-button' onClick={() => setSource('Bet Amount')}>Place Bet</button>
                
               
            </div>
        </div>
    ) //? How should i take input from user for insurance/regular bet?
    //? I could use a single input field and let them input it there
    //? OR I could use a modal and make a little pop up?
}