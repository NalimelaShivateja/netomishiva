import {Component} from 'react'
import ShowCards from '../ShowCards/index'
import './index.css'

class DisplayCards extends Component {
  state = {
    cards: [],
    selectedCard: null,
    leastFlips: 0,
    currentFlips: 0,
    openedCards: [],
  }

  componentDidMount() {
    this.fetchCards()
  }

  fetchCards = async () => {
    const response = await fetch(
      'https://www.deckofcardsapi.com/api/deck/new/draw/?count=6',
    )
    const data = await response.json()
    const temp = []
    if (data.success) {
      for (let i = 0; i < data.cards.length; i += 1) {
        temp.push({...data.cards[i], showCard: false, id: i})
      }
      let x = data.cards.length
      for (let i = 0; i < data.cards.length; i += 1) {
        temp.push({...data.cards[i], showCard: false, id: x})
        x += 1
      }
      this.setState({cards: temp.sort(() => Math.random() - 0.5)})
    } else {
      console.log('Server Error')
    }
  }

  evalMatch = id => {
    let {selectedCard} = this.state
    const {cards} = this.state
    const index = cards.findIndex(x => x.id === id)

    if (selectedCard === null) {
      selectedCard = cards[index]
      cards[index].showCard = true
      this.setState({selectedCard, cards})
      this.setState(prevState => ({currentFlips: prevState.currentFlips + 1}))
    } else {
      const selectedCardIndex = cards.findIndex(x => x.id === selectedCard.id)

      cards[index].showCard = true
      this.setState({cards})

      const timedEval = () => {
        setTimeout(() => {
          if (
            selectedCard.code === cards[index].code &&
            selectedCard.id !== cards[index].id
          ) {
            this.setState(prevState => ({
              currentFlips: prevState.currentFlips + 1,
            }))
            selectedCard = null
            this.setState({selectedCard})
            this.setState(prevState => ({
              openedCards: [
                ...prevState.openedCards,
                selectedCard,
                cards[index],
              ],
            }))
          } else if (selectedCard.id === cards[index].id) {
            console.log()
          } else {
            this.setState(prevState => ({
              currentFlips: prevState.currentFlips + 1,
            }))
            console.log('unmatched here')
            cards[index].showCard = false
            cards[selectedCardIndex].showCard = false
            selectedCard = null
            this.setState({selectedCard, cards})
          }
        }, 500)
      }
      this.setState({cards}, timedEval)
    }
  }

  playAgain = () => {
    const {cards, leastFlips, currentFlips} = this.state
    const temp = cards.map(x => ({...x, showCard: false}))
    //   x.showCard = false
    //   return
    // })
    if (leastFlips === 0 || currentFlips < leastFlips) {
      this.setState({
        cards: temp,
        selectedCard: null,
        leastFlips: currentFlips,
        currentFlips: 0,
        openedCards: [],
      })
      this.fetchCards()
    } else {
      this.setState({
        cards: temp,
        selectedCard: null,
        currentFlips: 0,
        openedCards: [],
      })
    }
  }

  renderResult = () => {
    const {currentFlips} = this.state
    return (
      <div className="result-container">
        <h1 className="score-details">Your Score: {currentFlips}</h1>
        <button
          type="button"
          onClick={this.playAgain}
          className="play-agina-btn"
        >
          Play Again
        </button>
      </div>
    )
  }

  renderCards = () => {
    const {cards} = this.state
    return (
      <ul className="cards-container">
        {cards.map(x => (
          <li key={x.id}>
            <ShowCards {...x} evalMatch={this.evalMatch} />
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {openedCards, cards, currentFlips, leastFlips} = this.state
    return (
      <div className="main-container">
        <div>
          <h1 className="game-heading">NETOMI ASSIGNMENT</h1>
          <div className="score-container">
            <h1 className="score-details">Current Flips: {currentFlips}</h1>
            <h1 className="score-details">Least Flips: {leastFlips}</h1>
          </div>
        </div>
        {openedCards.length === cards.length
          ? this.renderResult()
          : this.renderCards()}
      </div>
    )
  }
}

export default DisplayCards
