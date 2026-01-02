import { useState } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // ← Add this line
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Невірна пошта або пароль");
        return;
      }

      await signInWithCustomToken(auth, data.token);

      navigate("/");
    } catch (err) {
      setError("Помилка входу: " + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Вхід</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign in</button>
      {error && <p className="error-message">{error}</p>}
      <span className='signUp'>
        <Link to="/register">Sign up</Link>
      </span>
    </form>
  );
};

export default LoginForm;
