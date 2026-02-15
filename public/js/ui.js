/**
 * UI helper functions for showing/hiding messages and loading states
 */

export function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 5000);
    }
}

export function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => successDiv.style.display = 'none', 5000);
    }
}

export function hideMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

export function setLoading(buttonId, isLoading, text = '') {
    const button = document.getElementById(buttonId);
    if (!button) return;

    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span>' + (text || 'Processing...');
    } else {
        button.disabled = false;
        // Reset to original text based on button ID
        if (buttonId === 'signinBtn') {
            button.textContent = 'Sign In';
        } else if (buttonId === 'registerBtn') {
            button.textContent = 'Sign Up';
        } else if (buttonId === 'resendVerifyBtn') {
            button.textContent = 'Resend verification email';
        } else {
            button.textContent = text || 'Submit';
        }
    }
}

export function switchForm(formType) {
    const signinForm = document.getElementById('signinForm');
    const registerForm = document.getElementById('registerForm');
    const verifyNotice = document.getElementById('verifyEmailNotice');
    
    hideMessages();
    
    // Hide all forms
    if (signinForm) signinForm.classList.remove('active');
    if (registerForm) registerForm.classList.remove('active');
    if (verifyNotice) verifyNotice.classList.remove('active');
    
    // Show requested form
    if (formType === 'register' && registerForm) {
        registerForm.classList.add('active');
    } else if (formType === 'signin' && signinForm) {
        signinForm.classList.add('active');
    }
}

export function showVerifyEmailNotice(email) {
    const signinForm = document.getElementById('signinForm');
    const registerForm = document.getElementById('registerForm');
    const verifyNotice = document.getElementById('verifyEmailNotice');
    const emailDisplay = document.getElementById('verifyEmailAddress');
    
    if (signinForm) signinForm.classList.remove('active');
    if (registerForm) registerForm.classList.remove('active');
    
    if (emailDisplay) emailDisplay.textContent = email;
    if (verifyNotice) {
        verifyNotice.classList.add('active');
    }
}

export function togglePassword(button) {
    const targetId = button.getAttribute('data-target');
    const input = document.getElementById(targetId);
    
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = 'Hide';
    } else {
        input.type = 'password';
        button.textContent = 'Show';
    }
}