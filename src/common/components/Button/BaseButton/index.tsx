import React from 'react';
import { Button as MuiButton, type ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

export type ButtonColorVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'neutral';

export type ButtonVisualVariant = 'contained' | 'outlined' | 'text' | 'soft';

export interface BaseButtonProps extends Omit<MuiButtonProps, 'color' | 'variant'> {
    /** Color scheme for the button */
    colorScheme?: ButtonColorVariant;
    /** Custom hex or CSS color (e.g. '#4f46e5') */
    customColor?: string;
    /** Visual style variant */
    variant?: ButtonVisualVariant;
    /** Show loading spinner and disable button */
    isLoading?: boolean;
    /** Make button pill shaped */
    rounded?: boolean;
}

const colorMap: Record<ButtonColorVariant, { main: string; hover: string; softBg: string; softHover: string; contrastText: string }> = {
    primary: {
        main: '#4f46e5',
        hover: '#4338ca',
        softBg: '#eef2ff',
        softHover: '#e0e7ff',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#6b7280',
        hover: '#4b5563',
        softBg: '#f3f4f6',
        softHover: '#e5e7eb',
        contrastText: '#ffffff',
    },
    success: {
        main: '#10b981',
        hover: '#059669',
        softBg: '#ecfdf5',
        softHover: '#d1fae5',
        contrastText: '#ffffff',
    },
    danger: {
        main: '#ef4444',
        hover: '#dc2626',
        softBg: '#fef2f2',
        softHover: '#fee2e2',
        contrastText: '#ffffff',
    },
    warning: {
        main: '#f59e0b',
        hover: '#d97706',
        softBg: '#fffbeb',
        softHover: '#fef3c7',
        contrastText: '#ffffff',
    },
    info: {
        main: '#0284c7',
        hover: '#0369a1',
        softBg: '#f0f9ff',
        softHover: '#e0f2fe',
        contrastText: '#ffffff',
    },
    neutral: {
        main: '#374151',
        hover: '#1f2937',
        softBg: '#f9fafb',
        softHover: '#f3f4f6',
        contrastText: '#ffffff',
    },
};

const BaseButton: React.FC<BaseButtonProps> = ({
    children,
    colorScheme = 'primary',
    customColor,
    variant = 'contained',
    isLoading = false,
    rounded = false,
    disabled = false,
    startIcon,
    endIcon,
    sx,
    ...props
}) => {
    const palette = colorMap[colorScheme] || colorMap.primary;
    const baseColor = customColor || palette.main;

    let dynamicSx = {};

    if (variant === 'contained') {
        dynamicSx = {
            backgroundColor: baseColor,
            color: palette.contrastText,
            '&:hover': {
                backgroundColor: customColor ? baseColor : palette.hover,
                filter: customColor ? 'brightness(0.9)' : undefined,
            },
        };
    } else if (variant === 'outlined') {
        dynamicSx = {
            borderColor: baseColor,
            color: baseColor,
            '&:hover': {
                borderColor: customColor ? baseColor : palette.hover,
                backgroundColor: palette.softBg,
            },
        };
    } else if (variant === 'soft') {
        dynamicSx = {
            backgroundColor: palette.softBg,
            color: baseColor,
            '&:hover': {
                backgroundColor: palette.softHover,
            },
        };
    } else if (variant === 'text') {
        dynamicSx = {
            color: baseColor,
            '&:hover': {
                backgroundColor: palette.softBg,
            },
        };
    }

    return (
        <MuiButton
            disabled={disabled || isLoading}
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : startIcon}
            endIcon={endIcon}
            sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: rounded ? '9999px' : '8px',
                px: 2,
                py: 0.8,
                boxShadow: variant === 'contained' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                transition: 'all 0.15s ease-in-out',
                ...dynamicSx,
                ...sx,
            }}
            {...props}
        >
            {children}
        </MuiButton>
    );
};

export default BaseButton;
