import Link from 'next/link';
import Image from 'next/image';
import { Star, Tag } from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch, BsPcDisplay } from "react-icons/bs";
import styles from './GameCard.module.scss';

// Mapeamento de ícones
const platformIcons = {
  xbox: <FaXbox size={16} />,
  playstation: <FaPlaystation size={16} />,
  steam: <FaSteam size={16} />,
  'nintendo switch': <BsNintendoSwitch size={15} />,
  pc: <BsPcDisplay size={15} />
};

// Define a ordem de exibição desejada para as plataformas
const platformOrder = ['pc', 'playstation', 'xbox', 'nintendo switch', 'steam'];

const GameCard = ({ game }) => {
  if (!game) return null;

  // Unifica a lógica de preço
  const price = game.discountedPrice ?? game.price;
  const oldPrice = game.originalPrice ?? (game.oldPrice > price ? game.oldPrice : null);
  
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  // Ordena as plataformas do jogo
  const sortedPlatforms = game.platforms
    ? [...game.platforms].sort((a, b) => {
        const platformA = a.toLowerCase();
        const platformB = b.toLowerCase();
        const indexA = platformOrder.indexOf(platformA);
        const indexB = platformOrder.indexOf(platformB);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      })
    : [];

  return (
    <Link href={`/product/${game.id}`} className={styles.gameCard}>
      <div className={styles.imageContainer}>
        <Image
          src={game.headerImageUrl || game.coverImageUrl || '/placeholder.jpg'}
          alt={game.title}
          layout="fill"
          objectFit="cover"
          className={styles.gameImage}
        />
        <div className={styles.platformIcons}>
          {sortedPlatforms.map(platform => (
            <span key={platform} title={platform}>
              {platformIcons[platform.toLowerCase()] || platformIcons.pc}
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
          <span className={styles.gameTags}>{(game.categories || []).join(', ')}</span>
        </div>
        <div className={styles.ratingInfo}>
          <Star size={16} className={styles.starIcon} />
          <span>{game.rating || 'N/A'}</span>
        </div>
      </div>
      <div className={styles.priceSection}>
        <div className={styles.priceContainer}>
          {discount > 0 && oldPrice && (
            <span className={styles.originalPrice}>
              R$ {oldPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
          <p className={styles.gamePrice}>
            R$ {price ? price.toFixed(2).replace('.', ',') : 'N/A'}
          </p>
        </div>
      </div>
      {discount > 0 && <span className={styles.discountBadge}>-{discount}%</span>}
    </Link>
  );
};

export default GameCard;

