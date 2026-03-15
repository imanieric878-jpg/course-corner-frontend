/**
 * auth-ui.js
 * Centralized UI components for Course Corner Authentication
 */

(function() {
    // Inject Auth and Profile Modals into the document
    function injectModals() {
        const existingAuth = document.getElementById('authModal');
        const existingProfile = document.getElementById('profileModal');
        
        // Always ensuring we have a clean slate for profile if it exists as lite
        if (existingProfile) {
            existingProfile.remove();
        }

        // Only inject if at least one is missing
        if (existingAuth && document.getElementById('profileModal')) {
            return;
        }

        // But we must also check if existingAuth is "Lite"
        if (existingAuth && !existingAuth.querySelector('#signupForm')) {
            console.log('🧹 Removing restricted auth modal to inject full version');
            const container = existingAuth.closest('.auth-modal-overlay') || existingAuth;
            container.remove();
        } else if (existingAuth && document.getElementById('profileModal')) {
            return;
        }

        // If we still need to inject (either auth is missing/lite OR profile is missing)
        if (!document.getElementById('authModal') || !document.getElementById('profileModal')) {
            const modalHtml = `
            <!-- Auth Modal -->
            <div id="authModal" class="auth-modal-overlay hidden">
                <div class="auth-modal">
                    <div class="modal-header">
                        <h2>Welcome</h2>
                        <button class="modal-close-btn" onclick="window.firebaseAuth.closeAuthModal()">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="auth-tabs">
                            <button id="loginTab" class="auth-tab active" onclick="window.firebaseAuth.switchAuthMode('login')">
                                Login
                            </button>
                            <button id="signupTab" class="auth-tab" onclick="window.firebaseAuth.switchAuthMode('signup')">
                                Sign Up
                            </button>
                        </div>
                        
                        <!-- Login Form -->
                        <form id="loginForm" class="auth-form" onsubmit="handleLogin(event)">
                            <div class="form-group">
                                <label for="loginEmail">Email Address</label>
                                <input type="email" id="loginEmail" class="form-input" placeholder="Enter your email" required>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">Password</label>
                                <input type="password" id="loginPassword" class="form-input" placeholder="Enter your password" required>
                            </div>
                            <div class="form-group text-right">
                                <a class="auth-link text-sm" onclick="window.firebaseAuth.switchAuthMode('forgot')">Forgot password?</a>
                            </div>
                            <button type="submit" id="loginBtn" class="btn-primary">
                                <span>Login</span>
                            </button>
                        </form>

                        <!-- Signup Form -->
                        <form id="signupForm" class="auth-form hidden" onsubmit="handleSignup(event)">
                            <div class="form-group">
                                <label for="signupName">Full Name</label>
                                <input type="text" id="signupName" class="form-input" placeholder="Enter your name" required>
                            </div>
                            <div class="form-group">
                                <label for="signupEmail">Email Address</label>
                                <input type="email" id="signupEmail" class="form-input" placeholder="Enter your email" required>
                            </div>
                            <div class="form-group">
                                <label for="signupPhone">M-Pesa Phone <span class="text-xs text-gray-500">(for payouts)</span></label>
                                <input type="tel" id="signupPhone" class="form-input" placeholder="07XXXXXXXX" required pattern="^(0|254|\\+254)?[17]\\d{8}$">
                            </div>
                            <div class="form-group">
                                <label for="signupPassword">Password</label>
                                <input type="password" id="signupPassword" class="form-input" placeholder="Create a password (min 6 chars)" required minlength="6">
                            </div>
                            <div class="form-group">
                                <label for="signupConfirmPassword">Confirm Password</label>
                                <input type="password" id="signupConfirmPassword" class="form-input" placeholder="Confirm your password" required minlength="6">
                            </div>
                            <button type="submit" id="signupBtn" class="btn-primary">
                                <span>Create Account</span>
                            </button>
                        </form>

                        <!-- Forgot Password Form -->
                        <form id="forgotPasswordSection" class="auth-form hidden" onsubmit="handleResetPassword(event)">
                            <p class="text-gray-600 mb-4">Enter your email and we'll send you a reset link.</p>
                            <div class="form-group">
                                <label for="resetEmail">Email Address</label>
                                <input type="email" id="resetEmail" class="form-input" placeholder="Enter your email" required>
                            </div>
                            <button type="submit" id="resetBtn" class="btn-primary">
                                <span>Send Reset Link</span>
                            </button>
                            <div class="text-center mt-3">
                                <a class="auth-link" onclick="window.firebaseAuth.switchAuthMode('login')">Back to Login</a>
                            </div>
                        </form>

                        <!-- Divider -->
                        <div class="auth-divider">
                            <span>or</span>
                        </div>

                        <!-- Google Sign In -->
                        <button id="googleSignIn" class="btn-google" onclick="handleGoogleSignIn()">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20">
                            <span>Continue with Google</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Profile Modal -->
            <div id="profileModal" class="fixed inset-0 z-[100] hidden overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onclick="window.firebaseAuth.closeProfileModal()"></div>
                    
                    <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xs border border-gray-100">
                        <div class="absolute right-3 top-3">
                            <button type="button" class="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors" onclick="window.firebaseAuth.closeProfileModal()">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>

                        <div class="p-5 sm:p-6">
                            <div class="mb-6 flex flex-col items-center">
                                <div id="userAvatarLarge" class="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl font-bold mb-3 border-4 border-white shadow-sm overflow-hidden">
                                    ?
                                </div>
                                <h3 id="userDisplayName" class="text-lg font-bold text-gray-900">User</h3>
                                <p id="userDisplayEmail" class="text-xs text-gray-500">email@example.com</p>
                            </div>

                            <div class="mt-6">
                                <button onclick="handleLogout()" class="w-full bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = modalHtml;
        document.body.appendChild(container);

        // Add close on backdrop click for authModal
        document.getElementById('authModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'authModal') {
                window.firebaseAuth.closeAuthModal();
            }
        });
        }
    }

    // Initialize UI on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectModals);
    } else {
        injectModals();
    }
})();
