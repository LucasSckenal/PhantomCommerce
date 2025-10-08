'use client';

import { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch, BsPcDisplay } from "react-icons/bs";
import { useCart } from '../../contexts/CartContext';
import styles from './HeroSection.module.scss';

// Mapeamento de plataformas para ícones
const platformIcons = {
  Xbox: <FaXbox size={15} />,
  PlayStation: <FaPlaystation size={15} />,
  Steam: <FaSteam size={15} />,
  'Nintendo Switch': <BsNintendoSwitch size={15} />,
  PC: <BsPcDisplay size={15} />
};

export default function HeroSection({ game }) {
  const [isViewingVideo, setIsViewingVideo] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const { addToCart, cartItems } = useCart();

  const isInCart = cartItems.some(item => item.id === game.id);

  const handleAddToCart = () => {
    const itemToAdd = {
        id: game.id,
        name: game.title,
        edition: 'Edição Padrão',
        price: game.discountedPrice,
        oldPrice: game.originalPrice,
        image: game.bannerImage || game.headerImageUrl,
    };
    addToCart(itemToAdd);
  };

  const hasDiscount = game.originalPrice && game.discountedPrice && game.originalPrice > game.discountedPrice;
  const gameDiscount = hasDiscount ? game.originalPrice - game.discountedPrice : 0;
  const discountPercentage = hasDiscount ? Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100) : 0;

  // --- Ajuste da data ---
  const gameRelease = new Date(game.releaseDate); // Firebase traz "YYYY-MM-DD"
  const today = new Date();
  const isReleased = today >= gameRelease;

  const formattedReleaseDate = gameRelease.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Pega o primeiro URL do array de trailers.
  const mainTrailerUrl = game.trailerUrls && game.trailerUrls.length > 0 ? game.trailerUrls[0] : '';

  // Extrai ID do YouTube (compatível com varios formatos)
  const extractYouTubeID = (url) => {
    if (!url) return null;
    try {
      const regex = /(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
      const m = url.match(regex);
      if (m && m[1]) return m[1];

      const q = url.split('?')[1] || '';
      const params = new URLSearchParams(q);
      if (params.has('v')) return params.get('v');

      return null;
    } catch (e) {
      console.warn('extractYouTubeID error', e);
      return null;
    }
  };

  // Gera URL da thumbnail do YouTube e define imagem ativa
  const youtubeId = extractYouTubeID(mainTrailerUrl);
  const youtubeThumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;
  const [activeImage, setActiveImage] = useState(youtubeThumbnailUrl || game.gallery[0]);

  useEffect(() => {
    setPlayerError(false);
  }, [mainTrailerUrl]);

  const handlePlayVideo = () => {
    if (!mainTrailerUrl) {
      console.warn('Nenhum trailer disponível em game.trailerUrls');
      return;
    }
    setPlayerError(false);
    setIsViewingVideo(true);
    setActiveImage(youtubeThumbnailUrl); 
  };

  const handleThumbnailClick = (img) => {
    setIsViewingVideo(false);
    setActiveImage(img);
  };

  return (
    <div className={styles.heroWrapper}>
      <div
        className={styles.banner}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(15, 20, 36, 0.8) 70%, rgba(15, 20, 36, 1) 100%), url('${game.headerImageUrl || game.coverImageUrl}')`
        }}
      >
        <div className={styles.bannerOverlay}></div>
      </div>
      
      <main className={`${styles.mainContent} container`}>
        <section className={styles.titleSection}>
          <h1 className={styles.gameTitle}>{game.title}</h1>
          <div className={styles.gameMeta}>
            <span className={styles.metaItem}><Star size={16} /> {game.rating}</span>
            <span className={styles.metaItem}>Lançamento: {formattedReleaseDate}</span>
            <div className={`${styles.metaItem} ${styles.platformIcons}`}>
              {game.platforms.map(platform => (
                <span key={platform} title={platform} className={styles.platformIconWrapper}>
                  {platformIcons[platform] || platform}
                </span>
              ))}
            </div>
            <span className={`${styles.metaItem} ${styles.classificationBadge}`}>{game.classification}</span>
          </div>
          <div className={styles.priceInfo}>
            {hasDiscount ? (
              <>
                <span className={styles.discountedPrice}>R$ {game.discountedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={styles.originalPrice}>R$ {game.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={styles.saveBadge}>{discountPercentage}% OFF</span>
              </>
            ) : (
              <span className={styles.discountedPrice}>R$ {game.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            )}
          </div>
          <div className={styles.buttonGroup}>
            <button
                className={styles.addButton}
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? 'NO CARRINHO' : (isReleased ? 'Comprar Agora' : 'Realizar PRÉ-VENDA')}
              </button>
            {mainTrailerUrl && (
              <button className={styles.trailerButton} onClick={handlePlayVideo}>
                <Heart/>
                Adicionar a lista de desejo
              </button>
            )}
          </div>
        </section>

        <section className={styles.mediaAndPurchase}>
          <div className={styles.mediaGallery}>
            <div className={styles.mainMedia} style={{ position: 'relative' }}>
              {isViewingVideo ? (
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
                    title="Trailer do jogo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '12px'
                    }}
                  />
                  <button
                    onClick={() => setIsViewingVideo(false)}
                    aria-label="Fechar trailer"
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 8px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      zIndex: 10
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={activeImage}
                    alt="Visualização do jogo"
                    className={styles.mainImage}
                  />
                  {!isViewingVideo && activeImage === youtubeThumbnailUrl && (
                    <button className={styles.playButton} onClick={handlePlayVideo}>
                      <Play />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className={styles.thumbnailStrip}>
              <button className={styles.thumbNav}><ChevronLeft size={40}/></button>
              <div className={styles.thumbnails}>

                {/* Renderiza a thumbnail do vídeo com o ícone de play */}
                {youtubeThumbnailUrl && (
                  <div 
                    className={`${styles.thumbnail} ${styles.videoThumbnail}`} 
                    onClick={() => handleThumbnailClick(youtubeThumbnailUrl)}
                  >
                    <img src={youtubeThumbnailUrl} alt="Trailer do Jogo" />
                    <div className={styles.videoOverlay}>
                      <Play size={28} />
                    </div>
                  </div>
                )}

                {/* Renderiza as outras imagens da galeria */}
                {game.gallery.map((img, index) => (
                  <div key={index} className={styles.thumbnail} onClick={() => handleThumbnailClick(img)}>
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button className={styles.thumbNav}><ChevronRight size={40}/></button>
            </div>
          </div>

          <div className={styles.purchaseCard}>
            <div className={styles.card}>
              <div className={styles.priceInfo}>
                {hasDiscount ? (
                  <>
                    <span className={styles.discountedPrice}>R$ {game.discountedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className={styles.originalPrice}>R$ {game.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </>
                ) : (
                  <span className={styles.discountedPrice}>R$ {game.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                )}
              </div>
              {hasDiscount && (
                <p style={{ color:`green`, fontWeight:`bold`, marginBottom:`12px` }}>
                  Você economiza {gameDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} reais
                </p>
              )}
               <button
                className={styles.addButton}
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? 'NO CARRINHO' : (isReleased ? 'Comprar Agora' : 'Realizar PRÉ-VENDA')}
              </button>
            </div>
            <div className={styles.requirements}>
              <div className={styles.card}>
                <h3 className={styles.reqTitle}>Requisitos Mínimos</h3>
                <ul className={styles.reqList}>
                  <li><strong>CPU:</strong> <span>{game.systemRequirements.minimum.cpu}</span></li>
                  <li><strong>RAM:</strong> <span>{game.systemRequirements.minimum.ram}</span></li>
                  <li><strong>GPU:</strong> <span>{game.systemRequirements.minimum.gpu}</span></li>
                  <li><strong>Armazenamento:</strong> <span>{game.systemRequirements.minimum.storage}</span></li>
                </ul>
              </div>
              <div className={styles.card}>
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
