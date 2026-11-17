import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export interface NumberStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  disabled = false,
  size = "medium",
  className = "",
}) => {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  const handleDecrease = () => {
    if (canDecrease) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrease = () => {
    if (canIncrease) {
      onChange(Math.min(max, value + step));
    }
  };

  const isSmall = size === "small";
  const isLarge = size === "large";

  return (
    <Box
      className={`inline-flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs transition-all ${className}`}
      sx={{
        p: isSmall ? 0.5 : isLarge ? 1.5 : 1,
        minWidth: isSmall ? 130 : isLarge ? 220 : 170,
      }}
    >
      <IconButton
        size={isSmall ? "small" : "medium"}
        onClick={handleDecrease}
        disabled={!canDecrease}
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.800" : "grey.100",
          borderRadius: 2,
          p: isSmall ? 0.75 : 1.25,
          color: canDecrease ? "primary.main" : "text.disabled",
          "&:hover": {
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "grey.700" : "grey.200",
          },
          "&.Mui-disabled": {
            opacity: 0.4,
          },
        }}
      >
        <RemoveIcon fontSize={isSmall ? "small" : "medium"} />
      </IconButton>

      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, px: 1.5 }}>
        <Typography
          component="span"
          sx={{
            fontSize: isSmall ? "1.25rem" : isLarge ? "2.25rem" : "1.75rem",
            fontWeight: 800,
            color: "text.primary",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </Typography>
        {unit && (
          <Typography
            component="span"
            sx={{
              fontSize: isSmall ? "0.75rem" : "0.875rem",
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            {unit}
          </Typography>
        )}
      </Box>

      <IconButton
        size={isSmall ? "small" : "medium"}
        onClick={handleIncrease}
        disabled={!canIncrease}
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.800" : "grey.100",
          borderRadius: 2,
          p: isSmall ? 0.75 : 1.25,
          color: canIncrease ? "primary.main" : "text.disabled",
          "&:hover": {
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "grey.700" : "grey.200",
          },
          "&.Mui-disabled": {
            opacity: 0.4,
          },
        }}
      >
        <AddIcon fontSize={isSmall ? "small" : "medium"} />
      </IconButton>
    </Box>
  );
};

export default NumberStepper;

