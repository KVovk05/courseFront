// pages/UserAccount.jsx
import React from 'react';
import { useUser } from './UserContext.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';
import NavMenu from '../components/nav-menu/nav-menu';
import Footer from '../components/footer/footer';

function UserAccount() {
  const user = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/'); 
  };

  if (!user) {
    return (
      <>
        <NavMenu />
        <main style={{ padding: '40px', textAlign: 'center' }}>
          <p>Будь ласка, увійдіть у свій акаунт.</p>
          <Link to="/login" style={{ color: '#3498db' }}>Увійти</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavMenu />
      <main>
        <div style={styles.container}>
          <h2>👤 Мій акаунт</h2>
          <p><strong>Email:</strong> {user.email}</p>
          
          <div style={styles.links}>
            <Link to="/orderHistory" style={styles.link}>
              📋 Історія замовлень та відгуки
            </Link>
            <Link to="/orderAdmin" style={styles.link}>
              🛠️ Адмін: всі замовлення
            </Link>
            <Link to="/services" style={styles.link}>
              🧹 Переглянути послуги
            </Link>
            <Link to="/calculator" style={styles.link}>
              🧮 Калькулятор вартості
            </Link>
          </div>

          <button onClick={handleLogout} style={styles.button}>Вийти</button>
        </div>
      </main>
      <Footer />
    </>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '500px',
    margin: '40px auto',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9'
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: '20px 0'
  },
  link: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s'
  },
  button: {
    padding: '10px 20px',
    marginTop: '15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default UserAccount;
