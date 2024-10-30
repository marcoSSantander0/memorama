import React, {useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'live_UBaaLk943chl4PdNIwS0NLUjBeTm6FjtTcZrOpkT5NDKOr7h9Xg5okF2JzQa73sO';

const Memorama = () => {
    const [cards, setCards] = useState([]);
    const [firstCard, setFirstCard] = useState(null);
    const [secondCard, setSecondCard] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const fetchGatitos = async () => {
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search',
                {
                    params: {limit: 8},
                    headers: {
                        'x-api-key': API_KEY
                    }
                });
            const fetchedImages = response.data;
            const cardsData = fetchedImages.concat(fetchedImages)
                    .map(image => ({ id: Math.random(), value: image.url, matched: false}))
                    .sort(()=> Math.random() - 0.5); 
            setCards(cardsData);   
        }catch(error){
            console.log("No se pudieron obtener las imagenes", error);
        }
    };

    useEffect(()=>{
        fetchGatitos();
    },[]);

    const handleCardClick = (card) => {
        if(disabled) return;
        if(!firstCard){
            setFirstCard(card);
        }else if (!secondCard){
            setSecondCard(card);
            setDisabled(true);
        }
    };

    useEffect(() => {
        if (firstCard && secondCard) {
          if (firstCard.value === secondCard.value) {
            setCards(prevCards =>
              prevCards.map(card => {
                if (card.value === firstCard.value) {
                  return { ...card, matched: true };
                }
                return card;
              })
            );
            resetTurn();
          } else {
            setTimeout(() => resetTurn(), 1000);
          }
        }
      }, [secondCard]);
      
      const resetTurn = () => {
        setFirstCard(null);
        setSecondCard(null);
        setDisabled(false);
      };
      
      return (
        <div className="memorama">
          <h1>Memorama con Gatos 🐱</h1>
          <div className="grid">
            {cards.map(card => (
              <div
                key={card.id}
                className={`card ${card === firstCard || card === secondCard || card.matched ? 'flipped' : ''}`}
                onClick={() => handleCardClick(card)}
              >
                <div className="front">?</div>
                <div className="back">
                  <img src={card.value} alt="Gato" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
}


export default Memorama;