/**
 * Main entry point - sets up event listeners and initializes the app
 */

import { handleSignIn, handleRegister, handleResendVerification, handleConfirmation } from './auth.js';
import { switchForm, togglePassword } from './ui.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if there's a token in URL (email verification)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        // User clicked verification link, verify their email
        handleConfirmation();
    } else {
        // Normal flow - check if user is already logged in
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            // Optionally verify token with API or just redirect
            // window.location.href = '/dashboard';
        }
    }

    // Sign in form
    const signinFormEl = document.getElementById('signinFormEl');
    if (signinFormEl) {
        signinFormEl.addEventListener('submit', handleSignIn);
    }

    // Register form
    const registerFormEl = document.getElementById('registerFormEl');
    if (registerFormEl) {
        registerFormEl.addEventListener('submit', handleRegister);
    }

    // Switch to register
    const switchToRegister = document.getElementById('switchToRegister');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('register');
        });
    }

    // Switch to sign in
    const switchToSignin = document.getElementById('switchToSignin');
    if (switchToSignin) {
        switchToSignin.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('signin');
        });
    }

    // Back to sign in after verify
    const backToSigninAfterVerify = document.getElementById('backToSigninAfterVerify');
    if (backToSigninAfterVerify) {
        backToSigninAfterVerify.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('signin');
        });
    }

    // Resend verification
    const resendVerifyBtn = document.getElementById('resendVerifyBtn');
    if (resendVerifyBtn) {
        resendVerifyBtn.addEventListener('click', handleResendVerification);
    }

    // Toggle password visibility
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => togglePassword(button));
    });
});