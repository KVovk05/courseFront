import React, { useEffect, useState } from "react";
import NavMenu from "../components/nav-menu/nav-menu";
import Footer from "../components/footer/footer";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import StarRating from '../components/StarRating/StarRating';
import "../style.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        let q;
        // Якщо адмін, бачить всі замовлення
        if (user.role === 'admin') {
          q = collection(db, "orders");
        } else {
          q = query(collection(db, "orders"), where("userId", "==", user.uid));
        }
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by date (newest first)
        ordersData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Дата не вказана";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "#27ae60";
      case "in_progress": return "#f39c12";
      case "pending": return "#3498db";
      case "cancelled": return "#e74c3c";
      default: return "#95a5a6";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed": return "Виконано";
      case "in_progress": return "В процесі";
      case "pending": return "Очікує підтвердження";
      case "cancelled": return "Скасовано";
      default: return status;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleOrderRating = async (orderId, ratingValue) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { rating: ratingValue });
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, rating: ratingValue } : order));
    } catch (error) {
      console.error("Error updating order rating:", error);
    }
  };

  return (
    <>
      <NavMenu />
      <main>
        <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem', background: 'var(--bg-light)' }}>
          <h1>Історія замовлень</h1>
        </div>
        <article style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
          
          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>
              У вас ще немає замовлень. <a href="/services" style={{ color: '#3498db' }}>Переглянути послуги</a>
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
                        <strong>Дата створення:</strong> {formatDate(order.createdAt)}
                      </p>
                      {order.date && (
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          <strong>Запланована дата:</strong> {order.date}
                        </p>
                      )}
                      {order.time && (
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          <strong>Час:</strong> {order.time}
                        </p>
                      )}
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Адреса:</strong> {order.address}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>
                        Вартість: {order.price} грн
                      </p>
                      {user.role === 'admin' && (
                        <>
                          <p style={{ margin: '5px 0', color: '#666' }}>
                            <strong>Користувач:</strong> {order.userId}
                          </p>
                          <div style={{ margin: '10px 0' }}>
                            <label>Статус:&nbsp;</label>
                            <select
                              value={order.status}
                              onChange={e => handleStatusChange(order.id, e.target.value)}
                              style={{ padding: '8px', borderRadius: '5px', fontWeight: 'bold' }}
                            >
                              <option value="pending">Очікує підтвердження</option>
                              <option value="in_progress">В процесі</option>
                              <option value="completed">Виконано</option>
                              <option value="cancelled">Скасовано</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{
                      padding: '8px 16px',
                      borderRadius: '5px',
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  {order.comments && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                      <strong>Коментарі:</strong> {order.comments}
                    </div>
                  )}

                  {order.status === "completed" && (
                    <div style={{ marginTop: 8 }}>
                      <span>Ваша оцінка:</span>
                      <StarRating
                        selectedRating={order.rating || 0}
                        onRate={rating => handleOrderRating(order.id, rating)}
                      />
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

export default OrderHistory;

