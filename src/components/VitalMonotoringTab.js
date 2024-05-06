import {Fonts} from '@/assets';
import {TextView} from '@/components';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  container: {flexDirection: 'row', marginVertical: moderateScale(20)},
  titleContainerActive: {
    marginHorizontal: moderateScale(10),
    borderBottomWidth: 3,
    borderColor: '#005DA8',
  },
  titleText: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.regular,
    fontWeight: '600',
  },
  titleContainerInactive: {},
});
export const VitalMonitoringTab = ({active, onPressHistory, onPressManual}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressHistory}>
        <TextView
          title={strings.vital.history}
          viewStyle={
            active === strings.vital.history
              ? styles.titleContainerActive
              : styles.titleContainerInactive
          }
          textStyle={styles.titleText}
          color={active === strings.vital.history ? '#005DA8' : '#8E8E8E'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressManual}>
        <TextView
          title={strings.vital.manual}
          viewStyle={
            active === strings.vital.manual
              ? styles.titleContainerActive
              : styles.titleContainerInactive
          }
          textStyle={styles.titleText}
          color={active === strings.vital.manual ? '#005DA8' : '#8E8E8E'}
        />
      </TouchableOpacity>
    </View>
  );
};
