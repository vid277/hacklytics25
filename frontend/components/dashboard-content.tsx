"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

interface Job {
  id: string;
  user_id: string;
  docker_address?: string;
  status?: string;
  created_at?: string;
  price?: number;
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

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      const { data: uploaded } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: lending } = await supabase
        .from("jobs")
        .select("*")
        .eq("lender_user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      const spent = (uploaded || []).reduce(
        (total, job) => total + (job.price || 0),
        0,
      );
      const received = (lending || []).reduce(
        (total, job) => total + (job.price || 0),
        0,
      );

      setUploadedJobs(uploaded || []);
      setLendingJobs(lending || []);
      setMoneySpent(spent);
      setMoneyReceived(received);
    };

    fetchJobs();
  }, [user]);

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-medium font-oddlini">Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/upload">Upload New Image</Link>
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
          {uploadedJobs.length > 0 ? (
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
    </div>
  );
}
