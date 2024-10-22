// src/components/SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ title, value }) => {
  return (
    <div className="card">
      <h3>{value !== null ? `${value}` : 'Loading...'}</h3>
      <p>{title}</p>
    </div>
  );
};

export default SummaryCard;
