import {TextView} from '@/components';
import {moderateScale} from '@/hooks/scale';
import AnimatedLoader from 'react-native-animated-loader';
export const Loader = ({isLoading}) => {
  return (
    <AnimatedLoader
      visible={isLoading}
      overlayColor="rgba(255,255,255,0.75)"
      animationStyle={{width: moderateScale(100), height: moderateScale(100)}}
      speed={1}>
      <TextView title={'Loading...'} />
    </AnimatedLoader>
  );
};
