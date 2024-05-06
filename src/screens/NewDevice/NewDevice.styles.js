import { StyleSheet } from "react-native";
import { moderateScale } from "@/hooks/scale";
import { Fonts } from "@/assets";
export const styles = StyleSheet.create({
    listContainer : { height: moderateScale(120), width: '100%', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.14)', borderRadius: moderateScale(10), justifyContent: 'center',marginVertical : moderateScale(10) },
    listSubCont : { flexDirection: 'row', alignItems: 'center' },
    listImgCont : { width: '15%', marginHorizontal: moderateScale(10) },
    listTxt : { fontSize: moderateScale(18), fontWeight: '500', fontFamily : Fonts.bold }
})