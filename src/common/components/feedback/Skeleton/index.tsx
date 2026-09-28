import MuiSkeleton from '@mui/material/Skeleton';
import type { ReactNode } from 'react';

type Props = {
    isLoading: boolean;
    variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
    width?: number | string;
    height?: number | string;
    animation?: 'wave' | 'pulse' | false;
    children: ReactNode;
}

const SkeletonLoader = ({
    isLoading,
    variant = 'rectangular',
    width,
    height,
    animation = 'wave',
    children
}: Props) => {
    if (isLoading) {
        return (
            <MuiSkeleton
                variant={variant}
                width={width}
                height={height}
                animation={animation}
            >
                {children}
            </MuiSkeleton>
        );
    }

    return <>{children}</>;
}

export default SkeletonLoader;