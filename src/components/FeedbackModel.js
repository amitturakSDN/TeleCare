import {Fonts, IMAGES} from '@/assets';
import {moderateScale} from '@/hooks/scale';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
const FeedbackModel = props => {
  const {
    isSuccessVisible,
    onSuccessClose,
    handleDonePresss,
    surveymandatory,
    feedBackTitle = 'We are interested in your feedback regarding the quality of service you received. This should only take a minute to complete. All feedback is kept confidential and is used for the purpose of improving our service.',
  } = props;
  const [ModalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const closeSuccessModel = () => {
    onSuccessClose();
  };
  const handleDonePress = () => {
    handleDonePresss();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSuccessVisible}
      onRequestClose={closeSuccessModel}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.successView}>
              <View style={styles.successImgView}>
                <Image source={IMAGES.feedback.feedbackModel} />
              </View>
            </View>
            <Text style={styles.congratulationsText}>{'Feedback'}</Text>
            <Text style={styles.reasonText}>{feedBackTitle}</Text>
            <View style={styles.btnView}>
              {surveymandatory === 'mandatory' ? (
                <TouchableOpacity>
                  <Text style={styles.cBtn}></Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.cBtnView}
                  onPress={() => closeSuccessModel()}>
                  <Text style={styles.cBtn}>{'Not Now'}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.coBtnView}
                onPress={() => handleDonePress()}>
                <Text style={styles.coBtn}>{'Next'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    // marginTop: '%',
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    marginHorizontal: 20,
    // height: '35%',
    width: '90%',
  },

  listView: {
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: '#F4F4F4',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  listText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    lineHeight: 22,
    color: '#333333',
    marginHorizontal: 7,
    textAlign: 'center',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 15,
  },

  successView: {
    paddingVertical: moderateScale(20),
  },
  successImgView: {
    alignItems: 'center',
  },
  successText: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    lineHeight: 30,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  congratulationsText: {
    fontSize: moderateScale(25),
    fontFamily: Fonts.bold,
    //  lineHeight: 25,
    color: '#171717',
    marginHorizontal: moderateScale(19),
    textAlign: 'center',
    marginBottom: moderateScale(15),
  },
  cancelText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
    color: '#666666',
    textAlign: 'center',
    // marginVertical:14,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  reasonText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.regular,
    lineHeight: 27,
    color: '#121F48',
    marginHorizontal: moderateScale(14),
    textAlign: 'center',
    fontStyle: 'normal',
    fontWeight: '400',
  },

  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(30),
    marginVertical: moderateScale(20),
  },
  cBtnView: {
    borderRadius: moderateScale(50),
    borderWidth: 1,
    borderColor: '#005DA8',
    backgroundColor: 'rgba(0, 93, 168, 0.04)',
    paddingHorizontal: moderateScale(25),
    paddingVertical: moderateScale(15),
  },
  coBtnView: {
    borderRadius: moderateScale(50),
    backgroundColor: '#005DA8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8, // Android shadow
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateScale(15),
    justifyContent: 'center',
  },
  cBtn: {
    fontSize: moderateScale(18),
    color: '#005DA8',
    marginLeft: moderateScale(6),
    fontFamily: Fonts.bold,
    // fontWeight:'700',
    lineHeight: moderateScale(20),
  },
  coBtn: {
    fontSize: moderateScale(18),
    marginLeft: moderateScale(6),
    fontFamily: Fonts.bold,
    // fontWeight:'700',
    lineHeight: moderateScale(20),
    color: '#FFF',
  },
  doctorTxt: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
    color: '#171717',
    textAlign: 'center',
    // marginVertical:14,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  successDetails: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 27,
    color: '#84818A',
  },
  value: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    lineHeight: 27,
    color: '#171717',
  },

  button: {
    backgroundColor: 'gray',
    height: 44,
    width: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    marginVertical: 14,
    marginHorizontal: 14,
  },
  buttonText: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 27,
    color: 'white',
  },
  errorText: {
    fontFamily: Fonts.medium,
    color: '#FF0000',
    fontSize: 13,
    marginBottom: 2,
    marginVertical: 10,
  },
});

export default FeedbackModel;
