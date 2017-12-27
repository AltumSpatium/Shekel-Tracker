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