import {moderateScale, wp} from '@/hooks/scale';
import {colors, typography} from '@/theme';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const ListView2 = props => {
  let {
    btnStyles,
    userImage,
    tickIcon,
    name,
    chatText,
    timeText,
    onClickChat,
    unreadMsgCount = 0,
  } = props;
  return (
    <TouchableOpacity style={[styles.btnstyle, btnStyles]}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
        <View style={{flex: 0.76, flexDirection: 'row'}}>
          <View style={{flex: 0.45}}>
            <Image
              source={userImage}
              style={{height: moderateScale(70), width: moderateScale(70)}}
            />
          </View>
          <View style={{flex: 1, alignSelf: 'flex-start'}}>
            <Text style={typography.largeTitle} numberOfLines={1}>
              {name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: moderateScale(16),
              }}>
              {unreadMsgCount <= 0 ? <Image source={tickIcon} /> : null}
              <Text
                numberOfLines={1}
                style={[
                  typography.title,
                  {
                    marginLeft: unreadMsgCount <= 0 ? moderateScale(5) : 0,
                    color: '#0000005E',
                  },
                ]}>
                {chatText}
              </Text>
            </View>
          </View>
        </View>
        <View style={{flex: 0.24, alignSelf: 'flex-start'}}>
          <Text style={[typography.text, {alignSelf: 'flex-end'}]}>
            {timeText}{' '}
          </Text>
          {unreadMsgCount > 0 ? (
            <View
              style={{
                backgroundColor: colors.PRIMARY_BLUE,
                alignSelf: 'flex-end',
                width: 29,
                height: 29,
                borderRadius: 30,
                marginTop: moderateScale(15),
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: moderateScale(3),
              }}>
              <Text style={[typography.text, {color: colors.WHITE}]}>
                {unreadMsgCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <View
        style={{
          height: 1,
          marginTop: moderateScale(11),
          backgroundColor: '#00000012',
          width: '100%',
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnstyle: {
    borderRadius: 10,
    marginVertical: moderateScale(6),
  },
  nameText: {
    fontSize: wp(4.9),
    color: colors.PRIMARY_BLUE,
  },
  chatText: {
    fontSize: wp(3.7),
    color: colors.PRIMARY_GREY,
    marginTop: moderateScale(4),
  },
  timeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(4.5),
  },
  timeText: {
    fontSize: wp(4.1),
    color: colors.PRIMARY_GREY,
    marginLeft: moderateScale(6),
  },
  chatCount: {},
});
