import {rescheduleAppointment, toggleLoader, updateAppointment} from '@/actions/AppointmentAction';
import {
    TYPES,
    listOrgSlots,
    listPractitionar,
    listSchedule,
    listServiceOrg,
    listSlots,
    requestAppointmentGetCare,
} from '@/actions/RequestGuidanceActions';
import {IMAGES} from '@/assets';
import {
    AppHeader,
    Button,
    DateTimePicker,
    ErrorView,
    Image,
    Loader,
    TextArea,
    TextView,
} from '@/components';
import {NAVIGATION, LOCATIONS} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/BookAppointment/GetCareForm.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DocumentPicker from 'react-native-document-picker';
import {Dropdown} from 'react-native-element-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '@/theme';
export function GetCareForm({navigation, route}) {
    const isReschedule = route?.params?.isReschedule;
    const existId = route?.params?.id;
    const appt_data = route?.params?.appt_data;
    const location = route?.params?.location || null;
    const scopeOfPractice = LOCATIONS[location] || null;
    const org_id = route?.params?.orgId || null;
    const dispatch = useDispatch();
    useEffect(() => {
        let params = {
            org_id: org_id,
            scopeOfPractice: scopeOfPractice
        };
        dispatch(listPractitionar(params));
        dispatch(listServiceOrg());
    }, []);
    const {requestGuidance} = useSelector(state => state);
    const {selected, questionnaireData} = useSelector(state => state.appointment);
    const description = route?.params?.description ?? '';
    const patientId = AuthHelper.getPatientId();
    const [practitionarId, setPractionarId] = useState(selected?.practitionerId ?? null);
    const [serviceCatId, setServiceCatId] = useState(null);
    const [serviceOrgCatId, setServiceOrgCatId] = useState(null);
    const [showCareDropdown, setShowCareDropdown] = useState(true);
    const [showOption, setShowOption] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [todayDate, setTodayDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [tomorrowDate, setTomorrowDate] = useState(
        moment(new Date()).add(1, 'd').format('YYYY-MM-DD'),
    );
    const isLoading = useSelector(state =>
        isLoadingSelector(
            [
                TYPES.APPOINTMENT,
                TYPES.LIST_SCHEDULE,
                TYPES.LIST_SLOTS,
                TYPES.LIST_ORG_SERVICE,
                TYPES.LIST_ORG_SLOTS,
            ],
            state,
        ),
    );

    const userLoading = useSelector(state => state.user.loader);
    const [providerView, setProviderView] = useState(true);

    const [showService, setShowService] = useState(false);
    const [seeMore, setSeeMore] = useState(12);
    const [orgSeeMore, setOrgSeeMore] = useState(10);
    const [slotStartTime, setSlotStartTime] = useState('');
    const [slotEndTime, setSlotEndTime] = useState('');
    const [slotOrgStartTime, setSlotOrgStartTime] = useState('');
    const [slotOrgEndTime, setSlotOrgEndTime] = useState('');
    const [titleError, setTitleError] = useState(null);
    const [descError, setDescError] = useState(null);
    const [selectTypeError, setSelectTypeError] = useState(null);
    const [providerError, setProviderError] = useState(null);
    const [selectedDateError, setSelectedDateError] = useState(null);
    const [slotsError, setSlotsError] = useState(null);
    // const [orgSlotsError, setOrgSlotsError] = useState(null);
    const [singleFile, setSingleFile] = useState('');
    const [fileName, setFileName] = useState(selected?.document?.url ?? '');
    const [multipleFileName, setMultipleFileName] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [slotsData, setSlotsData] = useState([]);
    const [orgSlotsData, setOrgSlotsData] = useState([]);
    const [isSlotsVisible, setSlotsVisible] = useState(false);
    const [slotsDate, setslotsDate] = useState([
        {
            id: 1,
            title: 'Today',
            date: todayDate,
            status: 0,
        },
        {
            id: 2,
            title: 'Tomorrow',
            date: tomorrowDate,
            status: 0,
        },
        {
            id: 3,
            title: 'Select date',
            status: 0,
            icon: IMAGES.icons.calendar,
            date: selectedDate,
        },
    ]);
    const [showLoader, setShowLoader] = useState(false);
    const selectProvider = () => {
        setShowCareDropdown(true);
    };

    const selectOrg = () => {
        setShowCareDropdown(false);
    };

    useEffect(() => {
        setShowLoader(userLoading);
    }, [userLoading]);

    useEffect(() => {
        // console.log(slotsData, 'slotsData........');
    }, [slotsData]);
    useEffect(() => {
        setProviderView(true);
    }, []);

    const getServiceCategory = (item, index) => {
        // console.log('getServiceCategory', showCareDropdown);
        setSlotsVisible(false);
        setSelectedDateError(null);
        if (item.id == 3) {
            setShowOption(true);
        } else {
            setShowOption(false);
            setSelectedDate(moment(item.date).format('YYYY-MM-DD'));
            if (showCareDropdown == false) {
                getOrgSlots(item.date);
            } else {
                let params = {
                    id: practitionarId,
                    date: moment(item.date).format('YYYY-MM-DD'),
                };
                dispatch(listSchedule(params));

                setShowService(true);
            }
        }
        const a = slotsDate;
        for (var i = 0; i < a.length; i++) {
            a[i].status = 0;
        }
        let targetItem = a[index];
        if (targetItem.status == 0) {
            targetItem.status = 1;
        } else {
            targetItem.status = 0;
        }
        a[index] = targetItem;
        setslotsDate(a => [...a]);
    };

    const getDateFromPicker = date => {
        setShowOption(false);
        setSelectedDate(moment(date).format('YYYY-MM-DD'));
        if (showCareDropdown == false) {
            getOrgSlots(date);
        } else {
            let params = {
                id: practitionarId,
                date: moment(date).format('YYYY-MM-DD'),
            };
            dispatch(listSchedule(params));
            setShowService(true);
        }
    };

    const getSlots = id => {
        setSlotsVisible(true);
        __DEV__ &&
            console.log(
                '***********selectdate',
                selectedDate,
                new Date(),
                moment(selectedDate).format('YYYY-MM-DD'),
            );
        let params = {
            actorId: practitionarId,
            date: selectedDate,
            serviceCatId: id,
        };
        dispatch(
            listSlots(params, res => {
                // console.log(res, 'res.....');
                if (selectedDate == todayDate) {
                    removeOverlappingAndPastSlots(res.data.availableSlots);
                } else {
                    setSlotsData(res.data.availableSlots);
                }
            }),
        );
    };

    function removeOverlappingAndPastSlots(slots) {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        // console.log(slots, 'slots.....');
        const filteredSlots = slots.filter(slot => {
            const [startHour, startMinute] = slot.start.split(':');
            const [endHour, endMinute] = slot.end.split(':');
            if (
                currentHour > parseInt(endHour) ||
                (currentHour === parseInt(endHour) && currentMinute >= parseInt(endMinute))
            ) {
                return false;
            }
            if (
                (currentHour > parseInt(startHour) && currentHour < parseInt(endHour)) ||
                (currentHour === parseInt(startHour) && currentMinute >= parseInt(startMinute))
            ) {
                return false;
            }
            return true;
        });
        // console.log(filteredSlots, 'filteredSlots......');
        // setSlotsData(filteredSlots);
        setSlotsData(slots);
        return filteredSlots;
    }

    const getOrgSlots = date => {
        // console.log('Orgggggg');
        let params = {
            date: moment(date).format('YYYY-MM-DD'),
            serviceCatId: serviceOrgCatId,
            patientId: AuthHelper.getPatientId(),
            org_id: org_id,
            scopeOfPractice: scopeOfPractice
        };
        dispatch(
            listOrgSlots(params, res => {
                if (date == todayDate) {
                    removeOrgEarlySlots(res.data.availableSlots);
                } else {
                    // console.log(res.data.availableSlots, 'res.data.availableSlots..');
                    setOrgSlotsData(res.data.availableSlots);
                }
            }),
        );
    };

    function removeOrgEarlySlots(slots) {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const filteredSlots = slots.filter(slot => {
            const [startHour, startMinute] = slot.start.split(':');
            const [endHour, endMinute] = slot.end.split(':');
            if (
                currentHour > parseInt(endHour) ||
                (currentHour === parseInt(endHour) && currentMinute >= parseInt(endMinute))
            ) {
                return false;
            }
            if (
                (currentHour > parseInt(startHour) && currentHour < parseInt(endHour)) ||
                (currentHour === parseInt(startHour) && currentMinute >= parseInt(startMinute))
            ) {
                return false;
            }
            return true;
        });
        __DEV__ && console.log('filteredSlots', filteredSlots);
        setOrgSlotsData(filteredSlots);
    }

    let simpledata =
        requestGuidance &&
        requestGuidance?.schedule &&
        requestGuidance?.schedule[0]?.serviceCategory
            ? requestGuidance?.schedule[0]?.serviceCategory
            : [];
    let filterDataNew = simpledata?.filter(
        categoryData => moment(categoryData?.date?.split('T')?.[0]).day() === moment().day(),
    );
    let filterData = [];
    const uniqueValues = new Set();

    for (const obj of filterDataNew) {
        const value = obj['id'];

        if (!uniqueValues.has(value)) {
            uniqueValues.add(value);
            filterData.push(obj);
        }
    }

    const selectSlot = (item, index) => {
        setSlotStartTime(item.start);
        setSlotEndTime(item.end);
        const a = slotsData;
        for (var i = 0; i < a.length; i++) {
            a[i].status = 0;
        }
        let targetItem = a[index];
        if (targetItem.status == 0) {
            targetItem.status = 1;
        } else {
            targetItem.status = 0;
        }
        a[index] = targetItem;
        setSlotsData(a => [...a]);
    };

    const selectOrgSlot = (item, index) => {
        setSlotOrgStartTime(item.start);
        setSlotOrgEndTime(item.end);
        const a = orgSlotsData;
        for (var i = 0; i < a.length; i++) {
            a[i].status = 0;
        }
        let targetItem = a[index];
        if (targetItem.status == 0) {
            targetItem.status = 1;
        } else {
            targetItem.status = 0;
        }
        a[index] = targetItem;
        setOrgSlotsData(a => [...a]);
    };

    const renderItem = item => {
        return <TextView title={item.name[0].text} viewStyle={styles.item} />;
    };

    const renderServiceCat = item => {
        return <TextView title={item.name} viewStyle={styles.item} />;
    };
    const renderOrgServiceCat = item => {
        return <TextView title={item.name} viewStyle={styles.item} />;
    };

    const handleSeeMore = () => {
        setSeeMore(seeMore + 6);
    };
    const handleOrgSeeMore = () => {
        setOrgSeeMore(orgSeeMore + 6);
    };

    const normalize = path => {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            const filePrefix = 'file://';
            if (path.startsWith(filePrefix)) {
                path = path.substring(filePrefix.length);
                try {
                    path = decodeURI(path);
                } catch (e) {}
            }
        }
        return path;
    };

    const checkValidExtension = files => {
        let allowedTypes = [
            'image/jpeg',
            'image/heic',
            'image/jpg',
            'image/png',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        let isValidFiles = files.every(file =>
            allowedTypes.includes(file.type ? file.type : file.mime),
        );
        return !isValidFiles ? false : true;
    };
    const selectMultipleFiles = async () => {
        try {
            const allowedTypes = [
                DocumentPicker.types.images,
                DocumentPicker.types.pdf,
                DocumentPicker.types.doc,
                DocumentPicker.types.docx,
            ];

            // const results = await DocumentPicker.pickMultiple({
            //   type: allowedTypes,
            // });
            const results = await DocumentPicker.pick({
                allowMultiSelection: true,
                type: allowedTypes,
            });

            if (results && results.length > 0) {
                if (!checkValidExtension(results)) {
                    Alert.alert('Invalid file type. Supported file types are JPG, PNG, Word, Pdf');
                } else if (results.some(file => file.size / (1024 * 1024) > 5)) {
                    Alert.alert('Please select files with size less than 5 MB');
                } else if (results.some(file => file.size == 0)) {
                    Alert.alert('Please select files with size greater than 0 KB');
                } else if (results.length > 6 || multipleFileName.concat(results).length > 6) {
                    Alert.alert('Please select maximum 6 documents.');
                } else {
                    let fileArray = [];
                    dispatch(toggleLoader(true));
                    for (let [index, file] of results.entries()) {
                        try {
                            const file_uri = await ReactNativeBlobUtil.fs.readFile(
                                normalize(file.uri),
                                'base64',
                            );
                            let baseUrl = `${file_uri}`;
                            let extension = file.name.split('.').pop();
                            fileArray.push({
                                data: baseUrl, // Set the base64 encoded data
                                extension: extension, // Set the extracted extension
                                name: file.name, // Set the extracted extension
                            });
                        } catch (error) {
                            console.error(`Error reading file ${filePath}: ${error}`);
                        }
                    }
                    setModalVisible(false);
                    dispatch(toggleLoader(false));
                    setMultipleFileName(multipleFileName.concat(fileArray.filter(m => m.data)));
                }
            } else {
                dispatch(toggleLoader(false));
            }
        } catch (error) {
            dispatch(toggleLoader(false));
        }
    };

    const handleRemoveImage = index => {
        const updatedFiles = [...multipleFileName];
        updatedFiles.splice(index, 1);
        setMultipleFileName(updatedFiles);
    };
    const submitProviderValidate = () => {
        // navigation.push(NAVIGATION.appointmentSent)
        if (practitionarId == null) {
            Validate.errorDisplay('Please select a provider', setProviderError);
            return;
        } else {
            setProviderView(false);
        }
    };
    const submitProvider = () => {
        // if (Validate.empty(description)) {
        //     Validate.errorDisplay('Description should not be empty', setDescError);
        //     return;
        // } else if (description.length > 250) {
        //     Validate.errorDisplay(
        //         'Description should not be more than 250 characters',
        //         setDescError,
        //     );
        //     return;
        // } else 
        if (selectedDate == null) {
            Validate.errorDisplay('Please select a date', setSelectedDateError);
            return;
        } else if (
            showCareDropdown ? Validate.empty(slotStartTime) : Validate.empty(slotOrgStartTime)
        ) {
            Alert.alert('Please pick a slot');
            return;
        } else if (multipleFileName.length > 6) {
            Alert.alert('Please select maximum 6 documents.');
            return;
        }
        const request = {
            requestType: 'provider',
            status: 'proposed',
            description: description,
            practitionerId: practitionarId,
            comment: description,
            patientId: patientId,
            requestedPeriod: [
                {
                    start: selectedDate + 'T' + slotStartTime + ':00Z',
                    end: selectedDate + 'T' + slotEndTime + ':00Z',
                    //  start:moment(`${selectedDate} ${slotStartTime}`, 'YYYY-MM-DD HH:mm').format(),
                    //  end: moment(`${selectedDate} ${slotEndTime}`, 'YYYY-MM-DD HH:mm').format(),
                },
            ],
            document: multipleFileName,
            patientLocation: scopeOfPractice
        };
        const requestReschedule = {
            requestType: 'provider',
            status: 'proposed',
            description: description,
            practitionerId: practitionarId,
            comment: description,
            patientId: patientId,
            existingAppointmentId: existId,
            isReschedule: true,
            patientLocation: appt_data?.patientLocation,
            requestedPeriod: [
                {
                    start: selectedDate + 'T' + slotStartTime + ':00Z',
                    end: selectedDate + 'T' + slotEndTime + ':00Z',
                    //  start:moment(`${selectedDate} ${slotStartTime}`, 'YYYY-MM-DD HH:mm').format(),
                    //  end: moment(`${selectedDate} ${slotEndTime}`, 'YYYY-MM-DD HH:mm').format(),
                },
            ],
            document: multipleFileName,
            slotId: selected?.slotId,
        };


        // console.log("REQUEST", JSON.stringify(request, undefined, 4));

        dispatch(
            requestAppointmentGetCare(isReschedule == true ? requestReschedule : request, res => {
                if (res) {
                    if (existId && appt_data) {
                        let params = {
                            id: appt_data?.id,
                            status: 'cancelled',
                            patientId: appt_data?.patientId,
                            practitionerId: appt_data?.practitionerId,
                            isFromWeb: false,
                        };
                        dispatch(
                            updateAppointment(params, false, res => {
                                if (res.status) {
                                    let params = {
                                        appointmentId: appt_data.id,
                                    };
                                    dispatch(rescheduleAppointment(params));
                                } else {
                                    Alert.alert(res.message);
                                }
                            }),
                        );
                    }
                }
            }),
        );
        // navigation.push(NAVIGATION.appointmentSent)
    };
    const submitOrgValidate = () => {
        setProviderView(false);
    };
    const submitOrg = () => {
        // if (Validate.empty(description)) {
        //     Validate.errorDisplay('Description should not be empty', setDescError);
        //     return;
        // } else if (description.length > 250) {
        //     Validate.errorDisplay(
        //         'Description should not be more than 250 characters',
        //         setDescError,
        //     );
        //     return;
        // } else 
        if (Validate.empty(serviceOrgCatId)) {
            Validate.errorDisplay('Please select a Type', setSelectTypeError);
            return;
        } else if (selectedDate == null) {
            Validate.errorDisplay('Please select a date', setSelectedDateError);
            return;
        } else if (Validate.empty(slotOrgStartTime)) {
            Alert.alert('Please pick a slot');
            return;
        } else if (multipleFileName.length > 6) {
            Alert.alert('Please select maximum 6 documents.');
        } else {
            const request = {
                requestType: 'organization',
                status: 'proposed',
                description: description,
                comment: description,
                patientId: patientId,

                requestedPeriod: [
                    {
                        start: selectedDate + 'T' + slotOrgStartTime + ':00Z',
                        end: selectedDate + 'T' + slotOrgEndTime + ':00Z',
                        //  start:moment(`${selectedDate} ${slotOrgStartTime}`, 'YYYY-MM-DD HH:mm').format(),
                        //  end: moment(`${selectedDate} ${slotOrgEndTime}`, 'YYYY-MM-DD HH:mm').format(),
                    },
                ],
                document: multipleFileName,
                patientLocation: scopeOfPractice
            };

            const requestRescheduleOrg = {
                requestType: 'organization',
                status: 'proposed',
                description: description,
                comment: description,
                patientId: patientId,
                existingAppointmentId: existId,
                patientLocation: appt_data?.patientLocation,
                requestedPeriod: [
                    {
                        start: selectedDate + 'T' + slotOrgStartTime + ':00Z',
                        end: selectedDate + 'T' + slotOrgEndTime + ':00Z',
                        //  start:moment(`${selectedDate} ${slotOrgStartTime}`, 'YYYY-MM-DD HH:mm').format(),
                        //  end: moment(`${selectedDate} ${slotOrgEndTime}`, 'YYYY-MM-DD HH:mm').format(),
                    },
                ],
                document: multipleFileName,
                slotId: selected?.slotId,
            };
            dispatch(
                requestAppointmentGetCare(
                    isReschedule == true ? requestRescheduleOrg : request,
                    res => {
                        if (res) {
                            if (existId && appt_data) {
                                let params = {
                                    id: appt_data?.id,
                                    status: 'cancelled',
                                    patientId: appt_data?.patientId,
                                    practitionerId: appt_data?.practitionerId,
                                    isFromWeb: false,
                                };
                                dispatch(
                                    updateAppointment(params, false, res => {
                                        if (res.status) {
                                            let params = {
                                                appointmentId: appt_data.id,
                                            };
                                            dispatch(rescheduleAppointment(params));
                                        } else {
                                            Alert.alert(res.message);
                                        }
                                    }),
                                );
                            }
                        }
                    },
                ),
            );
            // navigation.push(NAVIGATION.appointmentSent)
        }
    };

    // const setText = text => {
    //     setTitleError(null);
    // };
    // const setDesc = text => {
    //     setDescription(text);
    //     setDescError(null);
    // };
    // const openMedia = async () => {
    //   await ImagePicker.openPicker({
    //     cropping: true,
    //     multiple: true,
    //     mediaType: 'photo',
    //     includeBase64: true,
    //   }).then(image => {
    //     setModalVisible(false);
    //     let baseUrl = `data:${image.mime};base64,${image.data}`;
    //     // setFileName(
    //     //   Platform.OS === 'ios'
    //     //     ? image.filename
    //     //     : image.path.replace(/^.*[\\\/]/, ''),
    //     // );
    //     setSingleFile(baseUrl);
    //   });
    // };

    const openMedia = async () => {
        try {
            const images = await ImagePicker.openPicker({
                cropping: true,
                multiple: true,
                mediaType: 'photo',
                includeBase64: true,
            });
            // Process the selected images and set the state
            if (images && images.length > 0) {
                if (!checkValidExtension(images)) {
                    Alert.alert('Invalid file type. Suported file types are JPG, PNG, Word, Pdf');
                } else if (images.some(img => img.size / (1024 * 1024) > 5)) {
                    /**Add check if any file size is greater than 5 MB */
                    Alert.alert('Please select files with size less than 5 MB');
                } else if (images.length > 6 || multipleFileName.concat(images).length > 6) {
                    Alert.alert('Please select maximum 6 documents.');
                } else {
                    const imageArray = images.map(image => {
                        //let baseUrl = `data:${image.mime};base64,${image.data}`;
                        let baseUrl = `${image.data}`;
                        let fileName = image.path.split('/').pop(); // Extract the file name from the path
                        let extension = fileName.split('.').pop(); // Extract the extension from the file name
                        return {
                            data: baseUrl, // Set the base64 encoded data
                            extension: extension, // Set the extracted extension
                            name: fileName,
                        };
                    });
                    setModalVisible(false);
                    setMultipleFileName(multipleFileName.concat(imageArray));
                }
            } else {
                // No images selected, handle the case if required.
            }
        } catch (error) {
            // Handle error if any
            console.log('Error while selecting images:', error);
        }
    };

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}>
            <AppHeader
                // title={strings.requestGuidance.title}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.push(NAVIGATION.notification)}
            />
            <Loader isLoading={isLoading} />
            <Loader isLoading={showLoader} />
            <View
                style={{
                    paddingHorizontal: moderateScale(20),
                }}>
                {providerView ? (
                    <>
                        <View style={{marginVertical: moderateScale(20)}}>
                            <TextView
                                title={strings.bookAppointment.whichProvider}
                                textStyle={styles.header}
                            />
                            {/* <TextView
                  title={strings.requestGuidance.subheader}
                  textStyle={styles.subHeader}
                  color={'rgba(0, 0, 0, 0.37)'}
                /> */}
                        </View>
                        <View style={{marginTop: moderateScale(15)}}>
                            <TouchableOpacity onPress={selectProvider} style={styles.listContainer}>
                                <View style={styles.listImgContainer}>
                                    <TextView title={'PCP'} textStyle={styles.listTxt} />
                                </View>

                                <Image
                                    source={
                                        showCareDropdown
                                            ? IMAGES.bluetooth.checkedCircle
                                            : IMAGES.bluetooth.uncheckedCircle
                                    }
                                />
                            </TouchableOpacity>
                            {showCareDropdown && (
                                <View style={{marginTop: 2, marginBottom: 13}}>
                                    <TextView
                                        title={strings.bookAppointment.care}
                                        viewStyle={styles.genderTitleContainer}
                                        textStyle={styles.genderTitle}
                                    />
                                    <Dropdown
                                        style={styles.dropdown}
                                        data={requestGuidance?.list}
                                        maxHeight={300}
                                        labelField={'name[0].text'}
                                        placeholderStyle={styles.input}
                                        selectedTextStyle={styles.input}
                                        itemTextStyle={styles.input}
                                        valueField="id"
                                        placeholder="Select"
                                        value={practitionarId}
                                        onFocus={() => {}}
                                        onBlur={() => {}}
                                        onChange={item => {
                                            setPractionarId(item.id);

                                            setProviderError(null);
                                            // getServiceCategory(item.id);
                                        }}
                                        renderItem={renderItem}
                                    />
                                    <ErrorView message={providerError} />
                                </View>
                            )}
                            <TouchableOpacity onPress={selectOrg} style={styles.listContainer}>
                                <View style={styles.listImgContainer}>
                                    <TextView title={'No Preference'} textStyle={styles.listTxt} />
                                </View>

                                <Image
                                    source={
                                        showCareDropdown
                                            ? IMAGES.bluetooth.uncheckedCircle
                                            : IMAGES.bluetooth.checkedCircle
                                    }
                                />
                            </TouchableOpacity>
                        </View>

                        <Button
                            title={strings.buttons.next}
                            style={styles.nextBtn}
                            textStyle={styles.btnText2}
                            onPress={() =>
                                showCareDropdown ? submitProviderValidate() : submitOrgValidate()
                            }
                            // onPress={() => { setProviderView(false) }}
                        />
                    </>
                ) : (
                    <>
                        {/* <TextView
                            title={strings.requestGuidance.header}
                            textStyle={styles.header}
                        />
                        <TextView
                            title={strings.requestGuidance.subheader}
                            textStyle={styles.subHeader}
                            color={'rgba(0, 0, 0, 0.37)'}
                        /> */}
                        {/* <TextView
                            textStyle={styles.dscriptionHeader}
                            title={strings.getCare.reason}
                        /> */}
                        {/* <TextArea
                            title={strings.getCare.reason}
                            customTitleStyle={styles.dscriptionHeader}
                            autoCapitalize="none"
                            accessibilityHint={strings.disease.desc}
                            accessibilityLabel={strings.disease.desc}
                            onChangeText={text => setDesc(text)}
                            placeholder={strings.disease.placeholderDesc}
                            value={description}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <ErrorView message={descError} /> */}
                        <TextView
                            title={'When would you like to schedule your appointment?'}
                            textStyle={styles.header}
                            viewStyle={{marginTop: 20}}
                        />
                        {!showCareDropdown && (
                            <>
                                <View style={{marginTop: 2}}>
                                    <TextView
                                        title={strings.requestGuidance.appointmentType}
                                        viewStyle={styles.genderTitleContainer}
                                        textStyle={styles.genderTitle}
                                    />
                                    <Dropdown
                                        style={styles.dropdown}
                                        data={requestGuidance?.orgServiceCategories}
                                        maxHeight={300}
                                        labelField={strings.requestGuidance.name}
                                        valueField="id"
                                        placeholder={strings.requestGuidance.selectType}
                                        placeholderStyle={styles.input}
                                        selectedTextStyle={styles.input}
                                        itemTextStyle={styles.input}
                                        value={serviceOrgCatId}
                                        onFocus={() => {}}
                                        onBlur={() => {}}
                                        onChange={item => {
                                            setServiceOrgCatId(item.id);
                                            setSelectTypeError(null);
                                            // getOrgSlots(item.id);
                                            // getServiceCategory(item.id);
                                        }}
                                        renderItem={renderOrgServiceCat}
                                    />
                                </View>
                                <ErrorView message={selectTypeError} />
                            </>
                        )}
                        <TextView title={'Select Date'} textStyle={styles.urgencyTitle} />
                        <View
                            style={{
                                height: moderateScale(90),
                                backgroundColor: 'rgba(217, 217, 217, 0.32)',
                                borderRadius: moderateScale(10),
                                padding: moderateScale(10),
                            }}>
                            <FlatList
                                extraData={slotsDate}
                                numColumns={3}
                                columnWrapperStyle={{
                                    justifyContent: 'space-between',
                                }}
                                data={slotsDate}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => {
                                    return (
                                        <>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    getServiceCategory(item, index);
                                                }}
                                                style={[
                                                    styles.dateContainer,
                                                    {
                                                        height: moderateScale(70),
                                                        backgroundColor: '#fff',
                                                        borderRadius: moderateScale(10),
                                                        borderColor:
                                                            item.status == 1 ? '#005DA8' : 'white',
                                                        borderWidth: 1,
                                                        width: moderateScale(100),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    },
                                                ]}>
                                                {item.id === 3 ? (
                                                    <View style={{alignItems: 'center'}}>
                                                        <Image source={item.icon} />
                                                        <TextView
                                                            textStyle={styles.dateText}
                                                            title={
                                                                selectedDate !== null
                                                                    ? moment(selectedDate).format(
                                                                          'DD MMM, ddd',
                                                                      )
                                                                    : item.title
                                                            }
                                                        />
                                                    </View>
                                                ) : (
                                                    <View style={{alignItems: 'center'}}>
                                                        <TextView
                                                            title={item.title}
                                                            color={'#000'}
                                                            viewStyle={{paddingBottom: 3}}
                                                            textStyle={styles.dateText1}
                                                        />
                                                        <TextView
                                                            title={moment(item.date).format(
                                                                'DD MMM, ddd',
                                                            )}
                                                            color={'#00000099'}
                                                            textStyle={styles.dateText}
                                                        />
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </>
                                    );
                                }}
                            />

                            {showOption && (
                                <DateTimePicker
                                    chooseDate={getDateFromPicker}
                                    hideDatePicker={() => setShowOption(false)}
                                    minimumDate={moment().add(2, 'd').toDate()}
                                    // maximumDate={new Date()}
                                    //  maximumDate={moment(new Date()).add(2, 'd')}
                                />
                            )}

                            {/* 
           <TouchableOpacity
            onPress={() => getTodayServiceCategory()}
            style={{
              height: moderateScale(70),
              backgroundColor: '#fff',
              borderRadius: moderateScale(10),

              width: '33.3%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextView title={'Today'} />
            <TextView title={todayDate} />
          </TouchableOpacity>
         
          <TouchableOpacity
            style={{
              height: moderateScale(70),
              borderRadius: moderateScale(10),
              width: '33.3%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextView title={'Tomorrow'} />
            <TextView title={tomorrowDate} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: moderateScale(70),
              backgroundColor: '#fff',
              borderRadius: moderateScale(10),
              width: '33.3%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={IMAGES.icons.calendar} />
            <TextView title={'Select Date'} />
          </TouchableOpacity>
           */}
                        </View>
                        <ErrorView message={selectedDateError} />
                        {showCareDropdown &&
                        showService &&
                        requestGuidance &&
                        requestGuidance.schedule &&
                        requestGuidance?.schedule.length > 0 ? (
                            <View style={{marginTop: 10}}>
                                <TextView
                                    title={strings.requestGuidance.appointmentType}
                                    viewStyle={styles.genderTitleContainer}
                                    textStyle={styles.genderTitle}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    data={filterData}
                                    placeholderStyle={styles.input}
                                    selectedTextStyle={styles.input}
                                    maxHeight={300}
                                    labelField={'name'}
                                    valueField="id"
                                    placeholder="Select Type"
                                    value={serviceCatId}
                                    onFocus={() => {}}
                                    onBlur={() => {}}
                                    onChange={item => {
                                        setServiceCatId(item.id);
                                        getSlots(item.id);
                                        // getServiceCategory(item.id);
                                    }}
                                    renderItem={renderServiceCat}
                                />
                            </View>
                        ) : null}
                        <View>
                            {showCareDropdown &&
                            requestGuidance &&
                            requestGuidance.schedule &&
                            requestGuidance.schedule.length > 0 &&
                            isSlotsVisible == true &&
                            slotsData ? (
                                <FlatList
                                    data={slotsData.slice(0, seeMore)}
                                    extraData={slotsData}
                                    numColumns={3}
                                    columnWrapperStyle={{
                                        justifyContent: 'space-between',
                                        marginVertical: moderateScale(5),
                                    }}
                                    style={{
                                        marginVertical: moderateScale(10),
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({item, index}) => {
                                        // console.log(item, 'item...');
                                        let dateInUtc = `${selectedDate}T${item?.start}:00Z`;
                                        let localTime = moment(dateInUtc).format('HH:mm');
                                        return (
                                            <>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        selectSlot(item, index);
                                                    }}
                                                    style={[
                                                        styles.startContainer,
                                                        {
                                                            borderColor:
                                                                item.status == 1
                                                                    ? '#005DA8'
                                                                    : 'white',
                                                            borderWidth: item.status == 1 ? 1 : 0,
                                                        },
                                                    ]}>
                                                    <Text style={styles.time}> {localTime}</Text>
                                                </TouchableOpacity>
                                            </>
                                        );
                                    }}
                                />
                            ) : null}

                            <ErrorView message={slotsError} />
                            {showCareDropdown &&
                            requestGuidance &&
                            requestGuidance.schedule &&
                            requestGuidance.schedule.length > 0 &&
                            isSlotsVisible == true &&
                            slotsData?.length > 12 ? (
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <TouchableOpacity
                                        onPress={() => handleSeeMore()}
                                        style={styles.seeMore1}>
                                        <TextView
                                            title={strings.requestGuidance.seeMore}
                                            textStyle={styles.seeMore}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>
                        {!showCareDropdown &&
                        requestGuidance?.orgServiceCategories?.length > 0 &&
                        orgSlotsData.length > 0 ? (
                            <FlatList
                                data={orgSlotsData.slice(0, orgSeeMore)}
                                extraData={orgSlotsData}
                                numColumns={3}
                                columnWrapperStyle={{
                                    justifyContent: 'space-between',
                                    marginVertical: moderateScale(5),
                                }}
                                style={{
                                    marginVertical: moderateScale(10),
                                }}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => {
                                    let dateInUtc = `${selectedDate}T${item?.start}:00Z`;
                                    let localTime = moment(dateInUtc).format('HH:mm');
                                    return (
                                        <>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    selectOrgSlot(item, index);
                                                }}
                                                style={[
                                                    styles.startContainer,
                                                    {
                                                        borderColor:
                                                            item.status == 1 ? '#005DA8' : 'white',
                                                        borderWidth: item.status == 1 ? 1 : 0,
                                                    },
                                                ]}>
                                                <Text style={styles.time}> {localTime}</Text>
                                            </TouchableOpacity>
                                        </>
                                    );
                                }}
                            />
                        ) : null}
                        {!showCareDropdown &&
                        requestGuidance?.orgServiceCategories?.length > 0 &&
                        orgSlotsData.length > 12 ? (
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity
                                    onPress={() => handleOrgSeeMore()}
                                    style={styles.seeMoreContainer}>
                                    <TextView title={'See more'} textStyle={styles.seeMore} />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                        {/* 
             <View
            style={{
              height: moderateScale(50),
              backgroundColor: 'rgba(217, 217, 217, 0.32)',
              borderRadius: moderateScale(10),
              flexDirection: 'row',
              width: '32%',
              // justifyContent: 'space-around',
              alignItems: 'center',
              paddingHorizontal: moderateScale(10),
            }}></View>

             <View
            style={{
              height: moderateScale(50),
              backgroundColor: 'rgba(217, 217, 217, 0.32)',
              borderRadius: moderateScale(10),
              flexDirection: 'row',
              width: '32%',
              // justifyContent: 'space-around',
              alignItems: 'center',
              paddingHorizontal: moderateScale(10),
            }}></View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              height: moderateScale(50),
              backgroundColor: 'rgba(217, 217, 217, 0.32)',
              borderRadius: moderateScale(10),
              flexDirection: 'row',
              width: '32%',
              // justifyContent: 'space-around',
              alignItems: 'center',
              paddingHorizontal: moderateScale(10),
            }}></View>
          <View
            style={{
              height: moderateScale(50),
              backgroundColor: 'rgba(217, 217, 217, 0.32)',
              borderRadius: moderateScale(10),
              flexDirection: 'row',
              width: '32%',
              // justifyContent: 'space-around',
              alignItems: 'center',
              paddingHorizontal: moderateScale(10),
            }}></View>
          <View
            style={{
              height: moderateScale(50),
              backgroundColor: 'rgba(217, 217, 217, 0.32)',
              borderRadius: moderateScale(10),
              flexDirection: 'row',
              width: '32%',
              // justifyContent: 'space-around',
              alignItems: 'center',
              paddingHorizontal: moderateScale(10),
            }}></View>
        </View>
         <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: moderateScale(15),
            }}>
            <View
              style={{
                height: moderateScale(50),
                backgroundColor: 'rgba(217, 217, 217, 0.32)',
                borderRadius: moderateScale(10),
                flexDirection: 'row',
                width: '32%',
                // justifyContent: 'space-around',
                alignItems: 'center',
                paddingHorizontal: moderateScale(10),
              }}></View>
            <View
              style={{
                height: moderateScale(50),
                backgroundColor: 'rgba(217, 217, 217, 0.32)',
                borderRadius: moderateScale(10),
                flexDirection: 'row',
                width: '32%',
                // justifyContent: 'space-around',
                alignItems: 'center',
                paddingHorizontal: moderateScale(10),
              }}></View>
            <View
              style={{
                height: moderateScale(50),
                backgroundColor: 'rgba(217, 217, 217, 0.32)',
                borderRadius: moderateScale(10),
                flexDirection: 'row',
                width: '32%',
                // justifyContent: 'space-around',
                alignItems: 'center',
                paddingHorizontal: moderateScale(10),
              }}></View>
          </View>
            */}
                        <TextView
                            title={strings.bookAppointment.attachOptional}
                            viewStyle={styles.attachTitleView}
                            textStyle={styles.attachTitle}
                        />
                        {/* {multipleFileName.map((item, key) => (
          <View key={key}>
            <Text style={styles.textStyle}>{item.name ? item.name : ''}</Text>
          </View>
        ))} */}
                        {multipleFileName.map((item, key) => (
                            <View key={key} style={styles.fileNameContainer}>
                                <TextView
                                    title={item.name ? item.name : ''}
                                    viewStyle={styles.attachFileView}
                                    textStyle={styles.attachFile}
                                    color={'green'}
                                />
                                <TouchableOpacity
                                    onPress={() => handleRemoveImage(key)} // Remove the specific image by its index
                                    style={styles.closeContainer}>
                                    <Image
                                        source={IMAGES.icons.common.close}
                                        imageStyle={styles.closeIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                        {/* {fileName ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TextView
                    title={fileName}
                    viewStyle={styles.attachFileView}
                    textStyle={styles.attachFile}
                    color={'green'}
                  />
                  <TouchableOpacity
                    onPress={() => setFileName('')}
                    style={{
                      flex: 0.12,
                      alignSelf: 'center',
                      borderWidth: 1,
                      height: moderateScale(35),
                      borderRadius: 10,
                    }}>
                    <Image
                      source={IMAGES.icons.common.close}
                      imageStyle={{
                        width: moderateScale(12),
                        height: moderateScale(12),
                        alignSelf: 'center',
                        marginTop: moderateScale(10),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : null} */}
                        <TouchableOpacity
                            style={styles.upload}
                            onPress={() => setModalVisible(true)}>
                            <Image source={IMAGES.icons.upload} />
                            <View>
                                <TextView
                                    title={strings.requestGuidance.upload}
                                    color={'rgba(0, 0, 0, 0.63)'}
                                    textStyle={styles.uploadtxt}
                                />
                                <TextView
                                    title={strings.bookAppointment.format}
                                    color={'rgba(0, 0, 0, 0.63)'}
                                    textStyle={styles.formatTxt}
                                />
                            </View>
                        </TouchableOpacity>
                        <Modal
                            visible={modalVisible}
                            animationType="slide"
                            transparent={true}
                            onBackdropPress={() => {
                                setModalVisible(false);
                            }}
                            onRequestClose={() => {
                                setModalVisible(false);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Pressable
                                        style={styles.button}
                                        onPress={() => setModalVisible(!modalVisible)}>
                                        <Image source={IMAGES.icons.common.close} />
                                    </Pressable>

                                    <View style={styles.attachmentView}>
                                        <TouchableOpacity
                                            onPress={openMedia}
                                            style={{
                                                alignSelf: 'flex-end',
                                            }}>
                                            <Image source={IMAGES.icons.media} style={{}} />
                                            <Text style={styles.attachementText}>
                                                {strings.requestGuidance.media}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={selectMultipleFiles}>
                                            <Image source={IMAGES.icons.file} />
                                            <Text style={styles.attachementText}>
                                                {strings.requestGuidance.attachment}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <Button
                            title={strings.buttons.request}
                            style={styles.btn}
                            textStyle={styles.btnText2}
                            onPress={() => (showCareDropdown ? submitProvider() : submitOrg())}
                        />
                    </>
                )}
            </View>
        </KeyboardAwareScrollView>
    );
}
