import React from 'react';

const RadialChart = (props) => {

   const  options =  {
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: '45%',
                        },
                        dataLabels: {
                            value: {
                                show: false
                            }
                        }
                    },
                },
                colors: ['rgb(2, 164, 153)'],
                labels: ['']
            };
          const  series = [80];

  return (
         <ReactApexChart options={options} series={series} type="radialBar" height="143" />  
  );
}

export default RadialChart;