import {TYPES, profileRelatedPerson, profileSelect} from '@/actions/ProfileActions';
import {IMAGES} from '@/assets';
import {AppHeader, Button, Image, Loader, TextView} from '@/components';
import {NAVIGATION, USER_TYPES} from '@/constants';
import {AuthHelper} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/DependentInternal/DependentInternal.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {colors} from '@/theme';
import {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function DependentInternal({navigation}) {
    const [list, setList] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});
    const {profile} = useSelector(state => state);
    const userId = AuthHelper.getUserId();
    const userType = AuthHelper.getUserType();
    const dispatch = useDispatch();
    const isLoading = useSelector(state => isLoadingSelector([TYPES.PROFILE_DETAIL], state));
    // const isLoading = useSelector(state =>
    //   isLoadingSelector([TYPES.PROFILE_RELATED_PERSON], state),
    // );
    useEffect(() => {
        dispatch(profileRelatedPerson(AuthHelper.getUserId()));
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

    /**On Submit button click */
    const onSubmitClick = () => {
        if (Object.keys(selectedItem).length == 0) {
            Alert.alert('Please select account.');
        } else {
            if (selectedItem?.id != userId) {
                selectProfile(selectedItem.id);
                // handlDependent(selectedItem.relationship);
            } else {
                selectProfile(userId);
                // handlDependent('SELF');
            }
            navigation.pop();
        }
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
                    }}
                    // onPress={() => selectProfile(userId)}
                >
                    <TextView
                        title={strings.dependent.self}
                        textStyle={styles.relationship}
                        color={colors.PRIMARY_BLUE}
                    />
                    <TextView title={strings.dependent.self} textStyle={styles.relationship} />
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
                // onPress={() => selectProfile(item.id)}>
                onPress={() => {
                    // selectProfile(item.id);
                    // handlDependent(item.relationship);
                    setSelectedItem(item);
                }}>
                <TextView
                    title={`${item.name[0].given[0]}`}
                    viewStyle={{flex: 0.4}}
                    numLines={1}
                    textStyle={styles.relationship}
                    color={colors.PRIMARY_BLUE}
                />
                <TextView
                    viewStyle={{flex: 0.4}}
                    title={item.relationship}
                    textStyle={styles.relationship}
                />
                {item.id == selectedItem?.id ? (
                    <Image source={IMAGES.icons.radioChecked} />
                ) : (
                    <Image source={IMAGES.icons.radio} />
                )}
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.container}>
            <Loader isLoading={isLoading} />
            <AppHeader
                title={strings.dependent.name}
                //toggle={true}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.navigate(NAVIGATION.notification)}
            />

            {profile?.relatedPerson?.length > 0 ? (
                <View style={{paddingHorizontal: moderateScale(20), flex: 1}}>
                    <View style={styles.titleContainer}>
                        <TextView title={strings.dependent.title} textStyle={styles.title} />
                        <TextView title={strings.dependent.subTitle} textStyle={styles.subtitle} />
                    </View>
                    <View style={{flex: 1}}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                marginTop: moderateScale(10),
                            }}
                            data={list}
                            renderItem={showDependent}
                            ListHeaderComponent={<HeaderComponent />}
                            keyExtractor={item => item.updatedAt}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Button
                            title={strings.session.cancel}
                            style={{
                                height: moderateScale(80),
                                flex: 0.45,
                            }}
                            textStyle={styles.btnText2}
                            onPress={() => navigation.pop()}
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
            ) : (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text>{strings.dependent.noData}</Text>
                </View>
            )}
        </View>
    );
}
