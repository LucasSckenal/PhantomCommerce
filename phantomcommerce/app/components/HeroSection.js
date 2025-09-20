'use client';

import { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Star, Gamepad2, Monitor, Tv } from 'lucide-react';
import styles from '../styles/HeroSection.module.scss';

// Mapeamento de plataformas para ícones
const platformIcons = {
  xbox: <Gamepad2 size={20} />,
  playstation: <Tv size={20} />, // Usando um ícone diferente para variar
  steam: <Monitor size={20} />,
};

export default function HeroSection({ game }) {
  // Define a imagem principal inicial como a miniatura do vídeo
  const [activeImage, setActiveImage] = useState(game.videoThumbnail);
  
  // Calcula a porcentagem de desconto
  const discountPercentage = Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100);

  return (
    <div className={styles.heroWrapper}>
      {/* Banner de fundo com sobreposição */}
      <div className={styles.banner} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(26, 28, 41, 0.8) 70%, rgba(26, 28, 41, 1) 100%), url('${game.bannerImage}')` }}>
        <div className={styles.bannerOverlay}></div>
      </div>
      
      <main className={`${styles.mainContent} container`}>
        {/* Seção do Título e Preço */}
        <section className={styles.titleSection}>
          <h1 className={styles.gameTitle}>
            {game.title}
          </h1>

          {/* Seção de Metadados do Jogo */}
          <div className={styles.gameMeta}>
            <span className={styles.metaItem}>
              <Star size={16} /> {game.rating}
            </span>
            <span className={styles.metaItem}>
              Lançamento: {game.releaseDate}
            </span>
            <div className={styles.platformIcons}>
              {game.platforms.map(platform => (
                <span key={platform} title={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                  {platformIcons[platform] || platform}
                </span>
              ))}
            </div>
            <span className={`${styles.metaItem} ${styles.classificationBadge}`}>
              {game.classification}
            </span>
          </div>
          
          <div className={styles.priceInfo}>
            <span className={styles.discountedPrice}>R$ {game.discountedPrice.toFixed(2)}</span>
            <span className={styles.originalPrice}>R$ {game.originalPrice.toFixed(2)}</span>
            <span className={styles.saveBadge}>{discountPercentage}% OFF</span>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.addButton}>Realizar preorder</button>
            <button className={styles.trailerButton}>
              Ver trailer <Play size={16} />
            </button>
          </div>
        </section>

        {/* Seção principal com galeria e card de compra */}
        <section className={styles.mediaAndPurchase}>
          <div className={styles.mediaGallery}>
            <div className={styles.mainMedia}>
              <img src={activeImage} alt="Visualização do jogo" className={styles.mainImage}/>
              <button className={styles.playButton}>
                <Play />
              </button>
            </div>
            <div className={styles.thumbnailStrip}>
              <button className={styles.thumbNav}><ChevronLeft size={20}/></button>
              <div className={styles.thumbnails}>
                {/* Mapeia a galeria para criar as miniaturas */}
                {game.gallery.map((img, index) => (
                  <div key={index} className={styles.thumbnail} onClick={() => setActiveImage(img)}>
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button className={styles.thumbNav}><ChevronRight size={20}/></button>
            </div>
          </div>

          <div className={styles.purchaseCard}>
            <div className={styles.priceInfo} style={{marginBottom: '1rem'}}>
               <span className={styles.discountedPrice}>R$ {game.discountedPrice.toFixed(2)}</span>
               <span className={styles.originalPrice}>R$ {game.originalPrice.toFixed(2)}</span>
            </div>
            <button className={styles.addButton}>Comprar Agora</button>
            <p className={styles.gameDescription}>{game.description}</p>
            <p className={styles.releaseDate}>Lançamento: {game.releaseDate}</p>
            
            <div className={styles.requirements}>
              <div>
                <h3 className={styles.reqTitle}>Requisitos Mínimos</h3>
                <ul className={styles.reqList}>
                  <li><strong>CPU:</strong> <span>{game.systemRequirements.minimum.cpu}</span></li>
                  <li><strong>RAM:</strong> <span>{game.systemRequirements.minimum.ram}</span></li>
                  <li><strong>GPU:</strong> <span>{game.systemRequirements.minimum.gpu}</span></li>
                  <li><strong>Armazenamento:</strong> <span>{game.systemRequirements.minimum.storage}</span></li>
                </ul>
              </div>
              <div>
                <h3 className={styles.reqTitle}>Requisitos Recomendados</h3>
                <ul className={styles.reqList}>
                   <li><strong>CPU:</strong> <span>{game.systemRequirements.recommended.cpu}</span></li>
                  <li><strong>RAM:</strong> <span>{game.systemRequirements.recommended.ram}</span></li>
                  <li><strong>GPU:</strong> <span>{game.systemRequirements.recommended.gpu}</span></li>
                  <li><strong>Armazenamento:</strong> <span>{game.systemRequirements.recommended.storage}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
