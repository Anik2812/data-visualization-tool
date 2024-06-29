let flavorChart, topFlavorsChart;
let isBarChart = true;

function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 85%)`;
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
                backgroundColor: Object.keys(data).map(() => getRandomPastelColor()),
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Popularity Score'
                    }
                }
            },
            plugins: {
                legend: {
                    display: type === 'pie'
                }
            }
        }
    });
}

function createTopFlavorsChart(data) {
    const ctx = document.getElementById('topFlavorsChart').getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: Object.keys(data).map(() => getRandomPastelColor()),
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        flavorChart = createFlavorChart(data.flavor_popularity, 'bar');
        topFlavorsChart = createTopFlavorsChart(data.top_5_flavors);
        
        // Animate elements
        anime({
            targets: 'h1, .chart-container',
            opacity: 1,
            translateY: 0,
            delay: anime.stagger(200)
        });
    });

document.getElementById('toggleChartBtn').addEventListener('click', () => {
    isBarChart = !isBarChart;
    flavorChart.destroy();
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            flavorChart = createFlavorChart(data.flavor_popularity, isBarChart ? 'bar' : 'pie');
        });
});