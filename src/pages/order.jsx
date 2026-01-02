import React, { useState, useEffect } from "react";
import NavMenu from "../components/nav-menu/nav-menu";
import Footer from "../components/footer/footer";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';
import "../style.css";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    comments: ""
  });

  const [serviceId, setServiceId] = useState(null);
  const [calculatorData, setCalculatorData] = useState(null);
  const [price, setPrice] = useState(0);
  const [serviceData, setServiceData] = useState(null);
  const [regularity, setRegularity] = useState('once');
  const [period, setPeriod] = useState(1); // in months

  // Знижки для регулярних замовлень (від 3 міс — 5%, від 6 — 10%, 12 міс — 15%)
  const getDiscount = () => {
    if (regularity === 'once') return 0;
    if (period === 12) return 0.15;
    if (period >= 6) return 0.10;
    if (period >= 3) return 0.05;
    return 0;
  };

  // Ціна за одне прибирання з урахуванням знижки
  const discountedSinglePrice = price * (1 - getDiscount());

  useEffect(() => {
    // auth.currentUser може бути null після оновлення сторінки, але onAuthStateChanged спрацює і user підтягнеться
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let serviceIdFromQuery = null;
    let areaFromQuery = null;
    const params = new URLSearchParams(location.search);
    if (params.get('service')) {
      serviceIdFromQuery = params.get('service');
      setServiceId(serviceIdFromQuery);
    }
    if (params.get('area')) {
      areaFromQuery = params.get('area');
    }
    if (location.state?.serviceId) {
      setServiceId(location.state.serviceId);
    }
    if (location.state?.calculatorData) {
      setCalculatorData(location.state.calculatorData);
      setPrice(location.state.calculatorData.price);
    } else if (serviceIdFromQuery) {
      (async () => {
        const q = await getDocs(collection(db, "services"));
        const found = q.docs.find(doc => doc.data().id === serviceIdFromQuery);
        if (found) {
          setServiceData(found.data());
          // Якщо площа передана, рахуємо ціну
          if (areaFromQuery) {
            setPrice(Number(areaFromQuery) * found.data().price);
          } else {
            setPrice(found.data().price);
          }
        }
      })();
    }
  }, [location, navigate, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.date) {
      alert("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }

    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        serviceId: serviceId || null,
        calculatorData: calculatorData || null,
        price: discountedSinglePrice,
        regularity,
        period: regularity === 'once' ? 1 : period,
        ...formData,
        status: "pending",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "orders"), orderData);
      alert("Замовлення успішно створено! Ми зв'яжемося з вами найближчим часом.");
      navigate('/orders');
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Помилка при створенні замовлення. Спробуйте ще раз.");
    }
  };

  return (
    <>
      <NavMenu />
      <main>
        <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem', background: 'var(--bg-light)' }}>
          <h1>Оформлення замовлення</h1>
        </div>
        <article style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-light)', 
            borderRadius: '0',
            marginBottom: '2rem',
            borderLeft: '4px solid var(--primary-color)'
          }}>
            <p style={{ fontSize: '1.25rem', margin: 0 }}>
              <strong>Ціна за одне прибирання:</strong> <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>{Math.round(discountedSinglePrice)} грн</span>
              {getDiscount() > 0 && (
                <span style={{ color: 'green', marginLeft: 10 }}>
                  (Знижка {Math.round(getDiscount()*100)}%)
                </span>
              )}
              {serviceData && (
                <span style={{ marginLeft: 16, color: '#888', fontWeight: 400 }}>
                  ({serviceData.title})
                </span>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Регулярність */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Регулярність прибирання:
              </label>
              <select
                value={regularity}
                onChange={e => {
                  setRegularity(e.target.value);
                  setPeriod(1);
                }}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              >
                <option value="once">Разово</option>
                <option value="weekly">Щотижня</option>
                <option value="biweekly">Раз на два тижні</option>
                <option value="monthly">Раз на місяць</option>
              </select>
            </div>
            {/* Період для регулярних */}
            {regularity !== 'once' && (
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Протягом якого періоду (місяців, 1-12):
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={period}
                  onChange={e => setPeriod(Math.max(1, Math.min(12, Number(e.target.value))))}
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
                <small style={{ color: '#888' }}>
                  Від 3 міс — знижка 5%, від 6 міс — 10%, 12 міс — 15%
                </small>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Ім'я та прізвище: *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Телефон: *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Адреса: *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Дата: *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Час:
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Додаткові коментарі:
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows="4"
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '1rem 2rem',
                fontSize: '16px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                width: '100%',
                transition: 'all 0.3s ease',
                marginBottom: '1.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--primary-dark)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--primary-color)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Підтвердити замовлення
            </button>

            {/* Рахунок для користувача */}
            <div style={{
              background: '#f8f8f8',
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: '1.2rem 1.5rem',
              marginBottom: 0,
              fontSize: 16,
              color: '#222',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ marginBottom: 6 }}>
                <b>Ціна за прибирання:</b> <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{Math.round(discountedSinglePrice)} грн</span>
              </div>
              <div style={{ marginBottom: 6 }}>
                <b>Кількість прибирань:</b> {regularity === 'once' ? 1 : period}
              </div>
              <div style={{ marginBottom: 6 }}>
                <b>Знижка:</b> {getDiscount() > 0 ? `${Math.round(getDiscount()*100)}%` : '—'}
              </div>
            </div>
          </form>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default Order;

