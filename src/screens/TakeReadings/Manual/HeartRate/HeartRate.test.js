import {fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import {ManualReadingsController} from '@/controllers';
import {strings} from '@/localization';
import {HeartRate} from '@/screens/TakeReadings/Manual/HeartRate/HeartRate';
import {withProviders} from '@/test-utils';

jest.mock('@/controllers/ManualReadingsController');

describe('HeartRate', () => {
  const fakeData = {
    heartValue: 'heartValue',
  };

  it('should match the snapshot', () => {
    const {toJSON} = render(withProviders(<HeartRate />));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should submit correctly with valid input data', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');
    const { getByHintText, getByText } = render(withProviders(<Login />));

    const submitButton = getByText(strings.btn.title);
    const readings = getByHintText(strings.oximeter.subTitle);
   
    fireEvent.changeText(readings, fakeData.heartValue);
  
    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.heartValue);
  })

  it('should show error when reading is not provided', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');

    const {getByText} = render(withProviders(<HeartRate />));

    const submitButton = getByText(strings.btn.title);

    fireEvent.changeText(fakeData.heartValue);

    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.heartValue, '');
    expect(getByText(strings.validation.invalidNumber)).toBeTruthy();
  });
});
