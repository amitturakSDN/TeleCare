import {moderateScale} from '@/hooks/scale';
import {useTheme} from '@react-navigation/native';
import {KeyboardAvoidingView, ScrollView, StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    backgroundColor: '#fff',
  },
});

export function ParentContainer({children, style}) {
  const {colors} = useTheme();
  return (
    // <View style={[styles.container, style]}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: colors.white}]}>
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </KeyboardAvoidingView>
    // </View>
  );
}
