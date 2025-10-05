"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
// 1. IMPORTAÇÃO CENTRALIZADA DO FIREBASE
import { db } from '../lib/firebase'; // Ajuste o caminho conforme sua estrutura
// 2. Importações específicas do Firestore continuam necessárias
import { collection, query, where, getDocs } from "firebase/firestore";

// O bloco de configuração do Firebase foi REMOVIDO daqui

const StoreContext = createContext();

export function StoreProvider({ children, slug, initialFilters }) {
    const [games, setGames] = useState([]);
    const [loadingGames, setLoadingGames] = useState(true);
    const [allAvailableTags, setAllAvailableTags] = useState([]);
    const [allAvailablePlatforms, setAllAvailablePlatforms] = useState([]);

    const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder);
    const [selectedTags, setSelectedTags] = useState(initialFilters.selectedTags);
    const [selectedPlatforms, setSelectedPlatforms] = useState(initialFilters.selectedPlatforms);
    const [priceRange, setPriceRange] = useState(initialFilters.priceRange);

    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    useEffect(() => {
        const fetchGames = async () => {
            setLoadingGames(true);
            try {
                let gamesCollectionRef = collection(db, 'games');
                let gamesQuery = gamesCollectionRef;

                const isAllCategory = slug.toLowerCase() === 'all';
                const baseTagFromSlug = isAllCategory ? '' : capitalize(decodeURIComponent(slug));

                if (baseTagFromSlug) {
                    gamesQuery = query(gamesQuery, where('categories', 'array-contains', baseTagFromSlug));
                }
                const minPriceVal = parseFloat(priceRange.min);
                if (!isNaN(minPriceVal) && minPriceVal > 0) {
                    gamesQuery = query(gamesQuery, where('price', '>=', minPriceVal));
                }
                const maxPriceVal = parseFloat(priceRange.max);
                if (!isNaN(maxPriceVal) && maxPriceVal > 0) {
                    gamesQuery = query(gamesQuery, where('price', '<=', maxPriceVal));
                }

                const querySnapshot = await getDocs(gamesQuery);
                const fetchedGames = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    originalPrice: doc.data().oldPrice || doc.data().price,
                    discountedPrice: doc.data().price,
                    tags: doc.data().categories || [],
                    platforms: doc.data().platforms?.map(p => p.toLowerCase()) || [],
                    gallery: doc.data().galleryImageUrls || [],
                }));

                setGames(fetchedGames);
            } catch (error) {
                console.error("Erro ao buscar jogos do Firestore:", error);
            } finally {
                setLoadingGames(false);
            }
        };

        fetchGames();
    }, [slug, priceRange.min, priceRange.max]);

    useEffect(() => {
        const uniqueTags = new Set();
        const uniquePlatforms = new Set();
        games.forEach(game => {
            game.tags.forEach(tag => uniqueTags.add(tag));
            game.platforms.forEach(platform => uniquePlatforms.add(platform));
        });
        setAllAvailableTags(Array.from(uniqueTags).sort());
        setAllAvailablePlatforms(Array.from(uniquePlatforms).sort());
    }, [games]);

    const filteredAndSortedGames = useMemo(() => {
        let gamesToFilter = [...games];
        const isAllCategory = slug.toLowerCase() === 'all';
        const baseTagLower = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
        
        const effectiveSelectedTags = selectedTags.filter(t => t !== baseTagLower);
        if (effectiveSelectedTags.length > 0) {
            gamesToFilter = gamesToFilter.filter(game =>
                effectiveSelectedTags.every(st => game.tags.map(t => t.toLowerCase()).includes(st))
            );
        }
        if (selectedPlatforms.length > 0) {
            gamesToFilter = gamesToFilter.filter(game =>
                selectedPlatforms.every(sp => game.platforms.includes(sp))
            );
        }

        return gamesToFilter.sort((a, b) => {
            switch (sortOrder) {
                case 'price-asc': return a.discountedPrice - b.discountedPrice;
                case 'price-desc': return b.discountedPrice - a.discountedPrice;
                case 'name-asc': return (a.title || '').localeCompare(b.title || '');
                case 'name-desc': return (b.title || '').localeCompare(a.title || '');
                case 'rating': default: return (b.rating || 0) - (a.rating || 0);
            }
        });
    }, [games, selectedTags, selectedPlatforms, sortOrder, slug]);

    const clearFilters = useCallback(() => {
        const baseTags = slug.toLowerCase() === 'all' ? [] : [decodeURIComponent(slug).toLowerCase()];
        setSelectedTags(baseTags);
        setSelectedPlatforms([]);
        setPriceRange({ min: '', max: '' });
        setSortOrder('rating');
    }, [slug]);

    const value = {
        games,
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
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}