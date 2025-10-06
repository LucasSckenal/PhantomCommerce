// contexts/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';

// 1. Criar o Contexto
const AuthContext = createContext();

// 2. Criar o Provedor
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();

  // Função para salvar/atualizar usuário no Firestore
  const saveUserToFirestore = async (user, additionalData = {}) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.name || '',
        photoURL: user.photoURL || additionalData.photoURL || '',
        emailVerified: user.emailVerified,
        createdAt: userSnapshot.exists() 
          ? userSnapshot.data().createdAt 
          : serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        ...additionalData
      };

      await setDoc(userRef, userData, { merge: true });
      return userData;
    } catch (error) {
      console.error('Erro ao salvar usuário no Firestore:', error);
      throw error;
    }
  };

  // Função para fazer upload de avatar
  const uploadAvatar = async (file, userId) => {
    try {
      const storage = getStorage();
      const fileExtension = file.name.split('.').pop();
      const avatarRef = ref(storage, `avatars/${userId}/profile.${fileExtension}`);
      
      const snapshot = await uploadBytes(avatarRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      throw error;
    }
  };

  // Efeito para ouvir o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // O usuário está logado
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };

        setCurrentUser(userData);

        // Buscar dados adicionais do Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Se não existir no Firestore, criar o documento
            await saveUserToFirestore(user);
            setUserProfile(userData);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUserProfile(userData);
        }
      } else {
        // O usuário não está logado
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Função de Registro com salvamento no Firestore
  const signup = async (email, password, userData = {}) => {
    try {
      // 1. Criar usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Se houver arquivo de avatar, fazer upload
      let photoURL = '';
      if (userData.avatarFile) {
        try {
          photoURL = await uploadAvatar(userData.avatarFile, user.uid);
          delete userData.avatarFile; // Remover o arquivo dos dados
        } catch (avatarError) {
          console.warn('Erro no upload do avatar:', avatarError);
          // Continuar sem avatar se houver erro
        }
      }

      // 3. Preparar dados do perfil
      const profileData = {
        displayName: userData.name || '',
        photoURL: photoURL || userData.photoURL || '',
      };

      // 4. Atualizar perfil no Authentication
      if (profileData.displayName || profileData.photoURL) {
        await updateProfile(user, profileData);
      }

      // 5. Salvar dados completos no Firestore
      const firestoreData = {
        ...userData,
        ...profileData,
      };
      delete firestoreData.avatarFile; // Garantir que o arquivo seja removido

      await saveUserToFirestore(user, firestoreData);

      // 6. Atualizar estado local
      setCurrentUser(prev => ({
        ...prev,
        ...profileData
      }));

      return userCredential;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  // Função de Login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Atualizar último login no Firestore
      if (userCredential.user) {
        await updateDoc(doc(db, 'users', userCredential.user.uid), {
          lastLoginAt: serverTimestamp()
        });
      }
      
      return userCredential;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // Função de Login com Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Salvar/atualizar usuário no Firestore
      await saveUserToFirestore(user, {
        provider: 'google'
      });

      return userCredential;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  };

  // Função de Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  // Função para atualizar perfil
  const updateUserProfile = async (profileData) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const user = auth.currentUser;

      // Se houver novo arquivo de avatar, fazer upload
      let updatedProfileData = { ...profileData };
      if (profileData.avatarFile) {
        try {
          const photoURL = await uploadAvatar(profileData.avatarFile, currentUser.uid);
          updatedProfileData.photoURL = photoURL;
          delete updatedProfileData.avatarFile;
        } catch (avatarError) {
          console.warn('Erro ao atualizar avatar:', avatarError);
          delete updatedProfileData.avatarFile;
        }
      }

      // Atualizar no Authentication
      if (updatedProfileData.displayName || updatedProfileData.photoURL) {
        await updateProfile(user, {
          displayName: updatedProfileData.displayName,
          photoURL: updatedProfileData.photoURL
        });
      }

      // Atualizar no Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...updatedProfileData,
        updatedAt: serverTimestamp()
      });

      // Atualizar estado local
      const newUserData = {
        ...currentUser,
        displayName: updatedProfileData.displayName || currentUser.displayName,
        photoURL: updatedProfileData.photoURL || currentUser.photoURL,
      };

      setCurrentUser(newUserData);
      setUserProfile(prev => ({
        ...prev,
        ...updatedProfileData
      }));

      return newUserData;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  // Função para redefinir senha (opcional - pode ser implementada depois)
  const resetPassword = async (email) => {
    // Implementação da redefinição de senha pode ser adicionada aqui
    throw new Error('Funcionalidade ainda não implementada');
  };

  // Função para buscar dados atualizados do usuário
  const refreshUserProfile = async () => {
    if (!currentUser) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        return userDoc.data();
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      throw error;
    }
  };

  // O valor que será partilhado com os componentes
  const value = {
    // Estados
    currentUser,
    userProfile,
    loading,
    
    // Métodos de autenticação
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    
    // Métodos de perfil
    updateUserProfile,
    refreshUserProfile,
    
    // Utilitários
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.emailVerified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Hook customizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};