import {fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import {ManualReadingsController} from '@/controllers';
import {strings} from '@/localization';
import { Weight } from '@/screens/TakeReadings/Manual/Weight/';
import {withProviders} from '@/test-utils';

jest.mock('@/controllers/ManualReadingsController');

describe('Weight', () => {
  const fakeData = {
    weightValue: 'weightValue',
  };

  it('should match the snapshot', () => {
    const {toJSON} = render(withProviders(<Weight />));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should submit correctly with valid input data', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');
    const { getByHintText, getByText } = render(withProviders(<Weight/>));

    const submitButton = getByText(strings.btn.title);
    const readings = getByHintText(strings.weight.title);
   
    fireEvent.changeText(readings, fakeData.weightValue);
  
    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.weightValue);
  })

  it('should show error when reading is not provided', async () => {
    const readingsSpy = jest.spyOn(ManualReadingsController, 'add');

    const {getByText} = render(withProviders(<Weight/>));

    const submitButton = getByText(strings.btn.title);

    fireEvent.changeText(fakeData.weightValue);

    await waitFor(() => {
      fireEvent.press(submitButton);
    });

    expect(readingsSpy).toHaveBeenCalledWith(fakeData.weightValue, '');
    expect(getByText(strings.validation.invalidNumber)).toBeTruthy();
  });
});
