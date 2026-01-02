import React from 'react';
import { useUser } from '../../pages/UserContext';
import { useNavigate } from 'react-router-dom';

function JoinButton({ initiativeId, handleEnroll, enrolled, volunteersLeft }) {
  const user = useUser();
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!user) {
      navigate('/login');
    } else {
      handleEnroll(initiativeId);
      alert(`Ви приєдналися до ініціативи №${initiativeId}`);
    }
  };

  return (
    
    <button
      className="join-btn"
      disabled={ enrolled || volunteersLeft <= 0}
      onClick={handleJoin}
    >
      { !user 
        ? "Log in to enroll" 
        : enrolled 
          ? "You enrolled" 
          : "Enroll" 
      }
    </button>
  );
}

export default JoinButton;

