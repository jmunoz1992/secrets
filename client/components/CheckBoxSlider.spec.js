import { CheckBoxSlider } from './CheckBoxSlider.js';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

const adapter = new Adapter();
enzyme.configure({adapter});

describe('<CheckBoxSlider />', () => {
  let checkBoxSlider;

  beforeEach(() => {
    checkBoxSlider = shallow(<CheckBoxSlider />);
  });

  it('should render a label and an i', () => {
    expect(checkBoxSlider.find('label').length).to.equal(1);
    expect(checkBoxSlider.find('span').length).to.equal(3);
    expect(checkBoxSlider.find('input').length).to.equal(1);
  });
});
