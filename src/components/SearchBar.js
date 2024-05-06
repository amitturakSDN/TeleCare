import {IMAGES} from '@/assets';
import {hp} from '@/hooks/scale';
import {colors, spacing} from '@/theme';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Input} from 'react-native-elements';

export const SearchBar = props => {
  let {
    value,
    rightIconStyle,
    inputStyle,
    containerStyle,
    errorMessage,
    editable,
    setCode,
    handlePress,
    textStyle,
  } = props;

  return (
    <>
      <Input
        value={value}
        // autoFocus={true}
        returnKeyType={'search'}
        onSubmitEditing={handlePress}
        editable={editable}
        autoCapitalize="none"
        inputStyle={[styles.inputStyle, inputStyle]}
        containerStyle={[styles.container, containerStyle]}
        errorStyle={{color: 'red'}}
        underlineColorAndroid={'transparent'}
        errorMessage={errorMessage}
        inputContainerStyle={styles.inputContainer}
        placeholder="Search"
        placeholderTextColor={'#0000005E'}
        leftIcon={
          <TouchableOpacity style={styles.button}>
            <Image source={IMAGES.icons.chat.searchBtn} style={styles.search} />
          </TouchableOpacity>
        }
        leftIconContainerStyle={[styles.rightIcon, rightIconStyle]}
        onChangeText={text => setCode(text)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
  },
  search: {
    width: 20,
    height: 20,
  },
  container: {
    height: hp(6),
    backgroundColor: colors.BG_GREY,
    borderRadius: spacing.xs,
  },
  inputStyle: {
    color: "#0000005E'",
  },
  inputContainer: {
    borderColor: 'transparent',
    alignItems: 'center',
  },
  rightIcon: {
    paddingTop: hp(0),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
