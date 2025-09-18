import Header from './components/Header';
import HeroSection from './components/HeroSection';
import GameDetails from './components/GameDetails';
import RelatedGames from './components/RelatedGames';

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <GameDetails />
      <RelatedGames />
    </div>
  );
}
