let flavorChart, topFlavorsChart;
let isBarChart = true;

function getResponsiveFont() {
    if (window.innerWidth <= 480) return 10;
    if (window.innerWidth <= 768) return 12;
    return 14;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createFlavorChart(data, type) {
    const ctx = document.getElementById('flavorChart').getContext('2d');
    return new Chart(ctx, {
        type: type,
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Popularity',
                data: Object.values(data),
                backgroundColor: Object.keys(data).map(() => getRandomColor()),
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: type === 'pie',
                    labels: {
                        font: {
                            size: getResponsiveFont()
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Popularity Score',
                        font: {
                            size: getResponsiveFont()
                        }
                    },
                    ticks: {
                        font: {
                            size: getResponsiveFont()
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: getResponsiveFont()
                        }
                    }
                }
            }
        }
    });
}

function createTopFlavorsChart(data) {
    const ctx = document.getElementById('topFlavorsChart').getContext('2d');
    return new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: Object.keys(data).map(() => getRandomColor()),
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: getResponsiveFont()
                        }
                    }
                }
            }
        }
    });
}

function updateCharts() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            if (flavorChart) flavorChart.destroy();
            if (topFlavorsChart) topFlavorsChart.destroy();
            flavorChart = createFlavorChart(data.flavor_popularity, isBarChart ? 'bar' : 'pie');
            topFlavorsChart = createTopFlavorsChart(data.top_5_flavors);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('ice-cream-cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Landing page animations
    gsap.from(".letter", {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.1,
        ease: "bounce.out"
    });

    gsap.from(".subtitle", {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1
    });

    gsap.from(".ice-cream-cone", {
        scale: 0,
        duration: 1,
        delay: 1.5,
        ease: "elastic.out(1, 0.3)"
    });

    gsap.from("#enter-park", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 2
    });

    const enterParkBtn = document.getElementById('enter-park');
    const landingPage = document.getElementById('landing-page');
    const mainPark = document.getElementById('main-park');

    enterParkBtn.addEventListener('click', () => {
        gsap.to(landingPage, {
            opacity: 0,
            y: -50,
            duration: 1,
            onComplete: () => {
                landingPage.classList.add('hidden');
                mainPark.classList.remove('hidden');
                gsap.from(mainPark, {
                    opacity: 0,
                    y: 50,
                    duration: 1
                });
                updateCharts();
            }
        });
    });

    const toggleChartBtn = document.getElementById('toggleChartBtn');
    toggleChartBtn.addEventListener('click', () => {
        isBarChart = !isBarChart;
        gsap.to('#flavorChart', {
            rotation: 360,
            duration: 1,
            onComplete: updateCharts
        });
    });

    const submitFlavorBtn = document.getElementById('submitFlavorBtn');
    submitFlavorBtn.addEventListener('click', () => {
        const name = document.getElementById('new-flavor-name').value;
        const popularity = document.getElementById('new-flavor-popularity').value;
        if (name && popularity) {
            fetch('/api/data')
                .then(response => response.json())
                .then(data => {
                    data.flavor_popularity[name] = parseInt(popularity);
                    updateCharts();
                    gsap.from('.chart-container', {
                        scale: 1.1,
                        duration: 0.5,
                        ease: 'elastic.out(1, 0.3)'
                    });
                });
        }
    });

    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const parkSections = document.querySelectorAll('.park-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            parkSections.forEach(section => {
                if (section.id === targetId) {
                    gsap.to(section, { opacity: 1, display: 'block', duration: 0.5 });
                } else {
                    gsap.to(section, { opacity: 0, display: 'none', duration: 0.5 });
                }
            });
        });
    });

    // Ice cream scoops hover effect
    const scoops = document.querySelectorAll('.scoop');
    scoops.forEach(scoop => {
        scoop.addEventListener('mouseenter', () => {
            gsap.to(scoop, { 
                y: -20, 
                scale: 1.1, 
                duration: 0.3, 
                ease: 'back.out(1.7)'
            });
        });
        scoop.addEventListener('mouseleave', () => {
            gsap.to(scoop, { 
                y: 0, 
                scale: 1, 
                duration: 0.3, 
                ease: 'back.out(1.7)'
            });
        });
    });

    window.addEventListener('resize', () => {
        updateCharts();
    });
});