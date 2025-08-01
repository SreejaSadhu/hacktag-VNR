import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwfzoewpbfjrvggdujxm.supabase.co'; // correct format!
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZnpvZXdwYmZqcnZnZ2R1anhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDIzMDMsImV4cCI6MjA2OTYxODMwM30.Q7G8LKgmOsHd1C6t2ZahfIpLK2N7dp3HgUOjSFMIDV4'; // your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);