import {
  AppHeader,
  Button,
  DropdownInput,
  ParentContainer,
  TextArea,
  TextField,
} from '@/components';
import {NAVIGATION} from '@/constants';
import {strings} from '@/localization';
import {styles} from '@/screens/AddMedication/AddMedication.styles';
import {useState} from 'react';
import {View} from 'react-native';

export function AddMedication({navigation}) {
  const [title, setTitle] = useState(null);

  const onChange = value => {
    return value;
  };
  return (
    <View style={{flex: 1}}>
      <AppHeader
        title={strings.medication.addMedication}
        // toggle={true}
        onBackPress={() => navigation.pop()}
        onRightPress={() => navigation.push(NAVIGATION.notification)}
      />
      <ParentContainer>
        <TextField
          autoCapitalize="none"
          accessibilityHint={strings.medication.medicationName}
          accessibilityLabel={strings.medication.medicationName}
          onChangeText={setTitle}
          placeholder={strings.medication.medicationName}
          value={title}
          title={strings.medication.medicationName}
          // icon={IMAGES.icons.username}
        />
        <View style={styles.inputContainer}>
          <View style={{width: '48%'}}>
            <TextField
              autoCapitalize="none"
              accessibilityHint={strings.medication.medicationName}
              accessibilityLabel={strings.medication.medicationName}
              onChangeText={setTitle}
              placeholder={strings.medication.dosage}
              value={title}
              title={strings.medication.dosage}
              // icon={IMAGES.icons.username}
            />
          </View>
          <View style={{width: '48%'}}>
            <DropdownInput title={'Frequency'} onChange={onChange} />
          </View>
        </View>
        <View style={styles.drpDwnContainer}>
          <View style={{width: '48%'}}>
            <DropdownInput
              title={'Duration'}
              placeholder={'6 months'}
              onChange={onChange}
            />
          </View>
          <View style={{width: '48%'}}>
            <DropdownInput
              title={strings.medication.timeTake}
              placeholder={strings.medication.beforemeal}
              onChange={onChange}
            />
          </View>
        </View>
        <TextArea
          autoCapitalize="none"
          accessibilityHint={strings.disease.desc}
          accessibilityLabel={strings.disease.desc}
          onChangeText={setTitle}
          placeholder={'Write here..'}
          value={title}
          title={'Notes'}
          // icon={IMAGES.icons.username}
          multiline={true}
          numberOfLines={4}
        />

        <Button title={'Add Medication'} style={styles.btn} />
      </ParentContainer>
    </View>
  );
}
