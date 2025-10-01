import gameData from '../../data/gameData.json';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import styles from './RelatedGames.module.scss';

// Mapeamento de plataformas para ícones
const platformIcons = {
  xbox: <FaXbox size={15} />,
  playstation: <FaPlaystation size={15} />, // Usando um ícone diferente para variar
  steam: <FaSteam size={15} />,
  nintendoSwitch: <BsNintendoSwitch size={15} />,
};

export default function RelatedGames({ games }) {
  return (
    <section className={`${styles.relatedSection} container`}>
      <h2 className={styles.sectionTitle}>Jogos Relacionados</h2>
      <div className={styles.gamesGrid}>
        {games.map(game => {
          const exists = gameData.some(g => g.id === game.id);

          return (
            <div key={game.id} className={styles.gameCard}>
              {/* Novo container para a imagem para aplicar o efeito de sombra */}
              <div className={styles.imageContainer}>
                <img src={game.image} alt={game.title} className={styles.gameImage} />
              </div>

              <div className={styles.platformIcons}>
                  {game.platforms?.map(platform => (
                    <span key={platform} title={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                      {platformIcons[platform] || platform}
                    </span>
                  ))}
                </div>

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
                  <div className={styles.priceContainer}>
                    <p className={styles.gamePrice}>R$ {game.price.toFixed(2)}</p>
                  </div>
                  <div className={styles.ratingInfo}>
                    <Star size={16} className={styles.starIcon} />
                    <span>{game.rating}</span>
                    <span className={styles.reviews}>({game.reviews})</span>  {/* Usar vocabulário GAMER, substituindo, por exemplo: 1000 por 1k*/}
                  </div>
                  <span className={styles.gameTags}>{game.tags.join(', ')}</span>
                </div>
              </div>
              
              {/* Selo de desconto movido para fora do cardBody para posicionamento absoluto */}
              <span className={styles.discountBadge}>-{game.discount}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
