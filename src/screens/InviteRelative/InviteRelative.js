import {TYPES, profileInviteRelative} from '@/actions/ProfileActions';
import {Fonts} from '@/assets';
import {
    AppHeader,
    Button,
    ErrorView,
    Loader,
    ParentContainer,
    TextField,
    TextView,
} from '@/components';
import {AuthHelper, Validate} from '@/helpers';
import {deviceWidth, moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '@/theme';
export function InviteRelative({navigation}) {
    const dispatch = useDispatch();
    const {profile} = useSelector(state => state);

    const [email, setEmail] = useState('');
    const [relation, setRelation] = useState(null);

    const [emailError, setEmailError] = useState(null);
    const [relationError, setRelationError] = useState(null);

    const isLoading = useSelector(state =>
        isLoadingSelector([TYPES.PROFILE_INVITE_RELATIVE], state),
    );
    useEffect(() => {}, [profile]);

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
        if (Validate.empty(email)) {
            return Validate.errorDisplay('Please enter email', setEmailError);
        } else if (Validate.email(email)) {
            return Validate.errorDisplay('Please enter valid email', setEmailError);
        } else if (Validate.empty(relation)) {
            setEmailError(null);
            return Validate.errorDisplay('Please select relationship.', setRelationError);
        } else {
            setEmailError(null);
            setRelationError(null);
        }

        const request = {
            // name,
            email: email.toLocaleLowerCase(),
            // gender,
            relation,
        };

        dispatch(
            profileInviteRelative({
                id: AuthHelper.getPatientId(),

                username: AuthHelper.getUserName(),
                ...Validate.encryptInput(request),
            }),
        );
    };

    return (
        <View style={{flex: 1}}>
            <Loader isLoading={isLoading} />
            <AppHeader
                title={strings.invite.title}
                //  toggle={true}
                onBackPress={() => navigation.pop()}
                //  onRightPress={() => navigation.push(NAVIGATION.notification)}
            />
            <ParentContainer>
                <View style={{marginBottom: moderateScale(100)}}>
                    {/* 
           <TextFieldz
            autoCapitalize="none"
            accessibilityHint={strings.profile.namePlaceholder}
            accessibilityLabel={strings.profile.namePlaceholder}  
            onChangeText={setName}
            placeholder={strings.profile.name}
            value={name}
            title={strings.profile.name}
            // editable={false}
            // icon={IMAGES.icons.username}
          />
          <ErrorView message={nameError} />
          */}

                    <TextField
                        autoCapitalize="none"
                        accessibilityHint={strings.profile.emailPlaceholder}
                        accessibilityLabel={strings.profile.emailPlaceholder}
                        onChangeText={setEmail}
                        placeholder={strings.profile.emailPlaceholder}
                        value={email}
                        title={strings.profile.email}
                        // editable={false}
                    />
                    <ErrorView message={emailError} />

                    {/*
           <TextView
            title={strings.invite.gender}
            viewStyle={{marginTop: moderateScale(20)}}
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
            ///placeholder="Select"
            value={gender}
            onChange={item => {
              setGender(item.value);
            }}
            renderItem={renderItem}
          />
          <ErrorView message={genderError} />
          */}

                    <TextView
                        title={strings.invite.relation}
                        viewStyle={{marginTop: moderateScale(20)}}
                        textStyle={{
                            fontSize: moderateScale(18),
                            fontWeight: '400',
                        }}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={relationship}
                        placeholderStyle={styles.input}
                        selectedTextStyle={styles.input}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select"
                        value={relation}
                        itemTextStyle={styles.input}
                        // activeColor={colors.PRIMARY_BLUE}
                        onChange={item => {
                            setRelation(item.value);
                        }}
                        renderItem={renderItem}
                    />
                    <ErrorView message={relationError} />
                    <Button
                        title={strings.btn.invite}
                        style={{width: deviceWidth - 80, marginVertical: moderateScale(45)}}
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
        marginTop: moderateScale(10),
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.medium,
        color: colors.DARK_BLUE,
    },
});
