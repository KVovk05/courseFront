import { db } from './firebase';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const findInitiativeByFieldId = async (initiativeFieldId) => {
  const q = query(collection(db, 'initiatives'), where('id', '==', Number(initiativeFieldId)));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].id; 
  } else {
    throw new Error('Ініціативу не знайдено');
  }
};

export const submitRating = async (initiativeId, userId, rate) => {
  const response = await fetch(`${API_BASE_URL}/api/rating`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ initiativeId, userId, rate })
  });

  if (!response.ok) {
    throw new Error('Failed to submit rating');
  }

  return response.json(); // Містить averageRating
};


export const updateAverageRating = async (firebaseDocId) => {
  const ratingsRef = collection(db, 'initiatives', firebaseDocId, 'ratings');
  const snapshot = await getDocs(ratingsRef);

  const ratings = snapshot.docs.map(doc => doc.data().rate);
  const avg = ratings.length
    ? ratings.reduce((acc, val) => acc + val, 0) / ratings.length
    : 0;

  const initiativeRef = doc(db, 'initiatives', firebaseDocId);
  await updateDoc(initiativeRef, { avgRate: parseFloat(avg.toFixed(1)) });
};
