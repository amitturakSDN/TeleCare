import {TYPES, profileDeleteRelative, profileRelatedPerson} from '@/actions/ProfileActions';
import {IMAGES} from '@/assets';
import {AppHeader, BottomButton, Image, Loader, TextView} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {styles} from '@/screens/RelatedPersonList/RelatedPersonList.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {shadow} from '@/theme';
import {useEffect} from 'react';
import {Alert, TouchableOpacity, View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function RelatedPersonList({navigation}) {
    const dispatch = useDispatch();
    const {profile} = useSelector(state => state);
    const isLoading = useSelector(state =>
        isLoadingSelector([TYPES.LIST_DISEASE, TYPES.PROFILE_DELETE_RELATIVE], state),
    );

    useEffect(() => {
        dispatch(profileRelatedPerson(AuthHelper.getPatientId()));
    }, []);

    const deleteRelative = (id, patientRefId) => {
        Alert.alert('Delete', 'Are you sure you want to delete this relative?', [
            {
                text: 'Ok',
                onPress: () =>
                    dispatch(
                        profileDeleteRelative(
                            Validate.encryptInput({id, userId: patientRefId, isDelete: true}),
                        ),
                    ),
            },
            {
                text: 'Cancel',
                onPress: () => __DEV__ && console.log('Cancel Pressed'),
            },
        ]);
    };

    return (
        <>
            <AppHeader title={'Related Persons'} onBackPress={() => navigation.pop()} />
            <View style={{flex: 1, paddingHorizontal: moderateScale(20)}}>
                <Loader isLoading={isLoading} />
                <View style={{flex: 0.9}}>
                    <FlatList
                        contentContainerStyle={{
                            marginTop: moderateScale(20),
                        }}
                        showsVerticalScrollIndicator={false}
                        data={profile?.allRelatedPerson ?? []}
                        renderItem={({item}) => {
                            let name = item.name[0].text;
                            return (
                                <View style={[shadow.primary, styles.listContainer]}>
                                    <View style={styles.imgContainer}>
                                        <TextView
                                            title={name}
                                            viewStyle={styles.titleContainer}
                                            textStyle={styles.title}
                                        />
                                        <TextView
                                            title={item.active ? 'Accepted' : 'Pending'}
                                            textStyle={styles.relation}
                                        />
                                        <View style={styles.imgView}>
                                            {/* <TouchableOpacity onPress={() => edit(item.patientRefId)} >
                                                <Image source={IMAGES.icons.common.edit} />
                                            </TouchableOpacity> */}
                                            <TouchableOpacity
                                                onPress={() =>
                                                    deleteRelative(item.id, item.patientRefId)
                                                }>
                                                <Image source={IMAGES.icons.common.delete} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {/* <TextView title={item.diseaseDesc} viewStyle={{ paddingHorizontal: moderateScale(20),marginBottom : moderateScale(10) }} textStyle={styles.description} /> */}
                                </View>
                            );
                        }}
                        ListEmptyComponent={
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <TextView title={'List is Empty'} />
                            </View>
                        }
                        ListFooterComponent={<View style={{height: moderateScale(20)}}></View>}
                        keyExtractor={(item, index) => index}
                    />
                </View>
                {profile?.relatedPerson && (
                    <BottomButton
                        title={'Add Relative'}
                        onPress={() => navigation.navigate(NAVIGATION.invitePerson)}
                        style={{width: '95%'}}
                    />
                )}
            </View>
        </>
    );
}
