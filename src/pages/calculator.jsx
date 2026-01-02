import React, { useState } from "react";
import NavMenu from "../components/nav-menu/nav-menu";
import Footer from "../components/footer/footer";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import "../style.css";

const Calculator = () => {
  const [area, setArea] = useState(50);
  const [serviceType, setServiceType] = useState("regular");
  const [frequency, setFrequency] = useState("once");
  const [windows, setWindows] = useState(0);
  const [rooms, setRooms] = useState(2);
  const navigate = useNavigate();

  const servicePrices = {
    regular: { base: 15, name: "Підтримуюче прибирання" },
    deep: { base: 25, name: "Генеральне прибирання" },
    postRenovation: { base: 40, name: "Післяремонтне прибирання" },
    office: { base: 20, name: "Прибирання офісів" }
  };

  const calculatePrice = () => {
    const basePrice = servicePrices[serviceType].base;
    let total = basePrice * area;
    
    // Додаткова вартість за вікна
    total += windows * 50;
    
    // Знижка за регулярність
    if (frequency === "weekly") {
      total *= 0.9; // 10% знижка
    } else if (frequency === "monthly") {
      total *= 0.85; // 15% знижка
    }

    // Мінімальна вартість
    return Math.max(total, 500);
  };

  const handleOrder = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigate('/login');
      return;
    }

    const orderData = {
      serviceType,
      area,
      frequency,
      windows,
      rooms,
      price: calculatePrice()
    };

    navigate('/order', { state: { calculatorData: orderData } });
  };

  return (
    <>
      <NavMenu />
      <main>
        <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem', background: 'var(--bg-light)' }}>
          <h1>Калькулятор вартості прибирання</h1>
        </div>
        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
          <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.125rem', color: 'var(--text-light)' }}>
            Розрахуйте приблизну вартість послуг прибирання
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Тип прибирання:
              </label>
              <select 
                value={serviceType} 
                onChange={(e) => setServiceType(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              >
                {Object.entries(servicePrices).map(([key, value]) => (
                  <option key={key} value={key}>{value.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Площа приміщення (м²): {area}
              </label>
              <input 
                type="range" 
                min="20" 
                max="200" 
                value={area} 
                onChange={(e) => setArea(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Кількість кімнат:
              </label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={rooms} 
                onChange={(e) => setRooms(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Кількість вікон:
              </label>
              <input 
                type="number" 
                min="0" 
                max="20" 
                value={windows} 
                onChange={(e) => setWindows(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Періодичність:
              </label>
              <select 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              >
                <option value="once">Одноразово</option>
                <option value="weekly">Щотижня</option>
                <option value="monthly">Щомісяця</option>
              </select>
            </div>

            <div style={{ 
              padding: '2rem', 
              backgroundColor: 'var(--bg-light)', 
              borderRadius: '0',
              textAlign: 'center',
              borderLeft: '4px solid var(--primary-color)',
              marginTop: '2rem'
            }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--text-dark)' }}>Приблизна вартість:</h2>
              <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                {Math.round(calculatePrice())} грн
              </p>
            </div>

            <button 
              onClick={handleOrder}
              style={{
                padding: '1rem 2rem',
                fontSize: '16px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: '600',
                marginTop: '2rem',
                transition: 'all 0.3s ease'
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
              Замовити послугу
            </button>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default Calculator;

