'use client';

import styles from '../styles/GameDetails.module.scss';

export default function GameDetails() {
  return (
    <section className={styles.gameDetails}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.aboutSection}>
            <h2 className={styles.sectionTitle}>Sobre o Jogo</h2>
            <p className={styles.description}>
              Um RPG futurista em mundo aberto com batalhas intensas e narrativa imersiva.
            </p>
            
            <div className={styles.gameInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Desenvolvedora:</span>
                <span className={styles.value}>Night Studio</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.label}>Gêneros:</span>
                <span className={styles.value}>RPG, Ação, Mundo Aberto</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.label}>Publicadora:</span>
                <span className={styles.value}>Future Games</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.label}>Classificação:</span>
                <span className={styles.value}>18+</span>
              </div>
            </div>
          </div>

          <div className={styles.requirementsSection}>
            <div className={styles.requirements}>
              <h3 className={styles.requirementsTitle}>Requisitos Mínimos</h3>
              <div className={styles.requirementsList}>
                <div className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>CPU:</span>
                  <span className={styles.requirementValue}>Intel i5</span>
                </div>
                
                <div className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>RAM:</span>
                  <span className={styles.requirementValue}>8GB</span>
                </div>
                
                <div className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>GPU:</span>
                  <span className={styles.requirementValue}>GTX 970</span>
                </div>
                
                <div className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>Armazenamento:</span>
                  <span className={styles.requirementValue}>70GB</span>
                </div>
              </div>
            </div>

            <div className={styles.requirements}>
              <h3 className={styles.requirementsTitle}>Requisitos Recomendados</h3>
              <div className={styles.requirementsList}>
                <div className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>CPU:</span>
                  <span className={styles.requirementValue}>Intel i7</span>
                </div>
                
                <div className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>RAM:</span>
                  <span className={styles.requirementValue}>16GB</span>
                </div>
                
                <div className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>GPU:</span>
                  <span className={styles.requirementValue}>RTX 3060</span>
                </div>
                
                <div className={styles.requirementItem}>
                  <span className={styles.requirementLabel}>Armazenamento:</span>
                  <span className={styles.requirementValue}>70GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

