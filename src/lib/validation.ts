// Format a Date object to YYYY-MM-DD string for Supabase
export function formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Parse a string as a positive integer, returns null if invalid
export function parsePositiveInt(value: string): number | null {
    const num = parseInt(value, 10);
    if (!Number.isFinite(num) || num < 0) return null;
    return num;
}

// Validate a year string (must be a 4-digit number between 1900 and next year)
export function parseYear(value: string): number | null {
    const num = parseInt(value, 10);
    if (!Number.isFinite(num)) return null;
    const nextYear = new Date().getFullYear() + 1;
    if (num < 1900 || num > nextYear) return null;
    return num;
}
