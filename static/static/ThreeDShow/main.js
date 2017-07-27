function showAllThreeView(data,button) {
	ShowAll = true;
	ThreeView(data,button);
}
function notShowAllThreeView(data,button) {
	ShowAll = false;
	ThreeView(data,button);
}
function ThreeView(data, buttom){
	setZScales();
	mesh = pointsToMesh(data);
	normal = getNormal(mesh.elements);
	vertices = mesh.elements;
	vertices2 = mesh.elements2;
	
	var Xnum = 100;
	var Ynum = 100;
	switch (chooseHarbor) {
		case 1:
		case 2:
    		setBorder(mesh,mesh.left,mesh.up,mesh.right,mesh.down);
			break;
		case 4:
			//setBorder(mesh,[(30+37.79/60)*1E7,(122+1.84/60)*1E7],mesh.up,mesh.right,[(30+35.58/60)*1E7,(122+4.9/60)*1E7]);
		default:
    		setBorder(mesh,mesh.left,mesh.up,mesh.right,mesh.down);
	}

    setThreshold(mesh, buttom);
    getGrid2(data,mesh,Xnum,Ynum);

    pldiv1 = document.getElementById('plotForTransection1'); 
	pldiv1.innerHTML = '';
    pldiv2 = document.getElementById('plotForTransection2'); 
	pldiv2.innerHTML = '';
    Papers[0] = new Raphael('plotForTransection1',200,200); 
    Papers[1] = new Raphael('plotForTransection2',200,200);
	DIV = mesh.div;
	init(VIEW_PROJ_MATRIX,MODEL_MATRIX);
	CurrentScale = 1.0;
    MESH = mesh;
	draw3DSurface('hud','webgl3d',vertices,normal,vertices2,VIEW_PROJ_MATRIX,MODEL_MATRIX,mesh.div,COLOR1,COLOR2);
	document.oncontextmenu = function(){return false;}
}
function setZScales() {
	ZScale = 30;
	ZPlotScale = 20;
	MODEL_MATRIX.setRotate(0,0,0,1);
	switch (chooseHarbor) {
		case 1:
		case 2:
			MODEL_MATRIX.setRotate(180,1,0,0);
			MODEL_MATRIX.rotate(90,0,0,1);
			MODEL_MATRIX.rotate(45,1,0,0);
			ZPlotScale = 20;
			break;
		case 3:
			MODEL_MATRIX.setRotate(180,1,0,0);
			MODEL_MATRIX.rotate(75,0,0,1);
			MODEL_MATRIX.rotate(50,1,0,0);
			break;
		case 4:
			MODEL_MATRIX.setRotate(180,1,0,0);
			MODEL_MATRIX.rotate(90,0,0,1);
			MODEL_MATRIX.rotate(45,1,0,0);
			MODEL_MATRIX.scale(0.9,0.9,0.9);
			ZPlotScale = 80;
			break;
		case 5:
			MODEL_MATRIX.setRotate(180,1,0,0);
			MODEL_MATRIX.rotate(90,0,0,1);
			MODEL_MATRIX.rotate(45,1,0,0);
			break;
		default:						//黄浦江
			MODEL_MATRIX.setRotate(180,1,0,0);
			MODEL_MATRIX.rotate(90,0,0,1);
			MODEL_MATRIX.rotate(45,1,0,0);
			ZScale = 80;
			ZPlotScale = 20;
			switch (hpjn) {
				case 1:
					MODEL_MATRIX.rotate(-10,1,0,0);
					break;
				case 2:
					 MODEL_MATRIX.rotate(-15,1,0,0);
					 ZScale = 150;
					 break;
				 case 5:
				 case 7:
					  MODEL_MATRIX.rotate(-10,1,0,0);
				 case 6:
					  MODEL_MATRIX.rotate(-20,1,0,0);
					  break;
				case 10:
					ZScale = 20;
					ZPlotScale = 20;
					break;
				default:
					ZScale = 80;
					ZPlotScale = 20;
			}
	}
}

