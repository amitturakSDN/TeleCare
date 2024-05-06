import {TYPES} from '@/actions/ManualReadingsActions';
import {IMAGES} from '@/assets';
import {AppHeader, Button, Loader, TextView} from '@/components';
import {strings} from '@/localization';
import {styles} from '@/screens/AppointmentSent/AppointmentSent.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {Image, View} from 'react-native';
import {useSelector} from 'react-redux';

export function AppointmentSent({navigation, route}) {
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.LIST_DEVICES], state),
  );

  return (
    <View style={styles.container}>
      <AppHeader
        onBackPress={() => navigation.pop()}
        // onRightPress={() => navigation.push(NAVIGATION.notification)}
        disableBackButton={true} // Disable the back button for this page
      />
      <Loader isLoading={isLoading} />
      <View style={styles.mainView}>
        <Image source={IMAGES.icons.home.requestSent} />
      </View>
      <View style={styles.thanksTextView}>
        <TextView
          title={strings.bookAppointment.appointmentSent}
          textStyle={styles.title}
        />
      </View>
      <View style={styles.textMessageView}>
        <TextView
          title={strings.bookAppointment.requestRecievedText}
          textStyle={styles.textMessage}
        />
      </View>

      <View style={styles.btnView}>
        <Button
          title={strings.bookAppointment.returnHome}
          style={styles.btn}
          textStyle={styles.btnText2}
          onPress={() =>
            navigation.reset({
              index: 1,
              routes: [
                {
                  name: 'Home',
                },
              ],
            })
          }
        />
      </View>
    </View>
  );
}
