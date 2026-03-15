
// MODULE CRUD - Gestion commune des données


class CRUDManager {
    // Constructeur : initialiser le gestionnaire CRUD
    constructor(entityName, fields, options = {}) {
        this.entityName = entityName;        // Nom du type de donnée (users, products...)
        this.fields = fields;                 // Liste des colonnes à afficher
        this.options = options;               // Options spéciales
        this.currentPage = 1;                 // Page actuelle
        this.itemsPerPage = 10;               // Nombre d'éléments par page
        this.sortField = null;                // Colonne à trier
        this.sortDirection = 'asc';           // Direction du tri (asc ou desc)
        this.filters = {};                    // Filtres appliqués
        this.searchTerm = '';                 // Texte de recherche
        this.data = [];                       // Les données
        this.init();
    }

    // Initialiser : charger les données et afficher
    init() {
        this.loadData();           // Charger depuis la mémoire
        this.setupEventListeners(); // Ajouter les écouteurs d'événements
        this.render();             // Afficher le tableau
    }

    // Charger les données depuis localStorage
    loadData() {
        const stored = localStorage.getItem(this.entityName);
        this.data = stored ? JSON.parse(stored) : [];
    }

    // Sauvegarder les données dans localStorage
    saveData() {
        localStorage.setItem(this.entityName, JSON.stringify(this.data));
    }

