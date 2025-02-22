import { NextResponse } from "next/server";
import os from "os";

interface SystemCapabilities {
  score: number; // 0-100
  bestFor: "CPU" | "GPU" | "Balanced";
  recommendations: string[];
}

export async function GET() {
  try {
    const cpuInfo = os.cpus()[0];
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    const capabilities = analyzeCapabilities({
      cpuModel: cpuInfo.model,
      cpuCores: os.cpus().length,
      totalMemoryGB: totalMemory / (1024 * 1024 * 1024),
      memoryUsagePercent: ((totalMemory - freeMemory) / totalMemory) * 100,
      cpuSpeed: cpuInfo.speed,
    });

    const stats = {
      cpu_usage: getCpuUsage(),
      memory_total: totalMemory,
      memory_used: totalMemory - freeMemory,
      cpu_info: cpuInfo.model,
      cpu_cores: os.cpus().length,
      cpu_speed: cpuInfo.speed,
      platform: os.platform(),
      architecture: os.arch(),
      hostname: os.hostname(),
      uptime: os.uptime(),
      capabilities,
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get system stats" },
      { status: 500 },
    );
  }
}

function analyzeCapabilities(specs: {
  cpuModel: string;
  cpuCores: number;
  totalMemoryGB: number;
  memoryUsagePercent: number;
  cpuSpeed: number;
}): SystemCapabilities {
  let score = 0;
  const recommendations: string[] = [];

  if (specs.cpuCores >= 8) score += 30;
  else if (specs.cpuCores >= 4) score += 20;
  else score += 10;

  if (specs.cpuSpeed >= 3000) score += 20;
  else if (specs.cpuSpeed >= 2000) score += 15;
  else score += 10;

  if (specs.totalMemoryGB >= 32) score += 30;
  else if (specs.totalMemoryGB >= 16) score += 20;
  else if (specs.totalMemoryGB >= 8) score += 10;

  if (specs.cpuCores >= 8 && specs.cpuSpeed >= 3000) {
    recommendations.push("Suitable for parallel processing tasks");
  }
  if (specs.totalMemoryGB >= 16) {
    recommendations.push("Good for memory-intensive workloads");
  }
  if (specs.memoryUsagePercent > 80) {
    recommendations.push("Consider freeing up memory for better performance");
  }

  let bestFor: "CPU" | "GPU" | "Balanced" = "Balanced";
  if (specs.cpuCores >= 8 && specs.cpuSpeed >= 3000) {
    bestFor = "CPU";
  }

  const cpuModelLower = specs.cpuModel.toLowerCase();
  if (
    cpuModelLower.includes("nvidia") ||
    cpuModelLower.includes("radeon") ||
    cpuModelLower.includes("gpu")
  ) {
    bestFor = "GPU";
    recommendations.push(
      "Integrated graphics detected - suitable for basic GPU tasks",
    );
  }

  return {
    score,
    bestFor,
    recommendations,
  };
}

function getCpuUsage(): number {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  });

  return Math.round((1 - totalIdle / totalTick) * 100);
}
