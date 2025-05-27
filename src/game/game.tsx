import './game.css'
import { User } from '../models/user'
import { useEffect, useState } from 'react'
import minusFive from '../assets/SVG-cards-1.3/minusfive.svg'
import minusTen from '../assets/SVG-cards-1.3/minus10.svg'
import minusOneHundred from '../assets/SVG-cards-1.3/minus100.svg'
import plusFive from '../assets/SVG-cards-1.3/plusfive.svg'
import plusTen from '../assets/SVG-cards-1.3/plusten.svg'
import plusOneHundred from '../assets/SVG-cards-1.3/plus100.svg'
import { AnimatePresence, motion, scale } from 'motion/react'
import { hitOrStand, placeBet, doubleDown } from '../services/gameService'
import { GameDto } from '../models/game'
import { getUserInfo } from '../services/user'

export const Game = ({user}: {user: User}) => {
    const assets = import.meta.glob<string>('../assets/SVG-cards-1.3/*.svg', {eager: true, query: '?url', import: 'default'});
    const ASSET_PATH = '../assets/SVG-cards-1.3/'
    const [balance, setBalance] = useState(user.balance)
    const [balanceDifference, setBalanceDifference] = useState(0)
    const [totalProfits, setTotalProfits] = useState(user.totalProfits)
    const [betAmount, setBetAmount] = useState(5)
    const [gameState, setGameState] = useState<GameDto | null>(null)
    const [insuranceDisabled, setInsuranceDisabled] = useState(true)
    const [doubleDownDisabled, setDoubleDownDisabled] = useState(true)
    const [hitOrStandDisabled, setHitOrStandDisabled] = useState(true)
    const [error, setError] = useState('')

    const handleSetBetAmount = (amount: number) => {
        if (betAmount + amount < 5 || betAmount + amount > balance) return
        setBetAmount(() => betAmount + amount)
    }

    const handleHitOrStand = async (source: string) => {
        const response = await hitOrStand(user.id!, source)

        if (response instanceof Error) {
            setError(() => response.message)
            return
        }

        setGameState(() => response)
        
    }
    
    const handleDoubleDown = async () => {
        const response = await doubleDown(user.id)
        if (response instanceof Error) {
            setError(() => response.message)
            return
        }

        setGameState(() => response)
    }

    const handlePlaceBet = async (isInsuranceBet: boolean) => {
        if (betAmount > balance ) {
            setError(() => 'You dont have enough balance to place this bet')
            return
        } 

        if (isInsuranceBet) {
            if (betAmount > gameState!.betAmount / 2) {
                setError(() => 'Insurance bet must be less than or equal to half of original bet amount')
                return
            }
            const resp = await placeBet(user.id, betAmount, true)
            if (resp instanceof Error) {
                setError(() => resp.message)
            } else {
                setGameState(() => resp)
            }
        } else {
            const resp = await placeBet(user.id, betAmount, false)
            if (resp instanceof Error) {
                setError(resp.message)
            } else {
                setBalance(() => balance - betAmount)
                setBalanceDifference(() => -betAmount)
                setTotalProfits(() => totalProfits - betAmount)
                setGameState(() => resp)
            }
        }
    }

    useEffect(() => {
        //* we only need to clear the error here right? if gamestate successfully changes then that means previous error
        //* is gone and no longer a problem. 
        setError('')

        if (!gameState) {
            setInsuranceDisabled(() => true)
            setDoubleDownDisabled(() => true)
            setHitOrStandDisabled(() => true)
            return
        }

        if (!gameState.isGameOver) {
            setHitOrStandDisabled(() => false)
        } else {
            const updateBalance = async () => {
                const resp = await getUserInfo(user.id)
                if (resp instanceof Error) {
                    setError(() => resp.message)
                    return
                }
                if (resp!.balance !== balance) setBalanceDifference(() => resp!.balance - balance)
                setBalance(() => resp!.balance)
                setTotalProfits(() => resp!.totalProfits)
            }
            
            updateBalance()
            setHitOrStandDisabled(() => true)
        } 

        if (gameState.dealerHand.cards[0].id === 0 && gameState.turnCount === 1) {
            setInsuranceDisabled(() => false)
        } else {
            setInsuranceDisabled(() =>true)
        }
        
        if (gameState.turnCount === 1 && !gameState.isGameOver && balance >= gameState.betAmount) {
            setDoubleDownDisabled(() => false)
        } else {
            setDoubleDownDisabled(() => true)
        }
            
    }, [gameState])

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
                            {balance}
                        </div>
                        <motion.div id='balance-added' key={balance} style={{color: balanceDifference > 0 ? 'green' : 'red'}} animate={{opacity: [1,0], scale: [1.5, 1], rotateZ: Math.random() * 90, transition: {duration: 1.5}}}> 
                            {balanceDifference}
                        </motion.div>
                    </div>
                    <div id='totalprofits-container'>
                        <div id='totalprofits-text'>
                            {'TotalProfits:'}
                        </div>
                        <div id='totalprofits-amount'>
                            {totalProfits}
                        </div>
                        <motion.div className='balance-added' key={balance} style={{color: balanceDifference > 0 ? 'green' : 'red'}} animate={{opacity: [1,0], scale: [1.5, 1], rotateZ: Math.random() * 90, transition: {duration: 1.5}}}>
                            {balanceDifference}
                        </motion.div>
                    </div>
                </div>
            </div>
            <div id='main-stage'>
                <div id='dealer-side'>
                    <AnimatePresence mode='popLayout'>
                        {gameState?.dealerHand.cards.map((card) => {
                            if (card.name === 'Blank') {
                                const url = `${ASSET_PATH}black-playing-card-back-25478.svg`
                                return <motion.img className='card' src= {assets[url] ? assets[url] : ''} whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}} key={card.id+card.suit+card.name!}/>
                            } else if (card.name !== 'Number') {
                                const url = `${ASSET_PATH + card.name?.toLowerCase()}_of_${card.suit.toLowerCase()}.svg`
                                return <motion.img className='card' src={assets[url] ? assets[url] : ''} whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}}  exit={{scale: 0}} key={card.id+card.suit+card.name!}/>
                            } else {
                                const url = `${ASSET_PATH + card.value}_of_${card.suit.toLowerCase()}.svg`
                                return <motion.img className='card' src={assets[url] ? assets[url] : ''} whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}}  exit={{scale: 0}} key={card.id+card.suit+card.name!}/>
                            }
                    })}
                    </AnimatePresence>
                </div>
                <div id='middle-space'>{error ? error : ''}</div>
                <div id='player-side'>
                    <div id='player-cards'>
                        <AnimatePresence mode='wait'>
                            {gameState?.playerHand.cards.map((card) => {
                                if (card.name !== 'Number') {
                                    const url = `${ASSET_PATH + card.name?.toLowerCase()}_of_${card.suit.toLowerCase()}.svg`
                                    return <motion.img className='card' src={assets[url] ? assets[url] : ''}  whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}} key={card.id+card.suit+card.name!}/>
                                } else {
                                    const url = `${ASSET_PATH + card.value}_of_${card.suit.toLowerCase()}.svg`
                                    return <motion.img className='card' src={assets[url] ? assets[url] : ''} whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}} key={card.id+card.suit+card.name!}/>
                            }
                            })}
                        </AnimatePresence>
                    </div>
                    <div id='casino-chip-container'>
                        <div id='minus-side'>
                            <img src={minusFive} className='casino-chip' onClick={() => handleSetBetAmount(-5)}/>
                            <img src={minusTen} className='casino-chip' onClick={() => handleSetBetAmount(-10)}/>
                            <img src={minusOneHundred} className='casino-chip' onClick={() => handleSetBetAmount(-100)}/>
                        </div>
                        <button className='game-button' id='hit-btn' disabled={hitOrStandDisabled} onClick={() => {handleHitOrStand('hit')}}>
                            Hit
                        </button>
                        <button className='game-button' id='stand-btn' disabled={hitOrStandDisabled} onClick={() => {handleHitOrStand('stand')}}>
                            Stand
                        </button>
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
                    disabled={insuranceDisabled}
                    onClick={() => {handlePlaceBet(true)}}>
                        Insurance Bet 
                    </button>
                    <button id='double-down-button' className='game-button' onClick={() => {handleDoubleDown()}} disabled={doubleDownDisabled}>Double Down</button>
                    <button 
                    id='bet-button' 
                    className='game-button' 
                    onClick={() => {handlePlaceBet(false)}}
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