import reducer, {
  gotSecrets,
  GOT_SECRETS,
  fetchSecrets
} from './secrets';

import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

describe('Passages store', () => {
  const initialState = {
    secrets: [],
    currentSecretId: -1
  };

  describe('action creators', () => {
    describe('gotPassages', () => {
      it('should return an action with the correct type', () => {
        const action = gotSecrets([{ message: 'I am a secret!', isPublic: false }]);
        expect(action.type).to.equal(GOT_SECRETS);
        expect(action.secrets).to.deep.equal([
          { message: 'I am a secret!', isPublic: false }
        ]);
      });
    });
  });

  describe('thunks', () => {
    let store, mockAxios;

    beforeEach(() => {
      mockAxios = new MockAdapter(axios);
      store = mockStore(initialState);
    });

    afterEach(() => {
      mockAxios.restore();
      store.clearActions();
    });

    describe('fetchSecrets', () => {
      it('dispatches the GOT_SECRETS action', () => {
        const fakeSecrets = [{ message: 'A super secret', isPublic: true }];
        mockAxios.onGet('/api/secrets').replyOnce(200, fakeSecrets);
        return store.dispatch(fetchSecrets())
          .then(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.be.equal(GOT_SECRETS);
            expect(actions[0].secrets).to.deep.equal(fakeSecrets);
          });
      });
    });
  });

  describe('reducer', () => {
    describe('GOT_SECRETS action', () => {
      it('should replace initial state with new secrets', () => {
        const fakeSecrets = [
          { message: 'a secret', isPublic: false },
          { msesage: '2nd secret', isPublic: true }
        ];
        const action = {
          type: GOT_SECRETS,
          secrets: fakeSecrets
        };
        const newState = reducer(initialState, action);
        expect(newState).to.deep.equal({
          secrets: fakeSecrets,
          currentSecretId: -1
        });
      });
    });
  });
});
