import './indexShowCards.css'

const ShowCards = props => {
  const {evalMatch, showCard, image, id} = props

  const triggerEvalMatch = () => {
    evalMatch(id)
  }

  return (
    <button type="button" onClick={triggerEvalMatch} className="cards-btn">
      <img
        alt="cards-pic"
        className="cards-img"
        src={
          showCard
            ? image
            : 'https://www.deckofcardsapi.com/static/img/back.png'
        }
      />
    </button>
  )
}

export default ShowCards
