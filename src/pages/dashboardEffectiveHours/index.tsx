import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FunctionsIcon from "@mui/icons-material/Functions";
import { DashboardHeader } from "@components/Headers";

import AllocationKpiCards from "./components/AllocationKpiCards";
import FormulaReferenceCard from "./components/FormulaReferenceCard";
import AllocationFilterBar from "./components/AllocationFilterBar";
import AllocationTable from "./List/AllocationTable";
import CreateAllocationCardDialog from "./Create/CreateAllocationCardDialog";
import { useAllocationList } from "./List/hook/useAllocationList";
import useDashboardEffectiveHoursStore from "./store";

const DashboardEffectiveHours: React.FC = () => {
  const {
    summaryStats,
    schoolInfoList,
    selectedSchoolInfoId,
    handleSelectSchoolInfo,
    fetchAllocationList,
    fetchSubjectOptions,
    fetchSchoolInfo,
    fetchMajors,
    exportSKDocument,
  } = useAllocationList();
  const { state } = useDashboardEffectiveHoursStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  useEffect(() => {
    fetchSchoolInfo();
    fetchSubjectOptions();
    fetchMajors();
  }, [fetchSchoolInfo, fetchSubjectOptions, fetchMajors]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 6 }}>
      {/* 1. Dashboard Header */}
      <DashboardHeader
        title="Alokasi Jam Pelajaran & Minggu Efektif"
        description={`Kalkulasi otomatis beban mengajar berdasarkan regulasi standar (36 minggu pembagi nasional) dan kalender operasional riil sekolah tahun ajaran ${state.academicYear}.`}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          {/* Selector Periode / ID Informasi Sekolah */}
          {schoolInfoList.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 175 }}>
              <Select
                value={selectedSchoolInfoId}
                onChange={(e) => handleSelectSchoolInfo(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarMonthIcon fontSize="small" sx={{ color: "primary.main" }} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "grey.900" : "background.paper",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                {schoolInfoList.map((info: any) => (
                  <MenuItem
                    key={info.id_school_information}
                    value={info.id_school_information}
                    sx={{ fontSize: "0.82rem", fontWeight: info.status ? 700 : 500 }}
                  >
                    T.A. {info.periode} {info.status ? "(Aktif)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowFormula((prev) => !prev)}
            startIcon={<FunctionsIcon />}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              px: 2,
              py: 1,
            }}
          >
            {showFormula ? "Tutup Rujukan Formula" : "Rujukan Formula & Analisis"}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={exportSKDocument}
            startIcon={<FileDownloadOutlinedIcon />}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              px: 2,
              py: 1,
            }}
          >
            Ekspor SK & Dokumen
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsCreateOpen(true)}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              px: 2,
              py: 1,
              boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
            }}
          >
            Tambah Mata Pelajaran
          </Button>
        </Box>
      </DashboardHeader>

      {/* Rujukan Formula & Analisis Waktu (Collapsible) */}
      <Collapse in={showFormula} timeout="auto" unmountOnExit>
        <Box sx={{ mb: 1 }}>
          <FormulaReferenceCard />
        </Box>
      </Collapse>

      {/* 2. 4 KPI Summary Cards (Termasuk Durasi JP yang terhubung ke Info Sekolah & bisa diedit langsung) */}
      <AllocationKpiCards summary={summaryStats} />

      {/* 3. Filter Bar */}
      <AllocationFilterBar onRefresh={() => fetchAllocationList()} />

      {/* 4. Main Table (BaseTable Template) */}
      <AllocationTable />

      {/* 5. Create Modal Dialog */}
      <CreateAllocationCardDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          setIsCreateOpen(false);
          fetchAllocationList();
        }}
      />
    </Box>
  );
};

export default DashboardEffectiveHours;
