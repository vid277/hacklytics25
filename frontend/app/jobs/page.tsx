'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client';

interface Job {
  id: string;
  user_id: string;
  lender_user_id?: string;
  type_of_compute?: string;
  docker_address?: string;
  price?: number;
  status?: string;
  result_file?: string;
  created_at?: string;
  updated_at?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) {
        setError(error.message);
      } else if (data) {
        setJobs(data);
      }
    };
    fetchJobs();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Jobs (Client-Side Rendering)</h1>
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </div>
  );
}

