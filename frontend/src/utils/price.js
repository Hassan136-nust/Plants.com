export function parsePrice(value) {
    let p = 0;
    if (value === undefined || value === null) return 0;
    if (typeof value === 'number') {
        p = value;
    } else if (typeof value === 'string') {
        const s = value.replace(/[^0-9.]/g, '');
        p = parseFloat(s) || 0;
    } else {
        try {
            p = parseFloat(String(value)) || 0;
        } catch { p = 0 }
    }

    // Handle incorrect small fractions (e.g., 0.25 instead of 2500).
    // If value looks like a tiny fraction, assume it was scaled and bring it to rupees.
    if (p > 0 && p < 1) {
        p = p * 10000;
    }
    return p;
}

export function formatRupee(value) {
    return `Rs. ${parseFloat(value).toFixed(2)}`;
}
