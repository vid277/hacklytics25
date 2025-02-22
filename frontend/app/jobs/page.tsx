'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client';
import { useRouter } from 'next/navigation';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
      } else {
        setIsAuthenticated(true);
        // Only fetch jobs if user is authenticated
        const { data, error } = await supabase.from('jobs').select('*');
        if (error) {
          setError(error.message);
        } else if (data) {
          setJobs(data);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <pre className="overflow-auto">{JSON.stringify(jobs, null, 2)}</pre>
      </div>
    </div>
  );
}

