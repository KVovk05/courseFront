import React, { useEffect, useState } from "react";
import NavMenu from "../components/nav-menu/nav-menu";
import AvailableInit from "../components/availableInit/availableInit";  
import { useNavigate } from "react-router-dom";
import Filter from "../components/filter/filter";   
import Footer from "../components/footer/footer";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';
import StarRating from '../components/StarRating/StarRating';
import { submitRating } from '../firebase/ratingService';
import { getAuth } from "firebase/auth";

import {
  doc,
  setDoc,
  query,     // ← додати
  where      // ← додати
} from "firebase/firestore";


const AvailableInitiatives = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [myInitiatives, setMyInitiatives] = useState([]);
  const [updatedVolunteers, setUpdatedVolunteers] = useState({});
  const [filteredInitiatives, setFilteredInitiatives] = useState([]);
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  const onChangeCategory = (newCategory) => {
    setCategory(newCategory);
  };

  useEffect(() => {
    const filtered = initiatives.filter(i => category === "all" || i.category === category);    
    setFilteredInitiatives(filtered);
  }, [category, initiatives]);

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "initiatives"));
        console.log(querySnapshot);
        const data = querySnapshot.docs.map(doc => {
          const item = doc.data();
          return {
            docId: doc.id,
            id: item.id,
            name: item.title,
            img: item.URL,
            category: item.category,
            description: item.description,
            volunteers: item.volunteersNeeded ?? 0,
            date: item.date?.toDate?.() ?? new Date()
          };
        });



        const now = new Date();
        const filtered = data.filter(i => i.date >= now);

        setInitiatives(filtered);

        const storedMyInit = (sessionStorage.getItem("myInitiatives") || "").split(",").filter(Boolean);
        const storedVolunteers = JSON.parse(sessionStorage.getItem("updatedVolunteers") || "{}");

        setMyInitiatives(storedMyInit);
        setUpdatedVolunteers(storedVolunteers);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
      }
    };

    fetchInitiatives();
  }, []);

  const handleViewInitiative = (id) => {
    const selectedInit = initiatives.find(init => init.id === id);
    if (selectedInit) {
      navigate(`/available/${id}`, { state: { initiative: selectedInit } });
    } else {
      console.error("Initiative not found");
    }
  };

  const findInitiativeDocIdByFieldId = async (fieldId) => {
  const q = query(collection(db, 'initiatives'), where('id', '==', fieldId));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  } else {
    throw new Error("Ініціативу не знайдено");
  }
};
const [userId, setUserId] = useState(null);

useEffect(() => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    setUserId(user.uid);
  } else {
    console.warn("Користувач не авторизований");
  }
}, []);

const handleEnroll = async (id, passedUserId) => {
  const uid = passedUserId || userId;

  if (!uid) {
    console.error("❌ UID користувача не знайдено — можливо, він не авторизований");
    return;
  }

  try {
    const firebaseDocId = await findInitiativeDocIdByFieldId(id);
    const userRef = doc(db, 'initiatives', firebaseDocId, 'users', String(uid));

    await setDoc(userRef, {
      uid: uid,
      joinedAt: new Date().toISOString()
    });

    // оновлення UI
    const updated = initiatives.map(init => {
      if (init.id === id) {
        const currentCount = updatedVolunteers[id] ?? init.volunteers;
        const newCount = currentCount - 1;
        const newVolunteers = { ...updatedVolunteers, [id]: newCount };
        setUpdatedVolunteers(newVolunteers);

        const newMyInit = [...myInitiatives, String(id)];
        setMyInitiatives(newMyInit);
      }
      return init;
    });
    setInitiatives(updated);
  } catch (err) {
    console.error("❌ Помилка під час приєднання до ініціативи:", err.message);
  }
};




  return (
    <div className="page-container">
      <NavMenu />
      <main>
        <h1>Available initiatives</h1>
        <Filter onChangeCategory={onChangeCategory} />
        <div className="grid-container">
          {filteredInitiatives.length === 0 ? (
            <p>No available initiatives at the moment.</p>
          ) : (
            filteredInitiatives.map(init => {
              const id = init.id;
              const enrolled = myInitiatives.includes(String(id));
              const volunteersLeft = updatedVolunteers[id] ?? init.volunteers;
              return (
                <AvailableInit
                docId={init.docId}
                  key={id}
                  id={id}
                  imgUrl={init.img}
                  name={init.name}
                  volunteersLeft={volunteersLeft}
                  handleEnroll={(id) => handleEnroll(id, userId)}

                  enrolled={enrolled}
                />
              );
            })
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AvailableInitiatives;
