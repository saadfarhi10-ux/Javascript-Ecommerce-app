
// PAGE PRODUITS - Gestion des produits


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
    window.crudManager = new CRUDManager('products', [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nom' },
        { key: 'category', label: 'Catégorie' },
        { key: 'price', label: 'Prix', render: (item) => `${item.price} €` },
        { key: 'stock', label: 'Stock' }
    ], { isAdmin: isAdmin });

    // Filtre par catégorie
    const categoryFilter = document.getElementById('categoryFilter');
    const activeFilter = document.getElementById('activeFilter');
    
    // Charger les catégories pour le filtre
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        categoryFilter.appendChild(option);
    });

    // Événement filtre catégorie
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            if (e.target.value) {
                crudManager.filters.category = e.target.value;
            } else {
                delete crudManager.filters.category;
            }
            crudManager.currentPage = 1;
            crudManager.render();
        });
    }

    // Événement filtre actif/inactif
    if (activeFilter) {
        activeFilter.addEventListener('change', (e) => {
            if (e.target.value) {
                crudManager.filters.active = e.target.value;
            } else {
                delete crudManager.filters.active;
            }
            crudManager.currentPage = 1;
            crudManager.render();
        });
    }

    // Ajouter des données de test si la liste est vide
    const stored = localStorage.getItem('products');
    if (!stored || JSON.parse(stored).length === 0) {
        const sampleProducts = [
            { id: 1, name: 'Laptop HP', category: 'Électronique', price: 899.99, stock: 15, active: true, description: 'Laptop haute performance', createdAt: new Date().toISOString() },
            { id: 2, name: 'Smartphone Samsung', category: 'Électronique', price: 599.99, stock: 30, active: true, description: 'Smartphone dernière génération', createdAt: new Date().toISOString() },
            { id: 3, name: 'T-shirt Blanc', category: 'Vêtements', price: 19.99, stock: 100, active: true, description: 'T-shirt en coton', createdAt: new Date().toISOString() },
            { id: 4, name: 'Chaussures Sport', category: 'Vêtements', price: 79.99, stock: 50, active: true, description: 'Chaussures de sport confortables', createdAt: new Date().toISOString() },
            { id: 5, name: 'Livre JavaScript', category: 'Livres', price: 29.99, stock: 25, active: true, description: 'Guide complet JavaScript', createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        crudManager.loadData();
        crudManager.render();
    }
});

