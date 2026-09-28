import { Box, Typography, useTheme } from '@mui/material';

export type Props = {
    title: string;
    description: string;
};

const DashboardHeader = ({ title, description }: Props) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                transition: 'color 0.3s ease',
            }}
        >
            <Box>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: theme.palette.text.primary,
                        mb: 0.5
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: '0.925rem',
                        fontWeight: 400
                    }}
                >
                    {description}
                </Typography>
            </Box>
        </Box>
    );
};

export default DashboardHeader;