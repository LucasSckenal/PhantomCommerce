'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
    Star, Tag, ChevronLeft, ChevronRight, BarChart, Users, Award, Zap,
    Sword, Shield, Wand, Brain, Puzzle, Trophy, Car, Gamepad2
} from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import styles from './styles/Home.module.scss';
import gameData from './data/gameData.json';
import Header from './components/Header';

// --- ÍCONES ---
const platformIcons = {
  xbox: <FaXbox size={16} />,
  playstation: <FaPlaystation size={16} />,
  steam: <FaSteam size={16} />,
  nintendoSwitch: <BsNintendoSwitch size={16} />,
};

const genreIcons = {
    "Ação": <Sword size={24} />,
    "Aventura": <Shield size={24} />,
    "RPG": <Wand size={24} />,
    "Estratégia": <Brain size={24} />,
    "Indie": <Puzzle size={24} />,
    "Esportes": <Trophy size={24} />,
    "Corrida": <Car size={24} />,
    "Default": <Gamepad2 size={24} />
};


// --- COMPONENTE DE CARD DE JOGO (BASEADO NO GameGrid) ---
const GameCard = ({ game }) => {
  if (!game) return null;
  
  const discount = game.originalPrice ? Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100) : 0;
  
  return (
    <Link href={`/product/${game.id}`} key={game.id} className={styles.gameCard}>
      <div className={styles.imageContainer}>
        <Image src={game.bannerImage || game.image} alt={game.title} layout="fill" objectFit="cover" className={styles.gameImage} />
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
          {discount > 0 && <span className={styles.originalPrice}>R$ {game.originalPrice.toFixed(2).replace('.', ',')}</span>}
          <p className={styles.gamePrice}>R$ {game.discountedPrice.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>
      {discount > 0 && <span className={styles.discountBadge}>-{discount}%</span>}
    </Link>
  );
};


