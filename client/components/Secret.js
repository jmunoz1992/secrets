import React from 'react';
import CheckBoxSlider from './CheckBoxSlider';
import DeleteButton from './DeleteButton';

const Secret = (props) => {
  const { secret, handleChange, handleDelete, userId } = props;
  const author = userId === secret.userId ? 'me' : 'anonymous';

  return (
    <div className={`s_message ${author}`} key={`secret-${secret.id}`}>
      “{secret.message}”
      <span className="s_author">- {author}</span>
      {(userId === secret.userId) ?
        <div className="s_controls">
          <CheckBoxSlider
            onChange={handleChange}
            checked={secret.isPublic}
            name={secret.id}
          />
          <DeleteButton
            onClick={() => {handleDelete(secret.id);}}
          />
        </div>
        : null
      }
    </div>
  );
};

export default Secret;
