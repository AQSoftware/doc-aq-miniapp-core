// @flow
import React, { Component } from 'react';
import {
  Alert
} from 'react-bootstrap';

type Props = {
  message: string,
  visible: boolean,
  onDismiss: () => void
}

export default class DismissableAlert extends Component<Props, State> {

  hide(){
    this.setState({ visible: false });
    this.props.onDismiss();
  }

  render() {
    if (this.props.visible) {
      return <Alert bsStyle="danger" onDismiss={this.hide.bind(this)}>
        <p>{this.props.message}</p>
      </Alert>
    }
    else {
      return null;
    }
  }
}