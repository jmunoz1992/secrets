import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSecret } from '../store';
import CheckBoxSlider from './CheckBoxSlider';

export class SecretsForm extends Component
{
  constructor() {
    super();
    this.state = {
      newSecret: '',
      isPublic: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const newState = {};
    if (event.target.name === 'isPublic') {
      newState.isPublic = event.target.checked;
    } else {
      newState[event.target.name] = event.target.value;
    }
    this.setState(newState);
  }

  resetState() {
    this.setState({
      newSecret: '',
      isPublic: false
    });
  }

  render() {
    const { newSecret, isPublic } = this.state;
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={event => {handleSubmit(event); this.resetState();}}>
        <label>What's your secret?</label>
        <textarea
          value={newSecret}
          onChange={this.handleChange}
          name="newSecret"
        />
        <br />
        <CheckBoxSlider
          onChange={this.handleChange}
          checked={isPublic}
          name="isPublic"
          label="public?"
        />
        <button type="submit">Save</button>
      </form>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(event) {
      event.preventDefault();
      const newSecret = {
        message: event.target.newSecret.value,
        isPublic: event.target.isPublic.checked
      };
      dispatch(createSecret(newSecret));
    }
  };
};

export default connect(null, mapDispatch)(SecretsForm);
