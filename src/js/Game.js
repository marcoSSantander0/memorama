import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'live_UBaaLk943chl4PdNIwS0NLUjBeTm6FjtTcZrOpkT5NDKOr7h9Xg5okF2JzQa73sO';
let cardsNull = [{matched: false}];

const Memorama = () => {
    const [cards, setCards] = useState(cardsNull);
    const [firstCard, setFirstCard] = useState(null);
    const [secondCard, setSecondCard] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [firstPlayer, setFirstPlayer] = useState(null);
    const [secondPlayer, setSecondPlayer] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [winner, setWinner] = useState("");

    const fetchGatitos = async () => {
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
                params: { limit: 8 },
                headers: {
                    'x-api-key': API_KEY
                }
            });
            const fetchedImages = response.data;
            const cardsData = fetchedImages.concat(fetchedImages)
                .map(image => ({ id: Math.random(), value: image.url, matched: false }))
                .sort(() => Math.random() - 0.5);
            setCards(cardsData);
            setLoading(false); 
        } catch (error) {
            console.log("No se pudieron obtener las imagenes", error);
            setLoading(false); 
        }
    };

    const playersInit = () => {
        const player1 = { name: "P 1", points: 0};
        const player2 = { name: "P 2", points: 0};

        setFirstPlayer(player1);
        setSecondPlayer(player2);
        setCurrentPlayer(player1);
    };

    useEffect(() => {
        playersInit();
        fetchGatitos();
    }, []);

    const handleCardClick = (card) => {
        if (disabled) return;
        if (!firstCard) {
            setFirstCard(card);
        } else if (!secondCard) {
            setSecondCard(card);
            setDisabled(true);

        }
    };


    useEffect(() => {
        if (firstCard && secondCard) {
            if (firstCard === secondCard) {
                handleTurn();
                resetTurn();
                return;
            }
            if (firstCard.value === secondCard.value) {
                setCards(prevCards =>
                    prevCards.map(card => {
                        if (card.value === firstCard.value) {
                            return { ...card, matched: true };
                        }
                        return card;
                    })
                );
                handlePoints();
                resetTurn();
            } else {
                handleTurn();
                setTimeout(resetTurn, 1000);
            }
        }
    }, [firstCard, secondCard]);

    const resetTurn = () => {
        setFirstCard(null);
        setSecondCard(null);
        setDisabled(false);
    };

    const handleTurn = () => {
      if(currentPlayer.name === firstPlayer.name){
        setCurrentPlayer(secondPlayer);
      }else if (currentPlayer.name === secondPlayer.name){
        setCurrentPlayer(firstPlayer);
        
      }
    }

    const handlePoints = () => {
      if (currentPlayer.name  === firstPlayer.name) {
        setFirstPlayer(prev=> ({...firstPlayer, points: prev.points + 25}));
      }else if (currentPlayer.name === secondPlayer.name){
        setSecondPlayer(prev => ({...secondPlayer, points: prev.points + 25}));
      }

    }

    useEffect(() => {
      const intervalId = setInterval(() => {
          if (cards.every(card => card.matched)) {
              if(firstPlayer.points>secondPlayer.points){
                setCurrentPlayer(firstPlayer);
                setWinner(currentPlayer);
                }else if(secondPlayer.points>firstPlayer.points){
                    setCurrentPlayer(secondPlayer);
                    setWinner(currentPlayer);
              }
              clearInterval(intervalId);
          }
      }, 3000);

      return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
  }, [cards]);

    if (loading) {
        return <div>Cargando...</div>; // Mostrar un mensaje de carga
    }

    return (
        <div className="memorama">
            <div className='P1'>
                <h2>{firstPlayer.name}</h2>
                <h4>Puntaje: {firstPlayer.points}</h4>
                <img src={cards[1].value} alt='gato'></img>
            </div>
            <div>
                <h1>Memorama con Gatos 🐱</h1>
                <h3>Turno: {currentPlayer.name} </h3>
                <h1>{winner.name}</h1>
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
            <div className='P2'>
                <h2>{secondPlayer.name}</h2>
                <h4>Puntaje: {secondPlayer.points}</h4>
                <img src={cards[4].value} alt='gato'></img>
            </div>
        </div>
    );
};

export default Memorama;