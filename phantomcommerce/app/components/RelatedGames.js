import gameData from '../data/gameData.json';
import Link from 'next/link';
import { Star } from 'lucide-react';
import styles from '../styles/RelatedGames.module.scss';

export default function RelatedGames({ games }) {
  return (
    <section className={`${styles.relatedSection} container`}>
      <h2 className={styles.sectionTitle}>Jogos Relacionados</h2>
      <div className={styles.gamesGrid}>
        {games.map(game => {
          const exists = gameData.some(g => g.id === game.id);

          return (
            <div key={game.id} className={styles.gameCard}>
              <img src={game.image} alt={game.title} className={styles.gameImage} />

              <div className={styles.overlay}>
                <div className={styles.hoverContent}>
                  {exists ? (
                    <Link href={`/product/${game.id}`}>
                      <button className={styles.viewMoreButton}>
                        Ver mais
                      </button>
                    </Link>
                  ) : (
                    <button className={styles.viewMoreButton} disabled>
                      Indisponível
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.cardBody}>
                <div>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <div className={styles.ratingInfo}>
                    <Star size={16} className={styles.starIcon} />
                    <span>{game.rating}</span>
                    <span className={styles.reviews}>({game.reviews})</span>
                  </div>
                </div>
                <div className={styles.priceContainer}>
                  <p className={styles.gamePrice}>R$ {game.price.toFixed(2)}</p>
                  <span className={styles.discountBadge}>-25%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
