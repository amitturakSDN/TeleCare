import {TYPES, profileUpdate} from '@/actions/ProfileActions';
import {IMAGES} from '@/assets';
import {
    AppHeader,
    BottomButton,
    DateTimePicker,
    DismissKeyboardView,
    ErrorView,
    Image,
    Loader,
    TextField,
    TextView,
} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {deviceWidth, moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/Profile/Profile.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {colors} from '@/theme';
import moment from 'moment-timezone';
import {useEffect, useState} from 'react';
import {TouchableOpacity, View, useColorScheme, ScrollView} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import MaskInput from 'react-native-mask-input';
import {useDispatch, useSelector} from 'react-redux';
export function Profile({navigation}) {
    const dispatch = useDispatch();
    const {profile} = useSelector(state => state);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [response, setResponse] = useState('');
    const [extensions, setExtension] = useState('');
    const [showOption, setShowOption] = useState(false);
    const [dobError, setDobError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);
    const [genderError, setGenderError] = useState(null);

    const isLoading = useSelector(state =>
        isLoadingSelector([TYPES.PROFILE_UPDATE, TYPES.PROFILE_DETAIL], state),
    );

    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        // setName(profile?.name ?? '');
        setFirstName(profile?.firstName ?? '');
        setLastName(profile?.lastName ?? '');
        setPhone(profile?.phone ?? '');
        setDob(profile?.dateOfBirth);
        setEmail(profile?.emailId ?? '');
        setGender(profile?.gender ?? '');
        setProfileImage(profile?.profileImg ?? '');
        setResponse('');
    }, [profile]);

    const data = [
        {label: 'Male', value: 'male'},
        {label: 'Female', value: 'female'},
        {label: 'Other', value: 'other'},
    ];

    /** Select Image from image*/
    const imageUpload = async () => {
        await ImagePicker.openPicker({
            cropping: true,
            multiple: false,
            mediaType: 'photo',
            includeBase64: true,
        }).then(image => {
            let baseUrl = `data:${image.mime};base64,${image.data}`;
            let fileName = image.path.split('/').pop(); // Extract the file name from the path
            let extension = fileName.split('.').pop(); // Extract the extension from the file name
            setProfileImage(baseUrl);
            setResponse(baseUrl);
            setExtension(extension);
        });
    };

    const renderItem = item => {
        return <TextView title={item.label} viewStyle={styles.item} />;
    };

    const update = () => {
        if (Validate.empty(dob))
            return Validate.errorDisplay('Date of birth should not be empty', setDobError);
        else if (Validate.empty(phone))
            return Validate.errorDisplay('Phone number should not be empty', setPhoneError);
        else if (phone.toString().length < 14)
            return Validate.errorDisplay('Invalid phone number', setPhoneError);
        else if (Validate.phone(phone))
            return Validate.errorDisplay('Invalid phone number', setPhoneError);
        else if (Validate.empty(gender))
            return Validate.errorDisplay('Please select gender', setGenderError);
        else {
            setDobError(null);
            setPhoneError(null);
            setGenderError(null);
        }

        const request = {
            id: AuthHelper.getUserId(),
            data: {
                photo: {
                    url: response,
                    extension: extensions,
                },
                phone: phone,
                birthDate: dob,
                gender: gender,
                firstName,
                lastName,
            },
        };
        dispatch(profileUpdate(Validate.encryptInput(request)));
    };

    const getDateFromPicker = date => {
        setShowOption(false);
        setDob(moment(date).format('M/DD/YYYY'));
    };

    return (
        <View style={styles.container}>
            <Loader isLoading={isLoading} />
            <AppHeader
                title={strings.profile.header}
                toggle={true}
                onBackPress={() => navigation.toggleDrawer()}
                onRightPress={() => navigation.push(NAVIGATION.notification)}
            />
            <ScrollView>
                <DismissKeyboardView>
                    <View style={styles.fieldContainer}>
                        <TouchableOpacity
                            style={styles.imageContainer}
                            onPress={() => imageUpload()}>
                            {profileImage ? (
                                <Image
                                    source={{uri: profileImage}}
                                    imageStyle={styles.profileImage}
                                />
                            ) : (
                                <Image source={IMAGES.icons.common.camera} />
                            )}
                        </TouchableOpacity>
                        <TextField
                            autoCapitalize="none"
                            accessibilityHint={strings.profile.namePlaceholder}
                            accessibilityLabel={strings.profile.namePlaceholder}
                            onChangeText={setFirstName}
                            placeholder={strings.profile.firstName}
                            value={firstName.charAt(0).toUpperCase() + firstName.slice(1)}
                            title={strings.profile.firstName}
                        />
                        <TextField
                            autoCapitalize="none"
                            accessibilityHint={strings.profile.namePlaceholder}
                            accessibilityLabel={strings.profile.namePlaceholder}
                            onChangeText={setLastName}
                            placeholder={strings.profile.lastName}
                            value={lastName.charAt(0).toUpperCase() + lastName.slice(1)}
                            title={strings.profile.lastName}
                            // editable={false}
                            // icon={IMAGES.icons.username}
                        />

                        <TextField
                            autoCapitalize="none"
                            accessibilityHint={strings.profile.emailPlaceholder}
                            accessibilityLabel={strings.profile.emailPlaceholder}
                            onChangeText={setEmail}
                            placeholder={strings.profile.emailPlaceholder}
                            value={email}
                            title={strings.profile.email}
                            editable={false}
                        />

                        <TextView
                            title={strings.profile.phone}
                            viewStyle={styles.label}
                            textStyle={[styles.title, {color: colors.primary}]}
                            color={isDarkMode ? '#fff' : colors.primary}
                        />
                        <View style={styles.phone}>
                            <MaskInput
                                value={phone}
                                style={styles.input}
                                autoCapitalize="none"
                                accessibilityHint={strings.profile.phonePlaceholder}
                                accessibilityLabel={strings.profile.phonePlaceholder}
                                placeholder={strings.profile.phonePlaceholder}
                                placeholderTextColor={colors.txt_placeholder}
                                maxLength={16}
                                onChangeText={(masked, unmasked) => {
                                    setPhone(masked); // you can use the unmasked value as well

                                    // assuming you typed "9" all the way:
                                    __DEV__ && console.log(masked); // (99) 99999-9999
                                    __DEV__ && console.log(unmasked); // 99999999999
                                }}
                                mask={[
                                    '(',
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    ')',
                                    ' ',
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    '-',
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                ]}
                            />
                        </View>

                        <ErrorView message={phoneError} />

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
                            onLeftPress={() => setShowOption(!showOption)}
                        />
                        <ErrorView message={dobError} />

                        {showOption && (
                            <DateTimePicker
                                chooseDate={getDateFromPicker}
                                hideDatePicker={() => setShowOption(false)}
                            />
                        )}

                        <TextView
                            title={strings.profile.gender}
                            viewStyle={styles.genderTitleContainer}
                            textStyle={styles.genderTitle}
                        />
                        <Dropdown
                            style={styles.dropdown}
                            data={data}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select"
                            placeholderStyle={styles.input}
                            selectedTextStyle={styles.input}
                            value={gender}
                            onChange={item => {
                                setGender(item.value);
                            }}
                            renderItem={renderItem}
                        />
                        <ErrorView message={genderError} />
                        <BottomButton
                            title={strings.buttons.save}
                            style={{width: deviceWidth - 45, marginTop: moderateScale(20)}}
                            onPress={update}
                        />
                    </View>
                </DismissKeyboardView>
            </ScrollView>
        </View>
    );
}
