// Product Detail Page
document.addEventListener('DOMContentLoaded', () => {
    auth.requireAuth();

    const user = auth.getCurrentUser();
    
    // Vérifier si l'utilisateur est admin
    const isAdmin = user && user.role === 'admin';
    
    if (user) {
        document.getElementById('usernameDisplay').textContent = user.name;
    }

    // Masquer les boutons Modifier et Supprimer si l'utilisateur n'est pas admin
    if (!isAdmin) {
        const editBtn = document.getElementById('editBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        if (editBtn) editBtn.style.display = 'none';
        if (deleteBtn) deleteBtn.style.display = 'none';
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        auth.logout();
    });

    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    loadProductDetails(productId);

    // Ajouter les event listeners seulement si l'utilisateur est admin
    if (isAdmin) {
        const editBtn = document.getElementById('editBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                window.location.href = `products-form.html?id=${productId}`;
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
                    const products = JSON.parse(localStorage.getItem('products') || '[]');
                    const filtered = products.filter(p => p.id !== parseInt(productId));
                    localStorage.setItem('products', JSON.stringify(filtered));
                    alert('Produit supprimé avec succès!');
                    window.location.href = 'products.html';
                }
            });
        }
    }

    // Fonction pour exporter en PDF avec mise en page très simple
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const product = products.find(p => p.id === parseInt(productId));
            
            if (!product) return;

            // HTML très simple pour le PDF
            const simpleHTML = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="text-align: center; margin-bottom: 30px;">Détails Produit</h1>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold; width: 30%;">ID:</td>
                            <td style="padding: 8px;">${product.id}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Nom:</td>
                            <td style="padding: 8px;">${product.name}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Catégorie:</td>
                            <td style="padding: 8px;">${product.category}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Prix:</td>
                            <td style="padding: 8px;">${product.price} €</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Stock:</td>
                            <td style="padding: 8px;">${product.stock}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Description:</td>
                            <td style="padding: 8px;">${product.description || 'N/A'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px; font-weight: bold;">Statut:</td>
                            <td style="padding: 8px;">${product.active !== false ? 'Actif' : 'Inactif'}</td>
                        </tr>
                    </table>
                </div>
            `;

            const opt = {
                margin: 5,
                filename: `produit-${productId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            html2pdf().set(opt).from(simpleHTML).save();
        });
    }

    function loadProductDetails(id) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === parseInt(id));

        if (!product) {
            window.location.href = 'products.html';
            return;
        }

        const detailsContainer = document.getElementById('productDetails');
        detailsContainer.innerHTML = `
            <div class="detail-item">
                <label>ID</label>
                <p>${product.id}</p>
            </div>
            <div class="detail-item">
                <label>Nom</label>
                <p>${product.name}</p>
            </div>
            <div class="detail-item">
                <label>Catégorie</label>
                <p>${product.category}</p>
            </div>
            <div class="detail-item">
                <label>Prix</label>
                <p>${product.price} €</p>
            </div>
            <div class="detail-item">
                <label>Stock</label>
                <p>${product.stock}</p>
            </div>
            <div class="detail-item">
                <label>Description</label>
                <p>${product.description || 'N/A'}</p>
            </div>
            <div class="detail-item">
                <label>Statut</label>
                <p>${product.active !== false ? 'Actif' : 'Inactif'}</p>
            </div>
            <div class="detail-item">
                <label>Date de création</label>
                <p>${product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
        `;
    }

});

