import {getDiscoverOrganisation} from '@/actions/ProfileActions';
import {TYPES, settingList, settingUpdate} from '@/actions/SettingActions';
import {logout} from '@/actions/UserActions';
import {Fonts, IMAGES} from '@/assets';
import {AppHeader, Image, Loader, TextView} from '@/components';
import {NAVIGATION} from '@/constants';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {getUser} from '@/selectors/UserSelectors';

export function Settings({navigation}) {
  const user = useSelector(getUser);
  const {list} = useSelector(state => state.settings);
  const [settings, setSettings] = useState(list);
  const [licensedProduct, setLicensedProduct] = useState({});
  const dispatch = useDispatch();

  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.SETTING_UPDATE, TYPES.SETTING_LIST], state),
  );
  const {profile} = useSelector(state => state);

  useEffect(() => {
    dispatch(settingList());
    dispatch(getDiscoverOrganisation(user?.user.orgId));
  }, []);

  /**Show Dynamic menu options */
  useEffect(() => {
    checkRPMEnable();
  }, [profile]);

  useEffect(() => {
    setSettings(list);
  }, [list]);

  const checkRPMEnable = () => {
    let licensedProduct = profile.licensedProduct;
    setLicensedProduct(licensedProduct);
  };

  const toggle = index => {
    let setting = [...settings];
    setting[index].enabled = !setting[index].enabled;
    setSettings(setting);
    let payload = {
      type: setting[index].key,
      value: setting[index].enabled,
    };
    dispatch(settingUpdate(payload));
  };
  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title={strings.settings.title}
        toggle={true}
        onBackPress={() => navigation.toggleDrawer()}
        onRightPress={() => navigation.push(NAVIGATION.notification)}
      />
      <Loader isLoading={isLoading} />
      <ScrollView
        style={{
          paddingHorizontal: moderateScale(20),
          marginTop: moderateScale(10),
        }}>
        <TextView
          title={'Notifications'}
          textStyle={{
            fontSize: moderateScale(20),
            fontFamily: Fonts.bold,
            fontWeight: '600',
          }}
          viewStyle={{marginTop: moderateScale(10)}}
        />

        <FlatList
          data={settings}
          contentContainerStyle={{
            marginTop: moderateScale(10),
          }}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: moderateScale(10),
                }}>
                <TextView
                  title={
                    item.title == 'MFA enabled'
                      ? strings.settings.mfa_full
                      : item.title
                  }
                  textStyle={{
                    fontSize: moderateScale(16),
                    fontFamily: Fonts.medium,
                    fontWeight: '400',
                  }}
                  viewStyle={{flex: 0.9, alignSelf: 'center'}}
                />
                <TouchableOpacity
                  onPress={() => toggle(index)}
                  style={{flex: 0.1, alignSelf: 'center'}}>
                  <Image
                    source={
                      item.enabled
                        ? IMAGES.icons.activeRadio
                        : IMAGES.icons.inactiveRadio
                    }
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={item => item.key}
        />

        {licensedProduct &&
          (licensedProduct.RPM || licensedProduct.virtualCare) && (
            <>
              <View style={{marginTop: moderateScale(25), width: '100%'}}>
                <TextView
                  title={'Relationships'}
                  textStyle={{
                    fontSize: moderateScale(20),
                    fontFamily: Fonts.bold,
                    fontWeight: '600',
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: moderateScale(20),
                }}>
                <TouchableOpacity
                  onPress={() => navigation.push(NAVIGATION.invitePerson)}>
                  <TextView
                    title={'Add Relationship'}
                    textStyle={{
                      fontSize: moderateScale(16),
                      fontFamily: Fonts.medium,
                      fontWeight: '500',
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPress={() => navigation.push(NAVIGATION.relatedPersonList)}>
                  <TextView
                    title={'List Relationship'}
                    textStyle={{
                      fontSize: moderateScale(16),
                      fontFamily: Fonts.medium,
                      fontWeight: '500',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

        {licensedProduct && licensedProduct.RPM && (
          <>
            <View style={{marginTop: moderateScale(25), width: '100%'}}>
              <TextView
                title={'Programs'}
                textStyle={{
                  fontSize: moderateScale(20),
                  fontFamily: Fonts.bold,
                  fontWeight: '600',
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginVertical: moderateScale(15),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => navigation.push(NAVIGATION.programsList)}>
                <TextView
                  title={'Programs List'}
                  textStyle={{
                    fontSize: moderateScale(16),
                    fontFamily: Fonts.medium,
                    fontWeight: '500',
                  }}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
        {/* {isRPMVisble && (
          <>
            <View style={{marginTop: moderateScale(25), width: '100%'}}>
              <TextView
                title={'Relationships'}
                textStyle={{
                  fontSize: moderateScale(20),
                  fontFamily: Fonts.bold,
                  fontWeight: '600',
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: moderateScale(20),
              }}>
              <TouchableOpacity
                onPress={() => navigation.push(NAVIGATION.invitePerson)}>
                <TextView
                  title={'Add Relationship'}
                  textStyle={{
                    fontSize: moderateScale(16),
                    fontFamily: Fonts.medium,
                    fontWeight: '500',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                onPress={() => navigation.push(NAVIGATION.relatedPersonList)}>
                <TextView
                  title={'List Relationship'}
                  textStyle={{
                    fontSize: moderateScale(16),
                    fontFamily: Fonts.medium,
                    fontWeight: '500',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: moderateScale(25), width: '100%'}}>
              <TextView
                title={'Programs'}
                textStyle={{
                  fontSize: moderateScale(20),
                  fontFamily: Fonts.bold,
                  fontWeight: '600',
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginVertical: moderateScale(15),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => navigation.push(NAVIGATION.programsList)}>
                <TextView
                  title={'Programs List'}
                  textStyle={{
                    fontSize: moderateScale(16),
                    fontFamily: Fonts.medium,
                    fontWeight: '500',
                  }}
                />
              </TouchableOpacity>
            </View>
          </>
        )} */}
      </ScrollView>
    </View>
  );
}
