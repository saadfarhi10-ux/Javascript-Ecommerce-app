// Dashboard Module
class Dashboard {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        // Check authentication
        auth.requireAuth();

        // Display username
        const user = auth.getCurrentUser();
        if (user) {
            document.getElementById('usernameDisplay').textContent = user.name;
        }

        // Setup logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            auth.logout();
        });

        // Setup sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('active');
            });
        }

        // Setup filters
        document.getElementById('periodFilter').addEventListener('change', () => this.updateCharts());
        document.getElementById('categoryFilter').addEventListener('change', () => this.updateCharts());

        // Load data and render
        this.loadData();
        this.renderKPIs();
        this.renderCharts();
    }

    loadData() {
        // Load data from localStorage
        this.users = JSON.parse(localStorage.getItem('users') || '[]');
        this.products = JSON.parse(localStorage.getItem('products') || '[]');
        this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
        this.categories = JSON.parse(localStorage.getItem('categories') || '[]');
        this.reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    }

    renderKPIs() {
        const activeProducts = this.products.filter(p => p.active !== false).length;
        const totalRevenue = this.orders.reduce((sum, order) => sum + (order.total || 0), 0);

        document.getElementById('kpiUsers').textContent = this.users.length;
        document.getElementById('kpiProducts').textContent = this.products.length;
        document.getElementById('kpiOrders').textContent = this.orders.length;
        document.getElementById('kpiRevenue').textContent = `${totalRevenue.toFixed(2)} €`;
        document.getElementById('kpiActiveProducts').textContent = activeProducts;
    }

    renderCharts() {
        this.renderPieChart();
        this.renderDonutChart();
        this.renderBarChart();
        this.renderLineChart();
        this.renderAreaChart();
    }

    renderPieChart() {
        const ctx = document.getElementById('pieChart').getContext('2d');
        const categoryCounts = {};
        
        this.products.forEach(product => {
            const category = product.category || 'Uncategorized';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        if (this.charts.pie) {
            this.charts.pie.destroy();
        }

        this.charts.pie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categoryCounts),
                datasets: [{
                    data: Object.values(categoryCounts),
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 10, padding: 12, font: {size: 12} }
                    },
                    tooltip: { padding: 8 }
                },
                layout: { padding: { top: 6, bottom: 6, left: 6, right: 6 } }
            }
        });
    }

    renderDonutChart() {
        const ctx = document.getElementById('donutChart').getContext('2d');
        const statusCounts = {};
        
        this.orders.forEach(order => {
            const status = order.status || 'pending';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        if (this.charts.donut) {
            this.charts.donut.destroy();
        }

        this.charts.donut = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: { position: 'bottom', labels: { font: {size: 12} } },
                    tooltip: { padding: 8 }
                },
                layout: { padding: 8 }
            }
        });
    }

    renderBarChart() {
        const ctx = document.getElementById('barChart').getContext('2d');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyRevenue = new Array(12).fill(0);
        
        this.orders.forEach(order => {
            if (order.date) {
                const month = new Date(order.date).getMonth();
                monthlyRevenue[month] += (order.total || 0);
            }
        });

        if (this.charts.bar) {
            this.charts.bar.destroy();
        }

        this.charts.bar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Revenue',
                    data: monthlyRevenue,
                    backgroundColor: '#4f46e5',
                    borderRadius: 6,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { padding: 8 } },
                layout: { padding: { top: 6, bottom: 6 } },
                scales: {
                    x: { grid: { display: false }, ticks: { maxRotation: 0, font: {size: 11} } },
                    y: { beginAtZero: true, ticks: { font: {size: 11} } }
                }
            }
        });
    }

    renderLineChart() {
        const ctx = document.getElementById('lineChart').getContext('2d');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const userGrowth = [];
        
        months.forEach((_, index) => {
            const count = this.users.filter(user => {
                if (!user.createdAt) return index === 0;
                const userMonth = new Date(user.createdAt).getMonth();
                return userMonth <= index;
            }).length;
            userGrowth.push(count);
        });

        if (this.charts.line) {
            this.charts.line.destroy();
        }

        this.charts.line = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Users',
                    data: userGrowth,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { padding: 8 } },
                layout: { padding: 6 },
                scales: {
                    x: { grid: { display: false }, ticks: { font: {size: 11} } },
                    y: { beginAtZero: true, ticks: { font: {size: 11} } }
                }
            }
        });
    }

    renderAreaChart() {
        const ctx = document.getElementById('areaChart').getContext('2d');
        const ratingRanges = ['1-2', '2-3', '3-4', '4-5'];
        const ratingCounts = [0, 0, 0, 0];
        
        this.reviews.forEach(review => {
            const rating = review.rating || 0;
            if (rating >= 1 && rating < 2) ratingCounts[0]++;
            else if (rating >= 2 && rating < 3) ratingCounts[1]++;
            else if (rating >= 3 && rating < 4) ratingCounts[2]++;
            else if (rating >= 4 && rating <= 5) ratingCounts[3]++;
        });

        if (this.charts.area) {
            this.charts.area.destroy();
        }

        this.charts.area = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ratingRanges,
                datasets: [{
                    label: 'Products',
                    data: ratingCounts,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.16)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { padding: 8 } },
                layout: { padding: 6 },
                scales: {
                    x: { grid: { display: false }, ticks: { font: {size: 11} } },
                    y: { beginAtZero: true, ticks: { font: {size: 11} } }
                }
            }
        });
    }

    updateCharts() {
        this.loadData();
        this.renderKPIs();
        this.renderCharts();
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

