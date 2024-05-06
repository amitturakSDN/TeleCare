import React, {useEffect, useRef, useState} from 'react';
import {} from 'react-native-gesture-handler';
import {useAnimatedStyle, useSharedValue, Easing, withTiming} from 'react-native-reanimated';
import {useIsMounted} from '@/hooks/mount';
import {VideoView, Icon, TextView, ChatList} from '@/components';
import LinearGradient from 'react-native-linear-gradient';
import {Validate, NavigationHelper} from '@/helpers';
import {
    EventType,
    useZoom,
    ZoomVideoSdkUser,
    ZoomVideoSdkChatMessage,
    ShareStatus,
    RecordingStatus,
    Errors,
    VideoPreferenceMode,
    LiveTranscriptionStatus,
    MultiCameraStreamStatus,
    SystemPermissionType,
    NetworkStatus,
} from '@zoom/react-native-videosdk';
import {generateJwt} from '@/helpers';
import {
    Text,
    Image,
    TouchableOpacity,
    Pressable,
    View,
    FlatList,
    ActionSheetIOS,
    StyleSheet,
    useWindowDimensions,
    StatusBar,
    SafeAreaView,
    Animated,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import {moderateScale} from '@/hooks/scale';
import {
    TYPES,
    listUpcomingAppointment,
    listRequestedAppointment,
    listCompletedAppointment,
    appointmentNote,
    cancelAppointment,
    rescheduleAppointment,
    updateAppointment,
    finishEncounter,
} from '@/actions/AppointmentAction';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import FeedbackModel from '@/components/FeedbackModel';
import {NAVIGATION} from '@/constants';
import {organizationDetails} from '@/actions/ProfileActions';
export function VedioCall({navigation, route}) {
    const dispatch = useDispatch('');
    const {user} = useSelector(state => state);
    const feedBackQuestionList = [useSelector(state => state.appointment.listFeedbackQuetions)];
    const {selected} = useSelector(state => state.appointment);
    const {profile} = useSelector(state => state);
    let licensedProduct = profile.licensedProduct;
    const [satisfactionSurvey, setSatisfactionSurvey] = useState();
    const [mandatoryField, setMandatoryField] = useState();
    const [orgId, setOrgId] = useState(user?.user?.orgId);
    const [showChatBox, setShowChatBox] = useState(false);
    const [isInSession, setIsInSession] = useState(false);
    const [sessionName, setSessionName] = useState('');
    const [users, setUsersInSession] = useState([]);
    const [fullScreenUser, setFullScreenUser] = useState([]);
    const [sharingUser, setSharingUser] = useState();
    const [videoInfo, setVideoInfo] = useState('');
    const [newName, setNewName] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [contentHeight, setContentHeight] = useState('100%');
    const [isSharing, setIsSharing] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);
    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
    const [isLongTouch, setIsLongTouch] = useState(false);
    const [isRecordingStarted, setIsRecordingStarted] = useState(false);
    const [isMicOriginalOn, setIsMicOriginalOn] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [feedBackTitle, setFeedbackTitle] = useState('');

    const isLongTouchRef = useRef(isLongTouch);
    const chatInputRef = useRef(null);
    const videoInfoTimer = useRef(0);
    // react-native-reanimated issue: https://github.com/software-mansion/react-native-reanimated/issues/920
    // Not able to reuse animated style in multiple views.
    const uiOpacity = useSharedValue(0);
    const inputOpacity = useSharedValue(0);
    const chatSendButtonScale = useSharedValue(0);
    const isMounted = useIsMounted();
    const zoom = useZoom();
    const windowHeight = useWindowDimensions().height;
    const [refreshFlatlist, setRefreshFlatList] = useState(false);
    let touchTimer;
    isLongTouchRef.current = isLongTouch;

    /**Get Thanks Msg dynamicaaly and render on screen */
    useEffect(() => {
        if (feedBackQuestionList && feedBackQuestionList?.length > 0) {
            setFeedbackTitle(feedBackQuestionList[0]?.title);
        }
    }, [feedBackQuestionList]);

    useEffect(() => {
        (async () => {
            const {params} = route;
            //  const token = await generateJwt(params.sessionName, params.roleType);
            //  const token1 =
            //  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJhcHBfa2V5IjoicW44NUlKYW1DWHBvZVhsWnZnSk85ampzazdMM3RKaFAwdjRsIiwicGFzc3dvcmQiOiJDY0MxVXF4eSIsInRwYyI6ImNhc2VfbWFuYWdlcjFAeW9wbWFpbC5jb20iLCJyb2xlX3R5cGUiOjAsInNlc3Npb25fa2V5IjoiY2FzZV9tYW5hZ2VyMUB5b3BtYWlsLmNvbSIsImlhdCI6MTY3OTM5NjUxOSwiZXhwIjoxNjc5NDAzNzE5fQ.flEUUH01ME9bEYseXmWS44WY1UEdBgS8fFxjQUv3JVQ";
            try {
                await zoom.joinSession({
                    sessionName: params.sessionTopic,
                    sessionPassword: params.sessionPwd,
                    token: params.sessionToken,
                    userName: params.displayName,
                    audioOptions: {
                        connect: true,
                        mute: true,
                        autoAdjustSpeakerVolume: true,
                    },
                    videoOptions: {
                        localVideoOn: true,
                    },
                    sessionIdleTimeoutMins: parseInt(params.sessionIdleTimeoutMins, 10),
                });
            } catch (e) {
                __DEV__ && console.log(e);
                Alert.alert(null, 'Failed to join the session');
                setTimeout(() => {
                    NavigationHelper.showNavigation(navigation);
                    let routes = navigation.getState()?.routes;
                    let isWaitingRoomSession = (routes[routes.length - 2]?.key.indexOf("WaitingTimer") >= 0);
                    if(isWaitingRoomSession) {
                        // go to the get care list
                        navigation.navigate(NAVIGATION.dashboard);
                    }
                    else
                        navigation.goBack();
                }, 1000);
            }
        })();
    }, []);
    // organization details fetch
    useEffect(() => {
        dispatch(
            organizationDetails(orgId, res => {
                setSatisfactionSurvey(res?.data?.surveySetting?.satisfactionSurvey);
                setMandatoryField(res?.data?.surveySetting?.survey);
                // setSatisfactionSurvey(false);
                // setMandatoryField('mandatory');
            }),
        );
    }, []);

    // useEffect(() => {
    //   const updateVideoInfo = () => {
    //     videoInfoTimer.current = setTimeout(async () => {
    //       if (!isMounted()) return;

    //       const videoOn = await fullScreenUser?.videoStatus.isOn();

    //       // Video statistic info doesn't update when there's no remote users
    //       if (!fullScreenUser || !videoOn || users.length < 2) {
    //         clearTimeout(videoInfoTimer.current);
    //         setVideoInfo('');
    //         return;
    //       }

    //       const fps = isSharing
    //         ? await fullScreenUser.shareStatisticInfo.getFps()
    //         : await fullScreenUser.videoStatisticInfo.getFps();

    //       const height = isSharing
    //         ? await fullScreenUser.shareStatisticInfo.getHeight()
    //         : await fullScreenUser.videoStatisticInfo.getHeight();

    //       const width = isSharing
    //         ? await fullScreenUser.shareStatisticInfo.getWidth()
    //         : await fullScreenUser.videoStatisticInfo.getWidth();

    //       setVideoInfo(`${width}x${height} ${fps}FPS`);
    //       updateVideoInfo();
    //     }, 1000);
    //   };

    //   updateVideoInfo();

    //   return () => clearTimeout(videoInfoTimer.current);
    // }, [fullScreenUser, users, isMounted, isSharing]);

    useEffect(() => {
        const sessionJoinListener = zoom.addListener(EventType.onSessionJoin, async session => {
            // console.log(session, 'zooom.......onSessionJoin');
            setIsInSession(true);
            toggleUI();
            zoom.session.getSessionName().then(setSessionName);
            const mySelf = new ZoomVideoSdkUser(session.mySelf);
            // console.log(mySelf, 'mySelf.......');
            const remoteUsers = await zoom.session.getRemoteUsers();
            const muted = await mySelf.audioStatus.isMuted();
            const videoOn = await mySelf.videoStatus.isOn();
            const speakerOn = await zoom.audioHelper.getSpeakerStatus();
            setUsersInSession([mySelf, ...remoteUsers]);
            //setUsersInSession([...remoteUsers]);
            setIsMuted(muted);
            setIsVideoOn(videoOn);
            setIsSpeakerOn(speakerOn);
            setFullScreenUser(mySelf);
        });

        const sessionLeaveListener = zoom.addListener(EventType.onSessionLeave, () => {
            setIsInSession(false);
            setUsersInSession([]);
            // navigation.goBack();
            
            NavigationHelper.showNavigation(navigation);

            Alert.alert(null, 'Your Session has been ended', [
                {
                    text: 'OK',
                    onPress: () => {
                        feedbackModelPress();
                        getAllList();
                    },
                },
            ]);
        });

        const sessionNeedPasswordListener = zoom.addListener(
            EventType.onSessionNeedPassword,
            () => {
                Alert.alert('SessionNeedPassword');
            },
        );

        const sessionPasswordWrongListener = zoom.addListener(
            EventType.onSessionPasswordWrong,
            () => {
                Alert.alert('SessionPasswordWrong');
            },
        );
        const userVideoStatusChangedListener = zoom.addListener(
            EventType.onUserVideoStatusChanged,
            async ({changedUsers}) => {
                const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
                changedUsers.map(u => {
                    if (mySelf.userId === u.userId) {
                        mySelf.videoStatus.isOn().then(on => setIsVideoOn(on));
                    }
                });
            },
        );
        const userAudioStatusChangedListener = zoom.addListener(
            EventType.onUserAudioStatusChanged,
            async ({changedUsers}) => {
                const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
                changedUsers.map(u => {
                    if (mySelf.userId === u.userId) {
                        mySelf.audioStatus.isMuted().then(muted => setIsMuted(muted));
                    }
                });
            },
        );

        const userJoinListener = zoom.addListener(EventType.onUserJoin, async ({remoteUsers}) => {
            if (!isMounted()) return;
            const mySelf = await zoom.session.getMySelf();
            const remote = remoteUsers.map(user => new ZoomVideoSdkUser(user));
            setUsersInSession([mySelf, ...remote]);
            //setUsersInSession([...remote]);
        });

        const userLeaveListener = zoom.addListener(
            EventType.onUserLeave,
            async ({remoteUsers, leftUsers}) => {
                if (!isMounted()) return;
                const mySelf = await zoom.session.getMySelf();
                const remote = remoteUsers.map(user => new ZoomVideoSdkUser(user));
                if (fullScreenUser) {
                    leftUsers.map(user => {
                        if (fullScreenUser.userId === user.userId) {
                            setFullScreenUser(mySelf);
                            return;
                        }
                    });
                } else {
                    setFullScreenUser(mySelf);
                }
                // console.log(remote, 'Event.......onUserLeave........');
                setUsersInSession([mySelf, ...remote]);
            },
        );

        const userNameChangedListener = zoom.addListener(
            EventType.onUserNameChanged,
            async ({changedUser}) => {
                setUsersInSession(
                    users.map(u => {
                        if (u && u.userId === changedUser.userId) {
                            return new ZoomVideoSdkUser(changedUser);
                        }
                        return u;
                    }),
                );
            },
        );

        const userShareStatusChangeListener = zoom.addListener(
            EventType.onUserShareStatusChanged,
            async ({user, status}) => {
                const shareUser = new ZoomVideoSdkUser(user);
                const mySelf = await zoom.session.getMySelf();

                if (user.userId && status === ShareStatus.Start) {
                    setSharingUser(shareUser);
                    setFullScreenUser(shareUser);
                    setIsSharing(shareUser.userId === mySelf.userId);
                } else {
                    setSharingUser(undefined);
                    setIsSharing(false);
                }
            },
        );

        const commandReceived = zoom.addListener(EventType.onCommandReceived, params => {
            console.log('sender: ' + params.sender + ', command: ' + params.command);
        });

        const chatNewMessageNotify = zoom.addListener(
            EventType.onChatNewMessageNotify,
            newMessage => {
                if (!isMounted()) return;
                setChatMessages([new ZoomVideoSdkChatMessage(newMessage), ...chatMessages]);
            },
        );

        const chatDeleteMessageNotify = zoom.addListener(
            EventType.onChatDeleteMessageNotify,
            params => {
                console.log(
                    'onChatDeleteMessageNotify: messageID: ' +
                        params.messageID +
                        ', deleteBy: ' +
                        params.deleteBy,
                );
            },
        );

        const liveStreamStatusChangeListener = zoom.addListener(
            EventType.onLiveStreamStatusChanged,
            ({status}) => {
                console.log(`onLiveStreamStatusChanged: ${status}`);
            },
        );

        const liveTranscriptionStatusChangeListener = zoom.addListener(
            EventType.onLiveTranscriptionStatus,
            ({status}) => {
                console.log(`onLiveTranscriptionStatus: ${status}`);
            },
        );

        const cloudRecordingStatusListener = zoom.addListener(
            EventType.onCloudRecordingStatus,
            ({status}) => {
                console.log(`cloudRecordingStatusListener: ${status}`);
                if (status === RecordingStatus.Start) {
                    setIsRecordingStarted(true);
                } else {
                    setIsRecordingStarted(false);
                }
            },
        );

        const networkStatusChangeListener = zoom.addListener(
            EventType.onUserVideoNetworkStatusChanged,
            async ({user, status}) => {
                const networkUser = new ZoomVideoSdkUser(user);
                if (status == NetworkStatus.Bad) {
                    console.log(
                        'onUserVideoNetworkStatusChanged: status= ${status}, user= ${networkUser.userName}',
                    );
                }
            },
        );

        const inviteByPhoneStatusListener = zoom.addListener(
            EventType.onInviteByPhoneStatus,
            params => {
                console.log(params);
                console.log('status: ' + params.status + ', reason: ' + params.reason);
            },
        );

        const multiCameraStreamStatusChangedListener = zoom.addListener(
            EventType.onMultiCameraStreamStatusChanged,
            ({status, changedUser}) => {
                users.map(u => {
                    if (changedUser.userId === u.userId) {
                        if (status === MultiCameraStreamStatus.Joined) {
                            u.hasMultiCamera = true;
                        } else if (status === MultiCameraStreamStatus.Left) {
                            u.hasMultiCamera = false;
                        }
                    }
                });
            },
        );

        const requireSystemPermission = zoom.addListener(
            EventType.onRequireSystemPermission,
            ({permissionType}) => {
                switch (permissionType) {
                    case SystemPermissionType.Camera:
                        Alert.alert(
                            "Can't Access Camera",
                            'please turn on the toggle in system settings to grant permission',
                        );
                        break;
                    case SystemPermissionType.Microphone:
                        Alert.alert(
                            "Can't Access Camera",
                            'please turn on the toggle in system settings to grant permission',
                        );
                        break;
                }
            },
        );

        const eventErrorListener = zoom.addListener(EventType.onError, async error => {
            __DEV__ && console.log('Error: ' + JSON.stringify(error));
            // Alert.alert('Error: ' + error.error);
            __DEV__ && console.log('Error: ' + JSON.stringify(error));
            // Alert.alert('Error: ' + error.error);
            switch (error.errorType) {
                case Errors.SessionJoinFailed:
                    alert('Failed to join the session');
                    setTimeout(() => {
                        NavigationHelper.showNavigation(navigation);
                        let routes = navigation.getState()?.routes;
                        let isWaitingRoomSession = (routes[routes.length - 2]?.key.indexOf("WaitingTimer"));
                        if(isWaitingRoomSession) {
                            // go to the get care list
                            navigation.navigate(NAVIGATION.dashboard);
                        }
                        else
                            navigation.goBack();
                    }, 1000);
                    break;
                case Errors.SessionNotStarted:
                    alert('Session has not been started yet');
                    setTimeout(() => {
                        NavigationHelper.showNavigation(navigation);
                        let routes = navigation.getState()?.routes;
                        let isWaitingRoomSession = (routes[routes.length - 2]?.key.indexOf("WaitingTimer"));
                        if(isWaitingRoomSession) {
                            // go to the get care list
                            navigation.navigate(NAVIGATION.dashboard);
                        }
                        else
                            navigation.goBack();
                    }, 1000);
                    break;
                case Errors.SessionDisconncting:
                    /**Commenting code as multiple alert are triggering for end session onLeave event already triggered. */
                    // alert('Session has been ended');

                    // Alert.alert(null, 'Your Session has been ended', [
                    //   {
                    //     text: 'OK',
                    //     onPress: () => {
                    //       getAllList();
                    //       NavigationHelper.showNavigation(navigation);
                    //       feedbackModelPress();
                    //     },
                    //   },
                    // ]);
                    // setTimeout(() => {
                    //   NavigationHelper.showNavigation(navigation);
                    //   feedbackModelPress();
                    // }, 1000);
                    break;
                default:
            }
        });

        return () => {
            sessionJoinListener.remove();
            sessionLeaveListener.remove();
            sessionPasswordWrongListener.remove();
            sessionNeedPasswordListener.remove();
            userVideoStatusChangedListener.remove();
            userAudioStatusChangedListener.remove();
            userJoinListener.remove();
            userLeaveListener.remove();
            userNameChangedListener.remove();
            userShareStatusChangeListener.remove();
            chatNewMessageNotify.remove();
            liveStreamStatusChangeListener.remove();
            cloudRecordingStatusListener.remove();
            inviteByPhoneStatusListener.remove();
            eventErrorListener.remove();
            commandReceived.remove();
            chatDeleteMessageNotify.remove();
            liveTranscriptionStatusChangeListener.remove();
            multiCameraStreamStatusChangedListener.remove();
            requireSystemPermission.remove();
            networkStatusChangeListener.remove();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zoom, route, users, fullScreenUser, isSharing, chatMessages, isMounted]);

    // const keyboardHeightChange = (isOpen, height) => {
    //   if (!isOpen) {
    //     scaleChatSend(false);
    //     chatInputRef.current?.clear();
    //   }
    //   setIsKeyboardOpen(!isOpen);
    //   setContentHeight(windowHeight - height);
    // };

    // onPress event for FlatList since RN doesn't provide container-on-press event
    const onListTouchStart = () => {
        touchTimer = setTimeout(() => {
            setIsLongTouch(true);
        }, 200);
    };

    // onPress event for FlatList since RN doesn't provide container-on-press event
    const onListTouchEnd = event => {
        // Toggle UI behavior
        // - Toggle only when user list or chat list is tapped
        // - Block toggling when tapping on a list item
        // - Block toggling when keyboard is shown
        if (event._targetInst.elementType.includes('Scroll') && isKeyboardOpen) {
            !isLongTouchRef.current && toggleUI();
        }
        clearTimeout(touchTimer);
        setIsLongTouch(false);
    };

    const uiOpacityAnimatedStyle = useAnimatedStyle(() => ({
        opacity: uiOpacity.value,
    }));

    const inputOpacityAnimatedStyle = useAnimatedStyle(() => ({
        opacity: inputOpacity.value,
    }));

    const chatSendButtonScaleAnimatedStyle = useAnimatedStyle(() => ({
        width: 38 * chatSendButtonScale.value,
        marginLeft: 8 * chatSendButtonScale.value,
        transform: [{scale: chatSendButtonScale.value}],
    }));

    const toggleUI = () => {
        const easeIn = Easing.in(Easing.exp);
        const easeOut = Easing.out(Easing.exp);
        uiOpacity.value = withTiming(uiOpacity.value === 0 ? 100 : 0, {
            duration: 300,
            easing: uiOpacity.value === 0 ? easeIn : easeOut,
        });
        inputOpacity.value = withTiming(inputOpacity.value === 0 ? 100 : 0, {
            duration: 300,
            easing: inputOpacity.value === 0 ? easeIn : easeOut,
        });
    };

    const sendChatMessage = async text => {
        chatInputRef.current?.clear();
        await zoom.chatHelper.sendChatToAll(text);
        setChatMessage('');
        // send the chat as a command
        zoom.cmdChannel.sendCommand(null, text);
    };

    const scaleChatSend = show => {
        const easeIn = Easing.in(Easing.exp);
        const easeOut = Easing.out(Easing.exp);
        chatSendButtonScale.value = withTiming(show ? 1 : 0, {
            duration: 500,
            easing: show ? easeIn : easeOut,
        });
    };

    const deleteChatMessage = async (msgId, message) => {
        const canBeDelete = await zoom.chatHelper.canChatMessageBeDeleted(msgId);
        if (canBeDelete === true || msgId == null) {
            const error = await zoom.chatHelper.deleteChatMessage(msgId);
            if (error === Errors.Success) {
                const chatIndex = chatMessages.indexOf(message);
                chatMessages.splice(chatIndex, 1);
                setRefreshFlatList(!refreshFlatlist);
            } else {
                Alert.alert(error);
            }
        } else {
            Alert.alert('Message could not be deleted');
        }
    };

    const endUserSession = () => {
        /**API to update appointment status */
        let params = {
            encounterId: selected?.encounterId,
            id: selected?.id,
            status: 'completed',
            patientId: selected?.patientId,
            practitionerId: selected?.practitionerId,
            sessionToken: '',
        };

        if(params.id && params.encounterId) {
            dispatch(updateAppointment(params));
            dispatch(finishEncounter(selected?.encounterId, {status: 'finished'}));
        }
        else if(route.params?.encounter?.id) {
            // if a virtual waiting room, there is no appointment, only finish the encounter
            dispatch(finishEncounter(route.params?.encounter?.id, {status: 'finished'}));
        }
    };

    const leaveSession = endSession => {
        NavigationHelper.showNavigation(navigation);
        //  alert('Your Session has been ended');
        
        Alert.alert(null, 'Your Session has been ended', [
            {
                text: 'OK',
                onPress: () => {
                    zoom.leaveSession(endSession);
                    endUserSession();
                    feedbackModelPress();
                    getAllList();
                },
            },
        ]);

        //
        // navigation.goBack();
        //  feedbackModelPress();
    };

    const onPressAudio = async () => {
        const mySelf = await zoom.session.getMySelf();
        const muted = await mySelf.audioStatus.isMuted();
        setIsMuted(muted);
        muted
            ? await zoom.audioHelper.unmuteAudio(mySelf.userId)
            : await zoom.audioHelper.muteAudio(mySelf.userId);
    };

    const onPressVideo = async () => {
        const mySelf = await zoom.session.getMySelf();
        const videoOn = await mySelf.videoStatus.isOn();
        setIsVideoOn(videoOn);
        videoOn ? await zoom.videoHelper.stopVideo() : await zoom.videoHelper.startVideo();
    };

    const onPressShare = async () => {
        const isOtherSharing = await zoom.shareHelper.isOtherSharing();
        const isShareLocked = await zoom.shareHelper.isShareLocked();

        if (isOtherSharing) {
            Alert.alert('Other is sharing');
        } else if (isShareLocked) {
            Alert.alert('Share is locked by host');
        } else if (isSharing) {
            zoom.shareHelper.stopShare();
        } else {
            zoom.shareHelper.shareScreen();
        }
    };

    // feedback model
    const feedbackModelPress = () => {
        // Check if satisfactionSurvey is true
        let routes = navigation.getState()?.routes;
        let isWaitingRoomSession = (routes[routes.length - 2]?.key.indexOf("WaitingTimer") >= 0);
        if (licensedProduct?.virtualCare && satisfactionSurvey === true && !isWaitingRoomSession) {
            setIsModalVisible(true);
        } else {            
            if(isWaitingRoomSession) {
                // go to the get care list
                navigation.navigate(NAVIGATION.dashboard);
            }
            else 
                navigation.goBack();
        }
        // if (satisfactionSurvey === true) {
        //   // If true, show the modal
        //   setIsModalVisible(true);
        // } else {
        //   // Alert.alert(null, 'Your Session has been ended', [
        //   //   {text: 'OK', onPress: () => getAllList()},
        //   // ]);
        //   // If false, go back (assuming navigation.goBack() is the correct method for your navigation stack)
        //   navigation.goBack();
        // }
    };

    const handleDonePress = () => {
        setIsModalVisible(false);
        navigation.navigate(NAVIGATION.feedback);
    };
    const closeModal = () => {
        setIsModalVisible(false);
        let routes = navigation.getState()?.routes;
        let isWaitingRoomSession = (routes[routes.length - 2]?.key.indexOf("WaitingTimer") >= 0);
        if(isWaitingRoomSession) {
            navigation.navigate(NAVIGATION.dashboard);
        }
        else
            navigation.goBack();
    };
    const onPressMore = async () => {
        const mySelf = await zoom.session.getMySelf();
        const isShareLocked = await zoom.shareHelper.isShareLocked();
        const isFullScreenUserManager = await fullScreenUser?.getIsManager();
        const canSwitchSpeaker = await zoom.audioHelper.canSwitchSpeaker();
        const canStartRecording = await zoom.recordingHelper.canStartRecording();
        const isSupportPhoneFeature = await zoom.phoneHelper.isSupportPhoneFeature();
        const startLiveTranscription =
            (await zoom.liveTranscriptionHelper.getLiveTranscriptionStatus()) ===
            LiveTranscriptionStatus.Start;
        let options = [
            // { text: 'Switch Camera', onPress: () => zoom.videoHelper.switchCamera() },
            {
                text: `Get Session Dial-in Number infos`,
                onPress: async () => {
                    console.log('session number= ' + (await zoom.session.getSessionNumber()));
                },
            },
            {
                text: `${startLiveTranscription ? 'Stop' : 'Start'} Live Transcription`,
                onPress: async () => {
                    const canStartLiveTranscription =
                        await zoom.liveTranscriptionHelper.canStartLiveTranscription();
                    if (canStartLiveTranscription === true) {
                        if (startLiveTranscription) {
                            const error =
                                await zoom.liveTranscriptionHelper.stopLiveTranscription();
                            // console.log('stopLiveTranscription= ' + error);
                        } else {
                            const error =
                                await zoom.liveTranscriptionHelper.startLiveTranscription();
                            // console.log('startLiveTranscription= ' + error);
                        }
                    } else {
                        Alert.alert('Live transcription not supported');
                    }
                },
            },
            {
                text: `${isMicOriginalOn ? 'Disable' : 'Enable'} Original Sound`,
                onPress: async () => {
                    await zoom.audioSettingHelper.enableMicOriginalInput(!isMicOriginalOn);
                    console.log(`Original sound ${isMicOriginalOn ? 'Disabled' : 'Enabled'}`);
                    setIsMicOriginalOn(!isMicOriginalOn);
                },
            },
            {
                text: 'Set Video Preference',
                onPress: async () => {
                    await zoom.videoHelper.setVideoQualityPreference({
                        mode: VideoPreferenceMode.Balance,
                        maximumFrameRate: 0,
                        minimumFrameRate: 0,
                    });
                },
            },
        ];

        if (isSupportPhoneFeature) {
            options = [
                ...options,
                {
                    text: `Invite By Phone`,
                    onPress: async () => {
                        zoom.phoneHelper.inviteByPhone(
                            '<Country Code>',
                            '<Phone Number>',
                            '<Display Name>',
                        );
                    },
                },
            ];
        }

        if (canSwitchSpeaker) {
            options = [
                ...options,
                {
                    text: `Turn ${isSpeakerOn ? 'off' : 'on'} Speaker`,
                    onPress: async () => {
                        await zoom.audioHelper.setSpeaker(!isSpeakerOn);
                        setIsSpeakerOn(!isSpeakerOn);
                    },
                },
            ];
        }

        if (mySelf.isHost) {
            options = [
                ...options,
                {
                    text: `${isShareLocked ? 'Unlock' : 'Lock'} Share`,
                    onPress: () => zoom.shareHelper.lockShare(!isShareLocked),
                },
                {
                    text: `${isFullScreenUserManager ? 'Revoke' : 'Make'} Manager`,
                    onPress: () => {
                        fullScreenUser &&
                            (isFullScreenUserManager
                                ? zoom.userHelper.revokeManager(fullScreenUser.userId)
                                : zoom.userHelper.makeManager(fullScreenUser.userId));
                    },
                },
                {
                    text: 'Change Name',
                    onPress: () => setIsRenameModalVisible(true),
                },
            ];

            if (canStartRecording) {
                options = [
                    ...options,
                    {
                        text: `${isRecordingStarted ? 'Stop' : 'Start'} Recording`,
                        onPress: async () => {
                            if (!isRecordingStarted) {
                                await zoom.recordingHelper.startCloudRecording();
                            } else {
                                await zoom.recordingHelper.stopCloudRecording();
                            }
                        },
                    },
                ];
            }
        }

        if (Platform.OS === 'android') {
            Alert.alert('More options', '', options, {cancelable: true});
        }

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', ...options.map(option => option.text)],
                    cancelButtonIndex: 0,
                },
                buttonIndex => {
                    // eslint-disable-next-line eqeqeq
                    if (buttonIndex != 0) {
                        options[buttonIndex - 1].onPress();
                    }
                },
            );
        }
    };

    const onPressLeave = async () => {
        const mySelf = await zoom.session.getMySelf();
        const options = [
            {
                text: 'Leave Session',
                onPress: () => leaveSession(false),
            },
        ];

        if (mySelf.isHost) {
            options.unshift({
                text: 'End Session',
                onPress: () => leaveSession(true),
            });
        }

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', ...options.map(option => option.text)],
                    cancelButtonIndex: 0,
                },
                buttonIndex => {
                    if (buttonIndex !== 0) {
                        options[buttonIndex - 1].onPress();
                    }
                },
            );
        } else {
            Alert.alert('Do you want to leave this session?', '', options, {
                cancelable: true,
            });
        }
    };

    const onSelectedUser = async selectedUser => {
        
        setFullScreenUser(selectedUser);
        var userIsSharing;
        if (selectedUser != null && selectedUser.isSharing != null) {
            userIsSharing = selectedUser.isSharing;
        } else {
            userIsSharing = false;
        }
        // const options = [
        //   {
        //     text: 'Current volume',
        //     onPress: async () => {
        //       const userVolume = await selectedUser.getUserVolume(
        //         selectedUser.userId,
        //         userIsSharing,
        //       );
        //       console.log(
        //         'user ' + selectedUser.userId + "'s volume is " + userVolume,
        //       );
        //     },
        //   },
        //   {
        //     text: 'Volume up',
        //     onPress: async () => {
        //       var canSetVolume = await selectedUser.canSetUserVolume(
        //         selectedUser.userId,
        //         userIsSharing,
        //       );
        //       if (canSetVolume) {
        //         var userVolume = await selectedUser.getUserVolume(
        //           selectedUser.userId,
        //           userIsSharing,
        //         );
        //         if (userVolume < 10) {
        //           var updatedVolume = userVolume + 1;
        //           await selectedUser.setUserVolume(
        //             selectedUser.userId,
        //             userIsSharing,
        //             updatedVolume,
        //           );
        //         } else {
        //           Alert.alert('Cannot volume up.');
        //         }
        //       } else {
        //         Alert.alert('Volume change not authorized!');
        //       }
        //     },
        //   },
        //   {
        //     text: 'Volume down',
        //     onPress: async () => {
        //       var canSetVolume = await selectedUser.canSetUserVolume(
        //         selectedUser.userId,
        //         userIsSharing,
        //       );
        //       if (canSetVolume) {
        //         var userVolume = await selectedUser.getUserVolume(
        //           selectedUser.userId,
        //           userIsSharing,
        //         );
        //         if (userVolume > 0) {
        //           var updatedVolume = userVolume - 1;
        //           await selectedUser.setUserVolume(
        //             selectedUser.userId,
        //             userIsSharing,
        //             updatedVolume,
        //           );
        //         } else {
        //           Alert.alert('Cannot volume down.');
        //         }
        //       } else {
        //         Alert.alert('Volume change not authorized!');
        //       }
        //     },
        //   },
        // ];
        // Alert.alert('Volume options', '', options, {cancelable: true});
    };
    const closeChat = () => {
        setShowChatBox(false);
    };

    const getAllList = () => {
        getUpcomingList();
        getRequestedList();
        getCompletedList();
    };

    const getUpcomingList = () => {
        let params = {
            status: 'booked',
        };
        dispatch(listUpcomingAppointment(params));
    };
    const getRequestedList = () => {
        let params = {
            status: 'proposed',
        };
        dispatch(listRequestedAppointment(params));
    };
    const getCompletedList = () => {
        let params = {
            status: 'completed',
        };
        dispatch(listCompletedAppointment(params));
    };

    const ChatBox = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={showChatBox}
                statusBarTranslucent>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'grey',
                        paddingHorizontal: moderateScale(20),
                        paddingTop: moderateScale(20),
                    }}>
                    <TouchableOpacity onPress={closeChat} style={{paddingTop: moderateScale(10)}}>
                        <TextView title={'X'}></TextView>
                    </TouchableOpacity>
                    <View style={{flex: 0.9}}>
                        <View style={styles.middleWrapper} pointerEvents="box-none">
                            <FlatList
                                contentContainerStyle={styles.chatList}
                                onTouchStart={onListTouchStart}
                                onTouchEnd={onListTouchEnd}
                                data={chatMessages}
                                extraData={refreshFlatlist}
                                renderItem={({item}) => (
                                    <View>
                                        <View style={styles.chatMessage}>
                                            <Text style={styles.chatUser}>
                                                {item.senderUser.userName}:
                                            </Text>
                                            <Text style={styles.chatContent}> {item.content}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => {
                                                Alert.alert(
                                                    'Delete Message',
                                                    'Delete this message?',
                                                    [
                                                        {
                                                            text: 'Cancel',
                                                            onPress: () =>
                                                                __DEV__ &&
                                                                console.log('Cancel Pressed'),
                                                            style: 'cancel',
                                                        },
                                                        {
                                                            text: 'OK',
                                                            onPress: () => {
                                                                deleteChatMessage(
                                                                    item.messageID,
                                                                    item,
                                                                );
                                                            },
                                                        },
                                                    ],
                                                );
                                            }}>
                                            <Text style={styles.deleteText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                keyExtractor={(item, index) => `${String(item.timestamp)}${index}`}
                                showsVerticalScrollIndicator={false}
                                fadingEdgeLength={50}
                                inverted
                            />
                        </View>
                    </View>
                    <View style={{flex: 0.1}}>
                        <Animated.View>
                            <View style={styles.chatInputWrapper}>
                                <TextInput
                                    style={styles.chatInput}
                                    ref={chatInputRef}
                                    placeholder="Type comment"
                                    placeholderTextColor="#AAA"
                                    onChangeText={text => {
                                        scaleChatSend(text.length !== 0);
                                        setChatMessage(text);
                                    }}
                                    onSubmitEditing={sendChatMessage}
                                />
                                <Animated.View style={[styles.chatSendButton]}>
                                    <Icon name="chatSend" onPress={sendChatMessage} />
                                </Animated.View>
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </Modal>
        );
    };

    const contentStyles = {
        ...styles.container,
        height: contentHeight,
    };

    return (
        <View style={contentStyles}>
            <StatusBar hidden />
            <View style={styles.fullScreenVideo}>
                <VideoView
                    user={fullScreenUser}
                    // user={users[0]}
                    sharing={fullScreenUser?.userId === sharingUser?.userId}
                    preview={false}
                    hasMultiCamera={false}
                    multiCameraIndex={'0'}
                    onPress={() => {
                        isKeyboardOpen ? toggleUI() : Keyboard.dismiss();
                    }}
                    fullScreen
                />
            </View>

            <LinearGradient
                style={styles.fullScreenVideo}
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
                locations={[0, 0.12, 0.88, 1]}
                pointerEvents="none"
            />

            <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
                {/* <Animated.View
                    style={[styles.contents, uiOpacityAnimatedStyle]} */}
                <Animated.View style={[styles.contents, {}]} pointerEvents="box-none">
                    <View style={styles.topWrapper} pointerEvents="box-none">
                        <View style={styles.sessionInfo}>
                            <View style={styles.sessionInfoHeader}>
                                {/* <Text style={styles.sessionName}>{sessionName}</Text> */}
                                <Icon name={route.params.sessionPassword ? 'locked' : 'unlocked'} />
                            </View>
                            <Text style={styles.numberOfUsers}>
                                {`Participants: ${users.length}`}
                            </Text>
                        </View>

                        <View style={styles.topRightWrapper}>
                            <TouchableOpacity style={styles.leaveButton} onPress={onPressLeave}>
                                <Text style={styles.leaveText}>LEAVE</Text>
                            </TouchableOpacity>
                            {fullScreenUser && videoInfo.length !== 0 && (
                                <View style={styles.videoInfo}>
                                    <Text style={styles.videoInfoText}>{videoInfo}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.middleWrapper} pointerEvents="box-none">
                        <View style={styles.controls}>
                            <Icon
                                containerStyle={styles.controlButton}
                                name={isMuted ? 'unmute' : 'mute'}
                                onPress={onPressAudio}
                            />
                            {/*
              <Icon
                containerStyle={styles.controlButton}
                name={isSharing ? 'shareOff' : 'shareOn'}
                onPress={onPressShare}
              />
              */}

                            <Icon
                                containerStyle={styles.controlButton}
                                name={isVideoOn ? 'videoOff' : 'videoOn'}
                                onPress={onPressVideo}
                            />
                            <Icon
                                containerStyle={styles.controlButton}
                                name={'chat'}
                                onPress={() => setShowChatBox(true)}
                            />
                            {/* 
               <Icon
                containerStyle={styles.controlButton}
                name="more"
                onPress={onPressMore}
              />
              */}
                        </View>
                    </View>
                </Animated.View>

                <View style={styles.bottomWrapper} pointerEvents="box-none">
                    {isInSession && isKeyboardOpen && (
                        <FlatList
                            style={styles.userList}
                            contentContainerStyle={styles.userListContentContainer}
                            onTouchStart={onListTouchStart}
                            onTouchEnd={onListTouchEnd}
                            //  data={users}
                            data={users}
                            extraData={users}
                            renderItem={({item}) => (
                                <VideoView
                                    user={item}
                                    focused={item.userId === fullScreenUser?.userId}
                                    onPress={selectedUser => onSelectedUser(selectedUser)}
                                    key={item.userId}
                                />
                            )}
                            keyExtractor={item => item.userId}
                            fadingEdgeLength={50}
                            decelerationRate={0}
                            // snapToAlignment="center"
                            snapToInterval={100}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                        />
                    )}
                    {/* <Animated.View style={inputOpacityAnimatedStyle}>
            <View style={styles.chatInputWrapper}>
              <TextInput
                style={styles.chatInput}
                ref={chatInputRef}
                placeholder="Type comment"
                placeholderTextColor="#AAA"
                onChangeText={(text) => {
                  scaleChatSend(text.length !== 0);
                  setChatMessage(text);
                }}
                onSubmitEditing={sendChatMessage}
              />
              <Animated.View
                style={[
                  chatSendButtonScaleAnimatedStyle,
                  styles.chatSendButton,
                ]}>
                <Icon name="chatSend" onPress={sendChatMessage} />
              </Animated.View>
            </View>
          </Animated.View> */}
                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isRenameModalVisible}
                    statusBarTranslucent>
                    <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
                        <View style={styles.modal}>
                            <Text style={styles.modalTitleText}>Change Name</Text>
                            <TextInput
                                style={styles.renameInput}
                                placeholder="New name"
                                placeholderTextColor="#AAA"
                                onChangeText={text => setNewName(text)}
                            />
                            <View style={styles.modalActionContainer}>
                                <TouchableOpacity
                                    style={styles.modalAction}
                                    onPress={() => {
                                        if (fullScreenUser) {
                                            zoom.userHelper.changeName(
                                                newName,
                                                fullScreenUser.userId,
                                            );
                                            setNewName('');
                                            setIsRenameModalVisible(false);
                                        }
                                    }}>
                                    <Text style={styles.modalActionText}>Apply</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalAction}
                                    onPress={() => {
                                        setNewName('');
                                        setIsRenameModalVisible(false);
                                    }}>
                                    <Text style={styles.modalActionText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* @ts-ignore: only calculates the keyboard height */}
                <View
                    style={styles.keyboardArea}
                    // isOpen={false}
                    // onChange={keyboardHeightChange}
                />

                {!isInSession && (
                    <View style={styles.connectingWrapper}>
                        <Text style={styles.connectingText}>Connecting...</Text>
                    </View>
                )}
            </SafeAreaView>
            <ChatList
                showChatBox={showChatBox}
                closeChat={closeChat}
                deleteChatMessage={deleteChatMessage}
                chatMessages={chatMessages}
                onListTouchEnd={onListTouchEnd}
                onListTouchStart={onListTouchStart}
                refreshFlatlist={refreshFlatlist}
                sendChatMessage={sendChatMessage}
            />
            <FeedbackModel
                onSuccessClose={() => closeModal()}
                handleDonePresss={() => handleDonePress()}
                isSuccessVisible={isModalVisible}
                surveymandatory={mandatoryField}
                feedBackTitle={feedBackTitle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#232323',
    },
    fullScreenVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    connectingWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    connectingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    safeArea: {
        flex: 1,
    },
    contents: {
        flex: 1,
        alignItems: 'stretch',
    },
    sessionInfo: {
        // width: 200,
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: moderateScale(5),
    },
    sessionInfoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sessionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    numberOfUsers: {
        fontSize: 13,
        color: '#FFF',
    },
    topWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 8,
        paddingTop: 16,
    },
    topRightWrapper: {
        paddingTop: 8,
        alignItems: 'flex-end',
    },
    middleWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    bottomWrapper: {
        paddingHorizontal: 8,
        alignItems: 'flex-end',
    },
    leaveButton: {
        paddingVertical: 4,
        paddingHorizontal: 24,
        marginBottom: 16,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    leaveText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E02828',
    },
    videoInfo: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    videoInfoText: {
        fontSize: 12,
        color: '#FFF',
    },
    chatList: {
        paddingRight: 16,
    },
    chatMessage: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        padding: 8,
        marginBottom: 8,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    chatUser: {
        fontSize: 14,
        color: '#CCC',
    },
    chatContent: {
        fontSize: 14,
        color: '#FFF',
    },
    controls: {
        alignSelf: 'center',
        paddingTop: 24,
    },
    controlButton: {
        marginBottom: 12,
    },
    deleteButton: {
        fontSize: 10,
        paddingLeft: 4,
    },
    deleteText: {
        color: '#FFF',
    },
    userList: {
        width: '100%',
    },
    userListContentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    chatInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatInput: {
        flex: 1,
        height: 40,
        marginVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#666',
        color: '#AAA',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    chatSendButton: {
        height: 36,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        paddingTop: 16,
        paddingBottom: 24,
        paddingLeft: 24,
        paddingRight: 16,
        borderRadius: 8,
        backgroundColor: '#FFF',
    },
    modalTitleText: {
        fontSize: 18,
        marginBottom: 8,
    },
    modalActionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalAction: {
        marginTop: 16,
        paddingHorizontal: 24,
    },
    modalActionText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    moreItem: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    moreItemText: {
        fontSize: 16,
    },
    moreItemIcon: {
        width: 36,
        height: 36,
        marginLeft: 48,
    },
    moreModalTitle: {
        fontSize: 24,
    },
    renameInput: {
        width: 200,
        marginTop: 16,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#AAA',
        color: '#000',
    },
    keyboardArea: {
        height: 0,
        width: 0,
        zIndex: -100,
    },
});
