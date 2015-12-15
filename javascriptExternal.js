//Global variables 
var canvas, canvas_context1, UserColor, drawingDiv, drawingDiv_style, mouse, saveButton, textCanvas;

//Setup for the ability to upload an image
window.onload = function() {
	var fileUpload = document.getElementById('fileUpload'); //get the input tag button
	//attach an on change event to the button and call the handleImage function below
	fileUpload.addEventListener('change', handleImage, false); 
	
	//Handel in the function ? get the canvas
	 //canvas = document.getElementById('#drawingCanvas');// get the canvas element
	 //canvas_context2 = canvas.getContext('2d');// returns the 2d context object
	
	//Keyboard events
	document.addEventListener("keydown",keyDownHandler, false);	
	//document.addEventListener("keyup",keyUpHandler, false);	
	 
	 //Right side div
	textCanvas = document.getElementById("textCanvas");
	textCanvas_context = textCanvas.getContext("2d");
}

//main drawing function
function FreeStyleDrawing(obj)  {
	//select the canvas with ID drawingCanvas to a variable to work with.querySelector() method returns the first element that matches a specified CSS selector 
	canvas = document.querySelector('#drawingCanvas');
	canvas_context1 = canvas.getContext('2d');
	//get user selected color
	UserColor = obj.id;
		
	//select the div with the ID 
	drawingDiv = document.querySelector('#drawingDiv');
	//dynamically get the size of the div container. Window.getComputedStyle() method gives the values of all the CSS properties 
	drawingDiv_style = getComputedStyle(drawingDiv);
	//declare variable to store the mouse X and Y start position on the canvas 
	mouse = {x: 0, y: 0};
	 
	//Get the moving mouse position 
	canvas.addEventListener('mousemove', function(e) {
		//e.pageX get the X position of the mouse on the page (Left to Right)
		//this.offsetLeft get the canvas upper left corner 
		mouse.x = e.pageX - this.offsetLeft; // get the mouse positions relative to the canvas. 
		//e.pageX get the Y position of the mouse on the page (Top to Bottom)
		//this.offsetTop get the canvas upper top corner 
		mouse.y = e.pageY - this.offsetTop;  //get the mouse positions relative to the canvas. 
	}, false);
	
	/* Freestyle Drawing on above canvas */
	//set the property of the 2d canvas context 
	canvas_context1.lineWidth = 3;
	//create a rounded corner when the two lines meet: bevel or miter are other option
	canvas_context1.lineJoin = 'round';
	//Draw a line with rounded end caps:The value "round" and "square" make the lines slightly longer.
	canvas_context1.lineCap = 'round';
	//assign the color the user selected 
	canvas_context1.strokeStyle = UserColor ;
	
	//handle the left mouse click event
	canvas.addEventListener('mousedown', function(e) {
			//The beginPath() method begins a path, or resets the current path.
			canvas_context1.beginPath();
			//Line FROM. This is the start of the line on mouse down. Pass in the X and Y value from above. The moveTo() method moves the path to the specified point in the canvas, without creating a line.
			canvas_context1.moveTo(mouse.x, mouse.y);
			//Since the mouse was left click and stayed press call the ondrawingCanvas function
			canvas.addEventListener('mousemove', ondrawingCanvas, false);
	}, false);
	 
	canvas.addEventListener('mouseup', function() {
			//the left mouse button was release and now we remove the mouse move event listener from the canvas
			canvas.removeEventListener('mousemove', ondrawingCanvas, false);
	}, false);
	 
	var ondrawingCanvas = function() {
			//Line TO create a "line" on every X and Y point as the mouse stayed pressed and user is moving it around
			canvas_context1.lineTo(mouse.x, mouse.y);
			//The stroke() method actually draw the line of the canvas
			canvas_context1.stroke();
	};
	
}
//--Clear canvas function--//
function ClearCanvas() {
    var msgBox = confirm("Please click OK to erase everything!");
    if (msgBox) {
        canvas_context1.clearRect(0, 0, canvas.width, canvas.height);
        //document.getElementById("canvasimg").style.display = "none";
    }
}
//Image Upload Button click handler after the setup above
function handleImage(e){
	var canvas = document.getElementById('drawingCanvas');// get the canvas element
	var canvas_context2 = canvas.getContext('2d');// returns the 2d context object

	//create a new instance of FileReader that read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read.
	var reader = new FileReader(); 
	//A handler for the load event. This event is triggered each time the reading operation is successfully completed.
	reader.onload = function(event){
		// Create new img element in the page
		var img = new Image();
		img.onload = function(){
			// image  has been loaded
			
			//to make the image size and the drawingCanvasing area the same size
			//canvas.width = img.width; //make the canvas width and image width equal 
			//canvas.height = img.height;  //make the canvas heigt and image width equal
			
			//The drawImage() method places the backdrop at the coordinate (0, 0), which is the top-left corner of the canvas.
			canvas_context2.drawImage(img,0,0);
		}
		// Set source path
		img.src = event.target.result;
	}
	//Starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.
	reader.readAsDataURL(e.target.files[0]);     
}

