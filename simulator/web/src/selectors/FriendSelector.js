// @flow
import React, { Component } from 'react';
import {
  Table,
  Button
} from 'react-bootstrap';
import checkmark from './img/checkmark.png';
import './FriendSelector.css';

type Props = {
  onSelectFriends?: (string) => void,
  className? : string
}

export var friends = [
{
  id: 'oKKUgBXbEeeNCgJC_fmqfQ',
  displayName: 'Racheal Corbin',
  avatarBig: 'https://content.invisioncic.com/Msoompi/en/monthly_2016_03/2015062619251630382.jpg.4967ba563f2d989f8ad6f613f721f7a1.thumb.jpg.8afb39df2e54cafc2a66d1062334919b.jpg',
  avatarSmall: 'https://content.invisioncic.com/Msoompi/en/monthly_2016_03/2015062619251630382.jpg.4967ba563f2d989f8ad6f613f721f7a1.thumb.jpg.8afb39df2e54cafc2a66d1062334919b.jpg'
},
{
  id: 'ottGcBXbEeeNCgJC_fmqfQ',
  displayName: 'Jonelle Kaolin',
  avatarBig: 'http://mianfolio.com/kosimedic/v1.2/img/doctors/profile-2.jpg',
  avatarSmall: 'http://mianfolio.com/kosimedic/v1.2/img/doctors/profile-2.jpg'
},
{
  id: 'pRkBcBXbEeeNCgJC_fmqfQ',
  displayName: 'Cale Audie',
  avatarBig: 'https://www.bma.org.uk/realdoctors/img/profile_2.jpg',
  avatarSmall: 'https://www.bma.org.uk/realdoctors/img/profile_2.jpg'
},
{
  id: 'py-scBXbEeeNCgJC_fmqfQ',
  displayName: 'Gladwyn Karlee',
  avatarBig: 'https://content.invisioncic.com/Msoompi/en/monthly_2016_12/58539520c19cd_ScreenShot2016-12-16at15_16_06.thumb.png.783638058e233b086908770284f2c4bb.png',
  avatarSmall: 'https://content.invisioncic.com/Msoompi/en/monthly_2016_12/58539520c19cd_ScreenShot2016-12-16at15_16_06.thumb.png.783638058e233b086908770284f2c4bb.png'
},
{
  id: 'liop4BXhEeeNCgJC_fmqfQ',
  displayName: 'Jesse Satchel',
  avatarBig: 'http://www.gravatar.com/avatar/b3311d2f1f7259e9578b10c1ee905cc0?s=128&r=g&d=retro',
  avatarSmall: 'http://www.gravatar.com/avatar/b3311d2f1f7259e9578b10c1ee905cc0?s=128&r=g&d=retro'
},
{
  id: 'rByo8BXbEeeNCgJC_fmqfQ',
  displayName: 'Natille Arron',
  avatarBig: 'https://almsaeedstudio.com/themes/AdminLTE/dist/img/user7-128x128.jpg',
  avatarSmall: 'https://almsaeedstudio.com/themes/AdminLTE/dist/img/user7-128x128.jpg'
},
{
  id: 'rr588BXbEeeNCgJC_fmqfQ',
  displayName: 'Malone Albert',
  avatarBig: 'https://thumbnailer.mixcloud.com/unsafe/128x128/profile/0/a/7/1/8e2c-0aff-4d32-b433-1da390356ce0.jpg',
  avatarSmall: 'https://thumbnailer.mixcloud.com/unsafe/128x128/profile/0/a/7/1/8e2c-0aff-4d32-b433-1da390356ce0.jpg'
},
{
  id: 'sNeY8BXbEeeNCgJC_fmqfQ',
  displayName: 'Rolo Kenny',
  avatarBig: 'http://mianfolio.com/kosimedic/v1.2/img/doctors/profile-1.jpg',
  avatarSmall: 'http://mianfolio.com/kosimedic/v1.2/img/doctors/profile-1.jpg'
},
{
  id: 's3b78BXbEeeNCgJC_fmqfQ',
  displayName: 'Ottoline Levi',
  avatarBig: 'https://images.unsplash.com/profile-fb-1448269935-9e6e789df90a.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=348d0e12d895da969768afcc94e836d8',
  avatarSmall: 'https://images.unsplash.com/profile-fb-1448269935-9e6e789df90a.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=348d0e12d895da969768afcc94e836d8'
}
]

export class FriendSelector extends Component {
  state: {
    selected : Array<Object>
  }

  constructor(props: Props){
    super(props);
    this.state = {
      selected: []
    }
  }

  _onSelectItem(item: Object) {
    let index = this.state.selected.indexOf(item)
    let selected = this.state.selected;
    if (index >= 0) {
      selected.splice(index, 1);
    }
    else {
      selected.push(item);
    }
    this.setState({selected: selected});
  }

  _onDoneClick() {
    if (this.props.onSelectFriends) {
      this.props.onSelectFriends(this.state.selected);
    }
  }

  render(){
    return(
      <div className={`friendSelector ${this.props.className ? this.props.className : ''}`}>
        <div className="header">Select Friends</div>
        <div className="table">
          <Table striped bordered condensed hover>
            <tbody>
              {friends.map((item) => {
                let checkmarkRender = null;

                if (this.state.selected.indexOf(item) >= 0) {
                  checkmarkRender = <img src={checkmark} alt="" className="checkmark"/>
                }
                else {
                  checkmarkRender = <img src={checkmark} alt="" className="checkmark" style={{opacity: 0}}/>
                }
                return (
                  <tr key={item.id}>
                    <td>
                      <a href="#" className="row" onClick={() => {this._onSelectItem(item);}}>
                        <img src={item.avatarSmall} alt="" className="avatar img-circle"/>
                        {checkmarkRender}
                        <h3 className="displayName">{item.displayName}</h3>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <Button bsStyle="primary" onClick={this._onDoneClick.bind(this)}>Done</Button>
      </div>
    )
  }
}
