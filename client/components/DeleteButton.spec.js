import { DeleteButton } from './DeleteButton.js';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

const adapter = new Adapter();
enzyme.configure({adapter});

describe('<DeleteButton />', () => {
  let deleteButton;

  beforeEach(() => {
    deleteButton = shallow(<DeleteButton />);
  });

  it('should render a span and an i', () => {
    expect(deleteButton.find('span').length).to.equal(1);
    expect(deleteButton.find('i').length).to.equal(1);
  });
});
