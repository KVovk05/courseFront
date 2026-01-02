import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Load role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          let role = 'user';
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role) role = data.role;
          }
          setUser({ ...currentUser, role });
        } catch (e) {
          setUser({ ...currentUser, role: 'user' });
        }
      } else {
        setUser(null);
      }
    });
    return unsubscribe; // clean up listener
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
