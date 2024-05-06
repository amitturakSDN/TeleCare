import {moderateScale} from '@/hooks/scale';
import {colors} from '@/theme';
import {useTheme} from '@react-navigation/native';
import {useMemo} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {Slider} from 'react-native-elements';
export const CustomSlider = ({
  setScale,
  getScale,
  minimumValue,
  maximumValue,
  sliderContainerStyle,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Slider
      value={getScale}
      onValueChange={text => setScale(text)}
      maximumTrackTintColor={colors.BG_GREY}
      minimumTrackTintColor={'#E3E55D'}
      tintColor={colors.TEXT_GREEN}
      // thumbTintColor={"#D9D9D9"}
      // thumbTintColor={'red'}
      trackStyle={{
        height: moderateScale(5),
        borderRadius: 10,
        backgroundColor: 'transparent',
      }}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      thumbStyle={{
        height: moderateScale(22),
        width: moderateScale(22),
        backgroundColor: '#D9D9D9',
      }}
      style={[styles.slider, {sliderContainerStyle}]}
      thumbProps={{
        Component: Animated.Image,
        source: {
          uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        },
      }}
    />
  );
};

const createStyles = theme =>
  StyleSheet.create({
    slider: {
      height: moderateScale(5),
    },
  });
