import {TYPES, notificationListing, notificationReply} from '@/actions/NotificationActions';
import {
    profileDeleteRelative,
    profileSelect,
    profileUpdateInvitation,
} from '@/actions/ProfileActions';
import {logout} from '@/actions/UserActions';
import {IMAGES} from '@/assets';
import {Button, Image, TextView} from '@/components';
import {USER_TYPES} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/Dependent//Dependent.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {colors} from '@/theme';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function Dependent(props) {
    const [list, setList] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});
    const {profile, notification} = useSelector(state => state);
    const userId = AuthHelper.getUserId();
    const userType = AuthHelper.getUserType();
    const dispatch = useDispatch();
    const patientId = AuthHelper.getPatientId();

    // const isLoading = useSelector(state =>
    //   isLoadingSelector([TYPES.PROFILE_RELATED_PERSON], state),
    // );
    useEffect(() => {
        // dispatch(profileRelatedPerson(null));
        dispatch(notificationListing(patientId));
        if (profile?.selectedProfile) {
            let selected_relation = profile.relatedPerson.filter(
                item => item.id == profile?.selectedProfile.id,
            );
            /**Set match relation user id  */
            if (selected_relation.length > 0) {
                setSelectedItem(
                    profile.relatedPerson.filter(item => item.id == profile?.selectedProfile.id)[0],
                );
            } else {
                /**Else add own user id for self */
                setSelectedItem({id: userId});
            }
        }
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
    const handlDependent = payload => {
        dispatch({
            type: 'HANDLE_DEPENDENT',
            payload,
        });
    };
    const HeaderComponent = () => {
        if (userType.includes(USER_TYPES.patient)) {
            return (
                <TouchableOpacity
                    style={styles.listContainer}
                    onPress={() => {
                        setSelectedItem({
                            id: userId,
                        });
                        // selectProfile(userId);
                        // handlDependent('SELF');
                    }}>
                    <TextView
                        title={strings.dependent.self}
                        textStyle={styles.relationship}
                        color={colors.PRIMARY_BLUE}
                    />
                    <TextView title={strings.dependent.self} textStyle={styles.relationship} />
                    {/* {userId == profile.selectedProfile?.id ? ( */}
                    {userId == selectedItem?.id ? (
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
                    // selectProfile(item.id);
                    // handlDependent(item.relationship);
                    setSelectedItem(item);
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
                {/* {item.patientRefId == profile.selectedProfile?.id ? ( */}
                {item.id == selectedItem?.id ? (
                    <Image source={IMAGES.icons.radioChecked} />
                ) : (
                    <Image source={IMAGES.icons.radio} />
                )}
            </TouchableOpacity>
        );
    };

    /**On Submit button click */
    const onSubmitClick = () => {
        if (Object.keys(selectedItem).length == 0) {
            Alert.alert('Please select account.');
        } else {
            if (selectedItem?.id != userId) {
                selectProfile(selectedItem.id);
                handlDependent(selectedItem.relationship);
            } else {
                selectProfile(userId);
                handlDependent('SELF');
            }
            props.setModalVisibilty(false);
        }
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    height: 50,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingHorizontal: moderateScale(20),
                }}>
                <TouchableOpacity
                    onPress={() => {
                        dispatch(logout());
                    }}>
                    <Image source={IMAGES.icons.drawerMenu.logout} />
                </TouchableOpacity>
            </View>

            <View style={{paddingHorizontal: moderateScale(20), flex: 1}}>
                <View style={styles.titleContainer}>
                    <TextView title={strings.dependent.title} textStyle={styles.title} />
                    <TextView title={strings.dependent.subTitle} textStyle={styles.subtitle} />
                </View>
                <View style={{flex: 1}}>
                    <FlatList
                        style={{paddingBottom: 10}}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{}}
                        data={list}
                        renderItem={showDependent}
                        ListHeaderComponent={<HeaderComponent />}
                        keyExtractor={item => item.updatedAt}
                        ListEmptyComponent={<Notification />}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: moderateScale(15),
                    }}>
                    <Button
                        title={strings.session.cancel}
                        style={{
                            height: moderateScale(80),
                            flex: 0.45,
                        }}
                        textStyle={styles.btnText2}
                        onPress={() => props.setModalVisibilty(false)}
                    />
                    <Button
                        title={strings.feedback.submit}
                        style={{
                            height: moderateScale(80),
                            flex: 0.45,
                        }}
                        textStyle={styles.btnText2}
                        onPress={() => {
                            onSubmitClick();
                        }}
                    />
                </View>
            </View>
        </View>
    );
}
