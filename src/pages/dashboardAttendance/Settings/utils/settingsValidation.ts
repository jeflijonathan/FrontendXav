import type { AttendanceSettingsModel } from '@api/attendance/model';

export function validateAttendanceSettings(settings: AttendanceSettingsModel): string | null {
    if (settings.use_geolocation) {
        if (settings.max_radius_meters < 10 || settings.max_radius_meters > 50000) {
            return 'Radius maksimal lokasi harus antara 10 hingga 50.000 meter.';
        }
        if (
            (settings.school_latitude !== null && settings.school_latitude !== undefined && (settings.school_latitude < -90 || settings.school_latitude > 90)) ||
            (settings.school_longitude !== null && settings.school_longitude !== undefined && (settings.school_longitude < -180 || settings.school_longitude > 180))
        ) {
            return 'Koordinat Latitude/Longitude sekolah tidak valid.';
        }
    }
    return null;
}
