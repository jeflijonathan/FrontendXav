import React from 'react';
import { Paper, Box, Typography, type SxProps, type Theme } from '@mui/material';

export interface BaseCardProps {
    children: React.ReactNode;
    /** Card title displayed in the header area */
    title?: string;
    /** Subtitle displayed below the title */
    subtitle?: string;
    /** Action element (button, icon, etc.) displayed on the right side of header */
    headerAction?: React.ReactNode;
    /** Extra content rendered inline next to title (e.g. badges, chips) */
    headerExtra?: React.ReactNode;
    /** Custom padding value. Ignored when noPadding is true */
    padding?: number | string;
    /** Remove all padding from the content area */
    noPadding?: boolean;
    /** Override styles for the root Paper element */
    sx?: SxProps<Theme>;
    /** Override styles for the header Box element */
    headerSx?: SxProps<Theme>;
    /** Override styles for the content Box element */
    contentSx?: SxProps<Theme>;
}

const BaseCard: React.FC<BaseCardProps> = ({
    children,
    title,
    subtitle,
    headerAction,
    headerExtra,
    padding,
    noPadding,
    sx,
    headerSx,
    contentSx,
}) => {
    const hasHeader = !!(title || headerAction || headerExtra);

    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
                ...sx,
            }}
        >
            {hasHeader && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2.5,
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        ...headerSx,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {title && (
                            <Typography variant="subtitle1" fontWeight={700}>
                                {title}
                            </Typography>
                        )}
                        {headerExtra}
                    </Box>
                    {headerAction}
                </Box>
            )}
            {subtitle && (
                <Box sx={{ px: 2.5, pt: hasHeader ? 0 : 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                </Box>
            )}
            <Box sx={{ p: noPadding ? 0 : (padding ?? 2.5), ...contentSx }}>
                {children}
            </Box>
        </Paper>
    );
};

export default BaseCard;
