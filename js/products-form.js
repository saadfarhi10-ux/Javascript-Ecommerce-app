// Product Form Logic
document.addEventListener('DOMContentLoaded', () => {
    auth.requireAuth();

    const user = auth.getCurrentUser();
    
    // Vérifier si l'utilisateur est admin
    if (!user || user.role !== 'admin') {
        alert('Accès refusé. Seuls les administrateurs peuvent gérer les produits.');
        window.location.href = 'products.html';
        return;
    }
    
    if (user) {
        document.getElementById('usernameDisplay').textContent = user.name;
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

    // Load categories
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const categorySelect = document.getElementById('category');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const isEdit = !!productId;

    if (isEdit) {
        document.getElementById('formTitle').textContent = 'Modifier Produit';
        loadProduct(productId);
    }

    // Real-time validation
    document.getElementById('name').addEventListener('blur', validateName);
    document.getElementById('price').addEventListener('blur', validatePrice);
    document.getElementById('stock').addEventListener('blur', validateStock);
    document.getElementById('category').addEventListener('change', validateCategory);

    function validateName() {
        const name = document.getElementById('name').value.trim();
        const error = document.getElementById('nameError');
        if (!name) {
            error.textContent = 'Le nom est requis';
            return false;
        }
        error.textContent = '';
        return true;
    }

    function validatePrice() {
        const price = parseFloat(document.getElementById('price').value);
        const error = document.getElementById('priceError');
        if (!price || price <= 0) {
            error.textContent = 'Le prix doit être supérieur à 0';
            return false;
        }
        error.textContent = '';
        return true;
    }

    function validateStock() {
        const stock = parseInt(document.getElementById('stock').value);
        const error = document.getElementById('stockError');
        if (stock < 0 || isNaN(stock)) {
            error.textContent = 'Le stock doit être un nombre positif';
            return false;
        }
        error.textContent = '';
        return true;
    }

    function validateCategory() {
        const category = document.getElementById('category').value;
        const error = document.getElementById('categoryError');
        if (!category) {
            error.textContent = 'La catégorie est requise';
            return false;
        }
        error.textContent = '';
        return true;
    }

    function loadProduct(id) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === parseInt(id));
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('category').value = product.category;
            document.getElementById('price').value = product.price;
            document.getElementById('stock').value = product.stock;
            document.getElementById('description').value = product.description || '';
            document.getElementById('active').checked = product.active !== false;
        }
    }

    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const isValid = validateName() && validatePrice() && validateStock() && validateCategory();
        if (!isValid) return;

        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const formData = {
            id: isEdit ? parseInt(productId) : (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1),
            name: document.getElementById('name').value.trim(),
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value),
            description: document.getElementById('description').value.trim(),
            active: document.getElementById('active').checked
        };

        if (isEdit) {
            const index = products.findIndex(p => p.id === parseInt(productId));
            if (index !== -1) {
                products[index] = { ...products[index], ...formData };
            }
        } else {
            formData.createdAt = new Date().toISOString();
            products.push(formData);
        }

        localStorage.setItem('products', JSON.stringify(products));
        alert('Produit enregistré avec succès!');
        window.location.href = 'products.html';
    });
});

