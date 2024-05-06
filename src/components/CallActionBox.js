import {IMAGES} from '@/assets';
import {moderateScale} from '@/hooks/scale';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

export const CallActionBox = props => {
  let {
    btnContainerStyles,
    isVedio = true,
    tickIcon,
    name,
    chatText,
    timeText,
    onClickChat,
    unreadMsgCount = 0,
  } = props;
  return (
    <View style={[styles.buttonContainer, btnContainerStyles]}>
      {isVedio ? (
        <TouchableOpacity style={styles.icon}>
          <View style={styles.iconView}>
            <Image source={IMAGES.icons.session.vedio1} />
          </View>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity>
        <View style={styles.iconView}>
          <Image source={IMAGES.icons.session.audio} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.iconView}>
          <Image source={IMAGES.icons.session.chat} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.iconView}>
          <Image source={IMAGES.icons.session.disconnect} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'white',
    height: '10%',
    position: 'absolute',
    top: '90.28%',
    bottom: '0%',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(45),
    borderTopRightRadius: moderateScale(22),
    borderTopLeftRadius: moderateScale(22),
    justifyContent: 'space-between',
  },
  iconView: {
    height: moderateScale(40),
    width: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 50,
  },
});
