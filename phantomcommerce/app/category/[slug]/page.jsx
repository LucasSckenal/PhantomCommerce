"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Star, ArrowUpDown, Tag, X } from 'lucide-react';
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

// Componente precisa ser envolvido por <Suspense> na page pai ou layout
function CategoryPageComponent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug;

  const [isMounted, setIsMounted] = useState(false);
  
  const getInitialState = useCallback(() => {
    const sort = searchParams.get('sort') || 'rating';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const platforms = searchParams.get('platforms')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    
    const isAllCategory = slug.toLowerCase() === 'all';
    const baseTags = isAllCategory ? [] : [decodeURIComponent(slug).toLowerCase()];

    return {
      sortOrder: sort,
      selectedTags: [...new Set([...baseTags, ...tags])],
      selectedPlatforms: platforms,
      priceRange: { min: minPrice, max: maxPrice }
    };
  }, [searchParams, slug]);

  const [sortOrder, setSortOrder] = useState(getInitialState().sortOrder);
  const [selectedTags, setSelectedTags] = useState(getInitialState().selectedTags);
  const [selectedPlatforms, setSelectedPlatforms] = useState(getInitialState().selectedPlatforms);
  const [priceRange, setPriceRange] = useState(getInitialState().priceRange);

  useEffect(() => {
    const initialState = getInitialState();
    setSortOrder(initialState.sortOrder);
    setSelectedTags(initialState.selectedTags);
    setSelectedPlatforms(initialState.selectedPlatforms);
    setPriceRange(initialState.priceRange);
  }, [slug, searchParams, getInitialState]);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }

    const query = new URLSearchParams();
    
    const isAllCategory = slug.toLowerCase() === 'all';
    const baseTag = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
    const additionalTags = selectedTags.filter(t => t !== baseTag);

    if (additionalTags.length > 0) query.set('tags', additionalTags.join(','));
    if (selectedPlatforms.length > 0) query.set('platforms', selectedPlatforms.join(','));
    if (priceRange.min) query.set('minPrice', priceRange.min);
    if (priceRange.max) query.set('maxPrice', priceRange.max);
    if (sortOrder !== 'rating') query.set('sort', sortOrder);

    const queryString = query.toString();
    const newPath = `/category/${slug}${queryString ? `?${queryString}` : ''}`;
    
    router.push(newPath, { scroll: false });

  }, [selectedTags, selectedPlatforms, priceRange, sortOrder, isMounted, router, slug]);

  const dynamicPageTitle = useMemo(() => {
      const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
      const isAllCategory = slug.toLowerCase() === 'all';
      
      const tagsToDisplay = selectedTags.map(capitalize);
      const platformsToDisplay = selectedPlatforms.map(capitalize);

      if (tagsToDisplay.length === 0 && platformsToDisplay.length === 0) {
          return isAllCategory ? 'Todos os Jogos' : capitalize(decodeURIComponent(slug));
      }

      let title = "Jogos";
      if (tagsToDisplay.length > 0) {
          title += ` de ${tagsToDisplay.join(', ')}`;
      }
      if (platformsToDisplay.length > 0) {
          title += ` para ${platformsToDisplay.join(', ')}`;
      }

      return title;
  }, [selectedTags, selectedPlatforms, slug]);

  const handleSortIconClick = () => {
    if (sortOrder.endsWith('-asc')) {
      setSortOrder(sortOrder.replace('-asc', '-desc'));
    } else if (sortOrder.endsWith('-desc')) {
      setSortOrder(sortOrder.replace('-desc', '-asc'));
    }
  };

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
    const baseTags = slug.toLowerCase() === 'all' ? [] : [decodeURIComponent(slug).toLowerCase()];
    setSelectedTags(baseTags);
    setSelectedPlatforms([]);
    setPriceRange({ min: '', max: '' });
    setSortOrder('rating');
  };

  const { activeFilterCount, isPristine } = useMemo(() => {
    const isAllCategory = slug.toLowerCase() === 'all';
    const baseTag = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
    const additionalTags = selectedTags.filter(t => t !== baseTag);

    let count = additionalTags.length + selectedPlatforms.length;
    if (priceRange.min) count++;
    if (priceRange.max) count++;
    if (sortOrder !== 'rating') count++;
    
    const pristine = count === 0;

    return { activeFilterCount: count, isPristine: pristine };
  }, [selectedTags, selectedPlatforms, priceRange, sortOrder, slug]);

  const filteredAndSortedGames = useMemo(() => {
    let gamesToFilter = [...gameData];
    
    if (selectedTags.length > 0) {
      gamesToFilter = gamesToFilter.filter(game => 
        selectedTags.every(st => game.tags.map(t => t.toLowerCase()).includes(st))
      );
    }

    if (selectedPlatforms.length > 0) {
      gamesToFilter = gamesToFilter.filter(game =>
        selectedPlatforms.every(sp => game.platforms.map(p => p.toLowerCase()).includes(sp))
      );
    }

    const minPrice = parseFloat(priceRange.min) || 0;
    const maxPrice = parseFloat(priceRange.max) || Infinity;
    gamesToFilter = gamesToFilter.filter(game => game.discountedPrice >= minPrice && game.discountedPrice <= maxPrice);

    return gamesToFilter.sort((a, b) => {
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

  if (!isMounted) {
      return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.categoryLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <h2>Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}</h2>
            {!isPristine && (
              <button onClick={clearFilters} className={styles.clearButton}>
                <X size={16}/> Limpar
              </button>
            )}
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
              <h1>{dynamicPageTitle}</h1>
              <p>Mostrando {filteredAndSortedGames.length} resultados</p>
            </div>
            <div className={styles.sortContainer}>
              <ArrowUpDown 
                size={20} 
                className={`${styles.sortIcon} ${sortOrder.endsWith('-asc') ? styles.ascending : ''} ${sortOrder === 'rating' ? styles.inactive : ''}`}
                onClick={handleSortIconClick}
              />
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

export default function CategoryPage() {
    return (
        <CategoryPageComponent />
    );
}