    // Ajouter les écouteurs d'événements
    setupEventListeners() {
        // Recherche
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                // Attendre 300ms avant de rechercher (pour éviter trop de recherches)
                debounceTimer = setTimeout(() => {
                    this.searchTerm = e.target.value.toLowerCase();
                    this.currentPage = 1; // Retour à la page 1
                    this.render();
                }, 300);
            });
        }

        // Changer le nombre d'éléments par page
        const itemsPerPageSelect = document.getElementById('itemsPerPage');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.render();
            });
        }

        // Boutons de pagination (précédent/suivant)
        document.querySelectorAll('.pagination-buttons button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'prev' && this.currentPage > 1) {
                    this.currentPage--;
                    this.render();
                } else if (action === 'next') {
                    const totalPages = Math.ceil(this.getFilteredData().length / this.itemsPerPage);
                    if (this.currentPage < totalPages) {
                        this.currentPage++;
                        this.render();
                    }
                }
            });
        });

        // En-têtes de colonnes (pour trier)
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.dataset.sort;
                // Si on clique sur la même colonne, inverser le tri
                if (this.sortField === field) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    // Sinon, trier par cette colonne
                    this.sortField = field;
                    this.sortDirection = 'asc';
                }
                this.render();
            });
        });
    }

    // Récupérer les données filtrées et triées
    getFilteredData() {
        let filtered = [...this.data]; // Copie des données

        // Filtre spécial pour les commandes des utilisateurs normaux
        if (this.entityName === 'orders' && this.options.currentUserId && !this.options.isAdmin) {
            filtered = filtered.filter(item => item.userId === this.options.currentUserId);
        }

        // Appliquer la recherche
        if (this.searchTerm) {
            filtered = filtered.filter(item => {
                return this.fields.some(field => {
                    const value = item[field.key]?.toString().toLowerCase() || '';
                    return value.includes(this.searchTerm);
                });
            });
        }

        // Appliquer les filtres
        Object.keys(this.filters).forEach(key => {
            if (this.filters[key]) {
                filtered = filtered.filter(item => {
                    const itemValue = item[key]?.toString().toLowerCase();
                    const filterValue = this.filters[key].toString().toLowerCase();
                    // Cas spécial pour les booléens (true/false)
                    if (this.filters[key] === 'true' || this.filters[key] === 'false') {
                        return item[key] === (this.filters[key] === 'true');
                    }
                    return itemValue === filterValue;
                });
            }
        });

        // Appliquer le tri
        if (this.sortField) {
            filtered.sort((a, b) => {
                const aVal = a[this.sortField] || '';
                const bVal = b[this.sortField] || '';
                const comparison = aVal.toString().localeCompare(bVal.toString());
                return this.sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        return filtered;
    }

    // Récupérer les données pour la page actuelle (avec pagination)
    getPaginatedData() {
        const filtered = this.getFilteredData();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return filtered.slice(start, end);
    }

    // Mettre à jour l'affichage (tableau + pagination)
    render() {
        this.renderTable();
        this.renderPagination();
    }

    // Afficher le tableau avec les données
    renderTable() {
        const tbody = document.querySelector('tbody');
        if (!tbody) return;

        const paginatedData = this.getPaginatedData();
        tbody.innerHTML = ''; // Vider le tableau

        // Si pas de données, afficher un message
        if (paginatedData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${this.fields.length + 1}" style="text-align: center; padding: 40px;">Aucune donnée disponible</td></tr>`;
            return;
        }

        // Ajouter chaque ligne de données
        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            
            // Ajouter les colonnes
            this.fields.forEach(field => {
                const cell = document.createElement('td');
                const rawValue = item[field.key];
                let value = '';

                // Si une fonction personnalisée est définie
                if (field.render) {
                    value = field.render(item);
                } else if (field.type === 'date' && rawValue) {
                    // Formater les dates
                    value = new Date(rawValue).toLocaleDateString();
                } else if (typeof rawValue === 'boolean') {
                    // Afficher explicitement 'true' ou 'false' pour les booléens
                    value = rawValue ? 'true' : 'false';
                } else if (rawValue !== undefined && rawValue !== null) {
                    value = rawValue;
                }

                cell.textContent = value;
                row.appendChild(cell);
            });

            // Ajouter la colonne Actions
            const actionsCell = document.createElement('td');
            const isAdmin = this.options.isAdmin !== false;
            let actionsHTML = `
                <button class="btn btn-secondary" onclick="crudManager.viewItem(${item.id})">
                    <i class="fas fa-eye"></i> ${i18n.t('view')}
                </button>`;
            
            // Afficher Modifier et Supprimer seulement pour les admins
            if (isAdmin) {
                actionsHTML += `
                <button class="btn btn-primary" onclick="crudManager.editItem(${item.id})">
                    <i class="fas fa-edit"></i> ${i18n.t('edit')}
                </button>
                <button class="btn btn-danger" onclick="crudManager.deleteItem(${item.id})">
                    <i class="fas fa-trash"></i> ${i18n.t('delete')}
                </button>`;
            }
            
            actionsCell.innerHTML = actionsHTML;
            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });

        // Mettre à jour les icônes de tri
        document.querySelectorAll('th[data-sort]').forEach(th => {
            const icon = th.querySelector('i');
            if (th.dataset.sort === this.sortField) {
                icon.className = this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
            } else {
                icon.className = 'fas fa-sort';
            }
        });
    }

    // Afficher les contrôles de pagination
    renderPagination() {
        const filtered = this.getFilteredData();
        const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, filtered.length);

        // Afficher le nombre de résultats
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Affichage de ${start} à ${end} sur ${filtered.length} résultats`;
        }

        // Activer/Désactiver les boutons précédent et suivant
        const prevBtn = document.querySelector('[data-action="prev"]');
        const nextBtn = document.querySelector('[data-action="next"]');
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;
    }

    // Voir les détails d'un élément
    viewItem(id) {
        window.location.href = `${this.entityName}-detail.html?id=${id}`;
    }

    // Éditer un élément
    editItem(id) {
        window.location.href = `${this.entityName}-form.html?id=${id}`;
    }

    // Supprimer un élément
    deleteItem(id) {
        // Demander confirmation
        if (confirm(i18n.t('confirm-delete'))) {
            // Supprimer l'élément de la liste
            this.data = this.data.filter(item => item.id !== id);
            // Sauvegarder
            this.saveData();
            // Rafraîchir l'affichage
            this.render();
            // Afficher un message de succès
            alert(i18n.t('delete-success'));
        }
    }

    // Exporter les données en CSV
    exportToCSV() {
        const filteredData = this.getFilteredData();
        
        if (filteredData.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }

        // Obtenir les en-têtes (clés du premier objet)
        const headers = this.fields.map(field => {
            if (typeof field === 'object') {
                return field.label || field.key;
            }
            return field;
        });

        // Créer les lignes CSV
        let csv = headers.join(',') + '\n';
        
        filteredData.forEach(item => {
            const row = this.fields.map(field => {
                let key = typeof field === 'object' ? field.key : field;
                let value = item[key] || '';
                
                // Échapper les guillemets et entourer de guillemets si contient virgule ou guillemet
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    value = '"' + value.replace(/"/g, '""') + '"';
                }
                
                return value;
            });
            csv += row.join(',') + '\n';
        });

        // Créer un blob et télécharger
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${this.entityName}-export-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
