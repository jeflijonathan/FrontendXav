import React from "react";
import { FormProvider } from "react-hook-form";
import { BaseDialog, DialogHeader } from "@components/Dialog";
import { useCreateAllocationForm } from "./hook/useCreateAllocationForm";
import CreateAllocationFormDialog from "./CreateAllocationFormDialog";
import CreateAllocationFooterDialog from "./CreateAllocationFooterDialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateAllocationCardDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const methods = useCreateAllocationForm();

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <DialogHeader
        title="Tambah Alokasi Jam Pelajaran"
        description="Tetapkan beban JP intrakurikuler dan kokurikuler (P5) per tahun."
        onClose={onClose}
      />
      <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()}>
          <CreateAllocationFormDialog />
          <CreateAllocationFooterDialog onClose={onClose} onSuccess={onSuccess} />
        </form>
      </FormProvider>
    </BaseDialog>
  );
};

export default CreateAllocationCardDialog;

