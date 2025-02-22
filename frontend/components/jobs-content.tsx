"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

interface Job {
  id: string;
  user_id: string;
  docker_address?: string;
  status?: string;
  created_at?: string;
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
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .or(`user_id.eq.${user.id},lender_user_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      setJobs(data || []);
    };

    fetchJobs();
  }, [user]);

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-medium font-oddlini">All Jobs</h1>
        <Button asChild variant="outline">
          <Link href="/upload">Upload New Image</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4 bg-white shadow">
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
        {jobs.length === 0 && (
          <p className="text-muted-foreground font-hanken">No jobs found</p>
        )}
      </div>
    </div>
  );
}
