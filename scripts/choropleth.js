const svg = d3.select("#choropleth");
const width = svg.attr("width");
const height = svg.attr("height");
const margin = { top: 20, right: 20, bottom: 20, left:20};
const mapWidth = width - margin.left - margin.right;
const mapHeight = height - margin.top - margin.bottom;
const map = svg.append("g")
                .attr("transform","translate("+margin.left+","+margin.top+")")
                .attr('pointer-events', 'all');
  
const loadData = async function() {
    var usa = await d3.json("./data/counties-10m.json");
    //Broadband data courtesy of Amit Misra, Allen Kim, John Kahan, Juan M. Lavista Ferres at Microsoft Research. See https://github.com/microsoft/USBroadbandUsagePercentages
    var broadband = await d3.csv("./data/broadband_data.csv");
    //Voter tunrout data calculated using 2016 presidential election data from the MIT Election Lab and US Census population surveys. 
    //MIT Election Data and Science Lab, 2018, "County Presidential Election Returns 2000-2016", https://doi.org/10.7910/DVN/VOQCHQ, Harvard Dataverse, V6, UNF:6:ZZe1xuZ5H2l4NUiSRcRf8Q== [fileUNF] 
    var voterTurnout = await d3.csv("./data/voterturnout.csv");
    var counties = topojson.feature(usa, usa.objects.counties);
    var states = topojson.feature(usa, usa.objects.states);
    var statesMesh = topojson.mesh(usa, usa.objects.states);
    var countiesMesh = topojson.mesh(usa, usa.objects.counties);
    projectionUSA = d3.geoAlbersUsa().fitSize([mapWidth, mapHeight], states);
    path = d3.geoPath().projection(projectionUSA);

    var broadbandByID = {};

    broadband.forEach(function(d) {
        broadbandByID[d.ID] = +d.BROADBAND_USAGE;
    });

    var turnoutByID = {};

    voterTurnout.forEach(function(d) {
        turnoutByID[d.ID] = +d.TURNOUT;
    });

    var nameByID = {};

    voterTurnout.forEach(function(d) {
      nameByID[d.ID] = d.GEONAME;
    });

    let xArray = [];
    for (var key in broadbandByID) {
        let value = broadbandByID[key];
        xArray.push(value);
    }

    let yArray = [];
    for (var key in turnoutByID) {
        let value = turnoutByID[key];
        yArray.push(value);
    }

    //Credit to Joshua Stevens for his color palette: https://www.joshuastevens.net/cartography/make-a-bivariate-choropleth-map/
    colors =  [
        "#e8e8e8", "#ace4e4", "#5ac8c8",
        "#dfb0d6", "#a5add3", "#5698b9", 
        "#be64ac", "#8c62aa", "#3b4994"
    ]
    const xScale = d3.scaleQuantile(xArray, [0, 1, 2])
    const yScale = d3.scaleQuantile(yArray, [0, 1, 2])
            
    function getColor(id) {
        x = broadbandByID[id]
        y = turnoutByID[id]
        return colors[yScale(y) + xScale(x) * 3];
    }

    map.selectAll("path.counties").data(counties.features)
        .join("path")
        .attr("class", "county")
        .attr("note", d => d.id)
        .attr("d", path)
        .style("fill", d => getColor(d.id))
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);    
      

    map.append('rect')
        .attr('x', 825)
        .attr('y', 380)
        .attr('width', 25)
        .attr('height', 25)
        .attr('stroke', 'black')
        .attr('fill', '#e8e8e8');
              
    map.append('rect')
        .attr('x', 850)
        .attr('y', 380)
        .attr('width', 25)
        .attr('height', 25)
        .attr('stroke', 'black')
        .attr('fill', '#ace4e4');
                          
    map.append('rect')
        .attr('x', 875)
        .attr('y', 380)
        .attr('width', 25)
        .attr('height', 25)
        .attr('stroke', 'black')
        .attr('fill', '#5ac8c8');
              
    map.append('rect')
        .attr('x', 825)
        .attr('y', 405)
        .attr('width', 25)
        .attr('height', 25)
        .attr('stroke', 'black')
        .attr('fill', '#dfb0d6');
              
    map.append('rect')
        .attr('x', 850)
        .attr('y', 405)
        .attr('width', 25)
        .attr('height', 25)
        .attr('stroke', 'black')
        .attr('fill', '#a5add3');
              
    map.append('rect')
        .attr('x', 875)
        .attr('y', 405)
        .attr('width', 25)
        .attr('height', 25)
        .attr('stroke', 'black')
        .attr('fill', '#5698b9');
              
    map.append('rect')
        .attr('x', 825)
        .attr('y', 430)
        .attr('width', 25)
        .attr('height', 25)
        .attr('stroke', 'black')
        .attr('fill', '#be64ac');
                             
    map.append('rect')
        .attr('x', 850)
        .attr('y', 430)
        .attr('width', 25)
        .attr('height', 25)
        .attr('stroke', 'black')
        .attr('fill', '#8c62aa');
              
    map.append('rect')
        .attr('x', 875)
        .attr('y', 430)
        .attr('width', 25)
        .attr('height', 25)
        .attr('stroke', 'black')
        .attr('fill', '#3b4994');
    
    //Legend text
    map.append('text')
         .attr("transform", "translate(825,373)")
         .text("Greater Voter Turnout >")
         .style("font-size", "10px");

    map.append('text')
         .attr("transform", "translate(818,500) rotate (270)")
         .text("< Greater Broadband Use")
         .style("text-anchor", "start")
         .style("text-align", "right")
         .style("font-size", "10px");

    //Mouseover text

    map.append("text")
       .text("")
       .attr("x", 525)
       .attr("y", 500)
       .attr("id", "legend_name")
       .style("font-size", "10pt");

    map.append("text")
         .text("")
         .attr("x", 525)
         .attr("y", 525)
         .attr("id", "legend_top")
         .style("font-size", "10pt");


    map.append("text")
         .text("")
         .attr("x", 525)
         .attr("y", 550)
         .attr("id", "legend_bot")
         .style("font-size", "10pt");

 
    function mouseover(d, i) {
      map.select("#legend_name")
         .text(nameByID[d.id]);

       map.select("#legend_top")
          .text("Broadband Penetration: " + broadbandByID[d.id] + "%");

       map.select("#legend_bot")
          .text("Voter Turnout: " + turnoutByID[d.id] + "%");
      
      map.selectAll(".county")
         .attr("opacity", 0.6);

      d3.select(this)
         .attr("opacity", 1)
         .style("stroke-width", "2px");
    }
 
    function mouseout(d, i) {
      map.select("#legend_name")
         .text("");

      map.select("#legend_top")
          .text("");

      map.select("#legend_bot")
         .text("");
            
      map.selectAll(".county")
         .attr("opacity", 1);

      d3.select(this)
        .style("stroke-width", "1px");
    }
  };
  loadData();
        