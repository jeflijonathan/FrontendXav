import { useForm } from "react-hook-form";
import {
  CreateAllocationDefaultValues,
  CreateAllocationValidationSchema,
  type CreateAllocationFormData,
} from "../utils/createAllocationForm";

export const useCreateAllocationForm = () => {
  return useForm<CreateAllocationFormData>({
    resolver: CreateAllocationValidationSchema,
    defaultValues: CreateAllocationDefaultValues,
    mode: "onChange",
  });
};

export default useCreateAllocationForm;

