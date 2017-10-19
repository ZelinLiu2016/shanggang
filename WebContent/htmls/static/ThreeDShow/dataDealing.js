var getNormal = function(meshPoints) {
	var normal = new Array();
	for (var i=0;i<meshPoints.length/12;++i) {
		var x = new Array(meshPoints[i*12],meshPoints[i*12+1],meshPoints[i*12+2]);
		var y = new Array(meshPoints[i*12+4],meshPoints[i*12+5],meshPoints[i*12+6]);
		var z = new Array(meshPoints[i*12+8],meshPoints[i*12+9],meshPoints[i*12+10]);
		var ns = new Array(y[0]*z[1]+y[1]*z[2]+y[2]*z[0]-z[0]*y[1]-y[0]*z[2]-y[2]*z[1],z[0]*x[1]+x[2]*z[1]+x[0]*z[2]-x[0]*z[1]-x[1]*z[2]-x[2]*z[0],x[0]*y[1]+x[1]*y[2]+x[2]*y[0]-x[0]*y[2]-y[0]*x[1]-x[2]*y[1],1.0);
		if (ns[2]<0) {
			ns[0] = -ns[0];
			ns[1] = -ns[1];
			ns[2] = -ns[2];
		}
		for (var j=0;j<3;++j) {
			for (var k=0;k<4;++k) {
				normal.push(ns[k]);
			}
		}
	}
	return new Float32Array(normal);
}

var getFixedDeep = function(deep) {
	if (deep <= 25) return deep;
	return Math.log(deep-25)+25;
}

var normalPoints = function(points) {
	var minX=Number.POSITIVE_INFINITY,maxX=Number.NEGATIVE_INFINITY,minY=Number.POSITIVE_INFINITY,maxY=Number.NEGATIVE_INFINITY,minZ=100000.0,maxZ=-100000.0;
	var para = function(){}
	for (var i=0;i<points.length;++i) {
		if (minX>points[i][0]) {
            minX=points[i][0];
            para.left = [points[i][0],points[i][1]];
        }
		if (maxX<points[i][0]) {
            maxX=points[i][0];
            para.right = [points[i][0],points[i][1]];
        }
		if (minY>points[i][1]) {
            minY=points[i][1];
            para.down = [points[i][0],points[i][1]];
        }
		if (maxY<points[i][1]) {
            maxY=points[i][1];
            para.up = [points[i][0],points[i][1]];
        }
		var fixedDeep = getFixedDeep(points[i][2]);
		if (minZ>fixedDeep) minZ = fixedDeep;
		if (maxZ<fixedDeep) maxZ = fixedDeep;
	}
	var scaleXY;
	if (maxX-minX>maxY-minY) {
		scaleXY=maxX-minX;
	} else {
		scaleXY=maxY-minY;
	}
	para.elements = new Array();
	para.midValue = (maxZ+minZ)/2;
	para.scale = ZScale;
	for (var i=0;i<points.length;++i) {
		var fixedDeep = getFixedDeep(points[i][2]);
		para.elements.push([2*(points[i][0]-(maxX+minX)/2)/scaleXY,2*(points[i][1]-(maxY+minY)/2)/scaleXY,(fixedDeep-para.midValue)/para.scale]);
	}
	para.trans = function(xyz) {
		var x = 2*(xyz[0]-(minX+maxX)/2)/scaleXY;
		var y = 2*(xyz[1]-(minY+maxY)/2)/scaleXY;
		var z = -(xyz[2]-para.midValue)/para.scale;
		return [x,y,z];
	}	
	para.minZAfterTrans = -(maxZ-para.midValue)/para.scale;
	para.maxZAfterTrans = -(minZ-para.midValue)/para.scale;
	return para;
}	

