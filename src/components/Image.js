import {Image, View} from 'react-native';
export function ImageView({containerStyle, imageStyle, source, ...rest}) {
  return (
    <View style={{...containerStyle}} {...rest}>
      <Image source={source} style={{...imageStyle}} resizeMode={'contain'} />
    </View>
  );
}
