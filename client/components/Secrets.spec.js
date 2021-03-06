import { Secrets } from './Secrets.js';
import Secret from './Secret.js';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import { seedSecrets } from '../../script/test-seeds';

const seeds = seedSecrets.map((seedSecret, index) => {
  return { ...seedSecret, id: index + 1 };
});

const adapter = new Adapter();
enzyme.configure({adapter});

describe('<Secrets />', () => {
  let secretsWrapper;

  beforeEach(() => {
    secretsWrapper = shallow(<Secrets secrets={seeds} />);
  });

  it('should render secrets within a container', () => {
    expect(secretsWrapper.find('div#s_container').length).to.equal(1);
  });

  it('should render two secrets', () => {
    expect(secretsWrapper.find(Secret).length).to.equal(2);
  });

  it('should render public messages', () => {
    const secretChildren = secretsWrapper.find(Secret);
    expect(secretChildren.at(0).props().secret)
      .to.deep.equal({
        id: 1,
        message: 'I love the admin of this web site.',
        userId: 1,
        isPublic: true
      });
    expect(secretChildren.at(1).props().secret)
      .to.deep.equal({
        id: 3,
        message: 'I took the SAT for my sister. I got a terrible score.',
        userId: 2,
        isPublic: true
      });
  });
});
