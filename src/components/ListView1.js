import {Fonts, IMAGES} from '@/assets';
import {deviceWidth, moderateScale, wp} from '@/hooks/scale';
import {strings} from '@/localization';
import {useTheme} from '@react-navigation/native';
import {useMemo} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const ListView1 = props => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  let {
    btnStyles,
    name,
    userImage,
    joinStyle,
    speciality,
    timeText,
    dateText,
    onClickCancel,
    onClickJoin,
    onClickAccept,
    onClickReject,
    onClickReschedule,
    onCallIconPress,
    isBtnSection = true,
    isBtnSection1 = false,
    isVideo = true,
    isAudio = false,
    isClickJoin = true,
    isClickCancel = true,
  } = props;
  return (
    <View style={[styles.btnstyle, btnStyles]}>
      <View style={styles.infoView}>
        <View style={styles.subText}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.specialityText}>{speciality}</Text>
        </View>
        <View style={styles.userImgView}>
          <Image
            style={{width: 48, height: 48, borderRadius: 50}}
            source={userImage}
            resizeMode={'contain'}
            PlaceholderContent={
              <ActivityIndicator size="small" color="0000ff" />
            }
          />
        </View>
      </View>
      <View style={styles.timeView}>
        <Image source={IMAGES.icons.session.timeIcon} />
        <Text style={styles.timeText}>{timeText}</Text>
        <Image
          source={IMAGES.icons.session.calendarIcon}
          style={{marginLeft: moderateScale(15)}}
        />
        <Text style={styles.dateText}>{dateText}</Text>
      </View>
      {isBtnSection ? (
        <View style={styles.btnSection}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClickCancel}>
            <Text style={styles.cancelText}>{strings.session.cancel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.joinBtn, joinStyle]}
            onPress={onClickJoin}>
            <Text style={styles.joinText}>{strings.session.join}</Text>
          </TouchableOpacity>

          <View style={styles.iconView} onPress={onCallIconPress}>
            {isVideo ? (
              <Image source={IMAGES.icons.session.videoIcon} />
            ) : (
              <Image source={IMAGES.icons.session.voiceIcon} />
            )}
          </View>
        </View>
      ) : null}
      {isBtnSection1 ? (
        <View style={styles.btnSection}>
          <TouchableOpacity style={styles.joinBtn} onPress={onClickAccept}>
            <Text style={styles.joinText}>{strings.session.accept}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClickReject}>
            <Text style={styles.cancelText}>{strings.session.reject}</Text>
          </TouchableOpacity>

          <View style={styles.iconView} onPress={onCallIconPress}>
            {isVideo ? (
              <Image source={IMAGES.icons.session.videoIcon} />
            ) : (
              <Image source={IMAGES.icons.session.voiceIcon} />
            )}
          </View>
        </View>
      ) : null}
      {isBtnSection ? (
        <View style={styles.btnSection}>
          <TouchableOpacity
            style={[
              styles.cancelBtn,
              {width: '100%', backgroundColor: '#DD4C381C'},
            ]}
            onPress={onClickReschedule}>
            <Text style={styles.cancelText}>{strings.session.reschedule}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    infoView: {
      flex: 1,
      flexDirection: 'row',
    },
    subText: {
      flex: 0.85,
    },
    btnstyle: {
      flexDirection: 'column',
      backgroundColor: theme.colors.white,
      borderRadius: 10,
      marginVertical: moderateScale(8),
      paddingTop: moderateScale(12),
      paddingBottom: moderateScale(18),
      paddingHorizontal: moderateScale(18),
      borderColor: 'rgba(0, 0, 0, 0.14)',
      borderWidth: 1,
      // shadowOffset: {width: 0, height: -2},
      //shadowOpacity: 0.5,
      //shadowRadius: 1,
    },
    nameText: {
      fontSize: moderateScale(20),
      color: theme.colors.secondary,
      fontFamily: Fonts.medium,
      fontWeight: '700',
    },
    specialityText: {
      fontSize: wp(3.7),
      color: theme.colors.text,
      marginTop: moderateScale(4),
      fontFamily: Fonts.regular,
      fontWeight: '400',
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
      fontSize: moderateScale(16),
      color: theme.colors.text,
      marginLeft: moderateScale(6),
      fontFamily: Fonts.regular,
      fontWeight: '400',
    },
    dateText: {
      fontSize: moderateScale(16),
      color: theme.colors.text,
      marginLeft: moderateScale(6),
      fontFamily: Fonts.regular,
      fontWeight: '400',
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
      // width: moderateScale(125),
      width: deviceWidth / 3,
      height: moderateScale(36),
      backgroundColor: theme.colors.secondaryGrey,
      borderRadius: 50,
    },
    cancelText: {
      fontSize: moderateScale(18),
      color: theme.colors.black,
      fontFamily: Fonts.light,
      fontWeight: '600',
    },
    joinBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: deviceWidth / 2.7,
      height: moderateScale(36),
      backgroundColor: theme.colors.secondary,
      borderRadius: 50,
    },
    joinText: {
      fontSize: moderateScale(18),
      color: theme.colors.white,
      fontFamily: Fonts.light,
      fontWeight: '600',
    },
    iconView: {
      height: moderateScale(35),
      width: moderateScale(35),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.secondary,
      borderRadius: moderateScale(50),
    },
  });
