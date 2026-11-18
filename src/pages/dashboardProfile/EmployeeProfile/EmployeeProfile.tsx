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
    InputAdornment,
    IconButton,
} from "@mui/material";
import {
    Person as PersonIcon,
    Home as HomeIcon,
    Security as SecurityIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import useEmployeeProfileForm from "./hooks/useEmployeeProfileForm";

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
            id={`employee-profile-tabpanel-${index}`}
            aria-labelledby={`employee-profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const EmployeeProfile: React.FC = () => {
    const {
        form,
        employeeProfileData,
        isLoading,
        isSaving,
        onSubmit,
        reloadProfile,
    } = useEmployeeProfileForm();

    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const [tabIndex, setTabIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const genderValue = watch("gender") || "L";

    if (isLoading && !employeeProfileData) {
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
                    Memuat data profil pegawai...
                </Typography>
            </Box>
        );
    }

    const fullName = `${employeeProfileData?.first_name || ""} ${employeeProfileData?.last_name || ""}`.trim() || "Profil Pegawai";
    const initialName = (employeeProfileData?.first_name?.[0] || "P").toUpperCase();
    const rolesList = employeeProfileData?.user?.roles?.map((r) => r.name).join(", ") || "Pegawai";

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
            {/* Header Profil Card */}
            <Card
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: (theme) => theme.palette.mode === "dark" ? "#141416" : "#ffffff",
                    backgroundImage: "none",
                    boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                            ? "0 4px 20px rgba(0,0,0,0.5)"
                            : "0 2px 8px rgba(0,0,0,0.04)",
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
                        src={employeeProfileData?.profile_url || undefined}
                        sx={{
                            width: 88,
                            height: 88,
                            bgcolor: "secondary.main",
                            fontSize: "2rem",
                            fontWeight: "bold",
                            boxShadow: (theme) =>
                                theme.palette.mode === "dark"
                                    ? "0 4px 14px rgba(0,0,0,0.4)"
                                    : "0 4px 14px rgba(0,0,0,0.1)",
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
                                label={employeeProfileData?.status !== false ? "Aktif" : "Non-Aktif"}
                                color={employeeProfileData?.status !== false ? "success" : "default"}
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>NIY:</strong> {employeeProfileData?.niy || "-"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Email:</strong> {employeeProfileData?.email || "-"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Peran:</strong> {rolesList}
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
            </Card>

            {/* Form Section */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                            ? "0 4px 20px rgba(0,0,0,0.5)"
                            : "0 2px 8px rgba(0,0,0,0.04)",
                }}
            >
                <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_, newTab) => setTabIndex(newTab)}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab icon={<PersonIcon />} iconPosition="start" label="Data Pegawai & Kontak" />
                        <Tab icon={<HomeIcon />} iconPosition="start" label="Alamat Domisili" />
                        <Tab icon={<SecurityIcon />} iconPosition="start" label="Keamanan Akun" />
                    </Tabs>
                </Box>

                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <form onSubmit={onSubmit}>
                        {/* Tab 1: Data Pegawai */}
                        <TabPanel value={tabIndex} index={0}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Informasi Profil & Kontak Pegawai
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
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        required
                                        {...register("email")}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email?.message}
                                    />
                                </div>
                                <div>
                                    <FormControl fullWidth error={Boolean(errors.gender)}>
                                        <InputLabel id="emp-gender-label">Jenis Kelamin</InputLabel>
                                        <Select
                                            labelId="emp-gender-label"
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
                                        label="Deskripsi / Catatan Tambahan"
                                        fullWidth
                                        {...register("description")}
                                        error={Boolean(errors.description)}
                                        helperText={errors.description?.message}
                                    />
                                </div>
                            </div>
                        </TabPanel>

                        {/* Tab 2: Domisili */}
                        <TabPanel value={tabIndex} index={1}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Alamat Tempat Tinggal
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-3">
                                    <TextField
                                        label="Alamat Lengkap"
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
                                        {...register("RT")}
                                        error={Boolean(errors.RT)}
                                        helperText={errors.RT?.message}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="RW"
                                        fullWidth
                                        {...register("RW")}
                                        error={Boolean(errors.RW)}
                                        helperText={errors.RW?.message}
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

                        {/* Tab 3: Keamanan */}
                        <TabPanel value={tabIndex} index={2}>
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

export default EmployeeProfile;