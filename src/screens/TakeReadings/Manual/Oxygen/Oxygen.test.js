import {fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import {ManualReadingsController} from '@/controllers';
import {strings} from '@/localization';
import {Oxygen} from '@/screens/TakeReadings/Manual/Oxygen/Oxygen';
import {withProviders} from '@/test-utils';

jest.mock('@/controllers/ManualReadingsController');

describe('Oxygen', () => {
  const fakeData = {
    oxygen: 'oxygen',
  };

  it('should match the snapshot', () => {
    const {toJSON} = render(withProviders(<Oxygen />));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should submit correctly with valid input data', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');
    const { getByHintText, getByText } = render(withProviders(<Login />));

    const submitButton = getByText(strings.btn.title);
    const readings = getByHintText(strings.oximeter.subTitle);
   
    fireEvent.changeText(readings, fakeData.oxygen);
  
    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.oxygen);
  })

  it('should show error when reading is not provided', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');

    const {getByText} = render(withProviders(<Oxygen />));

    const submitButton = getByText(strings.btn.title);

    fireEvent.changeText(fakeData.oxygen);

    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.oxygen, '');
    expect(getByText(strings.validation.invalidNumber)).toBeTruthy();
  });
});
