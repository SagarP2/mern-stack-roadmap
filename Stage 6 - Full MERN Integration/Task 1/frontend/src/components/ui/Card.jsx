import React from 'react';

const Card = ({ className = '', children, ...props }) => {
  const cls = ['card', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...props}>
      {children}
    </div>
  );
};

export default Card;