import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import GameDetails from './components/GameDetails/GameDetails';
import RelatedGames from './components/RelatedGames/RelatedGames';
import { gameData } from './data/gameData'; // Importa os dados do jogo

export default function Home() {
  return (
    <div>
      <Header />
      {/* Passa os dados para os componentes via props */}
      <HeroSection game={gameData} />
      <GameDetails game={gameData} />
      <RelatedGames games={gameData.relatedGames} />
    </div>
  );
}
