
// PAGE DÉTAIL COMMANDE - Voir les infos


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


    // Récupérer l'ID de la commande depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (!orderId) {
        window.location.href = 'orders.html';
        return;
    }

    // Charger et afficher les détails
    loadOrderDetails(orderId);

    // Ajouter les écouteurs d'événements seulement pour les admins
    if (isAdmin) {
        const editBtn = document.getElementById('editBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        
        // Bouton Modifier
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                window.location.href = `orders-form.html?id=${orderId}`;
            });
        }

        // Bouton Supprimer
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) {
                    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                    const filtered = orders.filter(o => o.id !== parseInt(orderId));
                    localStorage.setItem('orders', JSON.stringify(filtered));
                    alert('Commande supprimée avec succès!');
                    window.location.href = 'orders.html';
                }
            });
        }
    }

    // Charger et afficher les détails d'une commande
    function loadOrderDetails(id) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.id === parseInt(id));

        if (!order) {
            window.location.href = 'orders.html';
            return;
        }

        // Récupérer l'utilisateur pour afficher son nom
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const orderUser = users.find(u => u.id === order.userId);

        // Afficher les informations
        const detailsContainer = document.getElementById('orderDetails');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="detail-item">
                    <label>ID Commande</label>
                    <p>${order.id}</p>
                </div>
                <div class="detail-item">
                    <label>Utilisateur</label>
                    <p>${orderUser ? orderUser.name : 'N/A'}</p>
                </div>
                <div class="detail-item">
                    <label>Total</label>
                    <p>${order.total} €</p>
                </div>
                <div class="detail-item">
                    <label>Remise</label>
                    <p>${order.discount || 0}%</p>
                </div>
                <div class="detail-item">
                    <label>Total Final</label>
                    <p>${order.finalTotal || order.total} €</p>
                </div>
                <div class="detail-item">
                    <label>Statut</label>
                    <p>${order.status || 'pending'}</p>
                </div>
                <div class="detail-item">
                    <label>Date</label>
                    <p>${order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</p>
                </div>
            `;
        }
    }

    // Fonction pour exporter en PDF avec mise en page très simple
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const order = orders.find(o => o.id === parseInt(orderId));
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const orderUser = users.find(u => u.id === order.userId);
            
            if (!order) return;

            // HTML très simple pour le PDF
            const simpleHTML = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="text-align: center; margin-bottom: 30px;">Détails Commande</h1>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold; width: 30%;">ID Commande:</td>
                            <td style="padding: 8px;">${order.id}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Utilisateur:</td>
                            <td style="padding: 8px;">${orderUser ? orderUser.name : 'N/A'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Total:</td>
                            <td style="padding: 8px;">${order.total} €</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Remise:</td>
                            <td style="padding: 8px;">${order.discount || 0}%</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Total Final:</td>
                            <td style="padding: 8px;">${order.finalTotal || order.total} €</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Statut:</td>
                            <td style="padding: 8px;">${order.status || 'pending'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Date:</td>
                            <td style="padding: 8px;">${order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    </table>
                </div>
            `;

            const opt = {
                margin: 5,
                filename: `commande-${orderId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            html2pdf().set(opt).from(simpleHTML).save();
        });
    }
});
