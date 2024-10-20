import { t } from '$lib/i18n';

interface Card {
  rank: string;
  suit: string;
}

export class GameState {
  deck: Card[] = [];
  currentCard: Card = $state({ rank: '', suit: '' });
  nextCard: Card = $state({ rank: '', suit: '' });
  balance: number = $state(100);
  currentBet: number = $state(1);
  nextCardRevealed: boolean = $state(false);
  resultMessage: string = $state('');

  constructor() {
    this.initializeDeck();
    this.shuffleDeck();
    this.dealCards();
  }

  initializeDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        this.deck.push({ rank, suit });
      }
    }
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCards() {
    this.currentCard = this.deck.pop()!;
    this.nextCard = this.deck.pop()!;
    this.nextCardRevealed = false;
  }

  setBet(amount: number) {
    this.currentBet = Math.max(1, Math.min(amount, this.balance));
  }

  makeGuess(isHigher: boolean) {
    this.nextCardRevealed = true;
    const currentValue = this.getCardValue(this.currentCard);
    const nextValue = this.getCardValue(this.nextCard);

    if ((isHigher && nextValue > currentValue) || (!isHigher && nextValue < currentValue)) {
      this.balance += this.currentBet;
      this.resultMessage = t.get()('correct_guess', { amount: this.currentBet });
    } else if (nextValue === currentValue) {
      this.resultMessage = t.get()('tie');
    } else {
      this.balance -= this.currentBet;
      this.resultMessage = t.get()('incorrect_guess', { amount: this.currentBet });
    }

    if (this.balance <= 0) {
      this.resultMessage = t.get()('game_over');
    }
  }

  getCardValue(card: Card): number {
    const rankValues: { [key: string]: number } = {
      'A': 14, 'K': 13, 'Q': 12, 'J': 11
    };
    return rankValues[card.rank] || parseInt(card.rank);
  }

  nextRound() {
    if (this.balance > 0) {
      this.dealCards();
      this.resultMessage = '';
    } else {
      this.restartGame();
    }
  }

  restartGame() {
    this.balance = 100;
    this.currentBet = 1;
    this.initializeDeck();
    this.shuffleDeck();
    this.dealCards();
    this.resultMessage = '';
  }
}
