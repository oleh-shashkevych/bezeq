document.addEventListener('DOMContentLoaded', function () {

     const isMobileResolution = () => {
        // A common breakpoint for tablets/mobile devices (e.g., max 768px or 800px)
        const MOBILE_MAX_WIDTH = 768; 
        return window.innerWidth <= MOBILE_MAX_WIDTH;
    };

    /* Performance Utilities */
    const PerformanceUtils = {
        /**
         * Throttle function - limits execution to once per interval (good for high-frequency events)
         * @param {Function} func - Function to throttle
         * @param {number} delay - Delay in milliseconds
         * @returns {Function} Throttled function
         */
        throttle: (func, delay) => {
            let lastExecution = 0;
            let timeoutId = null;
            
            return function(...args) {
                const now = Date.now();
                const timeSinceLastExecution = now - lastExecution;
                
                if (timeSinceLastExecution >= delay) {
                    lastExecution = now;
                    func.apply(this, args);
                } else if (!timeoutId) {
                    timeoutId = setTimeout(() => {
                        lastExecution = Date.now();
                        timeoutId = null;
                        func.apply(this, args);
                    }, delay - timeSinceLastExecution);
                }
            };
        },

        /**
         * Debounce function - delays execution until after delay has passed since last call
         * @param {Function} func - Function to debounce
         * @param {number} delay - Delay in milliseconds
         * @returns {Function} Debounced function
         */
        debounce: (func, delay) => {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        /**
         * Request Animation Frame throttle - limits to display refresh rate
         * @param {Function} func - Function to throttle
         * @returns {Function} RAF throttled function
         */
        rafThrottle: (func) => {
            let rafId = null;
            return function(...args) {
                if (rafId === null) {
                    rafId = requestAnimationFrame(() => {
                        rafId = null;
                        func.apply(this, args);
                    });
                }
            };
        }
    };

    /* Timing Constants - Optimized for best performance/UX balance */
    const TIMING = {
        HOVER_THROTTLE: 16,     // 60fps for smooth hover effects
        CLICK_DEBOUNCE: 150,    // Prevent accidental double-clicks
        SCROLL_THROTTLE: 16,    // 60fps for smooth scroll effects
        ANIMATION_DELAY: 100    // Slight delay for perceived responsiveness
    };

    /* Dynamic Image Path Fixer */
    const ImagePathFixer = {
        /**
         * Fixes image paths to work with any version directory (V3, V4, etc.)
         * Converts absolute paths like "/img/..." to relative paths like "img/..."
         */
        fixImagePaths: () => {
            const startTime = performance.now();
            let fixedCount = 0;

            // Fix img src attributes
            const images = document.querySelectorAll('img[src]');
            images.forEach(img => {
                const src = img.getAttribute('src');
                if (src && src.startsWith('/img/')) {
                    const newSrc = src.substring(1); // Remove leading slash
                    img.setAttribute('src', newSrc);
                    fixedCount++;
                }
            });

            // Fix CSS background images in style attributes
            const elementsWithStyle = document.querySelectorAll('[style*="background-image"]');
            elementsWithStyle.forEach(el => {
                const style = el.getAttribute('style');
                if (style && style.includes('url(/img/')) {
                    const newStyle = style.replace(/url\(\/img\//g, 'url(img/');
                    el.setAttribute('style', newStyle);
                    fixedCount++;
                }
            });

            // Fix dynamically loaded images (for future reference)
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Fix new img elements
                                if (node.tagName === 'IMG' && node.getAttribute('src')?.startsWith('/img/')) {
                                    const src = node.getAttribute('src');
                                    node.setAttribute('src', src.substring(1));
                                }
                                // Fix img elements within added nodes
                                const newImages = node.querySelectorAll?.('img[src^="/img/"]');
                                newImages?.forEach(img => {
                                    const src = img.getAttribute('src');
                                    img.setAttribute('src', src.substring(1));
                                });
                            }
                        });
                    }
                });
            });

            // Start observing for dynamic content
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            const endTime = performance.now();
            
            if (typeof console !== 'undefined' && console.info) {
                console.info(`🔧 Image paths fixed: ${fixedCount} paths in ${(endTime - startTime).toFixed(2)}ms`);
            }

            return { fixedCount, executionTime: endTime - startTime };
        },

        /**
         * Creates a helper function to ensure image paths are always relative
         * @param {string} imagePath - The image path to fix
         * @returns {string} Fixed relative path
         */
        ensureRelativePath: (imagePath) => {
            if (typeof imagePath !== 'string') return imagePath;
            
            // If it starts with /img/, make it relative
            if (imagePath.startsWith('/img/')) {
                return imagePath.substring(1);
            }
            
            // If it's already relative or external, return as-is
            return imagePath;
        }
    };

    // Fix image paths immediately
    ImagePathFixer.fixImagePaths();

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

        let hasStarted = false;
        const start = () => {
            if (hasStarted) return; // Prevent multiple starts
            hasStarted = true;
            try { 
                lottiePlayer.play(); 
            } catch (e) { 
                console.warn('Lottie player failed to start:', e);
            }
        };

        // Use only the most reliable event - 'ready' is typically the last to fire
        lottiePlayer.addEventListener('ready', start);
        
        // Fallback with timeout in case ready event doesn't fire
        setTimeout(start, TIMING.ANIMATION_DELAY);



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
                // ИЗМЕНЕНИЕ: Порядок лейблов изменен на обратный
                labels: ['2022', '2023', '2024'],
                datasets: [{
                    label: 'Tons',
                    // ИЗМЕНЕНИЕ: Порядок данных изменен на обратный
                    data: [103.6, 117.2, 111.8],
                    // ИЗМЕНЕНИЕ: Порядок цветов изменен на обратный
                    backgroundColor: ['#0B429C', '#16ADFE', '#24D2B3'],
                    // ИЗМЕНЕНИЕ: Порядок цветов при наведении изменен на обратный
                    hoverBackgroundColor: ['#1E5AAF', '#49C0FF', '#50E0C4'],
                    barPercentage: 1.0, 
                    categoryPercentage: 1.0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onHover: PerformanceUtils.throttle((event, chartElement) => {
                    event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                }, TIMING.HOVER_THROTTLE),
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
                            label: (context) => `${context.parsed.y} tons`
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
                // ИЗМЕНЕНИЕ: Порядок лейблов изменен на обратный
                labels: ['2022', '2023', '2024'],
                datasets: [{
                    label: 'Cubic Meters',
                    // ИЗМЕНЕНИЕ: Порядок данных изменен на обратный
                    data: [82045, 65895, 55531],
                    // ИЗМЕНЕНИЕ: Порядок цветов изменен на обратный
                    backgroundColor: ['#0B429C', '#16ADFE', '#24D2B3'],
                    // ИЗМЕНЕНИЕ: Порядок цветов при наведении изменен на обратный
                    hoverBackgroundColor: ['#1E5AAF', '#49C0FF', '#50E0C4'],
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
                            label: (ctx) => `${ctx.parsed.y.toLocaleString()} m³`
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
                onHover: PerformanceUtils.throttle((e, el) => {
                    e.native.target.style.cursor = el[0] ? 'pointer' : 'default';
                }, TIMING.HOVER_THROTTLE)
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
                // ИЗМЕНЕНИЕ: Порядок лейблов изменен на обратный
                labels: ['2021', '2022', '2023', '2024'],
                datasets: [{
                    label: '%',
                    // ИЗМЕНЕНИЕ: Порядок данных изменен на обратный
                    data: [7, 8.4, 15, 17],
                    // ИЗМЕНЕНИЕ: Порядок цветов изменен на обратный
                    backgroundColor: [
                        '#182D72',
                        '#0B429C',
                        '#16ADFE',
                        '#24D2B3'
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
                onHover: PerformanceUtils.throttle((e, el) => {
                    e.native.target.style.cursor = el[0] ? 'pointer' : 'default';
                }, TIMING.HOVER_THROTTLE),
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
                    // LTR CHANGE: align text to the left of the bar end
                    ctx.textAlign = 'left';

                    ctx.textBaseline = 'middle';
                    // LTR CHANGE: position text to the right of the bar
                    ctx.fillText(value, datapoint.x + valuePadding, datapoint.y);

    
                    
                    ctx.font = `700 17px SimplerPro`;

                    ctx.fillStyle = '#ffffff';
                    // LTR CHANGE: align year text to the left
                    ctx.textAlign = 'left';

                    ctx.textBaseline = 'middle';
                    // LTR CHANGE: position year text from the left edge of the chart area
                    ctx.fillText(year, yearPadding, datapoint.y);

                });

    
                ctx.restore();

            }
        };

    
        new Chart(ctx, {

            type: 'bar',

            data: {

                labels: ['2023', '2024'],

                datasets: [{
                    // LTR CHANGE: Translated label
                    label: 'Amount',

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
                        // LTR CHANGE: reverse set to false for LTR
                        reverse: false,

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
        // Анимация процентов останется для всех устройств
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

        if (isMobileResolution()) {
            // --- ЛОГИКА ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ/НИЗКОГО РАЗРЕШЕНИЯ: ЗАМЕНА CANVAS НА IMG ---
            const chartWrappers = document.querySelectorAll('.recommendation__chart-wrapper');
            
            chartWrappers.forEach(wrapper => {
                const canvas = wrapper.querySelector('canvas');
                if (!canvas) return;

                const img = document.createElement('img');
                img.classList.add('recommendation__chart-image'); 

                // Определяем, какую картинку использовать, на основе ID канваса
                if (canvas.id === 'recommendationChart2024') {
                    img.src = 'img/graph-1.png'; 
                } else if (canvas.id === 'recommendationChart2023') {
                    img.src = 'img/graph-2.png'; 
                }

                // Заменяем canvas на изображение
                canvas.parentNode.replaceChild(img, canvas);
            });

            // Hide the labels that are typically drawn by Chart.js
            document.querySelectorAll('.recommendation__chart-label, .recommendation__chart-year').forEach(el => {
                el.style.display = 'none';
            });

        } else {
            // --- СУЩЕСТВУЮЩАЯ ЛОГИКА ДЛЯ ВСЕХ ОСТАЛЬНЫХ УСТРОЙСТВ ---
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

            requestAnimationFrame(() => {
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
            });
        }
        
        // Запускаем анимацию процентов независимо от типа устройства
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

            link.addEventListener('click', PerformanceUtils.debounce(() => {

                const targetId = link.dataset.tab; 



                tabLinks.forEach(item => item.classList.remove('community-impact__tab-link--active'));

                tabPanels.forEach(panel => panel.classList.remove('community-impact__tab-panel--active'));

                
                link.classList.add('community-impact__tab-link--active');

                
                
                const targetPanel = document.getElementById(targetId);

                if (targetPanel) {

                    targetPanel.classList.add('community-impact__tab-panel--active');

                }

            }, TIMING.CLICK_DEBOUNCE));

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

    /* Scroll to Top Button */
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        const toggleScrollButton = PerformanceUtils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const showThreshold = 300; // Show after scrolling 300px
            
            if (scrollTop > showThreshold) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }, TIMING.SCROLL_THROTTLE);

        // Smooth scroll to top functionality
        const scrollToTop = () => {
            const scrollStep = -window.scrollY / (500 / 15); // 500ms duration
            const scrollInterval = setInterval(() => {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        };

        // Alternative smooth scroll (modern browsers)
        const smoothScrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        // Event listeners
        window.addEventListener('scroll', toggleScrollButton);
        scrollToTopBtn.addEventListener('click', PerformanceUtils.debounce(() => {
            // Use modern smooth scroll if supported, fallback to custom animation
            if ('scrollBehavior' in document.documentElement.style) {
                smoothScrollToTop();
            } else {
                scrollToTop();
            }
        }, TIMING.CLICK_DEBOUNCE));

        // Initialize button state
        toggleScrollButton();
    }

    /* Performance Monitoring (Development) */
    if (typeof console !== 'undefined' && console.info) {
        console.info('🚀 Performance optimizations active:', {
            'Chart hover throttling': `${TIMING.HOVER_THROTTLE}ms`,
            'Tab click debouncing': `${TIMING.CLICK_DEBOUNCE}ms`,
            'Scroll to top throttling': `${TIMING.SCROLL_THROTTLE}ms`,
            'Dynamic image paths': 'Auto-fixed for any version',
            'Lottie listener optimization': 'Enabled',
            'Intersection observers': 'Built-in throttling'
        });
    }

});