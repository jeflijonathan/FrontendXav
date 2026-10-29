import { Box, Grid } from '@mui/material';
import React from 'react';

interface AuthLayoutProps {
    brandContent: React.ReactNode;
    formContent: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ brandContent, formContent }) => {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#090d16' }}>
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
                    background: '#ffffff',
                    p: { xs: 3, sm: 6 }
                }}>
                    {formContent}
                </Grid>
            </Grid>
        </Box>
    );
};

export default AuthLayout;