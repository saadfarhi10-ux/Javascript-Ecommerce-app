// PAGE DE CONNEXION - Formulaire de login


// Attendre le chargement complet de la page
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer les éléments du formulaire
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Validation en temps réel (quand l'utilisateur quitte le champ)
    emailInput.addEventListener('blur', () => validateEmail());
    passwordInput.addEventListener('blur', () => validatePassword());

    // Fonction : valider l'email
    function validateEmail() {
        const email = emailInput.value.trim();
        
        // Vérifier si l'email est vide
        if (!email) {
            emailError.textContent = 'L\'email est requis';
            return false;
        }
        
        // Vérifier le format email (example@domain.com)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Format d\'email invalide';
            return false;
        }
        
        // Email valide, enlever le message d'erreur
        emailError.textContent = '';
        return true;
    }

    // Fonction : valider le mot de passe
    function validatePassword() {
        const password = passwordInput.value;
        
        // Vérifier si le mot de passe est vide
        if (!password) {
            passwordError.textContent = 'Le mot de passe est requis';
            return false;
        }
        
        // Vérifier la longueur minimum
        if (password.length < 6) {
            passwordError.textContent = 'Le mot de passe doit contenir au moins 6 caractères';
            return false;
        }
        
        // Mot de passe valide
        passwordError.textContent = '';
        return true;
    }

    // Gérer l'envoi du formulaire
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêcher le rechargement de la page
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Valider les deux champs
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        // Si une validation échoue, arrêter
        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        // Essayer la connexion
        const result = auth.login(email, password);
        
        if (result.success) {
            // Connexion réussie
            alert('Connexion réussie! Redirection...');
            window.location.href = 'dashboard.html';
        } else {
            // Erreur de connexion
            emailError.textContent = result.message;
            passwordInput.value = ''; // Effacer le mot de passe
        }
    });
});

