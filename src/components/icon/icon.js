import React from 'react';
import {
  View,
  ViewStyle,
  Image,
  ImageStyle,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { icons } from './icons';


export function Icon(props) {
  const { style: styleOverride, name, containerStyle, onPress } = props;
  const style = { ...styles.container, ...styleOverride };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={containerStyle}>
        <Image style={style} source={icons[name]} />
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={containerStyle}>
        <Image style={style} source={icons[name]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    resizeMode: 'contain',
  },
});
