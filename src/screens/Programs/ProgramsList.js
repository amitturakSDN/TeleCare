import {TYPES, getHistoryProgram} from '@/actions/ProgramsAction';
import {IMAGES} from '@/assets';
import {AppHeader, Loader, TextView} from '@/components';
import {AuthHelper} from '@/helpers';
import {strings} from '@/localization';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import moment from 'moment';
import {useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from './ProgramsList.styles';

export function ProgramsList({navigation}) {
  const dispatch = useDispatch();
  const {program} = useSelector(state => state);
  const patientId = AuthHelper.getPatientId();
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.PROGRAMS_LISTING], state),
  );
  useEffect(() => {
    dispatch(getHistoryProgram(patientId));
  }, []);

  return (
    <View style={styles.container}>
      <Loader isLoading={isLoading} />
      <AppHeader
        title={strings.settings.programs}
        onBackPress={() => navigation.pop()}
        rightIcon={IMAGES.icons.drawerMenu.settings}
        showRightIcon={false}
      />
      <View style={styles.listContainer}>
        {program?.list.length > 0 ? (
          <FlatList
            data={program?.list}
            renderItem={({item}) => {
              return (
                <View style={styles.contentContainer}>
                  <View style={styles.msgContainer}>
                    <TextView
                      title={item?.program?.title}
                      textStyle={styles.msgTxt}
                    />
                  </View>
                  <TextView
                    title={moment(item.createdAt).format('DD MMM, Y')}
                    textStyle={styles.timeTxt}
                    viewStyle={styles.timeContainer}
                  />

                  <View style={[styles.separator]} />
                </View>
              );
            }}
            keyExtractor={item => item.id}
          />
        ) : (
          !isLoading && (
            <View style={styles.empty}>
              <TextView title={'0 Program(s)'} />
            </View>
          )
        )}
      </View>
    </View>
  );
}
