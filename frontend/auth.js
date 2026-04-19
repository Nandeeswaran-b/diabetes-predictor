// Supabase Configuration
const SUPABASE_URL = "https://vktnvjixebmozuvebwm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdG52aml4ZWJtb3p1dnViZXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODcwNTMsImV4cCI6MjA5MjE2MzA1M30.nH1ptjBAsJ9HKmLGAmJfcnIJxNowcDUv0JLOXJOuVS8";

// Initialize Supabase Client (Using a different name to avoid conflict with the global 'supabase' object)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Helper Functions
const Auth = {
    // Check if user is logged in
    async checkSession() {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
                window.location.href = 'login.html';
            }
            return session;
        } catch (err) {
            console.error("Auth check failed:", err);
        }
    },

    // Sign Up
    async signUp(email, password) {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    },

    // Sign In
    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    // Sign Out
    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    },

    // Get current User ID
    async getUserId() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user ? user.id : null;
    }
};

// Auto-run session check if not on auth pages
if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
    Auth.checkSession();
}
