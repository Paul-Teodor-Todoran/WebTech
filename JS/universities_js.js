const API_URL = "http://universities.hipolabs.com/search?country=Romania";
const DATA_URL = "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";
const statusElement = document.getElementById("status");
const tbody = document.getElementById("tbody");
const qInput = document.getElementById("q");
let all = [];

function setStatus(text) {
    statusElement.textContent = text;
}

function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
}

function render(data) {
    tbody.innerHTML = data.map(u => {
        const site = /^https?:\/\//i.test(u.web_pages?.[0] || "")
            ? `<a href="${escapeHTML(u.web_pages[0])}" target="_blank" rel="noopener noreferrer">${escapeHTML(u.web_pages[0])}</a>`
            : "";
        return `
        <tr>
            <td>${escapeHTML(u.name || "")}</td>
            <td>${escapeHTML(u.country || "")}</td>
            <td>${site}</td>
        </tr>`;
    }).join("");
}

async function loadUniversities() {
    setStatus("Se încarcă...");
    tbody.innerHTML = "";
    try {
        let res;
        try {
            const url = window.location.protocol === "https:" ? DATA_URL : API_URL;
            res = await fetch(url, { signal: AbortSignal.timeout(8000) });
            if (!res.ok) throw new Error("API indisponibil");
        } catch {
            res = await fetch(DATA_URL, { signal: AbortSignal.timeout(15000) });
        }
        if (!res.ok) throw new Error("Eroare HTTP");
        const data = await res.json();
        all = data.filter(u => u.country === "Romania");
        render(getFilteredUniversities());
        setStatus(`Încărcat (${all.length} rezultate).`);
    } catch {
        setStatus("Eroare la încărcare. Încearcă din nou.");
    }
}

function getFilteredUniversities() {
    const q = qInput.value.trim().toLowerCase();
    return q
        ? all.filter(u => (u.name || "").toLowerCase().includes(q))
        : all;
}

qInput.addEventListener("input", () => {
    const filtered = getFilteredUniversities();
    render(filtered);
    setStatus(`Filtrate: ${filtered.length} din ${all.length}.`);
});

loadUniversities();

function exportCSV(data) {
    if (!data.length) return alert("Nu există date de exportat.");
    const header = ["Nume", "Țara", "Site"];
    const rows = data.map(u => [
        u.name || "",
        u.country || "",
        (u.web_pages && u.web_pages[0]) || ""
    ]);
    const csvContent = [header, ...rows]
        .map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const blob = new Blob(["\uFEFF", csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "universitati.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.getElementById("export-csv").addEventListener("click", () => {
    exportCSV(getFilteredUniversities());
});
