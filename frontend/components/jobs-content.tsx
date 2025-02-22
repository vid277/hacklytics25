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

const getStatusBadgeVariant = (status: string | undefined) => {
  switch (status) {
    case "completed":
      return "secondary" as const;
    default:
      return "default" as const;
  }
};

export function JobsContent() {
  const [mounted, setMounted] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (!mounted) return null;

  const formatId = (id: number) => `#${id.toString().padStart(4, "0")}`;

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
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-medium font-oddlini mb-2">
            Available Jobs
          </h1>
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
                  <h3 className="font-medium font-hanken">
                    {formatId(job.id)}
                  </h3>
                  <p className="text-sm text-muted-foreground font-hanken">
                    {job.compute_type || "Standard Compute"}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(job.status)}>
                  {job.status || "Pending"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground font-hanken">
                    Price:{" "}
                  </span>
                  <span className="font-medium font-hanken">
                    {job.price ? `$${job.price.toFixed(2)}` : "N/A"}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground font-hanken">
                    Created:{" "}
                  </span>
                  <span className="font-medium font-hanken">
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                {job.output_directory && (
                  <div className="text-sm">
                    <span className="text-muted-foreground font-hanken">
                      Output:{" "}
                    </span>
                    <Link
                      href={job.output_directory}
                      className="text-primary hover:underline font-hanken"
                    >
                      View Results
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-oddlini">Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-2 font-hanken mt-2">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <span className="font-medium">Compute Type:</span>
                <span>{selectedJob.compute_type || "Standard"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Timeout:</span>
                <span>{selectedJob.timeout || "N/A"} seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span className="font-medium">Container:</span>
                <span>{selectedJob.container_name || "N/A"}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
