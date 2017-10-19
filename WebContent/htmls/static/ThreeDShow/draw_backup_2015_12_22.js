//vertex shader
var VSHADER_SOURCE3D =
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Normal;\n'+
'uniform mat4 colors1;\n'+
'uniform mat4 colors2;\n'+
'uniform mat4 dColor;\n'+
'uniform mat4 u_MvpMatrix;\n'+
'uniform mat4 u_NormalMatrix;\n'+
'uniform vec3 u_LightColor;\n'+
'uniform vec3 u_LightDirection;\n'+
'uniform vec3 u_AmbientLight;\n'+
'varying vec4 v_Color;\n'+
'void main(){\n'+
'	gl_Position = u_MvpMatrix*(a_Position+vec4(0.0,0.0,0.0,0.0));\n'+
'	vec3 normal = normalize(vec3(u_NormalMatrix*a_Normal));\n'+
'	float nDotL = max(dot(u_LightDirection,normal),0.0);\n'+
'	vec3 color = vec3(0.0,0.0,0.5);\n'+
'	int n = int(dColor[0][0]);\n'+
'	float colors[32];\n'+
'	float dc[16];\n'+
'	for (int i=0;i<4;++i) {\n'+
'		for (int j=0;j<4;++j) {\n'+
'			colors[i*4+j] = colors1[i][j];\n'+
'			colors[i*4+j+16] = colors2[i][j];\n'+
'			dc[i*4+j] = dColor[i][j];\n'+
'		}\n'+
'	}\n'+
'	for (int i=0;i<16;++i) {\n'+
'		if (n==i) {\n'+
'			color = vec3(colors[i*4],colors[i*4+1],colors[i*4+2]);\n'+
'			break;\n'+
'		}\n'+
'		if (a_Position[2]<dc[i+1]) {\n'+
'			color = vec3(colors[i*4],colors[i*4+1],colors[i*4+2]);\n'+
'			break;\n'+
'		}\n'+
'	}\n'+
'	vec3 diffuse = u_LightColor*color*nDotL;\n'+
'	vec3 ambient = u_AmbientLight*color;\n'+
'	v_Color = vec4(0.3*diffuse+ambient,1.0);\n'+
'}\n';
var VSHADER_SOURCE2D =
'attribute vec4 a_Position;\n'+
'uniform mat4 colors1;\n'+
'uniform mat4 colors2;\n'+
'uniform mat4 dColor;\n'+
'uniform mat4 u_MvpMatrix;\n'+
'uniform vec3 u_LightColor;\n'+
'uniform vec3 u_AmbientLight;\n'+
'varying vec4 v_Color;\n'+
'void main(){\n'+
'	gl_Position = u_MvpMatrix*(vec4(a_Position[0],a_Position[1],0.0,1.0));\n'+
'	vec3 color = vec3(0.0,0.0,0.5);\n'+
'	int n = int(dColor[0][0]);\n'+
'	float colors[32];\n'+
'	float dc[16];\n'+
'	for (int i=0;i<4;++i) {\n'+
'		for (int j=0;j<4;++j) {\n'+
'			colors[i*4+j] = colors1[i][j];\n'+
'			colors[i*4+j+16] = colors2[i][j];\n'+
'			dc[i*4+j] = dColor[i][j];\n'+
'		}\n'+
'	}\n'+
'	for (int i=0;i<16;++i) {\n'+
'		if (n==i) {\n'+
'			color = vec3(colors[i*4],colors[i*4+1],colors[i*4+2]);\n'+
'			break;\n'+
'		}\n'+
'		if (a_Position[2]<dc[i+1]) {\n'+
'			color = vec3(colors[i*4],colors[i*4+1],colors[i*4+2]);\n'+
'			break;\n'+
'		}\n'+
'	}\n'+
'	vec3 diffuse = u_LightColor*color;\n'+
'	vec3 ambient = u_AmbientLight*color;\n'+
'	v_Color = vec4(diffuse+ambient,1.0);\n'+
'}\n';
var VSHADER_SOURCE =
'attribute vec4 a_Position;\n'+
'uniform vec4 color;\n'+
'varying vec4 v_Color;\n'+
'void main(){\n'+
'	gl_Position = a_Position;\n'+
'	v_Color=color;\n'+
'}\n';

