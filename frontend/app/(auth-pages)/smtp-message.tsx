import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";

export function SmtpMessage() {
  return (
    <div>
      <div className="flex flex-row gap-3">
        <InfoIcon size={16} className="mt-0.5" />
        <small className="text-sm text-secondary-foreground font-hanken">
          <strong> Note:</strong> This file will be used to deploy your
          application.{" "}
          <span className="italic">Only .tar files are accepted</span>
        </small>
      </div>
    </div>
  );
}
