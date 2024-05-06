import {TYPES} from '@/actions/ManualReadingsActions';
import {
  notificationListing,
  notificationReply,
} from '@/actions/NotificationActions';
import {profileSelect} from '@/actions/ProfileActions';
import {IMAGES} from '@/assets';
import {AppHeader, Loader, ParentContainer, TextView} from '@/components';
import {NAVIGATION, USER_TYPES} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/GetCare/GetCare.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {colors} from '@/theme';
import {useEffect, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function GetCare({navigation, route}) {
  const manualReadings = useSelector(state => state.manualReadings);
  const DEVICE_LIST = manualReadings?.deviceList?.device;
  const [list, setList] = useState([]);
  const {profile, notification} = useSelector(state => state);
  const userId = AuthHelper.getUserId();
  const userType = AuthHelper.getUserType();
  const dispatch = useDispatch();
  const patientId = AuthHelper.getPatientId();

  // const list = [
  //   {
  //     title: 'John',
  //     secondTitle:'Self',
  //     onPress: () => navigation.push(NAVIGATION.bloodPressure),
  //   },
  //   {
  //     title: 'Alex',
  //     secondTitle:'Father',
  //     onPress: () => navigation.push(NAVIGATION.oxiMeter),
  //   },
  //   {
  //     title: 'Emania',
  //     secondTitle:'Daughter',
  //     onPress: () => navigation.push(NAVIGATION.heartRate),
  //   },
  //   {
  //     title: 'Jack',
  //     secondTitle:'Son',
  //     onPress: () => navigation.push(NAVIGATION.weight),
  //   },

  // ];
  const isLoading = useSelector(state =>
    isLoadingSelector(
      [TYPES.NOTIFICATION_LISTING, TYPES.NOTIFICATION_REPLY],
      state,
    ),
  );
  // const isLoading = useSelector(state =>
  //   isLoadingSelector([TYPES.PROFILE_RELATED_PERSON], state),
  // );
  useEffect(() => {
    // dispatch(profileRelatedPerson(null));
    dispatch(notificationListing(patientId));
  }, []);

  useEffect(() => {
    setList(profile?.relatedPerson ?? []);
  }, [profile]);

  const selectProfile = id => {
    dispatch(profileSelect({id}));
  };

  const update = (item, type) => {
    let request = {
      notificationId: item.notificationId,
      patientId: item.id,
      isAnswered: true,
    };
    let updateNotification = {
      id: item.id,
      patientRefId: item.patientRefId,
      active: true,
    };
    if (!type)
      dispatch(
        profileDeleteRelative(
          Validate.encryptInput({id: item.id, userId: item.patientRefId}),
        ),
      );
    else dispatch(profileUpdateInvitation(updateNotification));
    dispatch(notificationReply(Validate.encryptInput(request)));
  };

  const Notification = () => {
    return (
      <View style={styles.listContainerNot}>
        <FlatList
          data={notification.list}
          renderItem={({item}) => {
            if (!userType.includes(USER_TYPES.patient)) {
              return (
                <View style={styles.contentContainer}>
                  <View style={styles.msgContainer}>
                    <TextView title={item.message} textStyle={styles.msgTxt} />
                  </View>
                  <TextView
                    title={moment(item.timestamp).format('H:mm:s')}
                    textStyle={styles.timeTxt}
                    viewStyle={styles.timeContainer}
                  />
                  {!item.isAnswered && (
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
                </View>
              );
            } else {
              return <></>;
            }
          }}
          // ListEmptyComponent={
          //   !isLoading && <View style={styles.empty}>
          //     <TextView title={'0 Notification(s)'} />
          //   </View>
          // }
          keyExtractor={item => item.notificationId}
        />
      </View>
    );
  };

  const HeaderComponent = () => {
    if (userType.includes(USER_TYPES.patient)) {
      return (
        <TouchableOpacity
          style={styles.listContainer}
          onPress={() => navigation.push(NAVIGATION.bookingList)}>
          <TextView
            title={strings.dependent.self}
            textStyle={styles.relationship}
            color={colors.PRIMARY_BLUE}
            viewStyle={{flex: 0.4}}
          />
          <TextView
            title={strings.dependent.self}
            textStyle={styles.relationship}
            viewStyle={{flex: 0.4}}
          />
          {userId == profile.selectedProfile?.id ? (
            <Image source={IMAGES.icons.radioChecked} />
          ) : (
            <Image source={IMAGES.icons.radio} />
          )}
        </TouchableOpacity>
      );
    } else {
      return <></>;
    }
  };
  const showDependent = ({key, item}) => {
    return (
      <TouchableOpacity
        key={key}
        style={styles.listContainer}
        onPress={() => {
          selectProfile(item.id);
          navigation.push(NAVIGATION.bookingList);
        }}>
        <TextView
          title={`${item.name[0].given[0]}`}
          numLines={1}
          viewStyle={{flex: 0.4}}
          textStyle={styles.relationship}
          color={colors.PRIMARY_BLUE}
        />
        <TextView
          viewStyle={{flex: 0.4}}
          title={item.relationship}
          textStyle={styles.relationship}
        />
        {item.patientRefId == profile.selectedProfile?.id ? (
          <Image source={IMAGES.icons.radioChecked} />
        ) : (
          <Image source={IMAGES.icons.radio} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.getCare.whoVisitFor}
        onBackPress={() => navigation.pop()}
        onRightPress={() => navigation.push(NAVIGATION.notification)}
      />
      <Loader isLoading={isLoading} />
      <ParentContainer>
        <View>
          <View>
            {/* <FlatList
                data={list}
                extraData={list}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, key) => key}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={styles.listContainer}
                      onPress={() => navigation.push(NAVIGATION.bookingList)}>
                      <View style={styles.listImgContainer}>
                      <TextView
                          title={item.title}
                          textStyle={styles.textTitle}
                          color={colors.PRIMARY_BLUE}
                        />
                      </View>
                      <View style={styles.listTextContainer}>
                        <TextView
                          title={item.secondTitle}
                          textStyle={styles.listTxt}
                        />
                      </View>
                      <Image source={IMAGES.bluetooth.uncheckedCircle} />
                    </TouchableOpacity>
                  );
                }}
              /> */}
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                marginTop: moderateScale(10),
                paddingBottom: moderateScale(160),
              }}
              data={list}
              renderItem={showDependent}
              ListHeaderComponent={<HeaderComponent />}
              keyExtractor={item => item.updatedAt}
              ListEmptyComponent={<Notification />}
            />
          </View>
        </View>
      </ParentContainer>
    </View>
  );
}