var normalGraphArray = function(graphArray) {
	var minX=Number.POSITIVE_INFINITY,maxX=Number.NEGATIVE_INFINITY,minY=Number.POSITIVE_INFINITY,maxY=Number.NEGATIVE_INFINITY,minZ=100000.0,maxZ=-100000.0;
	var para = function(){}
    for (var k=0;k<graphArray.length;++k) {
        var points = graphArray[k];
    	for (var i=0;i<points.length;++i) {
    		if (minX>points[i][0]) {
                minX=points[i][0];
                para.left = [points[i][0],points[i][1]];
            }
    		if (maxX<points[i][0]) {
                maxX=points[i][0];
                para.right = [points[i][0],points[i][1]];
            }
    		if (minY>points[i][1]) {
                minY=points[i][1];
                para.down = [points[i][0],points[i][1]];
            }
    		if (maxY<points[i][1]) {
                maxY=points[i][1];
                para.up = [points[i][0],points[i][1]];
            }
			var fixedDeep = getFixedDeep(points[i][2]);
			if (minZ>fixedDeep) minZ = fixedDeep;
			if (maxZ<fixedDeep) maxZ = fixedDeep;
    	}
    }
	var scaleXY;
	if (maxX-minX>maxY-minY) {
		scaleXY=maxX-minX;
	} else {
		scaleXY=maxY-minY;
	}
	para.elements = new Array();
	para.midValue = (maxZ+minZ)/2;
	para.scale = ZScale;
    for (var k=0;k<graphArray.length;++k) {
        var points = graphArray[k];
        var tmp = new Array();
    	for (var i=0;i<points.length;++i) {
			var fixedDeep = getFixedDeep(points[i][2]);
    		tmp.push([2*(points[i][0]-(maxX+minX)/2)/scaleXY,2*(points[i][1]-(maxY+minY)/2)/scaleXY,(fixedDeep-para.midValue)/para.scale]);
    	}
        para.elements.push(tmp);
    }
	para.trans = function(xyz) {
		var x = 2*(xyz[0]-(minX+maxX)/2)/scaleXY;
		var y = 2*(xyz[1]-(minY+maxY)/2)/scaleXY;
		var fixedDeep = getFixedDeep(xyz[2]);
		var z = -(fixedDeep-para.midValue)/para.scale;
		return [x,y,z];
	}
	para.minZAfterTrans = -(maxZ-para.midValue)/para.scale;
	para.maxZAfterTrans = -(minZ-para.midValue)/para.scale;
	return para;
}	

