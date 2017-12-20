import Chart from 'chart.js';

Chart.pluginService.register({
    beforeDraw: function (chart) {
        if (chart.config.options.center) {
            const ctx = chart.chart.ctx;
            const fontStyle = 'Arial';
            const txt = chart.config.options.center.text;
            const color = '#36A2EB';
            const sidePadding = 20;
            const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
            ctx.font = '30px ' + fontStyle;
            const stringWidth = ctx.measureText(txt).width;
            const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
            const widthRatio = elementWidth / stringWidth;
            const newFontSize = Math.floor(30 * widthRatio);
            const elementHeight = (chart.innerRadius * 2);
            const fontSizeToUse = Math.min(newFontSize, elementHeight);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + 'px ' + fontStyle;
            ctx.fillStyle = color;
            ctx.fillText(txt, centerX, centerY);
        }
    }
});

function createChart(state) {
    const { from, period, data } = state;
    if (!from || !period) {
        return;
    }

    document.getElementById('chart').innerHTML = '';
    document.getElementById('chart').innerHTML = '<canvas id="canvas"></canvas>';

    const ctx = document.getElementById('canvas').getContext('2d');

    switch (from) {
        case 'Incomes': {
            const money = data.map(record => record.money);
            const dates = data.map(record => record.date);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'name',
                        data: money,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            categoryPercentage: 1.0,
                            barPercentage: 1.0,
                        }],
                        yAxes: [{
                            ticks: {
                                max: Math.max.apply(null, money) * 1.5,
                                beginAtZero: true,
                            },
                        }]
                    }
                }
            });
            break;
        }

        case 'Expenses': {
            const expenses = {};
            data.forEach(record => {
                const newValue = (expenses[record.category] || 0) + +record.money;
                expenses[record.category] = newValue;
            });

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(expenses),
                    datasets: [{
                        data: Object.values(expenses).map(val => val.toFixed(2)),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(255, 159, 64, 0.5)',
                        ],
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            gridLines: { display: false },
                            ticks: { display: false },
                        }],
                        yAxes: [{
                            gridLines: { display: false },
                            ticks: { display: false },
                        }]
                    },
                    center: {
                        text: Object.values(expenses).reduce((acc, i) => acc + i, 0).toFixed(2) + ' USD'
                    }
                }
            });
            break;
        }

        default: {
            break;
        }
    }
}

export default createChart;