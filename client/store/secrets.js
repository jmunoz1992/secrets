import axios from 'axios';

export const GOT_SECRETS = 'GOT_SECRETS';

const initialState = {
  secrets: [],
  currentSecretId: -1
};

// Action Creators

export const gotSecrets = secrets => (
  {
    type: GOT_SECRETS,
    secrets
  }
);

// Thunks

export const fetchSecrets = () =>
  dispatch =>
    axios.get(`/api/secrets`)
      .then(res => res.data)
      .then(secrets => {
        dispatch(gotSecrets(secrets));
      });

// Reducer

export default function (state = initialState, action) {
  switch (action.type) {

    case GOT_SECRETS:
      return { ...state, secrets: action.secrets };

    default:
      return state;
  }
}
