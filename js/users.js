
// PAGE UTILISATEURS - Gestion des utilisateurs


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
    window.crudManager = new CRUDManager('users', [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nom' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Rôle' }
    ], { isAdmin: isAdmin });

    // Filtre par rôle
    const roleFilter = document.getElementById('roleFilter');
    if (roleFilter) {
        roleFilter.addEventListener('change', (e) => {
            if (e.target.value) {
                crudManager.filters.role = e.target.value;
            } else {
                delete crudManager.filters.role;
            }
            crudManager.currentPage = 1;
            crudManager.render();
        });
    }

    // Ajouter des données de test si la liste est vide
    const stored = localStorage.getItem('users');
    if (!stored || JSON.parse(stored).length <= 2) {
        const sampleUsers = [
            { id: 1, email: 'admin@app.com', password: 'admin123', name: 'Admin User', role: 'admin', createdAt: new Date().toISOString() },
            { id: 2, email: 'user@app.com', password: 'user123', name: 'Regular User', role: 'user', createdAt: new Date().toISOString() },
            { id: 3, email: 'john@example.com', password: 'pass123', name: 'John Doe', role: 'user', createdAt: new Date().toISOString() },
            { id: 4, email: 'jane@example.com', password: 'pass123', name: 'Jane Smith', role: 'user', createdAt: new Date().toISOString() },
            { id: 5, email: 'manager@example.com', password: 'pass123', name: 'Manager User', role: 'admin', createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('users', JSON.stringify(sampleUsers));
        crudManager.loadData();
        crudManager.render();
    }
});

