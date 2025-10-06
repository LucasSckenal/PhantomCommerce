'use client'; // Necessário para usar hooks como o useContext (useProduct)

import Link from 'next/link';
import { Star } from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch, BsPcDisplay } from "react-icons/bs";
import styles from './RelatedGames.module.scss';
import { useProduct } from '../../contexts/ProductContext'; // 1. Importe o hook do seu contexto

// Mapeamento de plataformas para ícones (sem alterações)
const platformIcons = {
  Xbox: <FaXbox size={15} />,
  PlayStation: <FaPlaystation size={15} />,
  Steam: <FaSteam size={15} />,
  'Nintendo Switch': <BsNintendoSwitch size={15} />,
  PC: <BsPcDisplay size={15} />
};

export default function RelatedGames() { // 2. Remova a prop "games"
  // 3. Puxe os dados diretamente do contexto
  const { relatedGames } = useProduct();

  // Se não houver jogos relacionados, não renderiza a seção
  if (!relatedGames || relatedGames.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.relatedSection} container`}>
      <h2 className={styles.sectionTitle}>Jogos Relacionados</h2>
      <div className={styles.gamesGrid}>
        {relatedGames.map(game => {
          // 4. Lógica de preço e desconto baseada nos dados do Firebase/Context
          const hasDiscount = game.originalPrice && game.originalPrice > game.discountedPrice;
          const discountPercentage = hasDiscount 
            ? Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100)
            : 0;

          return (
            <div key={game.id} className={styles.gameCard}>
              <div className={styles.imageContainer}>
                
                <img src={game.headerImageUrl || game.coverImageUrl} alt={game.title} className={styles.gameImage} />
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
                  {/* 5. Removida a verificação com gameData.json. Se o jogo está aqui, ele existe. */}
                  <Link href={`/product/${game.id}`}>
                    <button className={styles.viewMoreButton}>
                      Ver mais
                    </button>
                  </Link>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <div className={styles.priceContainer}>
                     {/* Mostra o preço com desconto e risca o original se houver desconto */}
                    {hasDiscount && <p className={styles.gameOldPrice}>R$ {game.originalPrice.toFixed(2)}</p>}
                    <p className={styles.gamePrice}>R$ {game.discountedPrice.toFixed(2)}</p>
                  </div>
                  <div className={styles.ratingInfo}>
                    <Star size={16} className={styles.starIcon} />
                    <span>{game.rating}</span>
                  </div>
                </div>
              </div>
              
              {/* Selo de desconto só aparece se o desconto for maior que 0 */}
              {hasDiscount && <span className={styles.discountBadge}>-{discountPercentage}%</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}