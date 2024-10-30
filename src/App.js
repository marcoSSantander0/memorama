import Title from './js/Title.js'
import Instructions from './js/Instructions.js';
import Game from './js/Game.js';

function App() {
  return (
    <div className="App">
      <header>
        <Title/>
        <Instructions/>
        </header>
        <Game/>
    </div> 
  ); 
}

export default App;