function sameSide(a,b,c,p) {
    ab = [b[0]-a[0],b[1]-a[1]];
    ac = [c[0]-a[0],c[1]-a[1]];
    ap = [p[0]-a[0],p[1]-a[1]];
    v1 = [ab[0]*ac[0],ab[1]*ac[1]];
    v2 = [ab[0]*ap[0],ab[1]*ap[1]];
    return v1[0]*v2[0]+v1[1]*v2[1]>=0;
}
function inTriangle(a,b,c,p) {
    return sameSide(a,b,c,p) && sameSide(b,c,a,p) && sameSide(c,a,b,p);
}
function triangulateWithFix(points) {
    var triangles = Delaunay.triangulate(points);
    for (var i = triangles.length-1;i>=2;i-=3) {
//        console.log(points[triangles[i]][0]);
        if (checkDistance(points,triangles[i],triangles[i-1],triangles[i-2])) {
            triangles.splice(i-2,3);
        }
    }
    return triangles
}
function findMaxDeep(points) {
	var maxDeep = 0;
	for (var i=0;i<points.length;++i) {
		if (maxDeep<points[i][2]) maxDeep = points[i][2];
	}
	return maxDeep;
}
function satisfyDeepRemand(p) {
	for (var i = 0;i<rangedThreshold.length;++i) {
		var co = rangedThreshold[i].co;
		var v1 = rangedThreshold[i].co[0];
		depth = rangedThreshold[i].d;
		for (var j=1;j<co.length-1;++j) {
			var v2 = rangedThreshold[i].co[j];
			var v3 = rangedThreshold[i].co[j+1];
			vv1 = [v1.x,v1.y];
			vv2 = [v2.x,v2.y];
			vv3 = [v3.x,v3.y];
			if (inTriangle(vv1,vv2,vv3,p)) {
				if (P[2]<depth)
					return true
				else 
					return false
			}
		}
	}
	if (p[2]<defaultDepth) return true;
	return false;
}
function pointsToMesh(points) {
	var triangles = triangulateWithFix(points);
	var para = normalPoints(points);
	var mesh = function(){}
	mesh.size = triangles.length;
	mesh.elements = new Array();
	mesh.elements2 = new Array(); //for water, lines data
	edges = {};
	for (var i=0;i<mesh.size/3;++i) {
		if ((satisfyDeepRemand(points[triangles[i*3]]) && satisfyDeepRemand(points[triangles[i*3+1]]) && satisfyDeepRemand(points[triangles[i*3+2]])) || ShowAll) {
			for (var j=0;j<3;++j) {
				mesh.elements.push(para.elements[triangles[i*3+j]][0]);
				mesh.elements.push(para.elements[triangles[i*3+j]][1]);
				mesh.elements.push(-para.elements[triangles[i*3+j]][2]);
				mesh.elements.push(0.0);
			}
			for (var j=0;j<3;++j) {
				mesh.elements.push(para.elements[triangles[i*3+j]][0]);
				mesh.elements.push(para.elements[triangles[i*3+j]][1]);
				mesh.elements.push(-para.elements[triangles[i*3+j]][2]);
				mesh.elements.push(para.minZAfterTrans-2.0);
			}
//			for (var j=0;j<3;++j) {
//				mesh.elements.push(para.elements[triangles[i*3+j]][0]);
//				mesh.elements.push(para.elements[triangles[i*3+j]][1]);
//				mesh.elements.push(-para.elements[triangles[i*3+j]][2]);
//				mesh.elements.push(para.maxZAfterTrans+2);
//			}
			for (var j=0;j<3;++j) {
				var a = triangles[i*3+j%3];
				var b = triangles[i*3+(j+1)%3];
				if (a<b) {
					if ([a,b] in edges) edges[[a,b]]+=1;
					else edges[[a,b]]=1;
				}else {
					if ([b,a] in edges) edges[[b,a]]+=1;
					else edges[[b,a]]=1;
				}
			}
		}
	}
	for (key in edges) {
		if (edges[key] ==1) {
			ab = key.split(',');
			a = parseInt(ab[0]);
			b = parseInt(ab[1]);

			mesh.elements2.push(para.elements[a][0]);
			mesh.elements2.push(para.elements[a][1]);
			mesh.elements2.push(-para.elements[a][2]);
			mesh.elements2.push(para.maxZAfterTrans+2);
			mesh.elements2.push(para.elements[b][0]);
			mesh.elements2.push(para.elements[b][1]);
			mesh.elements2.push(-para.elements[b][2]);
			mesh.elements2.push(para.maxZAfterTrans+2);
//			mesh.elements.push(para.elements[a][0]);
//			mesh.elements.push(para.elements[a][1]);
//			mesh.elements.push(-para.elements[a][2]);
//			mesh.elements.push(para.maxZAfterTrans+2);
//			
//			mesh.elements.push(para.elements[b][0]);
//			mesh.elements.push(para.elements[b][1]);
//			mesh.elements.push(-para.elements[b][2]);
//			mesh.elements.push(para.maxZAfterTrans+2);
//
//			mesh.elements.push(para.elements[a][0]);
//			mesh.elements.push(para.elements[a][1]);
//			mesh.elements.push(-para.elements[a][2]);
//			mesh.elements.push(-para.elements[a][2]+2);
//
//			mesh.elements.push(para.elements[b][0]);
//			mesh.elements.push(para.elements[b][1]);
//			mesh.elements.push(-para.elements[b][2]);
//			mesh.elements.push(-para.elements[b]+2);
//			
//			mesh.elements.push(para.elements[b][0]);
//			mesh.elements.push(para.elements[b][1]);
//			mesh.elements.push(-para.elements[b][2]);
//			mesh.elements.push(para.maxZAfterTrans+2);
//
//			mesh.elements.push(para.elements[a][0]);
//			mesh.elements.push(para.elements[a][1]);
//			mesh.elements.push(-para.elements[a][2]);
//			mesh.elements.push(-para.elements[a][2]+2);

			mesh.elements.push(para.elements[a][0]);
			mesh.elements.push(para.elements[a][1]);
			mesh.elements.push(-para.elements[a][2]);
			mesh.elements.push(para.minZAfterTrans-2);
			
			mesh.elements.push(para.elements[b][0]);
			mesh.elements.push(para.elements[b][1]);
			mesh.elements.push(-para.elements[b][2]);
			mesh.elements.push(para.minZAfterTrans-2);

			mesh.elements.push(para.elements[a][0]);
			mesh.elements.push(para.elements[a][1]);
			mesh.elements.push(-para.elements[a][2]);
			mesh.elements.push(-para.elements[a][2]-2);

			mesh.elements.push(para.elements[b][0]);
			mesh.elements.push(para.elements[b][1]);
			mesh.elements.push(-para.elements[b][2]);
			mesh.elements.push(-para.elements[b]-2);
			
			mesh.elements.push(para.elements[b][0]);
			mesh.elements.push(para.elements[b][1]);
			mesh.elements.push(-para.elements[b][2]);
			mesh.elements.push(para.minZAfterTrans-2);

			mesh.elements.push(para.elements[a][0]);
			mesh.elements.push(para.elements[a][1]);
			mesh.elements.push(-para.elements[a][2]);
			mesh.elements.push(-para.elements[a][2]-2);
		}
	}
	mesh.elements = new Float32Array(mesh.elements);
	mesh.elements2 = new Float32Array(mesh.elements2);
	mesh.div = DIV_VALUES.slice(0);
	mesh.div = setZScale(DIV_VALUES,para.midValue,para.scale);
	mesh.trans = para.trans;
    mesh.triangles = triangles;
    mesh.left = para.left;
    mesh.right = para.right;
    mesh.up = para.up;
    mesh.down = para.down;
    mesh.data = points;
	Mesh = mesh;
	return mesh;
}

