import {View, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale} from '@/hooks/scale';
import {TabBarIcon, TextView} from '@/components';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: moderateScale(50),
    borderTopEndRadius: moderateScale(10),
    borderTopStartRadius: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowRadius: 3.84,
    // shadowOpacity: 0.25,
    shadowOffset: {
      width: moderateScale(10),
      height: moderateScale(2),
    },
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#005DA8',
    height: moderateScale(50),
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function TabNavigator({state, descriptors, navigation, show}) {
  return (
    <View style={[styles.container,show]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let gradients = isFocused
          ? ['rgba(0, 93, 168, 0.18)', 'rgba(217, 217, 217, 0)']
          : ['#fff', '#fff'];

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabContainer,
              {borderTopWidth: isFocused ? moderateScale(2) : 0},
            ]}>
            <LinearGradient style={styles.gradient} colors={gradients}>
              <TabBarIcon routeName={route.name} />
              <TextView
                title={label}
                textStyle={{color: isFocused ? '#005DA8' : '#8E8E8E',fontSize:moderateScale(12)}}
              />
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
