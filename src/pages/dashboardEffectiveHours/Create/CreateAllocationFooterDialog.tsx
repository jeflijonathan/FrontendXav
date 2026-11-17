import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { DialogFooter } from "@components/Dialog";
import useDashboardEffectiveHoursStore from "../store";
import { useCreateAllocation } from "./hook/useCreateAllocation";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateAllocationFooterDialog: React.FC<Props> = ({ onClose, onSuccess }) => {
  const { state } = useDashboardEffectiveHoursStore();
  const { handleCreate } = useCreateAllocation();

  return (
    <DialogFooter>
      <Button
        variant="outlined"
        color="inherit"
        onClick={onClose}
        disabled={state.isCreateLoading}
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Batal
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleCreate(onSuccess)}
        disabled={state.isCreateLoading}
        startIcon={state.isCreateLoading ? <CircularProgress size={16} color="inherit" /> : null}
        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
      >
        {state.isCreateLoading ? "Menyimpan..." : "Simpan Alokasi"}
      </Button>
    </DialogFooter>
  );
};

export default CreateAllocationFooterDialog;