//Fragment shader
var FSHADER_SOURCE3D =
'precision mediump float;\n'+
'varying vec4 v_Color;\n'+
'void main() {\n'+
	'gl_FragColor = v_Color;\n'+
'}\n';
var FSHADER_SOURCE2D =
'precision mediump float;\n'+
'varying vec4 v_Color;\n'+
'void main() {\n'+
	'gl_FragColor = v_Color;\n'+
'}\n';
var VIEW_PROJ_MATRIX = new Matrix4();
var MODEL_MATRIX = new Matrix4();
var DIV_VALUES = [5.0,-13.0,-12.0,-11.0,	-10.0,-9.0,1.0,1.0,      1.0,1.0,1.0,1.0,    1.0,1.0,1.0,1.0];
var COLOR1 = [1.0,0.0,0.0,1.0, 1.0,0.5,0.0,1.0,      1.0,1.0,0.0,1.0,    0.5,0.5,0.0,1.0];
var COLOR2 = [0.0,0.0,0.7,1.0   ,0.0,0.2,1.0,1.0,      0.0,1.0,1.0,1.0,    1.0,0.0,1.0,1.0];
var DIV;
var MESH;

function setHud(ctx) {
    ctx.font = '10px "Times New Roman"';
    ctx.fillStyle = 'rgba(0,0,0,1)';
}

function init(viewProjMatrix,modelMatrix) {

//	viewProjMatrix.setOrtho(-2.0,2.0,-2.0,2.0,0.0,20.0);
	viewProjMatrix.setLookAt(0.0,0.0,10.0,0.0,0.0,0.0,0.0,1.0,0.0);

	modelMatrix.setRotate(30,0,0,1);
    modelMatrix.rotate(30,1,0,0);
}

function setUniformData(gl,program,name,data) {
	var uAdress = gl.getUniformLocation(program,name);
	gl.uniformMatrix4fv(uAdress,false,data);
}

function setAttribData(gl,program,name,data) {
	aAddress = gl.getAttribLocation(program,name);
	var FSIZE = data.BYTES_PER_ELEMENT;
	var dataBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,dataBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW)
	gl.vertexAttribPointer(aAddress,3,gl.FLOAT,false,3*FSIZE,0);
	gl.enableVertexAttribArray(aAddress);
}

function setFixedData(gl,program) {
	var lightDirection = new Vector3([0.0,0.0,4.0]);
	lightDirection.normalize();
	var ambientLight = new Vector3([1.0,1.0,1.0]);
	var lightColor = new Vector3([1.0,1.0,1.0]);
	
	var uLightDirection = gl.getUniformLocation(program,'u_LightDirection');
	var uAmbientLight = gl.getUniformLocation(program,'u_AmbientLight');
	var uLightColor = gl.getUniformLocation(program,'u_LightColor');
	
	if (uLightDirection<0) {
		console.log("can't find the location of u_LightColor");
	}
	if (uAmbientLight<0) {
		console.log("can't find the location of u_AmbientLight");
	}
	if (uLightColor<0) {
		console.log("can't find the location of u_LightColor");
	}

	gl.uniform3fv(uLightDirection,lightDirection.elements);
	gl.uniform3fv(uAmbientLight,ambientLight.elements);
	gl.uniform3fv(uLightColor,lightColor.elements);
}

