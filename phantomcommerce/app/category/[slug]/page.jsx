// /app/category/[slug]/page.jsx
"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Star, ArrowUpDown, Tag, X } from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import Header from '../../components/Header/Header';
import styles from './categoryPage.module.scss';
import { StoreProvider, useStore } from '../../contexts/StoreContext'; // 1. IMPORTE O CONTEXTO

const platformIcons = {
    xbox: <FaXbox size={16} />,
    playstation: <FaPlaystation size={16} />,
    steam: <FaSteam size={16} />,
    nintendoswitch: <BsNintendoSwitch size={16} />,
    pc: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20 18q.825 0 1.413-.588T22 16V6q0-.825-.588-1.413T20 4H4q-.825 0-1.413.588T2 6v10q0 .825.588 1.413T4 18h5v2h-2v2h6v-2h-2v-2h5Z"/></svg>,
};

// Componente de UI que consome o contexto
function CategoryUI() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    // 2. PEGUE TODA A LÓGICA E ESTADO DO CONTEXTO
    const {
        loadingGames,
        allAvailableTags,
        allAvailablePlatforms,
        sortOrder,
        setSortOrder,
        selectedTags,
        setSelectedTags,
        selectedPlatforms,
        setSelectedPlatforms,
        priceRange,
        setPriceRange,
        filteredAndSortedGames,
        clearFilters,
    } = useStore();

    const [isMounted, setIsMounted] = useState(false);

    // LÓGICA QUE PERMANECE NO COMPONENTE:
    // - Interação com o roteador (atualizar a URL)
    // - Cálculos de UI (título dinâmico, contagem de filtros)
    
    // Efeito para atualizar a URL (isso depende do router, então fica aqui)
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

        const newPath = `/category/${slug}${query.toString() ? `?${query.toString()}` : ''}`;
        router.push(newPath, { scroll: false });

    }, [selectedTags, selectedPlatforms, priceRange, sortOrder, isMounted, router, slug]);

    // Funções e memos que dependem do estado do contexto
    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    const dynamicPageTitle = useMemo(() => {
        const isAllCategory = slug.toLowerCase() === 'all';
        const baseTagLower = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
        const tagsToDisplay = selectedTags.filter(t => t !== baseTagLower).map(capitalize);
        const platformsToDisplay = selectedPlatforms.map(capitalize);
        if (tagsToDisplay.length === 0 && platformsToDisplay.length === 0 && !baseTagLower) return 'Todos os Jogos';
        let title = "Jogos";
        if (baseTagLower) title += ` de ${capitalize(baseTagLower)}`;
        if (tagsToDisplay.length > 0) title += `${baseTagLower ? ' e' : ' de'} ${tagsToDisplay.join(', ')}`;
        if (platformsToDisplay.length > 0) title += ` para ${platformsToDisplay.join(', ')}`;
        return title;
    }, [selectedTags, selectedPlatforms, slug]);
    
    const { activeFilterCount, isPristine } = useMemo(() => {
        const isAllCategory = slug.toLowerCase() === 'all';
        const baseTag = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
        const additionalTags = selectedTags.filter(t => t !== baseTag);
        let count = additionalTags.length + selectedPlatforms.length;
        if (priceRange.min) count++;
        if (priceRange.max) count++;
        if (sortOrder !== 'rating') count++;
        return { activeFilterCount: count, isPristine: count === 0 };
    }, [selectedTags, selectedPlatforms, priceRange, sortOrder, slug]);

    // Handlers que agora chamam as funções do contexto
    const handleTagChange = (tag) => {
        const lowerCaseTag = tag.toLowerCase();
        setSelectedTags(prev => prev.includes(lowerCaseTag) ? prev.filter(t => t !== lowerCaseTag) : [...prev, lowerCaseTag]);
    };
    const handlePlatformChange = (platform) => {
        const lowerCasePlatform = platform.toLowerCase();
        setSelectedPlatforms(prev => prev.includes(lowerCasePlatform) ? prev.filter(p => p !== lowerCasePlatform) : [...prev, lowerCasePlatform]);
    };
    const handlePriceChange = (e) => setPriceRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSortIconClick = () => {
        if (sortOrder.endsWith('-asc')) setSortOrder(sortOrder.replace('-asc', '-desc'));
        else if (sortOrder.endsWith('-desc')) setSortOrder(sortOrder.replace('-desc', '-asc'));
    };
    const calculateDiscount = (original, discounted) => {
        if (!original || original <= discounted) return 0;
        return Math.round(((original - discounted) / original) * 100);
    };

    if (loadingGames && !isMounted) {
        return <div className={styles.loadingContainer}>Carregando jogos...</div>;
    }

    // O JSX permanece praticamente o mesmo, mas agora usa variáveis do contexto
    return (
        <div className={styles.pageWrapper}>
            <Header />
            <div className={styles.categoryLayout}>
                <aside className={styles.sidebar}>
                    <div className={styles.filterHeader}>
                        <h2>Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}</h2>
                        {!isPristine && (
                            <button onClick={clearFilters} className={styles.clearButton}><X size={16}/> Limpar</button>
                        )}
                    </div>
                    <div className={styles.filterSection}>
                        <h3>Gêneros</h3>
                        {allAvailableTags.map(tag => (
                            <label key={tag} className={styles.checkboxLabel}>
                                <input type="checkbox" checked={selectedTags.includes(tag.toLowerCase())} onChange={() => handleTagChange(tag)} />
                                {tag}
                            </label>
                        ))}
                    </div>
                    <div className={styles.filterSection}>
                        <h3>Plataformas</h3>
                        {allAvailablePlatforms.map(platform => (
                            <label key={platform} className={styles.checkboxLabel}>
                                <input type="checkbox" checked={selectedPlatforms.includes(platform.toLowerCase())} onChange={() => handlePlatformChange(platform)} />
                                {capitalize(platform)}
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
                <main className={styles.mainContent}>
                     <header className={styles.categoryHeader}>
                        <div>
                            <h1>{dynamicPageTitle}</h1>
                            <p>Mostrando {filteredAndSortedGames.length} resultados</p>
                        </div>
                        <div className={styles.sortContainer}>
                            <ArrowUpDown size={20} className={`${styles.sortIcon} ${sortOrder.endsWith('-asc') ? styles.ascending : ''} ${sortOrder === 'rating' ? styles.inactive : ''}`} onClick={handleSortIconClick} />
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
                        {loadingGames ? <div className={styles.loadingContainer}>Atualizando...</div> : filteredAndSortedGames.length === 0 ? (
                            <p className={styles.noGamesMessage}>Nenhum jogo encontrado com os filtros selecionados.</p>
                        ) : (
                            filteredAndSortedGames.map(game => {
                                const discount = calculateDiscount(game.originalPrice, game.discountedPrice);
                                return (
                                    <Link key={game.id} href={`/product/${game.id}`} className={styles.gameCard}>
                                        <div className={styles.imageContainer}>
                                            <img src={game.coverImageUrl || game.headerImageUrl } alt={game.title} className={styles.gameImage} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x225/2e3a47/ffffff?text=No+Image'; }} />
                                            <div className={styles.platformIcons}>
                                                {game.platforms?.map(platform => (<span key={platform} title={capitalize(platform)}>{platformIcons[platform]}</span>))}
                                            </div>
                                            <div className={styles.overlay}><div className={styles.viewMoreButton}>Ver mais</div></div>
                                        </div>
                                        <div className={styles.cardBody}>
                                            <h3 className={styles.gameTitle}>{game.title}</h3>
                                            <div className={styles.tagsContainer}><Tag size={14} className={styles.tagIcon}/><span className={styles.gameTags}>{game.tags.join(', ')}</span></div>
                                            <div className={styles.ratingInfo}><Star size={16} className={styles.starIcon} /><span>{game.rating || 'N/A'}</span></div>
                                        </div>
                                        <div className={styles.priceSection}>
                                            <div className={styles.priceContainer}>
                                                {discount > 0 && <span className={styles.originalPrice}>R$ {game.originalPrice?.toFixed(2).replace('.', ',')}</span>}
                                                <p className={styles.gamePrice}>R$ {game.discountedPrice?.toFixed(2).replace('.', ',')}</p>
                                            </div>
                                        </div>
                                        {discount > 0 && <span className={styles.discountBadge}>-{discount}%</span>}
                                    </Link>
                                )
                            })
                        )}
                    </main>
                </main>
            </div>
        </div>
    );
}

// Componente principal que lê a URL e provê o contexto
export default function CategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug;

    // Lógica para extrair o estado inicial da URL
    const initialFilters = useMemo(() => {
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
    }, [slug, searchParams]);

    return (
        // 3. ENVOLVA O COMPONENTE DE UI COM O PROVIDER
        // Suspense é uma boa prática para componentes que dependem de searchParams
        <Suspense fallback={<div className={styles.loadingContainer}>Carregando página...</div>}>
            <StoreProvider slug={slug} initialFilters={initialFilters}>
                <CategoryUI />
            </StoreProvider>
        </Suspense>
    );
}