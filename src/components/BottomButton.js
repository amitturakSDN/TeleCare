import {moderateScale} from '@/hooks/scale';
import {useTheme} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {Button} from './Button';
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(10),
    width: '100%',
    height: moderateScale(18),
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(5),
  },
  buttonText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: moderateScale(18),
  },
  btn: {
    width: moderateScale(167),
    height: moderateScale(46),
  },
});

export function BottomButton({style, textStyle, title, width, ...rest}) {
  const {colors} = useTheme();

  return (
    <Button
      title={title}
      style={[styles.btn, style]}
      textStyle={textStyle}
      {...rest}
    />
  );
}

BottomButton.propTypes = {
  style: PropTypes.object,
  textStyle: PropTypes.object,
  title: PropTypes.string.isRequired,
};

BottomButton.defaultProps = {
  style: null,
  textStyle: null,
};
