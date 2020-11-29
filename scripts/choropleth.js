const svg = d3.select("#choropleth");
const width = svg.attr("width");
const height = svg.attr("height");
const margin = { top: 20, right: 20, bottom: 20, left:20};
const mapWidth = width - margin.left - margin.right;
const mapHeight = height - margin.top - margin.bottom;
const map = svg.append("g")
                .attr("transform","translate("+margin.left+","+margin.top+")");
  
const loadData = async function() {
    var usa = await d3.json("./data/counties-10m.json");
    var broadband = await d3.csv("./data/broadband_data.csv");
    var voterTurnout = await d3.csv("./data/voterturnout.csv");
    console.log(usa);
    var counties = topojson.feature(usa, usa.objects.counties);
    var states = topojson.feature(usa, usa.objects.states);
    var statesMesh = topojson.mesh(usa, usa.objects.states);
    var countiesMesh = topojson.mesh(usa, usa.objects.counties);
    projectionUSA = d3.geoAlbersUsa().fitSize([mapWidth, mapHeight], states);
    path = d3.geoPath().projection(projectionUSA);
            console.log(states);
            console.log(statesMesh)

    var broadbandByID = {};

    broadband.forEach(function(d) {
        broadbandByID[d.ID] = +d.BROADBAND_USAGE;
    });

    var turnoutByID = {};

    voterTurnout.forEach(function(d) {
        turnoutByID[d.ID] = +d.TURNOUT;
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
    const xScale = d3.scaleQuantile(xArray, [2, 1, 0])
    const yScale = d3.scaleQuantile(yArray, [2, 1 ,0])
            
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
        .style("fill", d => getColor(d.id));
            
            map.append("path").datum(statesMesh)
                .attr("class","outline")
                .attr("d", path)
                .style("stroke-width", "2px"); 

            map.append("path").datum(countiesMesh)
               .attr("class","outline")
               .attr("d", path); 

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
                        };
                
                map.append('text')
                   .attr("transform", "translate(825,373)")
                   .text("Lower Voter Turnout >")
                   .style("font-size", "9px")

                map.append('text')
                   .attr("transform", "translate(818,460) rotate (270)")
                   .text("< Lower Broadband")
                   .style("text-anchor", "start")
                   .style("font-size", "10px")
        loadData();
