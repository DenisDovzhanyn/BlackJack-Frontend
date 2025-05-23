export interface GameDto {
    isGameOver: boolean,
    playerHand: Hand,
    dealerHand: Hand,
    betAmount: number,
    stand?: boolean,
    insurance?: boolean,
    insuranceBet?: number,
    turnCount?: number
}

export interface Hand {
    cards: Card[],
    handValue: number
}

export interface Card {
    value: number;
    suit: string;
    id: number
    name?: string;
    isFacingUp: boolean;
}

