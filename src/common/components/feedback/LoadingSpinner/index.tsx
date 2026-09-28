import { Box, CircularProgress, Typography } from "@mui/material";

type Props = {
    isLoading: boolean
    size?: string;
}

const LoadingSpinner = ({ isLoading, size = "md" }: Props) => {
    if (!isLoading) return null;
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <CircularProgress size={size === "md" ? 24 : 12} />
            <Typography color="text.secondary">Loading...</Typography>
        </Box>
    );
};

export default LoadingSpinner;