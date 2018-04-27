import React from 'react';
import { connect } from 'react-redux';
import SecretsForm from './SecretsForm';
import CheckBoxSlider from './CheckBoxSlider';
import { updateSecret } from '../store';

export const Secrets = (props) => {
  const { secrets, handleChange } = props;

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
      console.log('event: ', event);
      const updatedSecret = {
        id: +event.target.name,
        isPublic: event.target.checked
      };
      dispatch(updateSecret(updatedSecret));
    }
  };
};

export default connect(mapState, mapDispatch)(Secrets);
