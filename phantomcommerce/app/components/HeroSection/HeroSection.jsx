'use client';

import { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch, BsPcDisplay } from "react-icons/bs";
import ReactPlayer from 'react-player';
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
  const [activeImage, setActiveImage] = useState(game.videoThumbnail);
  const [isViewingVideo, setIsViewingVideo] = useState(false);
  const [playerError, setPlayerError] = useState(false);

  const hasDiscount = game.originalPrice && game.discountedPrice && game.originalPrice > game.discountedPrice;
  const gameDiscount = hasDiscount ? game.originalPrice - game.discountedPrice : 0;
  const discountPercentage = hasDiscount ? Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100) : 0;

  const today = new Date();
  const [day, month, year] = game.releaseDate.split('/');
  const gameRelease = new Date(`${year}-${month}-${day}T00:00:00`);
  const isReleased = today >= gameRelease;

  // Pega o primeiro URL do array de trailers.
  const mainTrailerUrl = game.trailerUrls && game.trailerUrls.length > 0 ? game.trailerUrls[0] : '';

  // Extrai ID do YouTube (compatível com varios formatos)
  const extractYouTubeID = (url) => {
    if (!url) return null;
    try {
      // tenta extrair pelo padrão embed / youtu.be / v=
      const regex = /(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
      const m = url.match(regex);
      if (m && m[1]) return m[1];

      // fallback para query params (watch?v=)
      const q = url.split('?')[1] || '';
      const params = new URLSearchParams(q);
      if (params.has('v')) return params.get('v');

      return null;
    } catch (e) {
      console.warn('extractYouTubeID error', e);
      return null;
    }
  };

  const youtubeId = extractYouTubeID(mainTrailerUrl);
  const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0` : null;

  useEffect(() => {
    // debug: confirma a url que está chegando
    console.log('HeroSection - mainTrailerUrl:', mainTrailerUrl);
    console.log('HeroSection - youtubeId:', youtubeId);
    // reset de erro quando a URL mudar
    setPlayerError(false);
  }, [mainTrailerUrl]);

  const handlePlayVideo = () => {
    if (!mainTrailerUrl) {
      console.warn('Nenhum trailer disponível em game.trailerUrls');
      return;
    }
    setPlayerError(false);
    setIsViewingVideo(true);
    setActiveImage(game.videoThumbnail);
  };

  const handleThumbnailClick = (img) => {
    setIsViewingVideo(false);
    setActiveImage(img);
  };

  return (
    <div className={styles.heroWrapper}>
      <div className={styles.banner} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(15, 20, 36, 0.8) 70%, rgba(15, 20, 36, 1) 100%), url('${game.headerImageUrl || game.coverImageUrl}')` }}>
        <div className={styles.bannerOverlay}></div>
      </div>
      
      <main className={`${styles.mainContent} container`}>
        <section className={styles.titleSection}>
          <h1 className={styles.gameTitle}>{game.title}</h1>
          <div className={styles.gameMeta}>
            <span className={styles.metaItem}><Star size={16} /> {game.rating}</span>
            <span className={styles.metaItem}>Lançamento: {game.releaseDate}</span>
            <div className={`${styles.metaItem} ${styles.platformIcons}`}>
              {game.platforms.map(platform => (
                <span key={platform} title={platform.charAt(0).toUpperCase() + platform.slice(1)} className={styles.platformIconWrapper}>
                  {platformIcons[platform] || platform}
                </span>
              ))}
            </div>
            <span className={`${styles.metaItem} ${styles.classificationBadge}`}>{game.classification}</span>
          </div>
          <div className={styles.priceInfo}>
            {hasDiscount ? (
              <>
                <span className={styles.discountedPrice}>R$ {game.discountedPrice.toFixed(2)}</span>
                <span className={styles.originalPrice}>R$ {game.originalPrice.toFixed(2)}</span>
                <span className={styles.saveBadge}>{discountPercentage}% OFF</span>
              </>
            ) : (
              <span className={styles.discountedPrice}>R$ {game.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.addButton}>{isReleased ? 'Comprar Agora' : 'Realizar Preorder'}</button>
            <button className={styles.trailerButton} onClick={handlePlayVideo}>
              Ver trailer <Play size={16} />
            </button>
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
                  {mainTrailerUrl && (
                    <button className={styles.playButton} onClick={handlePlayVideo}>
                      <Play />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className={styles.thumbnailStrip}>
              <button className={styles.thumbNav}><ChevronLeft size={20}/></button>
              <div className={styles.thumbnails}>
                 <div className={styles.thumbnail} onClick={() => handleThumbnailClick(game.videoThumbnail)}>
                    <img src={game.videoThumbnail} alt="Video Thumbnail" />
                </div>
                {game.gallery.map((img, index) => (
                  <div key={index} className={styles.thumbnail} onClick={() => handleThumbnailClick(img)}>
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button className={styles.thumbNav}><ChevronRight size={20}/></button>
            </div>
          </div>

          <div className={styles.purchaseCard}>
            <div className={styles.card}>
              <div className={styles.priceInfo} >
                {hasDiscount ? (
                  <>
                    <span className={styles.discountedPrice}>R$ {game.discountedPrice.toFixed(2)}</span>
                    <span className={styles.originalPrice}>R$ {game.originalPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className={styles.discountedPrice}>R$ {game.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {hasDiscount && (
                <p style={{color:`green`, fontWeight:`bold`, marginBottom:`12px`}}>Você economiza {gameDiscount.toFixed(2)} reais</p>
              )}
              <button className={styles.addButton}>Comprar Agora</button>
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
