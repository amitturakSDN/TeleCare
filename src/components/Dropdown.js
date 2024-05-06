import {Fonts} from '@/assets';
import {TextView} from '@/components';
import {moderateScale} from '@/hooks/scale';
import {useTheme} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
export const DropdownInput = ({
  style,
  value,
  placeholder,
  options = [{label: 'Select', value: ''}],
  onChange,
  title,
}) => {
  const {colors} = useTheme();
  const renderItem = item => {
    return (
      <TextView
        title={item.label}
        viewStyle={{
          // padding: moderateScale(17),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      />
    );
  };

  return (
    <>
      <TextView
        title={title}
        viewStyle={{
          marginTop: moderateScale(15),
          marginBottom: moderateScale(8),
        }}
        textStyle={{
          fontSize: moderateScale(18),
          fontWeight: '400',
          fontFamily: Fonts.medium,
        }}
      />
      <Dropdown
        style={[
          style,
          {
            height: moderateScale(50),
            backgroundColor: colors.bgLightGrey,
            borderRadius: moderateScale(10),
            padding: moderateScale(12),
          },
        ]}
        data={options}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder ?? 'Select'}
        value={value}
        onChange={item => {
          onChange(item.value);
        }}
        renderItem={renderItem}
      />
    </>
  );
};
