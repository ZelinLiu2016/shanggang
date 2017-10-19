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
'	v_Color = vec4(0.5*diffuse+0.7*ambient,1.0);\n'+
'	vec4 position = vec4(a_Position[0],a_Position[1],a_Position[2],1.0);\n'+
'	if (a_Position[3] <-0.5) {\n'+
'		position[2] = a_Position[3]+2.0;\n'+
'	} else if (a_Position[3] >1.0) {\n'+
'		position[2] = a_Position[3]-2.0;\n'+
'		v_Color = vec4(0.0,0.0,0.0,1.0);\n'+
'	} else {\n'+
'	}\n'+
'	gl_Position = u_MvpMatrix*(position+vec4(0.0,0.0,0.0,0.0));\n'+
'}\n';
var VSHADER_SOURCE4D =
'attribute vec4 a_Position;\n'+
'attribute vec4 next_Position;\n'+
'attribute vec4 a_Normal;\n'+
'attribute vec4 next_Normal;\n'+
'uniform float ratio;\n'+
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
'	vec4 mid_Position = a_Position*(1.0-ratio)+next_Position*ratio;\n'+
'	vec3 normal = normalize(vec3(u_NormalMatrix*(a_Normal*(1.0-ratio)+next_Normal*ratio)));\n'+
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
'		if (mid_Position[2]<dc[i+1]) {\n'+
'			color = vec3(colors[i*4],colors[i*4+1],colors[i*4+2]);\n'+
'			break;\n'+
'		}\n'+
'	}\n'+
'	vec3 diffuse = u_LightColor*color*nDotL;\n'+
'	vec3 ambient = u_AmbientLight*color;\n'+
'	v_Color = vec4(0.3*diffuse+1.2*ambient,1.0);\n'+
'	vec4 position = vec4(mid_Position[0],mid_Position[1],mid_Position[2],1.0);\n'+
'	if (mid_Position[3] <-0.5) {\n'+
'		position[2] = mid_Position[3]+2.0;\n'+
'	} else if (mid_Position[3] >1.0) {\n'+
'		position[2] = mid_Position[3]-2.0;\n'+
'		v_Color = vec4(0.0,0.0,0.0,0.0);\n'+
'	} else {\n'+
'	}\n'+
'	gl_Position = u_MvpMatrix*(position+vec4(0.0,0.0,0.0,0.0));\n'+
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
var DIV_VALUES = [5.0,-13.0,-12.0,-11.0,    -10.0,-9.0,1.0,1.0,      1.0,1.0,1.0,1.0,    1.0,1.0,1.0,1.0];
var COLOR1 = [0.0,0.2,1.0,1.0, 0.0,0.0,0.7,1.0,  22 / 255.0,29 / 255.0,251 / 255.0,1.0, 0.7,0.5,0.0,1.0];
var COLOR2 = [1.0,0.5,0.0,1.0, 160 / 255.0, 82 / 255.0,45 / 255.0,1.0,  0.0,1.0,1.0,1.0, 1.0,0.0,1.0,1.0]; 
var ZScale = 20;
var ZPlotScale = 20;
var DIV;
var MESH;
var Threshold;
var Papers = new Array(2);
var ShowAll = true;
var defaultDepth = 15.0;
var MaxScale = 2.0;
var CurrentScale = 1.0;
rangedThreshold = new Array();
rangedThreshold.push({co:[{x:1216505000, y:313528300},
                          {x:1216435000, y:313416670},
                          {x:1216570000, y:313350000},
                          {x:1216645000, y:313470000}], d:16});
rangedThreshold.push({co:[{x:1216570000, y:313350000},
                          {x:1216645000, y:313470000},
                          {x:1216905000, y:313346670},
                          {x:1216801670, y:313215000}], d:16});

function setHud(ctx) {
    ctx.font = '10px "Times New Roman"';
    ctx.fillStyle = 'rgba(0,0,0,1)';
}

