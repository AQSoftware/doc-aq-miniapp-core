// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CloudStorage,
  MediaStorage,
  defaultLifeCycle,
  StaticCanvas
} from '..';
import type { MiniAppCredentials } from '..';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import QueryString from 'query-string';
import Create from './Create';

function Warning(props) {
  return <div style={{padding: 10}}>Warning: {props.message}</div>;
}

export default class MiniApp extends Component {

  state: {
    data: ?Object
  }

  static propTypes = {
    default: PropTypes.func,
    create: PropTypes.func,
    join: PropTypes.func.isRequired,
    credentials: PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string
    }),
    data: PropTypes.object,
    devt: PropTypes.bool
  }

  static defaultProps = {
    default: null,
    credentials: {
      id: "",
      key: ""
    },
    data: null,
    devt: false
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

  // $FlowFixMe
  _route(routeProps) {
    // Depending on mode, this mini app will be called with the possible
    // query parameters:
    //
    // For Content Editor mode - http://server/index.html?action=create
    // For Join mode - http://server/index.html?action=join&id=some_id&joinId=some_id
    // For Preview mode - http://server/index.html?action=preview
    let search = routeProps.location.search;
    let query = QueryString.parse(search);

    let Join = this.props.join;

    var width = window.innerWidth;
    var height = window.innerHeight;
    let render = <StaticCanvas width={width} height={height}/> ;
    if (this.props.default) {
        render = React.createElement(this.props.default, {...routeProps, ...this.clients}, null);
    }

    if (this.props.devt) {
      render = React.createElement(
        this.props.join,
        {...this.clients, data: this.state.data, mode: 'preview'},
        null
      );
    }
    else if (query && query.action) {
      switch (query.action) {
        case 'join':
          if (query.id == null) {
            let message = 'id was not passed for action=join';
            console.error(message);
            render = <Warning message={message}/>
          }
          else {
            render = React.createElement(
              this.props.join,
              {...this.clients, data: this.state.data, id: query.id, mode: 'join'},
              null
            );
            // render = <Join {...this.clients} mode='join' id={query.id} additionalInfo={this.state.data}/>
          }
          break;
        case 'preview':
          if (this.state.data != null){
            render = React.createElement(
              this.props.join,
              {...this.clients, data: this.state.data, mode: 'preview'},
              null
            );
            // render = <Join {...this.clients} mode='preview' data={this.state.data}/>
          }
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

  render() {
    return (
      <Router>
        <Route path="*" component={this._route.bind(this)}/>
      </Router>
    );
  }
}
