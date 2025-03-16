// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation to flight cards on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add active class to navigation links on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Initialize the map with a wider view to show all cities
const map = L.map('flight-map').setView([52.0, 15.0], 4);

// Add a simpler map style (CartoDB Positron)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 8  // Limit zoom level to keep it simple
}).addTo(map);

// City coordinates
const cities = {
    hamburg: { lat: 53.5511, lng: 9.9937, name: 'Hamburg' },
    munich: { lat: 48.1351, lng: 11.5820, name: 'Munich' },
    warsaw: { lat: 52.2297, lng: 21.0122, name: 'Warsaw' }
};

// Create custom markers with larger size
const markerIcon = L.divIcon({
    className: 'flight-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

// Add city markers
Object.values(cities).forEach(city => {
    L.marker([city.lat, city.lng], { icon: markerIcon })
        .bindPopup(city.name)
        .addTo(map);
});

// Draw flight paths with thicker lines
const drawFlightPath = (from, to) => {
    const path = L.polyline([
        [from.lat, from.lng],
        [to.lat, to.lng]
    ], {
        className: 'flight-path',
        dashArray: '10, 5',
        weight: 4,
        color: '#0770e3',
        opacity: 0.8
    }).addTo(map);
};

// Draw paths from both cities to Warsaw
drawFlightPath(cities.hamburg, cities.warsaw);
drawFlightPath(cities.munich, cities.warsaw);

// Add flight icons with larger size
const addFlightIcon = (city) => {
    const icon = L.divIcon({
        className: 'flight-icon',
        html: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#0770e3" d="M12,2L8,6h8L12,2z"/></svg>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
    
    L.marker([city.lat, city.lng], { icon: icon })
        .addTo(map);
};

// Add flight icons to departure cities
addFlightIcon(cities.hamburg);
addFlightIcon(cities.munich);

// Force a map refresh after a short delay to ensure proper rendering
setTimeout(() => {
    map.invalidateSize();
}, 100);
