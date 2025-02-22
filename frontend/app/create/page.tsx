"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadPage from "@/app/create/file-upload";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const PRICE_PER_HOUR = {
  cpu: 0.1,
  gpu: 0.75,
};

const STORAGE_PRICE_PER_GB = 0.1;
const BASE_PROCESSING_FEE = 1.0;

export default function CreatePage() {
  const [computeType, setComputeType] = useState<"cpu" | "gpu">("cpu");
  const [timeout, setTimeout] = useState<number>(8);
  const [outputDirectory, setOutputDirectory] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0); // in bytes
  const [computePrice, setComputePrice] = useState<number>(0);
  const [storagePrice, setStoragePrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const compute = PRICE_PER_HOUR[computeType] * (timeout || 0);
    const storageInGB = fileSize / (1024 * 1024 * 1024); // Convert bytes to GB
    const storage = STORAGE_PRICE_PER_GB * storageInGB;

    setComputePrice(compute);
    setStoragePrice(storage);
    setTotalPrice(compute + storage + BASE_PROCESSING_FEE);
  }, [computeType, timeout, fileSize]);

  return (
    <div className="flex flex-col gap-6 p-6 h-[calc(100vh-8rem)]">
      <div className="flex gap-20 items-start justify-center mt-20">
        <div className="flex flex-col gap-4">
          <div className="w-[30rem]">
            <UploadPage onFileSizeChange={setFileSize} />
          </div>
          <div className="flex justify-center">
            <Card className="p-6 w-[28rem]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-hanken">Compute Type</Label>
                  <p className="text-sm font-hanken text-muted-foreground">
                    Select the compute type for your job.
                  </p>
                  <Select
                    value={computeType}
                    onValueChange={(value: "cpu" | "gpu") =>
                      setComputeType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select compute type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpu">
                        CPU (${PRICE_PER_HOUR.cpu}/hour)
                      </SelectItem>
                      <SelectItem value="gpu">
                        GPU (${PRICE_PER_HOUR.gpu}/hour)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-hanken">Timeout</Label>
                  <p className="text-sm font-hanken text-muted-foreground">
                    Define a timeout for your job{" "}
                    <span className="font-bold">(in hours)</span>.
                  </p>
                  <Input
                    type="number"
                    placeholder="8"
                    value={timeout}
                    onChange={(e) => setTimeout(Number(e.target.value))}
                    min={1}
                    max={168}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-hanken">
                    Output Directory
                  </Label>
                  <p className="text-sm font-hanken text-muted-foreground">
                    Define the output directory for your log files.
                  </p>
                  <Input
                    type="text"
                    placeholder="./output/"
                    value={outputDirectory}
                    onChange={(e) => setOutputDirectory(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="w-[23rem]">
          <Card className="p-6 space-y-6">
            <h3 className="font-hanken text-xl font-semibold">
              Price Breakdown
            </h3>

            {/* Compute Cost */}
            <div className="space-y-2">
              <h4 className="font-hanken font-medium">Compute Cost</h4>
              <div className="space-y-1 text-sm pl-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">
                    {computeType.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="font-medium">
                    ${PRICE_PER_HOUR[computeType]}/hour
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{timeout} hours</span>
                </div>
                <div className="flex justify-between font-medium pt-1">
                  <span>Subtotal:</span>
                  <span>${computePrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Storage Cost */}
            {fileSize > 0 && (
              <div className="space-y-2">
                <h4 className="font-hanken font-medium">Storage Cost</h4>
                <div className="space-y-1 text-sm pl-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">
                      {(fileSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-medium">
                      ${STORAGE_PRICE_PER_GB}/GB
                    </span>
                  </div>
                  <div className="flex justify-between font-medium pt-1">
                    <span>Subtotal:</span>
                    <span>${storagePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Fee */}
            <div className="space-y-2">
              <h4 className="font-hanken font-medium">Processing Fee</h4>
              <div className="space-y-1 text-sm pl-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base fee:</span>
                  <span className="font-medium">
                    ${BASE_PROCESSING_FEE.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Cost:</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
