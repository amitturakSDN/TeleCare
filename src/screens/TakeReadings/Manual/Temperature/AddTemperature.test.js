import {fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import {ManualReadingsController} from '@/controllers';
import {strings} from '@/localization';
import {AddTemperature} from '@/screens/TakeReadings/Manual/Temperature/AddTemperature';
import {withProviders} from '@/test-utils';

jest.mock('@/controllers/ManualReadingsController');

describe('AddTemperature', () => {
  const fakeData = {
    tempValue: 'tempValue',
  };

  it('should match the snapshot', () => {
    const {toJSON} = render(withProviders(<AddTemperature />));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should submit correctly with valid input data', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');
    
    const {getByHintText, getByText} = render(
      withProviders(<AddTemperature />),
    );

    const submitButton = getByText(strings.btn.title);
    const readings = getByHintText(strings.temperature.title);

    fireEvent.changeText(readings, fakeData.tempValue);

    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.tempValue);
  });

  it('should show error when reading is not provided', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');

    const {getByText} = render(withProviders(<AddTemperature />));

    const submitButton = getByText(strings.btn.title);

    fireEvent.changeText(fakeData.tempValue);

    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.tempValue, '');
    expect(getByText(strings.validation.invalidNumber)).toBeTruthy();
  });
});
