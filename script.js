// Initialize Global Data
let globalDirectory = [];
let resources = []; // Now fetching resources dynamically too if available

const defaultResources = [
    {
        title: "Main VoIP Directory",
        description: "Access the complete directory of VoIP contacts.",
        image: "voip image 2.png", // Ensure these images exist or use placeholders if broken
        url: "https://voip.knust.edu.gh/",
        type: "link",
        category: "Directory"
    },
    {
        title: "Call/Contact Center Areas",
        description: "Information on call centers and contact areas.",
        image: "pngwing.com.png",
        url: "https://drive.google.com/file/d/1CQwjYNoYmDeObfwuQ35YTUeRu7rYHWeL/view?usp=sharing",
        type: "resource",
        category: "Contact"
    },
    {
        title: "Garnet VoIP Directory",
        description: "Specialized directory for Garnet users.",
        image: "garnet.webp",
        url: "https://drive.google.com/file/d/1oin3pMMwoY8JYiKiUbzWLCPh7o9Bhsld/view?usp=sharing",
        type: "link",
        category: "Directory"
    },
    {
        title: "Report VoIP issues",
        description: "Submit a ticket for technical problems.",
        image: "voip.jpg",
        url: "https://helpdesk.knust.edu.gh/open.php",
        type: "link",
        category: "Support"
    },
    {
        title: "View VoIP Manual",
        description: "Guides and manuals for VoIP usage.",
        image: "index.jpg",
        url: "https://docs.google.com/document/d/1QhZ7lKkm1h_joyMGE0UdZVVJJmmS0o4dIygiyRCnIYg/edit?usp=sharing",
        type: "resource",
        category: "Training"
    },
    {
        title: "Microsoft Teams Phone",
        description: "Integration and setup for MS Teams phones.",
        image: "Microsoft-Teams-Logo.png",
        url: "https://docs.google.com/document/d/1hh_yLHZsnXTJYb4fgGVvgCOokpn6CfFaHp4CskUiUYA/edit?usp=sharing",
        type: "resource",
        category: "System"
    },
    {
        title: "Recommended Models",
        description: "View approved and recommended VoIP phone models.",
        image: "Fanvil-X7.webp",
        url: "https://drive.google.com/file/d/1nMsSezv6WEKZmmEgBUtvKo9sXHSq7_SE/view?usp=sharing",
        type: "resource",
        category: "Hardware"
    },
    {
        title: "Softphones Setup",
        description: "Instructions for setting up softphones.",
        image: "Phone Call icon symbol vector  in trendy flat style Call icon, sign for  app, logo, web Call icon flat vector illustration Telephone symbol.jpg",
        url: "https://docs.google.com/document/d/18S7r5I7GvC2S3lFw0LQRkndrDvugjkl7QjfjmaEkAhs/edit?usp=sharing",
        type: "resource",
        category: "Setup"
    }
];
resources = defaultResources; // Default fallback if API fails

// DOM Elements
const gridContainer = document.getElementById('resources-grid');
const directoryContainer = document.getElementById('directory-list');
const searchInput = document.getElementById('search-input');
const tabButtons = document.querySelectorAll('.tab-btn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {

    // FETCH DATA FROM API
    try {
        const response = await fetch('api.php');
        if (response.ok) {
            const data = await response.json();

            // Allow for different DB structures (flat array or object with keys)
            if (Array.isArray(data)) {
                globalDirectory = data;
            } else if (data.directory) {
                globalDirectory = data.directory;
                // If DB has resources, use them, else stick to default
                if (data.resources) resources = data.resources;
            }
        }
    } catch (e) {
        console.warn("API load failed, falling back to static/script data.", e);
        // Fallback to js variable if exists
        if (typeof directoryData !== 'undefined') globalDirectory = directoryData;
    }

    // Page: Resources (Old Index)
    if (gridContainer) {
        renderResources(resources);
    }

    // Page: Home (Directory Clone) and Unified Tabs
    if (directoryContainer) {
        renderDirectory(globalDirectory);
    }

    // Listeners
    setupSearch();
    if (tabButtons.length > 0) setupTabs(); // Only if tabs exist (resources page)
});



// Render Resources Cards
function renderResources(data) {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    if (data.length === 0) {
        gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No resources found matching your search.</p>';
        return;
    }

    data.forEach(resource => {
        const card = document.createElement('a');
        card.href = resource.url;
        card.target = "_blank";
        card.className = 'card';
        // Add a fallback for images or just use decorative icons if image fails
        // Simple icon placeholder if no valid image logic exists
        card.innerHTML = `
            <div class="card-icon">
               <!-- Using a generic icon if specific ones fail to load or just standardizing -->
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3 class="card-title">${resource.title}</h3>
            <p class="card-description">${resource.description}</p>
            <div class="card-arrow">
                View Resource
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// Render Directory List
function renderDirectory(data) {
    if (!directoryContainer) return;
    directoryContainer.innerHTML = '';

    if (data.length === 0) {
        directoryContainer.innerHTML = '<p class="text-center" style="padding: 2rem; color: var(--text-secondary);">No units found. Try searching.</p>';
        return;
    }

    // Sort alphabetically
    data.sort((a, b) => a.name.localeCompare(b.name));

    data.forEach(unit => {
        const item = document.createElement('a');
        item.href = unit.url;
        item.target = "_blank";
        item.className = 'directory-item';
        item.innerHTML = `
            <span class="dir-icon">&raquo;</span>
            <span class="dir-name">${unit.name}</span>
        `;
        directoryContainer.appendChild(item);
    });
}

// Tab Switching Logic
function setupTabs() {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Activate clicked
            btn.classList.add('active');
            const targetId = btn.dataset.tab + '-section';
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.add('active');
        });
    });
}

// Unified Search
function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();

        // 1. Filter Resources (if on Resources page)
        if (gridContainer) {
            const filteredResources = resources.filter(r =>
                r.title.toLowerCase().includes(term) ||
                r.description.toLowerCase().includes(term) ||
                r.category.toLowerCase().includes(term)
            );
            renderResources(filteredResources);
        }

        // 2. Filter Directory (if on Home page OR Resources page with directory tab)
        if (directoryContainer && globalDirectory.length > 0) {
            const filteredDir = globalDirectory.filter(u =>
                u.name.toLowerCase().includes(term)
            );
            renderDirectory(filteredDir);
        }
    });
}
// Update copyright year
function updateCopyright() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Call updateCopyright on load
window.addEventListener('load', updateCopyright);
