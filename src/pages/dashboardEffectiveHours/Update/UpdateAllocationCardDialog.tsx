import React from "react";
import { FormProvider } from "react-hook-form";
import { BaseDialog, DialogHeader } from "@components/Dialog";
import { useUpdateAllocationForm } from "./hook/useUpdateAllocationForm";
import UpdateAllocationFormDialog from "./UpdateAllocationFormDialog";
import UpdateAllocationFooterDialog from "./UpdateAllocationFooterDialog";

interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UpdateAllocationCardDialog: React.FC<Props> = ({
  id,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const methods = useUpdateAllocationForm();

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <DialogHeader
        title="Ubah Alokasi Jam Pelajaran"
        description="Sesuaikan JP Intrakurikuler dan Kokurikuler (P5) per tahun."
        onClose={onClose}
      />
      <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()}>
          <UpdateAllocationFormDialog />
          <UpdateAllocationFooterDialog
            id={id}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
};

export default UpdateAllocationCardDialog;

