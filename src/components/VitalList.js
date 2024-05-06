import {Fonts} from '@/assets';
import {Image, TextView} from '@/components';
import {moderateScale, wp} from '@/hooks/scale';
import {colors} from '@/theme';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: moderateScale(100),
    alignItems: 'center',
    borderRadius: moderateScale(10),
    flexDirection: 'row',
  },
  firstImageContainer: {
    width: '15%',
    justifyContent: 'center',
    height: '100%',
    marginHorizontal: moderateScale(20),
  },
  titleContainer: {
    width: '56%',
    justifyContent: 'center',
    height: '100%',
    marginVertical: moderateScale(10),
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: wp(4.1),
    color: colors.BLACK,
  },
});

export const VitalList = ({
  firstImage,
  title,
  subText,
  unit,
  lastImage,
  lastImageAlt,
  lastImagePress,
  onContainerPress,
  containerColor,
  containerStyle,
  titleContainerStyle,
  titleTextStyle,
  disabled,
  color,
}) => {
  return (
    <TouchableOpacity
      onPress={onContainerPress}
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor: containerColor ?? 'rgba(0, 93, 168, 0.12)',
          ...containerStyle,
        },
      ]}>
      <View style={styles.firstImageContainer}>
        <Image source={firstImage} />
      </View>
      <View style={[styles.titleContainer, {...titleContainerStyle}]}>
        <TextView
          title={title}
          textStyle={[styles.title, {...titleTextStyle}]}
        />
        {subText && (
          <View style={{flexDirection: 'row', marginTop: moderateScale(8)}}>
            <TextView
              title={subText}
              viewStyle={{marginVertical: moderateScale(5)}}
              textStyle={{
                fontSize: moderateScale(22),
                fontFamily: Fonts.bold,
              }}
              color={color}
            />
            <TextView
              title={unit}
              viewStyle={{alignSelf: 'center', marginLeft: moderateScale(1)}}
              textStyle={{
                fontSize: moderateScale(14),
                marginTop: moderateScale(3),
                fontFamily: Fonts.medium,
              }}
              color={'#696969'}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={lastImagePress}
        style={{justifyContent: 'center', width: '100%', height: '100%'}}>
        <Image source={lastImage} />
        {lastImageAlt && (
          <TextView
            title={lastImageAlt}
            textStyle={{
              fontSize: moderateScale(8),
              fontFamily: Fonts.light,
            }}
            color={'#696969'}
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
