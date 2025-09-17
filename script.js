document.addEventListener('DOMContentLoaded', function () {

    /* Hero progressive loading */
    const heroContent = document.querySelector('.hero__content');
    const heroMain = document.querySelector('.hero__main');
    const heroBg = document.querySelector('.hero__bg');
    const heroInnerSequence = [
        '.hero__swoosh-mobile',
        '.hero__logos',
        '.hero__title',
        '.hero__subtitle',
        '.hero__scroll-down'
    ];
    if (heroContent && heroMain && heroBg) {
        const revealHeroMain = () => {
            if (!heroMain.classList.contains('load-complete')) {
                heroMain.classList.add('load-complete');
                heroMain.classList.remove('load-init');
            }
        };
        const revealSequence = (selectors, delayBetween = 120, startDelay = 0) => {
            selectors.forEach((sel, idx) => {
                setTimeout(() => {
                    document.querySelectorAll(sel + '.load-init').forEach(el => {
                        el.classList.add('load-complete');
                        el.classList.remove('load-init');
                    });
                }, startDelay + idx * delayBetween);
            });
        };
        const revealHeroContent = () => {
            if (heroBg.classList.contains('load-init')) {
                heroBg.classList.add('load-complete');
                heroBg.classList.remove('load-init');
            }
            if (heroContent.classList.contains('load-init')) {
                heroContent.classList.add('load-complete');
                heroContent.classList.remove('load-init');
            }
            
            setTimeout(revealHeroMain, 150);
            
            setTimeout(() => {
                document.querySelectorAll('.hero__swoosh').forEach(el => {
                    if (el.classList.contains('load-init')) {
                        el.classList.add('load-complete');
                        el.classList.remove('load-init');
                    }
                });
            }, 1700);
            
            revealSequence(heroInnerSequence.map(s => s + '.load-init'), 150, 250);
        };

        
        const heroBgUrl = getComputedStyle(heroBg).backgroundImage;
        const imgs = [];
        const pushImg = (src) => { if (src) { const i = new Image(); i.onload = checkAll; i.onerror = checkAll; i.src = src.replace(/url\(["']?(.+?)["']?\)/,'$1'); imgs.push(i);} };
        
        pushImg(heroBgUrl);
        const logoEl = document.querySelector('.hero__logos');
        if (logoEl && logoEl.getAttribute('src')) pushImg(`url(${logoEl.getAttribute('src')})`);

        let remaining = imgs.length;
        function checkAll(){ remaining--; if (remaining <= 0) revealHeroContent(); }
        if (!imgs.length) {
            
            requestAnimationFrame(revealHeroContent);
        }
        
        setTimeout(revealHeroContent, 2500);
    }



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

            pagination: {
                el: '.swiper-pagination', 
                clickable: true,          
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

                animation: {

                    duration: 2400, 

                    easing: 'easeOutQuart'

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

                animation: {

                    duration: 2400, 

                    easing: 'easeOutQuart'

                },

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

        const duration = 3000; 

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

                    duration: 2400, 

                    easing: 'easeOutQuart'

                }

            },

            plugins: [percentLabelPlugin]

        });



        canvas._chartInstance = chart;

    };



    const createSafetyChart = () => {

        const ctx = document.getElementById('safetyChart');

        if (!ctx) return;

    

        const safetyLabelsPlugin = {

            id: 'safetyLabels',

            afterDatasetsDraw: (chart) => {

                const { ctx, data, chartArea: { right } } = chart;

                ctx.save();

    

                const valuePadding = 12;

                const yearPadding = 12;

    

                chart.getDatasetMeta(0).data.forEach((datapoint, index) => {

                    const value = data.datasets[0].data[index];

                    const year = data.labels[index];

    

                    

                    ctx.font = `700 26px SimplerPro`;

                    ctx.fillStyle = '#010636';

                    ctx.textAlign = 'right';

                    ctx.textBaseline = 'middle';

                    ctx.fillText(value, datapoint.x - valuePadding, datapoint.y);

    

                    

                    ctx.font = `700 17px SimplerPro`;

                    ctx.fillStyle = '#ffffff';

                    ctx.textAlign = 'right';

                    ctx.textBaseline = 'middle';

                    ctx.fillText(year, right - yearPadding, datapoint.y);

                });

    

                ctx.restore();

            }

        };

    

        new Chart(ctx, {

            type: 'bar',

            data: {

                labels: ['2023', '2024'],

                datasets: [{

                    label: 'Количество',

                    data: [375, 960],

                    backgroundColor: ['#16ADFE', '#24D2B3'], 

                    barPercentage: 1.0,

                    categoryPercentage: 1.0, 

                }]

            },

            options: {

                indexAxis: 'y',

                responsive: true,

                maintainAspectRatio: false,

                animation: {

                    duration: 2400, 

                    easing: 'easeOutQuart'

                },

                plugins: {

                    legend: { display: false },

                    tooltip: { enabled: false }

                },

                scales: {

                    x: {

                        reverse: true,

                        display: false,

                        beginAtZero: true,

                        grace: '25%'

                    },

                    y: {

                        display: false,

                    }

                }

            },

            plugins: [safetyLabelsPlugin]

        });

    };



    const createRecommendationCharts = () => {
        const animateValue = (element, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                const easedProgress = 1 - Math.pow(1 - progress, 3); 
                element.innerHTML = Math.floor(easedProgress * (end - start) + start) + '%';
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };
    
        const chartDefaults = {
            type: 'doughnut',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '50%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                animation: {
                    animateRotate: true,
                    animateScale: false,
                    duration: 900, 
                    easing: 'easeOutQuart'
                }
            }
        };
    
        
        const ctx2024 = document.getElementById('recommendationChart2024');
        if (ctx2024) {
            new Chart(ctx2024, {
                ...chartDefaults,
                data: {
                    datasets: [{
                        label: 'Pelephone',
                        data: [92, 100 - 92],
                        backgroundColor: ['#1229c6', '#ffffff'],
                        borderWidth: 0,
                    }, {
                        label: 'Yes',
                        data: [89, 100 - 89],
                        backgroundColor: ['#00c0e8', '#ffffff'],
                        borderWidth: 0,
                    }]
                }
            });
        }
        
        
        const ctx2023 = document.getElementById('recommendationChart2023');
        if (ctx2023) {
            new Chart(ctx2023, {
                ...chartDefaults,
                data: {
                    datasets: [{
                        label: 'Pelephone',
                        data: [89, 100 - 89],
                        backgroundColor: ['#1229c6', '#ffffff'],
                        borderWidth: 0,
                    }, {
                        label: 'Yes',
                        data: [88, 100 - 88],
                        backgroundColor: ['#00c0e8', '#ffffff'],
                        borderWidth: 0,
                    }]
                }
            });
        }

        
        const recommendationSection = document.getElementById('recommendation-section');
        if (recommendationSection) {
            recommendationSection.querySelectorAll('.percentage-value').forEach(span => {
                const finalValue = parseInt(span.dataset.value, 10);
                
                animateValue(span, 0, finalValue, 800); 
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

                

                

                const targetPanel = document.getElementById(targetId);

                if (targetPanel) {

                    targetPanel.classList.add('community-impact__tab-panel--active');

                }

            });

        });

    }



    const observerCallback = (entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;

                if (targetId === 'charts-section') createCustomWasteChart();
                if (targetId === 'diversity-chart-section') createDiversityChart();
                if (targetId === 'safety-chart-section') createSafetyChart();
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
    };

    const mainObserver = new IntersectionObserver(observerCallback, { threshold: 0.75 });

    const recommendationObserver = new IntersectionObserver(observerCallback, { threshold: 0.5 });


    const recommendationSection = document.getElementById('recommendation-section');
    if (recommendationSection) {
        
        recommendationObserver.observe(recommendationSection);
    }

    const otherSectionsToObserve = [
        document.getElementById('charts-section'),
        document.getElementById('progress-section'),
        document.getElementById('diversity-chart-section'),
        document.getElementById('safety-chart-section'),
        document.getElementById('water-chart-section')
    ];

    otherSectionsToObserve.forEach(section => {
        if (section) {
            mainObserver.observe(section);
        }
    });


    
    setTimeout(() => {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('loaded');
        }
    }, 500);

});