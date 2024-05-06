import {Text, TouchableOpacity, View} from 'react-native';

import {strings} from '@/localization';
import {styles} from '@/screens/ResultsDashboard/ResultsDashboard.styles';

export function ResultsDashboard({navigation}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text style={styles.title}>{strings.bloodPressure.title}</Text>
      </TouchableOpacity>

      <View style={styles.circleView}>
        <View style={styles.outerCircle}>
          <View style={styles.midCircle}>
            <View style={styles.innerCircle}>
              <TouchableOpacity>
                <Text style={styles.readingCount}>118/80</Text>
                <Text style={styles.scale}>{strings.bloodPressure.scale}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.msg}>You are doing great!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
