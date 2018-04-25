import React from 'react';
import { connect } from 'react-redux';
import SecretsForm from './SecretsForm';

export const Secrets = (props) => {
  const { secrets } = props;

  return (
    <div>
      <h1>Most Recent Secrets</h1>
      <ul>
        { secrets.map(secret => {
          return (
            <li key={`secret-${secret.id}`}>
              {secret.message}
            </li>
          );
        })}
      </ul>
      <SecretsForm />
    </div>
  );
};

const mapState = (state) => {
  return {
    secrets: state.secrets,
    user: state.user
  };
};

export default connect(mapState)(Secrets);
