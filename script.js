document.addEventListener('DOMContentLoaded', function () {

    const animatedItems = document.querySelectorAll('.features__item, .goal-card');
    animatedItems.forEach(item => {
        const lottiePlayer = item.querySelector('lottie-player');
        if (!lottiePlayer) return;
        lottiePlayer.setAttribute('loop', '');
        lottiePlayer.loop = true;
        const start = () => {
            try { lottiePlayer.play(); } catch (e) { }
        };
        lottiePlayer.addEventListener('DOMLoaded', start);
        lottiePlayer.addEventListener('loaded', start);
        lottiePlayer.addEventListener('ready', start);

        setTimeout(start, 50);
    });

    if (document.querySelector('.community-slider__swiper')) {
        new Swiper('.community-slider__swiper', {
            direction: 'horizontal',
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
        });
    }

    const formatNumber = (num) => {
        const n = Number(num);
        if (Number.isNaN(n)) return num;
        return new Intl.NumberFormat('en-US').format(n);
    };

    const createCustomWasteChart = () => {
        const ctx = document.getElementById('wasteChartCustom');
        if (!ctx) return;

        const customLabelsPlugin = {
            id: 'customLabels',
            afterDatasetsDraw: (chart) => {
                const { ctx, data } = chart;
                ctx.save();
                
                chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
                    const value = data.datasets[0].data[index];
                    const year = data.labels[index];

                    ctx.font = '700 21px SimplerPro';
                    ctx.fillStyle = '#000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(value, datapoint.x, datapoint.y - 6);

                    ctx.font = '700 17px SimplerPro';
                    ctx.fillStyle = 'white';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(year, datapoint.x, datapoint.base - 10);
                });
                ctx.restore();
            }
        };

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2024', '2023', '2022'],
                datasets: [{
                    label: 'טונות',
                    data: [111.8, 117.2, 103.6],
                    backgroundColor: ['#24D2B3', '#16ADFE', '#0B429C'],
                    hoverBackgroundColor: ['#50E0C4', '#49C0FF', '#1E5AAF'],
                    barPercentage: 1.0, 
                    categoryPercentage: 1.0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true, 
                        displayColors: false,
                        backgroundColor: '#010635',
                        titleAlign: 'center',
                        bodyAlign: 'center',
                        callbacks: {
                            title: () => null,
                            label: (context) => {
                                return `${context.parsed.y} טונות`;
                            }
                        }
                    },
                    customLabels: {}
                },
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        display: false,
                        beginAtZero: true,
                        grace: '20%' 
                    }
                }
            },
            plugins: [customLabelsPlugin]
        });
    };

    const createWaterChart = () => {
        const ctx = document.getElementById('waterChart');
        if (!ctx) return;

        const labelPlugin = {
            id: 'waterLabels',
            afterDatasetsDraw: (chart) => {
                const { ctx, data } = chart;
                ctx.save();

                chart.getDatasetMeta(0).data.forEach((bar, i) => {
                    const rawValue = data.datasets[0].data[i];
                    const value    = formatNumber(rawValue);
                    const year     = data.labels[i];

                    ctx.font = '700 21px SimplerPro';
                    ctx.fillStyle = '#000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(value, bar.x, bar.y - 6);

                    ctx.font = '700 17px SimplerPro';
                    ctx.fillStyle = 'white';
                    ctx.fillText(year, bar.x, bar.base - 10);
                });

                ctx.restore();
            }
        };

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2024', '2023', '2022'],
                datasets: [{
                    label: 'קוב',
                    data: [55531, 65895, 82045],
                    backgroundColor: ['#24D2B3', '#16ADFE', '#0B429C'],
                    hoverBackgroundColor: ['#50E0C4', '#49C0FF', '#1E5AAF'],
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        displayColors: false,
                        backgroundColor: '#010635',
                        titleAlign: 'center',
                        bodyAlign: 'center',
                        callbacks: {
                            title: () => null,
                            label: (ctx) => `${ctx.parsed.y.toLocaleString()} קוב`
                        }
                    },
                    waterLabels: {}
                },
                scales: {
                    x: { display: false },
                    y: {
                        display: false,
                        beginAtZero: true,
                        grace: '20%'
                    }
                },
                onHover: (e, el) => {
                    e.native.target.style.cursor = el[0] ? 'pointer' : 'default';
                }
            },
            plugins: [labelPlugin]
        });
    };

    const animateProgress = (element) => {
        const circle = element.querySelector('.progress__ring-fg');
        const percentLabel = element.querySelector('.progress__percent');
        const targetPercent = parseInt(element.dataset.percent, 10);
        
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (targetPercent / 100) * circumference;
        
        circle.style.strokeDashoffset = offset;
        
        let currentPercent = 0;
        const duration = 1500;
        const stepTime = Math.abs(Math.floor(duration / targetPercent)) || 1;
        
        const timer = setInterval(() => {
            currentPercent++;
            percentLabel.textContent = `${currentPercent}%`;
            if (currentPercent >= targetPercent) {
                clearInterval(timer);
                percentLabel.textContent = `${targetPercent}%`;
            }
        }, stepTime);
    };

    const createDiversityChart = () => {
        const canvas = document.getElementById('diversityChart');
        if (!canvas) return;

        if (canvas._chartInstance) {
            canvas._chartInstance.destroy();
        }

        const percentLabelPlugin = {
            id: 'percentLabels',
            afterDatasetsDraw: (chart) => {
                const { ctx, data } = chart;
                ctx.save();

                chart.getDatasetMeta(0).data.forEach((bar, i) => {
                    const rawValue = data.datasets[0].data[i];
                    const value    = `${rawValue}%`;
                    const year     = data.labels[i];

                    ctx.font = '700 30px SimplerPro';
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(value, bar.x, bar.y - 6);

                    ctx.font = '700 17px SimplerPro';
                    ctx.fillStyle = '#fff';
                    ctx.fillText(year, bar.x, bar.base - 10);
                });

                ctx.restore();
            }
        };

        const chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['2024', '2023', '2022', '2021'],
                datasets: [{
                    label: '%',
                    data: [17, 15, 8.4, 7],
                    backgroundColor: [
                        '#24D2B3',
                        '#16ADFE',
                        '#0B429C',
                        '#182D72'
                    ],
                    borderRadius: 0,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        displayColors: false,
                        backgroundColor: '#010635',
                        titleAlign: 'center',
                        bodyAlign: 'center',
                        callbacks: {
                            title: () => null,
                            label: (ctx) => `${ctx.parsed.y}%`
                        }
                    },
                    percentLabels: {}
                },
                scales: {
                    x: { display: false },
                    y: {
                        display: false,
                        beginAtZero: true,
                        grace: '20%'
                    }
                },
                onHover: (e, el) => {
                    e.native.target.style.cursor = el[0] ? 'pointer' : 'default';
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            },
            plugins: [percentLabelPlugin]
        });

        canvas._chartInstance = chart;
    };

    const createSafetyChart = () => {
        const ctx = document.getElementById('safetyChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['2023', '2024'],
                    datasets: [{
                        label: 'Количество',
                        data: [375, 960],
                        backgroundColor: ['#48b8d9', '#48d9a3'],
                        borderRadius: 5,
                    }]
                },
                options: {
                    indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { font: { size: 14 }}, grid: { color: '#e0e0e0' }},
                        y: { ticks: { font: { size: 14 }}, grid: { display: false }}
                    }
                }
            });
        }
    };

    const animateScores = () => {
        document.querySelectorAll('.scores__badge[data-year="2022"]').forEach(badge => {
            badge.classList.add('is-visible');
        });
        setTimeout(() => {
            document.querySelectorAll('.scores__badge[data-year="2023"]').forEach(badge => {
                badge.classList.add('is-visible');
            });
        }, 800);
        setTimeout(() => {
            document.querySelectorAll('.scores__badge[data-year="2024"]').forEach(badge => {
                badge.classList.add('is-visible');
            });
        }, 1600);
    };

    const createRecommendationCharts = () => {
        const chartDefaults = {
            type: 'doughnut',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500
                }
            }
        };

        const ctx2024 = document.getElementById('recommendationChart2024');
        if (ctx2024) {
            new Chart(ctx2024, {
                ...chartDefaults,
                data: {
                    labels: ['Yes', 'Pelephone'],
                    datasets: [{
                        label: 'Yes',
                        data: [89, 11],
                        backgroundColor: ['#007bff', '#e9ecef'],
                        borderColor: '#ffffff',
                        borderWidth: 4,
                        borderRadius: 5,
                    }, {
                        label: 'Pelephone',
                        data: [92, 8],
                        backgroundColor: ['#00c9a7', '#e9ecef'],
                        borderColor: '#ffffff',
                        borderWidth: 4,
                        borderRadius: 5,
                    }]
                }
            });
        }
        
        const ctx2023 = document.getElementById('recommendationChart2023');
        if (ctx2023) {
            new Chart(ctx2023, {
                ...chartDefaults,
                data: {
                    labels: ['Yes', 'Pelephone'],
                    datasets: [{
                        label: 'Yes',
                        data: [88, 12],
                        backgroundColor: ['#007bff', '#e9ecef'],
                        borderColor: '#ffffff',
                        borderWidth: 4,
                        borderRadius: 5,
                    }, {
                        label: 'Pelephone',
                        data: [89, 11],
                        backgroundColor: ['#00c9a7', '#e9ecef'],
                        borderColor: '#ffffff',
                        borderWidth: 4,
                        borderRadius: 5,
                    }]
                }
            });
        }
    };

    const tabsContainer = document.querySelector('.community-impact');
    if (tabsContainer) {
        const tabLinks = tabsContainer.querySelectorAll('.community-impact__tab-link');
        const tabPanels = tabsContainer.querySelectorAll('.community-impact__tab-panel');

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const targetId = link.dataset.tab;

                tabLinks.forEach(item => item.classList.remove('community-impact__tab-link--active'));
                tabPanels.forEach(panel => panel.classList.remove('community-impact__tab-panel--active'));
                
                link.classList.add('community-impact__tab-link--active');
                document.getElementById(targetId).classList.add('community-impact__tab-panel--active');
            });
        });
    }

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;

                if (targetId === 'charts-section') createCustomWasteChart();
                if (targetId === 'diversity-chart-section') createDiversityChart();
                if (targetId === 'safety-chart-section') createSafetyChart();
                if (targetId === 'scores-section') animateScores();
                if (targetId === 'recommendation-section') createRecommendationCharts();
                if (targetId === 'water-chart-section') createWaterChart();

                if (targetId === 'progress-section') {
                    const circles = entry.target.querySelectorAll('.progress__circle');
                    circles.forEach(circle => {
                        if (!circle.classList.contains('animated')) {
                            animateProgress(circle);
                            circle.classList.add('animated');
                        }
                    });
                }
                
                observerInstance.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const sectionsToObserve = [
        document.getElementById('charts-section'),
        document.getElementById('progress-section'),
        document.getElementById('diversity-chart-section'),
        document.getElementById('safety-chart-section'),
        document.getElementById('scores-section'),
        document.getElementById('recommendation-section'),
        document.getElementById('water-chart-section')
    ];

    sectionsToObserve.forEach(section => {
        if (section) {
            observer.observe(section);
        }
    });
});