import { AiGenerationRequest, GeneratedAiVariant } from "@/types/domain";
import { apiRequest } from "./client";

export const aiApi = {
  generateVariants: (payload: AiGenerationRequest) =>
    apiRequest<GeneratedAiVariant[]>("POST", "/ai/generate", payload),
};
