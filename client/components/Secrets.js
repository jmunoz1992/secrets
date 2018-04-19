import React from 'react';
import { connect } from 'react-redux';

export const Secrets = (props) => {
  const { secrets } = props;

  return (
    <div>
      <h1>Most Recent Secrets</h1>
      <ul>
        { secrets && secrets.map(secret => {
          return (
            <li key={`secret-${secret.id}`}>
              {secret.message}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const mapState = (state) => {
  return {
    secrets: state.secrets.secrets,
    user: state.user
  };
};

export default connect(mapState)(Secrets);
