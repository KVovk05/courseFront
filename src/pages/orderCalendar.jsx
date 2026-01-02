import React, { useEffect, useState } from "react";
import NavMenu from "../components/nav-menu/nav-menu";
import Footer from "../components/footer/footer";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { useUser } from "./UserContext.jsx";

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

const OrderCalendar = () => {
  const [events, setEvents] = useState([]);
  const user = useUser();

  if (!user || user.role !== 'admin') {
    return (
      <>
        <NavMenu />
        <main style={{ padding: '40px', textAlign: 'center' }}>
          <p>Доступ лише для адміністратора.</p>
        </main>
        <Footer />
      </>
    );
  }

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      let allEvents = [];
      querySnapshot.forEach(docSnap => {
        const order = docSnap.data();
        order.id = docSnap.id;
        if (!order.date) return;
        const baseDate = new Date(order.date);
        const period = order.period || 1;
        const regularity = order.regularity || 'once';
        let count = 1;
        if (regularity === 'monthly') count = period;
        if (regularity === 'weekly') count = period * 4;
        if (regularity === 'biweekly') count = period * 2;
        for (let i = 0; i < count; i++) {
          let eventDate;
          if (regularity === 'monthly') eventDate = addMonths(baseDate, i);
          else if (regularity === 'weekly') eventDate = new Date(baseDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
          else if (regularity === 'biweekly') eventDate = new Date(baseDate.getTime() + i * 14 * 24 * 60 * 60 * 1000);
          else eventDate = baseDate;
          allEvents.push({ ...order, eventDate });
        }
      });
      allEvents.sort((a, b) => a.eventDate - b.eventDate);
      setEvents(allEvents);
    };
    fetchOrders();
  }, []);

  return (
    <>
      <NavMenu />
      <main>
        <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem', background: 'var(--bg-light)' }}>
          <h1>Календар замовлень</h1>
          <a href="/orderAdmin" style={{ marginRight: 16, color: '#3498db', fontWeight: 600, fontSize: 18 }}>Повернутися до замовлень</a>
        </div>
        <article style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
          {events.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>Замовлень не знайдено.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {events.filter(event => event.eventDate >= new Date()).map((event, idx) => (
                <li key={event.id + '-' + idx} style={{ marginBottom: 18, background: '#f8f8f8', borderRadius: 8, padding: '1rem 1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
                  <b>{event.eventDate.toLocaleDateString('uk-UA')}</b> &nbsp;
                  <span style={{ color: '#888' }}>({event.regularity === 'once' ? 'Разово' : event.regularity === 'monthly' ? 'Щомісяця' : event.regularity === 'weekly' ? 'Щотижня' : 'Раз на два тижні'})</span>
                  <div><b>Адреса:</b> {event.address}</div>
                  <div><b>Користувач:</b> {event.userEmail}</div>
                  <div><b>Вартість:</b> {event.price} грн</div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
};

export default OrderCalendar;
