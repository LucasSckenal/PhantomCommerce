// page.jsx - RegisterPage atualizado
"use client";

import React, { useState, useRef } from "react";
import styles from './Register.module.scss';
import Link from 'next/link';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function RegisterPage() {
  const { signup } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo e tamanho do arquivo
      if (!file.type.startsWith('image/')) {
        setErrors({ avatar: 'Por favor, selecione uma imagem válida' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors({ avatar: 'A imagem deve ter menos de 5MB' });
        return;
      }
      
      setAvatarFile(file);
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
    setAvatarFile(null);
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
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
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

  const uploadAvatarToStorage = async (file, userId) => {
    try {
      const storage = getStorage();
      const fileExtension = file.name.split('.').pop();
      const avatarRef = ref(storage, `avatars/${userId}/profile.${fileExtension}`);
      
      // Fazer upload do arquivo
      const snapshot = await uploadBytes(avatarRef, file);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      let photoURL = '';
      
      // 1. Se houver avatar, fazer upload primeiro
      if (avatarFile) {
        // Criar usuário temporariamente para obter o UID
        // Na prática, faremos o upload após criar o usuário
        // Vamos lidar com isso após a criação do usuário
      }

      // 2. Preparar dados do usuário
      const userData = {
        name: formData.name.trim(),
        // photoURL será adicionado após o upload
      };

      // 3. Criar usuário no Auth e Firestore
      const userCredential = await signup(formData.email, formData.password, userData);
      const user = userCredential.user;

      // 4. Se houver avatar, fazer upload com o UID real
      if (avatarFile) {
        try {
          photoURL = await uploadAvatarToStorage(avatarFile, user.uid);
          
          // Atualizar perfil com a photoURL
          await updateProfile(user, { photoURL });
          
          // Atualizar no Firestore também
          // (Isso pode ser feito em uma função separada ou no próprio signup)
        } catch (avatarError) {
          console.warn('Erro no upload do avatar, continuando sem foto:', avatarError);
          // Não impedir o registro se o avatar falhar
        }
      }

      console.log('Usuário registrado com sucesso:', user.uid);
      router.push('/'); // Redirecionar para página inicial após registro
    } catch (error) {
      console.error('Erro no registro:', error);
      setErrors({ submit: getAuthErrorMessage(error.code) });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'google') {
        await loginWithGoogle();
        router.push('/');
      }
    } catch (error) {
      console.error('Erro no login social:', error);
      setErrors({ submit: getAuthErrorMessage(error.code) });
    }
  };

  const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'Este email já está em uso.',
      'auth/invalid-email': 'Email inválido.',
      'auth/operation-not-allowed': 'Operação não permitida.',
      'auth/weak-password': 'Senha muito fraca.',
      'auth/user-disabled': 'Esta conta foi desativada.',
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/popup-closed-by-user': 'Popup fechado pelo usuário.',
      'auth/cancelled-popup-request': 'Solicitação de popup cancelada.',
      'auth/popup-blocked': 'Popup bloqueado pelo navegador.',
    };
    return errorMessages[errorCode] || 'Ocorreu um erro inesperado. Tente novamente.';
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
          {errors.avatar && <span className={styles.errorText}>{errors.avatar}</span>}
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

          {errors.submit && <span className={styles.errorText}>{errors.submit}</span>}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <p className={styles.loginLink}>
          Já tem uma conta? <Link href="/auth/login">Faça login</Link>
        </p>

        <div className={styles.divider}>
          <span></span> ou <span></span>
        </div>

        <div className={styles.socialLogin}>
          <button 
            className={`${styles.socialButton} ${styles.google}`}
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <Image
              src="/google.png"
              alt="Google"
              width={77}
              height={77}
            />
          </button>
        </div>
      </div>
    </div>
  );
}