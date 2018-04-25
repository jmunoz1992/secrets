import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSecret } from '../store';

export class SecretsForm extends Component
{
  constructor() {
    super();
    this.state = {
      newSecret: '',
      isPrivate: true
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const newState = {};
    if (event.target.name === 'isPrivate') {
      newState.isPrivate = event.target.checked;
    } else {
      newState[event.target.name] = event.target.value;
    }
    this.setState(newState);
  }

  // handleSubmit(event) {
  //   alert('A new secret was submitted: ' + this.state.newSecret);
  //   event.preventDefault();
  // }

  render() {
    const { newSecret, isPrivate } = this.state;
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={event => {handleSubmit(event);}}>
        <label>What's your secret?</label>
        <textarea value={newSecret} onChange={this.handleChange} name="newSecret" />
        <br />
        <input
          type="checkbox"
          onChange={this.handleChange}
          checked={isPrivate}
          name="isPrivate"
        /> keep private<br />
        <button type="submit">Save</button>
      </form>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(event) {
      console.log('event.target: ', event.target);
      event.preventDefault();
      const newSecret = {
        message: event.target.newSecret.value,
        isPublic: !event.target.isPrivate.checked
      };
      dispatch(createSecret(newSecret));
    }
  };
};

export default connect(null, mapDispatch)(SecretsForm);
