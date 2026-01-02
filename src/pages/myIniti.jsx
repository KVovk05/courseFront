import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavMenu from "../components/nav-menu/nav-menu";
import InitiativeCard from "../components/initCard/initiativeCard";
import Footer from "../components/footer/footer";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { getAuth } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";

const MyInitiatives = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [updatedVolunteers, setUpdatedVolunteers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInitiatives = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "initiatives"));
        const userInitiatives = [];

        for (const docSnap of querySnapshot.docs) {
          const initiativeData = docSnap.data();
          const userRef = doc(db, 'initiatives', docSnap.id, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            userInitiatives.push({
              id: initiativeData.id,
              name: initiativeData.title,
              img: initiativeData.URL,
              volunteers: initiativeData.volunteersNeeded ?? 0,
              docId: docSnap.id
            });
          }
        }

        setInitiatives(userInitiatives);
      } catch (error) {
        console.error("Error fetching user initiatives:", error);
      }
    };

    fetchUserInitiatives();
  }, [navigate]);

  const unenroll = async (id, docId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const userRef = doc(db, 'initiatives', docId, 'users', user.uid);
      await deleteDoc(userRef);

      setInitiatives(prev => prev.filter(init => init.id !== id));
    } catch (error) {
      console.error("Error unenrolling from initiative:", error);
    }
  };

  return (
    <>
      <NavMenu />
      <main>
        <article>
          <h1>Мої ініціативи</h1>
          <div className="grid-container" id="my-initiatives">
            {initiatives.length === 0 ? (
              <p>Ви ще не приєдналися до жодної ініціативи.</p>
            ) : (
              initiatives.map((initiative) => (
                <InitiativeCard
                  key={initiative.id}
                  imgUrl={initiative.img}
                  header={initiative.name}
                  content={initiative.volunteers}
                  id={String(initiative.id)}
                  unenroll={() => unenroll(initiative.id, initiative.docId)}
                />
              ))
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default MyInitiatives;
