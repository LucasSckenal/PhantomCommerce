'use client';

import { Star } from 'lucide-react';
import styles from '../styles/RelatedGames.module.scss';

export default function RelatedGames() {
  const relatedGames = [
    {
      id: 1,
      title: 'DARK SOULS II',
      price: 69.99,
      originalPrice: 199.99,
      discount: 65,
      rating: 4.2,
      genres: ['RPG', 'Ação', 'Hack\'n Slash'],
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'DARK SOULS II',
      price: 69.99,
      originalPrice: 199.00,
      discount: 65,
      rating: 4.2,
      genres: ['RPG', 'Ação', 'Hack\'n Slash'],
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'DARK SOULS II',
      price: 69.99,
      originalPrice: 199.99,
      discount: 65,
      rating: 4.2,
      genres: ['RPG', 'Ação', 'Hack\'n Slash'],
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'DARK SOULS II',
      price: 69.99,
      originalPrice: 199.00,
      discount: 65,
      rating: 4.2,
      genres: ['RPG', 'Ação', 'Hack\'n Slash'],
      image: '/api/placeholder/300/200'
    }
  ];

  return (
    <section className={styles.relatedGames}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Jogos Relacionados</h2>
        
        <div className={styles.gamesGrid}>
          {relatedGames.map((game) => (
            <div key={game.id} className={styles.gameCard}>
              <div className={styles.gameImage}>
                <div className={styles.placeholder}></div>
                <div className={styles.discountBadge}>
                  {game.discount}% OFF
                </div>
              </div>
              
              <div className={styles.gameInfo}>
                <h3 className={styles.gameTitle}>{game.title}</h3>
                
                <div className={styles.rating}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < Math.floor(game.rating) ? "#fbbf24" : "none"} 
                        stroke="#fbbf24"
                      />
                    ))}
                    <span className={styles.ratingText}>{game.rating}</span>
                  </div>
                </div>
                
                <div className={styles.genres}>
                  {game.genres.map((genre, index) => (
                    <span key={index} className={styles.genreTag}>
                      {genre}
                    </span>
                  ))}
                </div>
                
                <div className={styles.pricing}>
                  <div className={styles.currentPrice}>R$ {game.price.toFixed(2).replace('.', ',')}</div>
                  <div className={styles.originalPrice}>R$ {game.originalPrice.toFixed(2).replace('.', ',')}</div>
                </div>
                
                <button className={styles.buyButton}>
                  IR COMPRAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
