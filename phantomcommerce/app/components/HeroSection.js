'use client';

import { useState } from 'react';
import { Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../styles/HeroSection.module.scss';

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const gameImages = [
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300'
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % gameImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + gameImages.length) % gameImages.length);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.backgroundImage}>
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.topSection}>
            <div className={styles.leftPanel}>
              <div className={styles.gameInfo}>
                <h1 className={styles.gameTitle}>Cyberworld 2077</h1>
                
                <div className={styles.rating}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < 4 ? "#fbbf24" : "none"} 
                        stroke="#fbbf24"
                      />
                    ))}
                    <span className={styles.ratingText}>4.8</span>
                  </div>
                  <span className={styles.releaseDate}>Lançamento: 09/10/2025</span>
                </div>

                <div className={styles.platforms}>
                  <div className={styles.platformIcon}>Xbox</div>
                  <div className={styles.platformIcon}>PlayStation</div>
                  <div className={styles.platformIcon}>Steam</div>
                </div>

                <div className={styles.pricing}>
                  <div className={styles.currentPrice}>R$ 150,00</div>
                  <div className={styles.originalPrice}>R$ 299,99</div>
                  <div className={styles.discount}>-50%</div>
                </div>

                <div className={styles.actions}>
                  <button className={`${styles.btn} ${styles.btnPrimary}`}>
                    Realizar preorder
                  </button>
                  <button className={`${styles.btn} ${styles.btnSecondary}`}>
                    Ver trailer ▷
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.rightPanel}>
              <div className={styles.purchaseCard}>
                <div className={styles.pricing}>
                  <div className={styles.currentPrice}>R$ 150,00</div>
                  <div className={styles.originalPrice}>R$ 299,99</div>
                  <div className={styles.savings}>Você economiza R$ 149,99</div>
                </div>

                <button className={`${styles.btn} ${styles.btnBuy} ${styles.btnLarge}`}>
                  Comprar agora
                </button>

                <div className={styles.description}>
                  <h3>CYBERWORLD 2077</h3>
                  <p>
                    CYBERWORLD 2077 é um jogo onde está tudo conectado, embarque neste mundo 
                    dominado por máquinas e explore, destrua, hackeie e vivencie tudo que um 
                    futuro distópico pode lhe oferecer no mais novo RPG da Night Studio.
                  </p>
                  <div className={styles.launchDate}>
                    <strong>Lançamento:</strong> 09/10/2025
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mediaSection}>
            <div className={styles.videoPlayer}>
              <div className={styles.playButton}>
                <Play size={48} fill="white" />
              </div>
            </div>

            <div className={styles.imageCarousel}>
              <button className={styles.carouselBtn} onClick={prevImage}>
                <ChevronLeft size={20} />
              </button>
              
              <div className={styles.carouselImages}>
                {gameImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`${styles.carouselImage} ${index === currentImage ? styles.active : ''}`}
                  >
                    <div className={styles.placeholder}></div>
                  </div>
                ))}
              </div>
              
              <button className={styles.carouselBtn} onClick={nextImage}>
                <ChevronRight size={20} />
              </button>
            </div>

            <div className={styles.pagination}>
              {gameImages.map((_, index) => (
                <button 
                  key={index} 
                  className={`${styles.paginationDot} ${index === currentImage ? styles.active : ''}`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
