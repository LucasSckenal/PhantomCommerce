// Importações do Firebase SDK
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

import HeroSection from '../../components/HeroSection/HeroSection';
import GameDetails from '../../components/GameDetails/GameDetails';
import RelatedGames from '../../components/RelatedGames/RelatedGames';
import Header from '../../components/Header/Header';

// --- Configuração do Firebase ---
// Garanta que essas variáveis de ambiente estejam configuradas no seu ambiente Next.js.
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

// Função para buscar um único jogo pelo ID
async function getGame(id) {
    try {
        const gameRef = doc(db, 'games', id);
        const gameSnap = await getDoc(gameRef);

        if (!gameSnap.exists()) {
            return null;
        }

        const gameData = gameSnap.data();
        
        // Mapeia os campos do Firebase para a estrutura que seus componentes esperam
        return {
            id: gameSnap.id,
            ...gameData,
            originalPrice: gameData.oldPrice || gameData.price,
            discountedPrice: gameData.price,
            tags: gameData.categories || [],
            platforms: gameData.platforms || [],
            gallery: gameData.galleryImageUrls || [],
            // O campo relatedGameNames será usado para buscar os jogos relacionados
        };
    } catch (error) {
        console.error("Erro ao buscar o jogo:", error);
        return null;
    }
}

// Função para buscar jogos relacionados pelos seus nomes
async function getRelatedGames(gameNames = []) {
    if (!gameNames || gameNames.length === 0) {
        return [];
    }

    try {
        // O Firestore limita a cláusula 'in' a 30 itens. Se precisar de mais, terá que fazer múltiplas queries.
        const gamesRef = collection(db, 'games');
        const q = query(gamesRef, where('title', 'in', gameNames.slice(0, 30)));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            originalPrice: doc.data().oldPrice || doc.data().price,
            discountedPrice: doc.data().price,
            tags: doc.data().categories || [],
            platforms: doc.data().platforms || [],
            gallery: doc.data().galleryImageUrls || [],
        }));
    } catch (error) {
        console.error("Erro ao buscar jogos relacionados:", error);
        return [];
    }
}

// A página do produto agora é um Server Component assíncrono
export default async function ProductPage({ params }) {
    const { id } = params;
    const game = await getGame(id);

    if (!game) {
        return <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Jogo não encontrado</h1>;
    }

    // Busca os dados completos dos jogos relacionados
    const relatedGames = await getRelatedGames(game.relatedGameNames);

    return (
        <>
            <Header />
            <HeroSection game={game} />
            <GameDetails game={game} />
            <RelatedGames games={relatedGames} />
        </>
    );
}

// (Opcional, mas bom para performance) Gera as páginas estáticas no momento do build
export async function generateStaticParams() {
    try {
        const gamesCol = collection(db, 'games');
        const gamesSnapshot = await getDocs(gamesCol);
        const paths = gamesSnapshot.docs.map(doc => ({
            id: doc.id,
        }));
        return paths;
    } catch (error) {
        console.error("Erro ao gerar parâmetros estáticos:", error);
        return [];
    }
}
