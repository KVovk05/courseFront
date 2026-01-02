import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import StarRating from '../StarRating/StarRating';
import { submitRating } from '../../firebase/ratingService';
import { Link } from "react-router-dom";
import JoinButton from '../JoinButton/JoinButton';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AvailableInit = ({docId, id, imgUrl, name, volunteersLeft, handleEnroll, enrolled }) => {
  const href = `${id}`;
  const auth = getAuth();
  const userId = auth.currentUser?.uid || "anon";
  const [userRating, setUserRating] = useState();
  const isAuthenticated = !!auth.currentUser;
const [avgMark, setAvgMark] = useState(null);

  useEffect(() => {
    const fetchAvgMark = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/avg-mark/${docId}`);
        if (!response.ok) {
          throw new Error('Помилка при отриманні середньої оцінки');
        }

        const data = await response.json();
        setAvgMark(data.averageRating);
      } catch (error) {
        console.error('Сталася помилка:', error.message);
      }
    };

    fetchAvgMark();
  }, []);
  useEffect(() => {
      const fetchUserRating = async () => {
        try {
          const ratingRef = doc(db, 'initiatives', docId, 'ratings', userId);
          const ratingSnap = await getDoc(ratingRef);
          if (ratingSnap.exists()) {
            const data = ratingSnap.data();
            setUserRating(data.rate); // Записуємо оцінку користувача
          }
        } catch (error) {
          console.error("Error fetching user rating:", error);
        }
      };
  
      fetchUserRating();
    }, [id, userId]);

  // Обробка оцінки
 const handleRating = async (ratingValue) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initiativeId: docId,
        userId: userId,
        rate: ratingValue,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit rating');
    }

    const data = await response.json();
    setUserRating(ratingValue);
    setAvgMark(data.averageRating); // одразу оновлюємо середню оцінку
  } catch (error) {
    console.error("Error submitting rating:", error);
  }
};


  
  return (
    <div key={id} className="grid-element">
      <img src={imgUrl} alt={name} className="img-init" />
      <h5>{name}</h5>
      <p className="grid-paragraph">
        Volunteers needed: <span className="volunteers">{volunteersLeft}</span>
      </p>

        {isAuthenticated ? (
          <>
          
  <StarRating
    selectedRating={userRating}
    onRate={handleRating}
  />
  <span>{avgMark} out of 5</span></>
) : (
  <p className="rating-hint">Log in to rate initiative</p>
)}


    <div>
      <JoinButton 
        initiativeId={id} 
        handleEnroll={handleEnroll} 
        enrolled={enrolled} 
        volunteersLeft={volunteersLeft} 
      />

      <Link to={href} className="descr-btn">Learn More</Link>
      </div>
    </div>
  );
};

export default AvailableInit;
