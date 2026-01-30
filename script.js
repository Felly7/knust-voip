const resources = [
    {
        title: "Main VoIP Directory",
        description: "Access the complete directory of VoIP contacts.",
        image: "voip image 2.png",
        url: "https://voip.knust.edu.gh/",
        category: "Directory"
    },
    {
        title: "Call/Contact Center Areas",
        description: "Information on call centers and contact areas.",
        image: "pngwing.com.png",
        url: "https://drive.google.com/file/d/1CQwjYNoYmDeObfwuQ35YTUeRu7rYHWeL/view?usp=sharing",
        category: "Contact"
    },
    {
        title: "Garnet VoIP Directory",
        description: "Specialized directory for Garnet users.",
        image: "garnet.webp",
        url: "https://drive.google.com/file/d/1oin3pMMwoY8JYiKiUbzWLCPh7o9Bhsld/view?usp=sharing",
        category: "Directory"
    },
    {
        title: "Report VoIP issues",
        description: "Submit a ticket for technical problems.",
        image: "voip.jpg",
        url: "https://helpdesk.knust.edu.gh/open.php",
        category: "Support"
    },
    {
        title: "View VoIP Education and Training Manual",
        description: "Guides and manuals for VoIP usage.",
        image: "index.jpg",
        url: "https://docs.google.com/document/d/1QhZ7lKkm1h_joyMGE0UdZVVJJmmS0o4dIygiyRCnIYg/edit?usp=sharing",
        category: "Training"
    },
    {
        title: "Microsoft Teams Phone System",
        description: "Integration and setup for MS Teams phones.",
        image: "Microsoft-Teams-Logo.png",
        url: "https://docs.google.com/document/d/1hh_yLHZsnXTJYb4fgGVvgCOokpn6CfFaHp4CskUiUYA/edit?usp=sharing",
        category: "System"
    },
    {
        title: "Recommended VoIP Phone Models",
        description: "View approved and recommended VoIP phone models.",
        image: "Fanvil-X7.webp",
        url: "https://drive.google.com/file/d/1nMsSezv6WEKZmmEgBUtvKo9sXHSq7_SE/view?usp=sharing",
        category: "Hardware"
    },
    {
        title: "VoIP Softphones Setup",
        description: "Instructions for setting up softphones.",
        image: "Phone Call icon symbol vector  in trendy flat style Call icon, sign for  app, logo, web Call icon flat vector illustration Telephone symbol.jpg",
        url: "https://docs.google.com/document/d/18S7r5I7GvC2S3lFw0LQRkndrDvugjkl7QjfjmaEkAhs/edit?usp=sharing",
        category: "Setup"
    }
];

// DOM Elements
const gridContainer = document.getElementById('resources-grid');
const searchInput = document.getElementById('search-input');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderResources(resources);
    setupSearch();
    createParticles();
});

// Render Cards
function renderResources(data) {
    gridContainer.innerHTML = '';

    data.forEach(resource => {
        const card = document.createElement('a');
        card.href = resource.url;
        card.className = 'card';
        card.innerHTML = `
            <div class="card-icon">
                <img src="${resource.image}" alt="${resource.title}" class="card-icon-img">
            </div>
            <h3 class="card-title">${resource.title}</h3>
            <p class="card-description">${resource.description}</p>
            <div class="card-arrow">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// Search Functionality
function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filtered = resources.filter(resource => {
            return resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.category.toLowerCase().includes(searchTerm);
        });

        renderResources(filtered);
    });
}

// Extra Particle Effects (Subtle floating dots)
// Extra Particle Effects (Big floating dots)
function createParticles() {
    const bg = document.getElementById('background-animation');
    const particleCount = 15; // Reduced count for larger particles
    const colors = ['rgba(0,0,0,0.1)', 'rgba(250, 204, 21, 0.2)', 'rgba(34, 197, 94, 0.2)']; // Black, Yellow, Green

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 40 + 20; // 20px to 60px
        particle.style.position = 'absolute';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random Color
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${20 + Math.random() * 30}s infinite linear`;
        particle.style.animationDelay = `-${Math.random() * 20}s`;

        // Blur for soft effect
        particle.style.filter = 'blur(2px)';

        bg.appendChild(particle);
    }
}
