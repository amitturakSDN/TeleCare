import React, {useState, useEffect} from 'react';
import {
    rescheduleAppointment,
    toggleLoader,
    updateAppointment,
    createEncounter,
} from '@/actions/AppointmentAction';
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
} from '@/components';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {strings} from '@/localization';
import {IMAGES} from '@/assets';
import {moderateScale} from '@/hooks/scale';
import {NAVIGATION, LOCATIONS} from '@/constants';
import {styles} from '@/screens/EnterWaitingRoom/EnterWaitingRoom.styles';
import {Dropdown} from 'react-native-element-dropdown';
import {AuthHelper, Validate} from '@/helpers';
import DocumentPicker from 'react-native-document-picker';
import {
    TYPES,
    listPractitionar,
    listSchedule,
    listSlots,
    listServiceOrg,
    listOrgSlots,
    requestAppointment,
} from '@/actions/RequestGuidanceActions';
import {useDispatch, useSelector} from 'react-redux';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import moment from 'moment';
import {colors} from '@/theme';
export function EnterWaitingRoom({navigation, route}) {
    // const isReschedule = route?.params?.isReschedule;
    // const existId = route?.params?.id;
    const dispatch = useDispatch();
    // useEffect(() => {
    //   dispatch(listPractitionar());
    //   dispatch(listServiceOrg());
    // }, []);
    // const {requestGuidance} = useSelector(state => state);
    const location = route?.params?.location;
    const reason = route?.params?.description ?? '';
    const scopeOfJurisdiction = LOCATIONS[location];
    const {selected} = useSelector(state => state.appointment);
    const {user} = useSelector(state => state);
    const [orgId, setOrgId] = useState(user?.user?.orgId);
    const {questionnaireData} = useSelector(state => state.appointment);
    // const [title, setTitle] = useState(selected?.description ?? '');
    // const [description, setDescription] = useState(selected?.comment ?? '');
    const [description, setDescription] = useState(route?.params?.description || '');
    const [multipleFileName, setMultipleFileName] = useState([]);
    const patientId = AuthHelper.getPatientId();
    const [practitionarId, setPractionarId] = useState(selected?.practitionerId ?? null);
    const [encounter, setEncounter] = useState(null);

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
    const [showLoader, setShowLoader] = useState(false);
    // const [providerView, setProviderView] = useState(true);

    const [descError, setDescError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const sentWaitngRoomRequest = () => {
        const request = {
            status: 'arrived',
            statusHistory: [
                {
                    status: 'arrived',
                    period: {
                        start: moment().utc().format(),
                        end: null
                    }
                }
            ],
            type: 'VV',
            subject: {
                reference: `Patient/${AuthHelper.getPatientId()}`,
                type: 'Patient',
                display: AuthHelper.getUserName(),
            },
            participant: [],
            patientLocation: scopeOfJurisdiction,
            description: description,
            managingOrganization: {
                reference: `Organization/${orgId}`,
                type: 'Organization',
            },
        };

        // console.log("REQUEST", JSON.stringify(request, undefined, 4));

        dispatch(createEncounter(request)).then(result => {
            setEncounter(result);
            navigation.navigate(NAVIGATION.waitingTimer, result);
        });
        
    };

    const setDesc = text => {
        setDescription(text);
        setDescError(null);
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
    const handleRemoveImage = index => {
        const updatedFiles = [...multipleFileName];
        updatedFiles.splice(index, 1);
        setMultipleFileName(updatedFiles);
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
                {/* <TextView title={strings.disease.reason} textStyle={styles.header} />
        <TextArea
          autoCapitalize="none"
          accessibilityHint={strings.disease.desc}
          accessibilityLabel={strings.disease.desc}
          onChangeText={text => setDesc(text)}
          placeholder={strings.disease.placeholderDesc}
          value={description}
          // title={strings.disease.reason}
          multiline={true}
          numberOfLines={4}
        />
        <ErrorView message={descError} /> */}
                <TextView
                    title={strings.bookAppointment.attachOptional}
                    viewStyle={styles.attachTitleView}
                    textStyle={styles.attachTitle}
                />
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

                <TouchableOpacity style={styles.upload} onPress={() => setModalVisible(true)}>
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
                <Button
                    title={strings.waitingRoom.btnSendRequest}
                    style={styles.btn}
                    textStyle={styles.btnText2}
                    onPress={() => sentWaitngRoomRequest()}
                />
            </View>

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
        </KeyboardAwareScrollView>
    );
}
