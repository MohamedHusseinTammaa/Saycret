/**
 * Auth: sign in, register, resend verification.
 * Uses API config and UI helpers.
 */

import { getApiUrl, API_ENDPOINTS } from './config.js';
import { showError, showSuccess, hideMessages, showVerifyEmailNotice, setLoading } from './ui.js';

export async function handleSignIn(event) {
    event.preventDefault();
    hideMessages();

    const email = document.getElementById('signin-email')?.value?.trim();
    const password = document.getElementById('signin-password')?.value;

    if (!email || !password) {
        showError('Please enter email and password.');
        return;
    }

    setLoading('signinBtn', true, 'Signing in...');

    try {
        const res = await fetch(getApiUrl(API_ENDPOINTS.login), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        console.log('Response:', res);

        const data = await res.json().catch(() => ({}));
        console.log('Data:', data);

        if (res.ok) {
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            if (data.data) {
                localStorage.setItem('userEmail', data.data);
            }
            showSuccess('Sign in successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            showError(data.message || 'Sign in failed. Check your credentials.');
        }
    } catch (err) {
        console.error('Sign in error:', err);
        showError('Connection error. Is the API running?');
    } finally {
        setLoading('signinBtn', false, 'Sign In');
    }
}

export async function handleRegister(event) {
    event.preventDefault();
    hideMessages();

    const firstName = document.getElementById('register-firstName')?.value?.trim();
    const lastName = document.getElementById('register-lastName')?.value?.trim();
    const userName = document.getElementById('register-username')?.value?.trim();
    const email = document.getElementById('register-email')?.value?.trim();
    const dateOfBirth = document.getElementById('register-dob')?.value?.trim();
    const gender = document.getElementById('register-gender')?.value;
    const phoneNumber = document.getElementById('register-phone')?.value?.trim();
    const password = document.getElementById('register-password')?.value;
    const confirmPassword = document.getElementById('register-confirm-password')?.value;

    if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
    }
    if (password.length < 8) {
        showError('Password must be at least 8 characters.');
        return;
    }
    if (!firstName || !lastName || !userName || !email || !dateOfBirth || gender === '' || !phoneNumber) {
        showError('Please fill in all fields.');
        return;
    }

    setLoading('registerBtn', true, 'Creating account...');

    try {
        const res = await fetch(getApiUrl(API_ENDPOINTS.register), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: { first: firstName, last: lastName },
                userName,
                email,
                dateOfBirth,
                gender: gender === 'true',
                phoneNumber,
                password,
            }),
        });
        
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
            showSuccess(data.message || 'Account created! Check your email to verify.');
            showVerifyEmailNotice(email);
        } else {
            const msg = data.message || (Array.isArray(data.details) ? data.details.map(d => d.msg).join(' ') : 'Registration failed.');
            showError(msg);
        }
    } catch (err) {
        console.error('Register error:', err);
        showError('Connection error. Is the API running?');
    } finally {
        setLoading('registerBtn', false, 'Sign Up');
    }
}

export async function handleResendVerification() {
    const emailEl = document.getElementById('verifyEmailAddress');
    const email = emailEl?.textContent?.trim();
    if (!email) return;

    hideMessages();
    setLoading('resendVerifyBtn', true, 'Sending...');

    try {
        const res = await fetch(getApiUrl(API_ENDPOINTS.verifyEmail), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
            showSuccess(data.message || 'Verification email sent. Check your inbox.');
        } else {
            showError(data.message || 'Could not send. Try again in a minute.');
        }
    } catch (err) {
        console.error('Resend error:', err);
        showError('Connection error.');
    } finally {
        setLoading('resendVerifyBtn', false, 'Resend verification email');
    }
}
export async function handleConfirmation() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;

    hideMessages();
    setLoading('resendVerifyBtn', true, 'Sending...');

    try {
        const res = await fetch(getApiUrl(API_ENDPOINTS.verifyEmail), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
            showSuccess(data.message || 'Verification is Done .');
        } else {
            showError(data.message || 'Could not verify , try again later');
        }
    } catch (err) {
        console.error('Resend error:', err);
        showError('Connection error.');
    } finally {
        setLoading('resendVerifyBtn', false, 'Resend verification email');
    }
}