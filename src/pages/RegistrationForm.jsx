import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const RegistrationForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // ← Оголошення setError

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Очистка старих помилок
    console.log(email);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Помилка реєстрації");
        return;
      }

      // Після реєстрації — вхід через email+password
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");

    } catch (err) {
      console.log(err);
      setError("Помилка сервера: " + err.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Реєстрація</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default RegistrationForm;
