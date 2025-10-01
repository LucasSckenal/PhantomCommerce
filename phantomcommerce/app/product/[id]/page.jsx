import gameData from '../../data/gameData.json';
import HeroSection from '../../components/HeroSection/HeroSection';
import GameDetails from '../../components/GameDetails/GameDetails';
import RelatedGames from '../../components/RelatedGames/RelatedGames';
import Header from '../../components/Header/Header';

// Recebe os parâmetros da rota
export default function ProductPage({ params }) {
  const { id } = params;
  const game = gameData.find(g => g.id === parseInt(id));

  if (!game) {
    return <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Jogo não encontrado</h1>;
  }

  return (
    <>
      <Header />
      <HeroSection game={game} />
      <GameDetails game={game} />
      <RelatedGames games={game.relatedGames} />
    </>
  );
}
