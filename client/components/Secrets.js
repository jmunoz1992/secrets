import React from 'react';
import { connect } from 'react-redux';
import SecretsForm from './SecretsForm';
import CheckBoxSlider from './CheckBoxSlider';
import DeleteButton from './DeleteButton';
import { updateSecret, destroySecret } from '../store';

const isMySecret = (userId, secret) => {
  if (secret.userId === userId) return true;
  return false;
};

export const Secrets = (props) => {
  const { user, secrets, handleChange, handleDelete } = props;
  const userId = user ? user.id : null;

  return (
    <div>
      <h1>Most Recent Secrets</h1>
      {userId ? <SecretsForm /> : null}
      <div id="s_container">
        { secrets.map(secret => {
          if (isMySecret(userId, secret)) {
            return (
              <div className="s_message" key={`secret-${secret.id}`}>
                “{secret.message}” - me
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
              </div>
            );
          } else if (secret.isPublic) {
            return (
              <div className="s_message" key={`secret-${secret.id}`}>
                “{secret.message}” - anonymous
              </div>
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
