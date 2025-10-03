import Link from 'next/link';
import { Star, Tag } from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import styles from './GameGrid.module.scss';

// Mapeamento de ícones para plataformas
const platformIcons = {
  xbox: <FaXbox size={16} />,
  playstation: <FaPlaystation size={16} />,
  steam: <FaSteam size={16} />,
  nintendoSwitch: <BsNintendoSwitch size={16} />,
};

export default function GameGrid({ games }) {
  if (!games || games.length === 0) {
    return null; // Não renderiza nada se não houver jogos
  }

  return (
    <main className={styles.gameGrid}>
      {games.map(game => {
        const discount = Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100);
        
        return (
          <Link href={`/product/${game.id}`} key={game.id} className={styles.gameCard}>
            <div className={styles.imageContainer}>
              <img src={game.bannerImage} alt={game.title} className={styles.gameImage} />
              {/* Adicionando ícones da plataforma */}
              <div className={styles.platformIcons}>
                {game.platforms?.map(platform => (
                  <span key={platform} title={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                    {platformIcons[platform]}
                  </span>
                ))}
              </div>
              <div className={styles.overlay}>
                <div className={styles.viewMoreButton}>Ver mais</div>
              </div>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.gameTitle}>{game.title}</h3>
              <div className={styles.tagsContainer}>
                <Tag size={14} className={styles.tagIcon} />
                <span className={styles.gameTags}>{game.tags.join(', ')}</span>
              </div>
              <div className={styles.ratingInfo}>
                <Star size={16} className={styles.starIcon} />
                <span>{game.rating}</span>
              </div>
            </div>
            <div className={styles.priceSection}>
              <div className={styles.priceContainer}>
                {/* Lógica de preço ajustada para corresponder ao layout */}
                {discount > 0 && <span className={styles.originalPrice}>R$ {game.originalPrice.toFixed(2).replace('.', ',')}</span>}
                <p className={styles.gamePrice}>R$ {game.discountedPrice.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
            {/* O crachá de desconto agora será posicionado no canto inferior esquerdo */}
            {discount > 0 && <span className={styles.discountBadge}>-{discount}%</span>}
          </Link>
        );
      })}
    </main>
  );
}