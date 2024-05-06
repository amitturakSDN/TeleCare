import {
  TYPES,
  notificationListing,
  notificationReply,
} from '@/actions/NotificationActions';
import {
  profileDeleteRelative,
  profileUpdateInvitation,
} from '@/actions/ProfileActions';
import {IMAGES} from '@/assets';
import {AppHeader, Loader, TextView} from '@/components';
import {AuthHelper, Validate} from '@/helpers';
import {strings} from '@/localization';
import {styles} from '@/screens/Notification/Notification.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {colors} from '@/theme';
import moment from 'moment';
import {useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';

export function Notification({navigation}) {
  const dispatch = useDispatch();
  const {notification} = useSelector(state => state);
  const patientId = AuthHelper.getPatientId();
  const isLoading = useSelector(state =>
    isLoadingSelector(
      [TYPES.NOTIFICATION_LISTING, TYPES.NOTIFICATION_REPLY],
      state,
    ),
  );
  useEffect(() => {
    dispatch(notificationListing(patientId));
  }, []);

    /**
   * Message that has utc time will have the time converted to local time of the user
   *
   * @param {string} message - Originally the Notification message
   * @returns {string} The message is returned with utc time converted to local time(if present)
   */
  const withLocalTime = (message) => {
    let pattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/;
    let matches = message?.match(pattern);
    if(matches){
      let localTime = moment(matches[0]).format("YYYY-MM-DD HH:mm");
      message = message.replace(pattern, localTime);
    }
    return message;
  }

  // will mark a notification as "Read" = true
  const markAsRead = item => {
    let request = {
      notificationId: item.notificationId,
      patientId: item.id,
      markAsRead: true,
    };
    dispatch(notificationReply(Validate.encryptInput(request)));
  };
  const update = (item, type) => {
    let request = {
      notificationId: item.notificationId,
      patientId: item.id,
      isAnswered: true,
      status: type,
    };
    let updateNotification = {
      id: item.id,
      patientRefId: item.patientRefId,
      active: true,
    };
    if (!type && !item.relative?.id)
      dispatch(
        profileDeleteRelative(
          Validate.encryptInput({id: item.id, userId: item.patientRefId}),
        ),
      );
    else
      !item.relative?.id
        ? dispatch(profileUpdateInvitation(updateNotification))
        : null;
    dispatch(notificationReply(Validate.encryptInput(request)));
  };
  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading} />
      <AppHeader
        title={strings.notification.title}
        onBackPress={() => navigation.pop()}
        rightIcon={IMAGES.icons.drawerMenu.settings}
        showRightIcon={false}
      />
      <View style={styles.listContainer}>
        <FlatList
          data={notification.list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View style={styles.contentContainer}>
                <TouchableOpacity
                  onPress={() => (!item.markAsRead ? markAsRead(item) : null)}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.msgContainer}>
                      {!item.markAsRead && item.active && (
                        // if unread and active a blue dot appears beside the
                        // if you click that area, it will mark the notifications as
                        // read, and the button will disappear
                        <View
                          style={[styles.unreadIndicator, {flex: 0.03}]}></View>
                      )}
                      <TextView
                        title={withLocalTime(item.message)}
                        textStyle={styles.msgTxt}
                        viewStyle={{flex: 0.97}}
                      />
                    </View>
                  </View>
                  <TextView
                    title={moment(item.timestamp).format(
                      'MM/DD/YYYY  hh:mm:ss A',
                    )}
                    textStyle={styles.timeTxt}
                    viewStyle={styles.timeContainer}
                  />

                  {!item.isAnswered && item.type === 'accept/reject' && (
                    <View style={styles.btnContainer}>
                      <TouchableOpacity
                        onPress={() => update(item, true)}
                        style={styles.acceptContainer}>
                        <TextView
                          title={strings.notification.accept}
                          color={colors.WHITE}
                          textStyle={styles.acceptTxt}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => update(item, false)}
                        style={styles.rejectBtnContainer}>
                        <TextView
                          title={strings.notification.reject}
                          color={colors.WHITE}
                          textStyle={styles.acceptTxt}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={[styles.separator]} />
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.empty}>
                <TextView title={'0 Notification(s)'} />
              </View>
            )
          }
          keyExtractor={item => item.notificationId}
        />
      </View>
    </View>
  );
}