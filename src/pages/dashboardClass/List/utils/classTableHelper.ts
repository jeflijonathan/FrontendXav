/**
 * classTableHelper — Business Logic Utilities for ClassTable
 *
 * Pure functions for data resolution, formatting, and display transformation.
 * No React imports. No API calls. Fully testable outside React context.
 *
 * Layer: Business Logic
 */

import type { ClassResponseModel } from "@api/class/model";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MajorLike {
    id_major: string;
    name: string;
}

export interface EmployeeLike {
    id: string;
    first_name: string;
    last_name?: string | null;
    niy?: string | null;
}

export interface SchoolInfoLike {
    id_school_information: string;
    periode?: string | null;
    status?: boolean;
}

export interface ResolvedClassRow {
    major: MajorLike | null;
    guardian: EmployeeLike | null;
    period: SchoolInfoLike | null;
}

export interface StatusChipConfig {
    label: string;
    color: "success" | "error";
}

// ─── Resolvers ────────────────────────────────────────────────────────────────

/**
 * Resolve the major for a class row.
 * Prefers store list lookup; falls back to embedded row.major.
 */
export function resolveClassMajor(
    row: ClassResponseModel,
    majors: MajorLike[]
): MajorLike | null {
    return majors.find((m) => m.id_major === row.id_major) ?? row.major ?? null;
}

/**
 * Resolve the guardian (wali kelas) for a class row.
 * Prefers store employees lookup; falls back to embedded row.class_guardian.
 */
export function resolveClassGuardian(
    row: ClassResponseModel,
    employees: EmployeeLike[]
): EmployeeLike | null {
    return employees.find((e) => e.id === row.id_class_guardian) ?? row.class_guardian ?? null;
}

/**
 * Resolve the school period for a class row.
 * Prefers store schoolInformations lookup; falls back to embedded row.school_information.
 */
export function resolveClassPeriod(
    row: ClassResponseModel,
    schoolInformations: SchoolInfoLike[]
): SchoolInfoLike | null {
    return (
        schoolInformations.find((s) => s.id_school_information === row.id_school_information) ??
        row.school_information ??
        null
    );
}

/**
 * Resolve all related entities for a class row in one call.
 */
export function resolveClassRow(
    row: ClassResponseModel,
    majors: MajorLike[],
    employees: EmployeeLike[],
    schoolInformations: SchoolInfoLike[]
): ResolvedClassRow {
    return {
        major: resolveClassMajor(row, majors),
        guardian: resolveClassGuardian(row, employees),
        period: resolveClassPeriod(row, schoolInformations),
    };
}

// ─── Formatters ───────────────────────────────────────────────────────────────

/**
 * Format a date string to locale date string (Indonesian locale).
 * Returns "-" if date is empty or invalid.
 */
export function formatClassDate(dateStr?: string | null): string {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("id-ID");
}

/**
 * Format a datetime string to locale datetime string (Indonesian locale).
 * Returns "-" if date is empty or invalid.
 */
export function formatClassDateTime(dateStr?: string | null): string {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID");
}

// ─── Status ───────────────────────────────────────────────────────────────────

/**
 * Resolve the Chip config (label + color) for a class status.
 * Uses statusData map (from useClassList) with fallback to boolean status.
 */
export function resolveStatusChip(
    status: boolean | number | null | undefined,
    statusData: Record<number, { label: string; color: "success" | "error" }>
): StatusChipConfig {
    const numericStatus = Number(status);
    if (statusData[numericStatus]) return statusData[numericStatus];
    return status
        ? { label: "Aktif", color: "success" }
        : { label: "Non Aktif", color: "error" };
}

// ─── Guardian Display ─────────────────────────────────────────────────────────

/**
 * Format full name of a guardian/employee.
 */
export function formatGuardianFullName(guardian: EmployeeLike | null): string {
    if (!guardian) return "Belum ditentukan";
    return `${guardian.first_name} ${guardian.last_name || ""}`.trim();
}

/**
 * Check if an employee is already assigned as guardian in current period.
 * Returns the assigned class name, or null if not assigned.
 */
export function findGuardianAssignedClass(
    employeeId: string,
    classes: ClassResponseModel[],
    periodId?: string,
    excludeClassId?: string
): string | null {
    const assigned = classes.find(
        (c) =>
            c.id_class_guardian === employeeId &&
            c.id_class !== excludeClassId &&
            (!periodId || c.id_school_information === periodId)
    );
    return assigned ? (assigned.name || `Kelas ${assigned.kelas}`) : null;
}

