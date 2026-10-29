import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { School, Business, ArrowForward } from '@mui/icons-material';

const Home = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            overflow: 'hidden'
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 4,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    SMK Xaverius
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        px: 3,
                        background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                        boxShadow: '0 4px 14px 0 rgba(99,102,241,0.39)'
                    }}
                >
                    Sign In
                </Button>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 10 }}>
                <Grid container sx={{ spacing: 6, alignItems: "center" }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h2" gutterBottom sx={{ lineHeight: 1.2, fontWeight: 800, }}>
                            Empowering <br />
                            <span style={{ color: '#60a5fa' }}>Education</span> & <br />
                            <span style={{ color: '#a78bfa' }}>Excellence</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#94a3b8', mb: 4, fontWeight: 400 }}>
                            Welcome to the unified portal for SMK Xaverius Palembang.
                            Seamlessly access your dashboard, schedules, and academic information.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/login')}
                            sx={{
                                borderRadius: '30px',
                                py: 1.5,
                                px: 4,
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                                boxShadow: '0 10px 20px -10px rgba(99,102,241,0.7)'
                            }}
                        >
                            Get Started
                        </Button>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Paper elevation={24} sx={{
                                p: 4,
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)',
                                transform: 'translateX(-20px)',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'translateX(0px)' }
                            }}>
                                <School sx={{ fontSize: 40, color: '#60a5fa', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>For Students</Typography>
                                <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                                    Access your classes, schedules, and learning materials all in one place.
                                </Typography>
                            </Paper>

                            {/* Card 2 */}
                            <Paper elevation={24} sx={{
                                p: 4,
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)',
                                transform: 'translateX(20px)',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'translateX(0px)' }
                            }}>
                                <Business sx={{ fontSize: 40, color: '#a78bfa', mb: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>For Employees</Typography>
                                <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                                    Manage your classes, assignments, and administrative tasks efficiently.
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
