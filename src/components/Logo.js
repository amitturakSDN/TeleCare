import React from 'react';
import { View, Image } from 'react-native';
import { IMAGES } from '@/assets';
import { moderateScale, deviceHeight, deviceWidth } from '@/hooks/scale';
export function Logo({ style,logoImgStyle, ...rest }) {

  return (
    <View style={ style } {...rest}>
        <Image source={IMAGES.auth.logo} style={logoImgStyle} />
    </View>
  );
}
