import { Box, Grid } from '@mui/material';
import React from 'react';
import ThemeToggle from '@components/Theme/ThemeToggle';

interface AuthLayoutProps {
    brandContent: React.ReactNode;
    formContent: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ brandContent, formContent }) => {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: (theme) => theme.palette.mode === 'dark' ? '#09090b' : '#090d16' }}>
            <Grid container sx={{ width: '100%' }}>
                <Grid size={{ xs: 12, md: 6 }} sx={{
                    background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    p: 6,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {brandContent}
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#09090b' : '#ffffff',
                    color: (theme) => theme.palette.mode === 'dark' ? '#fafafa' : '#09090b',
                    p: { xs: 3, sm: 6 },
                    position: 'relative',
                }}>
                    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                        <ThemeToggle />
                    </Box>
                    {formContent}
                </Grid>
            </Grid>
        </Box>
    );
};

export default AuthLayout;