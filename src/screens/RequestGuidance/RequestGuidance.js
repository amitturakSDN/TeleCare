import {
  AppHeader,
  Button,
  DateTimePicker,
  ErrorView,
  Image,
  Loader,
  TextArea,
  TextField,
  TextView,
} from '@/components';
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

import {
  rescheduleAppointment,
  updateAppointment,
} from '@/actions/AppointmentAction';
import {
  TYPES,
  listOrgSlots,
  listPractitionar,
  listSchedule,
  listServiceOrg,
  listSlots,
  requestAppointment,
} from '@/actions/RequestGuidanceActions';
import {IMAGES} from '@/assets';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/RequestGuidance/RequestGuidance.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import moment from 'moment';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DocumentPicker from 'react-native-document-picker';
import {Dropdown} from 'react-native-element-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';

export function RequestGuidance({navigation, route}) {
  const isReschedule = route?.params?.isReschedule;
  const existId = route?.params?.id;
  const appt_data = route?.params?.appt_data;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listPractitionar());
    dispatch(listServiceOrg());
  }, []);
  const {requestGuidance} = useSelector(state => state);
  const {selected} = useSelector(state => state.appointment);
  const [title, setTitle] = useState(selected?.description ?? '');
  const [description, setDescription] = useState(selected?.comment ?? '');
  const patientId = AuthHelper.getPatientId();
  const [practitionarId, setPractionarId] = useState(
    selected?.practitionerId ?? null,
  );
  const [serviceCatId, setServiceCatId] = useState(null);
  const [serviceOrgCatId, setServiceOrgCatId] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [showCareDropdown, setShowCareDropdown] = useState(true);
  const [label, setLabel] = useState(' ');
  const [showOption, setShowOption] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [todayDate, setTodayDate] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
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
  const [showService, setShowService] = useState(false);
  const [seeMore, setSeeMore] = useState(12);
  const [orgSeeMore, setOrgSeeMore] = useState(10);
  const [slotStartTime, setSlotStartTime] = useState('');
  const [slotEndTime, setSlotEndTime] = useState('');
  const [slotOrgStartTime, setSlotOrgStartTime] = useState('');
  const [slotOrgEndTime, setSlotOrgEndTime] = useState('');
  const [titleError, setTitleError] = useState(null);
  const [descError, setDescError] = useState(null);
  const [providerError, setProviderError] = useState(null);
  const [selectedDateError, setSelectedDateError] = useState(null);
  const [slotsError, setSlotsError] = useState(null);
  // const [orgSlotsError, setOrgSlotsError] = useState(null);
  const [singleFile, setSingleFile] = useState();
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
  const selectProvider = () => {
    setShowCareDropdown(true);
  };

  const selectOrg = () => {
    setShowCareDropdown(false);
  };

  const getServiceCategory = (item, index) => {
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

    let params = {
      actorId: practitionarId,
      date: selectedDate,
      serviceCatId: id,
    };
    dispatch(
      listSlots(params, res => {
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
    const filteredSlots = slots.filter(slot => {
      const [startHour, startMinute] = slot.start.split(':');
      const [endHour, endMinute] = slot.end.split(':');
      if (
        currentHour > parseInt(endHour) ||
        (currentHour === parseInt(endHour) &&
          currentMinute >= parseInt(endMinute))
      ) {
        return false;
      }
      if (
        (currentHour > parseInt(startHour) &&
          currentHour < parseInt(endHour)) ||
        (currentHour === parseInt(startHour) &&
          currentMinute >= parseInt(startMinute))
      ) {
        return false;
      }
      return true;
    });
    setSlotsData(filteredSlots);
    return filteredSlots;
  }

  const getOrgSlots = date => {
    let params = {
      date: moment(date).format('YYYY-MM-DD'),
      serviceCatId: serviceOrgCatId,
      patientId: AuthHelper.getPatientId(),
    };
    dispatch(
      listOrgSlots(params, res => {
        if (moment(date).format('YYYY-MM-DD') == todayDate) {
          removeOrgEarlySlots(res.data.availableSlots);
        } else {
          setOrgSlotsData(res.data.availableSlots);
        }
      }),
    );
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

  function removeOrgEarlySlots(slots) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const filteredSlots = slots.filter(slot => {
      const [startHour, startMinute] = slot.start.split(':');
      const [endHour, endMinute] = slot.end.split(':');
      if (
        currentHour > parseInt(endHour) ||
        (currentHour === parseInt(endHour) &&
          currentMinute >= parseInt(endMinute))
      ) {
        return false;
      }
      if (
        (currentHour > parseInt(startHour) &&
          currentHour < parseInt(endHour)) ||
        (currentHour === parseInt(startHour) &&
          currentMinute >= parseInt(startMinute))
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
  // let filterData = simpledata?.filter(
  //   categoryData =>
  //     moment(categoryData?.date?.split('T')?.[0]).day() === moment().day(),
  // );

  let filterData = [];
  const uniqueValues = new Set();

  for (const obj of simpledata) {
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

  const onFileSelect = async () => {
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
      const results = await DocumentPicker.pickSingle({
        type: allowedTypes,
        includeBase64: true,
        // allowMultiSelection: true,
        //There can me more options as well find above
      });
      if (results.size / (1024 * 1024) > 5) {
        Alert.alert('Please select files with size less than 5 MB');
      } else {
        let fileArray = [];
        ReactNativeBlobUtil.fs
          .readFile(normalize(results.uri), 'base64')
          .then(file_uri => {
            // let baseUrl = `data:${file.type};base64,${file_uri}`;
            let baseUrl = `${file_uri}`;
            let extension = results.name.split('.').pop(); // Extract the extension using the last period
            fileArray.push({
              data: baseUrl, // Set the base64 encoded data
              extension: extension, // Set the extracted extension
              name: results.name, // Set the extracted extension
            });
            setModalVisible(false);
            setMultipleFileName(fileArray);
          });
      }
    } catch (error) {
      // Handle error if any
      console.log('Error while selecting files:', error);
    }
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
  const handleRemoveImage = index => {
    const updatedFiles = [...multipleFileName];
    updatedFiles.splice(index, 1);
    setMultipleFileName(updatedFiles);
  };
  // const selectSingleFile = async () => {
  //   //Opening Document Picker for selection of multiple file
  //   try {
  //     const res = await DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.pdf],
  //       includeBase64: true,
  //       // allowMultiSelection: true,
  //       //There can me more options as well find above
  //     });
  //     setFileName(res.name);
  //     let baseUrl = `data:${res.type};base64,${res.uri}`;
  //     let extension = res.name.split('.').pop(); // Extract the extension using the last period
  //     let file = res.name;

  //     setSingleFile([{
  //       data: baseUrl, // Set the base64 encoded data
  //       extension: extension, // Set the extracted extension
  //       name: file, // Set the file name
  //     }]);
  //     setModalVisible(false);
  //     /*
  //       console.log('res : ' + JSON.stringify(res));
  //        for (const res of results) {
  //       //Printing the log realted to the file
  //       setMultipleFileName(results);
  //       let baseUrl = `data:${res.type};base64,${res.uri}`;
  //       setSingleFile(baseUrl);
  //     }
  //     */
  //   } catch (err) {
  //     //Handling any exception (If any)
  //     if (DocumentPicker.isCancel(err)) {
  //       //If user canceled the document selection
  //       // alert('Canceled from multiple doc picker');
  //     } else {
  //       //For Unknown Error
  //       Alert.alert('Unknown Error: ' + JSON.stringify(err));
  //       throw err;
  //     }
  //   }
  // };

  const submitProvider = () => {
    if (Validate.empty(title)) {
      Validate.errorDisplay('Title should not be empty', setTitleError);
      return;
    } else if (Validate.empty(description)) {
      Validate.errorDisplay('Description should not be empty', setDescError);
      return;
    } else if (description.length > 250) {
      Validate.errorDisplay(
        'Description should not be more than 250 characters',
        setDescError,
      );
      return;
    } else if (practitionarId == null) {
      Validate.errorDisplay('Please select a provider', setProviderError);
      return;
    } else if (selectedDate == null) {
      Validate.errorDisplay('Please select a date', setSelectedDateError);
      return;
    } else if (
      showCareDropdown
        ? Validate.empty(slotStartTime)
        : Validate.empty(slotOrgStartTime)
    ) {
      Alert.alert('Please pick a slot');
      return;
    } else {
      const request = {
        requestType: 'provider',
        status: 'proposed',
        description: title,
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
        // document: singleFile,
        document: multipleFileName,
      };
      const requestReschedule = {
        requestType: 'provider',
        status: 'proposed',
        description: title,
        practitionerId: practitionarId,
        comment: description,
        patientId: patientId,
        existingAppointmentId: existId,
        isReschedule: true,
        requestedPeriod: [
          {
            start: selectedDate + 'T' + slotStartTime + ':00Z',
            end: selectedDate + 'T' + slotEndTime + ':00Z',
            //  start:moment(`${selectedDate} ${slotStartTime}`, 'YYYY-MM-DD HH:mm').format(),
            //  end: moment(`${selectedDate} ${slotEndTime}`, 'YYYY-MM-DD HH:mm').format(),
          },
        ],
        // document: singleFile,
        document: multipleFileName,
      };

      /**Check if user is rescheduling the exisitng appointment */

      dispatch(
        requestAppointment(
          isReschedule == true ? requestReschedule : request,
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
    }
  };
  const submitOrg = () => {
    if (Validate.empty(title)) {
      Validate.errorDisplay('Title should not be empty', setTitleError);
      return;
    }
    if (Validate.empty(description)) {
      Validate.errorDisplay('Description should not be empty', setDescError);
      return;
    }
    if (selectedDate == null) {
      Validate.errorDisplay('Please select a date', setSelectedDateError);
      return;
    }
    if (Validate.empty(slotOrgStartTime)) {
      Alert.alert('Please pick a slot');
      return;
    } else {
      const request = {
        requestType: 'organization',
        status: 'proposed',
        description: title,
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
        document: singleFile,
      };

      const requestRescheduleOrg = {
        requestType: 'organization',
        status: 'proposed',
        description: title,
        comment: description,
        patientId: patientId,
        existingAppointmentId: existId,
        requestedPeriod: [
          {
            start: selectedDate + 'T' + slotOrgStartTime + ':00Z',
            end: selectedDate + 'T' + slotOrgEndTime + ':00Z',
            //  start:moment(`${selectedDate} ${slotOrgStartTime}`, 'YYYY-MM-DD HH:mm').format(),
            //  end: moment(`${selectedDate} ${slotOrgEndTime}`, 'YYYY-MM-DD HH:mm').format(),
          },
        ],
        document: singleFile,
      };
      dispatch(
        requestAppointment(
          isReschedule == true ? requestRescheduleOrg : request,
        ),
      );
    }
  };

  const setText = text => {
    setTitle(text);
    setTitleError(null);
  };
  const setDesc = text => {
    setDescription(text);
    setDescError(null);
  };

  const openMedia = async () => {
    try {
      const images = await ImagePicker.openPicker({
        cropping: true,
        multiple: false,
        mediaType: 'photo',
        includeBase64: true,
      });
      if (images.size / (1024 * 1024) > 5) {
        Alert.alert('Please select files with size less than 5 MB');
      } else {
        let imageArray = [];
        let fileName = images.path.split('/').pop(); // Extract the file name from the path
        let extension = fileName.split('.').pop(); // Extract the extension from the file name
        imageArray.push({
          data: `data:${images.mime};base64,${images.data}`,
          extension: extension,
          name: fileName,
        });
        setModalVisible(false);
        setMultipleFileName(imageArray);
        return;
        // const imageArray = images.map(image => {
        //   let baseUrl = `data:${image.mime};base64,${image.data}`;
        //   let fileName = image.path.split('/').pop(); // Extract the file name from the path
        //   let extension = fileName.split('.').pop(); // Extract the extension from the file name
        //   return {
        //     data: baseUrl, // Set the base64 encoded data
        //     extension: extension, // Set the extracted extension
        //     name:fileName
        //   };
        // });
        setModalVisible(false);
        setMultipleFileName(imageArray);
      }
      return;
      // Process the selected images and set the state
      if (images && images.length > 0) {
        /**Add check if any file size is greater than 5 MB */
        if (images.some(img => img.size / (1024 * 1024) > 5)) {
          Alert.alert('Please select files with size less than 5 MB');
        } else if (images.length > 5) {
          Alert.alert('Please select maximum 6 documents.');
        } else {
          const imageArray = images.map(image => {
            let baseUrl = `data:${image.mime};base64,${image.data}`;
            let fileName = image.path.split('/').pop(); // Extract the file name from the path
            let extension = fileName.split('.').pop(); // Extract the extension from the file name
            return {
              data: baseUrl, // Set the base64 encoded data
              extension: extension, // Set the extracted extension
              name: fileName,
            };
          });
          setModalVisible(false);
          setMultipleFileName(imageArray);
        }
      } else {
        // No images selected, handle the case if required.
      }
    } catch (error) {
      // Handle error if any
      console.log('Error while selecting images:', error);
    }
  };
  // const openMedia = async () => {
  //   await ImagePicker.openPicker({
  //     cropping: true,
  //     multiple: false,
  //     mediaType: 'photo',
  //     includeBase64: true,
  //   }).then(image => {
  //     setModalVisible(false);
  //     setFileName(Platform.OS === 'ios' ? image.filename : image.path.replace(/^.*[\\\/]/, ''));
  //     let baseUrl = `data:${image.mime};base64,${image.data}`;
  //     let extension = image.filename.split('.').pop(); // Extract the extension using the last period
  //     let file = Platform.OS === 'ios' ? image.filename : image.path.replace(/^.*[\\\/]/, '');

  //     setSingleFile([{
  //       data: baseUrl, // Set the base64 encoded data
  //       extension: extension, // Set the extracted extension
  //       name: file, // Set the file name
  //     }]);
  //   });
  // };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <AppHeader
        title={strings.requestGuidance.title}
        onBackPress={() => navigation.pop()}
        onRightPress={() => navigation.push(NAVIGATION.notification)}
      />
      <Loader isLoading={isLoading} />
      <View
        style={{
          paddingHorizontal: moderateScale(20),
        }}>
        {/* <View style={{marginVertical: moderateScale(20)}}>
          <TextView
            title={strings.requestGuidance.header}
            textStyle={styles.header}
          />
          <TextView
            title={strings.requestGuidance.subheader}
            textStyle={styles.subHeader}
            color={'rgba(0, 0, 0, 0.37)'}
          />
        </View> */}
        <View style={{marginTop: -20}}>
          <TextField
            autoCapitalize="none"
            accessibilityHint={strings.requestGuidance.requestTitle}
            accessibilityLabel={strings.requestGuidance.requestTitle}
            onChangeText={text => setText(text)}
            placeholder={strings.requestGuidance.requestTitle}
            value={title}
            title={strings.requestGuidance.requestTitle}
          />
          <ErrorView message={titleError} />
        </View>

        <View style={{flexDirection: 'row', marginTop: moderateScale(15)}}>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={selectProvider}>
            <Image
              source={
                showCareDropdown ? IMAGES.icons.radio1 : IMAGES.icons.radio
              }
              imageStyle={{width: moderateScale(20), height: moderateScale(20)}}
            />
            <TextView
              title={'Select Provider'}
              textStyle={styles.radioTxt}
              color={'rgba(0, 0, 0, 0.37);'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioContainer} onPress={selectOrg}>
            <Image
              source={
                showCareDropdown ? IMAGES.icons.radio : IMAGES.icons.radio1
              }
              imageStyle={{width: moderateScale(18), height: moderateScale(18)}}
            />
            <TextView
              title={'Organisation'}
              textStyle={styles.radioTxt}
              color={'rgba(0, 0, 0, 0.37);'}
            />
          </TouchableOpacity>
        </View>
        {showCareDropdown && (
          <View style={{marginTop: 2}}>
            <TextView
              title={strings.requestGuidance.care}
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
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setLabel(item?.name[0]?.text.toString());
                setPractionarId(item.id);
                setIsFocus(false);
                setProviderError(null);
                // getServiceCategory(item.id);
              }}
              renderItem={renderItem}
            />
            <ErrorView message={providerError} />
          </View>
        )}
        {!showCareDropdown && (
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
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setLabel(item.name);
                setServiceOrgCatId(item.id);
                // getOrgSlots(item.id);
                // getServiceCategory(item.id);
              }}
              renderItem={renderOrgServiceCat}
            />
          </View>
        )}

        {/* <TextField
          autoCapitalize="none"
          accessibilityHint={strings.requestGuidance.requestTitle}
          accessibilityLabel={strings.requestGuidance.requestTitle}
          onChangeText={setTitle}
          placeholder={strings.requestGuidance.care}
          value={title}
          title={strings.requestGuidance.care}
        
        /> */}
        <TextView
          title={'Select Date'}
          textStyle={styles.urgencyTitle}
          viewStyle={{marginTop: 10}}
        />
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
                      styles.serviceCategoryContainer,
                      {
                        borderColor: item.status == 1 ? '#005DA8' : 'white',
                      },
                    ]}>
                    {item.id === 3 ? (
                      <View style={{alignItems: 'center'}}>
                        <Image source={item.icon} />
                        <TextView
                          textStyle={styles.dateText}
                          title={
                            selectedDate !== null
                              ? moment(selectedDate).format('DD MMM, ddd')
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
                          title={moment(item.date).format('DD MMM, ddd')}
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
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setLabel(item.name);
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
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        selectSlot(item, index);
                      }}
                      style={[
                        styles.startText,
                        {
                          borderColor: item.status == 1 ? '#005DA8' : 'white',
                          borderWidth: item.status == 1 ? 1 : 0,
                        },
                      ]}>
                      <Text style={styles.time}> {item?.start}</Text>
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
              return (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      selectOrgSlot(item, index);
                    }}
                    style={{
                      height: moderateScale(50),
                      backgroundColor: 'rgba(217, 217, 217, 0.32)',
                      borderRadius: moderateScale(10),
                      flexDirection: 'row',
                      width: '32%',
                      borderColor: item.status == 1 ? '#005DA8' : 'white',
                      borderWidth: item.status == 1 ? 1 : 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: moderateScale(10),
                    }}>
                    <Text style={styles.time}> {item?.start}</Text>
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
              style={styles.seeMoreText}>
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

        <TextArea
          autoCapitalize="none"
          accessibilityHint={strings.disease.desc}
          accessibilityLabel={strings.disease.desc}
          onChangeText={text => setDesc(text)}
          placeholder={strings.disease.placeholderDesc}
          value={description}
          title={strings.disease.desc}
          multiline={true}
          numberOfLines={4}
        />
        <ErrorView message={descError} />
        <TextView
          title={strings.requestGuidance.attach}
          viewStyle={styles.attachTitleView}
          textStyle={styles.attachTitle}
        />
        {multipleFileName.map((item, key) => (
          <View
            key={key}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextView
              title={item.name ? item.name : ''}
              viewStyle={styles.attachFileView}
              textStyle={styles.attachFile}
              color={'green'}
            />
            <TouchableOpacity
              onPress={() => handleRemoveImage(key)} // Remove the specific image by its index
              style={{
                flex: 0.15,
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
        ))}
        {/*
  {multipleFileName.map((item, key) => (
          <View key={key}>
            <Text style={styles.textStyle}>{item.name ? item.name : ''}</Text>
          </View>
        ))}

         {multipleFileName.map((item, key) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextView
              title={item.name ? item.name : ''}
              viewStyle={styles.attachFileView}
              textStyle={styles.attachFile}
              color={'green'}
            />
            <TouchableOpacity
              onPress={() => setMultipleFileName([])}
              style={{
                flex: 0.15,
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
        ))}
*/}

        {fileName ? (
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
        ) : null}

        <TouchableOpacity
          style={styles.upload}
          onPress={() => setModalVisible(true)}>
          <Image source={IMAGES.icons.upload} />

          <TextView
            title={strings.requestGuidance.upload}
            color={'rgba(0, 0, 0, 0.63)'}
            textStyle={styles.uploadtxt}
          />
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
                {/* <TouchableOpacity onPress={selectSingleFile}> */}
                <TouchableOpacity onPress={onFileSelect}>
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
      </View>
    </KeyboardAwareScrollView>
  );
}
