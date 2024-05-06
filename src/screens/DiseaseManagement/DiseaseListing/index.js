import {TYPES, editDisease, listDisease} from '@/actions/DiseaseManagementActions';
import {AppHeader, Loader, TextView} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper} from '@/helpers';
import {deviceHeight, moderateScale} from '@/hooks/scale';
import {styles} from '@/screens/DiseaseManagement/DiseaseListing/index.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {shadow} from '@/theme';
import {useEffect} from 'react';
import {View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function DiseaseListing({navigation}) {
    const dispatch = useDispatch();
    const {diseases} = useSelector(state => state);
    const isLoading = useSelector(state => isLoadingSelector([TYPES.LIST_DISEASE], state));
    const isDeleting = useSelector(state => isLoadingSelector([TYPES.DELETE_DISEASE], state));
    useEffect(() => {
        dispatch(listDisease(AuthHelper.getPatientId()));
    }, []);

    const edit = item => {
        dispatch(editDisease(item));
        navigation.navigate(NAVIGATION.addDisease);
    };

    /*
    const delDisease = item => {
    Alert.alert('Danger!', 'Are you sure to delete this?', [
      {
        text: 'Cancel',
        onPress: () => __DEV__ && console.log('Cancel Pressed'),
      },
      {
        text: 'DELETE',
        onPress: () =>
          dispatch(
            deleteDisease({
              diseaseId: item.id,
              patientId: AuthHelper.getPatientId(),
            }),
          ),
      },
    ]);
  };
  */

    return (
        <>
            <AppHeader
                title={'Disease Management'}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.push(NAVIGATION.notification)}
            />
            <View style={{flex: 1, paddingHorizontal: moderateScale(20)}}>
                <Loader isLoading={isLoading || isDeleting} />
                <View style={{height: deviceHeight - 200}}>
                    <FlatList
                        contentContainerStyle={{
                            marginTop: moderateScale(20),
                        }}
                        showsVerticalScrollIndicator={false}
                        data={diseases.list}
                        renderItem={({item}) => {
                            return (
                                <View style={[shadow.primary, styles.listContainer]}>
                                    <View style={styles.imgContainer}>
                                        <TextView
                                            title={item.diseaseName}
                                            viewStyle={styles.titleContainer}
                                            textStyle={styles.title}
                                        />
                                        {/*
                     <View style={styles.imgView}>
                      <TouchableOpacity onPress={() => edit(item)}>
                        <Image source={IMAGES.icons.common.edit} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => delDisease(item)}>
                        <Image source={IMAGES.icons.common.delete} />
                      </TouchableOpacity>
                    </View>
                    */}
                                    </View>
                                    <TextView
                                        title={item.diseaseDesc}
                                        viewStyle={{
                                            paddingHorizontal: moderateScale(20),
                                            marginBottom: moderateScale(10),
                                        }}
                                        textStyle={styles.description}
                                    />
                                </View>
                            );
                        }}
                        ListEmptyComponent={
                            <View style={{flex: 1}}>
                                <TextView
                                    title={'List is Empty'}
                                    viewStyle={{
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                />
                            </View>
                        }
                        ListFooterComponent={<View style={{height: moderateScale(20)}}></View>}
                        keyExtractor={(item, key) => key}
                    />
                </View>
                {/* <BottomButton
          title={'Add Disease'}
          onPress={() => navigation.navigate(NAVIGATION.addDisease)}
          style={{
            width: '95%',
            marginLeft: moderateScale(10),
            marginTop:
              Platform.OS === 'ios' ? -moderateScale(40) : moderateScale(15),
          }}
        /> */}
            </View>
        </>
    );
}
