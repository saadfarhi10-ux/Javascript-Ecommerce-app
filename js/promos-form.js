
// FORMULAIRE PROMO - Ajout/Modification


document.addEventListener('DOMContentLoaded', () => {
    auth.requireAuth();

    const user = auth.getCurrentUser();
    if (!user || user.role !== 'admin') {
        alert('Accès refusé. Seuls les administrateurs peuvent gérer les codes promo.');
        window.location.href = 'promocodes.html';
        return;
    }

    if (user) {
        const userDisplay = document.getElementById('usernameDisplay');
        if (userDisplay) userDisplay.textContent = user.name;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => auth.logout());
    }


    const urlParams = new URLSearchParams(window.location.search);
    const promoId = urlParams.get('id');
    const isEdit = !!promoId;

    if (isEdit) {
        document.getElementById('formTitle').textContent = 'Modifier Code Promo';
        loadPromo(promoId);
    }

    function loadPromo(id) {
        const promos = JSON.parse(localStorage.getItem('promocodes') || '[]');
        const p = promos.find(x => x.id === parseInt(id));
        if (p) {
            document.getElementById('promoId').value = p.id;
            document.getElementById('code').value = p.code;
            document.getElementById('discount').value = p.discount;
            document.getElementById('expiry').value = p.expiry ? new Date(p.expiry).toISOString().slice(0,10) : '';
            document.getElementById('active').value = p.active ? 'true' : 'false';
        }
    }

    document.getElementById('promoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('code').value.trim();
        const discount = parseFloat(document.getElementById('discount').value);
        const expiry = document.getElementById('expiry').value ? new Date(document.getElementById('expiry').value).toISOString() : '';
        const active = document.getElementById('active').value === 'true';

        if (!code) { alert('Le code est requis'); return; }
        if (isNaN(discount) || discount < 0 || discount > 100) { alert('Remise invalide'); return; }

        const promos = JSON.parse(localStorage.getItem('promocodes') || '[]');

        if (isEdit) {
            const id = parseInt(promoId);
            const idx = promos.findIndex(x => x.id === id);
            if (idx !== -1) {
                promos[idx] = { ...promos[idx], code, discount, expiry, active };
            }
        } else {
            const newId = promos.length > 0 ? Math.max(...promos.map(p => p.id)) + 1 : 1;
            promos.push({ id: newId, code, discount, expiry, active });
        }

        localStorage.setItem('promocodes', JSON.stringify(promos));
        alert('Code promo enregistré.');
        window.location.href = 'promocodes.html';
    });
});