import {TYPES} from '@/actions/ManualReadingsActions';
import {IMAGES} from '@/assets';
import {AppHeader, Button, Loader, TextView} from '@/components';
import {strings} from '@/localization';
import {styles} from '@/screens/FeedbackThanks/FeedbackThanks.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {useEffect, useState} from 'react';
import {BackHandler, Image, View} from 'react-native';
import {useSelector} from 'react-redux';

export function FeedbackThanks({navigation, route}) {
  const [thanksMsg, setThanksMsg] = useState('');
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.LIST_DEVICES], state),
  );

  const feedBackQuestionList = [useSelector(
    state => state.appointment.listFeedbackQuetions,
  )];

  /** Back Handler to avoid going to video call screen */
  useEffect(() => {
    const backAction = () => {
      navigateToSession();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  /**Get Thanks Msg dynamicaaly and render on screen */
  useEffect(() => {
    if (feedBackQuestionList.length > 0) {
      setThanksMsg(feedBackQuestionList[0].description);
    }
  }, [feedBackQuestionList]);

  const navigateToSession = () => {
    navigation.reset({
      index: 1,
      routes: [
        {
          name: 'Session',
        },
      ],
    });
  };
  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.feedback.header}
        onBackPress={() => navigateToSession()}
      />
      <Loader isLoading={isLoading} />
      <View style={styles.mainView}>
        <Image source={IMAGES.feedback.feedbackDone} />
      </View>
      <View style={styles.thanksTextView}>
        <TextView title={thanksMsg} textStyle={styles.title} />
      </View>
      <View style={styles.btnView}>
        <Button
          title={strings.feedback.backHome}
          style={styles.btn}
          textStyle={styles.btnText2}
          onPress={() => {
            navigation.reset({
              index: 1,
              routes: [
                {
                  name: 'Home',
                },
              ],
            });
          }}
        />
      </View>
    </View>
  );
}
