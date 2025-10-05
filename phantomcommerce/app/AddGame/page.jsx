"use client";
import { useState, useEffect, useRef } from 'react';
import styles from './AddGame.module.scss';
import { PlusCircle, XCircle, Search, UploadCloud, CheckCircle } from 'lucide-react';

// Importações do Firebase SDK - SEM STORAGE
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// --- Configuração do Firebase usando Variáveis de Ambiente ---
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Inicializa o Firebase de forma segura (evita reinicialização)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// (O resto das constantes como 'allAvailableCategories' e 'platformOptions' permanecem as mesmas)
const allAvailableCategories = [
    "2.5D", "2D", "2D Fighter", "2D Platformer", "360 Video", "3D", "3D Fighter", "3D Platformer", "3D Vision", "Abstrato",
    "Roguelike de Acao", "Agricultura", "Aliens", "Historia Alternativa", "Anime", "Shooter de Arena", "Assassino", "Atmosferico",
    "Beat 'em up", "Motos", "Bullet Hell", "Capitalismo", "Cartoon", "Cartoonizado", "Casual", "Gatos",
    "Faca sua Propria Aventura", "Cinematico", "Construtor de Cidade", "Colorido", "Simulador de Colonia",
    "Corrida com Combate", "Comic Book", "Conspiracy", "CRPG", "Crime", "Fofo", "Cyberpunk", "Edgy", "Fantasia Dark", "Dating Sim",
    "Demonios", "Destruicao", "Detetive", "Dinossauros", "Diplomacia", "Cachorro", "Dragoes", "Dungeon Crawler", "Narracao Dinamica",
    "Economia", "Education", "Fe", "Family Friendly", "Fantasia", "Primeira-pessoa", "Voo", "FPS",
    "Futuristico", "Gambling", "Game Development", "Gothic", "Grand Strategy", "Hack and Slash", "Desenhado-a-Mao", 
    "Hero Shooter", "Historico", "Horror", "Cavalos", "Simulador Imersivo", "Indie", "Investigacao",
    "JRPG", "LGBTQ+", "Life Sim", "Logica", "Looter Shooter", "Lovecraftiano", "Magica",
    "Mechs", "Medieval", "Memes", "Metroidvania", "Militarismo", "Minimalismo", "Moderno", "Misterio",
    "Mystery Dungeon", "Mitologia", "Natureza", "Naval", "Ninja", "Offroad", "Old School",
    "Minecraft-like", "Otome", "Parkour", "Filosofico", "Pirates", "Grafico Pixelado", "Politico",
    "Politics", "Pool", "Pos-Apocaliptico", "Programacao", "Psicodelico", "Puzzle", "Racing", "RTS",
    "Real Time Tactics", "Realista", "Retro", "Robots", "Roguelite",  "Roguevania", "Romance", "Rome", "RPG",
    "Corredor", "Satira", "Ciencia", "Sci-fi", "Shoot 'Em Up", "Shooter", "Side Scroller", "Simulacao", "Sniper", "Neve",
    "Souls-like", "Espaco", "Tela dividida", "Sports", "Stealth", "Steampunk",
    "Estrategia", "Estilizado", "Submarino", "Superheroi", "Supernatural", "Surreal", "Sobrevivencia", "Sobrevivencia c/ Horror",
    "Tatico", "RPG Tatico", "Tanques", "Baseado em Texto", "Terceira Pessoa", "Shooter de Terceira Pessoa", "Gerenciamento",
    "Viagem no tempo", "Vista Isometrica", "Defesa de Torre", "Trocas", "Jogos de Cartinha",
    "Trens", "Transporte", "Combate em Turno", "Estrategia em Turno", "Taticas em Turno",
    "Escrevendo", "Subterraneo", "Em baixo da agua", "Vampiro", "Visual Novel", "Voxel", "VR", "Guerra",
    "Lobisomens", "Ocidental", "Guerra Mundial", "Zumbis", "Competitivo", "Controle", "Co-op", "Co-op local", "Comedia", "Aventura", "Acao", "Multijogador", "Um jogador"
].sort();

const platformOptions = ["PlayStation", "Xbox", "Steam", "Nintendo Switch", "PC"];

