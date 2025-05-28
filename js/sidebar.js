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

// Sidebar toggle functionality with improved button handling
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const body = document.body;
    
    // Only toggle if we're on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
        
        if (sidebar.classList.contains('open')) {
            body.classList.add('sidebar-open');
            menuBtn.classList.add('active');
            menuBtn.innerHTML = '✕';
            menuBtn.setAttribute('aria-label', 'Close menu');
        } else {
            body.classList.remove('sidebar-open');
            menuBtn.classList.remove('active');
            menuBtn.innerHTML = '☰';
            menuBtn.setAttribute('aria-label', 'Open menu');
        }
    }
}

// Update the click outside handler to also reset button state
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const body = document.body;
    
    if (window.innerWidth <= 768 && 
        sidebar &&
        !sidebar.contains(event.target) && 
        menuBtn &&
        !menuBtn.contains(event.target)) {
        sidebar.classList.remove('open');
        
        if (menuBtn) {
            body.classList.remove('sidebar-open');
            menuBtn.classList.remove('active');
            menuBtn.innerHTML = '☰';
            menuBtn.setAttribute('aria-label', 'Open menu');
        }
    }
});

// Also handle window resize to reset state if needed
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const body = document.body;
    
    if (window.innerWidth > 768) {
        // Desktop view - reset everything
        if (sidebar) sidebar.classList.remove('open');
        if (menuBtn) {
            menuBtn.classList.remove('active');
            menuBtn.innerHTML = '☰';
            menuBtn.setAttribute('aria-label', 'Open menu');
        }
        body.classList.remove('sidebar-open');
    }

});

// Initialize button state on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = generateSidebar(currentPage);
    }
    
    // Ensure proper initial state
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.setAttribute('aria-label', 'Open menu');
        menuBtn.innerHTML = '☰';
    }
    
    // Reset any sidebar state on page load
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    body.classList.remove('sidebar-open');
    if (sidebar) sidebar.classList.remove('open');
});