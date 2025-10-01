'use client';

import styles from './GameDetails.module.scss';

export default function GameDetails({ game }) {
  return (
    <section className={`${styles.aboutSection} container`}>
      <h2 className={styles.sectionTitle}>Sobre o Jogo</h2>
            <p className={styles.gameDescription}>{game.description}</p>
            <p className={styles.releaseDate}>Lançamento: {game.releaseDate}</p>
      <div className={styles.infoGrid}>
        <div>
          <p className={styles.infoLabel}>Desenvolvedora:</p>
          <p className={styles.infoValue}>{game.developer}</p>
        </div>
        <div>
          <p className={styles.infoLabel}>Publicadora:</p>
          <p className={styles.infoValue}>{game.publisher}</p>
        </div>
        <div>
          <p className={styles.infoLabel}>Gêneros:</p>
          <p className={styles.infoValue}>{game.tags.join(', ')}</p>
        </div>
        <div>
          <p className={styles.infoLabel}>Classificação:</p>
          <p className={styles.infoValue}>{game.classification}</p>
        </div>
      </div>
    </section>
  );
}

