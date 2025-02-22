"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Clock, Server } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/hooks/use-toast";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;

    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .is("lender_id", null)
          .neq("user_id", user.id)
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
  }, [mounted, user]);

  const handleClaimJob = async (job: Job) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to claim jobs",
        variant: "destructive",
      });
      return;
    }

    setIsClaimLoading(true);
    try {
      const { error: updateError } = await supabase
        .from("jobs")
        .update({ lender_id: user.id })
        .eq("id", job.id);

      if (updateError) {
        throw new Error("Failed to claim job");
      }

      toast({
        title: "Job claimed successfully",
        description: "You can now process this job",
      });

      const { data: updatedJobs, error: fetchError } = await supabase
        .from("jobs")
        .select("*")
        .is("lender_id", null)
        .neq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw new Error("Failed to refresh jobs list");
      }

      setJobs(updatedJobs || []);
      setShowClaimDialog(false);
      setSelectedJob(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast({
        title: "Failed to claim job",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsClaimLoading(false);
    }
  };

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

              <div className="space-y-2 font-hanken mt-5 pt-5 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Server className="h-4 w-4" />
                  <span className="text-muted-foreground font-hanken">
                    Compute Type:
                  </span>
                  <span>{job.compute_type || "Standard"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="text-muted-foreground font-hanken">
                    Timeout:
                  </span>
                  <span>
                    {job.timeout || "N/A"} {job.timeout == 1 ? "hour" : "hours"}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowClaimDialog(true);
                  }}
                  disabled={
                    job.status === "claimed" ||
                    job.status === "completed" ||
                    job.lender_id === user?.id
                  }
                >
                  {job.lender_id === user?.id
                    ? "Your Job"
                    : job.status === "claimed"
                      ? "Already Claimed"
                      : "Claim Job"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Claim Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to claim this job? You'll be responsible for
              processing it.
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Job ID</p>
                  <p className="text-sm text-muted-foreground break-all">
                    {selectedJob.job_id || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Compute Type</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedJob.compute_type || "Standard"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    ${selectedJob.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedJob && handleClaimJob(selectedJob)}
              disabled={isClaimLoading}
            >
              {isClaimLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                "Claim Job"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
