import React, {useState, useEffect} from 'react';
import {
  listFeedbackQuestions,
  cancelEncounter
} from '@/actions/AppointmentAction';

import {AppointmentController} from '@/controllers';
import CircularProgress from 'react-native-circular-progress-indicator';
import {
  View,
  Text,
  Modal,
  Platform,
  TouchableOpacity,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import {
  AppHeader,
  Image,
  TextArea,
  Loader,
  TextField,
  ErrorView,
  DateTimePicker,
  TextView,
  Button,
  Icon,
} from '@/components';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {strings} from '@/localization';
import {IMAGES} from '@/assets';
import {moderateScale} from '@/hooks/scale';
import {NAVIGATION} from '@/constants';
import {styles} from '@/screens/WaitingTimer/WaitingTimer.styles';
import jwt_decode from 'jwt-decode';
import {AuthHelper, NavigationHelper, Validate} from '@/helpers';
import {useDispatch, useSelector} from 'react-redux';
import {useSession} from '@/hooks/zoom';
import {colors} from '@/theme';
import {Fonts} from '@/assets';
export function WaitingTimer({navigation, route}) {
  // route contains the encounter for the appointment.
  const [encounter, setEncounter] = useState(route.params);
  const [showJoin, setShowJoin] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [practitioner, setPracitioner] = useState('');
  const [topic, setTopic] = useState('');
  const [pwd, setPwd] = useState('');
  const {sessionName, sessionIdleTimeoutMins} = useSession();
  const dispatch = useDispatch();
  let roleType = 0;
  let displayName = AuthHelper.getUserName();

  const wsUrl = `wss://api-queue.dev.ca.florizelhealth.com?token=${AuthHelper.getAccessToken()}&organizationId=${route?.params?.orgId}&scopeOfPractice=${encodeURIComponent(JSON.stringify([route?.params?.patientLocation]))}`
  
  // websocket is generated this way, so in case of it disconnecting during idleness, it might re-connect
  const wsConnect = (url) => {
    // console.log(url); 
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("WebSocket connection opened successfully");
    };
    ws.onmessage = (event) => {

      let parsed = JSON.parse(event.data); // event.data is pushed as a string so it must be parsed into a JSON object
      
      if(parsed.patientId == AuthHelper.getPatientId()) { // this is a message pushed concerning the current patient
        if(parsed.messageType == "REMOVE") {
          // this means the zoom session has been lauched, do a GET to get the session token, using pollData without an interval timer
          pollData(null, ws);
        }
      }
    }
    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      if(event.code == 1001)  {
        console.log("Websocket closed due to idleness, retry");
        setTimeout(() => wsConnect(url), 1000);
      }
    };

    ws.onerror = (error) => {
        console.error("WebSocket encountered an error:", error);
    };

    return ws;
  }


  useEffect(() => {
      setEncounter(route?.params);
      //console.log(wsUrl); 
      let connectedWS = wsConnect(wsUrl);
      return () =>{ 
        if (connectedWS)  connectedWS.close();
      }    
    }, []
  );

  const pollData = async (timer = null, ws = null) => {
    // check for a jwt token on the encounter
    const encounterUpdated =  await AppointmentController.getEncounter(encounter);
    if(encounterUpdated?.data?.sessionToken) {
      // this is an active zoom session, create a join button
      setShowJoin(true);
      if(timer) clearInterval(timer);
      if(ws) ws.close();

      setSessionToken(encounterUpdated.data.sessionToken);
      let decoded = jwt_decode(encounterUpdated.data.sessionToken);
      setTopic(decoded.tpc);
      setPwd(decoded.password);
    }
    setEncounter(encounterUpdated.data);
  }

  const onClickJoin = () => {
    //dispatch(listFeedbackQuestions('survey'));                                                        
    NavigationHelper.hideNavigation(navigation);
    navigation.navigate(NAVIGATION.vedioCall, {
        sessionToken,
        displayName,
        sessionPwd: pwd,
        roleType,
        sessionIdleTimeoutMins,
        sessionTopic: topic,
        encounter
    });
  }

  const onClickCancel = () => {

    Alert.alert('Cancel', 'Are you sure you want to cancel this visit?', [
      {
        text: 'Ok',
        onPress: () => {
          dispatch(cancelEncounter(encounter)).then(result => {
            // console.log(result);
            navigation.navigate(NAVIGATION.dashboard);
          });
        }
      },
      {
        text: 'Cancel',
        onPress: () => __DEV__ && console.log('Cancel Pressed'),
      },
    ]);



  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <AppHeader
        customTextStyle={styles.customTitle}
        //title={strings.requestGuidance.title}
        title={'If urgent symptoms, please call 911'}
        color={colors.PRIMARY_BLUE}
        onBackPress={() => navigation.pop()}
        onRightPress={() => navigation.push(NAVIGATION.notification)}
      />
      <View
        style={{
          paddingVertical: moderateScale(10),
          paddingHorizontal: moderateScale(25),
          alignItems: 'center',
        }}>
        { !showJoin &&
        <>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon style={{marginRight: moderateScale(10)}} name="clock" />
          <TextView
            title={strings.disease.approxText}
            textStyle={styles.header}
          />
        </View>

        <View style={{marginVertical: moderateScale(20)}} >
            <CircularProgress
              value={60}
              radius={120}
              //duration={2000}
              progressValueColor={colors.DARK_BLUE}
              progressValueStyle={{
                fontFamily: Fonts.medium,
                fontSize: moderateScale(40),
              }}
              maxValue={120}
              title={'min'}
              titleColor={'rgba(18, 31, 72, 0.37)'}
              titleStyle={{
                fontFamily: Fonts.regular,
                fontSize: moderateScale(20),
              }}
              activeStrokeColor={'#DCE1E4'}
              inActiveStrokeColor={colors.PRIMARY_BLUE}
            />
          </View> 
          <TextView
            color={colors.DARK_BLUE}
            title={'There are 5 people ahead of you'}
            textStyle={styles.personCount}
          />
          <TextView
            color={'rgba(0, 0, 0, 0.43)'}
            title={strings.disease.waitingNote}
            textStyle={styles.note}
          />
          <TouchableOpacity onPress={() => onClickCancel()} style={styles.btn}>
            <Text style={styles.btnText2}>
              {strings.waitingRoom.cancelRequest}
            </Text>
          </TouchableOpacity>
          </>
        }
        { showJoin && 
          <>
          <TextView
            title={strings.disease.sessionReady}
            textStyle={styles.header}
          />
          <View style={styles.btnSection}>
          <Button
                title={strings.session.join}
                style={styles.btn2}
                textStyle={styles.btnText}
                onPress={() => onClickJoin()}
            />
          </View>
          </>
        }
      </View>
    </View>
  );
}
