"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, ArrowUpDown, Tag, Gamepad2, X } from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import gameData from '../../data/gameData.json';
import Header from '../../components/Header/Header';
import styles from '../../styles/categoryPage.module.scss';

const platformIcons = {
  xbox: <FaXbox size={16} />,
  playstation: <FaPlaystation size={16} />,
  steam: <FaSteam size={16} />,
  nintendoSwitch: <BsNintendoSwitch size={16} />,
};

const allTags = [...new Set(gameData.flatMap(game => game.tags))];
const allPlatforms = [...new Set(gameData.flatMap(game => game.platforms))];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug;

  const [categoryName, setCategoryName] = useState('');
  const [sortOrder, setSortOrder] = useState('rating');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  useEffect(() => {
    if (slug) {
      const isAllCategory = slug.toLowerCase() === 'all';
      const decodedSlug = decodeURIComponent(slug);
      setCategoryName(isAllCategory ? 'Todos os Jogos' : decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1));
      setSelectedTags(isAllCategory ? [] : [decodedSlug.toLowerCase()]);
      setSelectedPlatforms([]);
      setPriceRange({ min: '', max: '' });
    }
  }, [slug]);

  const handleTagChange = (tag) => {
    const lowerCaseTag = tag.toLowerCase();
    setSelectedTags(prev => prev.includes(lowerCaseTag) ? prev.filter(t => t !== lowerCaseTag) : [...prev, lowerCaseTag]);
  };
  
  const handlePlatformChange = (platform) => {
    const lowerCasePlatform = platform.toLowerCase();
    setSelectedPlatforms(prev => prev.includes(lowerCasePlatform) ? prev.filter(p => p !== lowerCasePlatform) : [...prev, lowerCasePlatform]);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSelectedTags(slug.toLowerCase() === 'all' ? [] : [slug.toLowerCase()]);
    setSelectedPlatforms([]);
    setPriceRange({ min: '', max: '' });
  }

  const filteredAndSortedGames = useMemo(() => {
    let filteredGames = [...gameData];
    if (selectedTags.length > 0) {
      filteredGames = filteredGames.filter(game => game.tags.some(tag => selectedTags.includes(tag.toLowerCase())));
    }
    if (selectedPlatforms.length > 0) {
      filteredGames = filteredGames.filter(game => game.platforms.some(platform => selectedPlatforms.includes(platform.toLowerCase())));
    }
    const minPrice = parseFloat(priceRange.min) || 0;
    const maxPrice = parseFloat(priceRange.max) || Infinity;
    filteredGames = filteredGames.filter(game => game.discountedPrice >= minPrice && game.discountedPrice <= maxPrice);

    return filteredGames.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc': return a.discountedPrice - b.discountedPrice;
        case 'price-desc': return b.discountedPrice - a.discountedPrice;
        case 'name-asc': return a.title.localeCompare(b.title);
        case 'name-desc': return b.title.localeCompare(a.title);
        case 'rating': default: return b.rating - a.rating;
      }
    });
  }, [selectedTags, selectedPlatforms, priceRange, sortOrder]);
  
  const calculateDiscount = (original, discounted) => {
    if (!original || original <= discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.categoryLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <h2>Filtros</h2>
            <button onClick={clearFilters} className={styles.clearButton}><X size={16}/> Limpar</button>
          </div>
          <div className={styles.filterSection}>
            <h3>Gêneros</h3>
            {allTags.map(tag => (
              <label key={tag} className={styles.checkboxLabel}>
                <input type="checkbox" checked={selectedTags.includes(tag.toLowerCase())} onChange={() => handleTagChange(tag)} />
                {tag}
              </label>
            ))}
          </div>
          <div className={styles.filterSection}>
            <h3>Plataformas</h3>
            {allPlatforms.map(platform => (
              <label key={platform} className={styles.checkboxLabel}>
                <input type="checkbox" checked={selectedPlatforms.includes(platform.toLowerCase())} onChange={() => handlePlatformChange(platform)} />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
            ))}
          </div>
          <div className={styles.filterSection}>
            <h3>Faixa de Preço</h3>
            <div className={styles.priceInputs}>
              <input type="number" name="min" placeholder="Mín" value={priceRange.min} onChange={handlePriceChange} />
              <input type="number" name="max" placeholder="Máx" value={priceRange.max} onChange={handlePriceChange} />
            </div>
          </div>
        </aside>

        <div className={styles.mainContent}>
          <header className={styles.categoryHeader}>
            <div>
              <h1>{categoryName}</h1>
              <p>Mostrando {filteredAndSortedGames.length} resultados</p>
            </div>
            <div className={styles.sortContainer}>
              <ArrowUpDown size={20} />
              <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                <option value="rating">Melhor Avaliação</option>
                <option value="price-asc">Preço: Menor para Maior</option>
                <option value="price-desc">Preço: Maior para Menor</option>
                <option value="name-asc">Nome: A-Z</option>
                <option value="name-desc">Nome: Z-A</option>
              </select>
            </div>
          </header>

          <main className={styles.gamesGrid}>
            {filteredAndSortedGames.map(game => {
              const discount = calculateDiscount(game.originalPrice, game.discountedPrice);
              return (
                <Link key={game.id} href={`/product/${game.id}`} className={styles.gameCard}>
                  <div className={styles.imageContainer}>
                    <img src={game.gallery[0]} alt={game.title} className={styles.gameImage} />
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
                          <Tag size={14} className={styles.tagIcon}/> 
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
              )
            })}
          </main>
        </div>
      </div>
    </div>
  );
}