function setSettingData(gl,program,divValue,color1,color2) {
	var uDivValue = gl.getUniformLocation(program,'dColor');
	var uColor1 = gl.getUniformLocation(program,'colors1');
	var uColor2 = gl.getUniformLocation(program,'colors2');
	
	if (uDivValue<0) {
		console.log("can't get the location of dColor\n");
	}
	if (uColor1<0) {
		console.log("can't get the location of colors1\n");
	}
	if (uColor2<0) {
		console.log("can't get the location of colors2\n");
	}

	gl.uniformMatrix4fv(uDivValue,false,divValue);
	gl.uniformMatrix4fv(uColor1,false,color1);
	gl.uniformMatrix4fv(uColor2,false,color2);
}
function setDataForSimplePlane(gl,program,vertice,color) {
	var uColor = gl.getUniformLocation(program,'color');
	if (uColor<0) {
		console.log("can't get the location of color");
	}
	gl.uniform4fv(uColor,color.elements);
	setAttribData(gl,program,'a_Position',vertice);
}
function drawSimplePlane(gl,program,n,vertice,color) {
	gl.useProgram(program);
	setDataForSimplePlane(gl,program,vertice,color);
	gl.drawArrays(gl.TRIANGLES,0,n);
}
function drawASimplePane() {
	var canvas = document.getElementById('webgl3d');
	var gl=getWebGLContext(canvas);
	program = createProgram(gl,VSHADER_SOURCE,FSHADER_SOURCE);
	gl.useProgram(program);
	vertice = new Float32Array([-0.5,-0.5,0.0,0.5,0.5,0.0,-0.5,0.5,0.0]);
	var n = 3;
	color = new Vector4([0.5,0.0,0.0,0.5])
	drawSimplePlane(gl,program,n,vertice,color);
}
//function draw
function draw3DSurface(hudID,canvasID,dataOfVertices,dataOfNorm,viewProjMatrix,modelMatrix,divValues,color1,color2) {
	hud = document.getElementById(hudID);
	hud.style.display = 'block';
	var n = dataOfVertices.length/3;
	var canvas = document.getElementById(canvasID);
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for Webgl');
		return;
	}
	var threeDProgram = createProgram(gl,VSHADER_SOURCE3D,FSHADER_SOURCE3D);
	if (!threeDProgram) {
		console.log("Failed to intialize shaders");
	}
	gl.useProgram(threeDProgram);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH);
	gl.enable(gl.DEPTH_TEST);
	var uMvpMatrix = gl.getUniformLocation(threeDProgram,'u_MvpMatrix');
	var uNormalMatrix = gl.getUniformLocation(threeDProgram,'u_NormalMatrix');
	setFixedData(gl,threeDProgram);
	setSettingData(gl,threeDProgram,divValues,color1, color2);
	setAttribData(gl,threeDProgram,'a_Position',dataOfVertices);
	setAttribData(gl,threeDProgram,'a_Normal',dataOfNorm);
	document.onkeydown = function(ev) {
		keydown(ev,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
	}
	initEventHandlers(hud,canvas,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
	draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
}
function draw4DSurface(canvasID,dataOfVertices,dataOfNorm,viewProjMatrix,modelMatrix,divValues,color1,color2,timeInterval) {
	var canvas = document.getElementById(canvasID);
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for Webgl');
		return;
	}
	var threeDProgram = createProgram(gl,VSHADER_SOURCE3D,FSHADER_SOURCE3D);
	if (!threeDProgram) {
		console.log("Failed to intialize shaders");
	}
	gl.useProgram(threeDProgram);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH);
	gl.enable(gl.DEPTH_TEST);
	var uMvpMatrix = gl.getUniformLocation(threeDProgram,'u_MvpMatrix');
	var uNormalMatrix = gl.getUniformLocation(threeDProgram,'u_NormalMatrix');
	setFixedData(gl,threeDProgram);
