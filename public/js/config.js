/**
 * API configuration
 */

// Change this to your API URL
export const API_BASE_URL = 'http://localhost:2001/api';

export const API_ENDPOINTS = {
    login: '/users/login',
    register: '/users/register',
    verifyEmail: '/users/verify-email',
    confirm:'users/confirm'
};

export function getApiUrl(endpoint) {
    return API_BASE_URL + endpoint;
}