import React from 'react';

const StaticStarRating = ({ rating = 0 }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: '1.5rem',
            color: star <= rating ? '#ffc107' : '#e4e5e9',
            pointerEvents: 'none', // щоб не було курсору руки
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StaticStarRating;
