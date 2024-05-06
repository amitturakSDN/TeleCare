import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION} from '@/constants';
import {DiseaseListing, AddDisease} from '@/screens/DiseaseManagement';
import {useTheme} from '@react-navigation/native';
import {
    Home,
    VitalMonitoring,
    BloodPressure,
    BloodGlucose,
    Session,
    Weight,
    Oxygen,
    Notification,
    Settings,
    BluetoothConnectivity,
    NewDevice,
    RequestGuidance,
    AddMedication,
    VitalMonitoringHistory,
    ResultsDashboard,
    PreviousReadings,
    IncomingCall,
    AddTemperature,
    Medication,
    RelatedPersonList,
    InviteRelative,
    Dependent,
    BluetoothBloodPressure,
    BluetoothOximeter,
    BluetoothScale,
    DependentInternal,
    Requisitions,
    BluetoothThermometer,
    BluetoothBloodGlucose,
    VedioCall,
    AppointmentNote,
    ProgramsList,
    HeartRate,
    GetCare,
    BookingList,
    GetCareForm,
    AppointmentSent,
    Feedback,
    FeedbackThanks,
    ServiceRequestDetails,
    Prescriptions,
    PrescriptionsDetails,
    EnterWaitingRoom,
    WaitingTimer,
    Questionnaire,
    QuestionnaireWR,
    BloodPressureAd,
    ThermometerFora,
    GlucometerAccua,
} from '@/screens';
const Stack = createNativeStackNavigator();

export function HomeNavigator() {
    const {colors} = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                contentStyle: {
                    backgroundColor: colors.app,
                },
            }}>
            <Stack.Screen
                name={NAVIGATION.dashboard}
                component={Home}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.diseaseListing}
                component={DiseaseListing}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.programsList}
                component={ProgramsList}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.addDisease}
                component={AddDisease}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.vitalMonitoring}
                component={VitalMonitoring}
                options={{headerShown: false}}
            />
            {/* <Stack.Screen
                name={NAVIGATION.session}
                component={Session}
                options={{headerShown: false}}
            /> */}
            <Stack.Screen
                name={NAVIGATION.vedioCall}
                component={VedioCall}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.note}
                component={AppointmentNote}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.bloodPressure}
                component={BloodPressure}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.bloodGlucose}
                component={BloodGlucose}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.weight}
                component={Weight}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.oxiMeter}
                component={Oxygen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.resultsDashboard}
                component={ResultsDashboard}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.previousReadings}
                component={PreviousReadings}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.incomingCall}
                component={IncomingCall}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.addTemperature}
                component={AddTemperature}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.heartRate}
                component={HeartRate}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.notification}
                component={Notification}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.settings}
                component={Settings}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.bluetoothConnectivity}
                component={BluetoothConnectivity}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.newDevice}
                component={NewDevice}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.requestGuidance}
                component={RequestGuidance}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.addMedication}
                component={AddMedication}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.vitalMonitoringHistory}
                component={VitalMonitoringHistory}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.medication}
                component={Medication}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.relatedPersonList}
                component={RelatedPersonList}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.invitePerson}
                component={InviteRelative}
                options={{headerShown: false}}
            />
            {/* <Stack.Screen
        name={NAVIGATION.dependent}
        component={Dependent}
        options={{headerShown: false}}
      /> */}
            <Stack.Screen
                name={NAVIGATION.dependentInternal}
                component={DependentInternal}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.requisitions}
                component={Requisitions}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.serviceRequestDetails}
                component={ServiceRequestDetails}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.prescriptions}
                component={Prescriptions}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.prescriptionsDetails}
                component={PrescriptionsDetails}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.btBloodPressure}
                component={BluetoothBloodPressure}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.btOximeter}
                component={BluetoothOximeter}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.btScale}
                component={BluetoothScale}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.btGlucose}
                component={BluetoothBloodGlucose}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.btThermometer}
                component={BluetoothThermometer}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.getCare}
                component={GetCare}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.bookingList}
                component={BookingList}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.getCareForm}
                component={GetCareForm}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.appointmentSent}
                component={AppointmentSent}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.feedback}
                component={Feedback}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.feedbackThanks}
                component={FeedbackThanks}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.enterWaitingRoom}
                component={EnterWaitingRoom}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.waitingTimer}
                component={WaitingTimer}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.questionnaire}
                component={Questionnaire}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.questionnaireWR}
                component={QuestionnaireWR}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.bloodPressureAd}
                component={BloodPressureAd}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name={NAVIGATION.thermometerFora}
                component={ThermometerFora}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name={NAVIGATION.GlucometerAccua}
                component={GlucometerAccua}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
}