import {fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import {ManualReadingsController} from '@/controllers';
import {strings} from '@/localization';
import {BloodPressure} from '@/screens/TakeReadings/Manual/BloodPressure/BloodPressure';
import {withProviders} from '@/test-utils';

jest.mock('@/controllers/ManualReadingsController');

describe('BloodPressure', () => {
  const fakeData = {
    sysValue: 'sysValue',
    diaValue: 'diaValue',
  };

  it('should match the snapshot', () => {
    const {toJSON} = render(withProviders(<BloodPressure />));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should submit correctly with valid input data', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');
    const {getByHintText, getByText} = render(withProviders(<BloodPressure />));

    const submitButton = getByText(strings.btn.title);
    const sysInput = getByHintText(strings.bloodPressure.title);
    const diaInput = getByHintText(strings.bloodPressure.title);

    fireEvent.changeText(sysInput, fakeData.sysValue);
    fireEvent.changeText(diaInput, fakeData.diaValue);

    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.sysValue,fakeData.diaValue);
    
  });

  it('should show error when reading is not provided', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');

    const {getByText} = render(withProviders(<BloodPressure />));

    const submitButton = getByText(strings.btn.title);

    fireEvent.changeText(fakeData.sysValue);
    fireEvent.changeText(fakeData.diaValue);

    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.username, fakeData.password);
    expect(getByText(strings.validation.invalidNumber)).toBeTruthy();
  });
});
