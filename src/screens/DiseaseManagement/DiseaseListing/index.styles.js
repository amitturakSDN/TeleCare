import { moderateScale } from "@/hooks/scale";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    listContainer : {
        minHeight : moderateScale(132),
        borderWidth :moderateScale(1),
        marginBottom : moderateScale(10),
        borderColor : 'rgba(0, 0, 0, 0.14)',
        borderRadius : moderateScale(10),
        backgroundColor : '#fff',
        
    },
    imgContainer : { flexDirection: 'row', justifyContent: 'space-between' },
    titleContainer : { paddingHorizontal: moderateScale(20), paddingVertical: moderateScale(20) },
    imgView : { flexDirection: 'row', justifyContent: 'space-between', width: '15%', margin: moderateScale(20) },
    title : { fontSize : moderateScale(20), color : '#005DA8', fontWeight : '700' },
    description :  { fontSize : moderateScale(16), color : '#8E8E8E', fontWeight : '400' },
    lottie: { width: 100, height: 100 }
})