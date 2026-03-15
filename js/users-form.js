
// FORMULAIRE UTILISATEUR - Ajout/Modification


document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que l'utilisateur est connecté et qu'il est admin
    auth.requireAuth();

    const user = auth.getCurrentUser();
    
    // Seuls les admins peuvent gérer les utilisateurs
    if (!user || user.role !== 'admin') {
        alert('Accès refusé. Seuls les administrateurs peuvent gérer les utilisateurs.');
        window.location.href = 'users.html';
        return;
    }
    
    // Afficher le nom de l'utilisateur
    if (user) {
        document.getElementById('usernameDisplay').textContent = user.name;
    }

    // Bouton de déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => {
        auth.logout();
    });


    // Récupérer l'ID de l'utilisateur depuis l'URL (s'il existe)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const isEdit = !!userId; // Vrai si on édite, faux si on crée

    // Si c'est une modification, charger les données
    if (isEdit) {
        document.getElementById('formTitle').textContent = 'Modifier Utilisateur';
        loadUser(userId);
    }

    // Validation en temps réel quand l'utilisateur quitte le champ
    document.getElementById('name').addEventListener('blur', validateName);
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('blur', validatePassword);
    document.getElementById('role').addEventListener('change', validateRole);

    // Valider le nom
    function validateName() {
        const name = document.getElementById('name').value.trim();
        const error = document.getElementById('nameError');
        if (!name) {
            error.textContent = 'Le nom est requis';
            return false;
        }
        if (name.length < 2) {
            error.textContent = 'Le nom doit contenir au moins 2 caractères';
            return false;
        }
        error.textContent = '';
        return true;
    }

    // Valider l'email
    function validateEmail() {
        const email = document.getElementById('email').value.trim();
        const error = document.getElementById('emailError');
        if (!email) {
            error.textContent = 'L\'email est requis';
            return false;
        }
        // Vérifier le format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            error.textContent = 'Format d\'email invalide';
            return false;
        }
        // Vérifier que l'email ne existe pas déjà (sauf pour l'utilisateur actuel)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existing = users.find(u => u.email === email && u.id !== parseInt(userId));
        if (existing) {
            error.textContent = 'Cet email est déjà utilisé';
            return false;
        }
        error.textContent = '';
        return true;
    }

    // Valider le mot de passe
    function validatePassword() {
        const password = document.getElementById('password').value;
        const error = document.getElementById('passwordError');
        if (!password && !isEdit) { // Requis seulement pour la création
            error.textContent = 'Le mot de passe est requis';
            return false;
        }
        if (password && password.length < 6) {
            error.textContent = 'Le mot de passe doit contenir au moins 6 caractères';
            return false;
        }
        error.textContent = '';
        return true;
    }

    // Valider le rôle
    function validateRole() {
        const role = document.getElementById('role').value;
        const error = document.getElementById('roleError');
        if (!role) {
            error.textContent = 'Le rôle est requis';
            return false;
        }
        error.textContent = '';
        return true;
    }

    // Charger un utilisateur existant
    function loadUser(id) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === parseInt(id));
        if (user) {
            document.getElementById('userId').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('role').value = user.role;
            document.getElementById('password').required = false; // Pas obligatoire en modification
        }
    }

    // Soumettre le formulaire
    document.getElementById('userForm').addEventListener('submit', (e) => {
        e.preventDefault();

        // Valider tous les champs
        const isValid = validateName() && validateEmail() && validatePassword() && validateRole();
        if (!isValid) return;

        // Récupérer les utilisateurs
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Créer l'objet utilisateur
        const formData = {
            id: isEdit ? parseInt(userId) : (users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            role: document.getElementById('role').value
        };

        // Ajouter ou modifier
        if (isEdit) {
            const index = users.findIndex(u => u.id === parseInt(userId));
            if (index !== -1) {
                users[index] = { ...users[index], ...formData };
            }
        } else {
            formData.createdAt = new Date().toISOString();
            users.push(formData);
        }

        // Sauvegarder
        localStorage.setItem('users', JSON.stringify(users));
        alert('Utilisateur enregistré avec succès!');
        window.location.href = 'users.html';
    });
});

