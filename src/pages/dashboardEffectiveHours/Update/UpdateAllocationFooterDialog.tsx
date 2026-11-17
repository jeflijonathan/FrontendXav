import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { DialogFooter } from "@components/Dialog";
import useDashboardEffectiveHoursStore from "../store";
import { useUpdateAllocation } from "./hook/useUpdateAllocation";

interface Props {
  id: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UpdateAllocationFooterDialog: React.FC<Props> = ({
  id,
  onClose,
  onSuccess,
}) => {
  const { state } = useDashboardEffectiveHoursStore();
  const { handleUpdate } = useUpdateAllocation();

  return (
    <DialogFooter>
      <Button
        variant="outlined"
        color="inherit"
        onClick={onClose}
        disabled={state.isUpdateLoading}
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Batal
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleUpdate(id, onSuccess)}
        disabled={state.isUpdateLoading}
        startIcon={state.isUpdateLoading ? <CircularProgress size={16} color="inherit" /> : null}
        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
      >
        {state.isUpdateLoading ? "Memperbarui..." : "Perbarui Alokasi"}
      </Button>
    </DialogFooter>
  );
};

export default UpdateAllocationFooterDialog;
