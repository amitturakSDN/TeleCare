import { combineReducers } from 'redux';
import { errorReducer } from '@/reducers/ErrorReducer';
import { statusReducer } from '@/reducers/StatusReducer';
import { userReducer } from '@/reducers/UserReducer';
import { diseaseManagementReducer } from '@/reducers/DiseaseManagementReducer';
import { profileReducer } from '@/reducers/ProfileReducer';
import { settingsReducer } from '@/reducers/SettingsReducer';
import { manualReadingsReducer } from '@/reducers/ManualReadingsReducer';
import { notificationReducer } from '@/reducers/NotificationReducer';
import { medicationReducer } from '@/reducers/MedicationReducer';
import { requestGuidanceReducer } from '@/reducers/RequestGuidanceReducer';
import { AppointmentReducer } from '@/reducers/AppointmentReducer';
import { programsReducer } from '@/reducers/ProgramsReducer';
import { reqisitionReducer } from '@/reducers/RequisitionsReducer';
export const rootReducer = combineReducers({
  error: errorReducer,
  status: statusReducer,
  user: userReducer,
  diseases: diseaseManagementReducer,
  profile: profileReducer,
  settings: settingsReducer,
  manualReadings: manualReadingsReducer,
  notification: notificationReducer,
  medication: medicationReducer,
  requestGuidance: requestGuidanceReducer,
  appointment: AppointmentReducer,
  program: programsReducer,
  requisition: reqisitionReducer,
});
