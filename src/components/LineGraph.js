// @ts-nocheck
import {Fonts} from '@/assets';
import {moderateScale} from '@/hooks/scale';
import {Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

export const LineGraph = ({
  xAxis,
  yAxis,
  YAxisDiastolic,
  titleForCheck,
  lable,
}) => {
   // Function to get the maximum decimal places in an array of numbers
   function getMaxDecimalPlaces(...arrays) {
    let maxDecimalPlaces = 0;

    arrays.forEach((arr) => {
      arr.forEach((value) => {
        const decimalPlaces = (value.toString().split('.')[1] || []).length;
        maxDecimalPlaces = Math.max(maxDecimalPlaces, decimalPlaces);
      });
    });

    return maxDecimalPlaces;
  }
  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: getMaxDecimalPlaces(YAxisDiastolic, yAxis),
    color: (opacity = 1) => `rgba(117, 222, 203, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 148, 148, ${opacity})`,
    style: {
      borderRadius: 10,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    fillShadowGradientOpacity: 0.5,
    formatYLabel: (value) => {
      // Check if any value has a decimal part
      const maxDecimalPlaces = getMaxDecimalPlaces(YAxisDiastolic, yAxis);

      // Display decimal places only if there are decimal values in the data
      return maxDecimalPlaces > 0 ? value.toFixed(maxDecimalPlaces) : value.toString();
    },
  };

  return (
    <View style={{ alignSelf: 'center' }}>
      {xAxis && xAxis.length && yAxis && yAxis.length ? (
        <LineChart
          data={{
            labels: xAxis,
            datasets: [
              {
                data: YAxisDiastolic,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Set color for the first dataset
              },
              {
                data: yAxis,
                color: (opacity = 1) => `rgba(117, 222, 203, ${opacity})`,
              },
            ],
          }}
          width={moderateScale(341)} // from react-native
          height={moderateScale(200)}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 10,
            backgroundColor: 'white',
          }}
          // fromZero={true}
        />
      ) : null}
      {titleForCheck === 'Blood Pressure' && (
        <View
          style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 5 }}>
          <Text style={{ fontFamily: Fonts.medium }}>
            <View
              style={{
                borderColor: '#ffa726',
                borderWidth: 2,
                backgroundColor: '#75DECB',
                borderRadius: 50,
                width: 10,
                height: 10,
              }}></View>{' '}
            Systolic{' '}
          </Text>
          <Text style={{ fontFamily: Fonts.medium }}>
            <View
              style={{
                borderColor: '#ffa726',
                borderWidth: 2,
                backgroundColor: '#005DA8',
                borderRadius: 50,
                width: 10,
                height: 10,
              }}></View>{' '}
            Diastolic{' '}
          </Text>
        </View>
      )}
    </View>
  );
};