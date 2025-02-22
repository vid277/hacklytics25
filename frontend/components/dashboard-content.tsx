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

export function DashboardContent() {
  const { user } = useAuth();
  const [uploadedJobs, setUploadedJobs] = useState<Job[]>([]);
  const [lendingJobs, setLendingJobs] = useState<Job[]>([]);
  const [moneySpent, setMoneySpent] = useState(0);
  const [moneyReceived, setMoneyReceived] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      try {
        const { data: uploaded, error: uploadError } = await supabase
          .from("jobs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (uploadError) {
          console.error("Error fetching uploaded jobs:", uploadError);
          return;
        }

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

        setUploadedJobs(uploaded || []);
        setLendingJobs(lending || []);

        const spent = (uploaded || []).reduce(
          (total, job) => total + (job.price || 0),
          0,
        );
        const received = (lending || []).reduce(
          (total, job) => total + (job.price || 0),
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
  }, [user]);

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
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-medium font-oddlini mb-4">
            Your Uploads
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : uploadedJobs.length > 0 ? (
            <div className="space-y-4">
              {uploadedJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-hanken text-sm">ID: {job.id}</p>
                      <p className="font-hanken text-sm text-muted-foreground">
                        Status: {job.status || "Pending"}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(job.status)}>
                      {job.status || "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button asChild variant="ghost" className="w-full">
                <Link href="/jobs">View All Uploads</Link>
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground font-hanken">No uploads yet</p>
          )}
        </div>

        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-medium font-oddlini mb-4">
            Your Lending
          </h2>
          {lendingJobs.length > 0 ? (
            <div className="space-y-4">
              {lendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-hanken text-sm">ID: {job.id}</p>
                      <p className="font-hanken text-sm text-muted-foreground">
                        Status: {job.status || "Pending"}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(job.status)}>
                      {job.status || "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
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
        <div className="bg-white border rounded-lg shadow-sm p-6">
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

        <div className="bg-white border rounded-lg shadow-sm p-6">
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
    </div>
  );
}
