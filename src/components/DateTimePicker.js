import {View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export const DateTimePicker = ({
  chooseDate,
  hideDatePicker,
  maximumDate,
  minimumDate,
}) => {
  const handleConfirm = date => {
    chooseDate(date);
    __DEV__ && console.warn('A date has been picked: ', date);
  };

  return (
    <View>
      <DateTimePickerModal
        isVisible={true}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    </View>
  );
};
