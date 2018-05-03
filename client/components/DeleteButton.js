import React from 'react';

const DeleteButton = ({onClick}) => {
  return (
    <span className="db_button" onClick={onClick}>
      <i className="fas fa-times-circle" />
    </span>
  );
};

export default DeleteButton;
