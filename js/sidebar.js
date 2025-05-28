// Sidebar configuration
const sidebarConfig = {
    title: "Tony Chan",
    subtitle: "Decision Analytics & AI",
    sections: [
        {
            title: "Portfolio",
            links: [
                { href: "./", text: "Home" }
            ]
        },
        {
            title: "Large Projects", 
            links: [
                { href: "content-recommendation.html", text: "Content Recommendation" },
                { href: "star-planner.html", text: "Star Planner" }
            ]
        },
        {
            title: "Small Projects",
            links: [
                { href: "robo-advisor.html", text: "Robo-Advisor" },
                { href: "stock-sentiment.html", text: "Stock Sentiment" },
                { href: "web-crawler.html", text: "Web Crawler" },
            ]
        }
    ]
};

// Generate sidebar HTML
function generateSidebar(currentPage) {
    const sectionsHTML = sidebarConfig.sections.map(section => {
        const linksHTML = section.links.map(link => {
            const activeClass = link.href === currentPage ? ' active' : '';
            return `<a href="${link.href}" class="nav-link${activeClass}">${link.text}</a>`;
        }).join('');

        return `
            <div class="nav-section">
                <div class="nav-section-title">${section.title}</div>
                ${linksHTML}
            </div>
        `;
    }).join('');

    return `
        <nav class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h2 class="sidebar-title">${sidebarConfig.title}</h2>
                <p style="color: var(--text-muted); font-size: 0.875rem;">${sidebarConfig.subtitle}</p>
            </div>
            <div class="sidebar-nav">
                ${sectionsHTML}
            </div>
        </nav>
    `;
}

// Initialize sidebar on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = generateSidebar(currentPage);
    }
});

// Sidebar toggle functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 768 && 
        sidebar &&
        !sidebar.contains(event.target) && 
        !menuBtn.contains(event.target)) {
        sidebar.classList.remove('open');
    }
});