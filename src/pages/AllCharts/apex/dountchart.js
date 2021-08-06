    import React from 'react';
    import ReactApexChart from 'react-apexcharts';

    const dountchart = (props) => {
         const  series =  [44, 55, 41, 17, 15];
         const   options  = {
                labels: ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5"],
                colors: ["#34c38f", "#556ee6","#f46a6a", "#50a5f1", "#f1b44c"],
                legend: {
                    show: true,
                    position: 'bottom',
                    horizontalAlign: 'center',
                    verticalAlign: 'middle',
                    floating: false,
                    fontSize: '14px',
                    offsetX: 0,
                    offsetY: -10
                },
                responsive: [{
                    breakpoint: 600,
                    options: {
                        chart: {
                            height: 240
                        },
                        legend: {
                            show: false
                        },
                    }
                }]
              
              };
        

      return (
               <ReactApexChart options={options} series={series} type="donut" height="320" />
         
      );
    }

export default dountchart;