document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Анимация иконок Lottie по ховеру ---
    const animatedItems = document.querySelectorAll('.feature-item, .goal-item');
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


    // --- 2. Инициализация слайдера Swiper ---
    if (document.querySelector('.community-swiper')) {
        new Swiper('.community-swiper', {
            direction: 'horizontal',
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
        });
    }

    // --- 3. Функции для всех анимаций, запускаемых по скроллу ---

    /**
     * Форматирует число с разделителем‑запятой.
     * Пример: 55531 → "55,531"
     */
    const formatNumber = (num) => {
        // Приводим к числу (на случай, если придёт строка)
        const n = Number(num);
        // Если это не число – просто возвращаем оригинал
        if (Number.isNaN(n)) return num;
        // Intl.NumberFormat автоматически ставит запятые для en‑US.
        // Если нужен другой локаль, замените 'en-US' на нужную.
        return new Intl.NumberFormat('en-US').format(n);
    };

    // Функция для создания кастомного графика отходов
    const createCustomWasteChart = () => {
        const ctx = document.getElementById('wasteChartCustom');
        if (!ctx) return;

        // Кастомный плагин для отрисовки лейблов внутри и снаружи столбцов
        const customLabelsPlugin = {
            id: 'customLabels',
            afterDatasetsDraw: (chart) => {
                const { ctx, data } = chart;
                ctx.save();
                
                chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
                    const value = data.datasets[0].data[index];
                    const year = data.labels[index];

                    // --- 1. Рисуем значение НАД столбцом (Изменение #3: обновлен шрифт) ---
                    ctx.font = '700 21px SimplerPro';
                    ctx.fillStyle = '#000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(value, datapoint.x, datapoint.y - 6);

                    // --- 2. Рисуем год ВНУТРИ столбца внизу (Изменение #2: обновлен шрифт) ---
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
                    // --- Изменение #4: цвет при наведении для интерактивности ---
                    hoverBackgroundColor: ['#50E0C4', '#49C0FF', '#1E5AAF'],
                    // --- Изменение #1: столбцы прилегают друг к другу и занимают все место ---
                    barPercentage: 1.0, 
                    categoryPercentage: 1.0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                // --- Изменение #4: включаем интерактивность ---
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    // --- Изменение #4: настраиваем всплывающие подсказки ---
                    tooltip: {
                        enabled: true, 
                        displayColors: false, // Убираем квадратик с цветом
                        backgroundColor: '#010635',
                        titleAlign: 'center',
                        bodyAlign: 'center',
                        callbacks: {
                            title: () => null, // Убираем заголовок (год)
                            label: (context) => {
                            return `${context.parsed.y} טונות`; // Форматируем текст подсказки
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

    // ------------------------------------------------------------------
    // Water‑consumption chart (2022‑2024)
    // ------------------------------------------------------------------
    const createWaterChart = () => {
        const ctx = document.getElementById('waterChart');
        if (!ctx) return;               // safety guard

        // Custom plugin – draws the value above each bar (same as waste chart)
        const labelPlugin = {
            id: 'waterLabels',
            afterDatasetsDraw: (chart) => {
                const { ctx, data } = chart;
                ctx.save();

                chart.getDatasetMeta(0).data.forEach((bar, i) => {
                    const rawValue = data.datasets[0].data[i];      // 55531, 65895, …
                    const value    = formatNumber(rawValue);        // "55,531"
                    const year     = data.labels[i];

                    // ── Значение над столбцом
                    ctx.font = '700 21px SimplerPro';
                    ctx.fillStyle = '#000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(value, bar.x, bar.y - 6);

                    // ── Год внутри столбца
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
                    backgroundColor: ['#24D2B3', '#16ADFE', '#0B429C'],   // same palette as waste chart
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

    // Функция для анимации круговых диаграмм
    const animateProgress = (element) => {
        const circle = element.querySelector('.progress-ring-fg');
        const percentLabel = element.querySelector('.progress-percent');
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
        if (!canvas) return;                         // элемент не найден

        // Уничтожаем предыдущий экземпляр (если график уже был построен)
        if (canvas._chartInstance) {
            canvas._chartInstance.destroy();
        }

        /* -------------------------------------------------------------
        Плагин, рисующий подписи над столбцами (большие проценты)
        ------------------------------------------------------------- */
        const percentLabelPlugin = {
            id: 'percentLabels',
            afterDatasetsDraw: (chart) => {
                const { ctx, data } = chart;
                ctx.save();

                chart.getDatasetMeta(0).data.forEach((bar, i) => {
                    const rawValue = data.datasets[0].data[i];   // уже в % (7, 8.4 …)
                    const value    = `${rawValue}%`;
                    const year     = data.labels[i];

                    // ----- Процент над столбцом (30 px, белый) -----
                    ctx.font = '700 30px SimplerPro';
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(value, bar.x, bar.y - 6);

                    // ----- Год внутри столбца (17 px, белый) -----
                    ctx.font = '700 17px SimplerPro';
                    ctx.fillStyle = '#fff';
                    ctx.fillText(year, bar.x, bar.base - 10);
                });

                ctx.restore();
            }
        };

        /* -------------------------------------------------------------
        Данные и конфигурация графика
        ------------------------------------------------------------- */
        const chart = new Chart(canvas, {
            type: 'bar',
            data: {
                // Обратный порядок: 2024 → 2021
                labels: ['2024', '2023', '2022', '2021'],
                datasets: [{
                    label: '%',
                    // Данные тоже в обратном порядке, чтобы они совпали с годами
                    data: [17, 15, 8.4, 7],
                    backgroundColor: [
                        '#24D2B3',   // 2024
                        '#16ADFE',   // 2023
                        '#0B429C',   // 2022
                        '#182D72'    // 2021
                    ],
                    borderRadius: 0,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                // Отключаем легенду – она не нужна
                plugins: {
                    legend: { display: false },

                    // Обычный tooltip (можно оставить, если нужен)
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

                    // Наш плагин с большими процентами
                    percentLabels: {}
                },

                // Оси полностью скрыты (как в water‑chart)
                scales: {
                    x: { display: false },
                    y: {
                        display: false,
                        beginAtZero: true,
                        grace: '20%'          // небольшое пространство сверху
                    }
                },

                // Курсор «pointer» при наведении на столбец
                onHover: (e, el) => {
                    e.native.target.style.cursor = el[0] ? 'pointer' : 'default';
                },

                // Плавная анимация появления столбцов
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            },

            // Регистрация собственного плагина
            plugins: [percentLabelPlugin]
        });

        // Сохраняем ссылку, чтобы при следующем скролле можно было destroy()
        canvas._chartInstance = chart;
    };

    // Функция для графика Safety
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

    // Функция для ступенчатой анимации значков
    const animateScores = () => {
        document.querySelectorAll('.score-badge[data-year="2022"]').forEach(badge => {
            badge.classList.add('is-visible');
        });
        setTimeout(() => {
            document.querySelectorAll('.score-badge[data-year="2023"]').forEach(badge => {
                badge.classList.add('is-visible');
            });
        }, 800);
        setTimeout(() => {
            document.querySelectorAll('.score-badge[data-year="2024"]').forEach(badge => {
                badge.classList.add('is-visible');
            });
        }, 1600);
    };

    // НОВАЯ ФУНКЦИЯ для двойных кольцевых диаграмм
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

    const tabsContainer = document.querySelector('.community-tabs-section');
    if (tabsContainer) {
        const tabLinks = tabsContainer.querySelectorAll('.tab-link');
        const tabPanels = tabsContainer.querySelectorAll('.tab-panel');

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const targetId = link.dataset.tab;

                // Убираем active со всех ссылок и панелей
                tabLinks.forEach(item => item.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));

                // Добавляем active нужным элементам
                link.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }


    // --- Общий Intersection Observer для всех анимаций по скроллу ---
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
                    const circles = entry.target.querySelectorAll('.progress-circle');
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

    // --- Говорим наблюдателю следить за всеми анимируемыми секциями ---
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