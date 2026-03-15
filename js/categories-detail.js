
// PAGE DÉTAIL CATÉGORIE - Voir les infos


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


    // Récupérer l'ID de la catégorie depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');

    if (!categoryId) {
        window.location.href = 'categories.html';
        return;
    }

    // Charger et afficher les détails
    loadCategoryDetails(categoryId);

    // Ajouter les écouteurs d'événements seulement pour les admins
    if (isAdmin) {
        const editBtn = document.getElementById('editBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        
        // Bouton Modifier
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                window.location.href = `categories-form.html?id=${categoryId}`;
            });
        }

        // Bouton Supprimer
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) {
                    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
                    const filtered = categories.filter(c => c.id !== parseInt(categoryId));
                    localStorage.setItem('categories', JSON.stringify(filtered));
                    alert('Catégorie supprimée avec succès!');
                    window.location.href = 'categories.html';
                }
            });
        }
    }

    // Charger et afficher les détails d'une catégorie
    function loadCategoryDetails(id) {
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const category = categories.find(c => c.id === parseInt(id));

        if (!category) {
            window.location.href = 'categories.html';
            return;
        }

        // Afficher les informations
        const detailsContainer = document.getElementById('categoryDetails');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="detail-item">
                    <label>ID</label>
                    <p>${category.id}</p>
                </div>
                <div class="detail-item">
                    <label>Nom</label>
                    <p>${category.name}</p>
                </div>
                <div class="detail-item">
                    <label>Description</label>
                    <p>${category.description || 'N/A'}</p>
                </div>
            `;
        }
    }

    // Fonction pour exporter en PDF avec mise en page très simple
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            const categories = JSON.parse(localStorage.getItem('categories') || '[]');
            const category = categories.find(c => c.id === parseInt(categoryId));
            
            if (!category) return;

            // HTML très simple pour le PDF
            const simpleHTML = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="text-align: center; margin-bottom: 30px;">Détails Catégorie</h1>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold; width: 30%;">ID:</td>
                            <td style="padding: 8px;">${category.id}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Nom:</td>
                            <td style="padding: 8px;">${category.name}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Description:</td>
                            <td style="padding: 8px;">${category.description || 'N/A'}</td>
                        </tr>
                    </table>
                </div>
            `;

            const opt = {
                margin: 5,
                filename: `categorie-${categoryId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            html2pdf().set(opt).from(simpleHTML).save();
        });
    }
});
