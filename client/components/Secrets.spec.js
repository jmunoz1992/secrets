import { Secrets } from './Secrets.js';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import { seedSecrets } from '../../script/test-seeds';

const adapter = new Adapter();
enzyme.configure({adapter});

describe('<Secrets />', () => {
  let secrets;

  beforeEach(() => {
    secrets = shallow(<Secrets secrets={seedSecrets} />);
  });

  it('should render as an h1', () => {
    expect(secrets.find('h1').text()).to.equal('Most Recent Secrets');
  });

  it('should render each secret as a div with class s_message', () => {
    expect(secrets.find('div.s_message').length).to.equal(2);
  });
});
