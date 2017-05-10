$(document).ready(function () {
    // array of images
    var images = ["car1.png", "car2.png", "car3.png", "car4.png", "robot-dot-to-dot.jpg", "3-dot-to-dot-78.jpg", "angry-birds-coloring-pages-005.jpg", "hallowing-ghost.gif", "Porsche-Coloring-Pages.gif", "Rubiks-Cube.gif"];

    // Get the canvas element
	var canvas = $("#myCanvas")[0];
	// var canvas = document.getElememtById("myCanvas");

    // Get the 2D drawing surface
    var context = canvas.getContext("2d");
    
    // Declare variables
    var currentShape;
    var draw = false;
    var drawNewShape = true;
    var startPoint = { "x": 0, "y": 0 };
    var endPoint = { "x": 0, "y": 0 };
    var lastImage = null;
	var stopAnimation = true;

    // Clear Canvas method to clear the canvas
    $("#clearCanvas").click(function () {
		context.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
	});

    // Shapes icon on click method
    $("#shapes > li").click(function () {
        // Get the current shape to draw
        // Each shape icon has an id of the format shapeCircle, shapeLine, shapeRectangle, etc.
		currentShape = $(this).attr("id").replace("shape", "");

        
        //console.log(currentShape);

        // Remove the active css style from previous shape selected and
        // Add the active css style to the currently selected shape
        $("#shapes span").removeClass("active");
		$(this).find("span").addClass("active");
		
        // Show the font styles options if the Text shape is selected
        // hide by default
        $("#fontStyles").hide();
		if (currentShape == "Text") {
			$("#fontStyles").show();
		}

        // Reset last image
        lastImage = null;
    });

    // Fill shape on click method
    // if the fill shape checkbox is checked, enable the fill colour selector, otherwise disable it
    $("#fillShape").click(function () {
		if ($("#fillShape")[0].checked == true) {
			$("#fillColour").attr("disabled", false);
		}
		else {
			$("#fillColour").attr("disabled", true);
		}
	});

    // Canvas mouse down event handler - will run when the user first clicks the mouse on the canvas
    $("#myCanvas").mousedown(function (e) {
        // Check if a shape to draw has been selected, if not exit early
        if (currentShape == null || currentShape == "") {
			return;
		}

        // Get the current mouse position
        var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

        // move the drawing position to the current mouse position
        // if not drawing a circle, initialise the new path to be drawn
        if (currentShape != "circle") {
			context.beginPath();
		}
		context.moveTo(mouseX, mouseY);

        // initialise drawing variables for new shape
        draw = true;
		drawNewShape = true;
		$(this).css("cursor", "pointer");
		
		startPoint.x = mouseX;
		startPoint.y = mouseY;
		endPoint.x = mouseX;
		endPoint.y = mouseY;

        // Get the selected/specified line and fill colour and line width
        // Use them to initialise the drawing context for the canvas
        var lineWidth = $("#lineWidth").val();
		if (isNaN(lineWidth) == false) {
			context.lineWidth = parseInt(lineWidth, 10);
		}
		
		context.fillStyle = $("#fillColour").val();
		context.strokeStyle = $("#lineColour").val();
    });

    // Canvas mouse move event handler - will run as the user moves the mouse over the canvas
    // To simulate continuous drawing with a pen/pencil for example
    $("#myCanvas").mousemove(function (e) {
        // Check if currently in drawing mode and then draw the applicable shape
        if (draw == true) {
            // get the updated mouse position as the mouse moves
            var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
			var lineWidth = context.lineWidth;
			var fillShape = $("#fillShape")[0].checked;

            // Apply the appropriate drawing method for the currently selected shape
            // Use a switch statement to perform the correct action depending on the shape selected
            switch (currentShape) {
				case "Line":
					context.lineTo(mouseX, mouseY);
					context.stroke();
					break;
				case "Erase":
					context.clearRect(mouseX, mouseY, lineWidth, lineWidth);
					break;
				
				case "Rectangle":
					if (drawNewShape == false) {
						// Clear the last rectangle drawn
						context.clearRect(startPoint.x - lineWidth, startPoint.y - lineWidth, endPoint.x - startPoint.x + (2 * lineWidth), endPoint.y - startPoint.y + (2 * lineWidth));
					}
					
					if (fillShape == true) {
						context.fillRect(startPoint.x, startPoint.y, mouseX - startPoint.x, mouseY - startPoint.y);
					}
					
					context.strokeRect(startPoint.x, startPoint.y, mouseX - startPoint.x, mouseY - startPoint.y);
					break;
				default:
					break;
			}

            // update the current end point position to this mouse point
            endPoint.x = mouseX;
            endPoint.y = mouseY;

            // set draw new shape to false as now in drawing mode
            // will be set to true when the user lifts the pen (releases the mouse)
            drawNewShape = false;
        }
    });

    // Canvas mouse up event handler - will run as the user releases the mouse
    // To simulate when user stops drawing e.g. lifts pen/pencil for example
    $("#myCanvas").mouseup(function (e) {
        // if the shape to draw is an image/text, draw it here
        // Use a switch statement to perform the correct action depending on the shape selected
       switch (currentShape) {
			case "Image":
					// clear last image drawn
					if (lastImage != null) {
						context.clearRect(lastImage.x - lastImage.width/2, lastImage.y - lastImage.height/2, lastImage.width, lastImage.height);
					}
					
				// Get random image to draw
				var randomNo = Math.floor(Math.random() * images.length);
				var canvasImage = new Image();
				canvasImage.src = "images/" + images[randomNo];
				
				// draw the image when it finishes loading in the browser
				canvasImage.onload = function() {
					context.drawImage(canvasImage, startPoint.x - canvasImage.width/2, startPoint.y - canvasImage.height/2);
				
					lastImage = { "x": startPoint.x, "y": startPoint.y, "width": canvasImage.width, "height": canvasImage.height };
				};
				
				break;
			case "Text":
				// Set font properties
				context.font = $("#fontSize").val() + " " + $("#fontName").val();
				//console.log(context.font);
				
				context.strokeText($("#canvasText").val(), startPoint.x, startPoint.y);
				
				if (fillShape) {
					context.fillText($("#canvasText").val(), startPoint.x, startPoint.y);
				}
				break;
			default:
				break;
	   }

        // if the shape being drawn is not a circle, close/end the current drawing path
        if (currentShape != "Circle") {
            // end the current path being drawn
            context.closePath();
        }

        // reset drawing variables for next shape to be drawn
        draw = false;
		drawNewShape = true;

        // change the cursor back to default
        
    });
	
	var carImage = new Image();
	carImage.src = "images/car3.png";
	
	var car = { "CarImage": carImage, "x": 0, "y": 0};
	
	$("#animateCanvas").click(function () {
		stopAnimation = false;
		animateCanvas();
	});
	
	$("#stopAnimation").click(function () {
		stopAnimation = true;
	});
	
	function animateCanvas() {
		$("#clearCanvas").click();
		
		context.drawImage(car.CarImage, car.x, car.y);
		
		car.x += 5;
		
		// car has reached right boundary
		if (car.x > canvas.clientWidth) {
			car.x = 0;
		}		
		
		// recursive call
		if (stopAnimation == false) {
			requestAnimationFrame(function () {
			animateCanvas();
			});
		}
	}
	
});