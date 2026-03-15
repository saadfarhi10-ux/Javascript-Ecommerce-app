
// DÉTAIL PROMO


document.addEventListener('DOMContentLoaded', () => {
    auth.requireAuth();

    const user = auth.getCurrentUser();
    if (user) {
        const userDisplay = document.getElementById('usernameDisplay');
        if (userDisplay) userDisplay.textContent = user.name;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => auth.logout());
    }


    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) {
        alert('ID manquant');
        window.location.href = 'promocodes.html';
        return;
    }

    const promos = JSON.parse(localStorage.getItem('promocodes') || '[]');
    const p = promos.find(x => x.id === parseInt(id));
    if (!p) {
        alert('Code promo introuvable');
        window.location.href = 'promocodes.html';
        return;
    }

    document.getElementById('d_code').textContent = p.code;
    document.getElementById('d_discount').textContent = p.discount + ' %';
    document.getElementById('d_active').textContent = p.active ? 'Oui' : 'Non';
    document.getElementById('d_expiry').textContent = p.expiry ? new Date(p.expiry).toLocaleDateString() : '—';

    // Fonction pour exporter en PDF
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            const element = document.querySelector('.detail-container');
            const opt = {
                margin: 10,
                filename: `code-promo-${id}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            html2pdf().set(opt).from(element).save();
        });
    }
});