// --- PÁGINA PRINCIPAL ---
const HomePage = () => {
    // Refs para os carrosséis
    const popularScrollRef = useRef(null);
    
    // Estado para a seção de destaque
    const [activeShowcase, setActiveShowcase] = useState('releases');

    // Dados dos jogos
    const heroGame = gameData.find(g => g.id === 1);
    const popularGames = gameData.slice(1, 9);
    const newReleasesIndie = gameData.find(g => g.id === 4);
    const featuredIndie = gameData.find(g => g.id === 5); // Jogo diferente para a aba "Destacado"
    const bestSellers = gameData.slice(5, 9);
    const promotions = gameData.slice(9, 13);
    
    const genres = ["Ação", "Aventura", "RPG", "Estratégia", "Indie", "Esportes", "Corrida"];

    // Função para controlar o scroll
    const handleScroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = ref.current.offsetWidth * 0.8;
            ref.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const showcaseGame = activeShowcase === 'releases' ? newReleasesIndie : featuredIndie;

    return (
        <main className={styles.mainPage}>
            <Header />
            
            {/* Hero Section */}
            <section className={styles.heroSection} style={{ backgroundImage: `url(${heroGame.bannerImage})` }}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <span className={styles.heroTag}>Lançamento</span>
                    <h1>{heroGame.title}</h1>
                    <p className={styles.heroDescription}>{heroGame.description}</p>
                    <div className={styles.heroPrice}>
                        <span>R$ {heroGame.discountedPrice.toFixed(2)}</span>
                        <small>R$ {heroGame.originalPrice.toFixed(2)}</small>
                    </div>
                    <Link href={`/product/${heroGame.id}`} className={styles.heroButton}>
                        Ver detalhes
                    </Link>
                </div>
                <div className={styles.carouselIndicators}>
                    <span className={`${styles.indicator} ${styles.active}`}></span>
                    <span className={styles.indicator}></span>
                    <span className={styles.indicator}></span>
                </div>
            </section>

            {/* Populares da Semana */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Populares da Semana</h2>
                    <div className={styles.carouselNav}>
                        <button onClick={() => handleScroll(popularScrollRef, 'left')}><ChevronLeft size={20} /></button>
                        <button onClick={() => handleScroll(popularScrollRef, 'right')}><ChevronRight size={20} /></button>
                    </div>
                </div>
                <div className={styles.horizontalScroll} ref={popularScrollRef}>
                    {popularGames.map(game => <GameCard key={game.id} game={game} />)}
                </div>
            </section>
            
            {/* Destaque Indie */}
            <section className={`${styles.section} ${styles.showcaseSection}`}>
                 <div className={styles.showcaseNav}>
                    <button className={activeShowcase === 'releases' ? styles.active : ''} onClick={() => setActiveShowcase('releases')}>
                        Novos Lançamentos
                    </button>
                    <button className={activeShowcase === 'featured' ? styles.active : ''} onClick={() => setActiveShowcase('featured')}>
                        Destacado
                    </button>
                </div>
                <div className={styles.showcaseContent}>
                    <p>Indie em Destaque</p>
                    <h3>{showcaseGame.title}</h3>
                    <p className={styles.showcaseDesc}>{showcaseGame.about}</p>
                    <div className={styles.showcaseActions}>
                        <button className={styles.primaryButton}>Adicionar ao Carrinho</button>
                        <button className={styles.secondaryButton}>Lista de Desejos</button>
                    </div>
                </div>
                <div className={styles.showcaseImage}>
                    <Image src={showcaseGame.bannerImage} alt={showcaseGame.title} layout="fill" objectFit="cover"/>
                </div>
            </section>
            
            {/* Mais Vendidos */}
            <section className={styles.section}>
                 <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Mais Vendidos</h2>
                    <button className={styles.viewMoreButton}>Ver Mais</button>
                </div>
                <div className={styles.bestSellersGrid}>
                    {bestSellers.map((game, index) => (
                        <Link href={`/product/${game.id}`} key={game.id} className={styles.bestSellerCard}>
                            <span className={styles.rank}>#{index + 1}</span>
                            <div className={styles.bestSellerImage}>
                               <Image src={game.image || game.bannerImage} alt={game.title} width={60} height={80} objectFit="cover" />
                            </div>
                            <div className={styles.bestSellerInfo}>
                                <h4>{game.title}</h4>
                                <div className={styles.bestSellerTags}>
                                    {game.tags.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}
                                </div>
                                <div className={styles.bestSellerRating}>
                                    <Star size={14} fill="currentColor" /> {game.rating}
                                </div>
                            </div>
                            <div className={styles.bestSellerPrice}>
                                <span>R$ {game.price?.toFixed(2) || game.discountedPrice.toFixed(2)}</span>
                                <button>COMPRAR</button>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Explore por Gênero */}
            <section className={styles.section}>
                 <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Explore por Gênero</h2>
                 </div>
                <div className={styles.genresGrid}>
                    {genres.map(genre => (
                        <Link 
                            href={`/category/${genre.toLowerCase().replace(/\s+/g, '-')}`} 
                            key={genre} 
                            className={styles.genreButton}
                        >
                            {genreIcons[genre] || genreIcons.Default}
                            <span>{genre}</span>
                        </Link>
                    ))}
                </div>
            </section>
            
            {/* Liderança Section */}
            <section className={`${styles.section} ${styles.leadershipSection}`}>
                <div className={styles.leadershipContent}>
                    <h3>Liderança em Gaming no Brasil</h3>
                    <p>Referência máxima em entretenimento digital, oferecendo a maior variedade de jogos e a comunidade mais engajada do país.</p>
                </div>
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <Users size={28} />
                        <h4>2.5M+</h4>
                        <p>Usuários Ativos</p>
                    </div>
                    <div className={styles.statItem}>
                        <BarChart size={28} />
                        <h4>500K+</h4>
                        <p>Avaliações Positivas</p>
                    </div>
                     <div className={styles.statItem}>
                        <Award size={28} />
                        <h4>98%</h4>
                        <p>Satisfação do Cliente</p>
                    </div>
                     <div className={styles.statItem}>
                        <Zap size={28} />
                        <h4>24/7</h4>
                        <p>Suporte Dedicado</p>
                    </div>
                </div>
            </section>

            {/* Promoções Imperdíveis */}
            <section className={styles.section}>
                 <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Promoções Imperdíveis</h2>
                    <span className={styles.countdown}>Últimas 48h</span>
                </div>
                <div className={styles.cardGrid}>
                    {promotions.map(game => <GameCard key={game.id} game={game} />)}
                </div>
            </section>

        </main>
    );
};

export default HomePage;

