import React, { useEffect, useState } from "react";
import NavMenu from "../components/nav-menu/nav-menu";
import ServiceCard from "../components/serviceCard/serviceCard";  
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer/footer";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { getAuth } from "firebase/auth";

const Services = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const data = querySnapshot.docs.map(doc => {
          const item = doc.data();
          return {
            docId: doc.id,
            id: item.id,
            name: item.title,
            imgUrl: item.URL || "",
            description: item.description,
            price: item.price,
            duration: item.duration
          };
        });
        setServices(data);
      } catch (error) {
        setServices([]);
        console.error("Error fetching services from Firestore:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const orders = querySnapshot.docs
          .map(doc => doc.data())
          .filter(order => order.userId === user.uid);
        setUserOrders(orders.map(order => order.serviceId));
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    fetchUserOrders();
  }, []);

  const handleOrder = (serviceId, area) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }
    let url = `/order?service=${serviceId}`;
    if (area) url += `&area=${area}`;
    navigate(url);
  };

  return (
    <>
      <NavMenu />
      <main>
        <section className="services-section">
          <h2 className="services-title">Наші послуги</h2>
          <div className="services-grid">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                {...service}
                handleOrder={() => handleOrder(service.id, null)}
                hasOrdered={userOrders.some(order => order.serviceId === service.id)}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Services;

