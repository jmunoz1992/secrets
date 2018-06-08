import React from 'react';
import { connect } from 'react-redux';
import SecretsForm from './SecretsForm';
import Secret from './Secret';
import { updateSecret, destroySecret } from '../store';

export const Secrets = (props) => {
  const { user, secrets, handleChange, handleDelete } = props;
  const userId = user ? user.id : null;

  return (
    <div>
      {userId && <SecretsForm />}
      <div id="s_container">
        {secrets.map(secret => {
          if (secret.isPublic || secret.userId === userId) {
            return (
              <Secret
                key={secret.id}
                secret={secret}
                handleChange={handleChange}
                handleDelete={handleDelete}
                userId={userId}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
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
