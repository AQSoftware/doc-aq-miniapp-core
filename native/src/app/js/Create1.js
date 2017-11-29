import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button
} from 'react-native';
// import AwesomeButton from 'react-native-awesome-button';
import {
  StaticCanvas,
  AQButton
} from '../../components';

type Props = {
  onChange?: (string, string, string) => void,
  showPreview?: () => void
}

export default class Create1 extends Component {

  _onDone() {
    this.props.showPreview();
  }

  render(){
    const { height, width } = Dimensions.get('window');
    return(
      <View style={styles.container}>
        <StaticCanvas style={{width:width, height: height}}/>
        <View style={styles.createButton}>
          <AQButton
            title='Done'
            backgroundColor='gray'
            width={100}
            height={40}
            onPress={this.props.showPreview}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  createButton: {
    position: 'absolute',
    bottom: 100
  }
});
