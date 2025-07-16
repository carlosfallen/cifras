import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const googleProvider = new GoogleAuthProvider();
  
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      return firebaseUser;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            // ✅ CORREÇÃO: Sempre incluir o uid dos dados do Firebase Auth
            const userData = userDoc.data();
            const userWithUid: User = {
              uid: firebaseUser.uid,  // ← Sempre usar o uid do Firebase Auth
              email: userData.email || firebaseUser.email!,
              displayName: userData.displayName || firebaseUser.displayName || 'Usuário',
              createdAt: userData.createdAt?.toDate() || new Date(),
              // Adicione outros campos se necessário
              ...(userData.notificationToken && { notificationToken: userData.notificationToken }),
              ...(userData.lastTokenUpdate && { lastTokenUpdate: userData.lastTokenUpdate })
            };
            
            console.log('User data loaded:', userWithUid);
            setUser(userWithUid);
          } else {
            // Criar novo usuário
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || 'Usuário',
              createdAt: new Date()
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              email: newUser.email,
              displayName: newUser.displayName,
              createdAt: newUser.createdAt
              // Não salvamos o uid no Firestore, ele vem do document ID
            });
            
            console.log('New user created:', newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error checking/creating user:', error);
          setUser(null);
        }
      } else {
        console.log('No user authenticated');
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    
    const newUser: User = {
      uid: result.user.uid,
      email,
      displayName,
      createdAt: new Date()
    };
    
    // Salvar no Firestore sem o uid (ele é o ID do documento)
    await setDoc(doc(db, 'users', result.user.uid), {
      email: newUser.email,
      displayName: newUser.displayName,
      createdAt: newUser.createdAt
    });
    
    return result;
  };

  const logout = () => signOut(auth);

  return { 
    user, 
    loading,
    login,
    register,
    logout,
    signInWithGoogle
  };
};