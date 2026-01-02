import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../firebase/firebase";
const RegInitForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        initiative: '',
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    navigate("/my");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Ім'я:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
    
            <button type="submit">Зареєструватися</button>
        </form>
    );
};

export default RegInitForm;