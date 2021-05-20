// Frank Poth 04/03/2018

/* Changes:
1. Removed the TileSheet class from part 3 and added the Game.World.TileSet class to Game.
2. Changed the drawMap function to be as generic as posible.
3. Changed the drawPlayer function to the drawObject function. */

const Display = function(canvas) {

  this.buffer  = document.createElement("canvas").getContext("2d"),
  this.context = canvas.getContext("2d");

  /* This function draws the map to the buffer. */

  this.drawBackground = function(img) {
    this.buffer.drawImage(img, 0,0, img.width, img.height,0,0, img.width, img.height);
  };

  this.drawCoinBins = function(image_columns, coins_map, coin_bins, tile_size){
      let j = 0
      for (let index = 0; index < coins_map.length; index++) {
        let value = coins_map[index]
        if(value == 505)
        {
          let x_text =           (index % image_columns) * tile_size;
          let y_text = Math.floor(index / image_columns) * tile_size;
          let s = "x" + coin_bins[j]
          j++
          drawBinLabels(s, x_text+2, y_text-1, this.buffer)
        }
      }
  }

  this.drawMap = function(image, image_columns, map, map_columns, tile_size) {

    for (let index = map.length - 1; index > -1; -- index) {

      let value         = map[index];
      let source_x      =           (value % image_columns) * tile_size;
      let source_y      = Math.floor(value / image_columns) * tile_size;
      let destination_x =           (index % map_columns  ) * tile_size;
      let destination_y = Math.floor(index / map_columns  ) * tile_size;

      this.buffer.drawImage(image, source_x, source_y, tile_size, tile_size, destination_x, destination_y, tile_size, tile_size);

    }

  };

  this.drawObject = function(image, source_x, source_y, destination_x, destination_y, width, height) {

    this.buffer.drawImage(image, source_x, source_y, width, height, Math.round(destination_x), Math.round(destination_y), width, height);

  };

  this.resize = function(width, height, height_width_ratio) {

    if (height / width > height_width_ratio) {

      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width  = width;

    } else {

      this.context.canvas.height = height;
      this.context.canvas.width  = height / height_width_ratio;

    }

    this.context.imageSmoothingEnabled = false;

  };

  this.toggleModal= function(bin_data){
    console.log("Here")
    $('#pie-chart-modal').modal('toggle');
 
    const open = $('#pie-chart-modal').is(':visible')
    if((document.getElementById("pie-chart-container").childElementCount) > 0){
      this.removePieChart()
    }

    if(open){
        this.createPieChart(bin_data);
    }
    else{
        this.removePieChart();
    }
  }

  this.createPieChart = function(bin_data){
    if(bin_data.every(function(d) { return d == 0 }))
    {
      document.getElementById("pie-chart-container").innerHTML = "<div>0 Coins Deposited!<div>"
      return;
    }
    this.addPieChartCanvas()

    var ctx = document.getElementById('pie-chart-canvas').getContext('2d');

    const labels = [
      'Econ. Assitance to needy in the World',
      'Econ. Assitance to needy in the US',
      'US Anti-Terrorism',
      'Health Care',
      'Rebuilding Highways, Bridges, Roads',
      'Environmental Protection',
      'Medicare',
      'Eduction',
      'Gov\'t Assist. To Unemployed',
      'Scientific Research',
      'Military Defense',
      'Social Security',
      'Veterans Benefits'

    ];
    const data = {
      labels: labels,
      datasets: [{
        label: 'Current Economic Distribution',
        data: bin_data,
        backgroundColor: [
          '#FFDAB9', //Peach
          '#00FFFF', //Aqua
          '#ADFF2F', //Green Yellow
          '#FFFF00', //yellow
          '#DC143C', //Light red
          '#8A2BE2', //Light purple
          '#8B008B', //Dark Magenta
          '#FF1493', //Deep Pink
          '#FF8C00', //Dark Orange
          '#663300', //Brown
          '#191970', //Dark Blue
          '#006400', //Dark green
          '#A9A9A9', //Dark Grey

        ],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'pie',
      data,
      options: {
        legend: {
            labels: {
                fontColor: 'white',
            },
            
            position: 'left',
            align: 'end'
        }
      }     
    };

    new Chart(
      ctx,
      config
    );

  }

  this.addPieChartCanvas = function(){
    var pieChartCanvas = document.createElement("canvas");
    pieChartCanvas.id = "pie-chart-canvas"
    pieChartCanvas.width = "400"
    pieChartCanvas.height = "275"
    document.getElementById("pie-chart-container").appendChild(pieChartCanvas)
  }

  this.removePieChart = function(data){
    canvas_container = document.getElementById("pie-chart-container")
    removeAllChildNodes(canvas_container)
  }


};

Display.prototype = {

  constructor : Display,
  
  render:function() { 
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); 
  },

};


function drawBinLabels(str, x, y, ctx){
  for(var i = 0; i <= str.length; ++i){
      var ch = str.charAt(i);
      if(i == 0){
        ctx.fillStyle = "darkblue"
        ctx.font = 'bolder 13px sans-serif';
      }
      else{
        ctx.fillStyle = "darkblue"
        ctx.font = 'bolder 13px sans-serif';
      }
      ctx.fillText(ch, x, y);
      x += ctx.measureText(ch).width;
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}