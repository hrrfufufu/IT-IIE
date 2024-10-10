function setup() 
{
  createCanvas(1024, 576);
}

function draw() 
{
  //sky
  background("#4f799c"); 

  //grass
  noStroke();
  fill("#65804b");
  rect(0, 400, 1024, 400);
  
  //cloud
  fill("#c1bfc7");
  rect(150, 120, 300, 90, 100);
  arc(270, 120, 130, 120, PI, 0);
  arc(350, 120, 100, 90, PI, 0);

  //mountain
  fill("#484759");
  triangle(650, 100, 850, 400, 450, 400);
  fill("#9ca1b8");
  triangle(650, 100, 750, 250, 600, 175);

  //tree
  stroke("#4a3c35");
  strokeWeight(50);
  line(775, 380, 775, 520);
  noStroke();
  fill("#48523d");
  ellipse(775, 310, 300, 225);

  //canyon
  fill("#4f799c");
  quad(300, 400, 120, 400, 140, 576, 280, 576);
  fill("#968777");
  triangle(120, 400, 120, 576, 140, 576); //left
  triangle(300, 400, 280, 576, 300, 576); //right

  //key
  noStroke();
  fill("#dbb621");
  circle(550, 500, 50);
  stroke("#dbb621");
  strokeWeight(15);
  line(550, 500, 550, 420);
  line(550, 430, 580, 430);
  line(550, 455, 570, 455);
  noStroke();
  fill("#65804b");
  circle(550, 500, 25);

}

