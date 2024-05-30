import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://zvkrfgunpkfnzonjyvno.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2a3JmZ3VucGtmbnpvbmp5dm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3ODUxMjksImV4cCI6MjAyOTM2MTEyOX0.9aAbU2toHB_IwLIJTxUxS_IBT1oLFIXM9DDbieU_h-A';
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getTargetUrl() {
  const { data, error } = await supabase.from('targetUrl').select('*');

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  return data;
}
