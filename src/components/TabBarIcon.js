import PropTypes from 'prop-types';
import React from 'react';
import { Image } from 'react-native';
import { IMAGES} from '@/assets';
import { NAVIGATION } from '@/constants';

const tabIcon = {
  [NAVIGATION.home]: IMAGES.icons.bottomTab.homeInactive,
  [NAVIGATION.profile]: IMAGES.icons.bottomTab.profileInactive,
  [NAVIGATION.settings]: IMAGES.icons.drawerMenu.settings,
  [NAVIGATION.session]: IMAGES.icons.bottomTab.sessionInactive,
};

export function TabBarIcon({ color, routeName }) {
  return (
    <Image
      accessibilityIgnoresInvertColors
      source={tabIcon[routeName]}
      // style={{ tintColor: color }}
    />
  );
}

TabBarIcon.propTypes = {
  // color: PropTypes.string.isRequired,
  routeName: PropTypes.string.isRequired,
};
