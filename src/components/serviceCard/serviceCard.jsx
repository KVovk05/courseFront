import React, { useEffect, useState } from "react";
import { getAuth, getIdToken } from "firebase/auth";
import StarRating from '../StarRating/StarRating';
import { Link, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { auth } from "../../firebase/firebase";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ServiceCard = ({docId, id, imgUrl, name, price, duration, description, handleOrder, hasOrdered }) => {
  const href = `/services/${id}`;
  const userId = auth.currentUser?.uid || "anon";
  const [userRating, setUserRating] = useState();
  const isAuthenticated = !!auth.currentUser;
  const [avgMark, setAvgMark] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  // Додаємо стан для площі та підрахованої ціни
  const [area, setArea] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  useEffect(() => {
    // Якщо є параметр area у query (з калькулятора), підставляємо його
    const params = new URLSearchParams(window.location.search);
    const areaFromCalc = params.get("area");
    if (areaFromCalc && !area) {
      setArea(areaFromCalc);
      setCalculatedPrice(Number(areaFromCalc) * price);
    }
  }, [price]);

  const handleAreaChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setArea(value);
    setCalculatedPrice(value ? Number(value) * price : null);
  };

  useEffect(() => {
    const fetchAvgMark = async () => {
      try {
        const user = auth.currentUser;
        let token = "";
        if (user) {
          token = await getIdToken(user);
        }
        const response = await fetch(`${API_BASE_URL}/api/avg-mark/${docId}?type=service`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
        const ratingRef = doc(db, 'services', docId, 'ratings', userId);
        const ratingSnap = await getDoc(ratingRef);
        if (ratingSnap.exists()) {
          const data = ratingSnap.data();
          setUserRating(data.rate);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };
  
    fetchUserRating();
  }, [id, userId]);

  const handleRating = async (ratingValue) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: docId,
          userId: userId,
          rate: ratingValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      const data = await response.json();
      setUserRating(ratingValue);
      setAvgMark(data.averageRating);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div key={id} className="grid-element service-card-nipy" style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: '1.5rem', minHeight: 220 }}>
      <div className="service-card-left" style={{ minWidth: 220, maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={imgUrl} 
          alt={name} 
          className="service-card-img" 
          style={{ maxWidth: '220px', maxHeight: '160px', width: '100%', height: 'auto', borderRadius: '14px', objectFit: 'cover', boxShadow: '0 2px 16px rgba(0,0,0,0.12)', marginBottom: 12 }}
        />
        <h5 className="service-card-title" style={{ textAlign: 'center', margin: 0 }}>{name}</h5>
      </div>
      <div className="service-card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="service-card-price">{price} грн/м²</div>
        <div className="service-card-duration">Тривалість: {duration}</div>
        <div className="service-card-desc">{description}</div>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor={`area-input-${id}`}>Кількість м²:&nbsp;</label>
          <input
            id={`area-input-${id}`}
            type="number"
            min="1"
            value={area}
            onChange={handleAreaChange}
            placeholder="Введіть площу"
            style={{ width: 90, padding: '0.2rem 0.5rem', borderRadius: 6, border: '1px solid #ccc', marginRight: 8 }}
          />
          {calculatedPrice !== null && area && (
            <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
              Сума: {calculatedPrice} грн
            </span>
          )}
        </div>
        {/* Відгуки приховано на сторінці послуг */}
        {/*
        {isAuthenticated ? (
          <div className="service-card-rating">
            <StarRating selectedRating={userRating} onRate={handleRating} />
            <span>{avgMark ? avgMark.toFixed(1) : '0.0'} з 5</span>
          </div>
        ) : (
          <p className="rating-hint">Увійдіть, щоб залишити відгук</p>
        )}
        */}
        <div className="service-card-btns">
          <button 
            onClick={() => navigate(`/order?service=${id}${area ? `&area=${area}` : ''}`)}
            className="descr-btn"
            disabled={hasOrdered}
          >
            {hasOrdered ? 'Замовлено' : 'Замовити послугу'}
          </button>
          <button
            className="descr-btn service-card-detail-btn"
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            style={{ background: '#f3f3f3', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}
          >
            {showDetails ? 'Сховати' : 'Детальніше'}
          </button>
        </div>
        {showDetails && (
          <div className="service-card-details-popup" style={{ marginTop: '1rem', background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '1rem 1.5rem', transition: 'all 0.3s' }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>{name}</div>
            <div style={{ marginBottom: 8 }}>{description}</div>
            <div style={{ color: 'var(--primary-color)', fontWeight: 700 }}>Вартість: {price} грн/м²</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;

