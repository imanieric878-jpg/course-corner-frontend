/**
 * auth-handlers.js
 * Centralized form handlers for Course Corner Authentication
 */

// Helper for alerts with fallback
function showAlert(title, text, icon = 'info') {
    if (window.Swal) {
        Swal.fire({ title, text, icon, confirmButtonColor: '#059669' });
    } else {
        alert(`${title}\n\n${text}`);
    }
}

// Login handler
async function handleLogin(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    const btn = document.getElementById('loginBtn');

    if (!email || !password) return;

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Logging in...';
    }

    try {
        const result = await window.firebaseAuth.signIn(email, password);
        if (result.success) {
            window.firebaseAuth.closeAuthModal();
            // Centralized redirection logic
            const currentPath = window.location.pathname;
            const isLocal = window.location.protocol === 'file:';
            
            if (currentPath.includes('index.html') || currentPath === '/' || (isLocal && currentPath.endsWith('/')) || currentPath.includes('calculator.html') || currentPath.includes('cluster-points.html')) {
                window.location.href = 'referral.html';
            }
        } else {
            showAlert('Login Failed', result.error || 'Please check your credentials and try again', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Error', 'An unexpected error occurred during login', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>Login</span>';
        }
    }
}

// Signup handler
async function handleSignup(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('signupName')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const phone = document.getElementById('signupPhone')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
    const btn = document.getElementById('signupBtn');

    // Basic validation
    if (password !== confirmPassword) {
        if (window.Swal) {
            Swal.fire({
                icon: 'error',
                title: 'Passwords do not match',
                text: 'Please make sure both passwords are the same'
            });
        }
        return;
    }

    // Phone validation
    if (!phone || !/^(0|254|\+254)?[17]\d{8}$/.test(phone.replace(/\s/g, ''))) {
        if (window.Swal) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Please enter a valid Kenyan phone number (07... or 01...)'
            });
        }
        return;
    }

    // Format phone number to 254...
    let formattedPhone = phone.replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.substring(1);
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating account...';
    }

    try {
        const result = await window.firebaseAuth.signUp(email, password, name, formattedPhone);
        if (result.success) {
            // Wait a small moment for overlays to show before redirecting
            setTimeout(() => {
                window.firebaseAuth.closeAuthModal();
                window.location.href = 'referral.html';
            }, 300);
        } else {
            showAlert('Signup Failed', result.error || 'Account creation failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showAlert('Error', 'An unexpected error occurred during signup', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>Create Account</span>';
        }
    }
}

// Google sign in handler
async function handleGoogleSignIn() {
    try {
        const result = await window.firebaseAuth.signInWithGoogle();
        if (result.success) {
            window.firebaseAuth.closeAuthModal();
            // Centralized redirection logic
            const currentPath = window.location.pathname;
            if (currentPath.includes('index.html') || currentPath === '/' || currentPath.includes('calculator.html') || currentPath.includes('cluster-points.html')) {
                window.location.href = 'referral.html';
            }
        }
    } catch (error) {
        console.error('Google sign in error:', error);
    }
}

// Password reset handler
async function handleResetPassword(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('resetEmail')?.value;
    const btn = document.getElementById('resetBtn');

    if (!email) return;

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    }

    try {
        await window.firebaseAuth.resetPassword(email);
        window.firebaseAuth.switchAuthMode('login');
    } catch (error) {
        console.error('Reset error:', error);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>Send Reset Link</span>';
        }
    }
}

// Logout handler
async function handleLogout() {
    await window.firebaseAuth.logout();
    window.firebaseAuth.closeProfileModal();
    
    // Redirect to home if on a protected page
    const currentPath = window.location.pathname;
    if (currentPath.includes('referral.html') || currentPath.includes('ref.html')) {
        window.location.href = 'index.html';
    }
}
window.handleLogout = handleLogout; // Ensure it's globally accessible for onclick attributes

// Sync profile data to modal when user state changes
if (window.firebaseAuth) {
    window.firebaseAuth.onAuthStateChange((user) => {
        if (user) {
            const nameEl = document.getElementById('userDisplayName');
            const emailEl = document.getElementById('userDisplayEmail');
            const avatarEl = document.getElementById('userAvatarLarge');

            if (nameEl) nameEl.textContent = user.displayName || 'User';
            if (emailEl) emailEl.textContent = user.email || '';

            if (avatarEl) {
                if (user.photoURL) {
                    avatarEl.innerHTML = `<img src="${user.photoURL}" alt="Profile" class="w-full h-full object-cover">`;
                } else {
                    const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
                    avatarEl.innerHTML = initial;
                }
            }
        }
    });
}
