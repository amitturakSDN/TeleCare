import {setQuestionnaireList} from '@/actions/AppointmentAction';
import {AppHeader, Button, ErrorView, TextArea, TextView} from '@/components';
import {NAVIGATION} from '@/constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {IMAGES} from '@/assets';
import {AuthHelper} from '@/helpers';
import {getCareQuestionList} from '@/actions/AppointmentAction';
import {strings} from '@/localization';
import {useEffect, useState} from 'react';
import {FlatList, View, Text, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from './Questionnaire.styles';
import {Dropdown} from 'react-native-element-dropdown';
import {moderateScale} from '@/hooks/scale';
export function Questionnaire({navigation, route}) {
    const dispatch = useDispatch();
    let {type} = route.params;
    const {user} = useSelector(state => state);
    const {questionnaireData} = useSelector(state => state.appointment);
    const [location, setLocation] = useState(null);
    const  [reason, setReason] = useState('');
    const [orgId, setOrgId] = useState(user?.user?.orgId);
    const [questionList, setQuestionList] = useState([]);

    useEffect(() => {
        setQuestionListData();
        //console.log('Enterrrrr', questionnaireData);
    }, []);

    useEffect(() => {}, [questionnaireData]);

    /**Set array for questionire list */
    const setQuestionListData = () => {
        if (questionnaireData?.getCareQuestionnaire) {
            let all_question = [...questionnaireData?.getCareQuestionnaire[0]?.item];
            // console.log(JSON.stringify(all_question, undefined, 4), 'all_question');
            let updated_question = all_question.map(m => {
                m.answer = '';
                m.error = '';
                m.answerOption = m.answerOption.map(option => {
                    option.answer = null;
                    return option;
                });
                return m;
            });
            // //console.log(JSON.stringify(updated_question, undefined, 4), 'updated_question...');
            setQuestionList(updated_question);
        }
    };

    /**Handle Question data on submit */
    const validateQuestion = () => {
        let updated_question = questionList.map(m => {
            if (m.answerType === 'freeText' || m.answerType == 'dropDown') {
                m.error =
                    m.answer.toString().trim() == '' && m.required ? 'This field is mandatory' : '';
                return m;
            } else if (m.answerType === 'checkbox' || m.answerType === 'radio') {
                m.error =
                    m.answerOption.every(ans => !ans.answer) && m.required
                        ? 'This field is mandatory'
                        : '';
                return m;
            }
        });
        setQuestionList(updated_question);
        if (questionList.filter(m => m.answer.toString().trim() == '' && m.required).length == 0) {
            let questionResponse = [];
            questionList.map(subQuestion => {
                if (subQuestion.answerType === 'freeText' || subQuestion.answerType == 'dropDown') {
                    let freetextResponse = {
                        id: subQuestion.linkId, // Replace with the appropriate unique identifier
                        question: subQuestion.text,
                        questionType: subQuestion.answerType,
                        answer: subQuestion.answerOption.map(ans => {
                            ans.answer = subQuestion.answer;
                            ans.required = subQuestion.required;
                            ans.option = null;
                            ans.value = null;
                            ans.name = ans.text;
                            return ans;
                        }),
                    };
                    questionResponse.push(freetextResponse);
                } else if (subQuestion.answerType === 'checkbox') {
                    let freetextResponse = {
                        id: subQuestion.linkId, // Replace with the appropriate unique identifier
                        question: subQuestion.text,
                        questionType: subQuestion.answerType,
                        answer: subQuestion.answerOption.map(ans => {
                            ans.answer = ans.answer;
                            ans.required = subQuestion.required;
                            ans.option = ans.text;
                            ans.value = null;
                            ans.name = null;
                            return ans;
                        }),
                    };
                    questionResponse.push(freetextResponse);
                }
            });
            saveQuestion(questionResponse);
        }
    };

    /**Handle clieck event of radio and checkbox */
    const handleClickOption = (option, outerIndex, type = 'check') => {
        let selected_question = {...questionList[outerIndex]};
        let modified_answer = selected_question.answerOption.map(ans => {
            if (type == 'check') {
                if (ans.id == option.id) {
                    ans.answer = ans.answer ? false : true;
                }
            } else {
                ans.id == option.id ? (ans.answer = true) : (ans.answer = false);
            }
            return ans;
        });
        if (selected_question.tag === "REASON") {
            // console.log("this is a REASON!!!!", option.text);
            setReason(option.text);
        }
        setQuestionList(
            Object.assign([], questionList, {
                [outerIndex]: {
                    ...questionList[outerIndex],
                    answerOption: modified_answer,
                    answer: option.id,
                },
            }),
        );
    };

    /**API to save questionaire */
    const saveQuestion = questionResponse => {
        let param = {
            patientID: AuthHelper.getPatientId(),
            questionResponse,
            questionnaireId: questionnaireData.getCareQuestionnaire[0].id,
        };
        dispatch(
            setQuestionnaireList({
                ...questionnaireData,
                filled_questionnaire: param,
            }),
        );
        type == 'booking'
            ? navigation.push(NAVIGATION.getCareForm, {location: location, description: reason, orgId: orgId})
            : navigation.push(NAVIGATION.enterWaitingRoom, {location: location, description: reason});
    };

    /**Render Question Element */
    const renderQuestion = ({item, index}) => {
        return (
            <View key={index} style={{flex: 1}}>
                {item.answerType == 'freeText' && (
                    <>
                        <TextArea
                            title={`${item.text}`}
                            customViewStyle={styles.customView}
                            autoCapitalize="none"
                            accessibilityHint={strings.disease.desc}
                            accessibilityLabel={strings.disease.desc}
                            onChangeText={text => {
                                if (item.tag === "REASON") {
                                    // console.log("this is a REASON!!!!", text);
                                    setReason(text);
                                }

                                setQuestionList(
                                    Object.assign([], questionList, {
                                        [index]: {
                                            ...item,
                                            answer: text,
                                        },
                                    }),
                                );
                            }}
                            placeholder={strings.disease.placeholderDesc}
                            value={item.answer}
                            multiline={true}
                            numberOfLines={4}
                            customInputStyle={styles.questionBox}
                            customContainer={styles.questionContainerBox}
                            customTitleStyle={styles.questionTitle}
                        />
                        <ErrorView message={item.error} />
                    </>
                )}
                {item.answerType == 'dropDown' && renderDropDown({item, index})}
                {item.answerType == 'checkbox' && renderCheckbox({item, index})}
                {item.answerType == 'radio' && renderRadio({item, index})}
            </View>
        );
    };

    /**SHow dropdown question */
    const renderDropDown = ({item, index}) => {
        return (
            <View>
                <TextView
                    title={`${item.text}`}
                    viewStyle={[styles.label]}
                    textStyle={[styles.title]}
                />
                <Dropdown
                    style={styles.dropdown}
                    data={item.answerOption}
                    maxHeight={300}
                    labelField={'text'}
                    placeholderStyle={styles.input}
                    selectedTextStyle={styles.input}
                    search
                    searchPlaceholder="Search..."
                    itemTextStyle={styles.input}
                    valueField="id"
                    placeholder="Select"
                    value={item.answer}
                    onChange={selected => {
                        if (item.tag === 'LOCATION') {
                            setLocation(selected.text);
                        }
                        if (item.tag === "REASON") {
                            // console.log("this is a REASON!!!!", selected.text);
                            setReason(selected.text);
                        }
                        setQuestionList(
                            Object.assign([], questionList, {
                                [index]: {
                                    ...item,
                                    answer: selected.id,
                                },
                            }),
                        );
                    }}
                    renderItem={renderItem}
                />
                <ErrorView message={item.error} />
            </View>
        );
    };

    /**SHow checkbox question */
    const renderCheckbox = ({item, index}) => {
        return (
            <View>
                <TextView
                    title={`${item.text}`}
                    viewStyle={[styles.label]}
                    textStyle={[styles.title]}
                />
                {item.answerOption.map((option, sub_index) => {
                    return (
                        <View style={styles.iconView}>
                            <TouchableOpacity
                                style={styles.checkBoxContainer}
                                onPress={() => {
                                    handleClickOption(option, index);
                                }}>
                                <Image
                                    resizeMode="contain"
                                    style={{height: 20}}
                                    source={
                                        option.answer
                                            ? IMAGES.icons.checkBoxSelect
                                            : IMAGES.icons.checkBox
                                    }
                                />
                                <TextView
                                    title={`${option.text}`}
                                    textStyle={[styles.optionStyle]}
                                />
                            </TouchableOpacity>
                            {sub_index < item.answerOption.length - 1 && (
                                <View style={styles.line} />
                            )}
                        </View>
                    );
                })}

                <ErrorView message={item.error} />
            </View>
        );
    };

    /**SHow checkbox question */
    const renderRadio = ({item, index}) => {
        return (
            <View>
                <TextView
                    title={`${item.text}`}
                    viewStyle={[styles.label]}
                    textStyle={[styles.title]}
                />
                {item.answerOption.map((option, sub_index) => {
                    return (
                        <View style={styles.iconView}>
                            <TouchableOpacity
                                style={styles.checkBoxContainer}
                                onPress={() => {
                                    handleClickOption(option, index, 'radio');
                                }}>
                                <Image
                                    resizeMode="contain"
                                    style={{height: 20}}
                                    source={
                                        option.answer
                                            ? IMAGES.icons.radioChecked
                                            : IMAGES.icons.radio
                                    }
                                />
                                <TextView
                                    title={`${option.text}`}
                                    textStyle={[styles.optionStyle]}
                                />
                            </TouchableOpacity>
                            {sub_index < item.answerOption.length - 1 && (
                                <View style={styles.line} />
                            )}
                        </View>
                    );
                })}

                <ErrorView message={item.error} />
            </View>
        );
    };
    const renderItem = item => {
        return <TextView title={item.text} viewStyle={styles.item} />;
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title={strings.bookingList.questionnaire}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.push(NAVIGATION.notification)}
            />

            <KeyboardAwareScrollView
                contentContainerStyle={styles.inner_container}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                style={{marginBottom: moderateScale(55)}}>
                {/* <View style={styles.inner_container}> */}
                <FlatList
                    style={{marginBottom: moderateScale(20)}}
                    data={questionList}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) => {
                        return renderQuestion({item, index});
                    }}
                />

                {/* </View> */}
            </KeyboardAwareScrollView>
            <Button
                title={strings.buttons.submit}
                style={styles.btn}
                textStyle={styles.btnText2}
                onPress={() => validateQuestion()}
            />
        </View>
    );
}
