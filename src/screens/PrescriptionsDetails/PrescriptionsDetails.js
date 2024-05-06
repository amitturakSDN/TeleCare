import {
  TYPES
} from '@/actions/PrescriptionsAction';
import { IMAGES } from '@/assets';
import { AppHeader, Image, Loader, TextView } from '@/components';
import { Text } from 'react-native';
import { NAVIGATION } from '@/constants';
import { strings } from '@/localization';
import { isLoadingSelector } from '@/selectors/StatusSelectors';
import { styles } from '@/screens/PrescriptionsDetails/PrescriptionsDetails.styles';
import { View } from 'react-native';
import { prescriptionsDetails } from '@/actions/PrescriptionsAction';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pdf from 'react-native-pdf';
export function PrescriptionsDetails({ navigation,route }) {
  const {medicationRequestId} = route.params;
  const [pdfUrl,setPdfUrl] = useState();
  const dispatch = useDispatch()
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.PRESCRIPTION_DETAILS], state),
  );
  useEffect(() => {
    getPrescriptionsDetails();
  }, []);

  const getPrescriptionsDetails = () => {
    dispatch(
      prescriptionsDetails(medicationRequestId,res => {
  console.log(res?.data[0]?.content[0]?.attachment?.base64String,'res?.data>>>');
        setPdfUrl(res?.data[0]?.content[0]?.attachment?.base64String)
      }),
    );
  };
  const source = { uri: pdfUrl, cache: true };
  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading} />
      <AppHeader
        title={strings.prescriptionsDetails.name}
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
    </View>
  );
}