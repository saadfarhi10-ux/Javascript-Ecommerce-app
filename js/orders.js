
// PAGE COMMANDES - Gestion des commandes


document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que l'utilisateur est connecté
    auth.requireAuth();

    // Récupérer l'utilisateur actuel
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        document.getElementById('usernameDisplay').textContent = currentUser.name;
    }

    // Vérifier si c'est un administrateur
    const isAdmin = currentUser && currentUser.role === 'admin';
    const currentUserId = currentUser ? (currentUser.userId || currentUser.id) : null;

    // Bouton de déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => {
        auth.logout();
    });


    // Initialiser le gestionnaire CRUD avec les colonnes à afficher
    window.crudManager = new CRUDManager('orders', [
        { key: 'id', label: 'ID' },
        // Afficher le nom de l'utilisateur au lieu de l'ID
        { key: 'userId', label: 'Utilisateur', render: (item) => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.id === item.userId);
            return user ? user.name : `User ${item.userId}`;
        }},
        { key: 'total', label: 'Total', render: (item) => `${item.total} €` },
        { key: 'discount', label: 'Remise', render: (item) => `${item.discount || 0}%` },
        { key: 'finalTotal', label: 'Total Final', render: (item) => `${item.finalTotal || item.total} €` },
        { key: 'status', label: 'Statut' },
        { key: 'date', label: 'Date', type: 'date' }
    ], { isAdmin: isAdmin, currentUserId: currentUserId });

    // Filtre par statut
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            if (e.target.value) {
                crudManager.filters.status = e.target.value;
            } else {
                delete crudManager.filters.status;
            }
            crudManager.currentPage = 1;
            crudManager.render();
        });
    }

    // Ajouter des données de test si la liste est vide
    const stored = localStorage.getItem('orders');
    if (!stored || JSON.parse(stored).length === 0) {
        const sampleOrders = [
            { id: 1, userId: 2, total: 899.99, discount: 0, finalTotal: 899.99, status: 'completed', date: new Date().toISOString(), items: [] },
            { id: 2, userId: 3, total: 599.99, discount: 0, finalTotal: 599.99, status: 'processing', date: new Date().toISOString(), items: [] },
            { id: 3, userId: 4, total: 99.98, discount: 0, finalTotal: 99.98, status: 'pending', date: new Date().toISOString(), items: [] },
            { id: 4, userId: 2, total: 79.99, discount: 0, finalTotal: 79.99, status: 'completed', date: new Date().toISOString(), items: [] },
            { id: 5, userId: 3, total: 29.99, discount: 0, finalTotal: 29.99, status: 'cancelled', date: new Date().toISOString(), items: [] }
        ];
        localStorage.setItem('orders', JSON.stringify(sampleOrders));
        crudManager.loadData();
        crudManager.render();
    }
});