// --- Componente reutilizável para Upload de Imagem ---
function ImageUpload({ label, onFileSelect, previewUrl, onRemove }) {
    const inputRef = useRef(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className={styles.imageUploadGroup}>
            <label>{label}</label>
            <div className={`${styles.uploadBox} ${previewUrl ? styles.hasPreview : ''}`} onClick={() => !previewUrl && inputRef.current.click()}>
                <input type="file" ref={inputRef} onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" style={{ display: 'none' }} />
                {previewUrl ? (
                    <>
                        <img src={previewUrl} alt="Pré-visualização" className={styles.previewImage} />
                        <button type="button" onClick={onRemove} className={styles.removePreviewButton}>
                            <XCircle size={22} />
                        </button>
                    </>
                ) : (
                    <div className={styles.uploadPlaceholder}>
                        <UploadCloud size={32} />
                        <span>Clique para enviar</span>
                        <small>PNG, JPG, WEBP</small>
                    </div>
                )}
            </div>
        </div>
    );
}


export default function AddGame() {
    const [gameData, setGameData] = useState({
        title: '', description: '', about: '', price: '', oldPrice: '', developer: '', publisher: '',
        releaseDate: '', classification: 'Livre', rating: '',
    });
    // --- ALTERADO: Estados para armazenar imagens como Base64 ---
    const [imageBase64, setImageBase64] = useState({
        header: null, cover: null
    });
    const [imagePreviews, setImagePreviews] = useState({
        header: '', cover: ''
    });

    const [platforms, setPlatforms] = useState([]);
    const [systemRequirements, setSystemRequirements] = useState({
        minimum: { cpu: '', ram: '', gpu: '', storage: '' },
        recommended: { cpu: '', ram: '', gpu: '', storage: '' }
    });
    const [categories, setCategories] = useState(['']);
    const [trailerUrls, setTrailerUrls] = useState(['']);
    const [galleryImageBase64, setGalleryImageBase64] = useState([]);
    const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);
    
    const [allGames, setAllGames] = useState([]);
    const [relatedSearchQuery, setRelatedSearchQuery] = useState('');
    const [relatedSearchResults, setRelatedSearchResults] = useState([]);
    const [selectedRelatedGames, setSelectedRelatedGames] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const relatedSearchRef = useRef(null);

    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    
    const gamesCollectionPath = `/games`;

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, gamesCollectionPath));
                setAllGames(querySnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title })));
            } catch (error) { console.error("Erro ao buscar jogos:", error); }
        };
        fetchGames();
    }, [gamesCollectionPath]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (relatedSearchRef.current && !relatedSearchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const handleFileSelect = async (file, type) => {
        try {
            const base64 = await fileToBase64(file);
            setImageBase64(prev => ({ ...prev, [type]: base64 }));
            setImagePreviews(prev => ({ ...prev, [type]: base64 }));
        } catch (error) {
            console.error("Erro ao converter arquivo para Base64:", error);
        }
    };

    const handleRemoveFile = (type) => {
        setImageBase64(prev => ({ ...prev, [type]: null }));
        setImagePreviews(prev => ({ ...prev, [type]: '' }));
    };
    
    const handleGalleryFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        const base64Promises = files.map(file => fileToBase64(file));
        try {
            const base64Results = await Promise.all(base64Promises);
            setGalleryImageBase64(prev => [...prev, ...base64Results]);
            setGalleryImagePreviews(prev => [...prev, ...base64Results]);
        } catch (error) {
            console.error("Erro ao converter arquivos da galeria para Base64:", error);
        }
    };

    const handleRemoveGalleryFile = (index) => {
        setGalleryImageBase64(prev => prev.filter((_, i) => i !== index));
        setGalleryImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setGameData({
            title: '', description: '', about: '', price: '', oldPrice: '', developer: '', publisher: '',
            releaseDate: '', classification: 'Livre', rating: '',
        });
        setImageBase64({ header: null, cover: null });
        setImagePreviews({ header: '', cover: '' });
        setPlatforms([]);
        setSystemRequirements({
            minimum: { cpu: '', ram: '', gpu: '', storage: '' },
            recommended: { cpu: '', ram: '', gpu: '', storage: '' }
        });
        setCategories(['']);
        setTrailerUrls(['']);
        setGalleryImageBase64([]);
        setGalleryImagePreviews([]);
        setSelectedRelatedGames([]);
        setRelatedSearchQuery('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGameData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlatformChange = (e) => {
        const { value, checked } = e.target;
        setPlatforms(prev => checked ? [...prev, value] : prev.filter(p => p !== value));
    };

    const handleSystemReqChange = (e) => {
        const { name, value } = e.target;
        const [type, field] = name.split('-');
        setSystemRequirements(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };
    
    const handleDynamicList = (action, type, index, value = '') => {
        const listMap = {
            trailer: { list: trailerUrls, setter: setTrailerUrls },
            category: { list: categories, setter: setCategories },
        };
        const { list, setter } = listMap[type];
        let newList = [...list];

        if (action === 'add') {
            newList.push('');
        } else if (action === 'remove') {
            if (list.length > 1) newList = newList.filter((_, i) => i !== index);
            else if (type === 'category') newList = [''];
        } else if (action === 'update') {
            newList[index] = value;
            if (type === 'category' && value && index === list.length - 1 && list.filter(c => c).length < allAvailableCategories.length) {
                newList.push('');
            }
        }
        setter(newList);
    };

    const handleRelatedSearchChange = (e) => {
        const query = e.target.value;
        setRelatedSearchQuery(query);
        if (query) {
            const selectedIds = selectedRelatedGames.map(g => g.id);
            setRelatedSearchResults(allGames.filter(g => g.title.toLowerCase().includes(query.toLowerCase()) && !selectedIds.includes(g.id)));
        } else {
            setRelatedSearchResults([]);
        }
    };

    const addRelatedGame = (game) => {
        setSelectedRelatedGames(prev => [...prev, game]);
        setRelatedSearchQuery('');
        setRelatedSearchResults([]);
        setIsSearchFocused(false);
    };
    
    const removeRelatedGame = (gameId) => {
        setSelectedRelatedGames(prev => prev.filter(g => g.id !== gameId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ message: '', type: '' });

        const finalCategories = categories.filter(cat => cat && cat.trim() !== '');
        if (!gameData.title || !gameData.price || finalCategories.length === 0) {
            setStatus({ message: 'Preencha Título, Preço e pelo menos uma Categoria.', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const newGame = {
                ...gameData,
                price: parseFloat(gameData.price),
                oldPrice: gameData.oldPrice ? parseFloat(gameData.oldPrice) : null,
                rating: gameData.rating ? parseFloat(gameData.rating) : null,
                headerImageUrl: imageBase64.header,
                coverImageUrl: imageBase64.cover,
                platforms,
                categories: finalCategories,
                trailerUrls: trailerUrls.filter(url => url.trim() !== ''),
                galleryImageUrls: galleryImageBase64,
                // ALTERADO: Salva os nomes dos jogos em vez dos IDs
                relatedGameNames: selectedRelatedGames.map(game => game.title),
                systemRequirements,
                createdAt: new Date(),
            };

            await addDoc(collection(db, gamesCollectionPath), newGame);
            setStatus({ message: 'Jogo adicionado com sucesso!', type: 'success' });
            resetForm();

        } catch (error) {
            console.error("Erro ao adicionar o jogo: ", error);
            let errorMessage = 'Ocorreu um erro ao adicionar o jogo. Verifique o console.';
            if (error.message.includes("document exceeds the maximum size")) {
                errorMessage = 'Erro: Uma ou mais imagens são muito grandes. Tente usar imagens menores.';
            }
            setStatus({ message: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>Adicionar Novo Jogo</h1>
                <p className={styles.subtitle}>Preencha os detalhes para cadastrar um novo jogo na plataforma.</p>
                
                <form onSubmit={handleSubmit} noValidate>
                    <h2 className={styles.sectionTitle}>Informações Principais</h2>
                    <div className={styles.formGrid}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}><label htmlFor="title">Título do Jogo</label><input type="text" id="title" name="title" value={gameData.title} onChange={handleChange} required /></div>
                        <div className={styles.formGroup}><label htmlFor="price">Preço (ex: 129.99)</label><input type="number" step="0.01" id="price" name="price" value={gameData.price} onChange={handleChange} required /></div>
                        <div className={styles.formGroup}><label htmlFor="oldPrice">Preço Antigo (Opcional)</label><input type="number" step="0.01" id="oldPrice" name="oldPrice" value={gameData.oldPrice} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label htmlFor="developer">Desenvolvedora</label><input type="text" id="developer" name="developer" value={gameData.developer} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label htmlFor="publisher">Editora</label><input type="text" id="publisher" name="publisher" value={gameData.publisher} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label htmlFor="releaseDate">Data de Lançamento</label><input type="date" id="releaseDate" name="releaseDate" value={gameData.releaseDate} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label htmlFor="rating">Avaliação (0 a 5)</label><input type="number" step="0.1" min="0" max="5" id="rating" name="rating" value={gameData.rating} onChange={handleChange} /></div>
                    </div>

                    <h2 className={styles.sectionTitle}>Plataformas e Classificação</h2>
                     <div className={styles.formGrid}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Plataformas</label>
                            <div className={styles.platformGrid}>
                                {platformOptions.map(platform => (
                                    <label key={platform} className={styles.platformLabel}>
                                        <input type="checkbox" value={platform} checked={platforms.includes(platform)} onChange={handlePlatformChange} />
                                        {platform}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                             <label htmlFor="classification">Classificação Indicativa</label>
                             <select id="classification" name="classification" value={gameData.classification} onChange={handleChange}>
                                 <option>Livre</option><option>10+</option><option>12+</option><option>14+</option><option>16+</option><option>18+</option>
                             </select>
                        </div>
                    </div>


                    <h2 className={styles.sectionTitle}>Categorias</h2>
                    <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.categoryGroup}`}>
                        {categories.map((category, index) => (
                            <div key={index} className={styles.dynamicField}>
                                <select value={category} onChange={(e) => handleDynamicList('update', 'category', index, e.target.value)} required={index === 0 && !category}>
                                    <option value="" disabled>Selecione uma categoria...</option>
                                    {allAvailableCategories.map(cat => (<option key={cat} value={cat} disabled={categories.includes(cat) && category !== cat}>{cat}</option>))}
                                </select>
                                <button type="button" onClick={() => handleDynamicList('remove', 'category', index)} className={styles.removeButton}><XCircle size={20}/></button>
                            </div>
                        ))}
                    </div>

                    <h2 className={styles.sectionTitle}>Descrição e Mídia</h2>
                    <div className={styles.formGrid}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}><label htmlFor="about">Sobre (Descrição curta)</label><textarea id="about" name="about" rows="3" value={gameData.about} onChange={handleChange}></textarea></div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}><label htmlFor="description">Descrição Completa</label><textarea id="description" name="description" rows="6" value={gameData.description} onChange={handleChange}></textarea></div>
                    </div>
                    
                    <div className={styles.imageUploadGrid}>
                        <ImageUpload label="Imagem de Cabeçalho" onFileSelect={(file) => handleFileSelect(file, 'header')} previewUrl={imagePreviews.header} onRemove={() => handleRemoveFile('header')} />
                        <ImageUpload label="Imagem de Capa" onFileSelect={(file) => handleFileSelect(file, 'cover')} previewUrl={imagePreviews.cover} onRemove={() => handleRemoveFile('cover')} />
                    </div>

                    <div className={styles.formGrid}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Trailers</label>
                            {trailerUrls.map((url, i) => (<div key={i} className={styles.dynamicField}><input type="url" value={url} onChange={(e) => handleDynamicList('update', 'trailer', i, e.target.value)} placeholder="https://youtube.com/watch?v=..."/><button type="button" onClick={() => handleDynamicList('remove', 'trailer', i)} className={styles.removeButton}><XCircle size={20}/></button></div>))}
                            <button type="button" onClick={() => handleDynamicList('add', 'trailer')} className={styles.addButton}><PlusCircle size={18}/> Adicionar Trailer</button>
                        </div>
                        
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label>Galeria de Imagens</label>
                            <div className={styles.galleryPreviewContainer}>
                                {galleryImagePreviews.map((previewUrl, i) => (
                                    <div key={i} className={styles.galleryPreviewItem}>
                                        <img src={previewUrl} alt={`Prévia da galeria ${i + 1}`} />
                                        <button type="button" onClick={() => handleRemoveGalleryFile(i)} className={styles.removeGalleryButton}>
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                ))}
                                <label className={styles.addGalleryButton}>
                                    <PlusCircle size={24} />
                                    <span>Adicionar</span>
                                    <input type="file" multiple onChange={handleGalleryFileSelect} accept="image/jpeg, image/png, image/webp" style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Requisitos de Sistema</h2>
                    <div className={styles.requirementsContainer}>
                        <div className={styles.requirementsSection}>
                            <h3>Mínimos</h3>
                            <div className={styles.requirementsGrid}>
                                <div className={styles.formGroup}><label>CPU</label><input type="text" name="minimum-cpu" value={systemRequirements.minimum.cpu} onChange={handleSystemReqChange}/></div>
                                <div className={styles.formGroup}><label>RAM</label><input type="text" name="minimum-ram" value={systemRequirements.minimum.ram} onChange={handleSystemReqChange}/></div>
                                <div className={styles.formGroup}><label>GPU</label><input type="text" name="minimum-gpu" value={systemRequirements.minimum.gpu} onChange={handleSystemReqChange}/></div>
                                <div className={styles.formGroup}><label>Armazenamento</label><input type="text" name="minimum-storage" value={systemRequirements.minimum.storage} onChange={handleSystemReqChange}/></div>
                            </div>
                        </div>
                        <div className={styles.requirementsSection}>
                            <h3>Recomendados</h3>
                             <div className={styles.requirementsGrid}>
                                <div className={styles.formGroup}><label>CPU</label><input type="text" name="recommended-cpu" value={systemRequirements.recommended.cpu} onChange={handleSystemReqChange}/></div>
                                <div className={styles.formGroup}><label>RAM</label><input type="text" name="recommended-ram" value={systemRequirements.recommended.ram} onChange={handleSystemReqChange}/></div>
                                <div className={styles.formGroup}><label>GPU</label><input type="text" name="recommended-gpu" value={systemRequirements.recommended.gpu} onChange={handleSystemReqChange}/></div>
                                <div className={styles.formGroup}><label>Armazenamento</label><input type="text" name="recommended-storage" value={systemRequirements.recommended.storage} onChange={handleSystemReqChange}/></div>
                            </div>
                        </div>
                    </div>
                    
                    <h2 className={styles.sectionTitle}>Jogos Relacionados</h2>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`} ref={relatedSearchRef}>
                        <label htmlFor="relatedSearch">Buscar e adicionar jogos</label>
                        <div className={styles.relatedSearchWrapper}>
                            <Search className={styles.relatedSearchIcon} size={20} />
                            <input type="text" id="relatedSearch" placeholder="Digite o nome de um jogo..." value={relatedSearchQuery} onChange={handleRelatedSearchChange} onFocus={() => setIsSearchFocused(true)} autoComplete="off" />
                        </div>
                        {isSearchFocused && relatedSearchResults.length > 0 && (
                            <div className={styles.searchResultsDropdown}>
                                {relatedSearchResults.map(g => (<div key={g.id} className={styles.searchResultItem} onClick={() => addRelatedGame(g)}>{g.title}</div>))}
                            </div>
                        )}
                        <div className={styles.selectedGamesContainer}>
                            {selectedRelatedGames.map(g => (<div key={g.id} className={styles.selectedGamePill}><span>{g.title}</span><button type="button" onClick={() => removeRelatedGame(g.id)} className={styles.removePillButton}><XCircle size={16}/></button></div>))}
                        </div>
                    </div>

                    {status.message && <div className={`${styles.statusMessage} ${styles[status.type]}`}>{status.message}</div>}
                    <button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'A adicionar...' : 'Adicionar Jogo'}</button>
                </form>
            </div>
        </div>
    );
}

