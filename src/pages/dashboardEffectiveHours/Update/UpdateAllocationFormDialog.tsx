import React from "react";
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  Paper,
  Chip,
  Autocomplete,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import useDashboardEffectiveHoursStore from "../store";
import { DialogBody } from "@components/Dialog";
import {
  calculateIntraWeekly,
  calculateKokuWeekly,
  calculateTotalWeekly,
  calculateRealProjected,
} from "../utils/allocationBusinessLogic";

const KELAS_OPTIONS = [
  { value: "X", label: "Kelas X (Fase E)" },
  { value: "XI", label: "Kelas XI (Fase F)" },
  { value: "XII", label: "Kelas XII (Fase F)" },
];

export const UpdateAllocationFormDialog: React.FC = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const { state } = useDashboardEffectiveHoursStore();

  const intraValue = Number(watch("Alokasi_Intrakurikuler") || 0);
  const kokuValue = Number(watch("Alokasi_Kokurikuler") || 0);

  const intraWeekly = calculateIntraWeekly(intraValue);
  const kokuWeekly = calculateKokuWeekly(kokuValue);
  const totalWeekly = calculateTotalWeekly(intraWeekly, kokuWeekly);
  const realProjected = calculateRealProjected(totalWeekly, state.effectiveWeeks);

  return (
    <DialogBody>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
        {/* 1. Mata Pelajaran */}
        <Controller
          name="id_subject"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Mata Pelajaran"
              fullWidth
              size="small"
              error={!!errors.id_subject}
              helperText={errors.id_subject?.message as string}
            >
              {state.subjectsList.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                    <span>{s.name} ({s.code || "Fase " + s.fase})</span>
                    {s.majorName && (
                      <Chip
                        label={s.majorName}
                        size="small"
                        variant="outlined"
                        color="warning"
                        sx={{ fontSize: "0.68rem", height: 20, fontWeight: 700, ml: "auto" }}
                      />
                    )}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Jurusan / Major (Bisa Pilih > 1 atau kosongkan untuk Semua Jurusan) */}
        <Controller
          name="id_majors"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={state.majorsList}
              getOptionLabel={(option) => option.name}
              value={state.majorsList.filter((m) =>
                (field.value || []).includes(m.id_major || m.id || "")
              )}
              isOptionEqualToValue={(option, val) =>
                (option.id_major || option.id) === (val.id_major || val.id)
              }
              onChange={(_, newValues) => {
                const ids = newValues.map((v) => v.id_major || v.id || "");
                field.onChange(ids);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Jurusan / Major (Wajib Pilih Minimal 1)"
                  placeholder={
                    (field.value || []).length === 0
                      ? "Pilih minimal 1 jurusan..."
                      : ""
                  }
                  size="small"
                  error={!!errors.id_majors}
                  helperText={
                    (errors.id_majors?.message as string) ||
                    "Pilih minimal 1 jurusan yang menerapkan alokasi kurikulum ini"
                  }
                />
              )}
            />
          )}
        />

        {/* 2. Kelas (X, XI, XII) */}
        <Controller
          name="kelas"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Kelas"
              fullWidth
              size="small"
              error={!!errors.kelas}
              helperText={errors.kelas?.message as string}
            >
              {KELAS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* 3. JP Intra & Koku Per Tahun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="Alokasi_Intrakurikuler"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="JP Intrakurikuler / Tahun"
                fullWidth
                size="small"
                error={!!errors.Alokasi_Intrakurikuler}
                helperText={
                  (errors.Alokasi_Intrakurikuler?.message as string) ||
                  "Jam tatap muka teori & praktik"
                }
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />

          <Controller
            name="Alokasi_Kokurikuler"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="JP Kokurikuler (P5) / Tahun"
                fullWidth
                size="small"
                error={!!errors.Alokasi_Kokurikuler}
                helperText={
                  (errors.Alokasi_Kokurikuler?.message as string) ||
                  "Projek Penguatan Pelajar Pancasila"
                }
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </div>

        {/* 4. Live Auto-Computed Preview Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "grey.900" : "#f0fdf4",
            border: 1,
            borderColor: (theme) =>
              theme.palette.mode === "dark" ? "grey.800" : "#bbf7d0",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "success.main",
              display: "block",
              mb: 1.5,
              textTransform: "uppercase",
              fontSize: "0.72rem",
            }}
          >
            Kalkulasi Beban Mengajar Otomatis (Live Preview)
          </Typography>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <Box sx={{ p: 1, bgcolor: "background.paper", borderRadius: 1.5, border: 1, borderColor: "divider" }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.68rem" }}>
                Intra / Mgg
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "primary.main" }}>
                {intraWeekly.toFixed(1).replace(".", ",")} JP
              </Typography>
            </Box>

            <Box sx={{ p: 1, bgcolor: "background.paper", borderRadius: 1.5, border: 1, borderColor: "divider" }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.68rem" }}>
                Koku / Mgg
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "secondary.main" }}>
                {kokuWeekly.toFixed(1).replace(".", ",")} JP
              </Typography>
            </Box>

            <Box sx={{ p: 1, bgcolor: "background.paper", borderRadius: 1.5, border: 1, borderColor: "divider" }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.68rem" }}>
                Total / Mgg
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 900, color: "text.primary" }}>
                {totalWeekly.toFixed(1).replace(".", ",")} JP
              </Typography>
            </Box>

            <Box sx={{ p: 1, bgcolor: "background.paper", borderRadius: 1.5, border: 1, borderColor: "divider" }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.68rem" }}>
                Proyeksi Riil ({state.effectiveWeeks} Mgg)
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 900, color: "primary.dark" }}>
                {realProjected} JP
              </Typography>
            </Box>
          </div>
        </Paper>
      </Box>
    </DialogBody>
  );
};

export default UpdateAllocationFormDialog;