//	setSettingData(gl,threeDProgram,divValues,color1, color2);
	document.onkeydown = function(ev) {
		keydown(ev,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
	}
	initEventHandlers(canvas,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
	var startTime=Date.now();
	tick = function() {
//		modelMatrix.rotate(0.1,1,0,0);
		currentTime=Date.now();
		var time = currentTime - startTime;
		if (time>=timeInterval) {
			return;
		}
		var numOfFrames = parseInt(time*dataOfVertices.length/timeInterval);
		var n = dataOfVertices[numOfFrames].length/3;
		setSettingData(gl,threeDProgram,divValues[numOfFrames],color1, color2);
		setAttribData(gl,threeDProgram,'a_Position',dataOfVertices[numOfFrames]);
		setAttribData(gl,threeDProgram,'a_Normal',dataOfNorm[numOfFrames]);
		gl.clear(gl.COLOR_BUFFER_BIT);
		draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
		requestAnimationFrame(tick,canvas);
	};
	tick()
}

function draw2DSurface(canvasID,dataOfVertices,viewProjMatrix,modelMatrix,divValues,color1,color2) {
	var n = dataOfVertices.length/3;
	var canvas = document.getElementById(canvasID);
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for Webgl');
		return;
	}
	var threeDProgram = createProgram(gl,VSHADER_SOURCE2D,FSHADER_SOURCE2D);
	if (!threeDProgram) {
		console.log("Failed to intialize shaders");
	}
	gl.useProgram(threeDProgram);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH);
	gl.enable(gl.DEPTH_TEST);
	var uMvpMatrix = gl.getUniformLocation(threeDProgram,'u_MvpMatrix');
	var lightColor = new Vector3([1.0,1.0,1.0]);
	var ambientLight = new Vector3([0.2,0.2,0.2]);
	var uLightColor = gl.getUniformLocation(threeDProgram,'u_LightColor');
	var uAmbientLight = gl.getUniformLocation(threeDProgram,'u_AmbientLight');
	gl.uniform3fv(uLightColor,lightColor.elements);
	gl.uniform3fv(uAmbientLight,ambientLight.elements);
	setSettingData(gl,threeDProgram,divValues,color1, color2);
	setAttribData(gl,threeDProgram,'a_Position',dataOfVertices);
	document.onkeydown = function(ev) {
		keydown(ev,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix);
	}
	initEventHandlers(canvas,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix);
	draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix);
}

