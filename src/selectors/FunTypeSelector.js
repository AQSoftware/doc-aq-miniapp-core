// @flow
import React, { Component } from 'react';
import { GalleryImageSelector } from './GalleryImageSelector';
// import { MethodSelector } from './MethodSelector';
// import { PrizeSelector } from './PrizeSelector';
import { TitleTextInput } from './TitleTextInput';
import { WebImageSelector } from './WebImageSelector';
import { FriendSelector, friends } from './FriendSelector';

export type SelectorMode = 'none' | 'gallery' | 'prizeMethod' | 'prizeSelector' | 'prizeInput' | 'title' | 'webImage' | 'friend';
export type AssetType = 'All' | 'Photos' | 'Videos';

type Props = {
  mode: SelectorMode,
  gallerySelector? : {
    title: string,
    imageRatio: number,
    assetType: AssetType,
    onPress: (string) => void
  },
  webImageSelector? : {
    title: string,
    imageRatio: number,
    data: Array<string>,
    onPress: (string) => void
  },
  titleInput? : {
    onEndEditing: (string) => void
  },
  prizeSelector? : {
    title: string,
    loaders: Object,
    onPress: (any) => void
  },
  prizeMethodSelector? : {
    title: string,
    loaders: Object,
    onPress: (any) => void
  },
  friendSelector? : {
    onSelectFriends: (Array<Object>) => void
  }
}

export class FunTypeSelector extends Component {

  props: Props;

  static defaultProps = {
    mode: 'gallery'
  }

  // constructor(props: Props){
  //   super(props);
  // }

  render(){
    let selector = null;
    // let height = window.innerWidth, width = window.innerHeight;
    let {style, ...props} = {...this.props};

    switch (this.props.mode) {
      case 'gallery':
        if (this.props.gallerySelector) {
          let selectorProps = this.props.gallerySelector;
          selector = <GalleryImageSelector
            {...props}
            className="selector"
            imageRatio={selectorProps.imageRatio}
            title={selectorProps.title}
            assetType={selectorProps.assetType}
            onPress={selectorProps.onPress}
          />;
        }
        break;
      case 'prizeMethod':
        if (this.props.prizeMethodSelector){
          // let selectorProps = this.props.prizeMethodSelector;
          // selector = <MethodSelector
          //   {...props}
          //   style={[style, styles.content]}
          //   loaders={selectorProps.loaders}
          //   title={selectorProps.title}
          //   onPress={selectorProps.onPress}
          // />
        }
        break;
      case 'prizeSelector':
        if (this.props.prizeSelector){
          // let selectorProps = this.props.prizeSelector;
          // selector = <PrizeSelector
          //   {...props}
          //   style={[style, styles.content]}
          //   loaders={this.props.loaders}
          //   title={selectorProps.title}
          //   onPress={selectorProps.onPress}
          // />
        }
        break;
      case 'title':
        if (this.props.titleInput){
          let selectorProps = this.props.titleInput;
          selector =
            <TitleTextInput
              {...props}
              className="selector"
              onEndEditing={selectorProps.onEndEditing}
            />
        }
        break;
      case 'webImage':
        if (this.props.webImageSelector){
          let selectorProps = this.props.webImageSelector;
          selector = <WebImageSelector
            {...props}
            className="selector"
            imageRatio={selectorProps.imageRatio}
            title={selectorProps.title}
            data={selectorProps.data}
            onPress={selectorProps.onPress}
          />;
        }
        break;
      case 'friend':
        if (this.props.friendSelector){
          let selectorProps = this.props.friendSelector;
          selector = <FriendSelector
            {...props}
            className="fullScreenSelector"
            onSelectFriends={selectorProps.onSelectFriends}
          />;
        }
        break;
      default:
    }

    return selector;
  }
}

export function getFriends() {
  return friends;
}

// const styles = StyleSheet.create({
//   content: {
//   }
// });

FunTypeSelector.propTypes = {
  mode: React.PropTypes.oneOf(['none', 'gallery', 'prizeMethod', 'prizeSelector', 'prizeInput', 'title', 'webImage', 'friend']).isRequired,
  gallerySelector : React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    imageRatio: React.PropTypes.number,
    assetType: React.PropTypes.oneOf(['All', 'Photos', 'Videos']).isRequired,
    onPress: React.PropTypes.func
  }),
  webImageSelector : React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    imageRatio: React.PropTypes.number,
    data: React.PropTypes.arrayOf(React.PropTypes.string),
    onPress: React.PropTypes.func
  }),
  titleInput : React.PropTypes.shape({
    onEndEditing: React.PropTypes.func
  }),
  prizeSelector : React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    loaders: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func
  }),
  prizeMethodSelector : React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    loaders: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func
  }),
  friendSelector : React.PropTypes.shape({
    onSelectFriends: React.PropTypes.func
  })
};
