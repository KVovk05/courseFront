
import React, { useState, useEffect } from 'react';

const StarRating = ({ selectedRating = 0, onRate }) => {
  const [hovered, setHovered] = useState(0);
  const [current, setCurrent] = useState(selectedRating);

  useEffect(() => {
    setCurrent(selectedRating); 
  }, [selectedRating]);

  const handleClick = (star) => {
    setCurrent(star);
    onRate(star);
  };

  return (
    <span>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: star <= (hovered || current) ? '#ffc107' : '#e4e5e9'
          }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </span>
  );
};

export default StarRating;
