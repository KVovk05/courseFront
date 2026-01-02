import React, { useEffect, useState } from "react";
import NavMenu from "../components/nav-menu/nav-menu";
import Footer from "../components/footer/footer";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { useUser } from "./UserContext.jsx";
import "../style.css";

const statusOptions = [
  { value: "pending", label: "Очікує підтвердження" },
  { value: "in_progress", label: "В процесі" },
  { value: "completed", label: "Виконано" },
  { value: "cancelled", label: "Скасовано" },
];

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const user = useUser();

  if (!user || user.role !== 'admin') {
    return (
      <>
        <NavMenu />
        <main style={{ padding: '40px', textAlign: 'center' }}>
          <p>Доступ лише для адміністратора.</p>
          <a href="/orderCalendar" style={{ color: '#3498db', fontWeight: 600, fontSize: 18 }}>Переглянути календар замовлень</a>
        </main>
        <Footer />
      </>
    );
  }

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  return (
    <>
      <NavMenu />
      <main>
        <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem', background: 'var(--bg-light)' }}>
          <h1>Адмін: Всі замовлення</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <a href="/orderCalendar" style={{ background: 'var(--primary-color)', color: 'white', padding: '0.7rem 1.3rem', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>
            Календар замовлень
          </a>
        </div>
        <article style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>
              Замовлень не знайдено.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '0',
                    padding: '2rem',
                    backgroundColor: 'var(--bg-white)',
                    marginBottom: '1.5rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 10px 0' }}>
                        Замовлення #{order.id.slice(0, 8)}
                      </h3>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Користувач:</strong> {order.userId}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Адреса:</strong> {order.address}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Дата:</strong> {order.date}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Час:</strong> {order.time}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>
                        Вартість: {order.price} грн
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Регулярність:</strong> {order.regularity === 'once' ? 'Разово' : order.regularity === 'monthly' ? 'Щомісяця' : order.regularity === 'weekly' ? 'Щотижня' : order.regularity === 'biweekly' ? 'Раз на два тижні' : order.regularity}
                      </p>
                      {order.period && order.regularity !== 'once' && (
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          <strong>Період:</strong> {order.period} міс.
                        </p>
                      )}
                    </div>
                    <div>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        style={{ padding: '8px', borderRadius: '5px', fontWeight: 'bold' }}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {order.comments && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                      <strong>Коментарі:</strong> {order.comments}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
};

export default OrderAdmin;
