'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

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
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/sign-in');
        return;
      }

      const { data } = await supabase.from('jobs').select('*');
      if (data) {
        setJobs(data);
      }
    };

    fetchJobs();
  }, [router]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-oddlini">Available Jobs</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <pre className="overflow-auto">{JSON.stringify(jobs, null, 2)}</pre>
      </div>
    </div>
  );
}

