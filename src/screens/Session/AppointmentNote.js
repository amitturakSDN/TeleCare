import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Fonts, IMAGES} from '@/assets';
import {
  Button,
  ErrorView,
  TextField,
  AppHeader,
  AuthHeader,
  TextView,
  Loader,
} from '@/components';
import {hp, wp, moderateScale, scale, verticalScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/Session/Session.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {Validate} from '@/helpers';
import {NAVIGATION} from '@/constants';
import {TYPES, appointmentNote} from '@/actions/AppointmentAction';
export function AppointmentNote({route, navigation}) {
  const {id, name, startTime, endTime, date, status, photo} = route.params;

  const {colors} = useTheme();
  const dispatch = useDispatch();
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.APPOINTMENT_NOTE], state),
  );
  const {appointment} = useSelector(state => state);
  useEffect(() => {
    dispatch(appointmentNote(id));
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.session.title}
        onBackPress={() => navigation.pop()}
        onRightPress={() => navigation.push(NAVIGATION.notification)}
      />
      <Loader isLoading={isLoading} />
      <ScrollView
        style={{
          marginHorizontal: moderateScale(15),
          marginBottom: moderateScale(10),
        }}>
        <View style={styles.section1}>
          <View
            style={{
              flex: 0.3,
            }}>
            <Image source={photo} />
          </View>
          <View style={{flex: 0.7}}>
            <Text style={styles.noteName}>{name}</Text>
          </View>
        </View>
        <Text style={styles.sessionText}>{strings.session.sessionDetails}</Text>
        <View style={styles.detailsView}>
          <Image source={IMAGES.icons.session.timeIcon} />
          <Text style={styles.timeText}>{startTime}</Text>
        </View>
        <View style={styles.detailsView}>
          <Image source={IMAGES.icons.session.calendarIcon} />
          <Text style={styles.timeText}>{date}</Text>
        </View>
        <View style={styles.detailsView}>
          <Image source={IMAGES.icons.session.completed} />
          <Text style={styles.timeText}>{status}</Text>
        </View>
        <View style={styles.hrline} />
        {/* <Text style={styles.sessionText}>{strings.session.note}</Text>
        <View style={{flex: 1}}>
          <Text style={styles.noteText}>{appointment?.note?.summary}</Text>
        </View> */}
      </ScrollView>
    </View>
  );
}
