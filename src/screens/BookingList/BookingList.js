import {TYPES} from '@/actions/ManualReadingsActions';
import {IMAGES} from '@/assets';
import {AppHeader, Loader, ParentContainer, TextView} from '@/components';
import {NAVIGATION} from '@/constants';
import {strings} from '@/localization';
import {styles} from '@/screens/BookingList/BookingList.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  rescheduleAppointmentError,
  getCareQuestionList,
  getCareQuestionListWR,
  setQuestionnaireList,
  setQuestionnaireListWR,
} from '@/actions/AppointmentAction';
import {organizationDetails} from '@/actions/ProfileActions';
import {BookingItem} from '@/components/BookingItem';
export function BookingList({navigation, route}) {
  const dispatch = useDispatch();
  const userLoading = useSelector(state => state.user.loader);
  const {questionnaireData,questionnaireDataWR} = useSelector(state => state.appointment);
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.LIST_DEVICES], state),
  );
  const [showLoader, setShowLoader] = useState(false);
  const {profile} = useSelector(state => state);
  const {user} = useSelector(state => state);
  const [waitngRoom, setWaitingRoom] = useState();
  const [orgId, setOrgId] = useState(user?.user?.orgId);

  useEffect(() => {
    dispatch(
      organizationDetails(orgId, res => {
        setWaitingRoom(res?.data?.isWaitingRoom);
        if(res?.data?.assignedQuestionnaire){
          if('getcare-appointment' in res?.data?.assignedQuestionnaire){
          dispatch(getCareQuestionList(res?.data?.assignedQuestionnaire['getcare-appointment']));
          }else{
            dispatch(setQuestionnaireList({getCareQuestionnaire: []}),);
          }
          if('getcare-waitingroom' in res?.data?.assignedQuestionnaire){
            dispatch(getCareQuestionListWR(res?.data?.assignedQuestionnaire['getcare-waitingroom']));
            }else{
              dispatch(setQuestionnaireListWR({getCareQuestionnaire: []}),);
            }
        }{
          dispatch(setQuestionnaireList({getCareQuestionnaire: []}),);
          dispatch(setQuestionnaireListWR({getCareQuestionnaire: []}),);
        }
      }),
    );
    dispatch(rescheduleAppointmentError({}));
  }, []);

  useEffect(() => {
    setShowLoader(userLoading);
  }, [userLoading]);

  const list = [];


  let licensedProduct = profile.licensedProduct;
  if (waitngRoom == true && licensedProduct?.virtualCare) {
    list.push(
      {
        title: 'Book an appointment',
        logo: IMAGES.icons.home.calender,
        color: 'white',
        onPress: async () => {
          if (
            questionnaireData?.getCareQuestionnaire &&
            questionnaireData.getCareQuestionnaire.some(questionnaire => questionnaire !== undefined)
          ) {
            navigation.push(NAVIGATION.questionnaire, {
              type: 'booking',
            });
          } else {
            navigation.push(NAVIGATION.getCareForm);
          }          
        },
      },
      {
        title: 'As soon as possible',
        logo: IMAGES.icons.home.time,
        color: 'white',
        //   onPress: () => navigation.push(NAVIGATION.enterWaitingRoom),
        onPress: async () => {
          {
            if (
              questionnaireDataWR?.getCareQuestionnaireWR &&
              questionnaireDataWR?.getCareQuestionnaireWR.some(questionnaire => questionnaire !== undefined)
            ) {
              navigation.push(NAVIGATION.questionnaireWR, {
                type: 'asap',
              });
            } else {
              navigation.push(NAVIGATION.enterWaitingRoom);
            }
          }
        },
      },
    );
  } else {
    list.push({
      title: 'Book an appointment',
      logo: IMAGES.icons.home.calender,
      color: 'white',
      onPress: () => {
        if (
          questionnaireData?.getCareQuestionnaire &&
          questionnaireData.getCareQuestionnaire.some(questionnaire => questionnaire !== undefined)
        ) {
          navigation.push(NAVIGATION.questionnaire, {
            type: 'booking',
          });
        } else {
          navigation.push(NAVIGATION.getCareForm);
        }
      },
    });
  }

  return (
    <View style={styles.container}>
      <AppHeader
        onBackPress={() => navigation.pop()}
        onRightPress={() => navigation.push(NAVIGATION.notification)}
      />
      <Loader isLoading={showLoader} />
      <ParentContainer>
        <View>
          <View>
            <TextView
              title={strings.bookingList.header}
              textStyle={styles.header}
            />
            <FlatList
              data={list}
              renderItem={({item, key}) => {
                return (
                  <>
                    <View key={key}>
                      <BookingItem
                        title={item.title}
                        firstImage={item.logo}
                        lastImage={IMAGES.icons.vitals.forwardArrow}
                        onContainerPress={item.onPress}
                        lastImagePress={item.onPress}
                        containerColor={item.color}
                        containerStyle={styles.menuContainer}
                        titleContainerStyle={styles.titleContainer}
                        titleTextStyle={styles.listTxt}
                      />
                    </View>
                  </>
                );
              }}
            />
          </View>
        </View>
      </ParentContainer>
    </View>
  );
}
