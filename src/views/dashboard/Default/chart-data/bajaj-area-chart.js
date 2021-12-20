// ===========================|| DASHBOARD - BAJAJ AREA CHART ||=========================== //

const chartData = {
    type: 'area',
    height: 95,
    options: {
        chart: {
            id: 'support-chart',
            sparkline: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 1
        },
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: () => 'Orders '
                }
            },
            marker: {
                show: false
            }
        }
    },
    series: [
        {
            data: [1, 2, 3, 2, 4, 8, 3]
        }
    ]
};

export default chartData;
