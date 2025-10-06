"use client";

import { useState } from 'react';
import styles from './Login.module.scss';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho conforme necessário
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      router.push('/'); // Redirecionar para página inicial após login
    } catch (error) {
      console.error('Erro no login:', error);
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
      // Adicione outros providers aqui conforme necessário
    } catch (error) {
      console.error('Erro no login social:', error);
      setErrors({ submit: getAuthErrorMessage(error.code) });
    }
  };

  const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'Email inválido.',
      'auth/user-disabled': 'Esta conta foi desativada.',
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-credential': 'Credenciais inválidas.',
      'auth/too-many-requests': 'Muitas tentativas falhas. Tente novamente mais tarde.',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
      'auth/popup-closed-by-user': 'Popup fechado pelo usuário.',
      'auth/cancelled-popup-request': 'Solicitação de popup cancelada.',
      'auth/popup-blocked': 'Popup bloqueado pelo navegador.',
    };
    return errorMessages[errorCode] || 'Ocorreu um erro inesperado. Tente novamente.';
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
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.error : ''}
                required
              />
            </div>
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? styles.error : ''}
                required
              />
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          {errors.submit && <span className={styles.errorText}>{errors.submit}</span>}

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.signupLink}>
          Não tem uma conta? <Link href="/auth/register">Crie uma agora</Link>
        </div>

        <div className={styles.divider}>
          <span>ou</span>
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
          {/* Adicione outros botões sociais conforme necessário */}
          {/* <button className={`${styles.socialButton} ${styles.twitter}`}>
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
          </button> */}
        </div>
      </div>
    </div>
  );
}