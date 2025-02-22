"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Job {
  id: number;
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

export function JobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const formatId = (id: number) => `#${id.toString().padStart(4, '0')}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <p className="text-red-500 font-hanken mb-4">{error}</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-medium font-oddlini mb-2">Available Jobs</h1>
          <p className="text-muted-foreground font-hanken">
            Browse and manage compute jobs
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground font-hanken">No jobs available</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-medium font-hanken">{formatId(job.id)}</h3>
                  <p className="text-sm text-muted-foreground font-hanken">
                    {job.type_of_compute || 'Standard Compute'}
                  </p>
                </div>
                <Badge variant={job.status === 'completed' ? 'success' : 'default'}>
                  {job.status || 'Pending'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground font-hanken">Price: </span>
                  <span className="font-medium font-hanken">
                    {job.price ? `$${job.price.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground font-hanken">Created: </span>
                  <span className="font-medium font-hanken">
                    {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {job.result_file && (
                  <div className="text-sm">
                    <span className="text-muted-foreground font-hanken">Result: </span>
                    <Link 
                      href={job.result_file} 
                      className="text-primary hover:underline font-hanken"
                    >
                      View Results
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