function init(viewProjMatrix,modelMatrix) {

//	viewProjMatrix.setOrtho(-2.0,2.0,-2.0,2.0,0.0,20.0);
	viewProjMatrix.setLookAt(0.0,0.0,10.0,0.0,0.0,0.0,0.0,1.0,0.0);

//	modelMatrix.setRotate(30,0,0,1);//30 
//    modelMatrix.rotate(30,1,0,0);//30
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
	gl.vertexAttribPointer(aAddress,4,gl.FLOAT,false,4*FSIZE,0);
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
function draw3DSurface(hudID,canvasID,dataOfVertices,dataOfNorm,dataOfWater,viewProjMatrix,modelMatrix,divValues,color1,color2) {
	hud = document.getElementById(hudID);
	hud.style.display = 'block';
	var n = dataOfVertices.length/4;
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
//	gl.disable(gl.DEPTH_TEST);
	var uMvpMatrix = gl.getUniformLocation(threeDProgram,'u_MvpMatrix');
	var uNormalMatrix = gl.getUniformLocation(threeDProgram,'u_NormalMatrix');
	setFixedData(gl,threeDProgram);
	setSettingData(gl,threeDProgram,divValues,color1, color2);
	setAttribData(gl,threeDProgram,'a_Position',dataOfVertices);
	setAttribData(gl,threeDProgram,'a_Normal',dataOfNorm);
	document.onkeydown = function(ev) {
		keydown(ev,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix,threeDProgram,dataOfWater,dataOfVertices,dataOfNorm);
	}
	initEventHandlers(hud,canvas,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix,threeDProgram,dataOfWater,dataOfVertices,dataOfNorm);
	draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
	draw2(gl,threeDProgram,dataOfWater,dataOfVertices,dataOfNorm);
}
//times_interval descripe the time interval of every adjacent data,the size is n-1
function draw4DSurface(hudID,canvasID,dataOfVertices,dataOfNorm,nextVertices,nextNorm,timesInterval,viewProjMatrix,modelMatrix,divValue,color1,color2,timeInterval) {
	var hud = document.getElementById(hudID);
	hud.style.display = 'none';
	var canvas = document.getElementById(canvasID);
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for Webgl');
		return;
	}
	var threeDProgram = createProgram(gl,VSHADER_SOURCE4D,FSHADER_SOURCE3D);
	if (!threeDProgram) {
		console.log("Failed to intialize shaders");
	}
	gl.useProgram(threeDProgram);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH);
//	gl.enable(gl.DEPTH_TEST);
	var uMvpMatrix = gl.getUniformLocation(threeDProgram,'u_MvpMatrix');
	var uNormalMatrix = gl.getUniformLocation(threeDProgram,'u_NormalMatrix');
    var uRatio = gl.getUniformLocation(threeDProgram,'ratio');
	setFixedData(gl,threeDProgram);
