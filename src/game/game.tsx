import './game.css'
import { User } from '../models/user'
export const Game = ({user}: {user: User}) => {

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

                </div>
            </div>
            <div id='right-side'>

            </div>
        </div>
    )
}