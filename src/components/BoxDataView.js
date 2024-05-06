import {CustomSlider, TextView} from '@/components';
import {moderateScale, wp} from '@/hooks/scale';
import {shadow} from '@/theme';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import {Text, View} from 'react-native';

export const BoxDataView = props => {
  const [sleepScale, setSleepScale] = useState();
  const [isEditUI, setIsEditUI] = useState(false);
  const theme = useTheme();
  let {
    btnStyles,
    title,
    subTitle,
    reading,
    scale,
    isSlider = true,
    onClickAdd,
  } = props;
  return (
    <View
      style={[
        shadow.primary,
        {
          borderWidth: 1,
          padding: moderateScale(15),
          borderRadius: moderateScale(10),
          backgroundColor: '#FFFFFF',
          borderColor: 'rgba(0, 0, 0, 0.14)',
        },
      ]}>
      <TextView
        title={title}
        textStyle={{fontWeight: '500', fontSize: wp(4.9)}}
        color={'#000000'}
      />
      <TextView
        title={subTitle}
        textStyle={{fontSize: wp(4.1), fontWeight: '400'}}
        viewStyle={{marginTop: moderateScale(10)}}
        color={'#969696'}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: moderateScale(7),
        }}>
        <View
          style={{
            height: moderateScale(65),
            width: moderateScale(69),
            borderRadius: 10,
            backgroundColor: 'rgba(0, 93, 168, 0.06)',
          }}>
          <TextView
            title={reading}
            textStyle={{fontSize: wp(5.7), fontWeight: '700'}}
            viewStyle={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            color={'#000000'}
          />
        </View>
        <TextView
          title={scale}
          textStyle={{fontSize: wp(4.9), fontWeight: '400'}}
          color={'#969696'}
          viewStyle={{marginLeft: moderateScale(5)}}
        />
      </View>
      {isSlider ? (
        <View
          style={{
            alignItems: 'center',
            marginTop: moderateScale(27),
          }}>
          <CustomSlider
            setScale={setSleepScale}
            getScale={sleepScale}
            isEditUI={isEditUI}
          />
          <Text
            style={{
              marginTop: moderateScale(22),
              color: '#005DA8',
              fontSize: wp(4.1),
            }}>
            No fever
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = theme =>
  StyleSheet.create({
    infoView: {
      flex: 1,
      flexDirection: 'row',
    },
    subText: {
      flex: 0.85,
    },
    btnstyle: {},
    nameText: {
      fontSize: wp(4.9),
      color: theme.colors.black,
    },
    specialityText: {
      fontSize: wp(3.7),
      color: theme.colors.text,
      marginTop: moderateScale(4),
    },
    userImgView: {
      flex: 0.15,
    },
    timeView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScale(4.5),
    },
    timeText: {
      fontSize: wp(4.1),
      color: theme.colors.text,
      marginLeft: moderateScale(6),
    },
    dateText: {
      fontSize: wp(4.1),
      color: theme.colors.text,
      marginLeft: moderateScale(6),
    },
    btnSection: {
      marginTop: moderateScale(12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cancelBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: moderateScale(130),
      height: moderateScale(35),
      backgroundColor: theme.colors.secondaryGrey,
      borderRadius: 50,
    },
    cancelText: {
      fontSize: wp(4.5),
      color: theme.colors.black,
    },
    joinBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: moderateScale(130),
      height: moderateScale(35),
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
    },
    joinText: {
      fontSize: wp(4.5),
      color: theme.colors.white,
    },
    iconView: {
      height: moderateScale(35),
      width: moderateScale(35),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
    },
  });
