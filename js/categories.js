
// PAGE CATÉGORIES - Gestion des catégories


document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que l'utilisateur est connecté
    auth.requireAuth();

    // Afficher le nom de l'utilisateur connecté
    const user = auth.getCurrentUser();
    if (user) {
        document.getElementById('usernameDisplay').textContent = user.name;
    }

    // Vérifier si c'est un administrateur
    const isAdmin = user && user.role === 'admin';

    // Masquer le bouton "Ajouter" pour les non-admins
    const addButton = document.querySelector('.table-actions .btn-success');
    if (addButton && !isAdmin) {
        addButton.style.display = 'none';
    }

    // Bouton de déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => {
        auth.logout();
    });


    // Initialiser le gestionnaire CRUD avec les colonnes à afficher
    window.crudManager = new CRUDManager('categories', [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nom' },
        { key: 'description', label: 'Description' }
    ], { isAdmin: isAdmin });

    // Ajouter des données de test si la liste est vide
    const stored = localStorage.getItem('categories');
    if (!stored || JSON.parse(stored).length === 0) {
        const sampleCategories = [
            { id: 1, name: 'Électronique', description: 'Appareils électroniques et gadgets' },
            { id: 2, name: 'Vêtements', description: 'Vêtements et accessoires' },
            { id: 3, name: 'Livres', description: 'Livres et publications' },
            { id: 4, name: 'Maison & Jardin', description: 'Articles pour la maison et le jardin' },
            { id: 5, name: 'Sports', description: 'Équipements sportifs' }
        ];
        localStorage.setItem('categories', JSON.stringify(sampleCategories));
        crudManager.loadData();
        crudManager.render();
    }
});

