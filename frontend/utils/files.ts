import { createClient } from '@/utils/supabase/server';

export async function retrieveFiles(jobId: string) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`/api/retrieve-files-for-job?job_id=${jobId}&uuid=${session.user.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve files');
  }

  const data = await response.json();
  return {
    logs: data.logs,
    files: data.files.map((file: any) => ({
      filename: file.filename,
      content: atob(file.content) // Decode base64 content
    }))
  };
} 