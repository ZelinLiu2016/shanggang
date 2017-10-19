function setBorder(mesh,a,b,c,d) {
    mesh.left = a;
    mesh.up = b;
    mesh.right = c;
    mesh.down = d;
}

function setThreshold(mesh,threshold) {
//    mesh.threshold = threshold;
	Threshold = threshold;
}
function distanceSquare(p1,p2) {
    return (p1[0]-p2[0])*(p1[0]-p2[0])+(p1[1]-p2[1])*(p1[1]-p2[1]);
}
function plots(papers,grid,index) {
    var flag;
    var tmp1 = distanceSquare(MESH.left,MESH.up);
    var tmp2 = distanceSquare(MESH.left,MESH.down);
    if (tmp1 < tmp2) flag = true;
    else flag = false;
    plot(papers[0],grid[index[0]],Threshold,flag);//flag=true mean,short direction
    tmp = new Array(grid.length);
    for (var i=0;i<grid.length;++i) {
        tmp[i] = grid[i][index[1]];
    }
    plot(papers[1],tmp,Threshold,!flag);
}
        
function plot(paper,grid2,threshold,flag) {
    paper.clear();
    var paperWidth=200;
    var paperHeight=200;
    var zmax = -1000;
    var zmin = 1000;
    var z;
    var data = new Array();
	var tmpOut = new Array();
    for (var i=0; i<grid2.length;++i) {
        if (typeof(grid2[grid2.length-1-i])!='undefined'){
            z = grid2[grid2.length-1-i][2];
            if (zmax<z) zmax = z;
            if (zmin>z) zmin = z;
            data.push([i,z]);
			tmpOut.push(i);
        }
    }
	var plotZScale = ZPlotScale;//(zmax-zmin) < 1 ? 1 : zmax-zmin;
    for (var i=0;i<data.length;++i) {
        if (zmax<=zmin) break;
        data[i][1] = paperHeight/2+(data[i][1]-(zmax+zmin)/2.0)*paperHeight/plotZScale;
    }
	meanFilter(data);
	meanFilter(data);
    var thresholdHeigth = paperHeight/2+(threshold-(zmax+zmin)/2.0)*paperHeight/plotZScale;
    var thresholdLine = paper.path(['M',0,thresholdHeigth,'L',paperWidth,thresholdHeigth]);
    thresholdLine.attr({'stroke-dasharray':'--'});
    if (flag) {
        var titleText = paper.text(100,180,"横切面");
    } else {
        var titleText = paper.text(100,180,"纵切面");
    }
    titleText.attr({'font-size':10,'font-family':'serif'});
    
   var path = ['M',data[0][0],data[0][1]];
   path.push('R');
   for (var i=1,num=data.length;i<num;++i) {
       path.push(data[i][0]*2);
       path.push(data[i][1]);
   }
   var curve = paper.path(path);
//   paper.remove();
}

function meanFilter(data) {
	var tmp = data[0][1]
	for (var i=1;i<data.length-1;++i) {
//		if (Math.abs(data[i-1][1]-data[i+1][1])<5 && Math.abs(data[i][1]-data[i-1][1])>10 && Math.abs(data[i][1]-data[i+1][1])>10) {
//			data[i][1] = data[i-1][1];
//		}
		var tmp2=tmp*(data[i][0]-data[i-1][0])/(data[i+1][0]-data[i-1][0])+data[i+1][1]*(data[i+1][0]-data[i][0])/(data[i+1][0]-data[i-1][0]);
		tmp=data[i][1];
		data[i][1]=tmp2;
	}
}
