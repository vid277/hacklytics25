"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { SystemStats } from "@/components/system-stats";
import { EditSchedule } from "@/components/edit-schedule";
import { Loader2 } from "lucide-react";
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
  status?: string;
  progress?: number;
  input_file?: string;
  error_message?: string;
  completed?: boolean;
}

interface JobLog {
  id: number;
  job_id: string;
  logs: string;
  created_at: string;
}

const getStatusBadgeVariant = (status: string | undefined, completed?: boolean, lender_id?: string) => {
  if (completed) {
    return "success" as const;
  }
  if (lender_id) {
    return "warning" as const;
  }
  return "default" as const;
};

export function DashboardContent() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [uploadedJobs, setUploadedJobs] = useState<Job[]>([]);
  const [lendingJobs, setLendingJobs] = useState<Job[]>([]);
  const [moneySpent, setMoneySpent] = useState(0);
  const [moneyReceived, setMoneyReceived] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAllUploads, setShowAllUploads] = useState(false);
  const [jobLogs, setJobLogs] = useState<Record<string, string>>({});

  const fetchJobLogs = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setJobLogs(prev => ({
          ...prev,
          [jobId]: data[0].logs
        }));
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;

    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data: uploaded, error: uploadError } = await supabase
          .from("jobs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (uploadError) throw uploadError;

        const sortedJobs = (uploaded || []).sort((a, b) => {
          if (a.completed && !b.completed) return -1;
          if (!a.completed && b.completed) return 1;
          if (a.lender_id && !b.lender_id) return -1;
          if (!a.lender_id && b.lender_id) return 1;
          return 0;
        });

        setUploadedJobs(sortedJobs);

        sortedJobs.forEach(job => {
          if (job.completed || job.lender_id) {
            fetchJobLogs(job.job_id!);
          }
        });

        const { data: lending, error: lendError } = await supabase
          .from("jobs")
          .select("*")
          .eq("lender_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (lendError) {
          console.error("Error fetching lending jobs:", lendError);
          return;
        }

        setLendingJobs(lending || []);

        const spent = (uploaded || []).reduce(
          (total: number, job: Job) => total + (job.price || 0),
          0,
        );
        const received = (lending || []).reduce(
          (total: number, job: Job) => total + (job.price || 0),
          0,
        );

        setMoneySpent(spent);
        setMoneyReceived(received);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [mounted, user]);

  if (!mounted) return null;

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleDownload = async (jobId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/retrieve-files-for-job?job_id=${jobId}`);
      const data = await response.json();
      
      data.files.forEach((file: { filename: string; content: string }) => {
        const blob = new Blob([atob(file.content)], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    } catch (error) {
      console.error('Error downloading files:', error);
    }
  };

  const renderJobCard = (job: Job) => (
    <div
      key={job.id}
      className="border rounded-lg p-4 hover:bg-gray-50/50 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-full">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="font-hanken text-sm">ID: {job.id}</p>
              <p className="font-hanken text-xs text-muted-foreground break-all">
                <span className="font-bold">Job ID:</span>{" "}
                {job.job_id || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(job.status, job.completed, job.lender_id)}>
                {job.completed ? "Completed" : job.lender_id ? "In Progress" : "Pending"}
              </Badge>
            </div>
          </div>
          <p className="font-hanken text-sm text-muted-foreground">
            Created: {new Date(job.created_at || "").toLocaleDateString()}
          </p>
          <div className="flex justify-between items-center mt-2">
            {(job.completed || job.lender_id) && (
              <span
                className="text-sm text-primary underline cursor-pointer hover:text-primary/80 font-hanken"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJobClick(job);
                }}
              >
                See logs
              </span>
            )}
            {job.completed && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(job.job_id!);
                }}
              >
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobDialog = () => (
    <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
      <DialogContent className="sm:max-w-[600px] shadow-lg backdrop-blur-[2px] bg-white/95 border-none">
        <DialogHeader className="mb-3">
          <DialogTitle>Job Details</DialogTitle>
        </DialogHeader>
        {selectedJob && (
          <div className="space-y-3">
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium">ID</p>
                <p className="text-sm text-muted-foreground">
                  {selectedJob.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Job ID</p>
                <p className="text-sm text-muted-foreground break-all">
                  {selectedJob.job_id || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={getStatusBadgeVariant(selectedJob.status, selectedJob.completed, selectedJob.lender_id)}>
                    {selectedJob.completed ? "Completed" : selectedJob.lender_id ? "In Progress" : "Pending"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Compute Type</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedJob.compute_type?.toLocaleUpperCase() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    ${selectedJob.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Created At</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedJob.created_at || "").toLocaleString()}
                </p>
              </div>
              {selectedJob.progress !== undefined && (
                <div>
                  <p className="text-sm font-medium">Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedJob.progress}%
                  </p>
                </div>
              )}
              {selectedJob.error_message && (
                <div>
                  <p className="text-sm font-medium text-red-500">Error</p>
                  <p className="text-sm text-red-500">
                    {selectedJob.error_message}
                  </p>
                </div>
              )}
            </div>
            {jobLogs[selectedJob.job_id!] && (
              <div>
                <p className="text-sm font-medium mb-2">Logs</p>
                <div className="relative">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-slate-950 text-slate-50 p-4 rounded-md font-mono max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                    <code>{jobLogs[selectedJob.job_id!]}</code>
                  </pre>
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-medium font-oddlini">Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/create">Upload New Image</Link>
          </Button>
          <Button asChild>
            <Link href="/jobs">View All Jobs</Link>
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/95 border rounded-lg shadow-sm backdrop-blur-sm p-6 transition-all duration-200">
          <h2 className="text-2xl font-medium font-oddlini mb-4">
            Your Uploads
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : uploadedJobs.length > 0 ? (
            <div className="space-y-4">
              {(showAllUploads ? uploadedJobs : uploadedJobs.slice(0, 4)).map(
                renderJobCard
              )}
              {uploadedJobs.length > 4 && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowAllUploads(!showAllUploads)}
                >
                  {showAllUploads
                    ? "Show Less"
                    : `Show ${uploadedJobs.length - 4} More`}
                </Button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground font-hanken">No uploads yet</p>
          )}
        </div>

        <div className="bg-white/95 border rounded-lg shadow-sm backdrop-blur-sm p-6 transition-all duration-200">
          <h2 className="text-2xl font-medium font-oddlini mb-4">
            Your Lending
          </h2>
          {lendingJobs.length > 0 ? (
            <div className="space-y-4">
              {lendingJobs.map(renderJobCard)}
              <Button asChild variant="ghost" className="w-full">
                <Link href="/jobs">View All Lending</Link>
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground font-hanken">
              No lending activity yet
            </p>
          )}
        </div>
        <div className="bg-white/95 border rounded-lg shadow-sm backdrop-blur-sm p-6 transition-all duration-200">
          <h2 className="text-2xl font-medium font-oddlini mb-4">
            Money Spent
          </h2>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold font-hanken text-primary">
              ${moneySpent.toFixed(2)}
            </span>
            <span className="ml-2 text-sm text-muted-foreground font-hanken">
              total spent on compute
            </span>
          </div>
        </div>

        <div className="bg-white/95 border rounded-lg shadow-sm backdrop-blur-sm p-6 transition-all duration-200">
          <h2 className="text-2xl font-medium font-oddlini mb-4">
            Money Received
          </h2>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold font-hanken text-green-600">
              ${moneyReceived.toFixed(2)}
            </span>
            <span className="ml-2 text-sm text-muted-foreground font-hanken">
              total earned from lending
            </span>
          </div>
        </div>
      </div>
      <SystemStats />
      <EditSchedule />

      {renderJobDialog()}
    </div>
  );
}
