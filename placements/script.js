const myData = [
    { id: 1, region: '2022', value: 10.47 },
    { id: 2, region: '2021', value: 7.48 },
    { id: 3, region: '2020', value: 7.12 },
    { id: 4, region: '2019', value: 6.16 }
  ];
  
  const margins = { horizontal: 20, vertical: 20 };
  const chartWidth = 500 - (margins.horizontal * 2);
  const chartHeight = 400 - (margins.vertical * 2);
  
  const chartContainer = d3
      .select('svg')
      .attr('width', chartWidth + (margins.horizontal * 2))
      .attr('height', chartHeight + (margins.vertical * 2));
  
  const chart = chartContainer.append('g');
  
  function renderChart(chartData) {
    const x = d3
      .scaleBand()
      .rangeRound([margins.horizontal * 2, chartWidth])
      .padding(0.1)
      .domain(chartData.map(d => d.region));
    const y = d3
      .scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(chartData, d => d.value) + 3]);
      
    chart.selectAll('g').remove();
    
    chart
      .append('g')
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr('transform', `translate(0, ${chartHeight + margins.vertical})`)
      .attr('color', '#4f009e');
    chart
      .append('g')
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .attr('transform', `translate(${margins.horizontal}, 0)`)
      .attr('color', '#4f009e');
    
    // chart
    //   .selectAll('.bar')
    //   .data(chartData, d => d.id)
    //   .exit()
    //   .remove();
    
    chart.selectAll('.bar').remove();
  
    chart
      .selectAll('.bar')
      .data(chartData, d => d.id)
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('width', x.bandwidth())
      .attr('height', d => chartHeight - y(d.value))
      .attr('x', d => x(d.region))
      .attr('y', d => y(d.value));
    
    // chart
    //   .selectAll('.label')
    //   .data(chartData, d => d.id)
    //   .exit()
    //   .remove();
  
    chart.selectAll('.label').remove();
    
    chart
      .selectAll('.label')
      .data(chartData, d => d.id)
      .enter()
      .append('text')
      .text(d => d.value)
      .attr('x', d => x(d.region) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 20)
      .attr('text-anchor', 'middle')
      .classed('label', true);
  }
  
  let unselectedIds = [];
  
  const listItems = d3
    .select('#data')
    .select('ul')
    .selectAll('li')
    .data(myData)
    .enter()
    .append('li');
  
  listItems
    .append('span')
    .text(d => d.region);
  
  listItems
    .append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .on('change', (data) => {
      if (unselectedIds.indexOf(data.id) === -1) {
        unselectedIds.push(data.id);
      } else {
        unselectedIds = unselectedIds.filter(id => id !== data.id);
      }
    
      const newData = myData.filter(d => !unselectedIds.includes(d.id));
    
      renderChart(newData);
    });
  
  renderChart(myData);