// ====================================================================
// Course Corner - Supabase Configuration
// ====================================================================

const SUPABASE_URL = 'https://mwoaldzfljwvourzrpji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b2FsZHpmbGp3dm91cnpycGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0OTA4NDUsImV4cCI6MjExMDA2Njg0NX0.0XGF5hPd5XRz3uRQy9Zjw7rdCS7tW7DxcHNwmPEi0o8';

// Initialize Supabase Client
let supabaseClient = null;

if (window.supabase && SUPABASE_URL) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase Client initialized successfully for Realtime updates.');
    } catch (e) {
        console.error('Failed to initialize Supabase client:', e);
    }
} else {
    console.warn('⚠️ Supabase JS SDK not detected or credentials missing.');
}

window.supabaseClient = supabaseClient;
