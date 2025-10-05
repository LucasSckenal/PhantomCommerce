"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Star, ArrowUpDown, Tag, X } from 'lucide-react';
import { FaPlaystation, FaXbox, FaSteam } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
// Importações do Firebase SDK
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// import gameData from '../../data/gameData.json'; // REMOVA esta linha
import Header from '../../components/Header/Header';
import styles from '../../styles/categoryPage.module.scss';

// --- Configuração do Firebase ---
// É altamente recomendável usar variáveis de ambiente para isso em um ambiente de produção real.
// Para este exemplo, estamos usando as variáveis que você forneceu na configuração do Firebase.js.
// Certifique-se de que essas variáveis de ambiente estejam configuradas no seu ambiente Next.js.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializa o Firebase de forma segura (evita reinicialização)
let firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp();
}
const db = getFirestore(firebaseApp);
// Fim da configuração do Firebase

const platformIcons = {
    xbox: <FaXbox size={16} />,
    playstation: <FaPlaystation size={16} />,
    steam: <FaSteam size={16} />,
    nintendoswitch: <BsNintendoSwitch size={16} />, // Chave em minúsculas para corresponder aos dados
    pc: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 19v4"/><path d="M8 23h8"/></svg>, // Ícone de PC
};

// Componente precisa ser envolvido por <Suspense> na page pai ou layout
function CategoryPageComponent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug;

    const [isMounted, setIsMounted] = useState(false);
    const [games, setGames] = useState([]);
    const [loadingGames, setLoadingGames] = useState(true);
    const [allAvailableTags, setAllAvailableTags] = useState([]);
    const [allAvailablePlatforms, setAllAvailablePlatforms] = useState([]);

    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

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

    // Efeito para sincronizar estados com URL ao carregar ou mudar slug/searchParams
    useEffect(() => {
        const initialState = getInitialState();
        setSortOrder(initialState.sortOrder);
        setSelectedTags(initialState.selectedTags);
        setSelectedPlatforms(initialState.selectedPlatforms);
        setPriceRange(initialState.priceRange);
    }, [slug, searchParams, getInitialState]);

    // Efeito para buscar jogos do Firebase
    useEffect(() => {
        const fetchGames = async () => {
            setLoadingGames(true);
            try {
                let gamesCollectionRef = collection(db, 'games');
                let gamesQuery = gamesCollectionRef;

                const isAllCategory = slug.toLowerCase() === 'all';
                const baseTagFromSlug = isAllCategory ? '' : capitalize(decodeURIComponent(slug));

                // Se houver uma categoria base no slug, filtramos por ela no Firestore
                if (baseTagFromSlug) {
                    gamesQuery = query(gamesQuery, where('categories', 'array-contains', baseTagFromSlug));
                }

                // Aplicar filtros de preço no Firestore, se possível
                const minPriceVal = parseFloat(priceRange.min);
                const maxPriceVal = parseFloat(priceRange.max);

                if (!isNaN(minPriceVal) && minPriceVal > 0) {
                    gamesQuery = query(gamesQuery, where('price', '>=', minPriceVal));
                }
                if (!isNaN(maxPriceVal) && maxPriceVal !== Infinity && maxPriceVal !== 0) {
                    gamesQuery = query(gamesQuery, where('price', '<=', maxPriceVal));
                }

                const querySnapshot = await getDocs(gamesQuery);
                const fetchedGames = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Mapeia os campos do Firebase para as expectativas do componente
                    originalPrice: doc.data().oldPrice || doc.data().price, // Usa oldPrice se existir, senão price
                    discountedPrice: doc.data().price,
                    tags: doc.data().categories || [],
                    platforms: doc.data().platforms?.map(p => p.toLowerCase()) || [], // Garante minúsculas
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
    }, [slug, priceRange]); // Re-executa quando slug ou faixa de preço muda para buscar dados do Firestore

    // Efeito para popular as opções de filtro dinamicamente
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

    // Efeito para atualizar a URL com base nos filtros selecionados
    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
            return;
        }

        const query = new URLSearchParams();

        const isAllCategory = slug.toLowerCase() === 'all';
        const baseTag = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
        // Filtra a baseTag do slug para não duplicar se já estiver nos selectedTags adicionais
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
        const isAllCategory = slug.toLowerCase() === 'all';

        // Filtra a tag base do slug para não ser exibida duas vezes
        const baseTagLower = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
        const tagsToDisplay = selectedTags.filter(t => t !== baseTagLower).map(capitalize);
        const platformsToDisplay = selectedPlatforms.map(capitalize);

        if (tagsToDisplay.length === 0 && platformsToDisplay.length === 0 && !baseTagLower) {
            return 'Todos os Jogos';
        }

        let title = "Jogos";
        if (baseTagLower) {
            title += ` de ${capitalize(baseTagLower)}`;
        }
        if (tagsToDisplay.length > 0) {
            title += `${baseTagLower ? ' e' : ' de'} ${tagsToDisplay.join(', ')}`;
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
        // 'games' já está pré-filtrado por slug e preço pelo useEffect
        let gamesToFilter = [...games];

        const isAllCategory = slug.toLowerCase() === 'all';
        const baseTagLower = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();

        // Aplica filtros de tags adicionais (se houver mais de um ou se o slug não for a única tag)
        const effectiveSelectedTags = [...new Set(selectedTags.filter(t => t !== baseTagLower))]; // Tags selecionadas além da do slug
        if (effectiveSelectedTags.length > 0) {
            gamesToFilter = gamesToFilter.filter(game =>
                effectiveSelectedTags.every(st => game.tags.map(t => t.toLowerCase()).includes(st))
            );
        }

        // Aplica filtros de plataforma
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
    }, [games, selectedTags, selectedPlatforms, sortOrder, slug]); // Dependências

    const calculateDiscount = (original, discounted) => {
        if (!original || original <= discounted) return 0;
        return Math.round(((original - discounted) / original) * 100);
    };

    if (!isMounted || loadingGames) {
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
                            <button onClick={clearFilters} className={styles.clearButton}>
                                <X size={16}/> Limpar
                            </button>
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
                        {filteredAndSortedGames.length === 0 ? (
                            <p className={styles.noGamesMessage}>Nenhum jogo encontrado com os filtros selecionados.</p>
                        ) : (
                            filteredAndSortedGames.map(game => {
                                const discount = calculateDiscount(game.originalPrice, game.discountedPrice);
                                return (
                                    <Link key={game.id} href={`/product/${game.id}`} className={styles.gameCard}>
                                        <div className={styles.imageContainer}>
                                            <img src={game.coverImageUrl || game.headerImageUrl } alt={game.title} className={styles.gameImage} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x225/2e3a47/ffffff?text=No+Image'; }} />
                                            <div className={styles.platformIcons}>
                                                {game.platforms?.map(platform => (
                                                    <span key={platform} title={capitalize(platform)}>
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
                                                <span>{game.rating || 'N/A'}</span>
                                            </div>
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
