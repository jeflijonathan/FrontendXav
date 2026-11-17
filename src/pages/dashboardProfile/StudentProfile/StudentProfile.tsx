import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Avatar,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Tabs,
    Tab,
    Paper,
    InputAdornment,
    IconButton,
} from "@mui/material";
import {
    Person as PersonIcon,
    Home as HomeIcon,
    FamilyRestroom as FamilyIcon,
    Security as SecurityIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Visibility,
    VisibilityOff,
    Badge as BadgeIcon,
} from "@mui/icons-material";
import useStudentProfileForm from "./hooks/useStudentProfileForm";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`student-profile-tabpanel-${index}`}
            aria-labelledby={`student-profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const StudentProfile: React.FC = () => {
    const {
        form,
        studentProfileData,
        isLoading,
        isSaving,
        onSubmit,
        reloadProfile,
    } = useStudentProfileForm();

    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const [tabIndex, setTabIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const genderValue = watch("gender") || "L";

    if (isLoading && !studentProfileData) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "50vh",
                    gap: 2,
                }}
            >
                <CircularProgress size={48} />
                <Typography variant="body1" color="text.secondary">
                    Memuat data profil siswa...
                </Typography>
            </Box>
        );
    }

    const fullName = `${studentProfileData?.first_name || ""} ${studentProfileData?.last_name || ""}`.trim() || "Profil Siswa";
    const initialName = (studentProfileData?.first_name?.[0] || "S").toUpperCase();

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
            {/* Header Profil Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    background: "linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "center", sm: "center" },
                        gap: 3,
                        textAlign: { xs: "center", sm: "left" },
                    }}
                >
                    <Avatar
                        src={studentProfileData?.profile_url || undefined}
                        sx={{
                            width: 88,
                            height: 88,
                            bgcolor: "primary.main",
                            fontSize: "2rem",
                            fontWeight: "bold",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                        }}
                    >
                        {initialName}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                                {fullName}
                            </Typography>
                            <Chip
                                label={studentProfileData?.status !== false ? "Aktif" : "Non-Aktif"}
                                color={studentProfileData?.status !== false ? "success" : "default"}
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>NIS:</strong> {studentProfileData?.nis || "-"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>NISN:</strong> {studentProfileData?.nisn || "-"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Role:</strong> Siswa
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={reloadProfile}
                        disabled={isLoading || isSaving}
                        sx={{ alignSelf: { xs: "center", sm: "flex-start" } }}
                    >
                        Muat Ulang
                    </Button>
                </Box>
            </Paper>

            {/* Form Section */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
            >
                <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_, newTab) => setTabIndex(newTab)}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab icon={<PersonIcon />} iconPosition="start" label="Data Siswa & NIK" />
                        <Tab icon={<HomeIcon />} iconPosition="start" label="Alamat Domisili" />
                        <Tab icon={<FamilyIcon />} iconPosition="start" label="Data Orang Tua / Wali" />
                        <Tab icon={<SecurityIcon />} iconPosition="start" label="Keamanan Akun" />
                    </Tabs>
                </Box>

                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <form onSubmit={onSubmit}>
                        {/* Tab 1: Data Siswa & NIK */}
                        <TabPanel value={tabIndex} index={0}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Informasi Pribadi Siswa
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <TextField
                                        label="Nama Depan"
                                        fullWidth
                                        {...register("first_name")}
                                        error={Boolean(errors.first_name)}
                                        helperText={errors.first_name?.message}
                                        required
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Nama Belakang"
                                        fullWidth
                                        {...register("last_name")}
                                        error={Boolean(errors.last_name)}
                                        helperText={errors.last_name?.message}
                                    />
                                </div>

                                <div>
                                    <TextField
                                        label="NIK (Nomor Induk Kependudukan)"
                                        fullWidth
                                        required
                                        {...register("NIK")}
                                        error={Boolean(errors.NIK)}
                                        helperText={errors.NIK?.message || "Wajib 16 digit angka sesuai KTP / KK"}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BadgeIcon color="action" fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                </div>

                                <div>
                                    <FormControl fullWidth error={Boolean(errors.gender)}>
                                        <InputLabel id="gender-select-label">Jenis Kelamin</InputLabel>
                                        <Select
                                            labelId="gender-select-label"
                                            label="Jenis Kelamin"
                                            value={genderValue}
                                            onChange={(e) => setValue("gender", e.target.value as "L" | "P")}
                                        >
                                            <MenuItem value="L">Laki-laki</MenuItem>
                                            <MenuItem value="P">Perempuan</MenuItem>
                                        </Select>
                                        {errors.gender && (
                                            <FormHelperText>{errors.gender.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </div>

                                <div>
                                    <TextField
                                        label="Tempat Lahir"
                                        fullWidth
                                        {...register("birth_place")}
                                        error={Boolean(errors.birth_place)}
                                        helperText={errors.birth_place?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Tanggal Lahir"
                                        type="date"
                                        fullWidth
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        {...register("birth_date")}
                                        error={Boolean(errors.birth_date)}
                                        helperText={errors.birth_date?.message}
                                    />
                                </div>

                                <div>
                                    <TextField
                                        label="Nomor Telepon / WhatsApp"
                                        fullWidth
                                        placeholder="08xxxxxxxxxx"
                                        {...register("phone_number")}
                                        error={Boolean(errors.phone_number)}
                                        helperText={errors.phone_number?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Email Siswa"
                                        type="email"
                                        fullWidth
                                        {...register("email")}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email?.message}
                                    />
                                </div>
                            </div>
                        </TabPanel>

                        {/* Tab 2: Alamat Domisili */}
                        <TabPanel value={tabIndex} index={1}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Alamat Tempat Tinggal
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-3">
                                    <TextField
                                        label="Alamat Lengkap (Jalan, No. Rumah, Kelurahan, Kecamatan)"
                                        multiline
                                        rows={3}
                                        fullWidth
                                        {...register("address")}
                                        error={Boolean(errors.address)}
                                        helperText={errors.address?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="RT"
                                        fullWidth
                                        {...register("rt")}
                                        error={Boolean(errors.rt)}
                                        helperText={errors.rt?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="RW"
                                        fullWidth
                                        {...register("rw")}
                                        error={Boolean(errors.rw)}
                                        helperText={errors.rw?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Kode Pos"
                                        fullWidth
                                        {...register("zip_code")}
                                        error={Boolean(errors.zip_code)}
                                        helperText={errors.zip_code?.message}
                                    />
                                </div>
                            </div>
                        </TabPanel>

                        {/* Tab 3: Data Orang Tua / Wali */}
                        <TabPanel value={tabIndex} index={2}>
                            {/* Data Ayah / Wali */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}>
                                Data Ayah / Wali
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="md:col-span-2">
                                    <TextField
                                        label="Nama Ayah / Wali"
                                        fullWidth
                                        {...register("parent_name")}
                                        error={Boolean(errors.parent_name)}
                                        helperText={errors.parent_name?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="NIK Ayah / Wali"
                                        fullWidth
                                        {...register("parent_nik")}
                                        error={Boolean(errors.parent_nik)}
                                        helperText={errors.parent_nik?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Nomor Telepon Ayah"
                                        fullWidth
                                        {...register("parent_phone_number")}
                                        error={Boolean(errors.parent_phone_number)}
                                        helperText={errors.parent_phone_number?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Email Ayah"
                                        type="email"
                                        fullWidth
                                        {...register("parent_email")}
                                        error={Boolean(errors.parent_email)}
                                        helperText={errors.parent_email?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Pekerjaan Ayah"
                                        fullWidth
                                        {...register("parent_occupation")}
                                        error={Boolean(errors.parent_occupation)}
                                        helperText={errors.parent_occupation?.message}
                                    />
                                </div>
                            </div>

                            <Divider sx={{ my: 3 }} />

                            {/* Data Ibu */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "primary.main" }}>
                                Data Ibu
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <TextField
                                        label="Nama Ibu"
                                        fullWidth
                                        {...register("mother_name")}
                                        error={Boolean(errors.mother_name)}
                                        helperText={errors.mother_name?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="NIK Ibu"
                                        fullWidth
                                        {...register("mother_nik")}
                                        error={Boolean(errors.mother_nik)}
                                        helperText={errors.mother_nik?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Nomor Telepon Ibu"
                                        fullWidth
                                        {...register("mother_phone_number")}
                                        error={Boolean(errors.mother_phone_number)}
                                        helperText={errors.mother_phone_number?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Email Ibu"
                                        type="email"
                                        fullWidth
                                        {...register("mother_email")}
                                        error={Boolean(errors.mother_email)}
                                        helperText={errors.mother_email?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Pekerjaan Ibu"
                                        fullWidth
                                        {...register("mother_occupation")}
                                        error={Boolean(errors.mother_occupation)}
                                        helperText={errors.mother_occupation?.message}
                                    />
                                </div>
                            </div>
                        </TabPanel>

                        {/* Tab 4: Keamanan Akun */}
                        <TabPanel value={tabIndex} index={3}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Pengaturan Kata Sandi
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <TextField
                                        label="Kata Sandi Baru"
                                        type={showPassword ? "text" : "password"}
                                        fullWidth
                                        placeholder="Kosongkan jika tidak ingin mengubah sandi"
                                        {...register("new_password")}
                                        error={Boolean(errors.new_password)}
                                        helperText={errors.new_password?.message || "Minimal 6 karakter bila ingin diperbarui"}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </TabPanel>

                        <Divider sx={{ my: 3 }} />

                        {/* Actions */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={isSaving}
                                sx={{ minWidth: 160, py: 1 }}
                            >
                                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default StudentProfile;
