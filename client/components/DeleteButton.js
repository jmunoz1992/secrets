import React from 'react';

export const DeleteButton = ({onClick}) => {
  return (
    <span className="db_button" onClick={onClick}>
      <i className="fas fa-times-circle" />
    </span>
  );
};

export default DeleteButton;
