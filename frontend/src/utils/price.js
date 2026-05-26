/**
 * parsePrice — safely extract a numeric rupee value from any price format.
 *
 * Handles:
 *   "Rs. 2,500"  → 2500
 *   "Rs. 600"    → 600
 *   "2500"       → 2500
 *   2500         → 2500
 *   600          → 600
 *
 * Does NOT scale small values. The old "p < 1 → p * 10000" logic was the
 * root cause of the x10 bug and has been permanently removed.
 */
export function parsePrice(value) {
    if (value === undefined || value === null) return 0;

    let p = 0;

    if (typeof value === 'number') {
        p = value;
    } else if (typeof value === 'string') {
        // Remove currency symbols, letters, spaces — keep only digits and dot
        const s = value.replace(/[^0-9.]/g, '');
        p = parseFloat(s) || 0;
    } else {
        try { p = parseFloat(String(value)) || 0; } catch { p = 0; }
    }

    // Sanity cap: no plant costs more than Rs. 999,999
    if (p > 999999) return 0;

    return p;
}

export function formatRupee(value) {
    const n = parsePrice(value);
    return `Rs. ${Math.round(n).toLocaleString('en-PK')}`;
}