function draw3D() {
	draw3DSurface('hud','webgl3d',vertices,vertices2,VIEW_PROJ_MATRIX,MODEL_MATRIX,DIV,COLOR1,COLOR2);
}
function draw2D() {
	init(VIEW_PROJ_MATRIX,MODEL_MATRIX);
	draw2DSurface('webgl3d',vertices,VIEW_PROJ_MATRIX,MODEL_MATRIX,DIV,COLOR1,COLOR2);
}
function draw4D(datas, timesInterval, duringtime) {
    duringtime = typeof duringtime !== 'undefined' ? duringtime : 5000;
    fourTime = duringtime / 100;
	var para = compute4DData(datas);
	console.log(para);
	console.log(para.midValue);
	console.log(para.scale);
	console.log(para.nextVertices);
    var divValue = setZScale(DIV_VALUES,para.midValue,para.scale);
    console.log("before 4D draw");
	draw4DSurface('hud','webgl3d',para.dataOfTriangle,para.dataOfNormal,para.nextVertices,para.nextNorm,timesInterval,VIEW_PROJ_MATRIX,MODEL_MATRIX,divValue,COLOR1,COLOR2,duringtime);
    var bar = document.getElementById("bar"); 
    bar.style.width="0%"; 
    run();
    console.log("after 4D draw");
}
	
