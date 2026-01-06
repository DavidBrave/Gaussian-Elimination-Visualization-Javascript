// Nama pakai huuruf A B C AA AB AC
// Name with aphabets A B C AA AB AC
function generateVarNames(count) {
    const vars = [];
    for (let i = 0; i < count; i++) {
    let s = '';
    let n = i;
    do {
        // Charcode 97 = a
        s = String.fromCharCode(97 + (n % 26)) + s;
        n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    vars.push(s);
    }
    return vars;
}

// Fortmatting angka karena javascript tidak pintar
// Javascript sucks, need help to format number as string, NaN or even just normal number
function formatNumberForDisplay(num) {
    if (!isFinite(num) || isNaN(num)) return String(num);
    if (Number.isInteger(num)) return String(num);
    return parseFloat(num.toFixed(6)).toString();
}

// GCD = FPB
function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) {
    const t = a % b; a = b; b = t;
    }
    return a;
}

// LCM = KPK
function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
}