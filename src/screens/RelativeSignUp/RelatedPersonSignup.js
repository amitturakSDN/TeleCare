import {TYPES, relativeSignUp} from '@/actions/UserActions';
import {
  AppHeader,
  Button,
  DateTimePicker,
  ErrorView,
  Loader,
  ParentContainer,
  TextField,
  TextView,
} from '@/components';
import {Validate} from '@/helpers';
import {deviceWidth, moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
// import ImagePicker from 'react-native-image-crop-picker';
import {IMAGES} from '@/assets';
import {NAVIGATION} from '@/constants';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import moment from 'moment-timezone';
import {Dropdown} from 'react-native-element-dropdown';

import {checkRelativeStatus} from '@/actions/UserActions';
export function RelatedPersonSignup({route, navigation}) {
  const {params} = route;
  const {id, email, ref} = params;
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // const [addemail, setEmail] = useState('')
  const [gender, setGender] = useState('');
  const [relation, setRelation] = useState(null);
  const [dob, setDob] = useState('');
  const [genderError, setGenderError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [relationError, setRelationError] = useState(null);
  const [showOption, setShowOption] = useState(false);
  const [dobError, setDobError] = useState(null);

  useEffect(() => {
    console.log('hiiii');
    let params = {
      isVerifyInvitedUser: true,
      id,
      patientRefId: ref,
    };
    console.log(params, 'params....');
    dispatch(
      checkRelativeStatus(params, res => {
        console.log(res, 'res....');
        if (!res) {
          navigation.navigate(NAVIGATION.login);
          // Alert.alert('Related person is already Registered', '', [
          //   {
          //     text: 'OK',
          //     onPress: () => navigation.navigate(NAVIGATION.login),
          //   },
          // ]);
        }
      }),
    );
  }, []);
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.RELATIVE_SIGNUP], state),
  );

  useEffect(() => {
    // dispatch(
    //   checkUserRegister({
    //     email: 'check@yopmail.com',
    //   }),
    // );
  });
  const data = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ];

  const relationship = [
    {label: 'Father', value: 'FATHER'},
    {label: 'Mother', value: 'MOTHER'},
    {label: 'Son', value: 'SON'},
    {label: 'Daughter', value: 'DAUGHTER'},
    {label: 'Brother', value: 'BROTHER'},
    {label: 'Sister', value: 'SISTER'},
  ];

  const renderItem = item => {
    return <TextView title={item.label} viewStyle={styles.item} />;
  };

  const update = () => {
    if (Validate.empty(firstName)) {
      return Validate.errorDisplay('Please enter first name', setNameError);
    } else if (Validate.empty(lastName)) {
      return Validate.errorDisplay('Please enter last name', setNameError);
    } else if (Validate.empty(email)) {
      setNameError(null);
      return Validate.errorDisplay('Please enter email', setEmailError);
    } else if (Validate.email(email)) {
      setNameError(null);
      return Validate.errorDisplay('Please enter valid email', setEmailError);
    } else if (Validate.empty(dob)) {
      setEmailError(null);
      setNameError(null);
      return Validate.errorDisplay(
        'Date of birth should not be empty',
        setDobError,
      );
    } else if (Validate.empty(gender)) {
      setEmailError(null);
      setNameError(null);
      setDobError(null);
      return Validate.errorDisplay('Please select gender', setGenderError);
    } else if (Validate.empty(relation)) {
      setEmailError(null);
      setNameError(null);
      setGenderError(null);
      setDobError(null);
      return Validate.errorDisplay(
        'Please select relationship.',
        setRelationError,
      );
    } else {
      setEmailError(null);
      setNameError(null);
      setGenderError(null);
      setRelationError(null);
      setDobError(null);
    }
    const request = {
      /* 
      name: [
        {
          use: 'usual',
          text:
            firstName.charAt(0).toUpperCase()+firstName.slice(1) +' '+lastName.charAt(0).toUpperCase()+lastName.slice(1),
          family: firstName.charAt(0).toUpperCase() + firstName.slice(1),
          given: [lastName.charAt(0).toUpperCase() + lastName.slice(1)],
        },
      ],
      */
      //   name,
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      email: email.toLocaleLowerCase(),
      gender,
      relation,
      dob,
      phone: '+1(797) 869-0017',
      // username : AuthHelper.getUserName()
    };
    dispatch(
      relativeSignUp({
        id,
        ref: Validate.decryptInput(ref),
        ...Validate.encryptInput(request),
      }),
    );
  };

  const getDateFromPicker = date => {
    setShowOption(false);
    setDob(moment(date).format('M/DD/YYYY'));
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Loader isLoading={isLoading} />
      {/* <AuthHeader title={'Signup'} /> */}
      <View style={{marginTop: moderateScale(35)}}>
        <AppHeader
          title={'Invite Person'}
          // toggle={true}
          onBackPress={() => navigation.navigate(NAVIGATION.login)}
          // onRightPress={() => navigation.navigate(NAVIGATION.notification)}
        />
      </View>

      <ParentContainer>
        <View style={{marginBottom: moderateScale(100)}}>
          <TextField
            autoCapitalize="none"
            accessibilityHint={strings.profile.namePlaceholder}
            accessibilityLabel={strings.profile.namePlaceholder}
            onChangeText={setFirstName}
            placeholder={strings.profile.firstName}
            value={firstName}
            title={strings.profile.firstName}
            // editable={false}
            // icon={IMAGES.icons.username}
          />
          <ErrorView message={nameError} />
          <TextField
            autoCapitalize="none"
            accessibilityHint={strings.profile.namePlaceholder}
            accessibilityLabel={strings.profile.namePlaceholder}
            onChangeText={setLastName}
            placeholder={strings.profile.lastName}
            value={lastName}
            title={strings.profile.lastName}
            // editable={false}
            // icon={IMAGES.icons.username}
          />
          <ErrorView message={nameError} />
          <TextField
            autoCapitalize="none"
            accessibilityHint={strings.profile.emailPlaceholder}
            accessibilityLabel={strings.profile.emailPlaceholder}
            // onChangeText={setEmail}
            placeholder={strings.profile.emailPlaceholder}
            value={email}
            title={strings.profile.email}
            editable={false}
          />
          <ErrorView message={emailError} />
          <TouchableOpacity
            onPress={() => {
              setShowOption(!showOption);
            }}>
            <TextField
              autoCapitalize="none"
              accessibilityHint={strings.profile.dobPlaceholder}
              accessibilityLabel={strings.profile.dobPlaceholder}
              // onChangeText={setDob}
              placeholder={strings.profile.dobPlaceholder}
              value={dob}
              title={strings.profile.dob}
              leftIcon={IMAGES.icons.calendar}
              editable={false}
              onLeftPress={() => {
                setShowOption(!showOption);
              }}
            />
            <ErrorView message={dobError} />
          </TouchableOpacity>
          {showOption && (
            <DateTimePicker
              chooseDate={getDateFromPicker}
              hideDatePicker={() => setShowOption(false)}
              maximumDate={new Date()}
            />
          )}
          <TextView
            title={'Select Gender'}
            viewStyle={{marginVertical: moderateScale(20)}}
            textStyle={{
              fontSize: moderateScale(18),
              fontWeight: '400',
            }}
          />
          <Dropdown
            style={styles.dropdown}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={gender}
            onChange={item => {
              setGender(item.value);
            }}
            renderItem={renderItem}
          />
          <ErrorView message={genderError} />

          <TextView
            title={'Select Relationship'}
            viewStyle={{marginVertical: moderateScale(20)}}
            textStyle={{
              fontSize: moderateScale(18),
              fontWeight: '400',
            }}
          />
          <Dropdown
            style={styles.dropdown}
            data={relationship}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={relation}
            onChange={item => {
              setRelation(item.value);
            }}
            renderItem={renderItem}
          />
          <ErrorView message={relationError} />
          <Button
            title={strings.buttons.save1}
            style={{width: deviceWidth - 60, marginTop: moderateScale(25)}}
            onPress={update}
          />
        </View>
      </ParentContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: moderateScale(50),
    backgroundColor: '#F6F6F6',
    borderRadius: moderateScale(10),
    padding: 12,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
