import './game.css'
import { User } from '../models/user'
import { useState } from 'react'
import minusFive from '../assets/SVG-cards-1.3/minusfive.svg'
import minusTen from '../assets/SVG-cards-1.3/minus10.svg'
import minusOneHundred from '../assets/SVG-cards-1.3/minus100.svg'
import plusFive from '../assets/SVG-cards-1.3/plusfive.svg'
import plusTen from '../assets/SVG-cards-1.3/plusten.svg'
import plusOneHundred from '../assets/SVG-cards-1.3/plus100.svg'
import { number } from 'motion'

export const Game = ({user}: {user: User}) => {
    const [betAmount, setBetAmount] = useState(0)
    const [gameState, setGameState] = useState(null)

    const handleSetBetAmount = (amount: number) => {
        if (betAmount + amount < 0 || betAmount + amount > user.balance) return
        setBetAmount(betAmount + amount)
    }

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
                <div id='dealer-side'>

                </div>
                <div id='player-side'>
                    <div id='player-cards'>

                    </div>
                    <div id='casino-chip-container'>
                        <div id='minus-side'>
                            <img src={minusFive} className='casino-chip' onClick={() => handleSetBetAmount(-5)}/>
                            <img src={minusTen} className='casino-chip' onClick={() => handleSetBetAmount(-10)}/>
                            <img src={minusOneHundred} className='casino-chip' onClick={() => handleSetBetAmount(-100)}/>
                        </div>
                        <div id='plus-side'>
                            <img src={plusFive} className='casino-chip' onClick={() => handleSetBetAmount(5)}/>
                            <img src={plusTen} className='casino-chip' onClick={() => handleSetBetAmount(10)}/>
                            <img src={plusOneHundred} className='casino-chip' onClick={() => handleSetBetAmount(100)}/>
                        </div>
                    </div>
                </div>
            </div>
            <div id='right-side'>
                <div id='top-right'>
                    <div id='bet-amount-display'>
                        Bet Amount: {betAmount}
                    </div>
                </div>
                <div id='bottom-right'>
                    <button 
                    id='insurance-button' 
                    className='game-button' 
                    >
                        Insurance Bet 
                    </button>
                    <button id='double-down-button' className='game-button'>Double Down</button>
                    <button 
                    id='bet-button' 
                    className='game-button' 
                    >
                        Place Bet 
                    </button>
                
               </div>
            </div>
        </div>
    ) //? How should i take input from user for insurance/regular bet?
    //? I could use a single input field and let them input it there
    //? OR I could use a modal and make a little pop up?
    //? We also need to check whether we can place an insurance bet OR double down in the first
    //? place. the button should be disabled if they cant place either
    //TODO FIX UGLINESS
    
}