function getGrid(data,mesh) {
    XNum = 50;
    YNum = 100;
    mesh.grid = new Array();
    console.log("start grid");
    for (var i=0;i<XNum;++i) {
        mesh.grid.push(new Array());
        console.log('in i');
        for (var j=0;j<YNum;++j) {
            ux = [para.up[0]*i/XNum+para.right[0]*(1-i/XNum),para.up[1]*i/XNum+para.right[1]*(1-i/XNum)];
            dx = [para.left[0]*i/XNum+para.down[0]*(1-i/XNum),para.left[1]*i/XNum+para.down[1]*(1-i/XNum)];
            xx = ux[0]*(1-j/YNum)+dx[0]*j/YNum;
            yy = ux[1]*(1-j/YNum)+dx[0]*j/YNum;
            var zz = 0.0;
            for (var k=0;k<mesh.triangles.length/3;++k) {
                if (inTriangle(mesh.data[mesh.triangles[k*3]],mesh.data[mesh.triangles[k*3+1]],mesh.data[mesh.triangles[k*3+2]],[xx,yy])) {
                    zz = mesh.data[mesh.triangles[k*3]][2]+mesh.data[mesh.triangles[k*3]][2]+mesh.data[mesh.triangles[k*3]][2];
                    zz /= 3;
                }
            }
            mesh.grid[i].push([xx,yy,zz]);
        }
    }
    console.log("end grid");
}
        

