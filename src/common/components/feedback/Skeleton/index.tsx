import MuiSkeleton from '@mui/material/Skeleton';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

type Props = {
    isLoading: boolean;
    variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
    width?: number | string;
    height?: number | string;
    animation?: 'wave' | 'pulse' | false;
    children: ReactNode;
    sx?: SxProps<Theme>;
}

const SkeletonLoader = ({
    isLoading,
    variant = 'rectangular',
    width,
    height,
    animation = 'wave',
    children,
    sx
}: Props) => {
    if (isLoading) {
        return (
            <MuiSkeleton
                variant={variant}
                width={width}
                height={height}
                animation={animation}
                sx={[
                    (theme) => ({
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? theme.palette.grey[800]
                                : theme.palette.grey[300],
                    }),
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
            >
                {children}
            </MuiSkeleton>
        );
    }

    return <>{children}</>;
}

export default SkeletonLoader;