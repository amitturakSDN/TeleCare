import { showMessage } from 'react-native-flash-message'

/**
 * Show error message with title and description (optional)
 * @param {string} error 
 * @param {string=} description 
 */
export const showError = (error, description) => showMessage({
    type: 'danger',
    message: error,
    description,
    duration : 5000
})

/**
 * Show success message with title and description (optional)
 * @param {string} message 
 * @param {string=} description 
 */
export const showSuccess = (message, description, color ="#121F48",duration = 5000) => showMessage({
    type: 'success',
    backgroundColor: color,
    message,
    description,
    duration
})