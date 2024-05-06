import {IMAGES} from '@/assets';
import {AppHeader, Button, Image, ParentContainer, TextView} from '@/components';
import {NAVIGATION} from '@/constants';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/NewDevice/NewDevice.styles';
import {shadow} from '@/theme';
import {TouchableOpacity, View} from 'react-native';

export function NewDevice({navigation}) {
    return (
        <View style={{flex: 1}}>
            <AppHeader
                title={strings.bleConnect.bleTitle}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.push(NAVIGATION.notification)}
            />
            <ParentContainer>
                <TouchableOpacity
                    onPress={() => {
                        navigation.push(NAVIGATION.thermometerFora);
                    }}
                    style={[shadow.primary, styles.listContainer]}>
                    <View style={styles.listSubCont}>
                        <View style={styles.listImgCont}>
                            <Image source={IMAGES.bluetooth.glucometer} />
                        </View>
                        <TextView
                            title={'Thermometer'}
                            textStyle={styles.listTxt}
                            viewStyle={{width: '60%'}}
                        />
                        <Image source={IMAGES.bluetooth.checkedCircle} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        navigation.push(NAVIGATION.bloodPressureAd);
                    }}
                    style={[shadow.primary, styles.listContainer]}>
                    <View style={styles.listSubCont}>
                        <View style={styles.listImgCont}>
                            <Image source={IMAGES.bluetooth.bloodPressure} />
                        </View>
                        <TextView
                            title={'Blood Pressure'}
                            textStyle={styles.listTxt}
                            viewStyle={{width: '60%'}}
                        />
                        <Image source={IMAGES.bluetooth.uncheckedCircle} />
                    </View>
                </TouchableOpacity>

                <View style={{marginVertical: moderateScale(30)}}>
                    <Button title={'Save'} />
                </View>
            </ParentContainer>
        </View>
    );
}
