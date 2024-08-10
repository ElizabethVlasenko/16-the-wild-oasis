import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ezstpslernrxwzjbbwng.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6c3Rwc2xlcm5yeHd6amJid25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyODM5MTAsImV4cCI6MjAzODg1OTkxMH0.7Ar4YDru41pMtHecJEEBA29-4BjvSvw2uBj0JkgtSK0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
