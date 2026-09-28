import { Box, Typography } from "@mui/material";

type Props = {
    isEmpty: boolean;
    message: String;
}

const EmptyState = ({ isEmpty, message }: Props) => {
    if (!isEmpty) return null;

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Typography color="text.secondary">{message}</Typography>
        </Box>
    )
}

export default EmptyState;