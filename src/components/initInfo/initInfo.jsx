import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavMenu from "../nav-menu/nav-menu";
import Footer from "../footer/footer";
import { collection, query, where, getDocs } from "firebase/firestore";
import StaticStarRating from '../StarRating/StaticStarRating';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import StarRating from '../StarRating/StarRating';

const InitInfo = () => {
  const { id } = useParams();
  const [initiative, setInitiative] = useState(null);
useEffect(() => {
  const fetchInitiative = async () => {
    try {
      const initiativesRef = collection(db, "initiatives");
      const q = query(initiativesRef, where("id", "==", parseInt(id))); // або просто id, якщо воно string
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        setInitiative({
          name: data.title,
          img: data.URL,
          volunteers: data.volunteersNeeded ?? 0,
          maxdate: data.date?.toDate()?.toLocaleDateString() ?? "",
          category: data.category,
          description: data.description,
          averageRating: data.averageRating ?? 0,
        });
      } else {
        console.error("No such document with id field:", id);
      }
    } catch (error) {
      console.error("Error fetching initiative:", error);
    }
  };

  fetchInitiative();
}, [id]);

  if (!initiative) {
    return <p>Loading initiative...</p>;
  }

  return (
    <div className="page-container">
      <NavMenu />

      <main id="init-info">
        <div id="init-info-header">
          <h1>{initiative.name}</h1>
          <img src={initiative.img} alt={initiative.name} />
          <div className="initiative-meta">
            <p><strong>Volunteers needed:</strong> {initiative.volunteers}</p>
            <p><strong>Deadline to join:</strong> {initiative.maxdate}</p>
            <p><strong>Category:</strong> {initiative.category}</p>
            <p> <StaticStarRating rating={initiative.averageRating}  /> {initiative.averageRating.toFixed(2)} out of 5</p>
          </div>
        </div>
        <div className="initiative-description">
          <h2>Initiative Description</h2>
          <p>{initiative.description}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InitInfo;

