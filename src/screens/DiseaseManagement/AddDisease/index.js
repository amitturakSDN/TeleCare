import {
  TYPES,
  addDisease,
  updateDisease,
} from '@/actions/DiseaseManagementActions';
import {
  AppHeader,
  BottomButton,
  DismissKeyboardView,
  ErrorView,
  Loader,
  TextArea,
  TextField,
} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {useEffect, useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
export function AddDisease({navigation}) {
  const dispatch = useDispatch();
  const [diseaseName, setDiseaseName] = useState('');
  const [diseaseDescription, setDiseaseDescription] = useState('');
  const [editId, setEditId] = useState('');
  const [nameError, setNameError] = useState(null);
  const [descError, setDescError] = useState(null);

  const {selected} = useSelector(state => state.diseases);
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.ADD_DISEASE], state),
  );
  const isUpdating = useSelector(state =>
    isLoadingSelector([TYPES.UPDATE_DISEASE], state),
  );
  useEffect(() => {
    setDiseaseName(selected?.diseaseName ?? '');
    setDiseaseDescription(selected?.diseaseDesc ?? '');
    setEditId(selected?.id);
  }, [selected]);

  const add = async () => {
    if (Validate.empty(diseaseName))
      return Validate.errorDisplay('Enter disease Name', setNameError);
    else if (Validate.empty(diseaseDescription))
      return Validate.errorDisplay('Enter disease description', setDescError);
    else {
      setNameError(null);
      setDescError(null);
    }

    let request = {
      diseaseName: diseaseName,
      diseaseDesc: diseaseDescription,
    };

    dispatch(
      addDisease({
        patientId: AuthHelper.getPatientId(),
        ...Validate.encryptInput(request),
      }),
    );
  };

  const update = () => {
    if (Validate.empty(diseaseName))
      return Validate.errorDisplay('Enter disease Name', setNameError);
    else if (Validate.empty(diseaseDescription)) {
      return Validate.errorDisplay('Enter disease description', setDescError);
    } else {
      setNameError(null);
      setDescError(null);
    }
    let request = {
      diseaseName: diseaseName,
      diseaseDesc: diseaseDescription,
    };
    dispatch(
      updateDisease({
        patientId: AuthHelper.getPatientId(),
        diseaseId: editId,
        ...Validate.encryptInput(request),
      }),
    );
  };

  return (
    <>
      <AppHeader
        title={'Add Disease'}
        onBackPress={() => navigation.navigate(NAVIGATION.diseaseListing)}
      />
      <View style={{flex: 0.9, paddingHorizontal: moderateScale(20)}}>
        <Loader isLoading={isLoading || isUpdating} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
          <DismissKeyboardView>
            <TextField
              autoCapitalize="none"
              accessibilityHint={strings.disease.addName}
              accessibilityLabel={strings.disease.addName}
              onChangeText={setDiseaseName}
              placeholder={strings.disease.placeholderName}
              value={diseaseName}
              title={strings.disease.addName}
              // icon={IMAGES.icons.username}
            />
            <ErrorView message={nameError} />
            <TextArea
              autoCapitalize="none"
              accessibilityHint={strings.disease.desc}
              accessibilityLabel={strings.disease.desc}
              onChangeText={setDiseaseDescription}
              placeholder={strings.disease.placeholderDesc}
              value={diseaseDescription}
              title={strings.disease.desc}
              // icon={IMAGES.icons.username}
              multiline={true}
              numberOfLines={4}
            />
            <ErrorView message={descError} />
          </DismissKeyboardView>
        </KeyboardAvoidingView>
        {/* <Button title={editId ? strings.disease.updateBtn : strings.disease.addButton} 
            onPress={editId ? update : add } 
            style={{  width : '94%', marginLeft : moderateScale(8) }}  /> */}
      </View>
      <BottomButton
        title={editId ? strings.disease.updateBtn : strings.disease.addButton}
        onPress={editId ? update : add}
        style={{width: '94%', marginLeft: moderateScale(8)}}
      />
    </>
  );
}
