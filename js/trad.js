// Internationalization Module
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.translations = {
            fr: {
                'app-title': 'S&R Shop',
                'logout': 'Déconnexion',
                'dashboard': 'Tableau de bord',
                'users': 'Utilisateurs',
                'products': 'Produits',
                'orders': 'Commandes',
                'categories': 'Catégories',
                'promos': 'Codes Promo',
                'promo-code': 'Code Promo',
                'verify-code': 'Vérifier un code promo',
                'apply': 'Appliquer',
                'verify': 'Vérifier',
                'export-csv': 'Exporter en CSV',
                'export-pdf': 'Exporter en PDF',
                'total-users': 'Total Utilisateurs',
                'total-products': 'Total Produits',
                'total-orders': 'Total Commandes',
                'total-revenue': 'Revenus Totaux',
                'avg-rating': 'Note Moyenne',
                'active-products': 'Produits Actifs',
                'products-by-category': 'Produits par Catégorie',
                'orders-status': 'Statut des Commandes',
                'monthly-revenue': 'Revenus Mensuels',
                'users-growth': 'Croissance des Utilisateurs',
                'products-rating': 'Note des Produits',
                'day': 'Jour',
                'week': 'Semaine',
                'month': 'Mois',
                'year': 'Année',
                'all-categories': 'Toutes les catégories',
                'add': 'Ajouter',
                'edit': 'Modifier',
                'delete': 'Supprimer',
                'view': 'Voir',
                'back': 'Retour',
                'save': 'Enregistrer',
                'cancel': 'Annuler',
                'search': 'Rechercher',
                'name': 'Nom',
                'email': 'Email',
                'actions': 'Actions',
                'confirm-delete': 'Êtes-vous sûr de vouloir supprimer cet élément?',
                'delete-success': 'Élément supprimé avec succès',
                'save-success': 'Enregistré avec succès',
                'error': 'Erreur',
                'required-field': 'Ce champ est requis',
                'invalid-email': 'Email invalide'
            },
            ar: {
                'app-title': 'S&R Shop',
                'logout': 'تسجيل الخروج',
                'dashboard': 'لوحة التحكم',
                'users': 'المستخدمون',
                'products': 'المنتجات',
                'orders': 'الطلبات',
                'categories': 'الفئات',
                'promos': 'رموز ترويجية',
                'promo-code': 'رمز ترويجي',
                'verify-code': 'تحقق من الرمز الترويجي',
                'apply': 'تطبيق',
                'verify': 'تحقق',
                'export-csv': 'تصدير CSV',
                'export-pdf': 'تصدير PDF',
                'reviews': 'المراجعات',
                'total-users': 'إجمالي المستخدمين',
                'total-products': 'إجمالي المنتجات',
                'total-orders': 'إجمالي الطلبات',
                'total-revenue': 'إجمالي الإيرادات',
                'avg-rating': 'متوسط التقييم',
                'active-products': 'المنتجات النشطة',
                'products-by-category': 'المنتجات حسب الفئة',
                'orders-status': 'حالة الطلبات',
                'monthly-revenue': 'الإيرادات الشهرية',
                'users-growth': 'نمو المستخدمين',
                'products-rating': 'تقييم المنتجات',
                'day': 'يوم',
                'week': 'أسبوع',
                'month': 'شهر',
                'year': 'سنة',
                'all-categories': 'جميع الفئات',
                'add': 'إضافة',
                'edit': 'تعديل',
                'delete': 'حذف',
                'view': 'عرض',
                'back': 'رجوع',
                'save': 'حفظ',
                'cancel': 'إلغاء',
                'search': 'بحث',
                'name': 'الاسم',
                'email': 'البريد الإلكتروني',
                'actions': 'الإجراءات',
                'confirm-delete': 'هل أنت متأكد من حذف هذا العنصر؟',
                'delete-success': 'تم الحذف بنجاح',
                'save-success': 'تم الحفظ بنجاح',
                'error': 'خطأ',
                'required-field': 'هذا الحقل مطلوب',
                'invalid-email': 'بريد إلكتروني غير صالح'
            },
            en: {
                'app-title': 'S&R Shop',
                'logout': 'Logout',
                'dashboard': 'Dashboard',
                'users': 'Users',
                'products': 'Products',
                'orders': 'Orders',
                'categories': 'Categories',
                'promos': 'Promo Codes',
                'promo-code': 'Promo Code',
                'verify-code': 'Verify a promo code',
                'apply': 'Apply',
                'verify': 'Verify',
                'export-csv': 'Export CSV',
                'export-pdf': 'Export PDF',
                'reviews': 'Reviews',
                'total-users': 'Total Users',
                'total-products': 'Total Products',
                'total-orders': 'Total Orders',
                'total-revenue': 'Total Revenue',
                'avg-rating': 'Average Rating',
                'active-products': 'Active Products',
                'products-by-category': 'Products by Category',
                'orders-status': 'Orders Status',
                'monthly-revenue': 'Monthly Revenue',
                'users-growth': 'Users Growth',
                'products-rating': 'Products Rating',
                'day': 'Day',
                'week': 'Week',
                'month': 'Month',
                'year': 'Year',
                'all-categories': 'All Categories',
                'add': 'Add',
                'edit': 'Edit',
                'delete': 'Delete',
                'view': 'View',
                'back': 'Back',
                'save': 'Save',
                'cancel': 'Cancel',
                'search': 'Search',
                'name': 'Name',
                'email': 'Email',
                'actions': 'Actions',
                'confirm-delete': 'Are you sure you want to delete this item?',
                'delete-success': 'Item deleted successfully',
                'save-success': 'Saved successfully',
                'error': 'Error',
                'required-field': 'This field is required',
                'invalid-email': 'Invalid email'
            }
        };
        this.init();
    }

    init() {
        this.setLanguage(this.currentLang);
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = this.currentLang;
            langSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Set HTML direction for RTL
        const html = document.getElementById('htmlLang') || document.documentElement;
        if (lang === 'ar') {
            html.setAttribute('dir', 'rtl');
        } else {
            html.setAttribute('dir', 'ltr');
        }
        html.setAttribute('lang', lang);

        // Translate all elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[lang] && this.translations[lang][key]) {
                element.textContent = this.translations[lang][key];
            }
        });
    }

    t(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }
}

// Export for use in other modules
const i18n = new I18n();
