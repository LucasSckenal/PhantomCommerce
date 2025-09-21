// app/page.tsx
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import GameDetails from '@/components/GameDetails';
import RelatedGames from '@/components/RelatedGames';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Header />
      <main>
        <Hero />
        <GameDetails />
        <RelatedGames />
      </main>
    </div>
  );
}