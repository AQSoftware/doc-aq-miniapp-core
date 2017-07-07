// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Text,
} from 'react-native';
import {
  CloudStorage,
  MediaStorage,
  defaultLifeCycle,
  StaticCanvas
} from '..';
import type { MiniAppCredentials } from '..';
import Create from './Create';

/*
This type represents the data structure shared between create and join screens.
Basically, create screens should output this data, which will then be consumed
by the join screen
*/
export type ItemData = {
  title: string,
  coverImage: string
}

function Warning(props) {
  return <Text>Warning: {props.message}</Text>;
}

export default class MiniApp extends Component {

  state: {
    data: ?Object
  }

  static propTypes = {
    action: PropTypes.string,
    id: PropTypes.string,
    create: PropTypes.element,
    join: PropTypes.element.isRequired,
    credentials: PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string
    }),
    data: PropTypes.object
  }

  static defaultProps = {
    action: 'preview',
    id: null,
    default: null,
    credentials: {
      id: "",
      key: ""
    },
    data: null
  }

  clients: {
    cloudStorageClient: CloudStorage,
    mediaStorageClient: MediaStorage
  }

  //$FlowFixMe
  constructor(props) {
    super(props);
    this.clients = {
      cloudStorageClient: new CloudStorage(props.credentials),
      mediaStorageClient: new MediaStorage()
    };
    this.state = {
      data: props.data
    };
  }

  componentWillMount(){
    defaultLifeCycle.setOnDataCallback(this._onData.bind(this));
  }

  _onData(data: Object) {
    this.setState({data: data});
  }

  render() {
    // Depending on mode, this mini app will be called with the possible
    // query parameters:
    //
    // For Content Editor mode - http://server/index.html?action=create
    // For Join mode - http://server/index.html?action=join&id=some_id&joinId=some_id
    // For Preview mode - http://server/index.html?action=preview
    let Join = this.props.join;

    const { height, width } = Dimensions.get('window');

    let render = <StaticCanvas width={width} height={height}/> ;
    if (this.props.default) {
        render = React.createElement(this.props.default, {...this.clients}, null);
    }

    if (this.props.devt) {
      render = React.createElement(
        this.props.join,
        {...this.clients, data: this.state.data, mode: 'preview'},
        null
      );
    }
    else {
      switch (this.props.action) {
        case 'join':
          if (this.props.id == null) {
            let message = 'id was not passed for action=join';
            render = <Warning message={message}/>
          }
          else {
            render = React.createElement(
              this.props.join,
              {...this.clients, data: this.state.data, id: this.props.id, mode: 'join'},
              null
            );
          }
          break;
        case 'preview':
          render = React.createElement(
            this.props.join,
            {...this.clients, data: this.state.data, mode: 'preview'},
            null
          );
          break;
        default:
          if (this.props.create) {
            render = React.createElement(
              this.props.create,
              {...this.clients, data: this.state.data},
              null
            );
          }
          else {
            if (this.state.data != null) {
              render = <Create {...this.clients} data={this.state.data}/>
            }
          }
          break;
      }
    }
    return render;
  }
}
