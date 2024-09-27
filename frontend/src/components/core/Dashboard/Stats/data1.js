export const pieChartData = {

    labels: ['Unsolved', 'Solved', 'Attempted', 'Partially Solved'],
    datasets: [
      {
        label: 'Challenges',
        data: [5, 13, 13, 13],
        backgroundColor: [
          'rgba(255, 99, 132, 0.9)',
          'rgba(54, 162, 235, 0.9)',
          'rgba(255, 206, 86, 0.9)',
          'rgba(75, 192, 192, 0.9)',
        ],
        borderWidth: 1,
      },
    ],

  };

  export const lineChartData = {
    labels: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    datasets: [
      {
        label: 'Rating',
        data: [12, 19, 3, 5, 2, 3, 3,2,2,1,0, 4, 5],
        borderColor: 'rgb(75, 192, 192)',
      },
    ],
  };