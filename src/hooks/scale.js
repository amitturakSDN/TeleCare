import {Dimensions,PixelRatio } from 'react-native';
const {width, height} = Dimensions.get('window');
const screenHeight = Dimensions.get('screen').height;

//Guideline sizes
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const navbarHeight = screenHeight - height;

export const widthToDP = number => {
  let givenWidth = typeof number === 'number' ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((width * givenWidth) / 100);
};

export const heightToDP = number => {
  let givenHeight = typeof number === 'number' ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((height * givenHeight) / 100);
};

export {
  scale,
  verticalScale,
  moderateScale,
  width as deviceWidth,
  height as deviceHeight,
  widthToDP as wp,
  heightToDP as hp,
};
