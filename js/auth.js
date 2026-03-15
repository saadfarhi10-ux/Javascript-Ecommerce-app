
// MODULE D'AUTHENTIFICATION - Gestion de connexion


class Auth {
    // Constructeur : initialiser avec les utilisateurs par défaut
    constructor() {
        // Liste des utilisateurs de test
        this.users = [
            {   id: 1, 
                email: 'admin@app.com',
                password: 'admin123', 
                name: 'Admin User', 
                role: 'admin' 
            },
            {   id: 2, 
                email: 'user@app.com', 
                password: 'user123', 
                name: 'Regular User', 
                role: 'user' 
            }
        ];
        this.init();
    }

    // Charger les utilisateurs depuis la mémoire du navigateur
    init() {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        } else {
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    // Connexion : vérifier email et mot de passe
    login(email, password) {
        // Chercher l'utilisateur avec cet email et mot de passe
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Créer une session avec les infos de l'utilisateur
            const session = {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            // Sauvegarder la session
            localStorage.setItem('session', JSON.stringify(session));
            return { success: true, user: session };
        }
        
        return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    // Déconnexion : supprimer la session
    logout() {
        localStorage.removeItem('session');
        window.location.href = 'index.html';
    }

    // Récupérer l'utilisateur actuellement connecté
    getCurrentUser() {
        const session = localStorage.getItem('session');
        return session ? JSON.parse(session) : null;
    }

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    // Forcer la connexion : si pas connecté, rediriger au login
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }
}

// Créer une instance globale du module d'authentification
const auth = new Auth();

