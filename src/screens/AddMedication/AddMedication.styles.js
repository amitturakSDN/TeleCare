import { StyleSheet } from "react-native"
import { moderateScale } from "@/hooks/scale"
export const styles = StyleSheet.create({
  btn : { marginVertical: moderateScale(40), marginBottom: moderateScale(50) },
  inputContainer : { flexDirection: 'row', justifyContent: 'space-between' },
  drpDwnContainer : { flexDirection: 'row', justifyContent: 'space-between' }
})