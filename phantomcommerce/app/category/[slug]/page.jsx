// /app/category/[slug]/page.jsx
"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, X } from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './CategoryPage.module.scss';
import { StoreProvider, useStore } from '../../contexts/StoreContext';
import GameCard from '../../components/GameCard/GameCard'; // 1. IMPORTA O NOSSO NOVO GAMECARD

// Componente de UI que consome o contexto
function CategoryUI() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

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

    if (loadingGames && !isMounted) {
        return <div className={styles.loadingContainer}>Carregando jogos...</div>;
    }

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
                            // 2. AQUI É A ÚNICA MUDANÇA: RENDERIZA O NOVO COMPONENTE
                            filteredAndSortedGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))
                        )}
                    </main>
                </main>
            </div>
        </div>
    );
}

// Componente principal que lê a URL e provê o contexto (sem alterações)
export default function CategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug;

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
        <Suspense fallback={<div className={styles.loadingContainer}>Carregando página...</div>}>
            <StoreProvider slug={slug} initialFilters={initialFilters}>
                <CategoryUI />
            </StoreProvider>
        </Suspense>
    );
}
