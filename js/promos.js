
// PAGE PROMOS - Gestion des codes promo


document.addEventListener('DOMContentLoaded', () => {
    auth.requireAuth();

    const user = auth.getCurrentUser();
    if (user) {
        const userDisplay = document.getElementById('usernameDisplay');
        if (userDisplay) userDisplay.textContent = user.name;
    }

    // Bouton de déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.logout();
        });
    }


    const isAdmin = user && user.role === 'admin';

    // Seed exemples si vide
    const stored = localStorage.getItem('promocodes');
    if (!stored || JSON.parse(stored).length === 0) {
        const sample = [
            { id: 1, code: 'WELCOME10', discount: 10, active: true, expiry: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
            { id: 2, code: 'SUMMER20', discount: 20, active: true, expiry: new Date(Date.now() + 60*24*60*60*1000).toISOString() }
        ];
        localStorage.setItem('promocodes', JSON.stringify(sample));
    }

    // Fonction pour mettre à jour les compteurs
    function updateCounters() {
        const userEmail = user.email;
        const appliedDiscounts = JSON.parse(localStorage.getItem(`discounts_applied_${userEmail}`) || '[]');
        const activeCount = appliedDiscounts.length;
        const totalDiscount = appliedDiscounts.reduce((sum, d) => sum + d.discount, 0);

        const activeCountEl = document.getElementById('activePromoCount');
        const totalCountEl = document.getElementById('totalPromoCount');
        
        if (activeCountEl) activeCountEl.textContent = activeCount;
        if (totalCountEl) totalCountEl.textContent = totalDiscount + '%';
    }

    // Appeler la fonction au chargement
    updateCounters();

    if (isAdmin) {
        // Affichage normal pour les admins
        document.getElementById('statsContainer').style.display = 'none';
        
        window.crudManager = new CRUDManager('promocodes', [
            { key: 'id', label: 'ID' },
            { key: 'code', label: 'Code' },
            { key: 'discount', label: 'Remise' },
            { key: 'active', label: 'Actif' },
            { key: 'expiry', label: 'Expiration', type: 'date' }
        ], { isAdmin: isAdmin });
        crudManager.loadData();
        crudManager.render();
    } else {
        // Affichage du formulaire de vérification pour les utilisateurs non-admin
        document.getElementById('adminTableHeader').style.display = 'none';
        document.getElementById('promosTable').style.display = 'none';
        document.getElementById('promoPagination').style.display = 'none';
        document.getElementById('userVerificationForm').style.display = 'block';
        
        // Afficher les compteurs et le bouton réinitialiser pour user@app.com
        document.getElementById('statsContainer').style.display = 'flex';

        // Gestion du bouton de réinitialisation
        const resetBtn = document.getElementById('resetCounterBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir réinitialiser vos remises appliquées ?')) {
                    const userEmail = user.email;
                    localStorage.removeItem(`discounts_applied_${userEmail}`);
                    updateCounters();
                    alert('Vos remises appliquées ont été réinitialisées!');
                }
            });
        }

        // Gestion du formulaire de vérification
        const verifyForm = document.getElementById('verifyPromoForm');
        const resultDiv = document.getElementById('verificationResult');

        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('promoCodeInput').value.toUpperCase().trim();
            
            // Récupérer les codes promos
            const promos = JSON.parse(localStorage.getItem('promocodes') || '[]');
            const promo = promos.find(p => p.code.toUpperCase() === code);

            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '';

            // Vérifier si le code a déjà été utilisé
            const userEmail = user.email;
            const appliedDiscounts = JSON.parse(localStorage.getItem(`discounts_applied_${userEmail}`) || '[]');
            const alreadyUsed = appliedDiscounts.find(d => d.code.toUpperCase() === code);

            if (alreadyUsed) {
                resultDiv.className = 'alert alert-info';
                resultDiv.innerHTML = '<i class="fas fa-info-circle"></i> Ce code a déjà été utilisé';
            } else if (!promo) {
                resultDiv.className = 'alert alert-danger';
                resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> Code invalide ou inexistant';
            } else if (!promo.active) {
                resultDiv.className = 'alert alert-warning';
                resultDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Code désactivé';
            } else {
                // Vérifier l'expiration
                const expiryDate = new Date(promo.expiry);
                if (expiryDate < new Date()) {
                    resultDiv.className = 'alert alert-danger';
                    resultDiv.innerHTML = '<i class="fas fa-calendar-times"></i> Code expiré';
                } else {
                    resultDiv.className = 'alert alert-success';
                    resultDiv.innerHTML = `<i class="fas fa-check-circle"></i> <strong>Code valide!</strong> Remise: <strong>${promo.discount}%</strong>`;
                    
                    // Enregistrer la remise appliquée pour cet utilisateur
                    appliedDiscounts.push({
                        code: promo.code,
                        discount: promo.discount,
                        appliedAt: new Date().toISOString()
                    });
                    localStorage.setItem(`discounts_applied_${userEmail}`, JSON.stringify(appliedDiscounts));
                    updateCounters();
                }
            }

            // Vider le champ après 3 secondes
            setTimeout(() => {
                document.getElementById('promoCodeInput').value = '';
            }, 3000);
        });
    }
});
