import './game.css'
import { topEarner, User } from '../models/user'
import { useEffect, useState } from 'react'
import minusFive from '../assets/SVG-cards-1.3/minusfive.svg'
import minusTen from '../assets/SVG-cards-1.3/minus10.svg'
import minusOneHundred from '../assets/SVG-cards-1.3/minus100.svg'
import plusFive from '../assets/SVG-cards-1.3/plusfive.svg'
import plusTen from '../assets/SVG-cards-1.3/plusten.svg'
import plusOneHundred from '../assets/SVG-cards-1.3/plus100.svg'
import { AnimatePresence, motion } from 'motion/react'
import { hitOrStand, placeBet, doubleDown, getTopEarners } from '../services/gameService'
import { GameDto } from '../models/game'
import { getUserInfo } from '../services/user'

export const Game = ({user}: {user: User}) => {
    const assets = import.meta.glob<string>('../assets/SVG-cards-1.3/*.svg', {eager: true, query: '?url', import: 'default'});
    const ASSET_PATH = '../assets/SVG-cards-1.3/'
    const [balance, setBalance] = useState(user.balance)
    const [balanceDifference, setBalanceDifference] = useState(0)
    const [totalProfits, setTotalProfits] = useState(user.totalProfits)
    const [betAmount, setBetAmount] = useState(5)
    const [prevBetAmount, setPrevBetAmount] = useState(5)
    const [gameState, setGameState] = useState<GameDto | null>(null)
    const [insuranceDisabled, setInsuranceDisabled] = useState(true)
    const [doubleDownDisabled, setDoubleDownDisabled] = useState(true)
    const [hitOrStandDisabled, setHitOrStandDisabled] = useState(true)
    const [error, setError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [topEarners, setTopEarners] = useState<topEarner[]>([])

    const handleSetBetAmount = (amount: number) => {
        if (betAmount + amount < 5 || betAmount + amount > balance) return
        setPrevBetAmount(() => betAmount)
        setBetAmount((previousBetAmount) => previousBetAmount + amount)
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
                setBalance((prevBalance) => prevBalance - betAmount)
                setTotalProfits((totalProfits) => totalProfits - betAmount)
            }
        } else {
            const resp = await placeBet(user.id, betAmount, false)
            if (resp instanceof Error) {
                setError(resp.message)
            } else {
                setBalance((prevBalance) => prevBalance - betAmount)
                setBalanceDifference(() => -betAmount)
                setTotalProfits((prevTotalProfits) => prevTotalProfits - betAmount)
                setGameState(() => resp)
            }
        }
    }

    useEffect(() => {
        //* we only need to clear the error here right? if gamestate successfully changes then that means previous error
        //* is gone and no longer a problem. 
        setError('')
        if (topEarners.length < 1) {
            const getTopTen = async () => {
                const resp = await getTopEarners(user.id)
                if (resp instanceof Error) {
                    setError(() => resp.message)
                    return
                }

                setTopEarners(() => resp)
            }
            getTopTen()
        }
        if (!gameState || gameState.isGameOver) {
            setInsuranceDisabled(() => true)
            setDoubleDownDisabled(() => true)
            setHitOrStandDisabled(() => true)

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
            //* ran into a bug where if i lost a bet and my balance went under my bet amount, it wouldnt let me change the betAmount
            if (betAmount > balance) setBetAmount(() => balance)
            
        } else {
            setHitOrStandDisabled(() => false)

            if (gameState.dealerHand.cards[0].id === 0 && gameState.turnCount === 1 && !gameState.insuranceBet) {
                setInsuranceDisabled(() => false)
            } else {
                setInsuranceDisabled(() => true)
            }
            
            if (gameState.turnCount === 1 && balance >= gameState.betAmount) {
                setDoubleDownDisabled(() => false)
            } else {
                setDoubleDownDisabled(() => true)
            }
        }
    }, [gameState])

    return (
        <div id='game-screen'>
            <div id='modal-backdrop' style={isModalOpen ? {display: 'block'} : {display: 'none'}} onClick={() => {setIsModalOpen(() => false)}}></div>
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
                <AnimatePresence>
                    {isModalOpen && 
                    <motion.dialog open={isModalOpen} id='modal' initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        {'Top Earners'}
                        {topEarners.map((topEarner) => {
                            return <div className='top-earners' key={topEarner.username}>
                                <div>
                                    {topEarner.username}
                                </div>
                                <div>
                                    {topEarner.totalProfits}
                                </div>
                            </div>
                        })}
                    </motion.dialog>}
                </AnimatePresence>
                <div id='dealer-side'>
                    <AnimatePresence mode='popLayout'>
                        {gameState?.dealerHand.cards.map((card) => {
                            if (card.name === 'Blank') {
                                const url = `${ASSET_PATH}black-playing-card-back-25478.svg`
                                return <motion.img className='card' src= {assets[url] ? assets[url] : ''} whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}} key={card.id+card.suit+card.isFacingUp+card.name+card.value}/>
                            } else if (card.name !== 'Number') {
                                const url = `${ASSET_PATH + card.name?.toLowerCase()}_of_${card.suit.toLowerCase()}.svg`
                                return <motion.img className='card' src={assets[url] ? assets[url] : ''} whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}}  exit={{scale: 0}} key={card.id+card.suit+card.name+card.value+card.isFacingUp}/>
                            } else {
                                const url = `${ASSET_PATH + card.value}_of_${card.suit.toLowerCase()}.svg`
                                return <motion.img className='card' src={assets[url] ? assets[url] : ''} whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}}  exit={{scale: 0}} key={card.name+card.id+card.suit+card.isFacingUp+card.value}/>
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
                                    return <motion.img className='card' src={assets[url] ? assets[url] : ''}  whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}} key={card.suit+card.id+card.isFacingUp+card.name+card.value}/>
                                } else {
                                    const url = `${ASSET_PATH + card.value}_of_${card.suit.toLowerCase()}.svg`
                                    return <motion.img className='card' src={assets[url] ? assets[url] : ''} whileHover={{scale: 1.2}} initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}} key={card.value+card.id+card.suit+card.isFacingUp+card.name}/>
                            }
                            })}
                        </AnimatePresence>
                    </div>
                    <div id='casino-chip-container'>
                        <div id='minus-side'>
                            <motion.img src={minusFive} className='casino-chip' onClick={() => handleSetBetAmount(-5)} whileHover={{scale: 1.1}}/>
                            <motion.img src={minusTen} className='casino-chip' onClick={() => handleSetBetAmount(-10)} whileHover={{scale: 1.1}}/>
                            <motion.img src={minusOneHundred} className='casino-chip' onClick={() => handleSetBetAmount(-100)} whileHover={{scale: 1.1}}/>
                        </div>
                        <motion.button className='game-button' id='hit-btn' disabled={hitOrStandDisabled} onClick={() => {handleHitOrStand('hit')}} whileTap={{scale: 0.9}} whileHover={!hitOrStandDisabled ? {scale: 1.1} : ''}>
                            Hit
                        </motion.button>
                        <motion.button className='game-button' id='stand-btn' disabled={hitOrStandDisabled} onClick={() => {handleHitOrStand('stand')}} whileTap={{scale: 0.9}} whileHover={!hitOrStandDisabled ? {scale: 1.1} : ''}>
                            Stand
                        </motion.button>
                        <div id='plus-side'>
                            <motion.img src={plusFive} className='casino-chip' onClick={() => handleSetBetAmount(5)} whileHover={{scale: 1.1}}/>
                            <motion.img src={plusTen} className='casino-chip' onClick={() => handleSetBetAmount(10)} whileHover={{scale: 1.1}}/>
                            <motion.img src={plusOneHundred} className='casino-chip' onClick={() => handleSetBetAmount(100)} whileHover={{scale: 1.1}}/>
                        </div>
                    </div>
                </div>
            </div>
            <div id='right-side'>
                <div id='top-right'>
                    <div id='bet-amount-display'>
                        <div className='bet-amount'>
                            {'Bet Amount:'}
                        </div>
                        <motion.div className='bet-amount' key={betAmount} animate={prevBetAmount > betAmount ? {scale: [0.95, 1]} : {scale: [1.05, 1]}} transition={{duration: 0.2}}>
                            {betAmount}
                        </motion.div>
                    </div>
                    
                </div>
                <div id='bottom-right'>
                    <motion.button 
                    className='game-button' 
                    onClick={() => setIsModalOpen((prev) => !prev)} 
                    whileHover={{scale:1.1}} 
                    whileTap={{scale:0.9}}
                    style={{marginBottom: 50}}>
                        Top Earners
                    </motion.button>
                    <motion.button 
                    id='insurance-button' 
                    className='game-button'
                    disabled={insuranceDisabled}
                    whileHover={!insuranceDisabled ? {scale: 1.1} : ''}
                    whileTap={{scale: 0.9}}
                    onClick={() => {handlePlaceBet(true)}}>
                        Insurance Bet 
                    </motion.button>
                    <motion.button 
                    id='double-down-button' 
                    className='game-button' 
                    whileHover={!doubleDownDisabled ? {scale: 1.1} : ''} 
                    whileTap={{scale: 0.9}} 
                    onClick={() => {handleDoubleDown()}} 
                    disabled={doubleDownDisabled}>
                        Double Down
                    </motion.button>
                    <motion.button 
                    id='bet-button' 
                    className='game-button' 
                    disabled={gameState ? (gameState.isGameOver ? false : true) : false}
                    whileHover={gameState ? (gameState.isGameOver ? {scale: 1.1} : '') : {scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={() => {handlePlaceBet(false)}
                    }>
                        Place Bet 
                    </motion.button>
                
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