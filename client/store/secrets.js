import axios from 'axios';

export const GOT_SECRETS = 'GOT_SECRETS';
export const GOT_ONE_SECRET = 'GOT_ONE_SECRET';

const initialState = [];

// Action Creators

export const gotSecrets = secrets => (
  {
    type: GOT_SECRETS,
    secrets
  }
);

export const gotOneSecret = secret => (
  {
    type: GOT_ONE_SECRET,
    secret
  }
);

// Thunks

export const fetchSecrets = () =>
  dispatch =>
    axios.get(`/api/secrets`)
      .then(res => res.data)
      .then(secrets => {
        dispatch(gotSecrets(secrets));
      })
      .catch(err => console.error(err.message));

export const createSecret = secret =>
  dispatch =>
    axios.post(`/api/secrets`, secret)
      .then(res => res.data)
      .then(newSecret => {
        dispatch(gotOneSecret(newSecret));
      })
      .catch(err => console.error(err.message));

// Reducer

export default function (state = initialState, action) {

  switch (action.type) {

    case GOT_SECRETS:
      return [...action.secrets];

    case GOT_ONE_SECRET:
      return [...state, action.secret];

    default:
      return state;
  }
}
