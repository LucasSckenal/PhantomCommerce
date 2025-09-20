"use client"; // se estiver usando App Router e precisar de interatividade

import React from "react";
import styles from '../../styles/Register.module.scss';

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1>Crie sua conta</h1>
        <p>Junte-se a nós e comece a explorar</p>

        {/* Upload de foto */}
        <div className={styles.avatarUpload}>
          <label htmlFor="avatar">
            <div className={styles.avatarCircle}>+</div>
            <span>Adicionar foto</span>
          </label>
          <input type="file" id="avatar" hidden />
        </div>

        <form className={styles.form}>
          <label htmlFor="name">Nome</label>
          <input type="text" id="name" placeholder="Seu nome completo" required />

          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" placeholder="Digite seu e-mail" required />

          <label htmlFor="password">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" required />

          <label htmlFor="confirm">Confirmar senha</label>
          <input type="password" id="confirm" placeholder="Digite sua senha" required />

          <button type="submit">Registrar</button>
        </form>

        <p className={styles.loginLink}>
          Já tem uma conta? <a href="/auth/login">Faça login</a>
        </p>

        <div className={styles.divider}>
          <span></span> ou <span></span>
        </div>

        <div className={styles.socialLogin}>
          <button className={styles.google}>G</button>
          <button className={styles.twitter}>X</button>
          <button className={styles.facebook}>f</button>
        </div>
      </div>
    </div>
  );
}
