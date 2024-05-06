import {useTheme} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';

export function TextView({viewStyle, textStyle, title, numLines, color}) {
  const {colors} = useTheme();

  return (
    <View style={viewStyle}>
      <Text
        style={[textStyle, {color: color ?? colors.primary}]}
        numberOfLines={numLines}>
        {title}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({});
