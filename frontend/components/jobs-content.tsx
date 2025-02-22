"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Clock, Server, HardDrive } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Job {
  id: number;
  user_id: string;
  job_id?: string;
  compute_type?: string;
  timeout?: number;
  output_directory?: string;
  lender_id?: string;
  price?: number;
  created_at?: string;
  container_name?: string;
  status?: string;
}

export function JobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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

  const handleSelectJob = async (job: Job) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ lender_id: 'YOUR_USER_ID' }) // Replace with actual user ID
        .eq('id', job.id)
        .select();

      if (error) throw error;
      // Refresh jobs list
      const { data: updatedJobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      setJobs(updatedJobs || []);
    } catch (err) {
      console.error('Error selecting job:', err);
    }
  };

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
                  <h3 className="font-medium font-hanken">#{job.id.toString().padStart(4, '0')}</h3>
                  <p className="text-sm text-muted-foreground font-hanken">
                    {job.compute_type || 'Standard Compute'}
                  </p>
                </div>
                <Badge variant={job.status === 'completed' ? 'success' : 'default'}>
                  {job.status || 'Pending'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-hanken">Timeout: </span>
                  <span className="font-medium font-hanken">
                    {job.timeout ? `${job.timeout}s` : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-hanken">Container: </span>
                  <span className="font-medium font-hanken truncate">
                    {job.container_name || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-hanken">Output: </span>
                  <span className="font-medium font-hanken truncate">
                    {job.output_directory || 'N/A'}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground font-hanken">Price: </span>
                  <span className="font-medium font-hanken">
                    {job.price ? `$${job.price.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </Button>
                {!job.lender_id && (
                  <Button 
                    className="flex-1" 
                    onClick={() => handleSelectJob(job)}
                  >
                    Select Job
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-oddlini">
              Job Details #{selectedJob?.id.toString().padStart(4, '0')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {selectedJob && Object.entries(selectedJob).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-sm font-medium font-hanken capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-muted-foreground font-hanken">
                    {value?.toString() || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
