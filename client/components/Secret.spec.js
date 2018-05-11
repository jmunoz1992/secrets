import Secret from './Secret.js';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import { seedSecrets } from '../../script/test-seeds';
import sinon from 'sinon';
import { CheckBoxSlider } from './CheckBoxSlider.js';
import { DeleteButton } from './DeleteButton.js';

const adapter = new Adapter();
enzyme.configure({adapter});

describe('<Secret />', () => {
  let secretWrappers;
  const handleDelete = sinon.spy();
  const handleChange = sinon.spy();

  beforeEach(() => {
    secretWrappers = seedSecrets.map(secret => {
      return shallow(<Secret secret={secret} userId={1} handleChange={handleChange} handleDelete={handleDelete} />);
    });
  });

  it('should render a div with class .s_message', () => {
    secretWrappers.forEach(secret => {
      expect(secret.find('.s_message').length).to.equal(1);
    });
  });

  it('should render "me" for secrets not written by user', () => {
    expect(secretWrappers[0].find('.s_author').text()).to.equal('- me');
    expect(secretWrappers[1].find('.s_author').text()).to.equal('- me');
  });

  it('should render "anonymous" for secrets not written by user', () => {
    expect(secretWrappers[2].find('.s_author').text()).to.equal('- anonymous');
    expect(secretWrappers[3].find('.s_author').text()).to.equal('- anonymous');
  });

  it('should render the CheckBoxSlider if owned by user', () => {
    expect(secretWrappers[0].find(CheckBoxSlider).length).to.equal(1);
    expect(secretWrappers[1].find(CheckBoxSlider).length).to.equal(1);
  });

  it('should NOT render the CheckBoxSlider if NOT owned by user', () => {
    expect(secretWrappers[2].find(CheckBoxSlider).length).to.equal(0);
    expect(secretWrappers[3].find(CheckBoxSlider).length).to.equal(0);
  });

  it('should NOT render the DeleteButton if NOT owned by user', () => {
    expect(secretWrappers[2].find(DeleteButton).length).to.equal(0);
    expect(secretWrappers[3].find(DeleteButton).length).to.equal(0);
  });

  it('simulates selecting the CheckBoxSlider', () => {
    secretWrappers[1].find(CheckBoxSlider).simulate('change');
    expect(handleChange).to.have.property('callCount', 1);
  });

  it('simulates clicking the DeleteButton', () => {
    secretWrappers[0].find(DeleteButton).simulate('click');
    expect(handleDelete).to.have.property('callCount', 1);
  });
});
