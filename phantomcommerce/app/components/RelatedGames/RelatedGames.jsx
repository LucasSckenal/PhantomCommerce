'use client';

import { useProduct } from '../../contexts/ProductContext';
import GameCard from '../GameCard/GameCard';
import styles from './RelatedGames.module.scss';

export default function RelatedGames() {
  const { relatedGames } = useProduct();

  // Se não houver jogos relacionados, não renderiza a seção
  if (!relatedGames || relatedGames.length === 0) {
    return null;
  }
  

  return (
    <section className={`${styles.relatedSection} container`}>
      <h2 className={styles.sectionTitle}>Jogos Relacionados</h2>

      {/* Renderiza os cards diretamente em um container de grid */}
      <div className={styles.gamesGrid}>
        {relatedGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
