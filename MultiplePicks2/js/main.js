//We are going to recreate the clicking thing just that now with the new library
//The purpose of this project is so that users can self=generate objects or upload
//objects. This is going to be a lengthy project, but it will enscapsulate everything
//that I have learnt. Hopefully, this will combine THREE.JS, PHP, MYSQL, and javascript skills
//declare the globals
var cInnerX, cInnerY,
    scene, renderer, camera,
    raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2(), range = 50;
//First of all that I need to declare is the axes class.
//we shall call it xyz
function xyz(xIn, yIn, zIn){
	this.x = xIn;
	this.y = yIn;
	this.z = zIn;

	function setPos(xIn, yIn, zIn){
		this.x = xIn;
		this.y = yIn;
		this.z - zIn;
	}
}

//we are making a 
var data = [];
var counter =0;
function rgb(rIn, gIn, bIn){
    this.r = rIn;
    this.g = gIn;
    this.b = bIn;
}

function datum(inPos, inMesh, inRGB, name){
	this.objname = name;
	this.Meshes = inMesh;
	this.rgb = new rgb(inRGB.r, inRGB.g, inRGB.b);
    this.isClicked = false;
    this.pos = inPos;
}

//Then we should declare the box generator
function generateBox(pos){
    var objMat = new THREE.MeshBasicMaterial();
    objMat.color.setRGB(Math.random(), Math.random(), Math.random());
    var size = Math.random() * 7 + 3;
    var obj = new THREE.BoxGeometry(size, size, size);
    //making the mesh
    var Mesh = new THREE.Mesh(obj, objMat);
    //setting the position
    Mesh.position.set(pos.x,pos.y,pos.z);
    Mesh.name = counter;

    //pushing the mesh and the materials into the globals
    var newDatum = new datum(pos, Mesh, objMat.color, counter);
    data.push(newDatum);

    //pushing the thing into the scene;
    scene.add(Mesh);
    counter = counter + 1;
}

//now for the action!
window.onload = function(){
    var container = document.getElementById("container");
    cInnerX = container.clientWidth;
    cInnerY = container.clientHeight;

    //setting up the renderer
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(cInnerX, cInnerY);
    container.appendChild(renderer.domElement);
    renderer.setClearColor(0xeeeedd, 1.0);

    //create the scene
    scene = new THREE.Scene();

    //set up the camera
    camera = new THREE.PerspectiveCamera(45, cInnerX / cInnerY, 1, 10000);
    camera.position.set(range * 2, range * 2, range * 2);
    camera.lookAt(new THREE.Vector3(0,0,0));

    //declaring the controls
    controls = new THREE.TrackballControls(camera , container);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.noZoom = false;

    //window.addEventListener('click', onMouseDown, false);
    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mousedown', onMouseDown, false);

    animate();
}

//mouseMove
function onMouseMove(event){
	mouse.x = (event.clientX / cInnerX) * 2 - 1;
	mouse.y = -(event.clientY / cInnerY) * 2 + 1;

	// var intersects = raycaster.intersectObjects(scene.children);


 //    for(var i = 0; i < counter; ++i){
 //    	var obj = scene.getObjectByName(i);
 //    	//now find the name of the object
 //    	for(var j = 0; j < data.length; ++j){
 //    		if(obj.name == data[j].Meshes.name){
 //    			// console.log("name of data: " + data[j].Meshes.name);
 //    			obj.material.color.setRGB(data[j].rgb.r, data[j].rgb.g, data[j].rgb.b);
 //    		}
 //    	}
 //    }

 //    //if it is not clicked yet
	// if(intersects.length != 0){
	// 	intersects[0].object.material.color.setRGB(1,1,0);
	// 	//find that thing
	
	
	// }
}
function animate(){
	requestAnimationFrame(animate);
	render();

}
// function mouseClick(){

// }
function onMouseDown(event){
    mouse.x = (event.clientX / cInnerX) * 2 - 1;
	mouse.y = -(event.clientY / cInnerY) * 2 + 1;

	var intersects = raycaster.intersectObjects(scene.children);

	//we must go through one by one to find out which one is it
	//index Chose
    if( intersects.length != 0){
	var indexChosen = intersects[0].object.name;
	console.log("the name of the object: " + indexChosen);

	for(var k =0; k < data.length; k++){
		if(data[k].objname == indexChosen){
			if(!(data[k].isClicked)){
				intersects[0].object.material.color.setRGB(1,0,0);
				data[k].isClicked = true;
			} else{
				intersects[0].object.material.color.r = data[k].rgb.r;
				intersects[0].object.material.color.g = data[k].rgb.g;
				intersects[0].object.material.color.b = data[k].rgb.b;
				data[k].isClicked = false;
			}
		}
	}
}

	}



function render(){
	controls.update();

	//update the picking ray with the camera
	raycaster.setFromCamera(mouse, camera);

	

	renderer.render(scene, camera);
}

function generateBoxes(){
	var numBoxes = document.getElementById("numBox").value;


	for(var i = 0; i < numBoxes; ++i){
		var pos = new xyz(Math.random() * range * 3, Math.random() * range * 3,Math.random() * range * 3);
		generateBox(pos);
	
	}

}

function deleteobj(){
	console.log("time to delete!");
     //go through every datum in the thing and make an array of collected
     for(var k = 0; k < data.length; ++k){
     	if(data[k].isClicked){
     		var deletedObj = data[k].objname;
     		console.log("deleting " + k);
     		var deleteThis = scene.getObjectByName(data[k].objname);
     		scene.remove(deleteThis);
     		data.splice(k,1);
     		k = 0;

     	}
     }
}

function changeMat(){
	console.log("time to change the materials!");
	var r = document.getElementById('inR').value /  255;
	var g = document.getElementById('inG').value / 255;
	var b = document.getElementById('inB').value / 255;
	var rgbColor = new rgb(r,g,b);

	for(var k = 0; k < data.length; ++k){
		if(data[k].isClicked){
			data[k].rgb = rgbColor;

			data[k].Meshes.material.color.r = data[k].rgb.r;
			data[k].Meshes.material.color.g = data[k].rgb.g;
			data[k].Meshes.material.color.b = data[k].rgb.b;
			data[k].isClicked = false;



		}
	}
}

function clearing(){
	console.log("clearing!");

	for(var k = 0; k < data.length; ++k){
		if(data[k].isClicked){

			data[k].Meshes.material.color.r = data[k].rgb.r;
			data[k].Meshes.material.color.g = data[k].rgb.g;
			data[k].Meshes.material.color.b = data[k].rgb.b;
			data[k].isClicked = false;



		}
	}
}