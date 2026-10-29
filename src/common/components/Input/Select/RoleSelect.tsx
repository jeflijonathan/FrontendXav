import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export interface RoleOption {
    id: string;
    name: string;
}

export interface RoleSelectProps {
    options: RoleOption[];
    value?: string[];
    onChange: (roleIds: string[]) => void;
    label?: string;
    placeholder?: string;
    error?: boolean;
    helperText?: string;
    requiredRoleName?: string;
    disabled?: boolean;
    size?: "small" | "medium";
    fullWidth?: boolean;
    formatRoleLabel?: (name: string) => string;
}

const defaultFormatRoleLabel = (name: string): string => {
    if (!name) return "";
    if (name === "siswa") return "Siswa";
    if (name === "pengurus_kelas") return "Pengurus Kelas";
    return name
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

export const RoleSelect: React.FC<RoleSelectProps> = ({
    options = [],
    value = [],
    onChange,
    label = "Roles",
    placeholder = "Pilih role...",
    error = false,
    helperText,
    requiredRoleName,
    disabled = false,
    size = "small",
    fullWidth = true,
    formatRoleLabel = defaultFormatRoleLabel,
}) => {
    const selectedOptions = options.filter((opt) => (value || []).includes(opt.id));

    const handleChange = (_: any, newValue: RoleOption[]) => {
        let newIds = newValue.map((opt) => opt.id);

        if (requiredRoleName) {
            const requiredRole = options.find((opt) => opt.name === requiredRoleName);
            if (requiredRole && !newIds.includes(requiredRole.id)) {
                newIds = [requiredRole.id, ...newIds];
            }
        }

        onChange(newIds);
    };

    return (
        <Autocomplete<RoleOption, true, false, false>
            multiple
            options={options}
            disabled={disabled}
            size={size}
            fullWidth={fullWidth}
            value={selectedOptions}
            getOptionLabel={(option) => formatRoleLabel(option.name)}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            onChange={handleChange}
            slotProps={{
                chip: {
                    size: "small",
                    color: "primary",
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    size={size}
                    placeholder={selectedOptions.length === 0 ? placeholder : ""}
                    error={error}
                    helperText={helperText}
                />
            )}
        />
    );
};

export default RoleSelect;

