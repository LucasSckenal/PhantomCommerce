'use client';

import { ShoppingCart, Search, Heart, User, Menu } from 'lucide-react';
import styles from '../styles/Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <ShoppingCart size={20} />
            <div className={styles.gamepadIcon}>🎮</div>
          </div>
          <span className={styles.logoText}>PhantomCommerce</span>
        </div>

        <div className={styles.search}>
          <input 
            type="text" 
            placeholder="Procurar..." 
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <Search size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <a href="#" className={styles.navLink}>Home</a>
          <a href="#" className={styles.navLink}>Categorias</a>
        </nav>

        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <Heart size={20} />
            <span className={styles.notification}>1</span>
          </button>
          
          <button className={styles.actionButton}>
            <ShoppingCart size={20} />
            <span className={styles.notification}>1</span>
          </button>
          
          <button className={styles.actionButton}>
            <User size={20} />
          </button>
        </div>

        <button className={styles.mobileMenu}>
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
