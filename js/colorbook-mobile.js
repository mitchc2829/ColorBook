/* global settings */
var canvas;
var context;
var paint = false;
var curColor;
var curSize;
var curImage;

/* set the image */
var outlineImage = new Image();

/* history lists */
var clickX = [];
var clickY = [];
var clickDrag = [];
var clickColor = [];
var clickSize = [];

/* options */
var colors = ['#cb3594', '#659b41', '#ffcf33', '#986928'];
var sizes = [10, 15, 20];
var images = [{url:'images/watermelon-duck-outline.png',x:90,y:0,w:267,h:210}];

$(document).bind("mobileinit", function(){
  //apply overrides here
});

$(window).ready(function(){
	/* prepare the canvas */
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	
	/* set a default color and size */
	curSize = sizes[0];
	curImage = 0;
	
	/* load the images */
	loadImages();
	
	/* add the drawing capabilities */
	$('#canvas').bind('vmousedown', function(e){
		/* set our mouse positions */
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		/* set values */
		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	}).bind('vmousemove', function(e){
		if (paint) {
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	}).bind('vmouseup', function(e){
		paint = false;
	}).mouseleave(function(e){
		paint = false;
	});
	
	/* add the clear event */
	$('#clear').click(function(){
		clickX = [];
		clickY = [];
		clickDrag = [];
		clickColor = [];
		clickSize = [];
		
		canvas.width = canvas.width;
		addImage();
	});
	
	/* add color events */
	$('button.color').live('click', function(){
		var $this = $(this);
		$('button.color.selected').removeClass('selected');
		
		$this.addClass('selected');
		curColor = $this.attr('data-color');
	});
	
	/* add the color options */
	addColorOptions();
	
	/* select the first color */
	$('button.color:first').trigger('click');
});

/* create the history */
function addClick(x, y, dragging) {
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	clickColor.push(curColor);
	clickSize.push(curSize);
}

/* redraw the whole history of strokes */
function redraw() {
	/* set variables */
	canvas.width = canvas.width; //clear the canvas
	
	/* set values */
	context.lineJoin = 'round';
	
	/* build the lines */
	for (var i=0;i<clickX.length;i++) {
		/* start a path */
		context.beginPath();
		
		/* if we are dragging then we want to start at the previous
		entries location */
		if (clickDrag[i] && i) {
			context.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			context.moveTo(clickX[i] - 1, clickY[i]);
		}
		
		/* draw the line */
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		
		context.strokeStyle = clickColor[i];
		context.lineWidth = clickSize[i];
		context.stroke();
	}
	
	/* add the base image */
	addImage();
}

function addImage() {
	var info = images[curImage];
	outlineImage.src = info.url;
	context.drawImage(outlineImage, info.x, info.y, info.w, info.h);
}

function loadImages() {
	/* create image objects from the urls */
	for (var i=0;i<images.length;i++) {
		images[i].img = new Image();
		images[i].img.src = images[i].url;
	}
	
	/* now add a load event to the first image */
	images[0].img.onload = function() {
		addImage();
		show();
	};
}

function show() {
	$('#loading').hide();
	$('#container').show();
}

/* add the color options to the toolbar */
function addColorOptions() {
	/* set some defaults */
	var html = '';
	
	/* process the list */
	for (var i=0;i<colors.length;i++) {
		html += '<button type="button" class="color" data-color="'+colors[i]+'" style="background: '+colors[i]+'"></button>';
	}
	
	/* add the options */
	$('#toolbar').append(html);
}