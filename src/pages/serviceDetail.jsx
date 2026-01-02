import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavMenu from "../components/nav-menu/nav-menu";
import Footer from "../components/footer/footer";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import StaticStarRating from '../components/StarRating/StaticStarRating';
import StarRating from '../components/StarRating/StarRating';
import { db } from '../firebase/firebase';
import { getAuth } from "firebase/auth";
import "../style.css";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const auth = getAuth();
  const userId = auth.currentUser?.uid || "anon";
  const [userRating, setUserRating] = useState();
  const isAuthenticated = !!auth.currentUser;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchService = async () => {
      try {
        const servicesRef = collection(db, "services");
        const q = query(servicesRef, where("id", "==", parseInt(id)));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          setService({
            docId: docSnap.id,
            name: data.title,
            img: data.URL,
            price: data.price ?? 0,
            duration: data.duration || "2-3 години",
            category: data.category,
            description: data.description,
            averageRating: data.averageRating ?? 0,
          });
        } else {
          // Fallback to static data
          const staticServices = [
            { id: 1, name: "Генеральне прибирання", price: 1500, duration: "4-6 годин", img: "/img/1.webp", description: "Повне прибирання всіх приміщень включаючи миття вікон, пилосос, миття підлоги та сантехніки" },
            { id: 2, name: "Підтримуюче прибирання", price: 800, duration: "2-3 години", img: "/img/2.webp", description: "Регулярне прибирання для підтримки чистоти: пилосос, миття підлоги, прибирання поверхонь" },
            { id: 3, name: "Післяремонтне прибирання", price: 2500, duration: "6-8 годин", img: "/img/3.webp", description: "Глибоке прибирання після ремонту: видалення будівельного пилу, миття вікон, очищення всіх поверхонь" },
            { id: 4, name: "Миття вікон", price: 600, duration: "1-2 години", img: "/img/4.webp", description: "Професійне миття вікон всередині та зовні, очищення підвіконь та рамів" },
            { id: 5, name: "Хімчистка килимів", price: 1200, duration: "3-4 години", img: "/img/5.webp", description: "Професійна хімчистка килимів та меблів з використанням спеціальних засобів" },
            { id: 6, name: "Прибирання офісів", price: 2000, duration: "4-5 годин", img: "/img/6.webp", description: "Комплексне прибирання офісних приміщень, включаючи кухню та санвузли" }
          ];
          const found = staticServices.find(s => s.id === parseInt(id));
          if (found) {
            setService({
              docId: id,
              ...found,
              averageRating: 0
            });
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [id]);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!service || !isAuthenticated) return;
      try {
        const ratingRef = doc(db, 'services', service.docId, 'ratings', userId);
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
  }, [service, userId, isAuthenticated]);

  const handleRating = async (ratingValue) => {
    if (!service) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.docId,
          userId: userId,
          rate: ratingValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      const data = await response.json();
      setUserRating(ratingValue);
      setService(prev => ({ ...prev, averageRating: data.averageRating }));
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleOrder = () => {
    navigate('/order', { state: { serviceId: parseInt(id) } });
  };

  if (!service) {
    return (
      <>
        <NavMenu />
        <main style={{ padding: '40px', textAlign: 'center' }}>
          <p>Завантаження інформації про послугу...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="page-container">
      <NavMenu />
      <main id="init-info">
        <div id="init-info-header">
          <h1>{service.name}</h1>
          <img src={service.img} alt={service.name} />
          <div className="initiative-meta">
            <p><strong>Вартість:</strong> {service.price} грн</p>
            <p><strong>Тривалість:</strong> {service.duration}</p>
            {service.category && (
              <p><strong>Категорія:</strong> {service.category}</p>
            )}
            <p>
              <StaticStarRating rating={service.averageRating} />
              {service.averageRating ? service.averageRating.toFixed(1) : '0.0'} з 5
            </p>
            {isAuthenticated && (
              <div style={{ marginTop: '15px' }}>
                <p>Ваша оцінка:</p>
                <StarRating
                  selectedRating={userRating}
                  onRate={handleRating}
                />
              </div>
            )}
          </div>
        </div>
        <div className="initiative-description">
          <h2>Опис послуги</h2>
          <p>{service.description || "Детальний опис послуги буде додано найближчим часом."}</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={handleOrder}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Замовити послугу
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;

