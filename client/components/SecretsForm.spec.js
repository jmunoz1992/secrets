import { SecretsForm } from './SecretsForm.js';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

const adapter = new Adapter();
enzyme.configure({adapter});

describe('<Secrets />', () => {
  let secretsForm;

  beforeEach(() => {
    secretsForm = shallow(<SecretsForm />);
  });

  it('should render some elements', () => {
    expect(secretsForm.find('textarea').length).to.equal(1);
    expect(secretsForm.find('button').length).to.equal(1);
  });
});
