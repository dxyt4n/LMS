
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://anwqaikziinzahozosua.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud3FhaWt6aWluemFob3pvc3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDc3MDMsImV4cCI6MjA1NDkyMzcwM30.Ajkz3qkWswum3TJWffz-HLaVkD1bgzcrQTgJMhaEHK4';

export const supabase = createClient(supabaseUrl, supabaseKey);