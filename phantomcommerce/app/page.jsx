'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
    Star, Tag, ChevronLeft, ChevronRight, BarChart, Users, Award, Zap,
    Sword, Shield, Wand, Brain, Puzzle, Trophy, Car, Gamepad2,
    CalendarDays
} from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch, BsPcDisplay } from "react-icons/bs";
import styles from './styles/Home.module.scss';
import Header from './components/Header/Header';
import { useStore } from './contexts/StoreContext';

// --- ÍCONES ---
const platformIcons = {
  xbox: <FaXbox size={16} />,
  playstation: <FaPlaystation size={16} />,
  steam: <FaSteam size={16} />,
  'nintendo switch': <BsNintendoSwitch size={15} />,
  pc: <BsPcDisplay size={15} />
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

// --- COMPONENTE DE CARD DE JOGO ---
const GameCard = ({ game }) => {
  if (!game) return null;

  const discount = game.originalPrice 
    ? Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/product/${game.id}`} key={game.id} className={styles.gameCard}>
      <div className={styles.imageContainer}>
        <Image
          src={game.headerImageUrl || game.coverImageUrl || '/placeholder.jpg'}
          alt={game.title}
          layout="fill"
          objectFit="cover"
          className={styles.gameImage}
        />
        <div className={styles.platformIcons}>
          {game.platforms?.map(platform => (
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
          {discount > 0 && (
            <span className={styles.originalPrice}>
              R$ {game.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
          <p className={styles.gamePrice}>
            R$ {game.discountedPrice.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>
      {discount > 0 && <span className={styles.discountBadge}>-{discount}%</span>}
    </Link>
  );
};

// --- PÁGINA PRINCIPAL ---
const HomePage = () => {
  const { games, loadingGames } = useStore();

  const popularScrollRef = useRef(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [activeShowcase, setActiveShowcase] = useState('releases'); // estado do showcase

  // --- Hooks fixos ---
  const handleHeroNav = (direction) => {
    const totalSlides = heroGames.length;
    setCurrentHeroIndex(prev =>
      direction === 'next'
        ? (prev + 1) % totalSlides
        : (prev - 1 + totalSlides) % totalSlides
    );
  };

  const handleIndicatorClick = (index) => setCurrentHeroIndex(index);

  useEffect(() => {
    const timer = setTimeout(() => handleHeroNav('next'), 7000);
    return () => clearTimeout(timer);
  }, [currentHeroIndex]);

  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // --- Dados derivados do Firestore ---
  const bestRatedGames = [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const heroGames = bestRatedGames.slice(0, 3);
  const popularGames = bestRatedGames.slice(3, 9);
  const showcaseGame = bestRatedGames[0]; 
  const bestSellers = bestRatedGames.slice(5, 9);
  const promotions = bestRatedGames.slice(9, 13);

  // --- Jogo mais recente ---
  const latestReleaseGame = [...games]
    .filter(game => game.releaseDate)
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))[0];

  const displayedShowcaseGame = activeShowcase === 'releases' 
    ? latestReleaseGame 
    : showcaseGame;

  const activeHeroGame = heroGames[currentHeroIndex];
  const genres = ["Ação", "Aventura", "RPG", "Estratégia", "Indie", "Esportes", "Corrida"];

  if (loadingGames) return <div>Carregando jogos...</div>;
  if (!games || games.length === 0) return <div>Nenhum jogo encontrado.</div>;

  return (
    <main className={styles.mainPage}>
      <Header />

      {/* Hero Section */}
      {activeHeroGame && (
        <section
          key={activeHeroGame.id}
          className={styles.heroSection}
          style={{ backgroundImage: `url(${activeHeroGame.headerImageUrl || activeHeroGame.coverImageUrl || '/placeholder.jpg'})` }}
        >
          <div className={styles.heroOverlay}></div>

          <button className={`${styles.heroNavArrow} ${styles.left}`} onClick={() => handleHeroNav('prev')}>
            <ChevronLeft size={32} />
          </button>

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{activeHeroGame.title}</h1>
            <h2 className={styles.heroSubtitle}>{activeHeroGame.shortDescription || 'Confira agora este sucesso!'}</h2>
            <p className={styles.heroDescription}>
              {activeHeroGame.about?.substring(0, 150) || 'Um dos jogos mais bem avaliados da loja!'}
            </p>

            <div className={styles.heroInfoBar}>
              <div className={styles.infoItem}>
                <Star size={16} />
                <span>{activeHeroGame.rating} estrelas</span>
              </div>
              <div className={styles.infoItem}>
                <CalendarDays size={16} />
                <span>Lançamento: {activeHeroGame.releaseDate || 'TBA'}</span>
              </div>
              <div className={styles.platformIconsHero}>
                {activeHeroGame.platforms?.map(platform => (
                  <span key={platform} title={platform}>
                    {platformIcons[platform.toLowerCase()] || platformIcons.pc}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.heroPriceSection}>
              <div className={styles.priceWrapper}>
                <span className={styles.currentPrice}>
                  R$ {(activeHeroGame.discountedPrice || activeHeroGame.price).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className={styles.heroActions}>
              <Link href={`/product/${activeHeroGame.id}`} className={styles.heroButtonPrimary}>
                Comprar Agora
              </Link>
              {activeHeroGame.trailerUrls?.length > 0 && (
                <Link href={activeHeroGame.trailerUrls[0]} target="_blank" className={styles.heroButtonSecondary}>
                  Ver trailer &gt;
                </Link>
              )}
            </div>
          </div>

          <button className={`${styles.heroNavArrow} ${styles.right}`} onClick={() => handleHeroNav('next')}>
            <ChevronRight size={32} />
          </button>

          <div className={styles.carouselIndicators}>
            {heroGames.map((game, index) => (
              <span
                key={game.id}
                className={`${styles.indicator} ${currentHeroIndex === index ? styles.active : ''}`}
                onClick={() => handleIndicatorClick(index)}
              ></span>
            ))}
          </div>
        </section>
      )}

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

      {/* Showcase Dinâmico */}
        <section className={`${styles.section} ${styles.showcaseSection}`}>
          <div className={styles.showcaseNav}>
            <button
              className={activeShowcase === 'releases' ? styles.active : ''}
              onClick={() => setActiveShowcase('releases')}
            >
              Novos Lançamentos
            </button>
            <button
              className={activeShowcase === 'featured' ? styles.active : ''}
              onClick={() => setActiveShowcase('featured')}
            >
              Destacado
            </button>
          </div>

          <div className={styles.showcaseContent}>
            <p>Indie em Destaque</p>
            <h3>{displayedShowcaseGame?.title}</h3>

            {/* Trunca descrição se for muito grande */}
            <p className={styles.showcaseDesc}>
              {(displayedShowcaseGame?.about || displayedShowcaseGame?.description || '').length > 250
                ? `${(displayedShowcaseGame?.about || displayedShowcaseGame?.description).substring(0, 250)}...`
                : displayedShowcaseGame?.about || displayedShowcaseGame?.description
              }
            </p>

            {/* Estrela única */}
            <div className={styles.showcaseRating}>
              <Star size={16} className={styles.starIcon} />
              <span>{displayedShowcaseGame?.rating || 'N/A'}</span>
            </div>

            <div className={styles.showcaseActions}>
              <button className={styles.primaryButton}>Adicionar ao Carrinho</button>
              <button className={styles.secondaryButton}>Lista de Desejos</button>
            </div>
          </div>

          <div className={styles.showcaseImage}>
            <Image
              src={displayedShowcaseGame?.backgroundImage || displayedShowcaseGame?.headerImageUrl || '/placeholder.jpg'}
              alt={displayedShowcaseGame?.title}
              layout="fill"
              objectFit="cover"
            />
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
                <Image 
                  src={game.headerImageUrl || game.coverImageUrl || '/placeholder.jpg'} 
                  alt={game.title}
                  fill
                  sizes="100px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.bestSellerInfo}>
                <h4>{game.title}</h4>
                <div className={styles.bestSellerTags}>
                  {game.categories?.slice(0, 2).map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.bestSellerRating}>
                  <Star size={14} fill="currentColor" /> 
                  <span>{game.rating || 'N/A'}</span>
                </div>
              </div>
              <div className={styles.bestSellerPrice}>
                <span>R$ {(game.discountedPrice || game.price || 0).toFixed(2).replace('.', ',')}</span>
                <button>COMPRAR</button>
              </div>
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

          {/* Explorar por Gênero */}
      <section className={styles.section}>
                 <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Explore por Gênero</h2>
                 </div>
                <div className={styles.genresGrid}>
                    {genres.map(genre => {
                        let genreSlug;

                        // Verifica se o gênero é 'RPG' para criar uma exceção
                        if (genre === "RPG") {
                            genreSlug = "RPG";
                        } else {
                            // Lógica padrão para todos os outros gêneros
                            genreSlug = genre
                                .toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/\s+/g, '-');
                        }

                        return (
                            <Link 
                                href={`/category/${genreSlug}`} 
                                key={genre} 
                                className={styles.genreButton}
                            >
                                {genreIcons[genre] || genreIcons.Default}
                                <span>{genre}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>

      {/* Promoções Imperdíveis */}
      <section className={styles.section}>
        <div className={styles.sectionCountdown}>
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
