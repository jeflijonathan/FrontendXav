import React from 'react';
import { Box, TextField, MenuItem, Select, InputAdornment, type SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useAnnouncementFilter from './hooks/useAnnouncementFilter';
import Icon from '@common/components/Icon';
import useDashboardAnnouncementStore from '../store';

const FilterAnnouncement: React.FC = () => {
    const { searchChange, filterChange, filters } = useAnnouncementFilter();
    const { state } = useDashboardAnnouncementStore();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        searchChange(event.target.value);
    };

    const handleFilterChange = (key: string, event: SelectChangeEvent<string>) => {
        filterChange(key, event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
                placeholder="Cari pengumuman..."
                variant="outlined"
                size="small"
                value={state.search.value || ''}
                onChange={handleSearchChange}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ minWidth: 250, flexGrow: 1 }}
            />

            {filters.map((filter) => (
                <Select
                    key={filter.key}
                    value={state.filters[filter.key] || filter.options[0].value}
                    onChange={(e) => handleFilterChange(filter.key, e)}
                    size="small"
                    sx={{ minWidth: 150 }}
                    displayEmpty
                >
                    {filter.options.map((option) => (
                        <MenuItem key={`${filter.key}-${option.value}`} value={option.value as string} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon nameIcon={option.icon} />
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            ))}
        </Box>
    );
};

export default FilterAnnouncement;