function setZScale(divValues,midValue,scale) {//need to be called when get new data, set scale.
	var res = divValues.slice(0);
	for (var i=1;i<=divValues[0];++i) {
		res[i] = (divValues[i]+midValue)/scale;
	}
	return res;
}
function initEventHandlers(canvas,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix) {
	var ldragging = false;
	var rdragging = false;
	var llastX = -1;
	var llastY = -1;
	var rlastX = -1;
	var rlastY = -1;
	console.log("eventhandlers initialization for 3d");

	canvas.onmousedown = function(ev){
		var x = ev.clientX;
		var y = ev.clientY;
		var rect = ev.target.getBoundingClientRect();
		if (rect.left<=x && x<rect.right && rect.top<=y && y<rect.bottom){
			if (ev.button==0) {

			}
			if (ev.button==2) {
				rlastX=x;
				rlastY=y;
				rdragging = true;
			}
		}
	};
	canvas.onmouseup = function(ev) {
		if (ev.button==0) {
			ldragging = false;
		}
		if (ev.button==2) {
			rdragging = false;
		}
	};

	canvas.onmousemove = function(ev) {
		var x = ev.clientX;
		var y = ev.clientY;
		if (ldragging) {
			var dx = (x-llastX)/canvas.width;
			var dy = (y-llastY)/canvas.height;
			modelMatrix.translate(dx,-dy,0.0);
		}
		if (rdragging) {
			var dx = (x-rlastX)/10;
			var dy = (y-rlastY)/10;
			modelMatrix.rotate(-dy,1,0,0);
			modelMatrix.rotate(dx,0,0,1);
		}
		llastX = rlastX = x;
		llastY = rlastY = y;
		draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix);
	};
	canvas.onmousewheel = function(ev) {
		var scale = 1.0+ev.wheelDelta/12000.0;
		console.log(ev.wheelDelta);
		modelMatrix.scale(scale,scale,scale);
		draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix);
	}
}
function initEventHandlers(hud,canvas,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix) {
	var ldragging = false;
	var rdragging = false;
	var llastX = -1;
	var llastY = -1;
	var rlastX = -1;
	var rlastY = -1;
	console.log("eventhandlers initialization for 3d");
		
	var ctx = hud.getContext('2d');
	if (!ctx || !hud) {
		console.log("fail to get the context of hud");
	}
	ctx.clearRect(0,0,hud.width,hud.height);
	setHud(ctx);

	var dao;
	if (hud.style.display == 'none') {
		dao = canvas;
	} else {
		dao = hud;
	}
	dao.onmousedown = function(ev){
		var x = ev.clientX;
		var y = ev.clientY;
		var rect = ev.target.getBoundingClientRect();
		if (rect.left<=x && x<rect.right && rect.top<=y && y<rect.bottom){
			if (ev.button==0) {
				llastX=x;
				llastY=y;
				ldragging = true;
                ctx.clearRect(0,0,hud.width,hud.height);        //clear text
			}
			if (ev.button==2) {
				rlastX=x;
				rlastY=y;
				rdragging = true;
                ctx.clearRect(0,0,hud.width,hud.height);        //clear text

			}
            if (ev.button==1){
                var mins2 = Number.POSITIVE_INFINITY;
                var minx,miny,minz;
                for (var i=0;i<MESH.data.length;++i) {
                    var xi = MESH.data[i][0];
                    var yi = MESH.data[i][1];
                    var zi = MESH.data[i][2];
                    var xyz = MESH.trans([xi,yi,zi]);                           //position with normalization
                    var xy = MODEL_MATRIX.multiplyVector3(new Vector3(xyz));    //position in webgl with position change
                    var cx = (xy.elements[0]+1)*canvas.width/2+rect.left;       //postion in document
                    var cy = (1-xy.elements[1])*canvas.height/2+rect.top;
                    if (Math.abs(cx-x)>10 || Math.abs(cy-y)>10) {
                        continue;
                    }
                    if ((cx-x)*(cx-x)+(cy-y)*(cy-y)<mins2) {
                        mins2 = (cx-x)*(cx-x)+(cy-y)*(cy-y);
                        minx=xi;
                        miny=yi;
                        minz=zi;
                    }
                  }
                  if (mins2 != Number.POSITIVE_INFINITY) {                      //determine whether text should be shown
                      ctx.clearRect(0,0,hud.width,hud.height);
                      ctx.fillText(String(minx)+','+String(miny)+','+String(minz),x-rect.left,y-rect.top);
                  }
                   //   console.log(String(minx)+','+String(miny)+','+String(minz));
                   //console.log(String(cx)+','+String(cy));
                   console.log(mins2);
                   //MODEL_MATRIX.translate(0.5,0.0,0.0);
                    var xy = MODEL_MATRIX.multiplyVector4(new Vector4([0.0,0.0,0.0,1.0]));    //position in webgl with position change
                    var cx = (xy.elements[0]+1)*canvas.width/2;       //postion in document
                    var cy = (1-xy.elements[1])*canvas.height/2;
                    console.log(String(cx)+','+String(cy));
                  //console.log(xy.elements);
            }
		}
	};
	dao.onmouseup = function(ev) {
		if (ev.button==0) {
			ldragging = false;
		}
		if (ev.button==2) {
			rdragging = false;
		}
	};

	dao.onmousemove = function(ev) {
		var x = ev.clientX;
		var y = ev.clientY;
		
		if (ldragging) {
			var dx = (x-llastX)/canvas.width;
			var dy = (y-llastY)/canvas.height;
			modelMatrix.translate(dx,-dy,0.0);
		}
		if (rdragging) {
			var dx = (x-rlastX)/10;
			var dy = (y-rlastY)/10;
			modelMatrix.rotate(-dy,1,0,0);
			modelMatrix.rotate(-dx,0,1,0);
		}
		llastX = rlastX = x;
		llastY = rlastY = y;
		draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix);
	};
	dao.onmousewheel = function(ev) {
		var scale = 1.0+ev.wheelDelta/12000.0;
		modelMatrix.scale(scale,scale,scale);
		draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
	}
}
//- 189
//= 187
//[ 219
//] 221
//up 38
//down 40
//left 37
//right 39
function keydown(ev,gl,n,viewMatrix,modelMatrix,uMvpMatrix,uNormalMatrix) {
	if (ev.keyCode==39){//the right arrow key was pressed	
		modelMatrix.rotate(5,0,0,1);
	}else if (ev.keyCode==37){                           	
		modelMatrix.rotate(-5,0,0,1);                        	
	}else if (ev.keyCode==38){                                                    	
		modelMatrix.rotate(5,1,0,0);                         	
	}else if (ev.keyCode==40){                           	
		modelMatrix.rotate(-5,1,0,0);                        	
	}else if(ev.keyCode==189){                           	
		modelMatrix.scale(0.8,0.8,0.8);                        	
	}else if(ev.keyCode==187){
		modelMatrix.scale(1.2,1.2,1.2);
	}else if(ev.keyCode==219){
		modelMatrix.rotate(5,0,1,0);
	}else if(ev.keyCode==221){
		modelMatrix.rotate(-5,0,1,0);
	}
	draw(gl,n,viewMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
}
function keydown(ev,gl,n,viewMatrix,modelMatrix,uMvpMatrix) {
	if (ev.keyCode==39){//the right arrow key was pressed	
		modelMatrix.rotate(5,0,0,1);
	}else if (ev.keyCode==37){                           	
		modelMatrix.rotate(-5,0,0,1);                        	
	}else if (ev.keyCode==38){                                                    	
		modelMatrix.rotate(5,1,0,0);                         	
	}else if (ev.keyCode==40){                           	
		modelMatrix.rotate(-5,1,0,0);                        	
	}else if(ev.keyCode==189){                           	
		modelMatrix.scale(0.8,0.8,0.8);                        	
	}else if(ev.keyCode==187){
		modelMatrix.scale(1.2,1.2,1.2);
	}else if(ev.keyCode==219){
		modelMatrix.rotate(5,0,1,0);
	}else if(ev.keyCode==221){
		modelMatrix.rotate(-5,0,1,0);
	}
	draw(gl,n,viewMatrix,modelMatrix,uMvpMatrix);
}
function draw(gl,n,viewMatrix,modelMatrix,u_MvpMatrix,u_NormalMatrix){

	g_MvpMatrix = new Matrix4();
//	g_MvpMatrix.set(viewMatrix);
//	g_MvpMatrix.multiply(modelMatrix);
	g_MvpMatrix.set(modelMatrix);
	gl.uniformMatrix4fv(u_MvpMatrix,false,g_MvpMatrix.elements);

	var normalMatrix = new Matrix4();
	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix,false,normalMatrix.elements);

	gl.drawArrays(gl.TRIANGLES,0,n);
}
/***
function draw(gl,n,viewMatrix,modelMatrix,u_MvpMatrix){

	g_MvpMatrix = new Matrix4();
//	g_MvpMatrix.set(viewMatrix);
//	g_MvpMatrix.multiply(modelMatrix);
	g_MvpMatrix.set(modelMatrix);
	gl.uniformMatrix4fv(u_MvpMatrix,false,g_MvpMatrix.elements);

	gl.drawArrays(gl.TRIANGLES,0,n);
}
***/
