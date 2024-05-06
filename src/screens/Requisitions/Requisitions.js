import {TYPES, profileRelatedPerson, profileSelect} from '@/actions/RequisitionsAction';
import {listRequisitionList} from '@/actions/RequisitionsAction';
import {IMAGES} from '@/assets';
import {AppHeader, Button, Image, Loader, TextView} from '@/components';
import {NAVIGATION, USER_TYPES} from '@/constants';
import {AuthHelper} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/Requisitions/Requisitions.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {colors} from '@/theme';
import {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function Requisitions({navigation}) {
    const [list, setList] = useState([]);
    const [requisitionList, setRequisitionList] = useState();
    const {profile} = useSelector(state => state);
    const dispatch = useDispatch();
    const isLoading = useSelector(state => isLoadingSelector([TYPES.LIST_REQUISITION], state));

    useEffect(() => {
        getRequisitionList();
    }, []);

    const getRequisitionList = () => {
        dispatch(
            listRequisitionList(res => {
                console.log(res?.data, 'requisition data>');
                setRequisitionList(res?.data);
            }),
        );
    };
    // const formatDateTime = dateTimeString => {
    //     const dateTime = new Date(dateTimeString);
    //     const date = `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime.getFullYear()}`;
    //     let hours = dateTime.getHours();
    //     const minutes = dateTime.getMinutes();
    //     const ampm = hours >= 12 ? 'PM' : 'AM';
    //     hours = hours % 12;
    //     hours = hours ? hours : 12; // the hour '0' should be '12'
    //     const time = `${hours.toString().padStart(2, '0')} : ${minutes
    //         .toString()
    //         .padStart(2, '0')} ${ampm}`;
    //     return {date, time};
    // };
    const formatDateTime = dateTimeValue => {
        const createdAtTime = new Date(parseInt(dateTimeValue));
        const date = `${createdAtTime.getMonth() + 1}/${createdAtTime.getDate()}/${createdAtTime.getFullYear()}`;
        let hours = createdAtTime.getHours();
        const minutes = createdAtTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const time = `${hours.toString().padStart(2, '0')} : ${minutes
            .toString()
            .padStart(2, '0')} ${ampm}`;
        return { date, time };
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
                title={strings.requisitions.name}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.navigate(NAVIGATION.notification)}
            />
            {requisitionList?.length > 0 ? (
                <FlatList
                    data={requisitionList}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                        const formattedDateTime = formatDateTime(item.updatedAt);
                        const practName = practitionerName(item?.practitionerName);
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
                                            title={formattedDateTime.date}
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
                                            title={formattedDateTime.time}
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
                                    <View style={styles.details}>
                                        <TextView
                                            title={strings.requisitions.requestType}
                                            textStyle={styles.keyName}
                                            color={'rgba(0, 0, 0, 0.77)'}
                                        />
                                        <TextView
                                            title={
                                                item?.category
                                                    ? (item?.category[0]?.coding[0]?.display).split(
                                                          ' ',
                                                      )[0] == 'Laboratory'
                                                        ? 'Lab'
                                                        : (item?.category[0]?.coding[0]?.display).split(
                                                              ' ',
                                                          )[0]
                                                    : ''
                                            }
                                            textStyle={styles.value}
                                            color={'#000'}
                                        />
                                    </View>
                                </View>
                                <View style={styles.line}></View>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate(NAVIGATION.serviceRequestDetails, {
                                            serviceRequestId: item?.id,
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
