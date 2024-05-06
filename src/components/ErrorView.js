import {moderateScale} from '@/hooks/scale';
import {typography} from '@/theme';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: moderateScale(10),
    // alignItems: 'center',
  },
});

export function ErrorView({message}) {
  const {colors} = useTheme();

  if (!message) return <></>;
  // if (errors.length === 0) {
  //   return <></>;
  // }

  return (
    <View style={styles.container}>
      {/* {errors.map((error) => ( */}
      <Text key={message} style={[typography.error, {color: colors.error}]}>
        {message}
      </Text>
      {/* ))} */}
    </View>
  );
}

// ErrorView.propTypes = {
//   message: PropTypes.string.isRequired,
// };
