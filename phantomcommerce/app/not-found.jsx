"use client";

import styles from "./styles/NotFound.module.scss";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Ghost } from 'lucide-react'; // Importando o ícone de fantasma

export default function NotFoundPage() {
  const router = useRouter();

  // Função para lidar com a busca.
  // Adapte a rota '/search' conforme a estrutura do seu projeto.
  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.elements.search.value;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.illustration}>
           {/* Usando o ícone importado com animação */}
           <Ghost className={styles.icon} />
        </div>
        <h1 className={styles.title404}>404</h1>
        <h2 className={styles.subtitle}>Página Não Encontrada</h2>
        <p className={styles.description}>
          Ops! Parece que a página que você está procurando não existe ou foi movida.
        </p>

        {/* Barra de Busca */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input 
            type="search" 
            name="search"
            placeholder="O que você procura?" 
            className={styles.searchInput}
            aria-label="Barra de pesquisa"
          />
          <button type="submit" className={styles.searchButton} aria-label="Buscar">Buscar</button>
        </form>

        <div className={styles.actions}>
            <Link href="/" className={`${styles.actionButton} ${styles.primary}`}>
              Voltar à Página Inicial
            </Link>
            <Link href="/contact" className={`${styles.actionButton} ${styles.secondary}`}>
              Entrar em Contato
            </Link>
        </div>
      </div>
    </div>
  );
}

