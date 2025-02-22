import * as z from "zod";

export const uploadFormSchema = z.object({
  image: z.any(),
  compute_type: z.string().min(1, "Please select a compute type"),
  timeout: z.number().min(1, "Timeout must be at least 1 second"),
});

export type UploadFormValues = z.infer<typeof uploadFormSchema>;
