import React from 'react';
import { connect } from 'react-redux';
import SecretsForm from './SecretsForm';
import CheckBoxSlider from './CheckBoxSlider';
import DeleteButton from './DeleteButton';
import { updateSecret, destroySecret } from '../store';

export const Secrets = (props) => {
  const { secrets, handleChange, handleDelete } = props;

  return (
    <div>
      <h1>Most Recent Secrets</h1>
      <SecretsForm />
      <ul>
        { secrets.map(secret => {
          return (
            <li key={`secret-${secret.id}`}>
              {secret.message}
              <CheckBoxSlider
                onChange={handleChange}
                checked={secret.isPublic}
                name={secret.id}
              />
              <DeleteButton
                onClick={() => {handleDelete(secret.id);}}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const mapState = (state) => {
  return {
    secrets: state.secrets,
    user: state.user
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleChange(event) {
      const updatedSecret = {
        id: +event.target.name,
        isPublic: event.target.checked
      };
      dispatch(updateSecret(updatedSecret));
    },
    handleDelete(id) {
      dispatch(destroySecret(id));
    }
  };
};

export default connect(mapState, mapDispatch)(Secrets);
