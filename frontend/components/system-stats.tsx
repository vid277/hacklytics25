"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Cpu, CircleOff, Activity, Laptop, Zap } from "lucide-react";

interface SystemStats {
  cpu_usage: number;
  memory_total: number;
  memory_used: number;
  cpu_info: string;
  cpu_cores: number;
  platform: string;
  architecture: string;
  hostname: string;
  uptime: number;
  last_updated: string;
  cpu_speed: number;
  capabilities: {
    score: number;
    bestFor: "CPU" | "GPU" | "Balanced";
    recommendations: string[];
  };
}

export function SystemStats() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanSystem = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch("/api/system-stats");
      if (!response.ok) throw new Error("Failed to scan system");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan system");
    } finally {
      setIsScanning(false);
    }
  };

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-medium font-oddlini">System Status</h2>
        <Button
          onClick={scanSystem}
          disabled={isScanning}
          variant="outline"
          className="font-hanken"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            "Scan System"
          )}
        </Button>
      </div>

      {error && (
        <p className="text-red-500 font-hanken text-sm mb-4">{error}</p>
      )}

      {stats && (
        <div className="space-y-4 font-hanken">
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            <span className="text-muted-foreground">System:</span>
            <span className="font-medium">
              {stats.hostname} ({stats.platform} {stats.architecture})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            <span className="text-muted-foreground">CPU:</span>
            <span className="font-medium">
              {stats.cpu_info} ({stats.cpu_cores} cores) - {stats.cpu_usage}%
              usage
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CircleOff className="h-4 w-4" />
            <span className="text-muted-foreground">Memory:</span>
            <span className="font-medium">
              {formatBytes(stats.memory_used)} /{" "}
              {formatBytes(stats.memory_total)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="text-muted-foreground">Uptime:</span>
            <span className="font-medium">{formatUptime(stats.uptime)}</span>
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4" />
              <span className="text-muted-foreground">System Score:</span>
              <span className="font-medium">
                {stats.capabilities.score}/100 (Best for{" "}
                {stats.capabilities.bestFor} tasks)
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Recommendations:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                {stats.capabilities.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Last updated: {new Date(stats.last_updated).toLocaleString()}
          </p>
        </div>
      )}

      {!stats && !error && (
        <p className="text-muted-foreground font-hanken">
          Click "Scan System" to check your system stats
        </p>
      )}
    </Card>
  );
}
