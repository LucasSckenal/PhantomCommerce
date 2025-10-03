"use client";

import React, { useState, useRef } from "react";
import styles from './Register.module.scss';
import Link from 'next/link';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = (e) => {
    e.stopPropagation();
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form data:', formData);
      console.log('Avatar:', avatarPreview);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1>Crie sua conta</h1>
        <h3>Junte-se a nós e comece a explorar</h3>

        {/* Upload de foto */}
        <div className={styles.avatarUpload}>
          <label htmlFor="avatar">
            <div 
              className={`${styles.avatarCircle} ${avatarPreview ? styles.hasImage : ''}`}
              onClick={() => !avatarPreview && fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <>
                  <img src={avatarPreview} alt="Preview" className={styles.avatarImage} />
                  <div className={styles.avatarOverlay}>
                    <X size={32} className={styles.removeIcon} onClick={removeAvatar} />
                  </div>
                </>
              ) : (
                <Camera size={24} />
              )}
            </div>
            <span>{avatarPreview ? 'Alterar foto' : 'Adicionar foto'}</span>
          </label>
          <input
            type="file"
            id="avatar"
            ref={fileInputRef}
            hidden
            onChange={handleAvatarChange}
            accept="image/*"
          />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Seu nome completo" 
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.error : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Digite seu e-mail" 
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.error : ''}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Digite sua senha" 
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.error : ''}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="Digite sua senha novamente" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? styles.error : ''}
            />
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className={styles.submitButton}>Registrar</button>
        </form>

        <p className={styles.loginLink}>
          Já tem uma conta? <Link href="/auth/login">Faça login</Link>
        </p>

        <div className={styles.divider}>
          <span></span> ou <span></span>
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