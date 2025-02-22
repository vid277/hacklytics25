"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadPage from "@/app/create/file-upload";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CreatePage() {
  const [computeType, setComputeType] = useState<"cpu" | "gpu">("cpu");
  const [timeout, setTimeout] = useState<number>();
  const [outputDirectory, setOutputDirectory] = useState<string>("");

  return (
    <div className="flex flex-col gap-5 items-center h-[calc(100vh-14rem)]">
      <UploadPage />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-base font-hanken w-[25rem]">
            Compute Type
          </Label>
          <p className="text-sm font-hanken text-muted-foreground">
            Select the compute type for your job.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Select
            value={computeType}
            onValueChange={(value: "cpu" | "gpu") => setComputeType(value)}
          >
            <SelectTrigger className="w-[25rem]">
              <SelectValue placeholder="Select compute type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpu">CPU</SelectItem>
              <SelectItem value="gpu">GPU</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-base font-hanken w-[25rem]">Timeout</Label>
          <p className="text-sm font-hanken text-muted-foreground">
            Define a timeout for your job{" "}
            <span className="font-bold">(in hours)</span>.
          </p>
        </div>
        <Input
          type="number"
          placeholder="8"
          value={timeout}
          onChange={(e) => setTimeout(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-base font-hanken w-[25rem]">
            Output Directory
          </Label>
          <p className="text-sm font-hanken text-muted-foreground">
            Define the output directory for your log files.
          </p>
        </div>
        <Input
          type="text"
          placeholder="./output/"
          value={outputDirectory}
          onChange={(e) => setOutputDirectory(e.target.value)}
        />
      </div>
    </div>
  );
}
