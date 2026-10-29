import React, { useState } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { BaseDialog, DialogHeader, DialogBody, DialogFooter } from '@components/Dialog';
import { useRosterJamStore } from '../store';

const AddSlotDialog: React.FC = () => {
    const { state, closeAddDialog, addSlot } = useRosterJamStore();
    const [jp, setJp] = useState<string>('1');
    const [jamMulai, setJamMulai] = useState<string>('08:00');
    const [jamSelesai, setJamSelesai] = useState<string>('08:45');
    const [jenisJam, setJenisJam] = useState<string>('KBM');
    const [isEffective, setIsEffective] = useState<boolean>(true);

    const handleSave = () => {
        if (!state.selectedDayForAdd) return;

        addSlot(state.selectedDayForAdd, {
            jp: jp.trim() === '' ? '-' : jp,
            jam: `${jamMulai} - ${jamSelesai}`,
            jenisJam,
            isEffective,
        });

        // Reset
        setJp('1');
        setJamMulai('08:00');
        setJamSelesai('08:45');
        setJenisJam('KBM');
        setIsEffective(true);
        closeAddDialog();
    };

    const handleJenisChange = (value: string) => {
        setJenisJam(value);
        if (value === 'KBM') {
            setIsEffective(true);
        } else {
            setIsEffective(false);
            if (jp !== '-') setJp('-');
        }
    };

    return (
        <BaseDialog isOpen={state.isAddDialogOpen} onClose={closeAddDialog}>
            <DialogHeader
                title={`Tambah Slot Jadwal — ${state.selectedDayForAdd || ''}`}
                onClose={closeAddDialog}
            />
            <DialogBody>
                <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label="Jam Mulai"
                                placeholder="08:00"
                                value={jamMulai}
                                onChange={(e) => setJamMulai(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label="Jam Selesai"
                                placeholder="08:45"
                                value={jamSelesai}
                                onChange={(e) => setJamSelesai(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                    </Grid>

                    <FormControl fullWidth size="small">
                        <InputLabel id="jenis-jam-dialog-label">Jenis Jam</InputLabel>
                        <Select
                            labelId="jenis-jam-dialog-label"
                            value={jenisJam}
                            label="Jenis Jam"
                            onChange={(e) => handleJenisChange(e.target.value)}
                        >
                            <MenuItem value="Upacara">Upacara / Apel Pagi</MenuItem>
                            <MenuItem value="KBM">KBM (Kegiatan Belajar Mengajar)</MenuItem>
                            <MenuItem value="Istirahat">Istirahat</MenuItem>
                            <MenuItem value="Ekstra">Ekstrakurikuler / Kegiatan Mandiri</MenuItem>
                            {state.jenisJamList
                                .filter(
                                    (j) =>
                                        !['upacara', 'kbm', 'istirahat', 'ekstra'].includes(
                                            j.name.toLowerCase()
                                        )
                                )
                                .map((j) => (
                                    <MenuItem key={j.id_category_schendule_time} value={j.name}>
                                        {j.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Nomor JP (Jam Pelajaran)"
                        placeholder="Contoh: 1, 2, atau - untuk non-KBM"
                        value={jp}
                        onChange={(e) => setJp(e.target.value)}
                        fullWidth
                        size="small"
                        helperText="Isi '-' jika bukan jam pelajaran efektif"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isEffective}
                                onChange={(e) => setIsEffective(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Hitung sebagai JP Efektif"
                    />
                </Box>
            </DialogBody>
            <DialogFooter
                onCancel={closeAddDialog}
                onSubmit={handleSave}
                submitText="Tambah Slot"
            />
        </BaseDialog>
    );
};

export default AddSlotDialog;
