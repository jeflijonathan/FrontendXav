import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    IconButton,
    CircularProgress,
    Fade,
    Tabs,
    Tab,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import { ArrowBack, LockOutlined, PersonOutlined, BadgeOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@common/layouts/AuthLayout';
import { LoadingSpinner } from '@components/feedback';

const Login = () => {
    const [role, setRole] = useState<'student' | 'employee'>('student');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [openForgot, setOpenForgot] = useState(false);
    const [forgotId, setForgotId] = useState('');
    const [isSendingForgot, setIsSendingForgot] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState(false);

    const navigate = useNavigate();

    const handleRoleChange = (_event: React.SyntheticEvent, newRole: 'student' | 'employee') => {
        if (newRole) {
            setRole(newRole);
            setFormData({ identifier: '', password: '' });
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1200);
    };

    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSendingForgot(true);
        setTimeout(() => {
            setIsSendingForgot(false);
            setForgotSuccess(true);
        }, 1200);
    };

    const handleCloseForgot = () => {
        setOpenForgot(false);
        setForgotId('');
        setForgotSuccess(false);
    };

    const brandContent = (
        <>
            <IconButton
                onClick={() => navigate('/')}
                sx={{
                    position: 'absolute',
                    top: 28,
                    left: 28,
                    color: '#94a3b8',
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    '&:hover': { color: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.08)' }
                }}
            >
                <ArrowBack />
            </IconButton>

            <Box sx={{
                position: 'absolute', top: '10%', left: '10%',
                width: '350px', height: '350px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(40px)'
            }} />

            <Fade in={true} timeout={1000}>
                <Box sx={{ zIndex: 1, textAlign: 'center', maxWidth: 460 }}>
                    <Box sx={{
                        width: 64, height: 64, borderRadius: '16px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 4,
                        boxShadow: '0 12px 24px -8px rgba(37, 99, 235, 0.4)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>X</Typography>
                    </Box>

                    <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                        SMK Xaverius Portal
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
                        Secure institutional gateway. Manage your academic credentials, assignments, and administrative access from a unified workspace.
                    </Typography>
                </Box>
            </Fade>
        </>
    );

    const formContent = (
        <Fade in={true} timeout={1200}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3.5
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1, letterSpacing: '-0.01em' }}>
                        Sign In
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Please choose your account type to proceed
                    </Typography>
                </Box>

                <Tabs
                    value={role}
                    onChange={handleRoleChange}
                    variant="fullWidth"
                    sx={{
                        bgcolor: '#f1f5f9',
                        borderRadius: '10px',
                        p: '4px',
                        minHeight: '46px',
                        '& .MuiTabs-indicator': {
                            height: 'calc(100% - 8px)',
                            top: '4px',
                            borderRadius: '8px',
                            background: '#0f172a',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            borderRadius: '8px',
                            minHeight: '38px',
                            zIndex: 1,
                            color: '#64748b',
                            transition: 'color 0.2s ease-in-out',
                            '&.Mui-selected': {
                                color: '#ffffff',
                            }
                        }
                    }}
                >
                    <Tab label="Student" value="student" />
                    <Tab label="Employee" value="employee" />
                </Tabs>

                {/* Form Container with Smooth Swap Animation */}
                <Fade in={true} key={role} timeout={350}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <TextField
                            fullWidth
                            label={role === 'student' ? 'Student NIS' : 'Teacher NIY'}
                            variant="outlined"
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {role === 'student' ? (
                                                <PersonOutlined sx={{ color: '#94a3b8', fontSize: '20px' }} />
                                            ) : (
                                                <BadgeOutlined sx={{ color: '#94a3b8', fontSize: '20px' }} />
                                            )}
                                        </InputAdornment>
                                    ),
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    bgcolor: '#f8fafc',
                                    transition: 'all 0.2s',
                                    '& fieldset': { borderColor: '#e2e8f0' },
                                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                                    '&.Mui-focused fieldset': { borderColor: '#0f172a', borderWidth: '1px' }
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#0f172a' }
                            }}
                        />

                        <Box>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlined sx={{ color: '#94a3b8', fontSize: '20px' }} />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        bgcolor: '#f8fafc',
                                        transition: 'all 0.2s',
                                        '& fieldset': { borderColor: '#e2e8f0' },
                                        '&:hover fieldset': { borderColor: '#cbd5e1' },
                                        '&.Mui-focused fieldset': { borderColor: '#0f172a', borderWidth: '1px' }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#0f172a' }
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Typography
                                    variant="caption"
                                    onClick={() => setOpenForgot(true)}
                                    sx={{
                                        color: '#2563eb',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    Forgot password?
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{
                                mt: 1,
                                py: 1.4,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                bgcolor: '#0f172a',
                                color: '#ffffff',
                                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    bgcolor: '#1e293b',
                                    boxShadow: '0 6px 16px rgba(15, 23, 42, 0.25)',
                                    transform: 'translateY(-1px)',
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                }
                            }}
                        >
                            {isLoading ? (
                                <LoadingSpinner isLoading={isLoading} />
                            ) : (
                                `Sign In as ${role === 'student' ? 'Student' : 'Employee'}`
                            )}
                        </Button>
                    </form>
                </Fade>
            </Paper>
        </Fade>
    );

    return (
        <>
            <AuthLayout brandContent={brandContent} formContent={formContent} />
            <Dialog open={openForgot} onClose={handleCloseForgot} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: '#0f172a' }}>Reset Password</DialogTitle>
                <form onSubmit={handleForgotSubmit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '10px !important' }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Enter your registered NIS or NIY, and we will provide instructions to reset your password.
                        </Typography>

                        {forgotSuccess ? (
                            <Alert severity="success" sx={{ borderRadius: '8px' }}>
                                Reset instructions have been sent successfully!
                            </Alert>
                        ) : (
                            <TextField
                                fullWidth
                                label="NIS / NIY"
                                variant="outlined"
                                value={forgotId}
                                onChange={(e) => setForgotId(e.target.value)}
                                required
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlined sx={{ color: '#94a3b8', fontSize: '20px' }} />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        bgcolor: '#f8fafc',
                                    }
                                }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={handleCloseForgot} sx={{ color: '#64748b', textTransform: 'none' }}>
                            Cancel
                        </Button>
                        {!forgotSuccess && (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSendingForgot}
                                sx={{
                                    bgcolor: '#0f172a',
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: '#1e293b' }
                                }}
                            >
                                {isSendingForgot ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Send Reset Link'}
                            </Button>
                        )}
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default Login;