//Key Press Handlers
//------------
function keyDownHandler(event)
{
	//event.keyCode which is generated each time a key is pressed. 
	//String.fromCharCode(...) will take that number, and convert it into a meaningful form to us
	var keyPressed = String.fromCharCode(event.keyCode);
	//CLEAR Key
	if (keyPressed == "C")
	{	
		//test keyCode value for Clear	
		//alert("Clear: " + event.keyCode );
		//Result = 67
		
		//call the clear function
		ClearCanvas();
	}
	//SAVE Key
	else if (keyPressed == "S")
	{	
		//test keyCode value for Save	
		//alert("Save: " + event.keyCode );
		//Result = 83	
		
		//Call Save function
		saveButtonPress ();
	}
}

//Test save function
function saveButtonPress (){
	//for IE
	if (canvas.msToBlob) { 
		//alert("You are using Internet Explorer");
		//Returns a blob object encoded as a Portable Network Graphics (PNG) format from a canvas image or drawing.
		var blob = canvas.msToBlob();				
		window.navigator.msSaveBlob(blob, 'my_masterpiece.png');
	} else 
	{
		alert("You are NOT using Internet Explorer: please right click on the image and save as a new name");
		//other browsers
		//The HTMLCanvasElement.toDataURL() method returns a data URI containing a representation of the image in the format specified by the type parameter (defaults to PNG)
		var dataURL = canvas.toDataURL('image/png');
		//capture the canvas as an image and open in a new tab 
		window.open(dataURL, '_blank');
	}
}
//Project 3 submission 
function drawOnCanvas () {
	//update the name of the new drawing canvas
	var myDrawCanvasObject = document.getElementById("drawingCanvas");
	if ( myDrawCanvasObject.getContext ) { 
		var myDrawCanvasObject_context = myDrawCanvasObject.getContext("2d");
		//alert("test if the 2D myDrawCanvasObject_context supported");
		
	function drawCustomShape(){
		// begin custom shape
	  myDrawCanvasObject_context.beginPath();
	  myDrawCanvasObject_context.moveTo(170, 80);
	  myDrawCanvasObject_context.bezierCurveTo(130, 100, 130, 150, 230, 150);
	  myDrawCanvasObject_context.bezierCurveTo(250, 180, 320, 180, 340, 150);
	  myDrawCanvasObject_context.bezierCurveTo(420, 150, 420, 120, 390, 100);
	  myDrawCanvasObject_context.bezierCurveTo(430, 40, 370, 30, 340, 50);
	  myDrawCanvasObject_context.bezierCurveTo(320, 5, 250, 20, 250, 50);
	  myDrawCanvasObject_context.bezierCurveTo(200, 5, 150, 20, 170, 80);
	  // complete custom shape
	  myDrawCanvasObject_context.closePath();
	  myDrawCanvasObject_context.lineWidth = 5;
	  myDrawCanvasObject_context.strokeStyle = 'blue';
	  myDrawCanvasObject_context.stroke();
	}
	function drawRect(){
	  //three methods for rectangle 
	  myDrawCanvasObject_context.fillRect( 20, 100, 100, 50 );
	  myDrawCanvasObject_context.strokeRect( 20, 30, 100, 50 );
	  myDrawCanvasObject_context.clearRect( 35, 110, 50, 30 );
	 }

	function drawCricle(){
	  //Gradient setup
		var lin_grad = myDrawCanvasObject_context.createLinearGradient( 0, 0, 0, 400 );
		//set the start and stop color 
		lin_grad.addColorStop(0, "#fc007b" );
		lin_grad.addColorStop(0.5, "#c90062" );
		lin_grad.addColorStop(1, "#fd99ca" );
		//set up the canvas rectangle
		//myDrawCanvasObject_context.fillStyle = lin_grad;
		//myDrawCanvasObject_context.fillRect(0, 0, 400, 400);
		
	  //circle with above gradient
	  var start_degrees = 0;
		var start_angle = ( Math.PI/180 ) * start_degrees;
		var end_degrees = 360;
		var end_angle = ( Math.PI/180 ) * end_degrees;
		myDrawCanvasObject_context.beginPath();
		myDrawCanvasObject_context.arc(75,275,50,start_angle, end_angle,true);
		myDrawCanvasObject_context.strokeStyle = "rgb( 0,222,0 )";
		myDrawCanvasObject_context.stroke();
		//apply gradient 
		myDrawCanvasObject_context.fillStyle = lin_grad;
		myDrawCanvasObject_context.fill();
		//myDrawCanvasObject_context.fillStyle = "rgb( 0,222,0 )";
		//myDrawCanvasObject_context.fill();
	 }
	
	function drawTriangle(){
	  //triangle in cloud 
	  myDrawCanvasObject_context.beginPath()
	  myDrawCanvasObject_context.moveTo(275,200);
	  myDrawCanvasObject_context.lineTo(350,300);
	  myDrawCanvasObject_context.lineTo(350, 125);
	  myDrawCanvasObject_context.closePath();
	  myDrawCanvasObject_context.stroke();
	  myDrawCanvasObject_context.fillStyle = "rgb(255,0,0)";
		myDrawCanvasObject_context.strokeStyle = "rgb( 0, 0, 255 )";
		myDrawCanvasObject_context.lineWidth = 5;
		myDrawCanvasObject_context.stroke();
		myDrawCanvasObject_context.fill();
	}
		
	function drawV(){
		//V shape
		myDrawCanvasObject_context.beginPath();
		myDrawCanvasObject_context.lineWidth = 20;
		myDrawCanvasObject_context.lineJoin = "round";
		//(x,y) on the scale plane
		myDrawCanvasObject_context.moveTo(275, 250);
		myDrawCanvasObject_context.lineTo(350, 350);
		myDrawCanvasObject_context.lineTo(430, 250);
		myDrawCanvasObject_context.stroke();
		}
	}
	function smileFace(){
		//draw a smile face
		myDrawCanvasObject_context.beginPath();
		myDrawCanvasObject_context.arc(175,175,50,0,Math.PI*2,true); // Outer circle
		myDrawCanvasObject_context.moveTo(210,175);
		myDrawCanvasObject_context.arc(175,175,35,0,Math.PI,false);  // Mouth (clockwise)
		myDrawCanvasObject_context.moveTo(165,165);
		myDrawCanvasObject_context.arc(160,165,5,0,Math.PI*2,true);  // Left eye
		myDrawCanvasObject_context.moveTo(195,165);
		myDrawCanvasObject_context.arc(190,165,5,0,Math.PI*2,true);  // Right eye
		myDrawCanvasObject_context.stroke();
		
		// draw quotes bubble 
		myDrawCanvasObject_context.beginPath();
		myDrawCanvasObject_context.moveTo(75,25);
		myDrawCanvasObject_context.quadraticCurveTo(25,25,25,62.5);
		myDrawCanvasObject_context.quadraticCurveTo(25,100,50,100);
		myDrawCanvasObject_context.quadraticCurveTo(50,120,30,125);
		myDrawCanvasObject_context.quadraticCurveTo(60,120,65,100);
		myDrawCanvasObject_context.quadraticCurveTo(125,100,125,62.5);
		myDrawCanvasObject_context.quadraticCurveTo(125,25,75,25);
		myDrawCanvasObject_context.stroke();
	}
	var functions = [drawCustomShape, drawRect, drawCricle, drawTriangle, drawV, smileFace];
	setInterval(function(){
	   functions[Math.floor(Math.random()*functions.length)]();
	}, 200);
}
//Right side div
  function showFillText() {
  textCanvas_context.fillStyle = '#ffffff';
  textCanvas_context.font = 'italic bold 12px sans-serif';
  textCanvas_context.textBaseline = 'bottom';
  var userName = document.getElementById("inputUserName").value;
  textCanvas_context.fillText('Welcome to *Star Wars* ' + userName, 10, 30);
  }
  
  function showStrokeText() {
    textCanvas_context.strokeStyle = '#ffffff';
  textCanvas_context.font = '12px san-serif';
  textCanvas_context.textBaseline = 'bottom';
  textCanvas_context.strokeText('"Never tell me the odds!"', 10, 60);
  textCanvas_context.strokeText('"I’m not afraid. You will be...."',20, 90);
  }
  
  function Clear_text() {
  textCanvas_context.clearRect(1, 1, 700, 300);
  } 