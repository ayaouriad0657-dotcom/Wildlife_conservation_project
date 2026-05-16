const supabaseUrl = "https://misayvgmrhsxyjiskljb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc2F5dmdtcmhzeHlqaXNrbGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTgyNzQsImV4cCI6MjA5Mjk3NDI3NH0.P005Ws86TKU-9bmGtuYnnIuirvgWiPMpVqsCZ9pfHJ0";

window.supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);