//	setSettingData(gl,threeDProgram,divValues,color1, color2);
	document.onkeydown = function(ev) {
		keydownFor4D(ev,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
	}
    var n = dataOfVertices[0].length/4;
    var times = new Array();
    times.push(0);
    for (var i=0;i<timesInterval.length;++i) times.push(times[i]+timesInterval[i]);
    var totalTimeInterval = times[times.length-1];
    var ratio;
    var indexOfTimeInterval=0;
	var startTime = Date.now();
	setSettingData(gl,threeDProgram,divValue,color1, color2);
	tick = function() {
//		modelMatrix.rotate(0.1,1,0,0);
		currentTime = Date.now();
		var time = currentTime - startTime;
		if (time>=timeInterval) {
			return;
		}
        var flag = false;
        while (time/timeInterval*totalTimeInterval>=times[indexOfTimeInterval]) {
            flag = true;
            ++indexOfTimeInterval;
        }
        ratio = (time/timeInterval*totalTimeInterval-times[indexOfTimeInterval-1])/(times[indexOfTimeInterval]-times[indexOfTimeInterval-1]);
        gl.uniform1f(uRatio,ratio);
		var n = dataOfVertices[indexOfTimeInterval-1].length/4;
        if (flag==true) {
	        initEventHandlersFor4D(hud,canvas,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
    		setAttribData(gl,threeDProgram,'a_Position',dataOfVertices[indexOfTimeInterval-1]);
    		setAttribData(gl,threeDProgram,'a_Normal',dataOfNorm[indexOfTimeInterval-1]);
    		setAttribData(gl,threeDProgram,'next_Position',nextVertices[indexOfTimeInterval-1]);
    		setAttribData(gl,threeDProgram,'next_Normal',nextNorm[indexOfTimeInterval-1]);

        }
		gl.clear(gl.COLOR_BUFFER_BIT);
		draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
		requestAnimationFrame(tick,canvas);
	};
	tick()
}

function setZScale(divValues,midValue,scale) {//need to be called when get new data, set scale.
	var res = divValues.slice(0);
	for (var i=1;i<=divValues[0];++i) {
		res[i] = (divValues[i]+midValue)/scale;
	}
	return res;
}
function initEventHandlers(hud,canvas,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix,threeDProgram,dataOfWater,dataOfVertices,dataOfNorm) {
	var ldragging = false;
	var rdragging = false;
	var llastX = -1;
	var llastY = -1;
	var rlastX = -1;
	var rlastY = -1;
	var lastTime = Date.now();
//	console.log("eventhandlers initialization for 3d");
		
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
            if (ev.button==1 && dao==hud){
                var mins2 = Number.POSITIVE_INFINITY;
                var minx,miny,minz,mini;
//				console.log("maxDeep:"+findMaxDeep(MESH.data));
                for (var i=0;i<MESH.data.length;++i) {
                    var xi = MESH.data[i][0];
                    var yi = MESH.data[i][1];
                    var zi = getFixedDeep(MESH.data[i][2]);
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
                        minz=MESH.data[i][2];
                        mini=i;
                    }
                  }
                  if (mins2 != Number.POSITIVE_INFINITY) {                      //determine whether text should be shown
                      ctx.clearRect(0,0,hud.width,hud.height);
                      ctx.fillText(String(minx)+','+String(miny)+','+String(minz),x-rect.left,y-rect.top);
                     if (chooseHarbor != 6) plots(Papers,MESH.grid,MESH.pointsGridIndex[mini]);
                  }
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

		var currentTime = Date.now();
		var dTime = currentTime - lastTime;
		if (dTime<100) {
			return;
		}
		lastTime = currentTime;
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
		var currentTime = Date.now();
		lastTime = currentTime;
		draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix);
		draw2(gl,threeDProgram,dataOfWater,dataOfVertices,dataOfNorm);
	};
	dao.onmousewheel = function(ev) {
		var currentTime = Date.now();
		var dTime = currentTime - lastTime;
		if (dTime<100) {
			return;
		}
		lastTime = currentTime;
		var scale = 1.0;
        if (ev.wheelDelta) {
            scale = 1.0+ev.wheelDelta/12000.0;
        }else {
            scale = 1.0+ev.detail/300.0;
        }
		if (CurrentScale*scale<=MaxScale) {
			CurrentScale*=scale;
			modelMatrix.scale(scale,scale,scale);
			draw(gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix);
			draw2(gl,threeDProgram,dataOfWater,dataOfVertices,dataOfNorm);
		}
	}
    if (dao.addEventListener) {
        dao.addEventListener('DOMMouseScroll',dao.onmousewheel,false);
    }
}
function initEventHandlersFor4D(hud,canvas,gl,n,viewProjMatrix,modelMatrix,uMvpMatrix,uNormalMatrix) {
	var ldragging = false;
	var rdragging = false;
	var llastX = -1;
	var llastY = -1;
	var rlastX = -1;
	var rlastY = -1;
//	console.log("eventhandlers initialization for 3d");
		
	var ctx = hud.getContext('2d');
	if (!ctx || !hud) {
		console.log("fail to get the context of hud");
	}
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
	};
	dao.onmousewheel = function(ev) {
		var scale = 1.0;
        if (ev.wheelDelta) {
            scale = 1.0+ev.wheelDelta/12000.0;
        }else {
            scale = 1.0+ev.detail/300.0;
        }
		modelMatrix.scale(scale,scale,scale);
	}
    if (dao.addEventListener) {
        dao.addEventListener('DOMMouseScroll',dao.onmousewheel,false);
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
function keydown(ev,gl,n,viewMatrix,modelMatrix,uMvpMatrix,uNormalMatrix,threeDProgram,dataOfWater,dataOfVertices,dataOfNorm) {
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
	draw2(gl,threeDProgram,dataOfWater,dataOfVertices,dataOfNorm);
}
function keydownFor4D(ev,gl,n,viewMatrix,modelMatrix,uMvpMatrix,uNormalMatrix) {
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
}
function draw(gl,n,viewMatrix,modelMatrix,u_MvpMatrix,u_NormalMatrix){
	drawArrow();
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
function draw2(gl,threeDProgram,dataOfWater,dataOfVertices,dataOfNorm) {
	setAttribData(gl,threeDProgram,'a_Position',dataOfWater);
	setAttribData(gl,threeDProgram,'a_Normal',dataOfWater);
	n = dataOfWater.length/4;
	gl.drawArrays(gl.LINES,0,n);
	setAttribData(gl,threeDProgram,'a_Position',dataOfVertices);
	setAttribData(gl,threeDProgram,'a_Normal',dataOfNorm);
}

function drawArrow() {
	hud = document.getElementById('hud');
	hudWidth = hud.width;
	hudHeight = hud.height;
	var ctx = hud.getContext('2d');
    ctx.clearRect(hudWidth-80,0,80,80);        //clear text
	originalArrowPosition = [[hudWidth,40],[hudWidth-80,20],[hudWidth-40,40],[hudWidth-80,60]];
	var ArrowPosition = []
	for (var i=0;i<originalArrowPosition.length;++i) {
		var xyz=[originalArrowPosition[i][0]-(hudWidth-40),-(originalArrowPosition[i][1]-40),0];
		var xy = MODEL_MATRIX.multiplyVector3(new Vector3(xyz)); 
		ArrowPosition.push([xy.elements[0]/CurrentScale+hudWidth-40,-xy.elements[1]/CurrentScale+40]);
	}
	ctx.beginPath();
	ctx.moveTo(ArrowPosition[0][0],ArrowPosition[0][1]);
	ctx.lineTo(ArrowPosition[1][0],ArrowPosition[1][1]);
	ctx.lineTo(ArrowPosition[2][0],ArrowPosition[2][1]);
//	for (var i=1;i<ArrowPosition.length;++i) {
//		ctx.lineTo(ArrowPosition[i][0],ArrowPosition[i][1]);
//	}
	ctx.closePath();
	ctx.fillStyle = 'rgba(0,0,255,255)';
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(ArrowPosition[0][0],ArrowPosition[0][1]);
	ctx.lineTo(ArrowPosition[3][0],ArrowPosition[3][1]);
	ctx.lineTo(ArrowPosition[2][0],ArrowPosition[2][1]);
	ctx.closePath();
	ctx.fillStyle = 'rgba(255,150,0,255)';
	ctx.fill();

	ctx.strokeRect(hudWidth-80,0,hudWidth,80);
	ctx.stokeStyle = 'rgba(0,0,0,255)';
}

