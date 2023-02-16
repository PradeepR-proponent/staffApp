import { combineReducers } from 'redux';
import Theme from './Themes';
import Auth from './Auth';
import ShowAppIntro from './ShowAppIntro';
import AppointmentReducer from './Appointment.js'
import AppData from './AppData';

export default combineReducers({
    Theme, Auth, ShowAppIntro, AppointmentReducer, AppData
});