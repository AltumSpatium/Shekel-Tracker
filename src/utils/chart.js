import Chart from 'chart.js';
import moment from 'moment';

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

const COLORS = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
];

function createChart(args) {
    const {
        from, period, accounts, startDate, endDate,
        data, accountNames,
    } = args;
    let chartData = data.slice();
    if (!from || !period || !accounts.length) {
        return;
    }

    document.getElementById('chart').innerHTML = '';
    document.getElementById('chart').innerHTML = '<canvas id="canvas"></canvas>';

    const chartCanvas = document.getElementById('canvas').getContext('2d');

    const todayDate = moment();

    chartData = chartData.filter(record => accounts.includes(record.account));

    switch (period) {
        case 'This month': {
            const startDay = todayDate.startOf('month').format('YYYY/MM/DD');
            const endDay = todayDate.endOf('month').format('YYYY/MM/DD');
            chartData = chartData.filter(record => record.date >= startDay && record.date <= endDay);
            break;
        }
        case 'This week': {
            const startDay = todayDate.startOf('week').format('YYYY/MM/DD');
            const endDay = todayDate.endOf('week').format('YYYY/MM/DD');
            chartData = chartData.filter(record => record.date >= startDay && record.date <= endDay);
            break;
        }
        case 'Date range': {
            chartData = chartData.filter(record => record.date >= startDate && record.date <= endDate);
            break;
        }
        case 'All time':
        default: {
            break;
        }
    }

    if (!chartData.length) {
        return;
    }

    switch (from) {
        case 'Incomes': {
            const dates = chartData.map(record => record.date.slice(0, 7))
                .filter((item, index, arr) => arr.indexOf(item) === index)
                .sort();


            const incomes = {};
            chartData.forEach(record => {
                const acc = record.account;
                const dateIndex = dates.indexOf(record.date.slice(0, 7));
                if (!incomes[acc]) {
                    incomes[acc] = [];
                }
                const newValue = (incomes[acc][dateIndex] || 0) + +record.money;
                incomes[acc][dateIndex] = newValue;
            });
            const accounts = Object.keys(incomes);

            const chart = new Chart(chartCanvas, {
                type: 'bar',
                data: {
                    labels: dates,
                    datasets: accounts.map((acc, i) => ({
                        label: accountNames.find(account => account.id === acc).title,
                        data: incomes[acc],
                        backgroundColor: COLORS[i],
                        borderWidth: 1,
                    }))
                },
                options: {
                    scales: {
                        yAxes: [{
                            stacked: true,
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            stacked: true,
                            ticks: {
                                beginAtZero: true
                            }
                        }]

                    },
                }
            });
            document.getElementById('canvas').onclick = function (evt) {
                var activePoints = chart.getElementsAtEvent(evt);
                console.log(activePoints, activePoints[0], activePoints[1])
                if (activePoints.length > 0) {
                    console.log(activePoints[0]._view.datasetLabel)
                }
            }
            break;
        }

        case 'Expenses': {
            const expenses = {};
            chartData.forEach(record => {
                const newValue = (expenses[record.category] || 0) + +record.money;
                expenses[record.category] = newValue;
            });

            const chart = new Chart(chartCanvas, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(expenses),
                    datasets: [{
                        data: Object.values(expenses).map(val => val.toFixed(2)),
                        backgroundColor: COLORS,
                    }]
                },
                options: {
                    center: {
                        text: Object.values(expenses).reduce((acc, i) => acc + i, 0).toFixed(2) + ' USD'
                    },
                    onClick: function (evt, elements) {
                        document.getElementById('canvas').onclick = function (evt) {
                            var activePoints = chart.getElementsAtEvent(evt);
                            if (activePoints.length) {
                                const categoryName = chart.data.labels[activePoints[0]._index];
                                console.log('categoryName', categoryName);
                            }
                        }
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