function compute4DData(datas) {
	var dataOfTriangle=[];
	var dataOfNormal=[];
    var nextVertices=[];
    var nextNorm=[];
    var para = normalGraphArray(datas);
    for (var i=0;i<datas.length-1;++i) {
        var tmpNextData = new Array();
        for (var k1=0;k1<datas[i].length;++k1) {
            var mindis = Number.POSITIVE_INFINITY;
            var tmpIndex = k1;
            for (var k2=0;k2<datas[i+1].length;++k2) {
                var tmp = (datas[i+1][k2][0]-datas[i][k1][0])*(datas[i+1][k2][0]-datas[i][k1][0])+(datas[i+1][k2][1]-datas[i][k1][1])*(datas[i+1][k2][1]-datas[i][k1][1]);
                if (tmp<mindis) {
                    mindis=tmp;
                    tmpIndex = k2;
                }
            }
            tmpNextData.push(para.trans(datas[i+1][tmpIndex]));
        }
        //pointsToMesh(datas[i]);
        var tmpdata0 = para.elements[i];
        var triangles = triangulateWithFix(tmpdata0);
//        normalPoints(tmpData);
        var mesh = new Array();
        var mesh2 = new Array();
        for (var t=0;t<triangles.length;++t) {
            mesh.push(tmpdata0[triangles[t]][0]);
            mesh.push(tmpdata0[triangles[t]][1]);
            mesh.push(-tmpdata0[triangles[t]][2]);//因为trans中已经将深度转为负数,所以无需加负号,而para.elements中并没有
			mesh.push(1.0);
            mesh2.push(tmpNextData[triangles[t]][0]);
            mesh2.push(tmpNextData[triangles[t]][1]);
            mesh2.push(tmpNextData[triangles[t]][2]);
			mesh2.push(1.0);
        }
		var edges = {}
		for (var k=0;k<triangles.length/3;++k) {
			for (var j=0;j<3;++j) {
				mesh.push(tmpdata0[triangles[k*3+j]][0]);
				mesh.push(tmpdata0[triangles[k*3+j]][1]);
				mesh.push(-tmpdata0[triangles[k*3+j]][2]);
				mesh.push(para.minZAfterTrans-2.0);

				mesh2.push(tmpNextData[triangles[k*3+j]][0]);
				mesh2.push(tmpNextData[triangles[k*3+j]][1]);
				mesh2.push(tmpNextData[triangles[k*3+j]][2]);
				mesh2.push(para.minZAfterTrans-2.0);
			}
			for (var j=0;j<3;++j) {
				var a = triangles[k*3+j%3];
				var b = triangles[k*3+(j+1)%3];
				if (a<b) {
					if ([a,b] in edges) edges[[a,b]]+=1;
					else edges[[a,b]]=1;
				}else {
					if ([b,a] in edges) edges[[b,a]]+=1;
					else edges[[b,a]]=1;
				}
			}
		}
		for (key in edges) {
			if (edges[key] ==1) {
				ab = key.split(',');
				a = parseInt(ab[0]);
				b = parseInt(ab[1]);
	
				mesh.push(tmpdata0[a][0]);
				mesh.push(tmpdata0[a][1]);
				mesh.push(-tmpdata0[a][2]);
				mesh.push(para.minZAfterTrans-2);
				
				mesh.push(tmpdata0[b][0]);
				mesh.push(tmpdata0[b][1]);
				mesh.push(-tmpdata0[b][2]);
				mesh.push(para.minZAfterTrans-2);
	
				mesh.push(tmpdata0[a][0]);
				mesh.push(tmpdata0[a][1]);
				mesh.push(-tmpdata0[a][2]);
				mesh.push(-tmpdata0[a][2]-2);
	
				mesh.push(tmpdata0[b][0]);
				mesh.push(tmpdata0[b][1]);
				mesh.push(-tmpdata0[b][2]);
				mesh.push(-tmpdata0[b]-2);
				
				mesh.push(tmpdata0[b][0]);
				mesh.push(tmpdata0[b][1]);
				mesh.push(-tmpdata0[b][2]);
				mesh.push(para.minZAfterTrans-2);
	
				mesh.push(tmpdata0[a][0]);
				mesh.push(tmpdata0[a][1]);
				mesh.push(-tmpdata0[a][2]);
				mesh.push(-tmpdata0[a][2]-2);

				mesh2.push(tmpNextData[a][0]);
				mesh2.push(tmpNextData[a][1]);
				mesh2.push(tmpNextData[a][2]);
				mesh2.push(para.minZAfterTrans-2);
				
				mesh2.push(tmpNextData[b][0]);
				mesh2.push(tmpNextData[b][1]);
				mesh2.push(tmpNextData[b][2]);
				mesh2.push(para.minZAfterTrans-2);
	
				mesh2.push(tmpNextData[a][0]);
				mesh2.push(tmpNextData[a][1]);
				mesh2.push(tmpNextData[a][2]);
				mesh2.push(tmpNextData[a][2]-2);
	
				mesh2.push(tmpNextData[b][0]);
				mesh2.push(tmpNextData[b][1]);
				mesh2.push(tmpNextData[b][2]);
				mesh2.push(tmpNextData[b]-2);
				
				mesh2.push(tmpNextData[b][0]);
				mesh2.push(tmpNextData[b][1]);
				mesh2.push(tmpNextData[b][2]);
				mesh2.push(para.minZAfterTrans-2);
	
				mesh2.push(tmpNextData[a][0]);
				mesh2.push(tmpNextData[a][1]);
				mesh2.push(tmpNextData[a][2]);
				mesh2.push(tmpNextData[a][2]-2);
			}
		}

        mesh = new Float32Array(mesh);
        dataOfTriangle.push(mesh);
        nextVertices.push(new Float32Array(mesh2));
        dataOfNormal.push(getNormal(mesh));
        nextNorm.push(getNormal(mesh2));
    }
    var tmpdata0 = para.elements[datas.length-1];
    var triangles = triangulateWithFix(tmpdata0);
    var mesh = new Array();
    for (var t=0;t<triangles.length;++t) {
        mesh.push(tmpdata0[triangles[t]][0]);
        mesh.push(tmpdata0[triangles[t]][1]);
        mesh.push(-tmpdata0[triangles[t]][2]);
		mesh.push(1.0);
    }
    mesh = new Float32Array(mesh);
    dataOfTriangle.push(mesh);
    var normal=getNormal(mesh);
    dataOfNormal.push(getNormal(mesh));
	para.dataOfTriangle=dataOfTriangle;
	para.dataOfNormal=dataOfNormal;
	para.nextVertices=nextVertices;
	para.nextNorm=nextNorm;
	return para
}
