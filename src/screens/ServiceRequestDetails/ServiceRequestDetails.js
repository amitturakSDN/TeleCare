import React from 'react';
import { TYPES } from '@/actions/RequisitionsAction';
import { IMAGES } from '@/assets';
import { AppHeader, Image, Loader, TextView } from '@/components';
import { NAVIGATION } from '@/constants';
import { strings } from '@/localization';
import { styles } from '@/screens/ServiceRequestDetails/ServiceRequestDetails.styles';
import { isLoadingSelector } from '@/selectors/StatusSelectors';
import { colors } from '@/theme';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { requisitionDetails } from '@/actions/RequisitionsAction';
import Pdf from 'react-native-pdf';
export function ServiceRequestDetails({ navigation, route }) {
  const {serviceRequestId } = route.params;
  const [pdfUrl,setPdfUrl] = useState();
  const dispatch = useDispatch();
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.REQUISITION_DETAILS], state),
  );
  
  useEffect(() => {
    dispatch(
      requisitionDetails(serviceRequestId, res => {
        console.log(res?.data[0]?.content[0]?.attachment?.base64String , 'encounterId data>????');
        setPdfUrl(res?.data[0]?.content[0]?.attachment?.base64String)
      }),
    );
  }, []);
  const source = { uri: pdfUrl, cache: true };
  return (
    <>
      <Loader isLoading={isLoading} />
      <AppHeader
        title={strings.requisitionDetails.name}
        onBackPress={() => navigation.pop()}
        onRightPress={() => navigation.navigate(NAVIGATION.notification)}
      />
      <View style={styles.pdfView}>
        <Pdf
          trustAllCerts={Platform.OS == 'android' ? false : true}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf} />
      </View>

    </>
  );
}
