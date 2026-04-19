// Supabase Configuration - REPLACE WITH YOUR ACTUAL KEYS
const SUPABASE_URL = "https://vktnvjixebmozuvebwm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdG52aml4ZWJtb3p1dnViZXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODcwNTMsImV4cCI6MjA5MjE2MzA1M30.nH1ptjBAsJ9HKmLGAmJfcnIJxNowcDUv0JLOXJOuVS8"; // Find this in Settings > API

// Initialize Supabase Client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Helper Functions
const Auth = {
    // Check if user is logged in
    async checkSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
            window.location.href = 'login.html';
        }
        return session;
    },

    // Sign Up
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    },

    // Sign In
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    // Sign Out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    },

    // Get current User ID
    async getUserId() {
        const { data: { user } } = await supabase.auth.getUser();
        return user ? user.id : null;
    }
};

// Auto-run session check if not on auth pages
if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
    Auth.checkSession();
}
