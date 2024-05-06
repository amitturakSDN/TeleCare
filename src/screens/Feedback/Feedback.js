import {
  feedBackSubmit,
  listFeedbackQuestions,
} from '@/actions/AppointmentAction';
import { organizationDetails } from '@/actions/ProfileActions';
import { IMAGES } from '@/assets';
import { AppHeader, Button, ErrorView, Loader, TextArea } from '@/components';
import { AuthHelper, Validate } from '@/helpers';
import { moderateScale } from '@/hooks/scale';
import { strings } from '@/localization';
import { styles } from '@/screens/Feedback/Feedback.styles';
import { useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
export function Feedback({ navigation, route }) {
  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.user.loader);
  const selectedAppt = useSelector(state => state.appointment.selected);

  const [descriptions, setDescriptions] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);
  const [starErrors, setStarErrors] = useState({});
  const [descErrors, setDescErrors] = useState({});
  const {user} = useSelector(state => state);
  const [showLoader, setShowLoader] = useState(false);
  const [orgId, setOrgId] = useState(user?.user?.orgId);
  const [ratings, setRatings] = useState(
    Array.from({ length: 5 }, () => 0), // Assuming there are 5 questions initially
  );
  const patientID = AuthHelper.getPatientId();

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

  useEffect(() => {
    setShowLoader(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const areAllRated = feedbackList?.every((question, questionIndex) => {
      return question.item.every((_, subQuestionIndex) => {
        return ratings[questionIndex]?.[subQuestionIndex] > 0;
      });
    });
  }, [ratings]);
  useEffect(() => {
    getFeedbackSurveyList();
  }, []);

  /**API to get feedback questions*/
  const getFeedbackSurveyList = () => {
    dispatch(
      organizationDetails(orgId, res => {
        if(res?.data?.assignedQuestionnaire){
          if('survey-appointment' in res?.data?.assignedQuestionnaire){
          dispatch (listFeedbackQuestions(res?.data?.assignedQuestionnaire['survey-appointment'],item => {
            setFeedbackList([item?.data]);
          }))
        }
          // if('getcare-waitingroom' in res?.data?.assignedQuestionnaire){
          //   dispatch(getCareQuestionListWR(res?.data?.assignedQuestionnaire['getcare-waitingroom']));
          //   }else{
          //     dispatch(setQuestionnaireListWR({getCareQuestionnaire: []}),);
          //   }
        }
      }),
    );
  };
  const handleStarClick = (questionIndex, subQuestionIndex, starIndex) => {
    const newRatings = [...ratings];
    if (!newRatings[questionIndex]) {
      newRatings[questionIndex] = {};
    }
    if (!newRatings[questionIndex][subQuestionIndex]) {
      newRatings[questionIndex][subQuestionIndex] = 0;
    }
    newRatings[questionIndex][subQuestionIndex] = starIndex + 1;
    setRatings(newRatings);

    // Clear the error message for this star field
    const questionId =
      feedbackList[questionIndex].item[subQuestionIndex].linkId;
    const newStarErrors = { ...starErrors };
    newStarErrors[questionId] = null;
    setStarErrors(newStarErrors);
  };

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

  const renderStar = (questionIndex, subQuestionIndex, starIndex) => {
    const starIcon =
      ratings[questionIndex]?.[subQuestionIndex] >= starIndex + 1
        ? IMAGES.feedback.starChecked
        : IMAGES.feedback.starUnChecked;
    return (
      <TouchableOpacity
        key={starIndex}
        onPress={() =>
          handleStarClick(questionIndex, subQuestionIndex, starIndex)
        }>
        <Image source={starIcon} />
      </TouchableOpacity>
    );
  };

  const setDesc = (text, questionId) => {
    setDescriptions(prevDescriptions => ({
      ...prevDescriptions,
      [questionId]: text,
    }));
    setDescErrors(prevErrors => ({
      ...prevErrors,
      [questionId]: null,
    }));
  };

  const submitFeedback = () => {
    let hasValidationError = false;
    const newDescErrors = { ...descErrors }; // Create a new object to track errors for freetext questions
    const newStarErrors = { ...starErrors }; // Create a new object to track errors for stars questions

    // Iterate through each question in the feedback list
    feedbackList?.forEach((question, questionIndex) => {
      question.item.forEach((subQuestion, subQuestionIndex) => {
        // Handle "freetext" type questions
        if (subQuestion.type === 'freeText') {
          const questionId = subQuestion.linkId;
          const description = descriptions[questionId] || '';

          if (subQuestion.required && Validate.empty(description)) {
            // Apply validation only if subQuestion.required is true
            newDescErrors[questionId] = 'Description should not be empty';
            hasValidationError = true;
          } else if (description.length > 250) {
            newDescErrors[questionId] =
              'Description should not be more than 250 characters';
            hasValidationError = true;
          } else {
            // Clear the error message if there are no validation errors
            newDescErrors[questionId] = null;
          }
        }

        // Handle "stars" type questions
        if (subQuestion.type === 'stars') {
          const questionId = subQuestion.linkId;
          const rating = ratings[questionIndex]?.[subQuestionIndex] || 0;

          if (subQuestion.required && rating === 0) {
            // Apply validation only if subQuestion.required is true
            newStarErrors[questionId] = 'Please rate this question';
            hasValidationError = true;
          } else {
            // Clear the error message when a star rating is selected
            newStarErrors[questionId] = null;
          }
        }
      });
    });

    // Update the error messages for both freetext and stars questions
    setDescErrors(newDescErrors);
    setStarErrors(newStarErrors);

    if (!hasValidationError) {
      // Create an array to hold the question responses
      const questionResponse = [];
      // Iterate through each question in the feedback list
      feedbackList?.forEach((question, questionIndex) => {
        question.item.forEach((subQuestion, subQuestionIndex) => {
          // Handle "stars" type questions
          if (subQuestion.type === 'stars') {
            const starResponse = {
              id: subQuestion.linkId, // Replace with the appropriate unique identifier
              question: subQuestion.text,
              questionType: 'stars',
              answer:
                [
                  {
                    required: false,
                    answer: ratings[questionIndex]?.[subQuestionIndex]?.toString(), // Convert to string
                    answer: ratings[questionIndex]?.[subQuestionIndex]?.toString(), // Convert to string,
                    option: null,
                    value: null,
                    name: null
                  }]
            };
            questionResponse.push(starResponse);
          }
          // Handle "freetext" type questions
          if (subQuestion.type === 'freeText') {
            const freetextResponse = {
              id: subQuestion.linkId, // Replace with the appropriate unique identifier
              question: subQuestion.text,
              questionType: 'freeText',
              answer:
                [
                  {
                    required: false,
                    answer: descriptions[subQuestion.linkId] || '', // Get the description from the state
                    answer: descriptions[subQuestion.linkId] || '', // Get the description from the state
                    option: null,
                    value: null,
                    name: null
                  }]
            };
            questionResponse.push(freetextResponse);
          }
        });
      });
      // Create the requestFeedback object
      const requestFeedback = {
        responseType: 'surveyResponse',
        patientID: patientID,
        encounterId: selectedAppt?.encounterId,
        questionResponse: questionResponse,
        questionnaire: feedbackList[0].id,
      };
      dispatch(feedBackSubmit(requestFeedback));
      // Navigate to the feedbackThanks screen
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.feedback.header}
        onBackPress={() => navigateToSession()}
      />
      <Loader isLoading={showLoader} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        style={{ marginBottom: moderateScale(55) }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: moderateScale(20) }}>
              <Text style={styles.feedbackque}>No questions added</Text>
            </View>
          }
          showsHorizontalScrollIndicator={false}
          data={feedbackList}
          renderItem={({ item, index }) => {
            return (
              <>
                <View style={styles.mainView}>
                  <View key={index}>
                    <View style={styles.subQuestionsView}>
                      {item.item.map((subQuestion, subQuestionIndex) =>
                        subQuestion.type === 'stars' ? (
                          <View
                            key={subQuestionIndex}
                            style={[styles.feedbackView]}>
                            <Text style={styles.feedbackque}>
                              {subQuestion.text}
                            </Text>
                            <View style={styles.starView}>
                              {Array.from({ length: 5 }, (_, starIndex) =>
                                renderStar(index, subQuestionIndex, starIndex),
                              )}
                            </View>
                            <View style={styles.ratingTextView}>
                              <Text style={styles.ratingText}>
                                {subQuestion?.lowRatingText}
                              </Text>
                              <Text style={styles.ratingText}>
                                {subQuestion?.highRatingText}
                              </Text>
                            </View>
                            <ErrorView
                              message={starErrors[subQuestion.linkId]}
                            />
                          </View>
                        ) : (
                          <View
                            style={[styles.inputsubmitView]}
                            key={subQuestion.linkId}>
                            <TextArea
                              customViewStyle={{
                                marginTop: moderateScale(10),
                              }}
                              customContainer={{
                                marginBottom: moderateScale(10),
                              }}
                              autoCapitalize="none"
                              accessibilityHint={strings.disease.desc}
                              accessibilityLabel={strings.disease.desc}
                              onChangeText={text =>
                                setDesc(text, subQuestion.linkId)
                              } // Pass the question's unique ID
                              value={descriptions[subQuestion.linkId] || ''} // Retrieve the description from the state
                              title={subQuestion?.text}
                              multiline={true}
                              numberOfLines={4}
                            />
                            <ErrorView
                              message={descErrors[subQuestion.linkId]}
                            />
                          </View>
                        ),
                      )}
                    </View>
                  </View>
                </View>
              </>
            );
          }}
        />
        {feedbackList.length > 0 && (
          <View style={styles.btnView}>
            <Button
              title={strings.feedback.submit}
              style={styles.btn}
              textStyle={styles.btnText2}
              onPress={() => {
                submitFeedback();
              }}
            />
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}
