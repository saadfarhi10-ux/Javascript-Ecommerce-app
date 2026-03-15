
// PAGE DÉTAIL UTILISATEUR - Voir les infos


document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que l'utilisateur est connecté
    auth.requireAuth();

    const user = auth.getCurrentUser();
    
    // Vérifier si c'est un administrateur
    const isAdmin = user && user.role === 'admin';
    
    // Afficher le nom de l'utilisateur
    if (user) {
        document.getElementById('usernameDisplay').textContent = user.name;
    }

    // Masquer les boutons Modifier et Supprimer pour les non-admins
    if (!isAdmin) {
        const editBtn = document.getElementById('editBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        if (editBtn) editBtn.style.display = 'none';
        if (deleteBtn) deleteBtn.style.display = 'none';
    }

    // Bouton de déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => {
        auth.logout();
    });


    // Récupérer l'ID de l'utilisateur depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        window.location.href = 'users.html';
        return;
    }

    // Charger et afficher les détails
    loadUserDetails(userId);

    // Ajouter les écouteurs d'événements seulement pour les admins
    if (isAdmin) {
        const editBtn = document.getElementById('editBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        
        // Bouton Modifier
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                window.location.href = `users-form.html?id=${userId}`;
            });
        }

        // Bouton Supprimer
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const filtered = users.filter(u => u.id !== parseInt(userId));
                    localStorage.setItem('users', JSON.stringify(filtered));
                    alert('Utilisateur supprimé avec succès!');
                    window.location.href = 'users.html';
                }
            });
        }
    }

    // Charger et afficher les détails d'un utilisateur
    function loadUserDetails(id) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === parseInt(id));

        if (!user) {
            window.location.href = 'users.html';
            return;
        }

        // Afficher les informations
        const detailsContainer = document.getElementById('userDetails');
        detailsContainer.innerHTML = `
            <div class="detail-item">
                <label>ID</label>
                <p>${user.id}</p>
            </div>
            <div class="detail-item">
                <label>Nom</label>
                <p>${user.name}</p>
            </div>
            <div class="detail-item">
                <label>Email</label>
                <p>${user.email}</p>
            </div>
            <div class="detail-item">
                <label>Rôle</label>
                <p>${user.role}</p>
            </div>
            <div class="detail-item">
                <label>Date de création</label>
                <p>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
        `;
    }

    // Fonction pour exporter en PDF avec mise en page très simple
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.id === parseInt(userId));
            
            if (!user) return;

            // HTML très simple pour le PDF
            const simpleHTML = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="text-align: center; margin-bottom: 30px;">Détails Utilisateur</h1>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold; width: 30%;">ID:</td>
                            <td style="padding: 8px;">${user.id}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Nom:</td>
                            <td style="padding: 8px;">${user.name}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Email:</td>
                            <td style="padding: 8px;">${user.email}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Rôle:</td>
                            <td style="padding: 8px;">${user.role}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Date de création:</td>
                            <td style="padding: 8px;">${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    </table>
                </div>
            `;

            const opt = {
                margin: 5,
                filename: `utilisateur-${userId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            html2pdf().set(opt).from(simpleHTML).save();
        });
    }
});