function getGrid2(data,mesh,XNum,YNum) {
    var a = mesh.left;
    var b = mesh.up;
    var c = mesh.right;
    var d = mesh.down;
    mesh.grid = new Array(XNum);
    mesh.pointsGridIndex = new Array(data.length);//record the index of every points in grid;
    for (var i=0;i<XNum;++i) mesh.grid[i] = new Array(YNum);
    for (var itri=0;itri<data.length;++itri) {
        var p1 = data[itri];
        var index1 = gridIndex(a,b,c,d,p1,XNum,YNum);
        mesh.grid[index1[0]][index1[1]] = p1;
        mesh.pointsGridIndex[itri] = index1;
    }
    for (var itri=0;itri<mesh.triangles.length/3;++itri) {
        var p1 = data[mesh.triangles[itri*3]];
        var index1 = gridIndex(a,b,c,d,p1,XNum,YNum);
        mesh.grid[index1[0]][index1[1]] = p1;
        var p2 = data[mesh.triangles[itri*3+1]];
        var index2 = gridIndex(a,b,c,d,p2,XNum,YNum);
        mesh.grid[index2[0]][index2[1]] = p2;
        var p3 = data[mesh.triangles[itri*3+2]];
        var index3 = gridIndex(a,b,c,d,p3,XNum,YNum);
        mesh.grid[index3[0]][index3[1]] = p3;
        rander(mesh,p1,p2,index1,index2);
        rander(mesh,p2,p3,index2,index3);
        rander(mesh,p3,p1,index3,index1);
    }
	while (true) {
		var flag = true;
		for (i = 0;i<XNum;++i) {
			for (j = 0;j<XNum;++j) {
				if (typeof(mesh.grid[i][j]) == 'undefined') {
					flag = false;
					if (i-1>=0 && typeof(mesh.grid[i-1][j])!='undefined') {mesh.grid[i][j] = mesh.grid[i-1][j];continue;}
					if (i+1<XNum && typeof(mesh.grid[i+1][j])!='undefined') {mesh.grid[i][j] = mesh.grid[i+1][j];continue;}
					if (j-1>=0 && typeof(mesh.grid[i][j-1])!='undefined') {mesh.grid[i][j] = mesh.grid[i][j-1];continue;}
					if (j+1<YNum && typeof(mesh.grid[i][j+1])!='undefined') {mesh.grid[i][j] = mesh.grid[i][j+1];continue;}
				}
			}
		}
		if (flag) break;
	}
	var res = new Array(100);
	for (var i=0;i<100;++i) {
		var count=0;
		for (var j=0;j<100;++j) {
			if (typeof(mesh.grid[i][j])!='undefined')++count;
		}
		res[i]=count;
	}
}

function rander(mesh,a,b,index1,index2) {
    var dx=0,dy=0;
    var tx,ty;
    var fx,fy;
    var maxd,maxdx,maxdy;
    if (index1[0]<index2[0])fx=1;
    else fx=-1;
    if (index1[1]<index2[1])fy=1;
    else fy=-1;
    maxdx = (index2[0]-index1[0])*fx;
    maxdy = (index2[1]-index1[1])*fy;
    maxd = Math.sqrt((index1[0]-index2[0])*(index1[0]-index2[0])+(index1[1]-index2[1])*(index1[1]-index2[1]));
    for (var i=1;i<=Math.floor(maxd);++i) {
        dx = index1[0] + Math.round(1.0*i*maxdx/maxd)*fx;
        dy = index1[1] + Math.round(1.0*i*maxdy/maxd)*fy;
        var p = [a[0]*i*1.0/maxd+b[0]*(maxd-i)*1.0/maxd,a[1]*i*1.0/maxd+b[1]*(maxd-i)*1.0/maxd,a[2]*i*1.0/maxd+b[2]*(maxd-i)*1.0/maxd];
        if ((dx!=index1[0] || dy!=index1[1])&&(dx!=index2[0] || dy!=index2[1])){
            mesh.grid[dx][dy] = p;
        }
    }
}
    

function side(a,b,p) {              //the side x bigger
    if (b[0]-a[0]==0) {
        return p[1]>a[0];
    } else {
        return (b[1]-a[1])/(b[0]-a[0])*(p[0]-a[0])+a[1]-p[1]>0;
    }
}

function gridIndex(a,b,c,d,p,xnum,ynum) {
    var x=0;
    var xi = 0,xj = xnum;
    while (xj-xi>1) {
        x = Math.floor((xi+xj)/2);
        var x1=[a[0]*x/xnum+d[0]*(1-x/xnum),a[1]*x/xnum+d[1]*(1-x/xnum)];
        var x2=[b[0]*x/xnum+c[0]*(1-x/xnum),b[1]*x/xnum+c[1]*(1-x/xnum)];
        if (side(x1,x2,p)) {
            xj = x;
        } else {
            xi = x;
        }
    }
    x = Math.floor((xi+xj)/2);
    
    var y=0;
    var yi=0,yj=ynum;
    while (yj-yi>1) {
        y = Math.floor((yi+yj)/2);
        var y1 = [a[0]*y/ynum+b[0]*(1-y/ynum),a[1]*y/ynum+b[1]*(1-y/ynum)];
        var y2 = [d[0]*y/ynum+c[0]*(1-y/ynum),d[1]*y/ynum+c[1]*(1-y/ynum)];
        if (side(y1,y2,p)) {
            yi = y;
        } else {
            yj = y;
        }
    }
    y = Math.floor((yi+yj)/2);
    return [x,y];
}
   

