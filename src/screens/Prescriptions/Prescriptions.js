import {TYPES} from '@/actions/PrescriptionsAction';
import {listPrescriptionsList} from '@/actions/PrescriptionsAction';
import {IMAGES} from '@/assets';
import {AppHeader, Button, Image, Loader, TextView} from '@/components';
import {NAVIGATION, USER_TYPES} from '@/constants';
import {strings} from '@/localization';
import {styles} from '@/screens/Prescriptions/Prescriptions.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {useEffect, useState} from 'react';
import {TouchableOpacity, View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function Prescriptions({navigation}) {
    const [list, setList] = useState([]);
    const [prescriptionsList, setPrescriptionsList] = useState();
    const {profile} = useSelector(state => state);
    const dispatch = useDispatch();
    const isLoading = useSelector(state => isLoadingSelector([TYPES.LIST_PRESCRIPTION], state));
    useEffect(() => {
        getPrescriptionsList();
    }, []);

    const getPrescriptionsList = () => {
        dispatch(
            listPrescriptionsList(res => {
                setPrescriptionsList(res?.data);
            }),
        );
    };
    const formatDate = dateTimeString => {
        const date = new Date(dateTimeString);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return formattedDate;
    };

    const formatTime = dateTimeString => {
        const date = new Date(dateTimeString);
        let hours = date.getHours();
        const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        const meridiem = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedTime = `${hours}:${minutes} ${meridiem}`;
        return formattedTime;
    };
    const practitionerName = name => {
        // Split the name into individual words
        const words = name.split(' ');
        // Capitalize the first letter of each word
        const capitalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        // Join the capitalized words back together
        return capitalizedWords.join(' ');
    };

    return (
        <View style={styles.container}>
            <Loader isLoading={isLoading} />
            <AppHeader
                title={strings.prescriptions.name}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.navigate(NAVIGATION.notification)}
            />

            {prescriptionsList?.length > 0 ? (
                <FlatList
                    data={prescriptionsList}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                        console.log(item, 'checkitem>>');
                        const formattedDate = formatDate(item?.updatedAt);
                        const formattedTime = formatTime(item?.updatedAt);
                        const practName = practitionerName(item?.requester?.display);
                        return (
                            <View style={styles.listingView}>
                                <View style={styles.detailsView}>
                                    <View style={styles.details}>
                                        <TextView
                                            title={strings.requisitions.date}
                                            textStyle={styles.keyName}
                                            color={'rgba(0, 0, 0, 0.77)'}
                                        />
                                        <TextView
                                            title={formattedDate}
                                            textStyle={styles.value}
                                            color={'#000'}
                                        />
                                    </View>
                                    <View style={styles.details}>
                                        <TextView
                                            title={strings.requisitions.time}
                                            textStyle={styles.keyName}
                                            color={'rgba(0, 0, 0, 0.77)'}
                                        />
                                        <TextView
                                            title={formattedTime}
                                            textStyle={styles.value}
                                            color={'#000'}
                                        />
                                    </View>
                                    <View style={styles.details}>
                                        <TextView
                                            title={strings.requisitions.practitioner}
                                            textStyle={styles.keyName}
                                            color={'rgba(0, 0, 0, 0.77)'}
                                        />
                                        <TextView
                                            title={practName}
                                            textStyle={styles.value}
                                            color={'#000'}
                                        />
                                    </View>
                                </View>
                                <View style={styles.line}></View>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate(NAVIGATION.prescriptionsDetails, {
                                            medicationRequestId: item?.id,
                                        })
                                    }
                                    style={styles.eyeIconView}>
                                    <Image
                                        source={IMAGES.icons.eyeicon}
                                        imageStyle={styles.banner}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            ) : (
                <TextView
                    title={'No Data Found'}
                    textStyle={styles.noResultStyle}
                    viewStyle={{alignSelf: 'center'}}
                />
            )}
        </View>
    );
}
