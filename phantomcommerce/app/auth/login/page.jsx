"use client";

import { useState } from 'react';
import styles from '../../styles/Login.module.scss';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Senha:', password);
    alert('Login submetido! Verifique o console.');
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Faça seu login</h1>
        <h3>Acesse sua conta para continuar</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>

        <div className={styles.signupLink}>
          Não tem uma conta? <Link href="/auth/register">Crie uma agora</Link>
        </div>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <div className={styles.socialLogin}>
          <button className={`${styles.socialButton} ${styles.google}`}>
            <Image
              src="/google.png"
              alt="Google"
              width={77}
              height={77}
            />
          </button>
          <button className={`${styles.socialButton} ${styles.twitter}`}>
            <Image
              src="/x.png"
              alt="X"
              width={77}
              height={77}
            />
          </button>
          <button className={`${styles.socialButton} ${styles.facebook}`}>
            <Image
              src="/facebook.png"
              alt="Facebook"
              width={77}
              height={77}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
