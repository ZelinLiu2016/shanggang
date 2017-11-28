function a0(curPlaneMultiPo,bDrawInObjCanvas){
	var curShipScrnPo=k2(curPlaneMultiPo.x,curPlaneMultiPo.y);
	curShipScrnPo.x+=G_V.dragMapLayerOriginPo.x;
	curShipScrnPo.y+=G_V.dragMapLayerOriginPo.y;
	if(bDrawInObjCanvas==true){
		curShipScrnPo.x-=G_V.drawObjCanvasPo.x;
		curShipScrnPo.y-=G_V.drawObjCanvasPo.y;
	};
	return curShipScrnPo;
};
function a1(arrPlaneMultiPo,bDrawInObjCanvas){
	var arrScrnPo=[];
	var iPoCount=arrPlaneMultiPo.length;
	for(var i=0;i<iPoCount;i++){
		var curShipScrnPo=a0(arrPlaneMultiPo[i],bDrawInObjCanvas);
		arrScrnPo.push(curShipScrnPo);
	};
	return arrScrnPo;
};
function a2(curGeoPo,bDrawInObjCanvas){
	var curShipScrnPo=k3(curGeoPo.x,curGeoPo.y);
	curShipScrnPo.x+=G_V.dragMapLayerOriginPo.x;
	curShipScrnPo.y+=G_V.dragMapLayerOriginPo.y;
	if(bDrawInObjCanvas==true){
		curShipScrnPo.x-=G_V.drawObjCanvasPo.x;
		curShipScrnPo.y-=G_V.drawObjCanvasPo.y;
	};
	return curShipScrnPo;
};
function a3(arrGeoPo,bDrawInObjCanvas){
	var arrScrnPo=[];
	var iPoCount=arrGeoPo.length;
	for(var i=0;i<iPoCount;i++){
		var curShipScrnPo=k3(arrGeoPo[i].x,arrGeoPo[i].y);
		curShipScrnPo.x+=G_V.dragMapLayerOriginPo.x;
		curShipScrnPo.y+=G_V.dragMapLayerOriginPo.y;
		if(bDrawInObjCanvas==true){
			curShipScrnPo.x-=G_V.drawObjCanvasPo.x;
			curShipScrnPo.y-=G_V.drawObjCanvasPo.y;
		};
		arrScrnPo.push(curShipScrnPo);
	};
	return arrScrnPo;
};
function a4(arrPo,centerScrnPo,rotation){
	var r=rotation/180*Math.PI;
	var arrDrawArrScrnPo=[];
	var cosValue=Math.cos(r);
	var sinValue=Math.sin(r);
	for(var i=0;i<arrPo.length;i++){
		var curPo=[];
		curPo.x=(arrPo[i].x*cosValue)-arrPo[i].y*sinValue+centerScrnPo.x;
		curPo.y=(arrPo[i].x*sinValue)+arrPo[i].y*cosValue+centerScrnPo.y;
		arrDrawArrScrnPo.push(curPo);
	};
	return arrDrawArrScrnPo;
};
function a5(){
	this.bDrawShipCanvas=false;
	this.bDrawObjCanvas=false;
	this.bDrawTyphoonCanvas=false;
	this.bDrawShipHistroyTrackCanvas=false;
	this.bDrawMouseMoveSelObjCanvas=false;
	this.bDrawFishAreaCanvas=false;
	this.bDrawLonLatLineCanvas=false;
	this.arrDrawInScrnShipInfo=[];
	this.arrDrawInScrnObjInfo=[];
	this.arrDrawInScrnTyphoonTrackInfo=[];
	this.ClaerHeatmap=function(){
		g_objHeatMapManClass.heatmapInstance.clearDiv()
	};
	this.ReDrawHeatmap=function(){
		if(G_V.bShowHeatmap==false){
			return;
		};
		if(G_V.bShowHeatmap&&g_objHeatMapManClass.heatmapInstance){
			document.getElementById(g_objHeatMapManClass.strDivName).style.display="block";
			var points=[];
			var max=0;
			if(g_objHeatMapManClass.arrHeatmapInfo.length>0){
				document.getElementById(g_objHeatMapManClass.strDivName).style.display="block";
				var arrScrnPo=a1(g_objHeatMapManClass.arrHeatmapInfo,true);
				for(var i=0;i<arrScrnPo.length;i++){
					if(arrScrnPo[i].x<-100||arrScrnPo[i].x-parseInt(G_V.iMapViewWidth)>100||arrScrnPo[i].y<-100||arrScrnPo[i].y-parseInt(G_V.iMapViewHeight)>100){
						continue;
					};
					var val=g_objHeatMapManClass.arrHeatmapInfo[i].value;
					max=Math.max(max,val);
					var point={
						x:arrScrnPo[i].x,y:arrScrnPo[i].y,value:val
					};
					points.push(point);
				};
				var data={
					max:max,data:points
				};
				g_objHeatMapManClass.heatmapInstance.setData(data);
			}
			else{
				document.getElementById(g_objHeatMapManClass.strDivName).style.display="none";
			}
		}
	};
	this.RedrawAllObjAfterChange=function(){
		this.ClearShipCanvas();
		this.ClearObjCanvas();
		this.ClearTyphoonCanvas();
		this.ClearShipHistroyTrackCanvas();
		this.ClearFishAreaCanvas();
		this.ClearLonLatLineCanvas();
		this.ClearRouteCanvas();
		g_objYimaEncMap.allCanvasDiv.style.left=parseInt(-G_V.dragMapLayerOriginPo.x)+"px";
		g_objYimaEncMap.allCanvasDiv.style.top=parseInt(-G_V.dragMapLayerOriginPo.y)+"px";
		this.DrawAllShip();
		this.DrawAllObject();
		this.DrawAllTyphoon();
		this.DrawAllShipHistroyTrack();
		this.DrawHeatMapData();
		this.ReDrawFishArea();
		this.ReDrawLonLatLine();
		this.ReDrawRoute();
		this.DrawAllShipCountInfo();
		a8();
		this.ReDrawHeatmap();
	};
	this.ClearRouteCanvas=function(){
		g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawRouteCanvas,g_objYimaEncMap.drawRouteCanvas2D);
	};
	this.ReDrawRoute=function(){
		for(var iRoutePos=0;iRoutePos<g_objRouteManClass.arrRouteInfo.length;iRoutePos++){
			var curRouteInfo=g_objRouteManClass.arrRouteInfo[iRoutePos];
			if(curRouteInfo.bShowOrNot==true){
				var arrRouteScrnPo=a3(curRouteInfo.arrWayPoints,true);
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawRouteCanvas2D,arrRouteScrnPo);
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawRouteCanvas2D,curRouteInfo.iLineSize,curRouteInfo.strLineColor,80);
				g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawRouteCanvas2D,curRouteInfo.strFillCircleColor,80);
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawRouteCanvas2D,arrRouteScrnPo);
				for(var pos=0;pos<arrRouteScrnPo.length;pos++){
					g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawRouteCanvas2D,curRouteInfo.strLineColor,80);
					g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawRouteCanvas2D,arrRouteScrnPo[pos].x,arrRouteScrnPo[pos].y,parseInt(curRouteInfo.iCircleR)+parseInt(1),true);
					g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawRouteCanvas2D,curRouteInfo.strFillCircleColor,80);
					g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawRouteCanvas2D,arrRouteScrnPo[pos].x,arrRouteScrnPo[pos].y,curRouteInfo.iCircleR,true);
				}
			}
		}
	};
	this.SelectScrnShipInfo=function(curScrnPo,checkScrnLen,bSelectShip){
		var iScrnShipCount=this.arrDrawInScrnShipInfo.length;
		var curSelectShipInfo=null;
		var arrCurArrShipInfo=[];
		var checeScrnPo={
			x:curScrnPo.x-G_V.drawObjCanvasPo.x,y:curScrnPo.y-G_V.drawObjCanvasPo.y
		};
		for(var i=0;i<iScrnShipCount;i++){
			if(bSelectShip==true&&this.arrDrawInScrnShipInfo[i].iTrackPos!=null){
				continue;
			};
			if(this.arrDrawInScrnShipInfo[i].po.x-checeScrnPo.x>-checkScrnLen&&this.arrDrawInScrnShipInfo[i].po.x-checeScrnPo.x<checkScrnLen&&this.arrDrawInScrnShipInfo[i].po.y-checeScrnPo.y>-checkScrnLen&&this.arrDrawInScrnShipInfo[i].po.y-checeScrnPo.y<checkScrnLen){
				arrCurArrShipInfo.push(this.arrDrawInScrnShipInfo[i]);
				break;
			}
		};
		var iMinDis=0;
		for(var i=0;i<arrCurArrShipInfo.length;i++){
			var curDis=Math.pow(parseInt(arrCurArrShipInfo[i].po.x-checeScrnPo.x),2)+Math.pow(parseInt(arrCurArrShipInfo[i].po.y-checeScrnPo.y),2);
			if(i==0){
				iMinDis=curDis;
				curSelectShipInfo=arrCurArrShipInfo[i];
			}
			else{
				if(iMinDis>curDis){
					iMinDis=curDis;
					curSelectShipInfo=arrCurArrShipInfo[i];
				}
			}
		};
		return curSelectShipInfo;
	};
	this.ClearShipCanvas=function(){
		if(G_V.bUseSvgDrawerOrNot){
			g_objSvgDrawClass.ClearSvg(g_objYimaEncMap.drawShipSvgDrawer);
		};
		this.arrDrawInScrnShipInfo=null;
		this.arrDrawInScrnShipInfo=[];
		g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawShipCanvas,g_objYimaEncMap.drawShipCanvas2D);
		this.bDrawShipCanvas=false;
	};
	this.DrawShipOneTrack=function(scrnPo,strLineColor){
		g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawMouseMoveSelObjCanvas,g_objYimaEncMap.drawMouseMoveSelObjCanvas2D);
		if(scrnPo){
			var drawScrnPo=scrnPo;
			g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,"#FFFFFF",100);
			var strCurLineColor;
			if(strLineColor!=null){
				strCurLineColor=strLineColor;
			}
			else{
				strCurLineColor="#FFFFFF";
			};
			g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawMouseMoveSelObjCanvas2D,2,strCurLineColor,80);
			g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawMouseMoveSelObjCanvas2D,drawScrnPo.x,drawScrnPo.y,4);
			this.bDrawMouseMoveSelObjCanvas=true;
		}
	};
	this.DrawOneShip=function(curShipInfo,strLineColor,strFillColor,iCheckScale,curDrawCanvas2D,bDrawSelBox,curDrawShipSvgDrawer){
		if(!curShipInfo){
			return;
		};
		if(curDrawCanvas2D==null||curDrawCanvas2D==undefined||curDrawCanvas2D==""){
			curDrawCanvas2D=g_objYimaEncMap.drawShipCanvas2D;
		};
		if(curDrawCanvas2D==null||curDrawCanvas2D==undefined||curDrawCanvas2D==""){
			return;
		};
		var curGeoPo={
			x:curShipInfo.shipGeoPoX,y:curShipInfo.shipGeoPoY
		};
		var curShipScrnPo=a2(curGeoPo,true);
		var iCurCheckScale=0;
		if(iCheckScale){
			iCurCheckScale=parseInt(iCheckScale);
		};
		if(iCurCheckScale==0||iCurCheckScale>G_V.iCurScale){
			iCurCheckScale=G_V.iCurScale;
		};
		var borderSize,borderColor,fillColor,iOpacity;
		var curShipStyle=null;
		if(curShipInfo.bGetOwnStyle==true){
			borderSize=curShipInfo.iBorderSize;
			borderColor=curShipInfo.strBorderColor;
			fillColor=curShipInfo.strFillColor;
			iOpacity=curShipInfo.iOpacity;
		}
		else{
			var iShipStateCount=G_V.arrShipStateInfo.length;
			for(var iStatePos=0;iStatePos<iShipStateCount;iStatePos++){
				if(curShipInfo.iShipState==G_V.arrShipStateInfo[iStatePos].iState){
					var arrShipStyle=G_V.arrShipStateInfo[iStatePos].arrShipStyle;
					var iShipStyleCount=arrShipStyle.length;
					var iMaxStylePos=-1;
					var iCurMaxPos=-1;
					for(var iShipStylePos=0;iShipStylePos<iShipStyleCount;iShipStylePos++){
						if(arrShipStyle[iShipStylePos].minShowScale-1<iCurCheckScale&&arrShipStyle[iShipStylePos].maxShowScale>iCurCheckScale){
							curShipStyle=arrShipStyle[iShipStylePos];
							break;
						};
						if(arrShipStyle[iShipStylePos].bImgSymbol==true){
							curShipStyle=arrShipStyle[iShipStylePos];
						};
						if(iMaxStylePos>-1){
							if(arrShipStyle[iShipStylePos].maxShowScale>arrShipStyle[iMaxStylePos].maxShowScale){
								iMaxStylePos=iShipStylePos;
							}
						}
						else{
							iMaxStylePos=iShipStylePos;
						}
					};
					if(curShipStyle==null&&iMaxStylePos>-1){
						curShipStyle=arrShipStyle[iMaxStylePos];
					};
					break;
				}
			};
			if(curShipStyle!=null){
				borderSize=curShipStyle.borderSize;
				borderColor=curShipStyle.borderColor;
				fillColor=curShipStyle.fillColor;
				iOpacity=curShipStyle.iOpacity;
			}
			else{
				return;
			}
		};
		if(strLineColor){
			borderColor=strLineColor;
		};
		if(strFillColor){
			fillColor=strFillColor;
		};
		var minX=0,minY,maxX,maxY;
		if(G_V.iDrawCircleShipMaxScale-1<G_V.iCurScale){
			if(G_V.bUseSvgDrawerOrNot&&curDrawShipSvgDrawer){
				g_objSvgDrawClass.SetLineStyle(borderSize,borderColor,iOpacity);
				g_objSvgDrawClass.SetFillStyle(fillColor,iOpacity);
				g_objSvgDrawClass.DrawCircle(curDrawShipSvgDrawer,curShipScrnPo.x,curShipScrnPo.y,G_V.iDrawCircleShipR,true);
			}
			else{
				g_objHtml5DrawClass.SetLineStyle(curDrawCanvas2D,borderSize,borderColor,iOpacity);
				g_objHtml5DrawClass.SetFillStyle(curDrawCanvas2D,fillColor,iOpacity);
				g_objHtml5DrawClass.DrawCircle(curDrawCanvas2D,curShipScrnPo.x,curShipScrnPo.y,G_V.iDrawCircleShipR,true);
			}
		}
		else if(curShipStyle!=null&&curShipStyle.bImgSymbol==true){
			curShipStyle.checkImg();
			var drawScrnPo={
				x:curShipScrnPo.x-curShipStyle.imgWidth/ 2, y: curShipScrnPo.y - curShipStyle.iImgHeight /2
			};
			this.arrDrawInScrnShipInfo.push({
				id:curShipInfo.shipId,po:curShipScrnPo,mmsi:curShipInfo.shipMMSI,name:curShipInfo.shipName
			});
			g_objHtml5DrawClass.DrawImg(g_objYimaEncMap.drawShipCanvas2D,drawScrnPo.x,drawScrnPo.y,curShipStyle.imgObj);
			minX=drawScrnPo.x;
			minY=drawScrnPo.y;
			maxX=drawScrnPo.x+parseInt(curShipStyle.imgWidth);
			maxY=drawScrnPo.y+parseInt(curShipStyle.iImgHeight);
		}
		else{
			var curSymbolHeadPo;
			var arrDrawShipScrnPo;
			if(curShipInfo.bGetOwnSymbol&&curShipInfo.arrSymbolPo){
				arrDrawShipScrnPo=a4(curShipInfo.arrSymbolPo,curShipScrnPo,curShipInfo.shipCourse);
				curSymbolHeadPo=curShipInfo.symbolHeadPo;
			}
			else{
				arrDrawShipScrnPo=a4(curShipStyle.arrSymbolPo,curShipScrnPo,curShipInfo.shipCourse);
				curSymbolHeadPo=curShipStyle.symbolHeadPo;
			};
			if(G_V.bUseSvgDrawerOrNot&&curDrawShipSvgDrawer){
				g_objSvgDrawClass.SetLineStyle(borderSize,borderColor,iOpacity);
				g_objSvgDrawClass.SetFillStyle(fillColor,iOpacity);
				g_objSvgDrawClass.DrawPolygon(curDrawShipSvgDrawer,arrDrawShipScrnPo,true);
			}
			else{
				g_objHtml5DrawClass.SetLineStyle(curDrawCanvas2D,borderSize,borderColor,iOpacity);
				g_objHtml5DrawClass.SetFillStyle(curDrawCanvas2D,fillColor,iOpacity);
				g_objHtml5DrawClass.DrawPolygon(curDrawCanvas2D,arrDrawShipScrnPo,true);
			};
			if(curShipInfo.shipSpeed>0){
				var iHeadLineLen=G_V.iDrawDefaultHeadLineLen;
				if(G_V.iDrawDefaultHeadLineScale>G_V.iCurScale){};
				var arrHeadPo=[];
				var otherPo={
					x:curSymbolHeadPo.x,y:curSymbolHeadPo.y-iHeadLineLen
				};
				arrHeadPo.push(curSymbolHeadPo);
				arrHeadPo.push(otherPo);
				var arrShipHeadScrnPo=a4(arrHeadPo,curShipScrnPo,curShipInfo.shipCourse);
				if(G_V.bUseSvgDrawerOrNot&&curDrawShipSvgDrawer){
					g_objSvgDrawClass.DrawLine(curDrawShipSvgDrawer,arrShipHeadScrnPo);
				}
				else{
					g_objHtml5DrawClass.DrawLine(curDrawCanvas2D,arrShipHeadScrnPo);
				}
			};
			if(iCheckScale){
				var arrShipSelectBoxScrnPo=arrDrawShipScrnPo;
				if(arrShipSelectBoxScrnPo!=null){
					minX=arrShipSelectBoxScrnPo[0].x;
					minY=arrShipSelectBoxScrnPo[0].y;
					maxX=arrShipSelectBoxScrnPo[0].x;
					maxY=arrShipSelectBoxScrnPo[0].y;
					for(var i=1;i<arrShipSelectBoxScrnPo.length;i++){
						if(parseInt(minX)>parseInt(arrShipSelectBoxScrnPo[i].x)){
							minX=parseInt(arrShipSelectBoxScrnPo[i].x);
						}
						else if(parseInt(maxX)<parseInt(arrShipSelectBoxScrnPo[i].x)){
							maxX=parseInt(arrShipSelectBoxScrnPo[i].x);
						};
						if(parseInt(minY)>parseInt(arrShipSelectBoxScrnPo[i].y)){
							minY=parseInt(arrShipSelectBoxScrnPo[i].y);
						}
						else if(parseInt(maxY)<parseInt(arrShipSelectBoxScrnPo[i].y)){
							maxY=parseInt(arrShipSelectBoxScrnPo[i].y);
						}
					}
				}
			}
		};
		if(bDrawSelBox!=false&&minX>0){
			var iSpaceSize=8;
			var iLenSize=6;
			var arrLinePo1=new Array();
			var oPoX=parseInt(minX)-parseInt(iSpaceSize);
			var oPoY=parseInt(minY)-parseInt(iSpaceSize);
			arrLinePo1.push(new k8(parseInt(oPoX),parseInt(oPoY)+parseInt(iLenSize)));
			arrLinePo1.push(new k8(oPoX,oPoY));
			arrLinePo1.push(new k8(parseInt(oPoX)+parseInt(iLenSize),parseInt(oPoY)));
			var arrLinePo2=new Array();
			oPoX=parseInt(maxX)+parseInt(iSpaceSize);
			oPoY=parseInt(minY)-parseInt(iSpaceSize);
			arrLinePo2.push(new k8(parseInt(oPoX)-parseInt(iLenSize),parseInt(oPoY)));
			arrLinePo2.push(new k8(oPoX,oPoY));
			arrLinePo2.push(new k8(parseInt(oPoX),parseInt(oPoY)+parseInt(iLenSize)));
			var arrLinePo3=new Array();
			oPoX=parseInt(maxX)+parseInt(iSpaceSize);
			oPoY=parseInt(maxY)+parseInt(iSpaceSize);
			arrLinePo3.push(new k8(parseInt(oPoX),parseInt(oPoY)-parseInt(iLenSize)));
			arrLinePo3.push(new k8(parseInt(oPoX),parseInt(oPoY)));
			arrLinePo3.push(new k8(parseInt(oPoX)-parseInt(iLenSize),parseInt(oPoY)));
			var arrLinePo4=new Array();
			oPoX=parseInt(minX)-parseInt(iSpaceSize);
			oPoY=parseInt(maxY)+parseInt(iSpaceSize);
			arrLinePo4.push(new k8(parseInt(oPoX)+parseInt(iLenSize),parseInt(oPoY)));
			arrLinePo4.push(new k8(parseInt(oPoX),parseInt(oPoY)));
			arrLinePo4.push(new k8(parseInt(oPoX),parseInt(oPoY)-parseInt(iLenSize)));
			bSetDrawCanvasStyleOrNot=true;
			var borderSize=2;
			var borderColor="#FF0000";
			if(G_V.bUseSvgDrawerOrNot&&curDrawShipSvgDrawer){
				g_objSvgDrawClass.SetLineStyle(borderSize,borderColor,100);
				g_objSvgDrawClass.DrawLine(curDrawShipSvgDrawer,arrLinePo1);
				g_objSvgDrawClass.DrawLine(curDrawShipSvgDrawer,arrLinePo2);
				g_objSvgDrawClass.DrawLine(curDrawShipSvgDrawer,arrLinePo3);
				g_objSvgDrawClass.DrawLine(curDrawShipSvgDrawer,arrLinePo4);
			}
			else{
				g_objHtml5DrawClass.SetLineStyle(curDrawCanvas2D,borderSize,borderColor,100);
				g_objHtml5DrawClass.DrawLine(curDrawCanvas2D,arrLinePo1);
				g_objHtml5DrawClass.DrawLine(curDrawCanvas2D,arrLinePo2);
				g_objHtml5DrawClass.DrawLine(curDrawCanvas2D,arrLinePo3);
				g_objHtml5DrawClass.DrawLine(curDrawCanvas2D,arrLinePo4);
			}
		};
		return curShipScrnPo;
	};
	this.m_arrAllShipCountInfo=[];
	this.InitArrAllShipCountInfo=function(){
		return;
		if(this.m_arrAllShipCountInfo.length==0){
			for(var i=0;i<500;i++){
				var arr1=[];
				for(var j=0;j<100;j++){
					var arr2=[];
					arr2.count=0;
					arr2.color="#FF0000";
					arr1.push(arr2)
				};
				this.m_arrAllShipCountInfo.push(arr1);
			}
		}
	};
	this.DrawAllShipCountInfo=function(){
		var iRowCount=this.m_arrAllShipCountInfo.length;
		var curShipScrnPo=[];
		for(var i=0;i<iRowCount;i++){
			var iColCount=this.m_arrAllShipCountInfo[i].length;
			for(var j=0;j<iColCount;j++){
				var curShipScrnPo=this.m_arrAllShipCountInfo[i][j];
				if(curShipScrnPo.count==0){
					continue;
				};
				curShipScrnPo=a2(curShipScrnPo.geoPo,true);
				var curShipScrnPo1=[];
				curShipScrnPo1.x=i*30;
				curShipScrnPo1.y=j*30;
				if(G_V.bUseSvgDrawerOrNot){
					g_objSvgDrawClass.SetLineStyle(1,curShipScrnPo.color,80);
					g_objSvgDrawClass.SetFillStyle(curShipScrnPo.color,80);
					g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipSvgDrawer,curShipScrnPo.x,curShipScrnPo.y,20,true)
				}
				else{
					g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,1,curShipScrnPo.color,80);
					g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipCanvas2D,curShipScrnPo.color,80);
					g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipCanvas2D,curShipScrnPo.x,curShipScrnPo.y,20,true)
				}
			}
		}
	};
	this.GetShipInfoBoxScrnPo=function(objInfo,scrnPo,shipScrnPo){
		var po={
			x:-1000,y:0
		};
		if(objInfo){
			var offsetX=objInfo.offsetScrnPo.x;
			var offsetY=objInfo.offsetScrnPo.y;
			var width=parseInt(objInfo.divObj.clientWidth);
			var heigth=parseInt(objInfo.divObj.clientHeight);
			var arrScrnPo=[];
			arrScrnPo.push(scrnPo);
			arrScrnPo.push({
				x:parseInt(scrnPo.x)+parseInt(width/2),y:scrnPo.y
			});
			arrScrnPo.push({
				x:parseInt(scrnPo.x)+parseInt(width),y:scrnPo.y
			});
			arrScrnPo.push({
				x:parseInt(scrnPo.x)+parseInt(width),y:parseInt(scrnPo.y)+parseInt(heigth/2)
			});
			arrScrnPo.push({
				x:parseInt(scrnPo.x)+parseInt(width),y:parseInt(scrnPo.y)+parseInt(heigth)
			});
			arrScrnPo.push({
				x:parseInt(scrnPo.x)+parseInt(width/2),y:parseInt(scrnPo.y)+parseInt(heigth)
			});
			arrScrnPo.push({
				x:scrnPo.x,y:parseInt(scrnPo.y)+parseInt(heigth)
			});
			arrScrnPo.push({
				x:scrnPo.x,y:parseInt(scrnPo.y)+parseInt(heigth/2)
			});
			po=arrScrnPo[0];
			var curMinLen=(arrScrnPo[0].x-shipScrnPo.x)*(arrScrnPo[0].x-shipScrnPo.x)+(arrScrnPo[0].y-shipScrnPo.y)*(arrScrnPo[0].y-shipScrnPo.y);
			for(var i=1;i<arrScrnPo.length;i++){
				var curLen=(arrScrnPo[i].x-shipScrnPo.x)*(arrScrnPo[i].x-shipScrnPo.x)+(arrScrnPo[i].y-shipScrnPo.y)*(arrScrnPo[i].y-shipScrnPo.y);
				if(curMinLen>curLen){
					curMinLen=curLen;
					po=arrScrnPo[i];
				}
			}
		};
		return po;
	};
	this.ShowShipInfoDivBox=function(){
		if(G_V.bUseSvgDrawerOrNot){
			g_objSvgDrawClass.SetLineStyle(1,"#000000",50)
		}
		else{
			g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,1,"#000000",50)
		};
		var iShipCount=g_objManShipClass.arrShowShipPosInfo.length;
		var curGeoPo=[];
		for(var i=0;i<iShipCount;i++){
			var pos=g_objManShipClass.arrShowShipPosInfo[i];
			if(g_objManShipClass.arrShipInfo[pos].shipInfoDivObj.divObj==null){
				continue;
			};
			curGeoPo.x=g_objManShipClass.arrShipInfo[pos].shipGeoPoX;
			curGeoPo.y=g_objManShipClass.arrShipInfo[pos].shipGeoPoY;
			var scrnShipPo=a2(curGeoPo,false);
			var scrnDivPo=[];
			scrnDivPo.x=parseInt(g_objManShipClass.arrShipInfo[pos].shipInfoDivObj.offsetScrnPo.x)+parseInt(scrnShipPo.x);
			scrnDivPo.y=parseInt(g_objManShipClass.arrShipInfo[pos].shipInfoDivObj.offsetScrnPo.y)+parseInt(scrnShipPo.y);
			g_objManShipClass.arrShipInfo[pos].shipInfoDivObj.divObj.style.left=scrnDivPo.x+"px";
			g_objManShipClass.arrShipInfo[pos].shipInfoDivObj.divObj.style.top=scrnDivPo.y+"px";
			var scrnPoDivPo=this.GetShipInfoBoxScrnPo(g_objManShipClass.arrShipInfo[pos].shipInfoDivObj,scrnDivPo,scrnShipPo);
			var arrPoints=[];
			scrnShipPo.x-=G_V.drawObjCanvasPo.x;
			scrnShipPo.y-=G_V.drawObjCanvasPo.y;
			scrnPoDivPo.x-=G_V.drawObjCanvasPo.x;
			scrnPoDivPo.y-=G_V.drawObjCanvasPo.y;
			arrPoints.push(scrnShipPo);
			arrPoints.push(scrnPoDivPo);
			g_objHtml5DrawClass.DrawDashedLine(g_objYimaEncMap.drawShipCanvas2D,arrPoints,5,5);
		}
	};
	this.DrawAllShip=function(){
		if(G_V.bIsPlayShipHistoryTrack==true&&G_V.bDrawCurShipAndPlayHistoryTrackShip==false){
			return;
		};
		if(G_V.bCurIsShowShipOrNot==false){
			return;
		};
		if(G_V.iStartShowShipScale<G_V.iCurScale){
			return;
		};
		if(g_objYimaEncMap.bMouseDownOrNot){
			return;
		};
		var iShipCount=g_objManShipClass.arrShipInfo.length;
		if(iShipCount==0){
			return;
		};
		g_objManShipClass.arrShowShipPosInfo=[];
		for(var i=0;i<this.m_arrAllShipCountInfo.length;i++){
			for(var j=0;j<this.m_arrAllShipCountInfo[i].length;j++){
				var curShipCountInfo=this.m_arrAllShipCountInfo[i][j];
				curShipCountInfo.count=0;
			}
		};
		if(this.m_arrAllShipCountInfo.length==0){
			this.InitArrAllShipCountInfo()
		};
		var iOneMeterToPx=0;
		if(G_V.iCurLevel>G_V.m_iStartShowShipSizeByRealSizeLevel-1){
			var lonLatPo1=k6(0-G_V.dragMapLayerOriginPo.x,100-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
			var lonLatPo2=k6(100-G_V.dragMapLayerOriginPo.x,100-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
			var disKm=API_GetDistBetwTwoPoint(lonLatPo1.x*10000000,lonLatPo1.y*10000000,lonLatPo2.x*10000000,lonLatPo2.y*10000000);
			iOneMeterToPx=1/(disKm*10);
		};
		var curSelectShipInfo=null;
		var curMapViewGeo=a6();
		var minGeoX=curMapViewGeo.minGeoX;
		var maxGeoX=curMapViewGeo.maxGeoX;
		var minGeoY=curMapViewGeo.minGeoY;
		var maxGeoY=curMapViewGeo.maxGeoY;
		var iShipStateCount=G_V.arrShipStateInfo.length;
		var bSetDrawCanvasStyleOrNot=false;
		var arrShipSelectBoxScrnPo=null;
		var followShipDrawScrnPo=null;
		var curFollowShipInfo=null;
		var iCurDrawShipCount=0;
		for(var iShipStatePos=0;iShipStatePos<iShipStateCount;iShipStatePos++){
			if(G_V.arrShipStateInfo[iShipStatePos].bShowOrNot==false){
				continue;
			};
			var strFillColor="";
			var iCircleOpacity=80;
			var borderSize=1;
			var borderColor="#000000";
			var curShipStyle=null;
			var iShipStyleCount=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle.length;
			if(G_V.iDrawCircleShipMaxScale>G_V.iCurScale){
				for(var iShipStylePos=0;iShipStylePos<iShipStyleCount;iShipStylePos++){
					if(G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos].minShowScale-1<G_V.iCurScale&&G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos].maxShowScale>G_V.iCurScale){
						curShipStyle=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos];
						break;
					}
				};
				if(curShipStyle!=null){
					borderSize=curShipStyle.borderSize;
					borderColor=curShipStyle.borderColor;
					strFillColor=curShipStyle.fillColor;
					var iOpacity=curShipStyle.iOpacity;
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.SetLineStyle(borderSize,borderColor,iOpacity);
						g_objSvgDrawClass.SetFillStyle(strFillColor,iOpacity);
					}
					else{
						g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,borderSize,borderColor,iOpacity);
						g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipCanvas2D,strFillColor,iOpacity);
					}
				}
			}
			else{
				if(G_V.strCircleShipColor){
					strFillColor=G_V.strCircleShipColor;
				}
				else{
					var maxShowScale=0;
					for(var iShipStylePos=0;iShipStylePos<iShipStyleCount;iShipStylePos++){
						if(iShipStylePos==0){
							maxShowScale=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[0].maxShowScale;
							strFillColor=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[0].fillColor;
						}
						else if(maxShowScale<G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos].maxShowScale){
							curShipStyle=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos];
							strFillColor=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos].fillColor;
							break;
						}
					}
				};
				if(G_V.bUseSvgDrawerOrNot){
					g_objSvgDrawClass.SetLineStyle(1,borderColor,iCircleOpacity);
					g_objSvgDrawClass.SetFillStyle(strFillColor,iCircleOpacity);
				}
				else{
					g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,borderSize,borderColor,iCircleOpacity);
					g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipCanvas2D,strFillColor,iCircleOpacity);
				}
			};
			var curFillColor=strFillColor;
			for(var iShipPos=0;iShipPos<iShipCount;iShipPos++){
				if(g_objManShipClass.arrShipInfo[iShipPos].iShipState!=G_V.arrShipStateInfo[iShipStatePos].iState){
					continue;
				};
				var curShipInfo=g_objManShipClass.arrShipInfo[iShipPos];
				if(curShipInfo.bShipShowOrNot==false){
					continue;
				};
				if(curShipInfo.shipInfoDivObj.divObj){
					g_objManShipClass.arrShowShipPosInfo.push(iShipPos);
				};
				var bSelectShipOrNot=false;
				if(curShipInfo.shipId==g_objManShipClass.iCurSelectShipId){
					bSelectShipOrNot=true;
					curSelectShipInfo=curShipInfo;
				}
				else{
					if(G_V.bShowOfflineShipOrNot==false&&curShipInfo.bOnlineOrNot==false){
						continue;
					};
					if(minGeoX<maxGeoX&&minGeoY<maxGeoY){
						if(curShipInfo.shipGeoPoX<minGeoX||curShipInfo.shipGeoPoX>maxGeoX||curShipInfo.shipGeoPoY<minGeoY||curShipInfo.shipGeoPoY>maxGeoY){
							continue;
						}
					}
				};
				var bShowShip=this.CheckOnlyShowShipInObject(curShipInfo.shipGeoPoX,curShipInfo.shipGeoPoY);
				if(bShowShip==false){
					continue;
				};
				if(curShipInfo.bGetOwnStyle==true){
					bSetDrawCanvasStyleOrNot=true;
					curFillColor=curShipInfo.strFillColor;
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.SetFillStyle(curFillColor,iCircleOpacity);
					}
					else{
						g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipCanvas2D,curFillColor,iCircleOpacity);
					}
				}
				else if(bSetDrawCanvasStyleOrNot==true){
					bSetDrawCanvasStyleOrNot=false;
					curFillColor=strFillColor;
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.SetFillStyle(strFillColor,iCircleOpacity);
					}
					else{
						g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipCanvas2D,strFillColor,iCircleOpacity);
					}
				};
				var curGeoPo={
					x:curShipInfo.shipGeoPoX,y:curShipInfo.shipGeoPoY
				};
				var curShipScrnPo=a2(curGeoPo,true);
				if(curShipInfo.shipId==g_objManShipClass.iCurFollowShipId){
					curFollowShipInfo=curShipInfo;
					followShipDrawScrnPo={
						x:curShipScrnPo.x,y:curShipScrnPo.y
					};
				};
				if(this.m_arrAllShipCountInfo.length>0){
					var iRowIndex=parseInt(curShipScrnPo.x/20);
					var iColIndex=parseInt(curShipScrnPo.y/20);
					var curShipCountInfo=this.m_arrAllShipCountInfo[iRowIndex][iColIndex];
					curShipCountInfo.count=parseInt(curShipCountInfo.count)+parseInt(1);
					curShipCountInfo.color=curFillColor;
					curShipCountInfo.geoPo={
						x:curShipInfo.shipGeoPoX,y:curShipInfo.shipGeoPoY
					};
				};
				if(G_V.iDrawCircleShipMaxScale-1<G_V.iCurScale&&bSelectShipOrNot==false){
					if(iCurDrawShipCount>20000){
						break;
					};
					iCurDrawShipCount++;
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipSvgDrawer,curShipScrnPo.x,curShipScrnPo.y,G_V.iDrawCircleShipR,true);
					}
					else{
						g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipCanvas2D,curShipScrnPo.x,curShipScrnPo.y,G_V.iDrawCircleShipR,true);
					};
					if(G_V.iSelectShipByScrnPoMaxScale-1>G_V.iCurScale){
						this.arrDrawInScrnShipInfo.push({
							id:curShipInfo.shipId,po:curShipScrnPo,mmsi:curShipInfo.shipMMSI,name:curShipInfo.shipName
						});
					}
				}
				else if(curShipStyle!=null&&curShipStyle.bImgSymbol==true){
					if(iCurDrawShipCount>10000){
						break;
					};
					iCurDrawShipCount++;
					if(curShipInfo.bShowTrack==true&&curShipInfo.arrShipTrackPoints.length>1){
						g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,1.5,curShipInfo.strTrackColor,90);
						bSetDrawCanvasStyleOrNot=true;
						var arrGeoPo=[];
						var iTrackCount=curShipInfo.arrShipTrackPoints.length;
						for(var iTrackPos=0;iTrackPos<iTrackCount;iTrackPos++){
							var curPo=[];
							curPo.x=curShipInfo.arrShipTrackPoints[iTrackPos].trackGeoPoX;
							curPo.y=curShipInfo.arrShipTrackPoints[iTrackPos].trackGeoPoY;
							arrGeoPo.push(curPo);
						};
						var arrTrackScrnPo=a3(arrGeoPo,true);
						g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawShipCanvas2D,arrTrackScrnPo);
					};
					curShipStyle.checkImg();
					var drawScrnPo={
						x:curShipScrnPo.x-curShipStyle.imgWidth/ 2, y: curShipScrnPo.y - curShipStyle.iImgHeight /2
					};
					this.arrDrawInScrnShipInfo.push({
						id:curShipInfo.shipId,po:curShipScrnPo,mmsi:curShipInfo.shipMMSI,name:curShipInfo.shipName
					});
					g_objHtml5DrawClass.DrawImg(g_objYimaEncMap.drawShipCanvas2D,drawScrnPo.x,drawScrnPo.y,curShipStyle.imgObj);
				}
				else{
					if(curShipStyle==null){
						continue;
					};
					if(iCurDrawShipCount>10000){
						break;
					};
					iCurDrawShipCount++;
					if(curShipInfo.bShowTrack==true&&curShipInfo.arrShipTrackPoints.length>1){
						g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,1,curShipInfo.strTrackColor,70);
						bSetDrawCanvasStyleOrNot=true;
						var arrGeoPo=[];
						var iTrackCount=curShipInfo.arrShipTrackPoints.length;
						for(var iTrackPos=0;iTrackPos<iTrackCount;iTrackPos++){
							var curPo=[];
							curPo.x=curShipInfo.arrShipTrackPoints[iTrackPos].trackGeoPoX;
							curPo.y=curShipInfo.arrShipTrackPoints[iTrackPos].trackGeoPoY;
							arrGeoPo.push(curPo);
						};
						var arrTrackScrnPo=a3(arrGeoPo,true);
						g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawShipCanvas2D,arrTrackScrnPo);
					};
					var curSymbolHeadPo;
					this.arrDrawInScrnShipInfo.push({
						id:curShipInfo.shipId,po:curShipScrnPo,mmsi:curShipInfo.shipMMSI,name:curShipInfo.shipName
					});
					var arrDrawShipScrnPo;
					if(curShipInfo.bGetOwnSymbol&&curShipInfo.arrSymbolPo){
						arrDrawShipScrnPo=a4(curShipInfo.arrSymbolPo,curShipScrnPo,curShipInfo.shipCourse);
						curSymbolHeadPo=curShipInfo.symbolHeadPo;
					}
					else{
						arrDrawShipScrnPo=a4(curShipStyle.arrSymbolPo,curShipScrnPo,curShipInfo.shipCourse);
						curSymbolHeadPo=curShipStyle.symbolHeadPo;
					};
					if(curShipInfo.shipId==g_objManShipClass.iCurSelectShipId){
						arrShipSelectBoxScrnPo=arrDrawShipScrnPo;
					};
					if(bSelectShipOrNot==false){
						if(curShipInfo.bOnlineOrNot==false&&G_V.OfflineShipStyle.bGetStyle==true){
							bSetDrawCanvasStyleOrNot=true;
							var borderSize=G_V.OfflineShipStyle.iBorderSize;
							var borderColor=G_V.OfflineShipStyle.strBorderColor;
							var fillColor=G_V.OfflineShipStyle.strFillColor;
							var iOpacity=G_V.OfflineShipStyle.iOpacity;
							if(G_V.bUseSvgDrawerOrNot){
								g_objSvgDrawClass.SetLineStyle(borderSize,borderColor,iOpacity);
								g_objSvgDrawClass.SetFillStyle(fillColor,iOpacity);
							}
							else{
								g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,borderSize,borderColor,iOpacity);
								g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipCanvas2D,fillColor,iOpacity);
							}
						}
						else if(curShipInfo.bGetOwnStyle==true){
							bSetDrawCanvasStyleOrNot=true;
							var borderSize=curShipInfo.iBorderSize;
							var borderColor=curShipInfo.strBorderColor;
							var fillColor=curShipInfo.strFillColor;
							var iOpacity=curShipInfo.iOpacity;
							if(G_V.bUseSvgDrawerOrNot){
								g_objSvgDrawClass.SetLineStyle(borderSize,borderColor,iOpacity);
								g_objSvgDrawClass.SetFillStyle(fillColor,iOpacity);
							}
							else{
								g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,borderSize,borderColor,iOpacity);
								g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipCanvas2D,fillColor,iOpacity);
							}
						}
						else if(bSetDrawCanvasStyleOrNot==true){
							bSetDrawCanvasStyleOrNot=false;
							if(curShipStyle!=null){
								var borderSize=curShipStyle.borderSize;
								var borderColor=curShipStyle.borderColor;
								var fillColor=curShipStyle.fillColor;
								var iOpacity=curShipStyle.iOpacity;
								if(G_V.bUseSvgDrawerOrNot){
									g_objSvgDrawClass.SetLineStyle(borderSize,borderColor,iOpacity);
									g_objSvgDrawClass.SetFillStyle(fillColor,iOpacity);
								}
								else{
									g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,borderSize,borderColor,iOpacity);
									g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipCanvas2D,fillColor,iOpacity);
								}
							}
						};
						if(G_V.bUseSvgDrawerOrNot){
							g_objSvgDrawClass.DrawPolygon(g_objYimaEncMap.drawShipSvgDrawer,arrDrawShipScrnPo,true);
						}
						else{
							g_objHtml5DrawClass.DrawPolygon(g_objYimaEncMap.drawShipCanvas2D,arrDrawShipScrnPo,true);
						};
						if(curShipInfo.shipSpeed>0){
							var iHeadLineLen=G_V.iDrawDefaultHeadLineLen;
							if(G_V.iDrawDefaultHeadLineScale>G_V.iCurScale){};
							var arrHeadPo=[];
							var otherPo={
								x:curSymbolHeadPo.x,y:curSymbolHeadPo.y-iHeadLineLen
							};
							arrHeadPo.push(curSymbolHeadPo);
							arrHeadPo.push(otherPo);
							var arrShipHeadScrnPo=a4(arrHeadPo,curShipScrnPo,curShipInfo.shipCourse);
							if(G_V.bUseSvgDrawerOrNot){
								g_objSvgDrawClass.DrawLine(g_objYimaEncMap.drawShipSvgDrawer,arrShipHeadScrnPo);
							}
							else{
								g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawShipCanvas2D,arrShipHeadScrnPo);
							}
						}
					}
				}
			}
		};
		if(G_V.bShowShipInfo&&G_V.iCurScale<G_V.iStartShowShipInfo){
			var drawShipCount=this.arrDrawInScrnShipInfo.length;
			var arrDrawShipInfoScrnPo=[];
			var iDrawShipInfoCount=0;
			var bDrawNameFrame=false;
			var iFrameOffsetX=10;
			var iFrameOffsetY=10;
			if(G_V.iCurScale-1<G_V.objShowNameFrameStyle.scale){
				bDrawNameFrame=true;
				iFrameOffsetX=15;
				iFrameOffsetY=35
			};
			for(var i=0;i<drawShipCount;i++){
				if(curSelectShipInfo&&this.arrDrawInScrnShipInfo[i].id==curSelectShipInfo.shipId){
					continue;
				};
				var bDrawOrNot=true;
				for(var iPos=0;iPos<iDrawShipInfoCount;iPos++){
					if(arrDrawShipInfoScrnPo[iPos].x-this.arrDrawInScrnShipInfo[i].po.x<15&&arrDrawShipInfoScrnPo[iPos].x-this.arrDrawInScrnShipInfo[i].po.x>-15&&arrDrawShipInfoScrnPo[iPos].y-this.arrDrawInScrnShipInfo[i].po.y<10&&arrDrawShipInfoScrnPo[iPos].y-this.arrDrawInScrnShipInfo[i].po.y>-10){
						bDrawOrNot=false;
						break;
					}
				};
				if(bDrawOrNot==false){
					continue;
				};
				var strText=null;
				if(G_V.bShowShipNameOrMMsi==true){
					strText=this.arrDrawInScrnShipInfo[i].name;
				}
				else{
					strText=this.arrDrawInScrnShipInfo[i].mmsi;
					if(strText==""&&G_V.bNameToNullMmsi==true){
						strText=this.arrDrawInScrnShipInfo[i].name;
					}
				};
				if(G_V.bUseSvgDrawerOrNot){
					g_objSvgDrawClass.SetTextStyle(G_V.strShipInfoFont,G_V.strShipInfoColor,G_V.iShipInfoOpacity);
				}
				else{
					g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawShipCanvas2D,G_V.strShipInfoFont,G_V.strShipInfoColor,G_V.iShipInfoOpacity);
				};
				if(strText!=null&&strText!=""){
					if(G_V.iCurScale-1<G_V.objShowNameFrameStyle.scale){
						var arrLinePo=[];
						var arrStrText=strText.split("\n");
						var iArrTextLineCount=arrStrText.length;
						var iFrameWidth=G_V.objShowNameFrameStyle.width;
						var iNameLen=g6(strText);
						iFrameWidth=iNameLen*9;
						var iFrameHeight=G_V.objShowNameFrameStyle.height*iArrTextLineCount;
						var iBorderWith=G_V.objShowNameFrameStyle.border;
						var strColor=G_V.objShowNameFrameStyle.color;
						var iOpacity=G_V.objShowNameFrameStyle.opacity;
						arrLinePo.push(this.arrDrawInScrnShipInfo[i].po);
						arrLinePo.push({
							x:arrLinePo[0].x+parseInt(10),y:arrLinePo[0].y-30
						});
						arrLinePo.push({
							x:arrLinePo[1].x,y:arrLinePo[1].y-iFrameHeight
						});
						arrLinePo.push({
							x:arrLinePo[2].x+parseInt(iFrameWidth),y:arrLinePo[2].y
						});
						arrLinePo.push({
							x:arrLinePo[3].x,y:arrLinePo[1].y
						});
						arrLinePo.push({
							x:arrLinePo[1].x,y:arrLinePo[1].y
						});
						if(G_V.bUseSvgDrawerOrNot){
							g_objSvgDrawClass.SetLineStyle(iBorderWith,strColor,iOpacity);
							g_objSvgDrawClass.DrawLine(g_objYimaEncMap.drawShipSvgDrawer,arrLinePo);
						}
						else{
							g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,iBorderWith,strColor,iOpacity);
							g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawShipCanvas2D,arrLinePo);
						};
						var iCurShowLineTextScrnY=arrLinePo[1].y-iFrameHeight/2;
						for(var iTextPos=0;iTextPos<iArrTextLineCount;iTextPos++){
							if(G_V.bUseSvgDrawerOrNot){
								g_objSvgDrawClass.DrawString(g_objYimaEncMap.drawShipSvgDrawer,curSelectShipScrnPo.x+15,iCurShowLineTextScrnY,arrStrText[iTextPos])
							}
							else{
								g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipCanvas2D,curSelectShipScrnPo.x+15,iCurShowLineTextScrnY,arrStrText[iTextPos])
							};
							iCurShowLineTextScrnY=parseInt(iCurShowLineTextScrnY)+parseInt(G_V.objShowNameFrameStyle.height-3)
						}
					}
					else{
						if(G_V.bUseSvgDrawerOrNot){
							g_objSvgDrawClass.DrawString(g_objYimaEncMap.drawShipSvgDrawer,this.arrDrawInScrnShipInfo[i].po.x+iFrameOffsetX,this.arrDrawInScrnShipInfo[i].po.y+iFrameOffsetY,strText);
						}
						else{
							g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipCanvas2D,this.arrDrawInScrnShipInfo[i].po.x+iFrameOffsetX,this.arrDrawInScrnShipInfo[i].po.y+iFrameOffsetY,strText);
						}
					};
					arrDrawShipInfoScrnPo.push(this.arrDrawInScrnShipInfo[i].po);
					iDrawShipInfoCount++;
				}
			}
		};
		if(curSelectShipInfo!=null){
			var curSelectShipScrnPo=this.DrawOneShip(curSelectShipInfo,null,null,G_V.iShowFocusShipStyleMinScale,g_objYimaEncMap.drawShipCanvas2D,true,g_objYimaEncMap.drawShipSvgDrawer);
			if(curSelectShipScrnPo){
				var strText=null;
				if(curSelectShipInfo.strShowBoxInfoText&&curSelectShipInfo.strShowBoxInfoText!=""){
					strText=curSelectShipInfo.strShowBoxInfoText;
				}
				else{
					if(G_V.bShowShipNameOrMMsi==true){
						strText=curSelectShipInfo.shipName;
					}
					else{
						strText=curSelectShipInfo.shipMMSI;
						if(strText==""&&G_V.bNameToNullMmsi==true){
							strText=curSelectShipInfo.shipName;
						}
					}
				};
				if(strText!=null&&strText!=""){
					var arrLinePo=[];
					var arrStrText=strText.split("\n");
					var iArrTextLineCount=arrStrText.length;
					var iNameLen=0;
					for(var iTextPos=0;iTextPos<iArrTextLineCount;iTextPos++){
						var iCurLineTextLen=g6(arrStrText[iTextPos]);
						if(iCurLineTextLen>iNameLen){
							iNameLen=iCurLineTextLen;
						}
					};
					var iFrameWidth=G_V.objShowNameFrameStyle.width;
					iFrameWidth=iNameLen*9;
					var iFrameHeight=G_V.objShowNameFrameStyle.height*iArrTextLineCount;
					var iBorderWith=G_V.objShowNameFrameStyle.border;
					var strColor=G_V.objShowNameFrameStyle.color;
					var iOpacity=G_V.objShowNameFrameStyle.opacity;
					arrLinePo.push(curSelectShipScrnPo);
					arrLinePo.push({
						x:arrLinePo[0].x+parseInt(10),y:arrLinePo[0].y-30
					});
					arrLinePo.push({
						x:arrLinePo[1].x,y:arrLinePo[1].y-iFrameHeight
					});
					arrLinePo.push({
						x:arrLinePo[2].x+parseInt(iFrameWidth),y:arrLinePo[2].y
					});
					arrLinePo.push({
						x:arrLinePo[3].x,y:arrLinePo[1].y
					});
					arrLinePo.push({
						x:arrLinePo[1].x,y:arrLinePo[1].y
					});
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.SetLineStyle(iBorderWith,strColor,iOpacity);
						g_objSvgDrawClass.DrawLine(g_objYimaEncMap.drawShipSvgDrawer,arrLinePo);
						g_objSvgDrawClass.SetTextStyle(G_V.strShipInfoFont,G_V.strShipInfoColor,G_V.iShipInfoOpacity);
					}
					else{
						g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,iBorderWith,strColor,iOpacity);
						g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawShipCanvas2D,arrLinePo);
						g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawShipCanvas2D,G_V.strShipInfoFont,G_V.strShipInfoColor,G_V.iShipInfoOpacity);
					};
					if(iArrTextLineCount==1){
						if(G_V.bUseSvgDrawerOrNot){
							g_objSvgDrawClass.DrawString(g_objYimaEncMap.drawShipSvgDrawer,curSelectShipScrnPo.x+15,arrLinePo[2].y,arrStrText[0])
						}
						else{
							g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipCanvas2D,curSelectShipScrnPo.x+15,arrLinePo[1].y-5,arrStrText[0]);
						}
					}
					else{
						var iCurShowLineTextScrnY=arrLinePo[1].y-(G_V.objShowNameFrameStyle.height*(iArrTextLineCount-1));
						for(var iTextPos=0;iTextPos<iArrTextLineCount;iTextPos++){
							if(G_V.bUseSvgDrawerOrNot){
								g_objSvgDrawClass.DrawString(g_objYimaEncMap.drawShipSvgDrawer,curSelectShipScrnPo.x+15,iCurShowLineTextScrnY-15,arrStrText[iTextPos]);
							}
							else{
								g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipCanvas2D,curSelectShipScrnPo.x+15,iCurShowLineTextScrnY,arrStrText[iTextPos]);
							};
							iCurShowLineTextScrnY=parseInt(iCurShowLineTextScrnY)+parseInt(G_V.objShowNameFrameStyle.height-3);
						}
					}
				}
			}
		};
		if(followShipDrawScrnPo){
			if(G_V.bUseSvgDrawerOrNot){
				this.DrawOneShip(curFollowShipInfo,null,null,G_V.iShowFocusShipStyleMinScale,g_objYimaEncMap.drawShipCanvas2D,false,g_objYimaEncMap.drawShipSvgDrawer);
				g_objSvgDrawClass.SetLineStyle(1,"#FF0000",100);
				g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipSvgDrawer,followShipDrawScrnPo.x,followShipDrawScrnPo.y,20,false);
				g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipSvgDrawer,followShipDrawScrnPo.x,followShipDrawScrnPo.y,24,false);
				g_objSvgDrawClass.SetLineStyle(2,"#FFFF00",60);
				g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipSvgDrawer,followShipDrawScrnPo.x,followShipDrawScrnPo.y,22,false);
			}
			else{
				this.DrawOneShip(curFollowShipInfo,null,null,G_V.iShowFocusShipStyleMinScale,g_objYimaEncMap.drawShipCanvas2D,false);
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,1,"#FF0000",100);
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipCanvas2D,followShipDrawScrnPo.x,followShipDrawScrnPo.y,20,false);
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipCanvas2D,followShipDrawScrnPo.x,followShipDrawScrnPo.y,24,false);
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipCanvas2D,2,"#FFFF00",60);
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipCanvas2D,followShipDrawScrnPo.x,followShipDrawScrnPo.y,22,false);
			}
		};
		this.ShowShipInfoDivBox();
		this.bDrawShipCanvas=true;
	};
	this.CheckOnlyShowShipInObject=function(shipGeoPoX,shipGeoPoY){
		var bResult=true;
		if(G_V.m_bCheckShipShowByObect){
			for(var i=0;i<G_V.m_arrObjForShowShip.length;i++){
				var layerPos=g_objManObjClass.GetLayerPosById(G_V.m_arrObjForShowShip[i].layerId);
				var objPos=g_objManObjClass.GetObjectPosById(G_V.m_arrObjForShowShip[i].objId,layerPos);
				var curObjInfo=g_objManObjClass.GetObjectInfoByPos(objPos.iLayerPos,objPos.iObjPos);
				if(curObjInfo){
					if(curObjInfo.objType==LAYER_TYPE.face){
						var bSelResult=l7(shipGeoPoX,shipGeoPoY,curObjInfo.arrGeoPo,curObjInfo.minGeoX,curObjInfo.maxGeoX,curObjInfo.minGeoY,curObjInfo.maxGeoY);
						if(bSelResult==true){
							bResult=true;
							break;
						}
						else{
							bResult=false;
						}
					}
					else if(curObjInfo.objType==LAYER_TYPE.rect){
						if(shipGeoPoX>curObjInfo.maxGeoX||shipGeoPoX<curObjInfo.minGeoX||shipGeoPoY>curObjInfo.maxGeoY||shipGeoPoY<curObjInfo.minGeoY){
							bResult=false;
						}
						else{
							bResult=true;
							break;
						}
					}
					else if(curObjInfo.objType==LAYER_TYPE.circle){
						var lon1=parseFloat(shipGeoPoX/G_V.UNI_GEO_COOR_MULTI_FACTOR);
						var lat1=parseFloat(shipGeoPoY/G_V.UNI_GEO_COOR_MULTI_FACTOR);
						var lon2=parseFloat(curObjInfo.arrGeoPo[0].x/G_V.UNI_GEO_COOR_MULTI_FACTOR);
						var lat2=parseFloat(curObjInfo.arrGeoPo[0].y/G_V.UNI_GEO_COOR_MULTI_FACTOR);
						var disKm=k9(lon1,lat1,lon2,lat2);
						if(curObjInfo.circleR>disKm){
							bResult=true;
							break;
						}
						else{
							bResult=false;
						}
					}
				}
			}
		};
		return bResult;
	};
	this.ClearShipHistroyTrackCanvas=function(){
		if(G_V.bIsPlayShipHistoryTrack==true&&G_V.bDrawCurShipAndPlayHistoryTrackShip==false){
			this.arrDrawInScrnShipInfo=null;
			this.arrDrawInScrnShipInfo=[];
		};
		g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawShipHistoryTrackCanvas,g_objYimaEncMap.drawShipHistoryTrackCanvas2D);
		this.bDrawShipHistroyTrackCanvas=false;
		if(G_V.bUseSvgDrawerOrNot==true){
			g_objSvgDrawClass.ClearSvg(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer);
		}
	};
	this.DrawAllShipHistroyTrack=function(){
		if(G_V.bIsPlayShipHistoryTrack==false){
			return;
		};
		if(G_V.bCurIsShowShipOrNot==false){
			return;
		};
		if(G_V.iStartShowShipScale<G_V.iCurScale){
			return;
		};
		if(g_objYimaEncMap.bMouseDownOrNot){
			return;
		};
		var iShipCount=g_objManHistoryTrackClass.arrShipInfo.length;
		if(iShipCount==0){
			return;
		};
		var curSelectShipInfo=null;
		var curMapViewGeo=a6();
		var minGeoX=curMapViewGeo.minGeoX;
		var maxGeoX=curMapViewGeo.maxGeoX;
		var minGeoY=curMapViewGeo.minGeoY;
		var maxGeoY=curMapViewGeo.maxGeoY;
		var iShipStateCount=G_V.arrShipStateInfo.length;
		var bSetDrawCanvasStyleOrNot=false;
		var arrShipSelectBoxScrnPo=null;
		var iAreaCount=g_objManHistoryTrackClass.arrPlayAreaInfo.length;
		var followShipDrawScrnPo=null;
		var curFollowShipInfo=null;
		var arrCurDrawShipInfo=[];
		if(iAreaCount>0){
			g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,2,"#FF0000",60);
			for(var iAreaPos=0;iAreaPos<iAreaCount;iAreaPos++){
				var arrDrawAreaScrnPo=a3(g_objManHistoryTrackClass.arrPlayAreaInfo[iAreaPos].arrGeoPo,true);
				g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,"#fdf352",60);
				var objType=g_objManHistoryTrackClass.arrPlayAreaInfo[iAreaPos].objType;
				if(G_V.bUseSvgDrawerOrNot){
					g_objSvgDrawClass.SetTextStyle("25px 黑体","#FF0000",90);
				}
				else{
					g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,"25px 黑体","#FF0000",90);
				};
				var drawTextPo=arrDrawAreaScrnPo[0];
				if(parseInt(objType)==parseInt(MAP_MOUSE_STATE.drawCircle)){
					var circleR=parseInt(arrDrawAreaScrnPo[1].x-arrDrawAreaScrnPo[0].x);
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,arrDrawAreaScrnPo[0].x,arrDrawAreaScrnPo[0].y,circleR,true);
					}
					else{
						g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrDrawAreaScrnPo[0].x,arrDrawAreaScrnPo[0].y,circleR,true);
					}
				}
				else{
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.DrawPolygon(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,arrDrawAreaScrnPo,true);
					}
					else{
						g_objHtml5DrawClass.DrawPolygon(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrDrawAreaScrnPo,true);
					};
					drawTextPo=l1(arrDrawAreaScrnPo);
				};
				if(G_V.bUseSvgDrawerOrNot){
					g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,drawTextPo.x-50,drawTextPo.y-10,g_objManHistoryTrackClass.arrPlayAreaInfo[iAreaPos].showText);
				}
				else{
					g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,drawTextPo.x-50,drawTextPo.y-10,g_objManHistoryTrackClass.arrPlayAreaInfo[iAreaPos].showText);
				}
			}
		};
		var arrThreeSymbolPo=[];
		arrThreeSymbolPo.push({
			x:0,y:-8
		});
		arrThreeSymbolPo.push({
			x:-3,y:5
		});
		arrThreeSymbolPo.push({
			x:3,y:5
		});
		var strCircleColor="";
		for(var iShipStatePos=0;iShipStatePos<iShipStateCount;iShipStatePos++){
			var curShipStyle=null;
			var iShipStyleCount=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle.length;
			if(G_V.iDrawCircleShipMaxScale>G_V.iCurScale){
				for(var iShipStylePos=0;iShipStylePos<iShipStyleCount;iShipStylePos++){
					if(G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos].minShowScale-1<G_V.iCurScale&&G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos].maxShowScale>G_V.iCurScale){
						curShipStyle=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos];
						break;
					}
				};
				if(curShipStyle!=null){
					var borderSize=curShipStyle.borderSize;
					var borderColor=curShipStyle.borderColor;
					var fillColor=curShipStyle.fillColor;
					var iOpacity=curShipStyle.iOpacity;
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.SetLineStyle(borderSize,borderColor,iOpacity);
						g_objSvgDrawClass.SetFillStyle(fillColor,iOpacity);
					}
					else{
						g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,borderSize,borderColor,iOpacity);
						g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,fillColor,iOpacity);
					}
				}
			}
			else{
				if(G_V.strCircleShipColor){
					strCircleColor=G_V.strCircleShipColor;
				}
				else{
					var maxShowScale=0;
					for(var iShipStylePos=0;iShipStylePos<iShipStyleCount;iShipStylePos++){
						if(iShipStylePos==0){
							maxShowScale=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[0].maxShowScale;
							strCircleColor=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[0].fillColor;
						}
						else if(maxShowScale<G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos].maxShowScale){
							curShipStyle=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos];
							strCircleColor=G_V.arrShipStateInfo[iShipStatePos].arrShipStyle[iShipStylePos].fillColor;
							break;
						}
					}
				}
			};
			for(var iShipPos=0;iShipPos<iShipCount;iShipPos++){
				if(g_objManHistoryTrackClass.arrShipInfo[iShipPos].iShipState!=G_V.arrShipStateInfo[iShipStatePos].iState){
					continue;
				};
				var bSelectShipOrNot=false;
				var curShipInfo=g_objManHistoryTrackClass.arrShipInfo[iShipPos];
				if(curShipInfo.shipId==g_objManHistoryTrackClass.iCurSelectShipId){
					bSelectShipOrNot=true;
					curSelectShipInfo=curShipInfo;
				};
				var iNextPlayHistoryTrackPos=curShipInfo.iNextPlayHistoryTrackPos;
				if(iNextPlayHistoryTrackPos==0){
					continue;
				};
				var curShipGeoPo={
					x:curShipInfo.shipGeoPoX,y:curShipInfo.shipGeoPoY
				};
				if(iAreaCount>0&&curShipInfo.shipId!=g_objManHistoryTrackClass.iCurFollowShipId){
					var bShipInArea=false;
					for(var iAreaPos=0;iAreaPos<iAreaCount;iAreaPos++){
						var curAreaInfo=g_objManHistoryTrackClass.arrPlayAreaInfo[iAreaPos];
						if(parseInt(curAreaInfo.objType)==parseInt(MAP_MOUSE_STATE.drawCircle)){
							bShipInArea=l6(curShipGeoPo.x,curShipGeoPo.y,curAreaInfo.arrGeoPo[0].x,curAreaInfo.arrGeoPo[0].y,curAreaInfo.circleR,curAreaInfo.minGeoX,curAreaInfo.maxGeoX,curAreaInfo.minGeoY,curAreaInfo.maxGeoY)
						}
						else{
							bShipInArea=l7(curShipGeoPo.x,curShipGeoPo.y,curAreaInfo.arrGeoPo,curAreaInfo.minGeoX,curAreaInfo.maxGeoX,curAreaInfo.minGeoY,curAreaInfo.maxGeoY);
						};
						if(bShipInArea==true){
							break;
						}
					};
					if(bShipInArea==false){
						continue;
					}
				};
				var curShipScrnPo=a2(curShipGeoPo,true);
				if(curShipInfo.shipId==g_objManHistoryTrackClass.iCurFollowShipId){
					curFollowShipInfo=curShipInfo;
					followShipDrawScrnPo={
						x:curShipScrnPo.x,y:curShipScrnPo.y
					};
				};
				if(G_V.iShowShipHistroyTrackScale>G_V.iCurScale){
					if(curShipInfo.bShowTrack==true&&curShipInfo.arrShipTrackPoints.length>1){
						bSetDrawCanvasStyleOrNot=true;
						var arrGeoPo=[];
						var iTrackCount=curShipInfo.arrShipTrackPoints.length;
						for(var iTrackPos=0;iTrackPos<iTrackCount;iTrackPos++){
							if(iNextPlayHistoryTrackPos>iTrackPos){
								var curPo=[];
								curPo.x=curShipInfo.arrShipTrackPoints[iTrackPos].trackGeoPoX;
								curPo.y=curShipInfo.arrShipTrackPoints[iTrackPos].trackGeoPoY;
								arrGeoPo.push(curPo);
							}
							else{
								break;
							}
						};
						var iArrPocount=arrGeoPo.length;
						var arrDrawTrackScrnPo=[];
						if(iArrPocount>1){
							var arrTrackScrnPo=a3(arrGeoPo,true);
							var arrCurDrawTrackPo=[];
							var checkScrnLen=10;
							var arrTrackInfo=[];
							for(var i=0;i<iArrPocount;i++){
								var iDrawCount=arrDrawTrackScrnPo.length;
								var bAddTrack=true;
								for(var j=0;j<iDrawCount;j++){
									var offsetX=arrDrawTrackScrnPo[j].x-arrTrackScrnPo[i].x;
									var offsetY=arrDrawTrackScrnPo[j].y-arrTrackScrnPo[i].y;
									if(offsetX>-checkScrnLen&&offsetX<checkScrnLen&&offsetY>-checkScrnLen&&offsetY<checkScrnLen){
										bAddTrack=false;
										break;
									}
								};
								if(bAddTrack==true||i==iArrPocount-1){
									arrDrawTrackScrnPo.push(arrTrackScrnPo[i]);
									if(i<iArrPocount){
										this.arrDrawInScrnShipInfo.push({
											id:curShipInfo.shipId,po:arrTrackScrnPo[i],mmsi:curShipInfo.shipMMSI,name:curShipInfo.shipName,iTrackPos:i,bSelPlayTrackShip:true
										});
									};
									arrTrackInfo.push(curShipInfo.arrShipTrackPoints[i])
								}
							};
							if(G_V.bShowShipHistroyTrackInfoBox){
								this.DrawShipTrackInfoBox(arrTrackInfo,arrDrawTrackScrnPo)
							};
							g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,curShipInfo.strTrackColor,80);
							g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,1.5,curShipInfo.strTrackColor,80);
							g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrDrawTrackScrnPo);
							g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,1,curShipInfo.strTrackColor,80);
							if(G_V.bShowHistoryTrackDirectionSign==true){
								for(var iLinePos=1;iLinePos<arrDrawTrackScrnPo.length;iLinePos++){
									var startPo=arrDrawTrackScrnPo[iLinePos-1];
									var endPo=arrDrawTrackScrnPo[iLinePos];
									var centerPo={
										x:parseInt((startPo.x+endPo.x)/ 2), y: parseInt((startPo.y + endPo.y) /2)
									};
									var offsetY=startPo.y-endPo.y;
									var offsetX=endPo.x-startPo.x;
									if(offsetY*offsetY+offsetX*offsetX<500){
										continue;
									};
									var angle=0;
									if(endPo.x-startPo.x==0){
										if(endPo.y>startPo.y){
											angle=90;
										}
										else{
											angle=-90;
										}
									}
									else{
										var angleTan=(startPo.y-endPo.y)/(endPo.x-startPo.x);
										angle=Math.atan(angleTan)/Math.PI*180;
									};
									if(offsetX>0){
										angle=90-angle;
									}
									else{
										angle=270-angle;
									};
									var arrDrawShipScrnPo=a4(arrThreeSymbolPo,centerPo,angle);
									g_objHtml5DrawClass.DrawPolygon(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrDrawShipScrnPo,true);
								}
							};
							g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,"#FFFFFF",100);
							var iDrawPoCount=arrDrawTrackScrnPo.length;
							for(var iPos=0;iPos<iDrawPoCount;iPos++){
								g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrDrawTrackScrnPo[iPos].x,arrDrawTrackScrnPo[iPos].y,2,true);
							}
						}
					}
				};
				if(G_V.iDrawCircleShipMaxScale-1<G_V.iCurScale&&bSelectShipOrNot==false){
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.SetFillStyle(strCircleColor,100);
						g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipSvgDrawer,curShipScrnPo.x,curShipScrnPo.y,G_V.iDrawCircleShipR,true);
					}
					else{
						g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,strCircleColor,100);
						g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,curShipScrnPo.x,curShipScrnPo.y,G_V.iDrawCircleShipR,true);
					}
				}
				else{
					if(curShipStyle==null){
						continue;
					};
					if(curShipStyle!=null){
						var borderSize=curShipStyle.borderSize;
						var borderColor=curShipStyle.borderColor;
						var fillColor=curShipStyle.fillColor;
						var iOpacity=curShipStyle.iOpacity;
						if(G_V.bUseSvgDrawerOrNot){
							g_objSvgDrawClass.SetLineStyle(borderSize,borderColor,iOpacity);
							g_objSvgDrawClass.SetFillStyle(fillColor,iOpacity);
						}
						else{
							g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,borderSize,borderColor,iOpacity);
							g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,fillColor,iOpacity);
						}
					};
					arrCurDrawShipInfo.push({
						id:curShipInfo.shipId,po:curShipScrnPo,name:curShipInfo.shipName,mmsi:curShipInfo.shipMMSI
					});
					var arrDrawShipScrnPo=a4(curShipStyle.arrSymbolPo,curShipScrnPo,curShipInfo.shipCourse);
					if(g_objManHistoryTrackClass.arrShipInfo[iShipPos].shipId==g_objManHistoryTrackClass.iCurSelectShipId){
						arrShipSelectBoxScrnPo=g_objManHistoryTrackClass.arrShipInfo[iShipPos];
					};
					if(bSelectShipOrNot==false){
						if(G_V.bUseSvgDrawerOrNot){
							g_objSvgDrawClass.DrawPolygon(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,arrDrawShipScrnPo,true);
						}
						else{
							g_objHtml5DrawClass.DrawPolygon(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrDrawShipScrnPo,true);
						};
						if(curShipInfo.shipSpeed>0){
							var iHeadLineLen=G_V.iDrawDefaultHeadLineLen;
							if(G_V.iDrawDefaultHeadLineScale>G_V.iCurScale){};
							var arrHeadPo=[];
							var otherPo={
								x:curShipStyle.symbolHeadPo.x,y:curShipStyle.symbolHeadPo.y-iHeadLineLen
							};
							arrHeadPo.push(curShipStyle.symbolHeadPo);
							arrHeadPo.push(otherPo);
							var arrShipHeadScrnPo=a4(arrHeadPo,curShipScrnPo,curShipInfo.shipCourse);
							if(G_V.bUseSvgDrawerOrNot){
								g_objSvgDrawClass.DrawLine(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,arrShipHeadScrnPo);
							}
							else{
								g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrShipHeadScrnPo);
							}
						};
						if(curShipInfo.shipId==g_objManHistoryTrackClass.iCurSelectShipId){
							arrShipSelectBoxScrnPo=arrDrawShipScrnPo;
						}
					}
				}
			}
		};
		if(G_V.bShowShipInfo&&G_V.iCurScale<G_V.iStartShowShipInfo){
			var drawShipCount=arrCurDrawShipInfo.length;
			var arrDrawShipInfoScrnPo=[];
			var iDrawShipInfoCount=0;
			var iFrameOffsetX=10;
			var iFrameOffsetY=10;
			if(G_V.iCurScale-1<G_V.objShowNameFrameStyle.scale){
				bDrawNameFrame=true;
				iFrameOffsetX=15;
				iFrameOffsetY=35
			};
			if(G_V.bUseSvgDrawerOrNot){
				g_objSvgDrawClass.SetTextStyle(G_V.strShipInfoFont,G_V.strShipInfoColor,G_V.iShipInfoOpacity);
			}
			else{
				g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,G_V.strShipInfoFont,G_V.strShipInfoColor,G_V.iShipInfoOpacity);
			};
			for(var i=0;i<drawShipCount;i++){
				if(arrCurDrawShipInfo[i].id==g_objManHistoryTrackClass.iCurSelectShipId){
					continue;
				};
				var bDrawOrNot=true;
				for(var iPos=0;iPos<iDrawShipInfoCount;iPos++){
					if(arrDrawShipInfoScrnPo[iPos].x-arrCurDrawShipInfo[i].po.x<15&&arrDrawShipInfoScrnPo[iPos].x-arrCurDrawShipInfo[i].po.x>-15&&arrDrawShipInfoScrnPo[iPos].y-arrCurDrawShipInfo[i].po.y<10&&arrDrawShipInfoScrnPo[iPos].y-arrCurDrawShipInfo[i].po.y>-10){
						bDrawOrNot=false;
						break;
					}
				};
				if(bDrawOrNot==false){
					continue;
				};
				var strText=null;
				if(G_V.bShowShipNameOrMMsi==true){
					strText=arrCurDrawShipInfo[i].name;
				}
				else{
					strText=arrCurDrawShipInfo[i].mmsi;
					if(strText==""&&G_V.bNameToNullMmsi==true){
						strText=arrCurDrawShipInfo[i].name;
					}
				};
				if(strText!=null&&strText!=""){
					if(G_V.iCurScale-1<G_V.objShowNameFrameStyle.scale){
						var arrLinePo=[];
						var iFrameWidth=G_V.objShowNameFrameStyle.width;
						var iFrameHeight=G_V.objShowNameFrameStyle.height;
						var iBorderWith=G_V.objShowNameFrameStyle.border;
						var strColor=G_V.objShowNameFrameStyle.color;
						var iOpacity=G_V.objShowNameFrameStyle.opacity;
						arrLinePo.push(arrCurDrawShipInfo[i].po);
						arrLinePo.push({
							x:arrLinePo[0].x+parseInt(10),y:arrLinePo[0].y-30
						});
						arrLinePo.push({
							x:arrLinePo[1].x,y:arrLinePo[1].y-iFrameHeight
						});
						arrLinePo.push({
							x:arrLinePo[2].x+parseInt(iFrameWidth),y:arrLinePo[2].y
						});
						arrLinePo.push({
							x:arrLinePo[3].x,y:arrLinePo[1].y
						});
						arrLinePo.push({
							x:arrLinePo[1].x,y:arrLinePo[1].y
						});
						if(G_V.bUseSvgDrawerOrNot){
							g_objSvgDrawClass.SetLineStyle(iBorderWith,strColor,iOpacity);
							g_objSvgDrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,arrCurDrawShipInfo[i].po.x+iFrameOffsetX,arrCurDrawShipInfo[i].po.y-iFrameOffsetY,strText);
							g_objSvgDrawClass.DrawLine(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,arrLinePo);
						}
						else{
							g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,iBorderWith,strColor,iOpacity);
							g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrCurDrawShipInfo[i].po.x+iFrameOffsetX,arrCurDrawShipInfo[i].po.y-iFrameOffsetY,strText);
							g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrLinePo);
						}
					}
					else{
						if(G_V.bUseSvgDrawerOrNot){
							g_objSvgDrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,arrCurDrawShipInfo[i].po.x+iFrameOffsetX,arrCurDrawShipInfo[i].po.y+iFrameOffsetY,strText);
						}
						else{
							g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrCurDrawShipInfo[i].po.x+iFrameOffsetX,arrCurDrawShipInfo[i].po.y+iFrameOffsetY,strText);
						}
					};
					arrDrawShipInfoScrnPo.push(arrCurDrawShipInfo[i].po);
					iDrawShipInfoCount++;
				}
			}
		};
		if(curSelectShipInfo!=null){
			var curSelectShipScrnPo=this.DrawOneShip(curSelectShipInfo,null,null,G_V.iShowFocusShipStyleMinScale,g_objYimaEncMap.drawShipHistoryTrackCanvas2D,true,g_objYimaEncMap.drawShipHistoryTrackSvgDrawer);
			if(curSelectShipScrnPo){
				var strText=null;
				if(G_V.bShowShipNameOrMMsi==true){
					strText=curSelectShipInfo.shipName;
				}
				else{
					strText=curSelectShipInfo.shipMMSI;
					if(strText==""&&G_V.bNameToNullMmsi==true){
						strText=curSelectShipInfo.shipName;
					}
				};
				if(strText!=null&&strText!=""){
					var arrLinePo=[];
					var iFrameWidth=G_V.objShowNameFrameStyle.width;
					var iFrameHeight=G_V.objShowNameFrameStyle.height;
					var iBorderWith=G_V.objShowNameFrameStyle.border;
					var strColor=G_V.objShowNameFrameStyle.color;
					var iOpacity=G_V.objShowNameFrameStyle.opacity;
					arrLinePo.push(curSelectShipScrnPo);
					arrLinePo.push({
						x:arrLinePo[0].x+parseInt(10),y:arrLinePo[0].y-30
					});
					arrLinePo.push({
						x:arrLinePo[1].x,y:arrLinePo[1].y-iFrameHeight
					});
					arrLinePo.push({
						x:arrLinePo[2].x+parseInt(iFrameWidth),y:arrLinePo[2].y
					});
					arrLinePo.push({
						x:arrLinePo[3].x,y:arrLinePo[1].y
					});
					arrLinePo.push({
						x:arrLinePo[1].x,y:arrLinePo[1].y
					});
					if(G_V.bUseSvgDrawerOrNot){
						g_objSvgDrawClass.SetTextStyle(G_V.strShipInfoFont,G_V.strShipInfoColor,G_V.iShipInfoOpacity);
						g_objSvgDrawClass.SetLineStyle(iBorderWith,strColor,iOpacity);
						g_objSvgDrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,curSelectShipScrnPo.x+15,curSelectShipScrnPo.y-50,strText);
						g_objSvgDrawClass.DrawLine(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,arrLinePo);
					}
					else{
						g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,G_V.strShipInfoFont,G_V.strShipInfoColor,G_V.iShipInfoOpacity);
						g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,iBorderWith,strColor,iOpacity);
						g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,curSelectShipScrnPo.x+15,curSelectShipScrnPo.y-35,strText);
						g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrLinePo);
					}
				}
			}
		};
		if(followShipDrawScrnPo){
			if(G_V.bUseSvgDrawerOrNot){
				this.DrawOneShip(curFollowShipInfo,null,null,G_V.iShowFocusShipStyleMinScale,g_objYimaEncMap.drawShipHistoryTrackCanvas2D,false,g_objYimaEncMap.drawShipHistoryTrackSvgDrawer);
				g_objSvgDrawClass.SetLineStyle(1,"#FF0000",100);
				g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,followShipDrawScrnPo.x,followShipDrawScrnPo.y,20,false);
				g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,followShipDrawScrnPo.x,followShipDrawScrnPo.y,24,false);
				g_objSvgDrawClass.SetLineStyle(2,"#FFFF00",60);
				g_objSvgDrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackSvgDrawer,followShipDrawScrnPo.x,followShipDrawScrnPo.y,22,false);
			}
			else{
				this.DrawOneShip(curFollowShipInfo,null,null,G_V.iShowFocusShipStyleMinScale,g_objYimaEncMap.drawShipHistoryTrackCanvas2D,false);
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,1,"#FF0000",100);
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,followShipDrawScrnPo.x,followShipDrawScrnPo.y,20,false);
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,followShipDrawScrnPo.x,followShipDrawScrnPo.y,24,false);
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,2,"#FFFF00",60);
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,followShipDrawScrnPo.x,followShipDrawScrnPo.y,22,false);
			}
		};
		this.bDrawShipHistroyTrackCanvas=true;
	};
	this.CheckDrawShip=function(scrnX,scrnY,checkScrnDis){
		var iDrawInScrnShipCount=this.arrDrawInScrnShipInfo.length;
		for(var i=0;i<iDrawInScrnShipCount;i++){
			if(Math.abs(this.arrDrawInScrnShipInfo[i].po.x-scrnX)<checkScrnDis&&Math.abs(this.arrDrawInScrnShipInfo[i].po.y-scrnY)<checkScrnDis){
				return false;
			}
		};
		return true;
	};
	this.DrawShipTrackInfoBox=function(arrTrackInfo,arrScrnPo){
		var trackCount=arrTrackInfo.length;
		var lastTackScrnPo={
			x:0,y:0
		};
		for(var i=0;i<trackCount;i++){
			var rectScrnPo={
				x:arrScrnPo[i].x+20,y:arrScrnPo[i].y
			};
			if(Math.abs(lastTackScrnPo.x-rectScrnPo.x)<150&&Math.abs(lastTackScrnPo.y-rectScrnPo.y)<40){
				continue
			};
			lastTackScrnPo.x=rectScrnPo.x;
			lastTackScrnPo.y=rectScrnPo.y;
			g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,"#FFFFFF",60);
			g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,1,"#000000",60);
			if(G_V.bShowTrackPoSpeedCourse){
				g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,rectScrnPo.x,rectScrnPo.y,160,42,true);
			}
			else{
				g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,rectScrnPo.x,rectScrnPo.y,120,42,true);
			};
			g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,"11px Courier New","#000000",80);
			var arrPoints=[];
			arrPoints.push(arrScrnPo[i]);
			arrPoints.push(rectScrnPo);
			g_objHtml5DrawClass.DrawDashedLine(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,arrPoints,2,2);
			var trackTexttScrnPo={
				x:rectScrnPo.x+5,y:rectScrnPo.y+12
			};
			var strTrackText;
			var lon=parseFloat(arrTrackInfo[i].trackGeoPoX)/10000000;
			var lat=parseFloat(arrTrackInfo[i].trackGeoPoY)/10000000;
			var speed=arrTrackInfo[i].trackSpeed;
			var course=arrTrackInfo[i].trackCourse;
			var strTime=arrTrackInfo[i].trackTime;
			strTrackText="经度:"+lon.toFixed(3)+"度";
			if(G_V.bShowTrackPoSpeedCourse){
				strTrackText+="  航速:"+speed.toFixed(2)+"节";
			};
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,trackTexttScrnPo.x,trackTexttScrnPo.y,strTrackText);
			trackTexttScrnPo.y=trackTexttScrnPo.y+13;
			strTrackText="纬度:"+lat.toFixed(4)+"度";
			if(G_V.bShowTrackPoSpeedCourse){
				strTrackText+="  航向:"+course.toFixed(2)+"度";
			};
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,trackTexttScrnPo.x,trackTexttScrnPo.y,strTrackText);
			trackTexttScrnPo.y=trackTexttScrnPo.y+13;
			strTrackText="时间:"+strTime;
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawShipHistoryTrackCanvas2D,trackTexttScrnPo.x,trackTexttScrnPo.y,strTrackText)
		}
	};
	this.ClearDrawMouseMoveSelObjCanvas=function(){
		if(this.bDrawMouseMoveSelObjCanvas){
			g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawMouseMoveSelObjCanvas,g_objYimaEncMap.drawMouseMoveSelObjCanvas2D);
			this.bDrawMouseMoveSelObjCanvas=false;
		}
	};
	this.DrawSelectRectByMouseMove=function(scrnPo,rectSize){
		g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawMouseMoveSelObjCanvas2D,2,"#FF0000",80);
		g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawMouseMoveSelObjCanvas2D,scrnPo.x-2,scrnPo.y-2,rectSize.w+4,rectSize.h+4,false);
		this.bDrawMouseMoveSelObjCanvas=true;
	};
	this.SelectScrnPointObjInfo=function(curScrnPo){
		var iScrnPointCount=this.arrDrawInScrnObjInfo.length;
		var selectPointObj=null;
		var checkScrnPo={
			x:curScrnPo.x-G_V.drawObjCanvasPo.x,y:curScrnPo.y-G_V.drawObjCanvasPo.y
		};
		for(var i=0;i<iScrnPointCount;i++){
			if(this.arrDrawInScrnObjInfo[i].po==null){
				continue;
			};
			var scrnPo=this.arrDrawInScrnObjInfo[i].po;
			var imgSizeX=this.arrDrawInScrnObjInfo[i].w;
			var imgSizeY=this.arrDrawInScrnObjInfo[i].h;
			if(scrnPo.x-checkScrnPo.x>-imgSizeX&&scrnPo.x-checkScrnPo.x<0&&scrnPo.y-checkScrnPo.y>-imgSizeY&&scrnPo.y-checkScrnPo.y<0){
				selectPointObj={
					layerId:this.arrDrawInScrnObjInfo[i].layerId,objId:this.arrDrawInScrnObjInfo[i].objId
				};
				this.ClearDrawMouseMoveSelObjCanvas(scrnPo,{
					w:imgSizeX,h:imgSizeY
				});
				this.DrawSelectRectByMouseMove(scrnPo,{
					w:imgSizeX,h:imgSizeY
				});
				break;
			}
		};
		return selectPointObj;
	};
	this.ClearObjCanvas=function(){
		this.arrDrawInScrnObjInfo=null;
		this.arrDrawInScrnObjInfo=[];
		if(this.bDrawObjCanvas){
			g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawObjectCanvas,g_objYimaEncMap.drawObjectCanvas2D);
			g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawObjectCanvas,g_objYimaEncMap.drawObjectOnShipCanvas2D);
			this.bDrawObjCanvas=false;
		};
		g_objManObjClass.arrCurScrnShowObjPos=[]
	};
	this.DrawAllObject=function(){
		if(G_V.bShowObjectOrNot==false){
			return false;
		};
		var iLayerCount=g_objManObjClass.arrLayerInfo.length;
		if(iLayerCount==0){
			return;
		};
		var iDrawImgCountTest=0;
		var leftTopLonLatPo=k6(0-G_V.dragMapLayerOriginPo.x,0-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
		var rightButtomLonLatPo=k6(G_V.iMapViewWidth-G_V.dragMapLayerOriginPo.x,G_V.iMapViewHeight-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
		var minGeoX=parseInt(leftTopLonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR);
		var maxGeoX=parseInt(rightButtomLonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR);
		var minGeoY=parseInt(rightButtomLonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR);
		var maxGeoY=parseInt(leftTopLonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR);
		for(var iLayerPos=0;iLayerPos<iLayerCount;iLayerPos++){
			if(g_objManObjClass.arrLayerInfo[iLayerPos].bShow==false){
				continue;
			}
			else if(g_objManObjClass.arrLayerInfo[iLayerPos].minShowScale>G_V.iCurScale||g_objManObjClass.arrLayerInfo[iLayerPos].maxShowScale<G_V.iCurScale){
				continue;
			};
			var iObjCount=g_objManObjClass.arrLayerInfo[iLayerPos].arrObjInfo.length;
			if(iObjCount==0){
				continue;
			};
			var iStartShowTextScale=g_objManObjClass.arrLayerInfo[iLayerPos].iStartShowTextScale;
			var iLastDrawStylePos=-1;
			var bResetCanvasStyle=false;
			var arrLayerStyle=g_objManObjClass.arrLayerInfo[iLayerPos].arrStyle;
			var curDrawStyle=null;
			var layerId=g_objManObjClass.arrLayerInfo[iLayerPos].id;
			var curDrawObjectCanvas2D;
			if(g_objManObjClass.arrLayerInfo[iLayerPos].bDrawOnShipCanves){
				curDrawObjectCanvas2D=g_objYimaEncMap.drawObjectOnShipCanvas2D;
			}
			else{
				curDrawObjectCanvas2D=g_objYimaEncMap.drawObjectCanvas2D;
			};
			var arrCurDrawPointObjScrnPo=[];
			var curLayerInfo=g_objManObjClass.arrLayerInfo[iLayerPos];
			var arrCurDrawPoincurLayerInfotObjScrnPo=[];
			for(var iObjPos=0;iObjPos<iObjCount;iObjPos++){
				var curObjInfo=g_objManObjClass.arrLayerInfo[iLayerPos].arrObjInfo[iObjPos];
				if(iLastDrawStylePos!=curObjInfo.layerStylePos){
					curDrawStyle=arrLayerStyle[curObjInfo.layerStylePos];
					iLastDrawStylePos=curObjInfo.layerStylePos;
					bResetCanvasStyle=true;
				};
				if(curObjInfo.bGetOwnStyle==true&&curObjInfo.style!=null){
					curDrawStyle=curObjInfo.style;
					iLastDrawStylePos=-1;
					bResetCanvasStyle=true;
				};
				if(curDrawStyle==null){
					continue;
				};
				this.bDrawObjCanvas=true;
				var drawPointScrnPo=null;
				var drawPointW=null;
				var drawPointH=null;
				var bDrawText=true;
				var drawNameScrnPo=[];
				var bCurObjDraw=false;
				switch(g_objManObjClass.arrLayerInfo[iLayerPos].type){
					case LAYER_TYPE.point:var bCurPointSel=false;
					if(g_objManObjClass.m_curHighLightObjIds&&g_objManObjClass.m_curHighLightObjIds.layerId==layerId&&g_objManObjClass.m_curHighLightObjIds.objId==curObjInfo.id){
						bResetCanvasStyle=true;
						bCurPointSel=true;
						var borderSize=g_objManObjClass.m_curHighLightStyle.borderWith;
						var borderColor=g_objManObjClass.m_curHighLightStyle.borderColor;
						var iOpacity=g_objManObjClass.m_curHighLightStyle.iOpacity;
						var fillColor=g_objManObjClass.m_curHighLightStyle.fillColor;
						g_objHtml5DrawClass.SetLineStyle(curDrawObjectCanvas2D,borderSize,borderColor,iOpacity);
						g_objHtml5DrawClass.SetFillStyle(curDrawObjectCanvas2D,fillColor,iOpacity);
					}
					else{
						var borderSize=curDrawStyle.borderWith;
						var borderColor=curDrawStyle.borderColor;
						var iOpacity=curDrawStyle.iOpacity;
						var fillColor=curDrawStyle.fillColor;
						g_objHtml5DrawClass.SetLineStyle(curDrawObjectCanvas2D,borderSize,borderColor,iOpacity);
						g_objHtml5DrawClass.SetFillStyle(curDrawObjectCanvas2D,fillColor,iOpacity);
					};
					var arrScrnFacePo=a3(curObjInfo.arrGeoPo,true);
					var iImgWidth=curDrawStyle.iImgWidth;
					var iImgHeight=curDrawStyle.iImgHeight;
					var drawScrnPo=arrScrnFacePo[0];
					if(curDrawStyle.bShowImg){
						drawScrnPo={
							x:arrScrnFacePo[0].x-iImgWidth/ 2, y: arrScrnFacePo[0].y - iImgHeight /2
						};
						if(curDrawStyle.offsetScrnPo){
							drawScrnPo.x=parseInt(drawScrnPo.x)+parseInt(curDrawStyle.offsetScrnPo.x);
							drawScrnPo.y=parseInt(drawScrnPo.y)+parseInt(curDrawStyle.offsetScrnPo.y);
						}
					};
					var iCheckCount=arrCurDrawPointObjScrnPo.length;
					var iCheckLen=curDrawStyle.iCheckDrawMinNearOtherLen;
					if(iCheckLen==null||iCheckLen==undefined){
						iCheckLen=5;
					};
					var bDrawCurPointObj=true;
					for(var iCheckPos=0;iCheckPos<iCheckCount;iCheckPos++){
						var checkLenSize={
							x:drawScrnPo.x-arrCurDrawPointObjScrnPo[iCheckPos].x,y:drawScrnPo.y-arrCurDrawPointObjScrnPo[iCheckPos].y
						};
						if(checkLenSize.x>-iCheckLen&&checkLenSize.x<iCheckLen&&checkLenSize.y>-iCheckLen&&checkLenSize.y<iCheckLen){
							bDrawCurPointObj=false;
							break;
						}
					};
					if(bDrawCurPointObj==false){
						continue;
					};
					if(curDrawStyle.bShowImg&&curDrawStyle.strImgSrc!=undefined&&curDrawStyle.strImgSrc!=""&&curDrawStyle.strImgSrc!=null){
						curDrawStyle.checkImg();
						g_objHtml5DrawClass.DrawImg(curDrawObjectCanvas2D,drawScrnPo.x,drawScrnPo.y,curDrawStyle.img);
						drawPointScrnPo=drawScrnPo;
						drawPointW=curDrawStyle.iImgWidth;
						drawPointH=curDrawStyle.iImgHeight;
						if(bCurPointSel){
							g_objHtml5DrawClass.DrawRect(curDrawObjectCanvas2D,drawScrnPo.x-2,drawScrnPo.y-2,drawPointW+4,drawPointH+4,false);
						}
					}
					else if(curDrawStyle.arrSymbolPo!=null&&parseInt(curDrawStyle.arrSymbolPo.length)>0){
						var bFillColor=curDrawStyle.bFilled;
						var drawPointObjSymbolArrPo=a4(curDrawStyle.arrSymbolPo,drawScrnPo,curObjInfo.rotationAngle);
						g_objHtml5DrawClass.DrawPolygon(curDrawObjectCanvas2D,drawPointObjSymbolArrPo,bFillColor);
						drawPointW=Math.abs(drawScrnPo.x-drawPointObjSymbolArrPo[0].x);
						drawPointH=Math.abs(drawScrnPo.y-drawPointObjSymbolArrPo[0].y);
					}
					else{
						if(curDrawStyle.iCircleScrnR==null||parseInt(curDrawStyle.iCircleScrnR)<1){
							curDrawStyle.iCircleScrnR=5
						};
						var bFillColor=curDrawStyle.bFilled;
						g_objHtml5DrawClass.DrawCircle(curDrawObjectCanvas2D,drawScrnPo.x,drawScrnPo.y,curDrawStyle.iCircleScrnR,bFillColor);
						drawPointW=curDrawStyle.iCircleScrnR;
						drawPointH=curDrawStyle.iCircleScrnR;
						drawPointScrnPo={
							x:drawScrnPo.x-drawPointW/ 2, y: drawScrnPo.y - drawPointH /2
						};
					};
					drawNameScrnPo={
						x:drawScrnPo.x,y:drawScrnPo.y
					};
					arrCurDrawPointObjScrnPo.push({
						x:drawScrnPo.x,y:drawScrnPo.y
					});
					bCurObjDraw=true;
					break;
					case LAYER_TYPE.line:var arrScrnLinePo=a3(curObjInfo.arrGeoPo,true);
					var lineAreaSizeM=parseFloat(curObjInfo.fLineAreaSizeM);
					if(lineAreaSizeM>0){
						var lonLat1=k6(0-G_V.dragMapLayerOriginPo.x,0-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
						var lonLat2=k6(300-G_V.dragMapLayerOriginPo.x,400-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
						var disKm=k9(lonLat1.x,lonLat1.y,lonLat2.x,lonLat2.y);
						var iAreaScrnSize=(500/(disKm*1000))*lineAreaSizeM;
						var iMaxPos=arrScrnLinePo.length-1;
						g_objHtml5DrawClass.SetLineStyle(curDrawObjectCanvas2D,1,G_V.objLineAreaStyle.color,G_V.objLineAreaStyle.opacity);
						g_objHtml5DrawClass.SetFillStyle(curDrawObjectCanvas2D,G_V.objLineAreaStyle.color,G_V.objLineAreaStyle.opacity);
						g_objHtml5DrawClass.DrawCircle(curDrawObjectCanvas2D,arrScrnLinePo[0].x,arrScrnLinePo[0].y,iAreaScrnSize,true);
						g_objHtml5DrawClass.DrawCircle(curDrawObjectCanvas2D,arrScrnLinePo[iMaxPos].x,arrScrnLinePo[iMaxPos].y,iAreaScrnSize,true);
						g_objHtml5DrawClass.SetLineStyle(curDrawObjectCanvas2D,iAreaScrnSize*2,G_V.objLineAreaStyle.color,G_V.objLineAreaStyle.opacity);
						g_objHtml5DrawClass.DrawLine(curDrawObjectCanvas2D,arrScrnLinePo);
						bResetCanvasStyle=true;
					};
					if(g_objManObjClass.m_curHighLightObjIds&&g_objManObjClass.m_curHighLightObjIds.layerId==layerId&&g_objManObjClass.m_curHighLightObjIds.objId==curObjInfo.id){
						bResetCanvasStyle=true;
						var borderSize=g_objManObjClass.m_curHighLightStyle.borderWith;
						var borderColor=g_objManObjClass.m_curHighLightStyle.borderColor;
						var iOpacity=g_objManObjClass.m_curHighLightStyle.iOpacity;
						g_objHtml5DrawClass.SetLineStyle(curDrawObjectCanvas2D,borderSize,borderColor,iOpacity);
					}
					else if(bResetCanvasStyle){
						var borderSize=curDrawStyle.borderWith;
						var borderColor=curDrawStyle.borderColor;
						var iOpacity=curDrawStyle.iOpacity;
						g_objHtml5DrawClass.SetLineStyle(curDrawObjectCanvas2D,borderSize,borderColor,iOpacity);
					};
					g_objHtml5DrawClass.DrawLine(curDrawObjectCanvas2D,arrScrnLinePo);
					drawNameScrnPo={
						x:arrScrnLinePo[0].x,y:arrScrnLinePo[0].y
					};
					bCurObjDraw=true;
					break;
					case LAYER_TYPE.face:if(g_objManObjClass.m_curHighLightObjIds&&g_objManObjClass.m_curHighLightObjIds.layerId==layerId&&g_objManObjClass.m_curHighLightObjIds.objId==curObjInfo.id){
						bResetCanvasStyle=true;
						var borderSize=g_objManObjClass.m_curHighLightStyle.borderWith;
						var borderColor=g_objManObjClass.m_curHighLightStyle.borderColor;
						var fillColor=g_objManObjClass.m_curHighLightStyle.fillColor;
						var iOpacity=g_objManObjClass.m_curHighLightStyle.iOpacity;
						g_objHtml5DrawClass.SetLineStyle(curDrawObjectCanvas2D,borderSize,borderColor,iOpacity);
						g_objHtml5DrawClass.SetFillStyle(curDrawObjectCanvas2D,fillColor,iOpacity);
					}
					else{
						var borderSize=curDrawStyle.borderWith;
						var borderColor=curDrawStyle.borderColor;
						var fillColor=curDrawStyle.fillColor;
						var iOpacity=curDrawStyle.iOpacity;
						var iLineOpacity=curDrawStyle.iLineOpacity;
						g_objHtml5DrawClass.SetLineStyle(curDrawObjectCanvas2D,borderSize,borderColor,iLineOpacity);
						g_objHtml5DrawClass.SetFillStyle(curDrawObjectCanvas2D,fillColor,iOpacity);
					};
					var bFillColor=curDrawStyle.bFilled;
					var arrScrnFacePo=a3(curObjInfo.arrGeoPo,true);
					if(curObjInfo.objType==MAP_MOUSE_STATE.drawRect){
						if(arrScrnFacePo.length>0){
							var w=arrScrnFacePo[1].x-arrScrnFacePo[0].x;
							var h=arrScrnFacePo[2].y-arrScrnFacePo[0].y;
							var minScrnX=arrScrnFacePo[0].x;
							var minScrnY=arrScrnFacePo[0].y;
							var maxScrnX=arrScrnFacePo[1].x;
							var maxScrnY=arrScrnFacePo[2].y;
							if(minScrnX>G_V.iMapViewWidth+parseInt(w)+parseInt(100)||maxScrnX<-10||minScrnY>parseInt(G_V.iMapViewHeight)+parseInt(100)||maxScrnY<-10){
								continue;
							};
							if(curObjInfo.bRectImg==true&&curObjInfo.strRectImgUrl!=""){
								if(curObjInfo.iRectMinScale<G_V.iCurScale&&curObjInfo.iRectMaxScale>G_V.iCurScale){
									curObjInfo.checkRectImg();
									g_objHtml5DrawClass.DrawImg(curDrawObjectCanvas2D,arrScrnFacePo[0].x,arrScrnFacePo[0].y,curObjInfo.rectImg,w,h);
									iDrawImgCountTest++;
								}
								else{
									continue;
								}
							}
							else{
								g_objHtml5DrawClass.DrawRect(curDrawObjectCanvas2D,arrScrnFacePo[0].x,arrScrnFacePo[0].y,w,h,bFillColor);
							};
							drawNameScrnPo={
								x:parseInt(arrScrnFacePo[0].x+w/ 2 - 10), y: parseInt(arrScrnFacePo[0].y + h /2)
							};
						}
					}
					else if(curObjInfo.objType==MAP_MOUSE_STATE.drawCircle){
						if(arrScrnFacePo.length>0){
							var r=parseInt(arrScrnFacePo[1].x-arrScrnFacePo[0].x);
							g_objHtml5DrawClass.DrawCircle(curDrawObjectCanvas2D,arrScrnFacePo[0].x,arrScrnFacePo[0].y,r,bFillColor);
							drawNameScrnPo={
								x:parseInt(arrScrnFacePo[0].x-10),y:parseInt(arrScrnFacePo[0].y)
							};
						}
					}
					else if(curObjInfo.objType==MAP_MOUSE_STATE.drawSector){
						if(arrScrnFacePo.length>0){
							var iSmallScrnLen=parseInt(arrScrnFacePo[1].x-arrScrnFacePo[0].x);
							var iBigScrnLen=parseInt(arrScrnFacePo[2].x-arrScrnFacePo[0].x);
							g_objHtml5DrawClass.DrawSector(curDrawObjectCanvas2D,arrScrnFacePo[0],curObjInfo.iSectorStartAngle,curObjInfo.iSectorEndAngle,iSmallScrnLen,iBigScrnLen,bFillColor);
							drawNameScrnPo={
								x:parseInt(arrScrnFacePo[0].x-10),y:parseInt(arrScrnFacePo[0].y)
							};
						}
					}
					else{
						if(arrScrnFacePo.length>2){
							g_objHtml5DrawClass.DrawPolygon(curDrawObjectCanvas2D,arrScrnFacePo,bFillColor);
							var centerScrnPo=l1(arrScrnFacePo);
							drawNameScrnPo={
								x:parseInt(centerScrnPo.x-10),y:parseInt(centerScrnPo.y)
							};
						}
					};
					bCurObjDraw=true;
					break;
					default:break;
				};
				if(bCurObjDraw){
					g_objManObjClass.arrCurScrnShowObjPos.push({
						layerId:layerId,objId:curObjInfo.id
					});
				};
				this.arrDrawInScrnObjInfo.push({
					layerId:layerId,objId:curObjInfo.id,po:drawPointScrnPo,w:drawPointW,h:drawPointH
				});
				bResetCanvasStyle=false;
				if(drawNameScrnPo&&curObjInfo.strShowText&&iStartShowTextScale+1>G_V.iCurScale){
					var strDrawText=curObjInfo.strShowText;
					if(curLayerInfo.textStyle){
						bResetCanvasStyle=true;
						var iNameLen=g6(strDrawText);
						var iFrameWidth=iNameLen*8;
						var iFrameHeight=G_V.objShowNameFrameStyle.height;
						g_objHtml5DrawClass.SetLineStyle(curDrawObjectCanvas2D,0,"#fff",0);
						g_objHtml5DrawClass.SetFillStyle(curDrawObjectCanvas2D,curLayerInfo.textStyle.fillColor,curLayerInfo.textStyle.iOpacity);
						g_objHtml5DrawClass.DrawRect(curDrawObjectCanvas2D,drawNameScrnPo.x-5,drawNameScrnPo.y-iFrameHeight+5,iFrameWidth,iFrameHeight,true);
					};
					g_objHtml5DrawClass.SetTextStyle(curDrawObjectCanvas2D,curDrawStyle.fontSize+" 黑体",curDrawStyle.textColor,curDrawStyle.iTextOpacity);
					g_objHtml5DrawClass.DrawString(curDrawObjectCanvas2D,drawNameScrnPo.x,drawNameScrnPo.y,strDrawText);
				}
			}
		};
		if(iDrawImgCountTest>0){}
	};
	this.SelectScrnTyphoonTrackInfo=function(curScrnPo,checkScrnLen){
		var iScrnPointCount=this.arrDrawInScrnTyphoonTrackInfo.length;
		var selectTyphoonTrackInfo=null;
		var checkScrnPo={
			x:curScrnPo.x-G_V.drawObjCanvasPo.x,y:curScrnPo.y-G_V.drawObjCanvasPo.y
		};
		for(var i=0;i<iScrnPointCount;i++){
			if(this.arrDrawInScrnTyphoonTrackInfo[i].po==null){
				continue;
			};
			var curTrackInfo=this.arrDrawInScrnTyphoonTrackInfo[i];
			var scrnPo=curTrackInfo.po;
			if(scrnPo.x-checkScrnPo.x>-checkScrnLen&&scrnPo.x-checkScrnPo.x<checkScrnLen&&scrnPo.y-checkScrnPo.y>-checkScrnLen&&scrnPo.y-checkScrnPo.y<checkScrnLen){
				selectTyphoonTrackInfo={
					typhoonId:curTrackInfo.typhoonId,iTruePos:curTrackInfo.iTruePos,iPredictLinePos:curTrackInfo.iPredictLinePos,iPredictPos:curTrackInfo.iPredictPos
				};
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawMouseMoveSelObjCanvas2D,1,"#FF0000",100);
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawMouseMoveSelObjCanvas2D,scrnPo.x,scrnPo.y,4,false);
				g_objDrawObjClass.bDrawMouseMoveSelObjCanvas=true;
				break;
			}
		};
		return selectTyphoonTrackInfo;
	};
	this.ClearTyphoonCanvas=function(){
		this.arrDrawInScrnTyphoonTrackInfo=null;
		this.arrDrawInScrnTyphoonTrackInfo=[];
		if(this.bDrawTyphoonCanvas){
			g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawTyphoonCanvas,g_objYimaEncMap.drawTyphoonCanvas2D);
			this.bDrawTyphoonCanvas=false;
		}
	};
	this.DrawAllTyphoon=function(){
		if(G_V.bShowTyphoonOrNot==false){
			return false;
		};
		var iTyphoonCount=g_objManTyphoon.arrTyphoonInfo.length;
		if(iTyphoonCount==0){
			return;
		};
		var leftTopLonLatPo=k6(0-G_V.dragMapLayerOriginPo.x,0-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
		var rightButtomLonLatPo=k6(G_V.iMapViewWidth-G_V.dragMapLayerOriginPo.x,G_V.iMapViewHeight-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
		var minGeoX=parseInt(leftTopLonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR);
		var maxGeoX=parseInt(rightButtomLonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR);
		var minGeoY=parseInt(rightButtomLonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR);
		var maxGeoY=parseInt(leftTopLonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR);
		for(var iTyphoonPos=0;iTyphoonPos<iTyphoonCount;iTyphoonPos++){
			if(g_objManTyphoon.arrTyphoonInfo[iTyphoonPos].bShow==false){
				continue;
			};
			var curTyphoon=g_objManTyphoon.arrTyphoonInfo[iTyphoonPos];
			var iPredictTracksLineCount=curTyphoon.arrTracks[curTyphoon.iCurShowTrackPos].arrPredictTracks.length;
			g_objManTyphoon.arrShowTyphoonAnimationGeoPo.push(curTyphoon.arrTracks[curTyphoon.iCurShowTrackPos].po);
			if(iPredictTracksLineCount>0){
				var iPredictTrackLineCount=curTyphoon.arrTracks[curTyphoon.iCurShowTrackPos].arrPredictTracks.length;
				for(var iPredictTrackLinePos=0;iPredictTrackLinePos<iPredictTrackLineCount;iPredictTrackLinePos++){
					var arrPredictTracks=curTyphoon.arrTracks[curTyphoon.iCurShowTrackPos].arrPredictTracks[iPredictTrackLinePos];
					var arrTracksGeoPo=[];
					var iPredictTracksPoCount=arrPredictTracks.length;
					if(iPredictTracksPoCount==0){
						continue
					};
					var iPredictTrackLineWidth=2;
					var strPredictTrackLineColor="#a21a0b";
					var iOpacity=100;
					if(curTyphoon.arrPredictTrackLineStyle.length>iPredictTrackLinePos){
						iPredictTrackLineWidth=curTyphoon.arrPredictTrackLineStyle[iPredictTrackLinePos].width;
						strPredictTrackLineColor=curTyphoon.arrPredictTrackLineStyle[iPredictTrackLinePos].color;
						iOpacity=curTyphoon.arrPredictTrackLineStyle[iPredictTrackLinePos].opacity
					};
					arrTracksGeoPo.push(curTyphoon.arrTracks[curTyphoon.iCurShowTrackPos].po);
					for(var iPoIndex=0;iPoIndex<iPredictTracksPoCount;iPoIndex++){
						arrTracksGeoPo.push(arrPredictTracks[iPoIndex].po);
					};
					var arrTracksScrnPo=a3(arrTracksGeoPo,true);
					var iTracksScrnPoCount=arrTracksScrnPo.length-1;
					var iPredictTrackLinePoCount=parseInt(iTracksScrnPoCount)+parseInt(1);
					g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawTyphoonCanvas2D,iPredictTrackLineWidth,strPredictTrackLineColor,iOpacity);
					for(var iScrnPos=1;iScrnPos<iPredictTrackLinePoCount;iScrnPos++){
						var drawColor=g_objManTyphoon.GetDrawTyphoonColorByWindSpeed(arrPredictTracks[iScrnPos-1].windSpeed);
						var arrCurDrawLinePo=[];
						arrCurDrawLinePo.push(arrTracksScrnPo[iScrnPos-1]);
						arrCurDrawLinePo.push(arrTracksScrnPo[iScrnPos]);
						g_objHtml5DrawClass.DrawDashedLine(g_objYimaEncMap.drawTyphoonCanvas2D,arrCurDrawLinePo,8,4);
					};
					var curLastDrawColor="";
					for(var iPoPos=0;iPoPos<iTracksScrnPoCount;iPoPos++){
						var drawColor=g_objManTyphoon.GetDrawTyphoonColorByWindSpeed(arrPredictTracks[iPoPos].windSpeed);
						if(curLastDrawColor!=drawColor){
							g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawTyphoonCanvas2D,2,"#FF0000",100);
							g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawTyphoonCanvas2D,drawColor,100);
							curLastDrawColor=drawColor;
						};
						var curScrnPo={
							x:arrTracksScrnPo[iPoPos+1].x,y:arrTracksScrnPo[iPoPos+1].y
						};
						this.arrDrawInScrnTyphoonTrackInfo.push({
							typhoonId:curTyphoon.id,iTruePos:curTyphoon.iCurShowTrackPos,iPredictLinePos:iPredictTrackLinePos,iPredictPos:iPoPos,po:curScrnPo
						});
						g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawTyphoonCanvas2D,curScrnPo.x,curScrnPo.y,3,true);
					}
				}
			};
			var iTrueTracksPoCount=curTyphoon.arrTracks.length;
			if(iTrueTracksPoCount>0){
				var arrTracksGeoPo=[];
				for(var iPoIndex=0;iPoIndex<iTrueTracksPoCount;iPoIndex++){
					arrTracksGeoPo.push(curTyphoon.arrTracks[iPoIndex].po);
				};
				var arrTracksScrnPo=a3(arrTracksGeoPo,true);
				var iTracksScrnPoCount=arrTracksScrnPo.length;
				var curLastDrawColor="";
				for(var iScrnPos=1;iScrnPos<iTracksScrnPoCount;iScrnPos++){
					var drawColor=g_objManTyphoon.GetDrawTyphoonColorByWindSpeed(curTyphoon.arrTracks[iScrnPos].windSpeed);
					if(curLastDrawColor!=drawColor){
						g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawTyphoonCanvas2D,3,drawColor,100);
						curLastDrawColor=drawColor;
					};
					var arrCurDrawLinePo=[];
					arrCurDrawLinePo.push(arrTracksScrnPo[iScrnPos-1]);
					arrCurDrawLinePo.push(arrTracksScrnPo[iScrnPos]);
					g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawTyphoonCanvas2D,arrCurDrawLinePo);
				};
				curLastDrawColor="";
				for(var iPoPos=0;iPoPos<iTracksScrnPoCount;iPoPos++){
					var drawColor=g_objManTyphoon.GetDrawTyphoonColorByWindSpeed(curTyphoon.arrTracks[iPoPos].windSpeed);
					if(curLastDrawColor!=drawColor){
						g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawTyphoonCanvas2D,2,"#FF0000",100);
						g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawTyphoonCanvas2D,drawColor,100);
						curLastDrawColor=drawColor;
					};
					var curScrnPo={
						x:arrTracksScrnPo[iPoPos].x,y:arrTracksScrnPo[iPoPos].y
					};
					this.arrDrawInScrnTyphoonTrackInfo.push({
						typhoonId:curTyphoon.id,iTruePos:iPoPos,iPredictLinePos:null,iPredictPos:null,po:curScrnPo
					});
					g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawTyphoonCanvas2D,curScrnPo.x,curScrnPo.y,3,true);
				};
				var curDrawCircleScrnPo=arrTracksScrnPo[curTyphoon.iCurShowTrackPos];
				var StrSevenCircleColor=g_objManTyphoon.sevenCircleColor;
				var StrTenCircleColor=g_objManTyphoon.tenCircleColor;
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawTyphoonCanvas2D,2,StrSevenCircleColor,50);
				g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawTyphoonCanvas2D,StrSevenCircleColor,50);
				var sevenR=curTyphoon.arrTracks[curTyphoon.iCurShowTrackPos].sevenRadius*G_V.pxLenOfOneKmPo.x;
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawTyphoonCanvas2D,curDrawCircleScrnPo.x,curDrawCircleScrnPo.y,sevenR,false);
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawTyphoonCanvas2D,2,StrTenCircleColor,50);
				g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawTyphoonCanvas2D,StrTenCircleColor,50);
				var tenR=curTyphoon.arrTracks[curTyphoon.iCurShowTrackPos].tenRadius*G_V.pxLenOfOneKmPo.x;
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawTyphoonCanvas2D,curDrawCircleScrnPo.x,curDrawCircleScrnPo.y,tenR,false);
				var imgWidth=60;
				var imgHeight=60;
				if(curTyphoon.imgSize!=null){
					imgWidth=curTyphoon.imgSize.x;
					imgHeight=curTyphoon.imgSize.y
				}
				else{
					imgWidth=curTyphoon.img.naturalWidth;
					imgHeight=curTyphoon.img.naturalHeight
				};
				if(imgWidth==null||imgWidth==undefined||imgWidth==NaN){
					imgWidth=curTyphoon.img.width;
					imgHeight=curTyphoon.img.height
				};
				if(imgWidth==null||imgWidth==undefined||imgWidth==NaN){
					imgWidth=60;
					imgHeight=60
				};
				imgWidth=imgWidth==0?60:parseInt(imgWidth);
				imgHeight=imgHeight==0?60:parseInt(imgHeight);
				var imgStyle=curTyphoon.img.style;
				imgStyle.left=curDrawCircleScrnPo.x-imgWidth/2+G_V.drawObjCanvasPo.x+"px";
				imgStyle.top=curDrawCircleScrnPo.y-imgWidth/2+G_V.drawObjCanvasPo.y+"px";
				imgStyle.display="block";
			}
		};
		this.bDrawTyphoonCanvas=true;
	};
	this.ClearFishAreaCanvas=function(){
		if(this.bDrawFishAreaCanvas){
			g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawFishAreaCanvas,g_objYimaEncMap.drawFishAreaCanvas2D);
			this.bDrawFishAreaCanvas=false;
		}
	};
	this.ClearLonLatLineCanvas=function(){
		if(this.bDrawLonLatLineCanvas){
			g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawLonLatLineCanvas,g_objYimaEncMap.drawLonLatLineCanvas2D);
			this.bDrawLonLatLineCanvas=false;
		}
	};
	this.ReDrawLonLatLine=function(){
		if(G_V.bShowLonLatLine==false){
			return false;
		};
		if(G_V.iCurScale>100000000){
			return false;
		};
		var iLineSize=1;
		var strLineColor="#FF0000";
		var iLineOpacity=50;
		var strFontColor="#000000";
		var strFontSize="15px Courier New";
		var iFontOpacity=80;
		var bSetLineDash=true;
		var iLineDashLen=2;
		var iLineDashSpaceLen=2;
		if(g_objLonLatLineManClass){
			iLineSize=g_objLonLatLineManClass.iLineSize;
			strLineColor=g_objLonLatLineManClass.strLineColor;
			iLineOpacity=g_objLonLatLineManClass.iLineOpacity;
			strFontColor=g_objLonLatLineManClass.strFontColor;
			strFontSize=g_objLonLatLineManClass.strFontSize;
			iFontOpacity=g_objLonLatLineManClass.iFontOpacity;
			bSetLineDash=g_objLonLatLineManClass.bSetLineDash;
			iLineDashLen=g_objLonLatLineManClass.iLineDashLen;
			iLineDashSpaceLen=g_objLonLatLineManClass.iLineDashSpaceLen;
		};
		g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawLonLatLineCanvas2D,iLineSize,strLineColor,iLineOpacity);
		this.bDrawLonLatLineCanvas=true;
		var curMapViewGeo=a6();
		if(curMapViewGeo.maxGeoX<curMapViewGeo.minGeoX){
			if(curMapViewGeo.maxGeoX<0){
				curMapViewGeo.maxGeoX=1800000000;
			}
		};
		var offsetGeoX=curMapViewGeo.maxGeoX-curMapViewGeo.minGeoX;
		var offsetGeoY=curMapViewGeo.maxGeoY-curMapViewGeo.maxGeoY;
		var stepColValue=this.GetLonLatLineInfo(curMapViewGeo.minGeoX,offsetGeoX);
		var curDrawGeo=stepColValue.value;
		var iCurDrawLineCount=0;
		var curArrColGeo=[];
		var curArrRowGeo=[];
		while(true){
			iCurDrawLineCount++;
			if(iCurDrawLineCount>30||curDrawGeo>curMapViewGeo.maxGeoX){
				break;
			};
			curArrColGeo.push({
				x:curDrawGeo,y:curMapViewGeo.maxGeoY
			});
			curDrawGeo=parseInt(curDrawGeo)+parseInt(stepColValue.step);
		};
		var stepRowValue=this.GetLonLatLineInfo(curMapViewGeo.minGeoY,offsetGeoY);
		var curDrawGeo=stepRowValue.value;
		iCurDrawLineCount=0;
		while(true){
			iCurDrawLineCount++;
			if(iCurDrawLineCount>30||curDrawGeo>curMapViewGeo.maxGeoY){
				break;
			};
			curArrRowGeo.push({
				x:curMapViewGeo.minGeoX,y:curDrawGeo
			});
			curDrawGeo=parseInt(curDrawGeo)+parseInt(stepRowValue.step);
		};
		var cruArrColScrnPo=a3(curArrColGeo,true);
		for(var i=0;i<cruArrColScrnPo.length;i++){
			var arrLine=[];
			arrLine[0]=cruArrColScrnPo[i];
			arrLine[1]={
				x:cruArrColScrnPo[i].x,y:cruArrColScrnPo[i].y+G_V.iMapViewHeight
			};
			if(bSetLineDash){
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawLonLatLineCanvas2D,arrLine,bSetLineDash,iLineDashLen,iLineDashSpaceLen);
			}
			else{
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawLonLatLineCanvas2D,arrLine);
			}
		};
		var cruArrRowScrnPo=a3(curArrRowGeo,true);
		for(var i=0;i<cruArrRowScrnPo.length;i++){
			var arrLine=[];
			arrLine[0]=cruArrRowScrnPo[i];
			arrLine[1]={
				x:cruArrRowScrnPo[i].x+G_V.iMapViewWidth,y:cruArrRowScrnPo[i].y
			};
			if(bSetLineDash){
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawLonLatLineCanvas2D,arrLine,bSetLineDash,iLineDashLen,iLineDashSpaceLen);
			}
			else{
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawLonLatLineCanvas2D,arrLine);
			}
		};
		g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawLonLatLineCanvas2D,strFontSize,strFontColor,iFontOpacity);
		var arrFirstScrnPo=[];
		for(var i=0;i<cruArrColScrnPo.length;i++){
			var arrLine=[];
			var scrnTextX=cruArrColScrnPo[i].x-10;
			var scrnTextY=cruArrColScrnPo[i].y+20;
			var strText=k7(curArrColGeo[i].x/10000000,true);
			if(i<5){
				arrFirstScrnPo.push({
					x:scrnTextX,y:scrnTextY
				})
			};
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawLonLatLineCanvas2D,scrnTextX,scrnTextY,strText);
		};
		for(var i=0;i<cruArrRowScrnPo.length;i++){
			var arrLine=[];
			var scrnTextX=cruArrRowScrnPo[i].x+5;
			var scrnTextY=cruArrRowScrnPo[i].y+15;
			var strText=k7(curArrRowGeo[i].y/10000000,false);
			for(var checkPos=0;checkPos<arrFirstScrnPo.length;checkPos++){
				if(Math.abs(scrnTextY-arrFirstScrnPo[checkPos].y)<30){
					scrnTextY=arrFirstScrnPo[checkPos].y+30;
					break;
				}
			};
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawLonLatLineCanvas2D,scrnTextX,scrnTextY,strText);
		}
	};
	this.GetLonLatLineInfo=function(iGeoValue,offsetGeoLen){
		var startGeoValue=iGeoValue;
		var retStepGeo=100000000;
		var arrStepInfo=g_objLonLatLineManClass.arrStepInfo;
		var stepCount=arrStepInfo.length;
		for(var i=0;i<stepCount;i++){
			if(G_V.iCurScale>arrStepInfo[i].scale){
				var stepGeo=arrStepInfo[i].step/60*10000000;
				startGeoValue=parseInt(iGeoValue/stepGeo)*stepGeo;
				retStepGeo=stepGeo;
				break;
			}
		};
		var resultValue={
			value:startGeoValue,step:retStepGeo
		};
		return resultValue;
	};
	this.ReDrawFishArea=function(){
		if(g_objFishAreaManClass.m_bShowFishAreaBox==false||g_objFishAreaManClass.m_iStartShowBoxScale<G_V.iCurScale){
			return false;
		};
		var iFishAreaCount=g_objFishAreaManClass.m_arrFishAreaObj.length;
		if(iFishAreaCount==0){
			return false;
		};
		this.bDrawFishAreaCanvas=true;
		var fillStyle=g_objFishAreaManClass.m_curFillStyle;
		var bFillFishArea=fillStyle.bFill;
		if(bFillFishArea){
			g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawFishAreaCanvas2D,fillStyle.fillColor,fillStyle.iOpacity)
		};
		var bigBoxLineStyle=g_objFishAreaManClass.m_curBigBoxStyle;
		g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawFishAreaCanvas2D,bigBoxLineStyle.borderWith,bigBoxLineStyle.borderColor,bigBoxLineStyle.iOpacity);
		var curMapViewGeo=a6();
		var arrFishNameInfo=[];
		var arrBigFishNameInfo=[];
		for(var i=0;i<iFishAreaCount;i++){
			var curFishAreaObj=g_objFishAreaManClass.m_arrFishAreaObj[i];
			if(curFishAreaObj.bShowOrNot==false){
				continue;
			};
			if(curFishAreaObj.iGeoX>curMapViewGeo.maxGeoX||curFishAreaObj.iButtomGeoX<curMapViewGeo.minGeoX||curFishAreaObj.iButtomGeoY<curMapViewGeo.minGeoY||curFishAreaObj.iGeoY>curMapViewGeo.maxGeoY){
				continue;
			};
			var arrGeoPo=[];
			arrGeoPo.push({
				x:curFishAreaObj.iGeoX,y:curFishAreaObj.iButtomGeoY
			});
			arrGeoPo.push({
				x:curFishAreaObj.iButtomGeoX,y:curFishAreaObj.iGeoY
			});
			var arrScrnPo=a3(arrGeoPo,true);
			var rectW=arrScrnPo[1].x-arrScrnPo[0].x;
			var rectH=arrScrnPo[1].y-arrScrnPo[0].y;
			var iSmallHighLight=-1;
			var bIsHighLightFishArea=false;
			if(g_objFishAreaManClass.m_iHighLightFishAreaPos==i){
				if(isNaN(g_objFishAreaManClass.m_iHighLightFishAreaSmallNum)==false&&parseInt(g_objFishAreaManClass.m_iHighLightFishAreaSmallNum)>0){
					iSmallHighLight=parseInt(g_objFishAreaManClass.m_iHighLightFishAreaSmallNum);
					bIsHighLightFishArea=true;
				}
				else{
					var HighLightStyle=g_objFishAreaManClass.m_curHighLightStyle;
					g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawFishAreaCanvas2D,HighLightStyle.fillColor,HighLightStyle.iOpacity);
					g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawFishAreaCanvas2D,arrScrnPo[0].x,arrScrnPo[0].y,rectW,rectH,true);
					if(bFillFishArea){
						g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawFishAreaCanvas2D,fillStyle.fillColor,fillStyle.iOpacity)
					}
				}
			}
			else{
				g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawFishAreaCanvas2D,arrScrnPo[0].x,arrScrnPo[0].y,rectW,rectH,bFillFishArea);
			};
			if(g_objFishAreaManClass.m_iStartShowSmallBoxScale>G_V.iCurScale&&rectW>80){
				var highLightScrnPo=[];
				var arrLinePo=[];
				var scrnXLen=rectW/3;
				var scrnYLen=rectH/3;
				arrLinePo.push({
					x:arrScrnPo[0].x+scrnXLen,y:arrScrnPo[0].y
				});
				arrLinePo.push({
					x:arrScrnPo[0].x+scrnXLen,y:arrScrnPo[0].y+rectH
				});
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawFishAreaCanvas2D,arrLinePo);
				arrLinePo[0].x=arrScrnPo[0].x+scrnXLen*2;
				arrLinePo[1].x=arrScrnPo[0].x+scrnXLen*2;
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawFishAreaCanvas2D,arrLinePo);
				arrLinePo[0].x=arrScrnPo[0].x;
				arrLinePo[0].y=arrScrnPo[0].y+scrnYLen;
				arrLinePo[1].x=arrScrnPo[0].x+rectW;
				arrLinePo[1].y=arrScrnPo[0].y+scrnYLen;
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawFishAreaCanvas2D,arrLinePo);
				arrLinePo[0].y=arrScrnPo[0].y+scrnYLen*2;
				arrLinePo[1].y=arrScrnPo[0].y+scrnYLen*2;
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawFishAreaCanvas2D,arrLinePo);
				var iNameScrnX=arrScrnPo[0].x+scrnXLen/2-15;
				var iNameScrnY=arrScrnPo[0].y+scrnYLen/2;
				var curName="1";
				var objNameInfo={
					x:iNameScrnX,y:iNameScrnY,name:curName
				};
				arrFishNameInfo.push(objNameInfo);
				if(iSmallHighLight==parseInt(1)){
					highLightScrnPo.x=arrScrnPo[0].x;
					highLightScrnPo.y=arrScrnPo[0].y;
				};
				iNameScrnX=arrScrnPo[0].x+scrnXLen*3/2-15;
				curName="2";
				objNameInfo={
					x:iNameScrnX,y:iNameScrnY,name:curName
				};
				arrFishNameInfo.push(objNameInfo);
				if(iSmallHighLight==parseInt(2)){
					highLightScrnPo.x=arrScrnPo[0].x+parseInt(scrnXLen);
					highLightScrnPo.y=arrScrnPo[0].y;
				};
				iNameScrnX=arrScrnPo[0].x+scrnXLen*5/2-15;
				curName="3";
				objNameInfo={
					x:iNameScrnX,y:iNameScrnY,name:curName
				};
				arrFishNameInfo.push(objNameInfo);
				if(iSmallHighLight==parseInt(3)){
					highLightScrnPo.x=arrScrnPo[0].x+parseInt(scrnXLen*2);
					highLightScrnPo.y=arrScrnPo[0].y;
				};
				iNameScrnX=arrScrnPo[0].x+scrnXLen/2-15;
				iNameScrnY=arrScrnPo[0].y+scrnYLen*3/2;
				curName="4";
				objNameInfo={
					x:iNameScrnX,y:iNameScrnY,name:curName
				};
				arrFishNameInfo.push(objNameInfo);
				if(iSmallHighLight==parseInt(4)){
					highLightScrnPo.x=arrScrnPo[0].x;
					highLightScrnPo.y=arrScrnPo[0].y+parseInt(scrnYLen);
				};
				iNameScrnX=arrScrnPo[0].x+scrnXLen*3/2-15;
				curName=curFishAreaObj.name;
				objNameInfo={
					x:iNameScrnX,y:iNameScrnY,name:curName
				};
				arrBigFishNameInfo.push(objNameInfo);
				if(iSmallHighLight==parseInt(5)){
					highLightScrnPo.x=arrScrnPo[0].x+parseInt(scrnXLen);
					highLightScrnPo.y=arrScrnPo[0].y+parseInt(scrnYLen);
				};
				iNameScrnX=arrScrnPo[0].x+scrnXLen*5/2-15;
				curName="6";
				objNameInfo={
					x:iNameScrnX,y:iNameScrnY,name:curName
				};
				arrFishNameInfo.push(objNameInfo);
				if(iSmallHighLight==parseInt(6)){
					highLightScrnPo.x=arrScrnPo[0].x+parseInt(scrnXLen*2);
					highLightScrnPo.y=arrScrnPo[0].y+parseInt(scrnYLen);
				};
				iNameScrnX=arrScrnPo[0].x+scrnXLen/2-15;
				iNameScrnY=arrScrnPo[0].y+scrnYLen*5/2;
				curName="7";
				objNameInfo={
					x:iNameScrnX,y:iNameScrnY,name:curName
				};
				arrFishNameInfo.push(objNameInfo);
				if(iSmallHighLight==parseInt(7)){
					highLightScrnPo.x=arrScrnPo[0].x;
					highLightScrnPo.y=arrScrnPo[0].y+parseInt(scrnYLen*2);
				};
				iNameScrnX=arrScrnPo[0].x+scrnXLen*3/2-15;
				curName="8";
				objNameInfo={
					x:iNameScrnX,y:iNameScrnY,name:curName
				};
				arrFishNameInfo.push(objNameInfo);
				if(iSmallHighLight==parseInt(8)){
					highLightScrnPo.x=arrScrnPo[0].x+parseInt(scrnXLen);
					highLightScrnPo.y=arrScrnPo[0].y+parseInt(scrnYLen*2);
				};
				iNameScrnX=arrScrnPo[0].x+scrnXLen*5/2-15;
				curName="9";
				objNameInfo={
					x:iNameScrnX,y:iNameScrnY,name:curName
				};
				arrFishNameInfo.push(objNameInfo);
				if(iSmallHighLight==parseInt(9)){
					highLightScrnPo.x=arrScrnPo[0].x+parseInt(scrnXLen*2);
					highLightScrnPo.y=arrScrnPo[0].y+parseInt(scrnYLen*2);
				};
				if(bIsHighLightFishArea==true){
					var HighLightStyle=g_objFishAreaManClass.m_curHighLightStyle;
					g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawFishAreaCanvas2D,HighLightStyle.fillColor,HighLightStyle.iOpacity);
					g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawFishAreaCanvas2D,highLightScrnPo.x,highLightScrnPo.y,scrnXLen,scrnYLen,true);
					if(bFillFishArea){
						g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawFishAreaCanvas2D,fillStyle.fillColor,fillStyle.iOpacity)
					}
				}
			}
			else{
				if(rectW>40){
					var iNameScrnX=(arrScrnPo[0].x+rectW/2)-15;
					var iNameScrnY=(arrScrnPo[0].y+rectH/2);
					var objNameInfo={
						x:iNameScrnX,y:iNameScrnY,name:curFishAreaObj.name
					};
					arrFishNameInfo.push(objNameInfo);
					if(g_objFishAreaManClass.m_iHighLightFishAreaPos==i){
						var HighLightStyle=g_objFishAreaManClass.m_curHighLightStyle;
						g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawFishAreaCanvas2D,HighLightStyle.fillColor,HighLightStyle.iOpacity);
						g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawFishAreaCanvas2D,arrScrnPo[0].x,arrScrnPo[0].y,rectW,rectH,true);
						if(bFillFishArea){
							g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawFishAreaCanvas2D,fillStyle.fillColor,fillStyle.iOpacity)
						}
					}
				}
			}
		};
		var nameStyle=g_objFishAreaManClass.m_curNameStyle;
		g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawFishAreaCanvas2D,nameStyle.strFont,nameStyle.color,nameStyle.iOpacity);
		for(var i=0;i<arrFishNameInfo.length;i++){
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawFishAreaCanvas2D,arrFishNameInfo[i].x,arrFishNameInfo[i].y,arrFishNameInfo[i].name)
		};
		g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawFishAreaCanvas2D,"宋体 20px",nameStyle.color,100);
		for(var i=0;i<arrBigFishNameInfo.length;i++){
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawFishAreaCanvas2D,arrBigFishNameInfo[i].x,arrBigFishNameInfo[i].y,arrBigFishNameInfo[i].name)
		}
	};
	this.ClearHeatMapDataCanvas=function(){};
	this.DrawHeatMapData=function(){}
};
function a6(){
	var curSelectShipInfo=null;
	var mapViewHalfSize={
		w:G_V.iMapViewWidth/2,h:G_V.iMapViewHeight
	};
	var leftTopLonLatPo=k6(0-G_V.dragMapLayerOriginPo.x,0-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
	var rightButtomLonLatPo=k6(G_V.iMapViewWidth-G_V.dragMapLayerOriginPo.x,G_V.iMapViewHeight-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
	var minGeoX=parseInt(leftTopLonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var maxGeoX=parseInt(rightButtomLonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var minGeoY=parseInt(rightButtomLonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var maxGeoY=parseInt(leftTopLonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var resultInfo={
		minGeoX:minGeoX,maxGeoX:maxGeoX,minGeoY:minGeoY,maxGeoY:maxGeoY
	};
	return resultInfo;
};
function a7(addGeoPo,curDynamicGeoPo){
	if(G_V.iCurMapMouseState==MAP_MOUSE_STATE.none){
		return;
	};
	if(addGeoPo){
		G_V.arrDrawDynamicObjGeoPo.push(addGeoPo);
	};
	if(G_V.arrDrawDynamicObjGeoPo.length==0&&curDynamicGeoPo==null){
		return;
	};
	g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawDynamicObjCanvas,g_objYimaEncMap.drawDynamicObjCanvas2D);
	var bDrawPoint=false;
	var curDynamicScrnPo=null;
	if(curDynamicGeoPo){
		curDynamicScrnPo=a2(curDynamicGeoPo,true);
	};
	var arrDrawScrnPo=a3(G_V.arrDrawDynamicObjGeoPo,true);
	var iDrawScrnPoCount=arrDrawScrnPo.length;
	var arrDrawDynamicLinePo=[];
	var objDynamicInfo=null;
	var objCurPoInfo=[];
	objCurPoInfo.po=curDynamicGeoPo;
	objCurPoInfo.type=G_V.iCurMapMouseState;
	objCurPoInfo.bEndDraw=true;
	if(curDynamicGeoPo){
		objCurPoInfo.bEndDraw=false;
	};
	var borderSize;
	var borderColor;
	var fillColor;
	var iOpacity;
	var strFont;
	var textColor;
	if(G_V.drawDynamicObjStyle){
		borderSize=G_V.drawDynamicObjStyle.borderWith;
		borderColor=G_V.drawDynamicObjStyle.borderColor;
		iOpacity=G_V.drawDynamicObjStyle.iOpacity;
		fillColor=G_V.drawDynamicObjStyle.fillColor;
		strFont=G_V.drawDynamicObjStyle.fontSize;
		textColor=G_V.drawDynamicObjStyle.textColor;
		g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,borderSize,borderColor,iOpacity);
		g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,fillColor,iOpacity);
	};
	switch(G_V.iCurMapMouseState){
		case MAP_MOUSE_STATE.drawPoint:if(iDrawScrnPoCount>0){
			var left=arrDrawScrnPo[0].x-G_V.drawDynamicObjStyle.iImgWidth/2;
			var top=arrDrawScrnPo[0].y-G_V.drawDynamicObjStyle.iImgHeight/2;
			g_objHtml5DrawClass.DrawImg(g_objYimaEncMap.drawDynamicObjCanvas2D,left,top,G_V.drawDynamicObjStyle.img);
			G_V.iCurMapMouseState=MAP_MOUSE_STATE.none;
			if(addGeoPo){
				objDynamicInfo=[];
				objDynamicInfo.type=MAP_MOUSE_STATE.drawPoint;
				objDynamicInfo.po=addGeoPo;
				objDynamicInfo.curPo=curDynamicGeoPo;
			};
			if(typeof ReturnDrawDynamicObjNewInfo==='function'){
				ReturnDrawDynamicObjNewInfo(objDynamicInfo,objCurPoInfo);
			}
		};
		break;
		case MAP_MOUSE_STATE.drawLine:bDrawPoint=true;
		if(iDrawScrnPoCount>1){
			g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo);
		};
		if(curDynamicScrnPo){
			if(iDrawScrnPoCount>0){
				arrDrawDynamicLinePo.push(arrDrawScrnPo[iDrawScrnPoCount-1]);
				arrDrawDynamicLinePo.push(curDynamicScrnPo);
			}
		};
		if(addGeoPo){
			objDynamicInfo=[];
			objDynamicInfo.type=MAP_MOUSE_STATE.drawLine;
			objDynamicInfo.po=addGeoPo;
			objDynamicInfo.curPo=curDynamicGeoPo;
		};
		if(typeof ReturnDrawDynamicObjNewInfo==='function'){
			ReturnDrawDynamicObjNewInfo(objDynamicInfo,objCurPoInfo);
		};
		break;
		case MAP_MOUSE_STATE.drawFace:bDrawPoint=true;
		if(iDrawScrnPoCount>2){
			g_objHtml5DrawClass.DrawPolygon(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo,true);
		};
		if(curDynamicScrnPo){
			if(iDrawScrnPoCount>0){
				arrDrawDynamicLinePo.push(arrDrawScrnPo[0]);
				arrDrawDynamicLinePo.push(curDynamicScrnPo);
				if(iDrawScrnPoCount>1){
					arrDrawDynamicLinePo.push(arrDrawScrnPo[iDrawScrnPoCount-1]);
				};
				if(iDrawScrnPoCount==2){
					arrDrawDynamicLinePo.push(arrDrawScrnPo[0]);
				}
			}
		};
		if(addGeoPo){
			objDynamicInfo=[];
			objDynamicInfo.type=MAP_MOUSE_STATE.drawFace;
			objDynamicInfo.po=addGeoPo;
			objDynamicInfo.curPo=curDynamicGeoPo;
		};
		if(typeof ReturnDrawDynamicObjNewInfo==='function'){
			ReturnDrawDynamicObjNewInfo(objDynamicInfo,objCurPoInfo);
		};
		break;
		case MAP_MOUSE_STATE.drawRect:bDrawPoint=true;
		if(iDrawScrnPoCount>0){
			var scrnPo1,scrnPo2;
			scrnPo1=arrDrawScrnPo[0];
			var minGeoPo=[];
			var maxGeoPo=[];
			minGeoPo={
				x:G_V.arrDrawDynamicObjGeoPo[0].x,y:G_V.arrDrawDynamicObjGeoPo[0].y
			};
			if(iDrawScrnPoCount>1){
				G_V.iCurMapMouseState=MAP_MOUSE_STATE.none;
				scrnPo2=arrDrawScrnPo[1];
				maxGeoPo={
					x:G_V.arrDrawDynamicObjGeoPo[1].x,y:G_V.arrDrawDynamicObjGeoPo[1].y
				};
			}
			else if(curDynamicScrnPo){
				scrnPo2=curDynamicScrnPo;
				maxGeoPo={
					x:curDynamicGeoPo.x,y:curDynamicGeoPo.y
				};
			};
			if(scrnPo2){
				var curRectStartPo=[];
				var curRectScrnSize=[];
				curRectStartPo={
					x:scrnPo1.x,y:scrnPo1.y
				};
				if(scrnPo1.x>scrnPo2.x){
					curRectStartPo.x=scrnPo2.x;
				};
				if(scrnPo1.y>scrnPo2.y){
					curRectStartPo.y=scrnPo2.y;
				};
				curRectScrnSize.w=Math.abs(scrnPo1.x-scrnPo2.x);
				curRectScrnSize.h=Math.abs(scrnPo1.y-scrnPo2.y);
				if(minGeoPo.x>maxGeoPo.x){
					var value=maxGeoPo.x;
					maxGeoPo.x=minGeoPo.x;
					minGeoPo.x=value;
				};
				if(minGeoPo.y>maxGeoPo.y){
					var value=maxGeoPo.y;
					maxGeoPo.y=minGeoPo.y;
					minGeoPo.y=value;
				};
				var minLon,minLat,maxLon,maxLat;
				minLon=minGeoPo.x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				minLat=minGeoPo.y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				maxLon=maxGeoPo.x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				maxLat=maxGeoPo.y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var widthDis=k9(minLon,maxLat,maxLon,maxLat);
				var heightDis=k9(minLon,minLat,minLon,maxLat);
				g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawDynamicObjCanvas2D,curRectStartPo.x,curRectStartPo.y,curRectScrnSize.w,curRectScrnSize.h,true);
				objDynamicInfo=[];
				objDynamicInfo.type=MAP_MOUSE_STATE.drawRect;
				objDynamicInfo.po={
					x:minGeoPo.x,y:maxGeoPo.y
				};
				objDynamicInfo.curPo=curDynamicGeoPo;
				objDynamicInfo.w=widthDis;
				objDynamicInfo.h=heightDis;
				if(G_V.arrDrawDynamicObjGeoPo.length==0&&curDynamicGeoPo==null){}
			}
		};
		if(typeof ReturnDrawDynamicObjNewInfo==='function'){
			ReturnDrawDynamicObjNewInfo(objDynamicInfo,objCurPoInfo);
		};
		break;
		case MAP_MOUSE_STATE.drawCircle:bDrawPoint=true;
		if(iDrawScrnPoCount>0){
			var scrnPo1,scrnPo2;
			scrnPo1=arrDrawScrnPo[0];
			var curCircleGeoPo={
				x:G_V.arrDrawDynamicObjGeoPo[0].x,y:G_V.arrDrawDynamicObjGeoPo[0].y
			};
			if(iDrawScrnPoCount>1){
				G_V.iCurMapMouseState=MAP_MOUSE_STATE.none;
				scrnPo2=arrDrawScrnPo[1];
			}
			else if(curDynamicScrnPo){
				scrnPo2=curDynamicScrnPo;
			};
			if(scrnPo2){
				var arrDrawLineScrnPo=[];
				arrDrawLineScrnPo.push(scrnPo1);
				arrDrawLineScrnPo.push(scrnPo2);
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawLineScrnPo);
			};
			if(scrnPo2){
				var rScrnLen=l4(scrnPo1,scrnPo2);
				var rDis=rScrnLen/G_V.pxLenOfOneKmPo.x;
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawDynamicObjCanvas2D,scrnPo1.x,scrnPo1.y,rScrnLen,true);
				objDynamicInfo=[];
				objDynamicInfo.type=MAP_MOUSE_STATE.drawCircle;
				objDynamicInfo.po={
					x:curCircleGeoPo.x,y:curCircleGeoPo.y
				};
				objDynamicInfo.r=rDis;
				objDynamicInfo.curPo=curDynamicGeoPo;
			}
		};
		if(typeof ReturnDrawDynamicObjNewInfo==='function'){
			ReturnDrawDynamicObjNewInfo(objDynamicInfo,objCurPoInfo);
		};
		break;
		case MAP_MOUSE_STATE.drawSector:break;
		case MAP_MOUSE_STATE.measureDist:bDrawPoint=true;
		var curAllDis=0;
		if(iDrawScrnPoCount>1){
			g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo);
			g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,strFont,textColor,iOpacity);
			if(G_V.objDynamicObjTextBoxStyle){
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,1,G_V.objDynamicObjTextBoxStyle.rectLineColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
				g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,G_V.objDynamicObjTextBoxStyle.rectFillColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
			};
			var arrStringTextInfo=[];
			for(var iPos=1;iPos<iDrawScrnPoCount;iPos++){
				var lon1=G_V.arrDrawDynamicObjGeoPo[iPos-1].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lat1=G_V.arrDrawDynamicObjGeoPo[iPos-1].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lon2=G_V.arrDrawDynamicObjGeoPo[iPos].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lat2=G_V.arrDrawDynamicObjGeoPo[iPos].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var curDis=k9(lon1,lat1,lon2,lat2);
				curAllDis+=curDis;
				var hailiAllDis=curAllDis*0.5399568;
				var strDis=hailiAllDis.toFixed(3)+"海里";
				if(G_V.bShowMeasureKmText==true){
					strDis+="("+curAllDis.toFixed(3)+"千米)";
				};
				var iCurLineTextLen=g6(strDis);
				var iFrameBoxWidth=iCurLineTextLen*7;
				var iFrameBoxHeight=20;
				g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo[iPos].x+2,arrDrawScrnPo[iPos].y,iFrameBoxWidth,iFrameBoxHeight,G_V.objDynamicObjTextBoxStyle.bFill);
				arrStringTextInfo.push({
					x:arrDrawScrnPo[iPos].x+10,y:arrDrawScrnPo[iPos].y+15,text:strDis
				});
			};
			g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,strFont,textColor,iOpacity);
			for(var iPos=0;iPos<arrStringTextInfo.length;iPos++){
				g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawDynamicObjCanvas2D,arrStringTextInfo[iPos].x,arrStringTextInfo[iPos].y,arrStringTextInfo[iPos].text);
			}
		};
		var curDis=0;
		var curDegrees=0;
		if(curDynamicScrnPo){
			if(iDrawScrnPoCount>0){
				arrDrawDynamicLinePo.push(arrDrawScrnPo[iDrawScrnPoCount-1]);
				arrDrawDynamicLinePo.push(curDynamicScrnPo);
				var lon1=G_V.arrDrawDynamicObjGeoPo[iDrawScrnPoCount-1].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lat1=G_V.arrDrawDynamicObjGeoPo[iDrawScrnPoCount-1].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lon2=curDynamicGeoPo.x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lat2=curDynamicGeoPo.y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				curDis=k9(lon1,lat1,lon2,lat2);
				curAllDis+=curDis;
				var hailiDis=curDis*0.5399568;
				curDegrees=l0(lon1,lat1,lon2,lat2);
				var strDis=hailiDis.toFixed(3)+"海里";
				if(G_V.bShowMeasureKmText==true){
					strDis+="("+curAllDis.toFixed(3)+"千米)";
				};
				if(G_V.objDynamicObjTextBoxStyle){
					g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,1,G_V.objDynamicObjTextBoxStyle.rectLineColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
					g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,G_V.objDynamicObjTextBoxStyle.rectFillColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
				};
				var iCurLineTextLen=g6(strDis);
				var iFrameBoxWidth=iCurLineTextLen*7;
				var iFrameBoxHeight=20;
				g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawDynamicLinePo[1].x+2,arrDrawDynamicLinePo[1].y,iFrameBoxWidth,iFrameBoxHeight,G_V.objDynamicObjTextBoxStyle.bFill);
				g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,strFont,textColor,iOpacity);
				g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawDynamicLinePo[1].x+10,arrDrawDynamicLinePo[1].y+15,strDis);
			}
		}
		else{
			if(iDrawScrnPoCount>1){
				var lon1=G_V.arrDrawDynamicObjGeoPo[iDrawScrnPoCount-2].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lat1=G_V.arrDrawDynamicObjGeoPo[iDrawScrnPoCount-2].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lon2=G_V.arrDrawDynamicObjGeoPo[iDrawScrnPoCount-1].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lat2=G_V.arrDrawDynamicObjGeoPo[iDrawScrnPoCount-1].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				curDis=k9(lon1,lat1,lon2,lat2);
				var hailiDis=curDis*0.5399568;
				curDegrees=l0(lon1,lat1,lon2,lat2)
			};
			if(typeof ReturnCurMeasurePoInfoByMouseDown==='function'){
				ReturnCurMeasurePoInfoByMouseDown(addGeoPo,curDis,curAllDis,curDegrees);
			}
		};
		if(curAllDis>0){
			if(typeof ReturnCurMeasureDist==='function'){
				ReturnCurMeasureDist(curDis,curAllDis,curDegrees);
			}
		};
		break;
		case MAP_MOUSE_STATE.measureArea:bDrawPoint=true;
		var drawAreaSizeScrnPo=[];
		if(iDrawScrnPoCount>2){
			g_objHtml5DrawClass.DrawPolygon(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo,true);
			drawAreaSizeScrnPo=arrDrawScrnPo[iDrawScrnPoCount-1];
		};
		if(curDynamicScrnPo){
			if(iDrawScrnPoCount>0){
				arrDrawDynamicLinePo.push(arrDrawScrnPo[0]);
				arrDrawDynamicLinePo.push(curDynamicScrnPo);
				if(iDrawScrnPoCount>1){
					arrDrawDynamicLinePo.push(arrDrawScrnPo[iDrawScrnPoCount-1]);
				};
				if(iDrawScrnPoCount==2){
					arrDrawDynamicLinePo.push(arrDrawScrnPo[0]);
				}
			};
			drawAreaSizeScrnPo=curDynamicScrnPo;
			G_V.arrDrawDynamicObjGeoPo.push(curDynamicGeoPo)
		};
		if(G_V.arrDrawDynamicObjGeoPo.length>2){
			var curAreaSize=l2(G_V.arrDrawDynamicObjGeoPo);
			var strAreaSize="";
			if(curAreaSize>1000000){
				curAreaSize=parseFloat(curAreaSize)/1000000;
				strAreaSize=curAreaSize.toFixed(3)+"(平方公里)";
			}
			else{
				strAreaSize=curAreaSize.toFixed(0)+"(平方米)";
			};
			if(G_V.objDynamicObjTextBoxStyle){
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,1,G_V.objDynamicObjTextBoxStyle.rectLineColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
				g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,G_V.objDynamicObjTextBoxStyle.rectFillColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
			};
			var iCurLineTextLen=g6(strAreaSize);
			var iFrameBoxWidth=iCurLineTextLen*7;
			var iFrameBoxHeight=20;
			g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawDynamicObjCanvas2D,drawAreaSizeScrnPo.x+2,drawAreaSizeScrnPo.y,iFrameBoxWidth,iFrameBoxHeight,G_V.objDynamicObjTextBoxStyle.bFill);
			g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,strFont,textColor,iOpacity);
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawDynamicObjCanvas2D,drawAreaSizeScrnPo.x+10,drawAreaSizeScrnPo.y+15,strAreaSize);
			if(curAreaSize>0){
				if(typeof ReturnCurMeasureAreaSize==='function'){
					ReturnCurMeasureAreaSize(curAreaSize);
				}
			}
		};
		if(curDynamicScrnPo){
			G_V.arrDrawDynamicObjGeoPo.pop();
		};
		break;
		case MAP_MOUSE_STATE.directionLine:bDrawPoint=true;
		if(iDrawScrnPoCount>0){
			var scrnPo1,scrnPo2;
			scrnPo1=arrDrawScrnPo[0];
			if(iDrawScrnPoCount>1){
				G_V.iCurMapMouseState=MAP_MOUSE_STATE.none;
				scrnPo2=arrDrawScrnPo[1];
			}
			else if(curDynamicScrnPo){
				scrnPo2=curDynamicScrnPo;
			};
			if(scrnPo2){
				var r=l4(scrnPo1,scrnPo2);
				g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawDynamicObjCanvas2D,scrnPo1.x,scrnPo1.y,r,false);
				var xpos=scrnPo2.x-scrnPo1.x;
				var ypos=scrnPo2.y-scrnPo1.y;
				if(xpos>100||ypos>100){
					xpos*=3;
					ypos*=3;
				}
				else{
					xpos*=10;
					ypos*=10;
				};
				var arrLinePos=[];
				arrLinePos.push(scrnPo1);
				arrLinePos.push({
					x:scrnPo2.x+xpos,y:scrnPo2.y+ypos
				});
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawDynamicObjCanvas2D,arrLinePos,r,false);
				var lon1=G_V.arrDrawDynamicObjGeoPo[0].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lat1=G_V.arrDrawDynamicObjGeoPo[0].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lon2,lat2;
				if(curDynamicGeoPo){
					lon2=curDynamicGeoPo.x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
					lat2=curDynamicGeoPo.y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				}
				else{
					lon2=G_V.arrDrawDynamicObjGeoPo[1].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
					lat2=G_V.arrDrawDynamicObjGeoPo[1].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				};
				var curDis=k9(lon1,lat1,lon2,lat2);
				var hailiDis=curDis*0.5399568;
				var curDegrees=l0(lon1,lat1,lon2,lat2);
				var strText=hailiDis.toFixed(3)+"海里";
				if(G_V.bShowMeasureKmText==true){
					strText+="("+curDis.toFixed(3)+"千米)";
				};
				strText+=";"+curDegrees.toFixed(2)+"度";
				if(G_V.objDynamicObjTextBoxStyle){
					g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,1,G_V.objDynamicObjTextBoxStyle.rectLineColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
					g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,G_V.objDynamicObjTextBoxStyle.rectFillColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
				};
				var iCurLineTextLen=g6(strText);
				var iFrameBoxWidth=iCurLineTextLen*7;
				var iFrameBoxHeight=20;
				g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawDynamicObjCanvas2D,scrnPo2.x+2,scrnPo2.y,iFrameBoxWidth,iFrameBoxHeight,G_V.objDynamicObjTextBoxStyle.bFill);
				g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,strFont,textColor,iOpacity);
				g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawDynamicObjCanvas2D,scrnPo2.x+10,scrnPo2.y+15,strText);
			}
		};
		break;
		default:break
	};
	if(curDynamicScrnPo){
		if(arrDrawDynamicLinePo.length>1){
			g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawDynamicLinePo);
		};
		g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawDynamicObjCanvas2D,curDynamicScrnPo.x,curDynamicScrnPo.y,3,true);
	};
	if(bDrawPoint==true&&arrDrawScrnPo.length>0){
		g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,"#FFFFFF",G_V.drawDynamicObjStyle.iOpacity);
		for(var iPoPos=0;iPoPos<iDrawScrnPoCount;iPoPos++){
			g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo[iPoPos].x,arrDrawScrnPo[iPoPos].y,3,true);
		}
	}
};
function a8(){
	if(G_V.iCurSdkModelType==SDK_MODEL_TYPE.android){
		return;
	};
	g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawDynamicObjCanvas,g_objYimaEncMap.drawDynamicObjCanvas2D);
	if(G_V.arrDrawDynamicObjGeoPo.length==0){
		return;
	};
	if(G_V.iCurDynamicType==MAP_MOUSE_STATE.none){
		G_V.arrDrawDynamicObjGeoPo=[];
		return;
	};
	var borderSize=1;
	var borderColor="#000000";
	var fillColor="#FF0000";
	var iOpacity=80;
	var strFont="12px 宋体";
	var textColor="#000000";
	if(G_V.drawDynamicObjStyle){
		borderSize=G_V.drawDynamicObjStyle.borderWith;
		borderColor=G_V.drawDynamicObjStyle.borderColor;
		iOpacity=G_V.drawDynamicObjStyle.iOpacity;
		fillColor=G_V.drawDynamicObjStyle.fillColor;
		strFont=G_V.drawDynamicObjStyle.fontSize;
		textColor=G_V.drawDynamicObjStyle.textColor;
		g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,borderSize,borderColor,iOpacity);
		g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,fillColor,iOpacity);
	};
	var arrDrawScrnPo=a3(G_V.arrDrawDynamicObjGeoPo,true);
	var iDrawScrnPoCount=arrDrawScrnPo.length;
	switch(G_V.iCurDynamicType){
		case MAP_MOUSE_STATE.drawPoint:if(iDrawScrnPoCount>0){
			var strUrl=G_V.drawDynamicObjStyle.strImgSrc;
			var left=arrDrawScrnPo[0].x-G_V.drawDynamicObjStyle.iImgWidth/2;
			var top=arrDrawScrnPo[0].y-G_V.drawDynamicObjStyle.iImgHeight/2;
			g_objHtml5DrawClass.DrawImg(g_objYimaEncMap.drawDynamicObjCanvas2D,left,top,G_V.drawDynamicObjStyle.img);
		};
		break;
		case MAP_MOUSE_STATE.drawLine:if(iDrawScrnPoCount>1){
			g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo);
		};
		break;
		case MAP_MOUSE_STATE.drawFace:if(iDrawScrnPoCount>2){
			g_objHtml5DrawClass.DrawPolygon(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo,true);
		};
		break;
		case MAP_MOUSE_STATE.drawRect:if(iDrawScrnPoCount>1){
			var scrnPo1,scrnPo2;
			scrnPo1=arrDrawScrnPo[0];
			scrnPo2=arrDrawScrnPo[1];
			var minGeoPo=[];
			var maxGeoPo=[];
			minGeoPo={
				x:G_V.arrDrawDynamicObjGeoPo[0].x,y:G_V.arrDrawDynamicObjGeoPo[0].y
			};
			maxGeoPo={
				x:G_V.arrDrawDynamicObjGeoPo[1].x,y:G_V.arrDrawDynamicObjGeoPo[1].y
			};
			var curRectStartPo=[];
			var curRectScrnSize=[];
			curRectStartPo={
				x:scrnPo1.x,y:scrnPo1.y
			};
			if(scrnPo1.x>scrnPo2.x){
				curRectStartPo.x=scrnPo2.x;
			};
			if(scrnPo1.y>scrnPo2.y){
				curRectStartPo.y=scrnPo2.y;
			};
			curRectScrnSize.w=Math.abs(scrnPo1.x-scrnPo2.x);
			curRectScrnSize.h=Math.abs(scrnPo1.y-scrnPo2.y);
			g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawDynamicObjCanvas2D,curRectStartPo.x,curRectStartPo.y,curRectScrnSize.w,curRectScrnSize.h,true);
		};
		break;
		case MAP_MOUSE_STATE.drawCircle:if(iDrawScrnPoCount>1){
			var scrnPo1,scrnPo2;
			scrnPo1=arrDrawScrnPo[0];
			scrnPo2=arrDrawScrnPo[1];
			if(scrnPo2){
				var arrDrawLineScrnPo=[];
				arrDrawLineScrnPo.push(scrnPo1);
				arrDrawLineScrnPo.push(scrnPo2);
				g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawLineScrnPo);
			};
			var rScrnLen=l4(scrnPo1,scrnPo2);
			var rDis=rScrnLen/G_V.pxLenOfOneKmPo.x;
			g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawDynamicObjCanvas2D,scrnPo1.x,scrnPo1.y,rScrnLen,true);
		};
		break;
		case MAP_MOUSE_STATE.measureDist:if(iDrawScrnPoCount>1){
			g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo);
			var curAllDis=0;
			if(G_V.objDynamicObjTextBoxStyle){
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,1,G_V.objDynamicObjTextBoxStyle.rectLineColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
				g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,G_V.objDynamicObjTextBoxStyle.rectFillColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
			};
			var arrStringTextInfo=[];
			for(var iPos=1;iPos<iDrawScrnPoCount;iPos++){
				var lon1=G_V.arrDrawDynamicObjGeoPo[iPos-1].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lat1=G_V.arrDrawDynamicObjGeoPo[iPos-1].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lon2=G_V.arrDrawDynamicObjGeoPo[iPos].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var lat2=G_V.arrDrawDynamicObjGeoPo[iPos].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
				var curDis=k9(lon1,lat1,lon2,lat2);
				var curHiliDis=curDis*0.5399568;
				curAllDis+=curHiliDis;
				var strDis=curAllDis.toFixed(3)+"海里";
				if(G_V.bShowMeasureKmText==true){
					strDis+="("+curDis.toFixed(3)+"千米)";
				};
				var iCurLineTextLen=g6(strDis);
				var iFrameBoxWidth=iCurLineTextLen*7;
				var iFrameBoxHeight=20;
				g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo[iPos].x+2,arrDrawScrnPo[iPos].y,iFrameBoxWidth,iFrameBoxHeight,G_V.objDynamicObjTextBoxStyle.bFill);
				arrStringTextInfo.push({
					x:arrDrawScrnPo[iPos].x+10,y:arrDrawScrnPo[iPos].y+15,text:strDis
				});
			};
			g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,strFont,textColor,iOpacity);
			for(var iPos=0;iPos<arrStringTextInfo.length;iPos++){
				g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawDynamicObjCanvas2D,arrStringTextInfo[iPos].x,arrStringTextInfo[iPos].y,arrStringTextInfo[iPos].text);
			}
		};
		break;
		case MAP_MOUSE_STATE.measureArea:var drawAreaSizeScrnPo=[];
		if(iDrawScrnPoCount>2){
			g_objHtml5DrawClass.DrawPolygon(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo,true);
			drawAreaSizeScrnPo=arrDrawScrnPo[iDrawScrnPoCount-1];
		};
		if(G_V.arrDrawDynamicObjGeoPo.length>2){
			var curAreaSize=l2(G_V.arrDrawDynamicObjGeoPo);
			var strAreaSize="";
			if(curAreaSize>1000000){
				curAreaSize=parseFloat(curAreaSize)/1000000;
				strAreaSize=curAreaSize.toFixed(3)+"(平方公里)";
			}
			else{
				strAreaSize=curAreaSize.toFixed(0)+"(平方米)";
			};
			if(G_V.objDynamicObjTextBoxStyle){
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,1,G_V.objDynamicObjTextBoxStyle.rectLineColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
				g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,G_V.objDynamicObjTextBoxStyle.rectFillColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
			};
			var iCurLineTextLen=g6(strAreaSize);
			var iFrameBoxWidth=iCurLineTextLen*7;
			var iFrameBoxHeight=20;
			g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawDynamicObjCanvas2D,drawAreaSizeScrnPo.x+2,drawAreaSizeScrnPo.y,iFrameBoxWidth,iFrameBoxHeight,G_V.objDynamicObjTextBoxStyle.bFill);
			g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,strFont,textColor,iOpacity);
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawDynamicObjCanvas2D,drawAreaSizeScrnPo.x+10,drawAreaSizeScrnPo.y+15,strAreaSize);
		};
		break;
		case MAP_MOUSE_STATE.directionLine:if(arrDrawScrnPo.length>1){
			var scrnPo1,scrnPo2;
			scrnPo1=arrDrawScrnPo[0];
			scrnPo2=arrDrawScrnPo[1];
			var r=l4(scrnPo1,scrnPo2);
			g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawDynamicObjCanvas2D,scrnPo1.x,scrnPo1.y,r,false);
			var xpos=scrnPo2.x-scrnPo1.x;
			var ypos=scrnPo2.y-scrnPo1.y;
			if(xpos>100||ypos>100){
				xpos*=3;
				ypos*=3;
			}
			else{
				xpos*=10;
				ypos*=10;
			};
			var arrLinePos=[];
			arrLinePos.push(scrnPo1);
			arrLinePos.push({
				x:scrnPo2.x+xpos,y:scrnPo2.y+ypos
			});
			g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawDynamicObjCanvas2D,arrLinePos,r,false);
			var lon1=G_V.arrDrawDynamicObjGeoPo[0].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var lat1=G_V.arrDrawDynamicObjGeoPo[0].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var lon2=G_V.arrDrawDynamicObjGeoPo[1].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var lat2=G_V.arrDrawDynamicObjGeoPo[1].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var curDis=k9(lon1,lat1,lon2,lat2);
			var hailiDis=curDis*0.5399568;
			var curDegrees=l0(lon1,lat1,lon2,lat2);
			var strText=hailiDis.toFixed(3)+"海里";
			if(G_V.bShowMeasureKmText==true){
				strText+="("+curDis.toFixed(3)+"千米)";
			};
			strText+=";"+curDegrees.toFixed(2)+"度";
			if(G_V.objDynamicObjTextBoxStyle){
				g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,1,G_V.objDynamicObjTextBoxStyle.rectLineColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
				g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,G_V.objDynamicObjTextBoxStyle.rectFillColor,G_V.objDynamicObjTextBoxStyle.iRectOpacity);
			};
			var iCurLineTextLen=g6(strText);
			var iFrameBoxWidth=iCurLineTextLen*7;
			var iFrameBoxHeight=20;
			g_objHtml5DrawClass.DrawRect(g_objYimaEncMap.drawDynamicObjCanvas2D,scrnPo2.x+2,scrnPo2.y,iFrameBoxWidth,iFrameBoxHeight,G_V.objDynamicObjTextBoxStyle.bFill);
			g_objHtml5DrawClass.SetTextStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,strFont,textColor,80);
			g_objHtml5DrawClass.DrawString(g_objYimaEncMap.drawDynamicObjCanvas2D,scrnPo2.x+10,scrnPo2.y+15,strText);
		};
		break;
		default:break;
	};
	g_objHtml5DrawClass.SetFillStyle(g_objYimaEncMap.drawDynamicObjCanvas2D,"#FFFFFF",iOpacity);
	for(var iPoPos=0;iPoPos<iDrawScrnPoCount;iPoPos++){
		g_objHtml5DrawClass.DrawCircle(g_objYimaEncMap.drawDynamicObjCanvas2D,arrDrawScrnPo[iPoPos].x,arrDrawScrnPo[iPoPos].y,3,true);
	}
};
function a9(bDrawCenterPo,bDrawScale,imgId,showImgSize,strDrawText){
	var bCutResult=false;
	var imgObj=document.getElementById(imgId);
	if(imgObj){
		var mapSize={
			w:G_V.iMapViewWidth,h:G_V.iMapViewHeight
		};
		var saveCanvas=i0("saveCanvas",{
			x:0,y:0
		}
		,mapSize,null,"absolute",100,null,"visible",1);
		var saveCanvas2D=saveCanvas.getContext("2d");
		g_objImgGridClass.DrawAllGridImgToCanvas(saveCanvas2D);
		g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawShipCanvas);
		g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawObjectCanvas);
		g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawTyphoonCanvas);
		g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawDynamicObjCanvas);
		g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawShipHistoryTrackCanvas);
		g_objHtml5DrawClass.SetTextStyle(saveCanvas2D,"11px 黑体","#ce0404",100);
		var iDrawTextButtom=mapSize.h-7;
		if(strDrawText!=null&&strDrawText!=""){
			g_objHtml5DrawClass.DrawString(saveCanvas2D,14,iDrawTextButtom,strDrawText);
			iDrawTextButtom-=14;
		};
		if(bDrawCenterPo){
			var strLon=k7(G_V.centerLonLatPo.x,true);
			var strLat=k7(G_V.centerLonLatPo.y,false);
			strLon=strLon.replace("  ","").replace(" ","");
			strLat=strLat.replace("  ","").replace(" ","");
			g_objHtml5DrawClass.DrawString(saveCanvas2D,14,iDrawTextButtom,"中心点:"+strLon+","+strLat);
			iDrawTextButtom-=14;
		};
		if(bDrawScale){
			g_objHtml5DrawClass.DrawString(saveCanvas2D,14,iDrawTextButtom,"比例尺:1/"+G_V.iCurScale);
		};
		var canvasData=saveCanvas.toDataURL();
		imgObj.src=canvasData;
		imgObj.style.width=showImgSize.w+"px";
		imgObj.style.height=showImgSize.h+"px";
		imgObj.style.display="block";
		bCutResult=true;
	}
};
function b0(bDrawCenterPo,bDrawScale,imgId,showImgSize,strDrawText){
	var bCutResult=false;
	var imgObj=document.getElementById(imgId);
	if(imgObj){
		var mapSize={
			w:G_V.iMapViewWidth,h:G_V.iMapViewHeight
		};
		var saveCanvas=i0("saveCanvas",{
			x:0,y:0
		}
		,mapSize,null,"absolute",100,null,"visible",1);
		var saveCanvas2D=saveCanvas.getContext("2d");
		g_objImgGridClass.DrawAllGridImgToCanvas(saveCanvas2D);
		setTimeout(function(){
			g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawShipCanvas);
			g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawObjectCanvas);
			g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawTyphoonCanvas);
			g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawDynamicObjCanvas);
			g_objHtml5DrawClass.DrawImg(saveCanvas2D,G_V.drawObjCanvasPo.x,G_V.drawObjCanvasPo.y,g_objYimaEncMap.drawShipHistoryTrackCanvas);
			g_objHtml5DrawClass.SetTextStyle(saveCanvas2D,"11px 黑体","#ce0404",100);
			var iDrawTextButtom=mapSize.h-7;
			if(strDrawText!=null&&strDrawText!=""){
				g_objHtml5DrawClass.DrawString(saveCanvas2D,14,iDrawTextButtom,strDrawText);
				iDrawTextButtom-=14;
			};
			if(bDrawCenterPo){
				var strLon=k7(G_V.centerLonLatPo.x,true);
				var strLat=k7(G_V.centerLonLatPo.y,false);
				strLon=strLon.replace("  ","").replace(" ","");
				strLat=strLat.replace("  ","").replace(" ","");
				g_objHtml5DrawClass.DrawString(saveCanvas2D,14,iDrawTextButtom,"中心点:"+strLon+","+strLat);
				iDrawTextButtom-=14;
			};
			if(bDrawScale){
				g_objHtml5DrawClass.DrawString(saveCanvas2D,14,iDrawTextButtom,"比例尺:1/"+G_V.iCurScale);
			};
			var canvasData=saveCanvas.toDataURL();
			imgObj.src=canvasData;
			imgObj.style.width=showImgSize.w+"px";
			imgObj.style.height=showImgSize.h+"px";
			imgObj.style.display="block";
			bCutResult=true;
		}
		,2000);
	}
};
function b1(){
	if(G_V.drawDisLenCanvas){
		g_objHtml5DrawClass.Clear(G_V.drawDisLenCanvas,G_V.drawDisLenCanvas2D);
		if(G_V.iCurScale>60000000){
			return;
		};
		var leftLonLatPo=k6(0,G_V.iMapViewHeight/2,G_V.iCurScale);
		var rightLonLatPo=k6(G_V.iMapViewWidth,G_V.iMapViewHeight/2,G_V.iCurScale);
		var disKm=k9(leftLonLatPo.x,leftLonLatPo.y,rightLonLatPo.x,rightLonLatPo.y);
		var iScrnLen=G_V.iMapViewWidth;
		var disScrnLen=10;
		var iDisLen=10;
		var pxDisHaili=disKm/ 1.852 /iScrnLen;
		if(pxDisHaili>3){
			iDisLen=300;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>2){
			iDisLen=150;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>1){
			iDisLen=100;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.5){
			iDisLen=50;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.2){
			iDisLen=20;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.1){
			iDisLen=10;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.05){
			iDisLen=5;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.025){
			iDisLen=2.5;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.01){
			iDisLen=1;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.005){
			iDisLen=0.5;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.0025){
			iDisLen=0.3;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.002){
			iDisLen=0.2;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.001){
			iDisLen=0.1;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.0005){
			iDisLen=0.05;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else if(pxDisHaili>0.00025){
			iDisLen=0.02;
			disScrnLen=iDisLen/pxDisHaili;
		}
		else{
			iDisLen=0.01;
			disScrnLen=iDisLen/pxDisHaili;
		};
		if(iDisLen<1){
			iDisLen=iDisLen.toFixed(2);
		}
		else{
			iDisLen=parseInt(iDisLen);
		};
		var strDisText=iDisLen+" 海里";
		var TextScrnLen=(strDisText.length+2)*5;
		var arrScrnPo=[];
		var top=G_V.drawDisLenCanvas.clientHeight-5;
		arrScrnPo.push({
			x:0,y:top
		});
		arrScrnPo.push({
			x:disScrnLen,y:top
		});
		g_objHtml5DrawClass.SetLineStyle(G_V.drawDisLenCanvas2D,2,"#000000",100);
		g_objHtml5DrawClass.DrawLine(G_V.drawDisLenCanvas2D,arrScrnPo);
		g_objHtml5DrawClass.SetLineStyle(G_V.drawDisLenCanvas2D,1,"#000000",100);
		arrScrnPo=[];
		arrScrnPo.push({
			x:0,y:top-6
		});
		arrScrnPo.push({
			x:0,y:top
		});
		g_objHtml5DrawClass.DrawLine(G_V.drawDisLenCanvas2D,arrScrnPo);
		arrScrnPo=[];
		arrScrnPo.push({
			x:disScrnLen,y:top-6
		});
		arrScrnPo.push({
			x:disScrnLen,y:top
		});
		g_objHtml5DrawClass.DrawLine(G_V.drawDisLenCanvas2D,arrScrnPo);
		g_objHtml5DrawClass.DrawString(G_V.drawDisLenCanvas2D,(disScrnLen-TextScrnLen)/2,top-5,strDisText);
	}
};
var YimaEncSdkMap={};
function b2(){
	this.BROWSER_EVENTS=["mouseover","mouseout","mousedown","mouseup","mousemove","click","dblclick","rightclick","dblrightclick","resize","focus","blur"];
	this.observers=false;
	this.KEY_BACKSPACE=8;
	this.KEY_TAB=9;
	this.KEY_RETURN=13;
	this.KEY_ESC=27;
	this.KEY_LEFT=37;
	this.KEY_UP=38;
	this.KEY_RIGHT=39;
	this.KEY_DOWN=40;
	this.KEY_DELETE=46;
	this.element=function(event){
		return event.target||event.srcElement;
	};
	this.stop=function(event,allowDefault){
		if(!allowDefault){
			if(event.preventDefault){
				event.preventDefault();
			}
			else{
				event.returnValue=false;
			}
		};
		if(event.stopPropagation){
			event.stopPropagation();
		}
		else{
			event.cancelBubble=true;
		}
	};
	this.observe=function(elementParam,name,observer,useCapture){
		var element=i2(elementParam);
		useCapture=useCapture||false;
		if(name=='keypress'&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||element.attachEvent)){
			name='keydown';
		};
		if(!this.observers){
			this.observers={};
		};
		if(!element._eventCacheID){
			var idPrefix="eventCacheID_";
			if(element.id){
				idPrefix=element.id+"_"+idPrefix;
			};
			element._eventCacheID=h6(idPrefix);
		};
		var cacheID=element._eventCacheID;
		if(!this.observers[cacheID]){
			this.observers[cacheID]=[];
		};
		this.observers[cacheID].push({
			'element':element,'name':name,'observer':observer,'useCapture':useCapture
		});
		if(element.addEventListener){
			element.addEventListener(name,observer,useCapture);
		}
		else if(element.attachEvent){
			element.attachEvent('on'+name,observer);
		}
	};
	this.stopObservingElement=function(elementParam){
		var element=OpenLayers.Util_GetElement(elementParam);
		var cacheID=element._eventCacheID;
		this._removeElementObservers(this.observers[cacheID]);
	};
	this._removeElementObservers=function(elementObservers){
		if(elementObservers){
			for(var i=elementObservers.length-1;i>=0;i--){
				var entry=elementObservers[i];
				var args=new Array(entry.element,entry.name,entry.observer,entry.useCapture);
				var removed=this.stopObserving.apply(this,args);
			}
		}
	};
	this.stopObserving=function(elementParam,name,observer,useCapture){
		useCapture=useCapture||false;
		var element=i2(elementParam);
		var cacheID=element._eventCacheID;
		if(name=='keypress'){
			if(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||element.detachEvent){
				name='keydown';
			}
		};
		var foundEntry=false;
		var elementObservers=this.observers[cacheID];
		if(elementObservers){
			var i=0;
			while(!foundEntry&&i<elementObservers.length){
				var cacheEntry=elementObservers[i];
				if((cacheEntry.name==name)&&(cacheEntry.observer==observer)&&(cacheEntry.useCapture==useCapture)){
					elementObservers.splice(i,1);
					if(elementObservers.length==0){
						delete this.observers[cacheID];
					};
					foundEntry=true;
					break;
				};
				i++;
			}
		};
		if(foundEntry){
			if(element.removeEventListener){
				element.removeEventListener(name,observer,useCapture)
			}
			else if(element&&element.detachEvent){
				element.detachEvent('on'+name,observer);
			}
		};
		return foundEntry;
	};
	this.AddMouseEvent=function(obj,type,fn){
		if(obj.addEventListener){
			if(type=="mousewheel"){
				var isFirefox=typeof document.body.style.MozUserSelect!='undefined';
				obj.addEventListener(isFirefox?'DOMMouseScroll':type,fn,false)
			}
			else{
				obj.addEventListener(type,fn,false)
			}
		}
		else{
			obj.attachEvent('on'+type,fn)
		};
		return fn
	}
};
function b3(){
	this.listeners=null;
	this.object=null;
	this.element=null;
	this.eventTypes=null;
	this.eventHandler=null,this.fallThrough=null;
	this.includeXY=false;
	this.clearMouseListener=null;
	this.initialize=function(object,element,eventTypes,fallThrough,options){
		i3(this,options);
		this.object=object;
		this.fallThrough=fallThrough;
		this.listeners={};
		this.eventHandler=i4(this.handleBrowserEvent,this);
		this.clearMouseListener=i4(this.clearMouseCache,this);
		this.eventTypes=[];
		if(eventTypes!=null){
			for(var i=0,len=eventTypes.length;i<len;i++){
				this.addEventType(eventTypes[i]);
			}
		};
		if(element!=null){
			this.attachToElement(element);
		}
	};
	this.destroy=function(){
		if(this.element){
			g_objEventClass.stopObservingElement(this.element);
			if(this.element.hasScrollEvent){
				g_objEventClass.stopObserving(window,"scroll",this.clearMouseListener);
			}
		};
		this.element=null;
		this.listeners=null;
		this.object=null;
		this.eventTypes=null;
		this.fallThrough=null;
		this.eventHandler=null;
	};
	this.addEventType=function(eventName){
		if(!this.listeners[eventName]){
			this.eventTypes.push(eventName);
			this.listeners[eventName]=[];
		}
	};
	this.attachToElement=function(element){
		if(this.element){
			g_objEventClass.stopObservingElement(this.element);
		};
		this.element=element;
		for(var i=0,len=g_objEventClass.BROWSER_EVENTS.length;i<len;i++){
			var eventType=g_objEventClass.BROWSER_EVENTS[i];
			this.addEventType(eventType);
			g_objEventClass.observe(element,eventType,this.eventHandler);
		};
		g_objEventClass.observe(element,"dragstart",g_objEventClass.stop);
	};
	this.on=function(object){
		for(var type in object){
			if(type!="scope"){
				this.register(type,object.scope,object[type]);
			}
		}
	};
	this.register=function(type,obj,func){
		if((func!=null)&&(Util_IndexOf(this.eventTypes,type)!=-1)){
			if(obj==null){
				obj=this.object;
			};
			var listeners=this.listeners[type];
			listeners.push({
				obj:obj,func:func
			});
		}
	};
	this.registerPriority=function(type,obj,func){
		if(func!=null){
			if(obj==null){
				obj=this.object;
			};
			var listeners=this.listeners[type];
			if(listeners!=null){
				listeners.unshift({
					obj:obj,func:func
				});
			}
		}
	}
	,this.un=function(object){
		for(var type in object){
			if(type!="scope"){
				this.unregister(type,object.scope,object[type]);
			}
		}
	};
	this.unregister=function(type,obj,func){
		if(obj==null){
			obj=this.object;
		};
		var listeners=this.listeners[type];
		if(listeners!=null){
			for(var i=0,len=listeners.length;i<len;i++){
				if(listeners[i].obj==obj&&listeners[i].func==func){
					listeners.splice(i,1);
					break;
				}
			}
		}
	};
	this.remove=function(type){
		if(this.listeners[type]!=null){
			this.listeners[type]=[];
		}
	};
	this.triggerEvent=function(type,evt){
		var listeners=this.listeners[type];
		if(!listeners||listeners.length==0){
			return;
		};
		if(evt==null){
			evt={};
		};
		evt.object=this.object;
		evt.element=this.element;
		if(!evt.type){
			evt.type=type;
		};
		var listeners=listeners.slice(),continueChain;
		for(var i=0,len=listeners.length;i<len;i++){
			var callback=listeners[i];
			continueChain=callback.func.apply(callback.obj,[evt]);
			if((continueChain!=undefined)&&(continueChain==false)){
				break;
			}
		};
		if(!this.fallThrough){
			g_objEventClass.stop(evt,true)
		};
		return continueChain;
	};
	this.handleBrowserEvent=function(evt){
		if(this.includeXY){
			evt.xy=this.getMousePosition(evt);
		};
		this.triggerEvent(evt.type,evt);
	};
	this.clearMouseCache=function(){
		this.element.scrolls=null;
		this.element.lefttop=null;
		this.element.offsets=null;
	};
	this.getMousePosition=function(evt){
		var po=[];
		po.x=evt.clientX;
		po.y=evt.clientY;
		return po;
	}
};
function b4(){
	this.threshold=0;
	this.deceleration=0.0035;
	this.nbPoints=50;
	this.delay=300,this.points=undefined;
	this.minMoveDis=3;
	this.timerId=undefined;
	this.acceleration=-1;
	this.initialize=function(options){
		i3(this,options);
	}
	,this.begin=function(){
		if(this.timerId!=undefined&&this.timerId!=null){
			g_objDrawObjClass.RedrawAllObjAfterChange();
		};
		YimaEncSdkMap.Animation.stop(this.timerId);
		this.timerId=undefined;
		this.points=[];
	};
	this.update=function(xy){
		var curTime=new Date().getTime();
		this.points.unshift({
			xy:xy,tick:curTime
		});
		if(this.points.length>this.nbPoints){
			this.points.pop();
		}
	};
	this.end=function(xy){
		var iPoCount=this.points.length;
		var lastScrnPoInfo,firstScrnPoInfo;
		if(iPoCount<2){
			return false;
		};
		lastScrnPoInfo=this.points[iPoCount-1];
		var curNowTime=(new Date()).getTime();
		for(var i=iPoCount-2;i>0;i--){
			var offsetTiem=curNowTime-this.points[i].tick;
			if(offsetTiem>this.delay){
				break;
			};
			firstScrnPoInfo=this.points[i];
		};
		if(!firstScrnPoInfo){
			return false;
		};
		var dis=l4(firstScrnPoInfo.xy,lastScrnPoInfo.xy);
		if(dis<this.minMoveDis){
			return false;
		};
		var speed,sinAngle,cosAngle;
		speed=dis/200*20;
		sinAngle=(lastScrnPoInfo.xy.y-firstScrnPoInfo.xy.y)/dis;
		cosAngle=(lastScrnPoInfo.xy.x-firstScrnPoInfo.xy.x)/dis;
		var info={
			speed:speed,sinAngle:sinAngle,cosAngle:cosAngle
		};
		return info;
	};
	this.move=function(info,callback){
		var speed=info.speed;
		var sinAngle=info.sinAngle;
		var cosAngle=info.cosAngle;
		var initialTime=new Date().getTime();
		var lastX=0;
		var lastY=0;
		var m9=function(){
			if(this.timerId==null){
				return;
			};
			speed+=this.acceleration;
			if(speed<=0){
				YimaEncSdkMap.Animation.stop(this.timerId);
				this.timerId=null;
				g_objDrawObjClass.RedrawAllObjAfterChange();
				if(typeof ReturnAfterDragMapForPc==='function'){
					ReturnAfterDragMapForPc();
				}
			};
			var moveX=speed*cosAngle;
			var moveY=speed*sinAngle;
			callback(moveX,moveY,true);
		};
		this.timerId=YimaEncSdkMap.Animation.start(i4(m9,this));
	}
};
YimaEncSdkMap.Animation=(function(window){
	var requestAnimationFrame="requestAnimationFrame";
	var isNative=!!(requestAnimationFrame);
	var requestFrame=(function(){
		var request=window[requestAnimationFrame]||function(callback,element){
			window.setTimeout(callback,16);
		};
		return function(callback,element){
			request.apply(window,[callback,element]);
		}
	})();
	var counter=0;
	var loops={};
	function m9(callback,duration,element){
		duration=duration>0?duration:Number.POSITIVE_INFINITY;
		var id=++counter;
		var start=+new Date;
		loops[id]=function(){
			if(loops[id]&&+new Date-start<=duration){
				callback();
				if(loops[id]){
					requestFrame(loops[id],element);
				}
			}
			else{
				delete loops[id];
			}
		};
		requestFrame(loops[id],element);
		return id;
	};
	function n0(id){
		delete loops[id];
	};
	var info=[];
	info.isNative=isNative;
	info.requestFrame=requestFrame;
	info.start=m9;
	info.stop=n0;
	return info;
})(window);
if(!document.createElement('canvas').getContext){
	(function(){
		var m=Math;
		var mr=m.round;
		var ms=m.sin;
		var mc=m.cos;
		var abs=m.abs;
		var sqrt=m.sqrt;
		this.strokeStyle='#000';
		this.fillStyle='#FF0000';
		this.font='11px sans-serif';
		var Z=10;
		var Z2=Z/2;
		var IE_VERSION=+navigator.userAgent.match(/MSIE ([\d.]+)?/)[1];
		function m9(){
			return this.context_||(this.context_=new o9(this));
		};
		var slice=Array.prototype.slice;
		function n0(f,obj,var_args){
			var a=slice.call(arguments,2);
			return function(){
				return f.apply(obj,a.concat(slice.call(arguments)));
			};
		};
		function n1(s){
			return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
		};
		function n2(doc,prefix,urn){
			if(!doc.namespaces[prefix]){
				if(IE_VERSION>=7){
					doc.namespaces.add(prefix,urn).doImport('#default#VML');
				}
				else{
					doc.namespaces.add(prefix,urn);
				}
			}
		};
		function n3(doc){
			n2(doc,'g_vml_','urn:schemas-microsoft-com:vml');
			n2(doc,'g_o_','urn:schemas-microsoft-com:office:office');
			if(!doc.styleSheets['ex_canvas_']){
				var ss=doc.createStyleSheet();
				ss.owningElement.id='ex_canvas_';
				ss.cssText='canvas{display:inline-block;overflow:hidden;'+'text-align:left;width:300px;height:150px}';
			}
		};
		n3(document);
		var G_vmlCanvasManager_={
			init:function(opt_doc){
				var doc=opt_doc||document;
				doc.createElement('canvas');
				doc.attachEvent('onreadystatechange',n0(this.init_,this,doc));
			}
			,init_:function(doc){
				var els=doc.getElementsByTagName('canvas');
				for(var i=0;i<els.length;i++){
					this.initElement(els[i]);
				}
			}
			,initElement:function(elel){
				if(!elel.getContext){
					elel.getContext=m9;
					n3(elel.ownerDocument);
					elel.innerHTML='';
					elel.attachEvent('onpropertychange',n4);
					elel.attachEvent('onresize',n5);
					var attrs=elel.attributes;
					if(attrs.width&&attrs.width.specified){
						elel.style.width=attrs.width.nodeValue+'px';
					}
					else{
						elel.width=elel.clientWidth;
					};
					if(attrs.height&&attrs.height.specified){
						elel.style.height=attrs.height.nodeValue+'px';
					}
					else{
						elel.height=elel.clientHeight;
					}
				};
				return elel;
			}
		};
		function n4(e){
			var el=e.srcElement;
			switch(e.propertyName){
				case'width':el.getContext().clearRect();
				el.style.width=el.attributes.width.nodeValue+'px';
				el.firstChild.style.width=el.clientWidth+'px';
				break;
				case'height':el.getContext().clearRect();
				el.style.height=el.attributes.height.nodeValue+'px';
				el.firstChild.style.height=el.clientHeight+'px';
				break;
			}
		};
		function n5(e){
			var el=e.srcElement;
			if(el.firstChild){
				el.firstChild.style.width=el.clientWidth+'px';
				el.firstChild.style.height=el.clientHeight+'px';
			}
		};
		G_vmlCanvasManager_.init();
		var decToHex=[];
		for(var i=0;i<16;i++){
			for(var j=0;j<16;j++){
				decToHex[i*16+j]=i.toString(16)+j.toString(16);
			}
		};
		function n6(){
			return[[1,0,0],[0,1,0],[0,0,1]];
		};
		function n7(arrNumInfo1,arrNumInfo2){
			var result=n6();
			for(var x=0;x<3;x++){
				for(var y=0;y<3;y++){
					var sum=0;
					for(var z=0;z<3;z++){
						sum+=arrNumInfo1[x][z]*arrNumInfo2[z][y];
					};
					result[x][y]=sum;
				}
			};
			return result;
		};
		function n8(obj1,obj2){
			obj2.fillStyle=obj1.fillStyle;
			obj2.lineCap=obj1.lineCap;
			obj2.lineJoin=obj1.lineJoin;
			obj2.lineWidth=obj1.lineWidth;
			obj2.miterLimit=obj1.miterLimit;
			obj2.shadowBlur=obj1.shadowBlur;
			obj2.shadowColor=obj1.shadowColor;
			obj2.shadowOffsetX=obj1.shadowOffsetX;
			obj2.shadowOffsetY=obj1.shadowOffsetY;
			obj2.strokeStyle=obj1.strokeStyle;
			obj2.globalAlpha=obj1.globalAlpha;
			obj2.font=obj1.font;
			obj2.textAlign=obj1.textAlign;
			obj2.textBaseline=obj1.textBaseline;
			obj2.arcScaleX_=obj1.arcScaleX_;
			obj2.arcScaleY_=obj1.arcScaleY_;
			obj2.lineScale_=obj1.lineScale_;
		};
		var colorData={
			aliceblue:'#F0F8FF',antiquewhite:'#FAEBD7',aquamarine:'#7FFFD4',azure:'#F0FFFF',beige:'#F5F5DC',bisque:'#FFE4C4',black:'#000000',blanchedalmond:'#FFEBCD',blueviolet:'#8A2BE2',brown:'#A52A2A',burlywood:'#DEB887',cadetblue:'#5F9EA0',chartreuse:'#7FFF00',chocolate:'#D2691E',coral:'#FF7F50',cornflowerblue:'#6495ED',cornsilk:'#FFF8DC',crimson:'#DC143C',cyan:'#00FFFF',darkblue:'#00008B',darkcyan:'#008B8B',darkgoldenrod:'#B8860B',darkgray:'#A9A9A9',darkgreen:'#006400',darkgrey:'#A9A9A9',darkkhaki:'#BDB76B',darkmagenta:'#8B008B',darkolivegreen:'#556B2F',darkorange:'#FF8C00',darkorchid:'#9932CC',darkred:'#8B0000',darksalmon:'#E9967A',darkseagreen:'#8FBC8F',darkslateblue:'#483D8B',darkslategray:'#2F4F4F',darkslategrey:'#2F4F4F',darkturquoise:'#00CED1',darkviolet:'#9400D3',deeppink:'#FF1493',deepskyblue:'#00BFFF',dimgray:'#696969',dimgrey:'#696969',dodgerblue:'#1E90FF',firebrick:'#B22222',floralwhite:'#FFFAF0',forestgreen:'#228B22',gainsboro:'#DCDCDC',ghostwhite:'#F8F8FF',gold:'#FFD700',goldenrod:'#DAA520',grey:'#808080',greenyellow:'#ADFF2F',honeydew:'#F0FFF0',hotpink:'#FF69B4',indianred:'#CD5C5C',indigo:'#4B0082',ivory:'#FFFFF0',khaki:'#F0E68C',lavender:'#E6E6FA',lavenderblush:'#FFF0F5',lawngreen:'#7CFC00',lemonchiffon:'#FFFACD',lightblue:'#ADD8E6',lightcoral:'#F08080',lightcyan:'#E0FFFF',lightgoldenrodyellow:'#FAFAD2',lightgreen:'#90EE90',lightgrey:'#D3D3D3',lightpink:'#FFB6C1',lightsalmon:'#FFA07A',lightseagreen:'#20B2AA',lightskyblue:'#87CEFA',lightslategray:'#778899',lightslategrey:'#778899',lightsteelblue:'#B0C4DE',lightyellow:'#FFFFE0',limegreen:'#32CD32',linen:'#FAF0E6',magenta:'#FF00FF',mediumaquamarine:'#66CDAA',mediumblue:'#0000CD',mediumorchid:'#BA55D3',mediumpurple:'#9370DB',mediumseagreen:'#3CB371',mediumslateblue:'#7B68EE',mediumspringgreen:'#00FA9A',mediumturquoise:'#48D1CC',mediumvioletred:'#C71585',midnightblue:'#191970',mintcream:'#F5FFFA',mistyrose:'#FFE4E1',moccasin:'#FFE4B5',navajowhite:'#FFDEAD',oldlace:'#FDF5E6',olivedrab:'#6B8E23',orange:'#FFA500',orangered:'#FF4500',orchid:'#DA70D6',palegoldenrod:'#EEE8AA',palegreen:'#98FB98',paleturquoise:'#AFEEEE',palevioletred:'#DB7093',papayawhip:'#FFEFD5',peachpuff:'#FFDAB9',peru:'#CD853F',pink:'#FFC0CB',plum:'#DDA0DD',powderblue:'#B0E0E6',rosybrown:'#BC8F8F',royalblue:'#4169E1',saddlebrown:'#8B4513',salmon:'#FA8072',sandybrown:'#F4A460',seagreen:'#2E8B57',seashell:'#FFF5EE',sienna:'#A0522D',skyblue:'#87CEEB',slateblue:'#6A5ACD',slategray:'#708090',slategrey:'#708090',snow:'#FFFAFA',springgreen:'#00FF7F',steelblue:'#4682B4',tan:'#D2B48C',thistle:'#D8BFD8',tomato:'#FF6347',turquoise:'#40E0D0',violet:'#EE82EE',wheat:'#F5DEB3',whitesmoke:'#F5F5F5',yellowgreen:'#9ACD32'
		};
		function n9(styleString){
			var start=styleString.indexOf('(',3);
			var end=styleString.indexOf(')',start+1);
			var parts=styleString.substring(start+1,end).split(',');
			if(parts.length!=4||styleString.charAt(3)!='a'){
				parts[3]=1;
			};
			return parts;
		};
		function o0(s){
			return parseFloat(s)/100;
		};
		function o1(v,min,max){
			return Math.min(max,Math.max(min,v));
		};
		function o2(parts){
			var r,g,b,h,s,l;
			h=parseFloat(parts[0])/360%360;
			if(h<0)h++;
			s=o1(o0(parts[1]),0,1);
			l=o1(o0(parts[2]),0,1);
			if(s==0){
				r=g=b=l;
			}
			else{
				var q=l<0.5?l*(1+s):l+s-l*s;
				var p=2*l-q;
				r=o3(p,q,h+1/3);
				g=o3(p,q,h);
				b=o3(p,q,h-1/3);
			};
			return'#'+decToHex[Math.floor(r*255)]+decToHex[Math.floor(g*255)]+decToHex[Math.floor(b*255)];
		};
		function o3(num1,num2,h){
			if(h<0)h++;
			if(h>1)h--;
			if(6*h<1)return num1+(num2-num1)*6*h;
			else if(2*h<1)return num2;
			else if(3*h<2)return num1+(num2-num1)*(2/3-h)*6;
			else return num1;
		};
		function o4(styleString){
			var str,alpha=1;
			styleString=String(styleString);
			if(styleString.charAt(0)=='#'){
				str=styleString
			}
			else if(/^rgb/.test(styleString)){
				var parts=n9(styleString);
				var str='#',n;
				for(var i=0;i<3;i++){
					if(parts[i].indexOf('%')!=-1){
						n=Math.floor(o0(parts[i])*255);
					}
					else{
						n=+parts[i];
					};
					str+=decToHex[o1(n,0,255)];
				};
				alpha=+parts[3];
			}
			else if(/^hsl/.test(styleString)){
				var parts=n9(styleString);
				str=o2(parts);
				alpha=parts[3];
			}
			else{
				str=colorData[styleString]||styleString;
			};
			return{
				color:str,alpha:alpha
			};
		};
		var DEFAULT_STYLE={
			style:'normal',variant:'normal',weight:'normal',size:10,family:'sans-serif'
		};
		var fontStyleCache={};
		function o5(styleString){
			if(fontStyleCache[styleString]){
				return fontStyleCache[styleString];
			};
			var el=document.createElement('div');
			var style=el.style;
			try{
				style.font=styleString;
			}
			catch(ex){};
			return fontStyleCache[styleString]={
				style:style.fontStyle||DEFAULT_STYLE.style,variant:style.fontVariant||DEFAULT_STYLE.variant,weight:style.fontWeight||DEFAULT_STYLE.weight,size:style.fontSize||DEFAULT_STYLE.size,family:style.fontFamily||DEFAULT_STYLE.family
			};
		};
		function o6(style,element){
			var computedStyle={};
			for(var p in style){
				computedStyle[p]=style[p];
			};
			var canvasFontSize=parseFloat(element.currentStyle.fontSize),fontSize=parseFloat(style.size);
			if(typeof style.size=='number'){
				computedStyle.size=style.size;
			}
			else if(style.size.indexOf('px')!=-1){
				computedStyle.size=fontSize;
			}
			else if(style.size.indexOf('em')!=-1){
				computedStyle.size=canvasFontSize*fontSize;
			}
			else if(style.size.indexOf('%')!=-1){
				computedStyle.size=(canvasFontSize/100)*fontSize;
			}
			else if(style.size.indexOf('pt')!=-1){
				computedStyle.size=fontSize/.75;
			}
			else{
				computedStyle.size=canvasFontSize;
			};
			computedStyle.size*=0.981;
			return computedStyle;
		};
		function o7(style){
			return style.style+' '+style.variant+' '+style.weight+' '+style.size+'px '+style.family;
		};
		function o8(lineCap){
			switch(lineCap){
				case'butt':return'flat';
				case'round':return'round';
				case'square':default:return'square';
			}
		};
		function o9(canvasElement){
			this.m_=n6();
			this.mStack_=[];
			this.aStack_=[];
			this.currentPath_=[];
			this.strokeStyle='#000';
			this.fillStyle='#000';
			this.lineWidth=1;
			this.lineJoin='miter';
			this.lineCap='butt';
			this.miterLimit=Z*1;
			this.globalAlpha=1;
			this.font='12px sans-serif';
			this.textAlign='left';
			this.textBaseline='alphabetic';
			this.canvas=canvasElement;
			var cssText='width:'+canvasElement.clientWidth+'px;height:'+canvasElement.clientHeight+'px;overflow:hidden;position:absolute';
			var el=canvasElement.ownerDocument.createElement('div');
			el.style.cssText=cssText;
			canvasElement.appendChild(el);
			var overlayEl=el.cloneNode(false);
			overlayEl.style.backgroundColor='red';
			overlayEl.style.filter='alpha(opacity=0)';
			canvasElement.appendChild(overlayEl);
			this.element_=el;
			this.arcScaleX_=1;
			this.arcScaleY_=1;
			this.lineScale_=1;
		};
		var contextPrototype=o9.prototype;
		contextPrototype.clearRect=function(){
			if(this.textMeasureEl_){
				this.textMeasureEl_.removeNode(true);
				this.textMeasureEl_=null;
			};
			this.element_.innerHTML='';
		};
		contextPrototype.beginPath=function(){
			this.currentPath_=[];
		};
		contextPrototype.moveTo=function(aX,aY){
			var p=this.getCoords_(aX,aY);
			this.currentPath_.push({
				type:'moveTo',x:p.x,y:p.y
			});
			this.currentX_=p.x;
			this.currentY_=p.y;
		};
		contextPrototype.lineTo=function(aX,aY){
			var p=this.getCoords_(aX,aY);
			this.currentPath_.push({
				type:'lineTo',x:p.x,y:p.y
			});
			this.currentX_=p.x;
			this.currentY_=p.y;
		};
		contextPrototype.bezierCurveTo=function(aCP1x,aCP1y,aCP2x,aCP2y,aX,aY){
			var p=this.getCoords_(aX,aY);
			var cp1=this.getCoords_(aCP1x,aCP1y);
			var cp2=this.getCoords_(aCP2x,aCP2y);
			p0(this,cp1,cp2,p);
		};
		function p0(self,cp1,cp2,p){
			self.currentPath_.push({
				type:'bezierCurveTo',cp1x:cp1.x,cp1y:cp1.y,cp2x:cp2.x,cp2y:cp2.y,x:p.x,y:p.y
			});
			self.currentX_=p.x;
			self.currentY_=p.y;
		};
		contextPrototype.quadraticCurveTo=function(aCPx,aCPy,aX,aY){
			var cp=this.getCoords_(aCPx,aCPy);
			var p=this.getCoords_(aX,aY);
			var cp1={
				x:this.currentX_+2.0/3.0*(cp.x-this.currentX_),y:this.currentY_+2.0/3.0*(cp.y-this.currentY_)
			};
			var cp2={
				x:cp1.x+(p.x-this.currentX_)/3.0,y:cp1.y+(p.y-this.currentY_)/3.0
			};
			p0(this,cp1,cp2,p);
		};
		contextPrototype.arc=function(aX,aY,aRadius,aStartAngle,aEndAngle,aClockwise){
			aRadius*=Z;
			var arcType=aClockwise?'at':'wa';
			var xStart=aX+mc(aStartAngle)*aRadius-Z2;
			var yStart=aY+ms(aStartAngle)*aRadius-Z2;
			var xEnd=aX+mc(aEndAngle)*aRadius-Z2;
			var yEnd=aY+ms(aEndAngle)*aRadius-Z2;
			if(xStart==xEnd&&!aClockwise){
				xStart+=0.125;
			};
			var p=this.getCoords_(aX,aY);
			var pStart=this.getCoords_(xStart,yStart);
			var pEnd=this.getCoords_(xEnd,yEnd);
			this.currentPath_.push({
				type:arcType,x:p.x,y:p.y,radius:aRadius,xStart:pStart.x,yStart:pStart.y,xEnd:pEnd.x,yEnd:pEnd.y
			});
		};
		contextPrototype.rect=function(aX,aY,aWidth,aHeight){
			this.moveTo(aX,aY);
			this.lineTo(aX+aWidth,aY);
			this.lineTo(aX+aWidth,aY+aHeight);
			this.lineTo(aX,aY+aHeight);
			this.closePath();
		};
		contextPrototype.strokeRect=function(aX,aY,aWidth,aHeight){
			var oldPath=this.currentPath_;
			this.beginPath();
			this.moveTo(aX,aY);
			this.lineTo(aX+aWidth,aY);
			this.lineTo(aX+aWidth,aY+aHeight);
			this.lineTo(aX,aY+aHeight);
			this.closePath();
			this.stroke();
			this.currentPath_=oldPath;
		};
		contextPrototype.fillRect=function(aX,aY,aWidth,aHeight){
			var oldPath=this.currentPath_;
			this.beginPath();
			this.moveTo(aX,aY);
			this.lineTo(aX+aWidth,aY);
			this.lineTo(aX+aWidth,aY+aHeight);
			this.lineTo(aX,aY+aHeight);
			this.closePath();
			this.fill();
			this.currentPath_=oldPath;
		};
		contextPrototype.createLinearGradient=function(aX0,aY0,aX1,aY1){
			var gradient=new p5('gradient');
			gradient.x0_=aX0;
			gradient.y0_=aY0;
			gradient.x1_=aX1;
			gradient.y1_=aY1;
			return gradient;
		};
		contextPrototype.createRadialGradient=function(aX0,aY0,aR0,aX1,aY1,aR1){
			var gradient=new p5('gradientradial');
			gradient.x0_=aX0;
			gradient.y0_=aY0;
			gradient.r0_=aR0;
			gradient.x1_=aX1;
			gradient.y1_=aY1;
			gradient.r1_=aR1;
			return gradient;
		};
		contextPrototype.drawImage=function(image,var_args){
			var dx,dy,dw,dh,sx,sy,sw,sh;
			var oldRuntimeWidth=image.runtimeStyle.width;
			var oldRuntimeHeight=image.runtimeStyle.height;
			image.runtimeStyle.width='auto';
			image.runtimeStyle.height='auto';
			var w=image.width;
			var h=image.height;
			image.runtimeStyle.width=oldRuntimeWidth;
			image.runtimeStyle.height=oldRuntimeHeight;
			if(arguments.length==3){
				dx=arguments[1];
				dy=arguments[2];
				sx=sy=0;
				sw=dw=w;
				sh=dh=h;
			}
			else if(arguments.length==5){
				dx=arguments[1];
				dy=arguments[2];
				dw=arguments[3];
				dh=arguments[4];
				sx=sy=0;
				sw=w;
				sh=h;
			}
			else if(arguments.length==9){
				sx=arguments[1];
				sy=arguments[2];
				sw=arguments[3];
				sh=arguments[4];
				dx=arguments[5];
				dy=arguments[6];
				dw=arguments[7];
				dh=arguments[8];
			}
			else{
				throw Error('Invalid number of arguments');
			};
			var d=this.getCoords_(dx,dy);
			var w2=sw/2;
			var h2=sh/2;
			var vmlStr=[];
			var W=10;
			var H=10;
			vmlStr.push(' <g_vml_:group',' coordsize="',Z*W,',',Z*H,'"',' coordorigin="0,0"',' style="width:',W,'px;height:',H,'px;position:absolute;');
			if(this.m_[0][0]!=1||this.m_[0][1]||this.m_[1][1]!=1||this.m_[1][0]){
				var filter=[];
				filter.push('M11=',this.m_[0][0],',','M12=',this.m_[1][0],',','M21=',this.m_[0][1],',','M22=',this.m_[1][1],',','Dx=',mr(d.x/Z),',','Dy=',mr(d.y/Z),'');
				var max=d;
				var c2=this.getCoords_(dx+dw,dy);
				var c3=this.getCoords_(dx,dy+dh);
				var c4=this.getCoords_(dx+dw,dy+dh);
				max.x=m.max(max.x,c2.x,c3.x,c4.x);
				max.y=m.max(max.y,c2.y,c3.y,c4.y);
				vmlStr.push('padding:0 ',mr(max.x/ Z), 'px ', mr(max.y /Z),'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',filter.join(''),", sizingmethod='clip');");
			}
			else{
				vmlStr.push('top:',mr(d.y/ Z), 'px;left:', mr(d.x /Z),'px;');
			};
			vmlStr.push(' ">','<g_vml_:image src="',image.src,'"',' style="width:',Z*dw,'px;',' height:',Z*dh,'px"',' cropleft="',sx/w,'"',' croptop="',sy/h,'"',' cropright="',(w-sx-sw)/w,'"',' cropbottom="',(h-sy-sh)/h,'"',' />','</g_vml_:group>');
			this.element_.insertAdjacentHTML('BeforeEnd',vmlStr.join(''));
		};
		contextPrototype.stroke=function(aFill){
			var lineStr=[];
			var lineOpen=false;
			var W=10;
			var H=10;
			lineStr.push('<g_vml_:shape',' filled="',!!aFill,'"',' style="position:absolute;width:',W,'px;height:',H,'px;"',' coordorigin="0,0"',' coordsize="',Z*W,',',Z*H,'"',' stroked="',!aFill,'"',' path="');
			var newSeq=false;
			var min={
				x:null,y:null
			};
			var max={
				x:null,y:null
			};
			for(var i=0;i<this.currentPath_.length;i++){
				var p=this.currentPath_[i];
				var c;
				switch(p.type){
					case'moveTo':c=p;
					lineStr.push(' m ',mr(p.x),',',mr(p.y));
					break;
					case'lineTo':lineStr.push(' l ',mr(p.x),',',mr(p.y));
					break;
					case'close':lineStr.push(' x ');
					p=null;
					break;
					case'bezierCurveTo':lineStr.push(' c ',mr(p.cp1x),',',mr(p.cp1y),',',mr(p.cp2x),',',mr(p.cp2y),',',mr(p.x),',',mr(p.y));
					break;
					case'at':case'wa':lineStr.push(' ',p.type,' ',mr(p.x-this.arcScaleX_*p.radius),',',mr(p.y-this.arcScaleY_*p.radius),' ',mr(p.x+this.arcScaleX_*p.radius),',',mr(p.y+this.arcScaleY_*p.radius),' ',mr(p.xStart),',',mr(p.yStart),' ',mr(p.xEnd),',',mr(p.yEnd));
					break;
				};
				if(p){
					if(min.x==null||p.x<min.x){
						min.x=p.x;
					};
					if(max.x==null||p.x>max.x){
						max.x=p.x;
					};
					if(min.y==null||p.y<min.y){
						min.y=p.y;
					};
					if(max.y==null||p.y>max.y){
						max.y=p.y;
					}
				}
			};
			lineStr.push(' ">');
			if(!aFill){
				p1(this,lineStr);
			}
			else{
				p2(this,lineStr,min,max);
			};
			lineStr.push('</g_vml_:shape>');
			this.element_.insertAdjacentHTML('beforeEnd',lineStr.join(''));
		};
		function p1(ctx,lineStr){
			var a=o4(ctx.strokeStyle);
			var color=a.color;
			var opacity=a.alpha*ctx.globalAlpha;
			var lineWidth=ctx.lineScale_*ctx.lineWidth;
			if(lineWidth<1){
				opacity*=lineWidth;
			};
			lineStr.push('<g_vml_:stroke',' opacity="',opacity,'"',' joinstyle="',ctx.lineJoin,'"',' miterlimit="',ctx.miterLimit,'"',' endcap="',o8(ctx.lineCap),'"',' weight="',lineWidth,'px"',' color="',color,'" />');
		};
		function p2(ctx,lineStr,min,max){
			var fillStyle=ctx.fillStyle;
			var arcScaleX=ctx.arcScaleX_;
			var arcScaleY=ctx.arcScaleY_;
			var width=max.x-min.x;
			var height=max.y-min.y;
			if(fillStyle instanceof p5){
				var angle=0;
				var focus={
					x:0,y:0
				};
				var shift=0;
				var expansion=1;
				if(fillStyle.type_=='gradient'){
					var x0=fillStyle.x0_/arcScaleX;
					var y0=fillStyle.y0_/arcScaleY;
					var x1=fillStyle.x1_/arcScaleX;
					var y1=fillStyle.y1_/arcScaleY;
					var p0=ctx.getCoords_(x0,y0);
					var p1=ctx.getCoords_(x1,y1);
					var dx=p1.x-p0.x;
					var dy=p1.y-p0.y;
					angle=Math.atan2(dx,dy)*180/Math.PI;
					if(angle<0){
						angle+=360;
					};
					if(angle<1e-6){
						angle=0;
					}
				}
				else{
					var p0=ctx.getCoords_(fillStyle.x0_,fillStyle.y0_);
					focus={
						x:(p0.x-min.x)/width,y:(p0.y-min.y)/height
					};
					width/=arcScaleX*Z;
					height/=arcScaleY*Z;
					var dimension=m.max(width,height);
					shift=2*fillStyle.r0_/dimension;
					expansion=2*fillStyle.r1_/dimension-shift;
				};
				var stops=fillStyle.colors_;
				stops.sort(function(cs1,cs2){
					return cs1.offset-cs2.offset;
				});
				var length=stops.length;
				var color1=stops[0].color;
				var color2=stops[length-1].color;
				var opacity1=stops[0].alpha*ctx.globalAlpha;
				var opacity2=stops[length-1].alpha*ctx.globalAlpha;
				var colors=[];
				for(var i=0;i<length;i++){
					var stop=stops[i];
					colors.push(stop.offset*expansion+shift+' '+stop.color);
				};
				lineStr.push('<g_vml_:fill type="',fillStyle.type_,'"',' method="none" focus="100%"',' color="',color1,'"',' color2="',color2,'"',' colors="',colors.join(','),'"',' opacity="',opacity2,'"',' g_o_:opacity2="',opacity1,'"',' angle="',angle,'"',' focusposition="',focus.x,',',focus.y,'" />');
			}
			else if(fillStyle instanceof p6){
				if(width&&height){
					var deltaLeft=-min.x;
					var deltaTop=-min.y;
					lineStr.push('<g_vml_:fill',' position="',deltaLeft/width*arcScaleX*arcScaleX,',',deltaTop/height*arcScaleY*arcScaleY,'"',' type="tile"',' src="',fillStyle.src_,'" />');
				}
			}
			else{
				var a=o4(ctx.fillStyle);
				var color=a.color;
				var opacity=a.alpha*ctx.globalAlpha;
				lineStr.push('<g_vml_:fill color="',color,'" opacity="',opacity,'" />');
			}
		};
		contextPrototype.fill=function(){
			this.stroke(true);
		};
		contextPrototype.closePath=function(){
			this.currentPath_.push({
				type:'close'
			});
		};
		contextPrototype.getCoords_=function(aX,aY){
			var m=this.m_;
			return{
				x:Z*(aX*m[0][0]+aY*m[1][0]+m[2][0])-Z2,y:Z*(aX*m[0][1]+aY*m[1][1]+m[2][1])-Z2
			};
		};
		contextPrototype.save=function(){
			var o={};
			n8(this,o);
			this.aStack_.push(o);
			this.mStack_.push(this.m_);
			this.m_=n7(n6(),this.m_);
		};
		contextPrototype.restore=function(){
			if(this.aStack_.length){
				n8(this.aStack_.pop(),this);
				this.m_=this.mStack_.pop();
			}
		};
		function p3(m){
			return isFinite(m[0][0])&&isFinite(m[0][1])&&isFinite(m[1][0])&&isFinite(m[1][1])&&isFinite(m[2][0])&&isFinite(m[2][1]);
		};
		function p4(ctx,m,updateLineScale){
			if(!p3(m)){
				return;
			};
			ctx.m_=m;
			if(updateLineScale){
				var det=m[0][0]*m[1][1]-m[0][1]*m[1][0];
				ctx.lineScale_=sqrt(abs(det));
			}
		};
		contextPrototype.translate=function(aX,aY){
			var m1=[[1,0,0],[0,1,0],[aX,aY,1]];
			p4(this,n7(m1,this.m_),false);
		};
		contextPrototype.rotate=function(aRot){
			var c=mc(aRot);
			var s=ms(aRot);
			var m1=[[c,s,0],[-s,c,0],[0,0,1]];
			p4(this,n7(m1,this.m_),false);
		};
		contextPrototype.scale=function(aX,aY){
			this.arcScaleX_*=aX;
			this.arcScaleY_*=aY;
			var arrM1=[[aX,0,0],[0,aY,0],[0,0,1]];
			p4(this,n7(arrM1,this.m_),true);
		};
		contextPrototype.transform=function(m11,m12,m21,m22,dx,dy){
			var m1=[[m11,m12,0],[m21,m22,0],[dx,dy,1]];
			p4(this,n7(m1,this.m_),true)
		};
		contextPrototype.setTransform=function(m11,m12,m21,m22,dx,dy){
			var m=[[m11,m12,0],[m21,m22,0],[dx,dy,1]];
			p4(this,m,true);
		};
		contextPrototype.drawText_=function(text,x,y,maxWidth,stroke){
			var m=this.m_,delta=1000,left=0,right=delta,offset={
				x:0,y:0
			}
			,lineStr=[];
			var fontStyle=o6(o5(this.font),this.element_);
			var fontStyleString=o7(fontStyle);
			var elementStyle=this.element_.currentStyle;
			var textAlign=this.textAlign.toLowerCase();
			switch(textAlign){
				case'left':case'center':case'right':break;
				case'end':textAlign=elementStyle.direction=='ltr'?'right':'left';
				break;
				case'start':textAlign=elementStyle.direction=='rtl'?'right':'left';
				break;
				default:textAlign='left';
			};
			switch(this.textBaseline){
				case'hanging':case'top':offset.y=fontStyle.size/1.75;
				break;
				case'middle':break;
				default:case null:case'alphabetic':case'ideographic':case'bottom':offset.y=-fontStyle.size/2.25;
				break;
			};
			switch(textAlign){
				case'right':left=delta;
				right=0.05;
				break;
				case'center':left=right=delta/2;
				break;
			};
			var d=this.getCoords_(x+offset.x,y+offset.y);
			lineStr.push('<g_vml_:line from="',-left,' 0" to="',right,' 0.05" ',' coordsize="100 100" coordorigin="0 0"',' filled="',!stroke,'" stroked="',!!stroke,'" style="position:absolute;width:1px;height:1px;">');
			if(stroke){
				p1(this,lineStr);
			}
			else{
				p2(this,lineStr,{
					x:-left,y:0
				}
				,{
					x:right,y:fontStyle.size
				});
			};
			var skewM=m[0][0].toFixed(3)+','+m[1][0].toFixed(3)+','+m[0][1].toFixed(3)+','+m[1][1].toFixed(3)+',0,0';
			var skewOffset=mr(d.x/ Z) + ',' + mr(d.y /Z);
			lineStr.push('<g_vml_:skew on="t" matrix="',skewM,'" ',' offset="',skewOffset,'" origin="',left,' 0" />','<g_vml_:path textpathok="true" />','<g_vml_:textpath on="true" string="',n1(text),'" style="v-text-align:',textAlign,';font:',n1(fontStyleString),'" /></g_vml_:line>');
			this.element_.insertAdjacentHTML('beforeEnd',lineStr.join(''));
		};
		contextPrototype.fillText=function(text,x,y,maxWidth){
			this.drawText_(text,x,y,maxWidth,false);
		};
		contextPrototype.strokeText=function(text,x,y){
			this.drawText_(text,x,y,100,true);
		};
		contextPrototype.measureText=function(text){
			if(!this.textMeasureEl_){
				var s='<span style="position:absolute;'+'top:-20000px;left:0;padding:0;margin:0;border:none;'+'white-space:pre;"></span>';
				this.element_.insertAdjacentHTML('beforeEnd',s);
				this.textMeasureEl_=this.element_.lastChild;
			};
			var doc=this.element_.ownerDocument;
			this.textMeasureEl_.innerHTML='';
			this.textMeasureEl_.style.font=this.font;
			this.textMeasureEl_.appendChild(doc.createTextNode(text));
			return{
				width:this.textMeasureEl_.offsetWidth
			};
		};
		contextPrototype.measureText1=function(textToDraw){
			var hiddenSpan=document.createElement('span');
			hiddenSpan.innerHTML=textToDraw;
			var bodyNode=document.getElementsByTagName("body")[0];
			bodyNode.appendChild(hiddenSpan);
			var width=hiddenSpan.offsetWidth;
			bodyNode.removeChild(hiddenSpan);
			return{
				"width":width+1
			};
		};
		contextPrototype.fillText1=function(textToDraw,x,y){
			var vmlStr=[];
			var textHeightStr=this.font.split("px")[0].replace(/(^\s+)|(\s+$)/g,"");
			var textHeight=/^\d+$/.test(textHeightStr)?parseInt(textHeightStr):0;
			vmlStr.push('<g_vml_:shape style="font:'+this.font+';',' color:'+this.fillStyle+';',' position:absolute;',' left:'+x+'px;',' top:'+(y-textHeight)+'px;',' width:'+this.measureText(textToDraw).width+'px;',' height:'+textHeight+'px;"',' ><g_vml_:textbox inset="0,0,0,0">'+textToDraw,' </g_vml_:textbox>','</g_vml_:shape>');
			this.element_.insertAdjacentHTML('BeforeEnd',vmlStr.join(''));
		};
		contextPrototype.clip=function(){};
		contextPrototype.arcTo=function(){};
		contextPrototype.createPattern=function(image,repetition){
			return new p6(image,repetition);
		};
		function p5(aType){
			this.type_=aType;
			this.x0_=0;
			this.y0_=0;
			this.r0_=0;
			this.x1_=0;
			this.y1_=0;
			this.r1_=0;
			this.colors_=[];
		};
		p5.prototype.addColorStop=function(aOffset,aColor){
			aColor=o4(aColor);
			this.colors_.push({
				offset:aOffset,color:aColor.color,alpha:aColor.alpha
			});
		};
		function p6(image,repetition){
			p8(image);
			switch(repetition){
				case'repeat':case null:case'':this.repetition_='repeat';
				break;
				case'repeat-x':case'repeat-y':case'no-repeat':this.repetition_=repetition;
				break;
				default:p7('SYNTAX_ERR');
			};
			this.src_=image.src;
			this.width_=image.width;
			this.height_=image.height;
		};
		function p7(s){
			throw new p9(s);
		};
		function p8(img){
			if(!img||img.nodeType!=1||img.tagName!='IMG'){
				p7('TYPE_MISMATCH_ERR');
			};
			if(img.readyState!='complete'){
				p7('INVALID_STATE_ERR');
			}
		};
		function p9(s){
			this.code=this[s];
			this.message=s+': DOM Exception '+this.code;
		};
		var p=p9.prototype=new Error;
		p.INDEX_SIZE_ERR=1;
		p.DOMSTRING_SIZE_ERR=2;
		p.HIERARCHY_REQUEST_ERR=3;
		p.WRONG_DOCUMENT_ERR=4;
		p.INVALID_CHARACTER_ERR=5;
		p.NO_DATA_ALLOWED_ERR=6;
		p.NO_MODIFICATION_ALLOWED_ERR=7;
		p.NOT_FOUND_ERR=8;
		p.NOT_SUPPORTED_ERR=9;
		p.INUSE_ATTRIBUTE_ERR=10;
		p.INVALID_STATE_ERR=11;
		p.SYNTAX_ERR=12;
		p.INVALID_MODIFICATION_ERR=13;
		p.NAMESPACE_ERR=14;
		p.INVALID_ACCESS_ERR=15;
		p.VALIDATION_ERR=16;
		p.TYPE_MISMATCH_ERR=17;
		G_vmlCanvasManager=G_vmlCanvasManager_;
		CanvasRenderingContext2D=o9;
		CanvasGradient=p5;
		CanvasPattern=p6;
		DOMException=p9;
	})()
};
function b5(){
	this.bCanvasInitOk=false;
	this.strImgServerInfo="";
	this.iMapViewWidth=1300;
	this.iMapViewHeight=700;
	this.iImgWidth=200;
	this.iImgHeight=200;
	this.iBigCellImageWidthZoomCount=5;
	this.iBigCellImageHeightZoomCount=5;
	this.iImgBufferCount=1;
	this.OffsetPo={
		x:0,y:0
	};
	this.OldOffsetPo={
		x:0,y:0
	};
	this.UNI_GEO_COOR_MULTI_FACTOR=10000000;
	this.fHimeterToPixelFactor=0.030769230769231;
	this.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER=10;
	this.fEsize=0.081813369;
	this.fEarthRadiusX=6378137;
	this.fEarthRadiusY=6378137;
	this.generateOrgLonLatPo={
		x:121.501,y:31.3749
	};
	this.arrMemPlaneYs=new Array(8000);
	this.strMapBackGroundColor="#abe6f3";
	this.strMapBackGroundImgPath="";
	this.iCurSdkModelType=1;
	this.iCurLevel=3;
	this.iCurScale=30104429;
	this.centerLonLatPo={
		x:122.5,y:32
	};
	this.strImgUrl="http://www.yimasoftdemo.cc:800/YimaChartImages/";
	this.centerToMapOriginsScrnPo=null;
	this.dragMapLayerOriginPo={
		x:0,y:0
	};
	this.dragMoveOffsetAfterUpdateGridPo={
		x:0,y:0
	};
	this.firstImgTitleNums={
		row:0,col:0
	};
	this.iTouchModel=0;
	this.zoomTouchLastPo1={
		x:0,y:0
	};
	this.zoomTouchLastPo2={
		x:0,y:0
	};
	this.zoomTouchEndPo1={
		x:0,y:0
	};
	this.zoomTouchEndPo2={
		x:0,y:0
	};
	this.zoomTouchLastDis=0;
	this.zoomTimerId=null;
	this.iMinZoomScale=5000;
	this.iMaxZoomScale=20480000;
	this.arrScaleInfo=new Array();
	this.arrHaiLi2PxPerScale=new Array();
	this.bCurDragMap=false;
	this.mouseDownScrnPo={
		x:0,y:0
	};
	this.iCurDrawTyphoonAnimationR=3;
	this.bShowTyphoonOrNot=true;
	this.bShowObjectOrNot=true;
	this.arrShipStateInfo=[];
	this.iDrawCircleShipMaxScale=2560000;
	this.iSelectShipByScrnPoMaxScale=0;
	this.strCircleShipColor="#0abe28";
	this.iDrawCircleShipR=4;
	this.iDrawDefaultHeadLineScale=640000;
	this.iDrawDefaultHeadLineLen=20;
	this.iStartShowShipInfo=1280000;
	this.strShipInfoFont="12px 黑体";
	this.strShipInfoColor="#FF00FF";
	this.iShipInfoOpacity=80;
	this.bShowShipNameOrMMsi=true;
	this.bShowShipInfo=true;
	this.bNameToNullMmsi=true;
	this.timerOutHiddenScaleLevelDiv=null;
	this.objShowScaleDiv=null;
	this.showScaleDivOffsetPo={
		x:50,y:80,bShow:false,bAddToDiv:false
	};
	this.objShowLonLatDiv=null;
	this.showLonLatDivOffsetPo={
		x:50,y:80,bShow:false,bAddToDiv:false
	};
	this.objCompanyNameDiv=null;
	this.showDisLenSizeOffsetPo={
		x:50,y:180,bShow:false,bAddToDiv:false
	};
	this.drawDisLenCanvas=null;
	this.drawDisLenCanvas2D=null;
	this.showZoonBtnOffsetPo={
		x:150,y:300,bShow:false,bAddToDiv:false
	};
	this.zoomInImg=null;
	this.zoomOutImg=null;
	this.showToolBarOffsetPo={
		x:150,y:300,bShow:false,bAddToDiv:false
	};
	this.moveToolObj=null;
	this.zoomInImgDivObj=null;
	this.zoomOutImgDivObj=null;
	this.zoomSliderObj=null;
	this.moveZoomSliderDivObj=null;
	this.moveZoomSliderMinMaxScrnY=null;
	this.moveZoomSliderDivObj=null;
	this.showScaleLevelDivObj=null;
	this.bStartDragZoomSlider=false;
	this.objMouseMoveSelectInfo=null;
	this.drawObjCanvasPo={
		x:0,y:0
	};
	this.iCurDynamicType=0;
	this.iCurMapMouseState=0;
	this.drawDynamicObjStyle=null;
	this.arrDrawDynamicObjGeoPo=[];
	this.pxLenOfOneKmPo=[];
	this.bIsPlayShipHistoryTrack=false;
	this.bDrawCurShipAndPlayHistoryTrackShip=true;
	this.bCurIsShowShipOrNot=true;
	this.iStartShowShipScale=90000000;
	this.bShowOfflineShipOrNot=true;
	this.OfflineShipStyle={
		bGetStyle:false,strFillColor:"#9d9797",strBorderColor:"#000000",iBorderSize:1,iOpacity:80
	};
	this.objShowNameFrameStyle={
		scale:10000,width:100,height:25,border:1,color:"#000000",opacity:60
	};
	this.strFlexMyLicenceKey="yimasoft2015";
	this.bIsLicenceKeyOK=false;
	this.iValidityTime=100000000;
	this.iShowFocusShipStyleMinScale=640000;
	this.iMapMinScale=5000;
	this.iMapMaxScale=20480000;
	this.objMapLevelValue={
		min:1,max:20
	};
	this.strSdkFilePath="";
	this.strExplorerName="IE9.0";
	this.iCurMapImgInfoModeType=1;
	this.bUseArcgisRule=false;
	this.iShowShipHistroyTrackScale=2000000;
	this.iSelectAllObjByMouseMoveScale=1;
	this.bSelectAllObjByMouseMove=false;
	this.iAndroidCheckDisScrnLen=20;
	this.objLineAreaStyle={
		color:"#F6A635",opacity:60
	};
	this.bShowShipHistroyTrackInfoBox=false;
	this.arrDrawLoadImgInfo=[];
	this.bShowHistoryTrackDirectionSign=false;
	this.bUseSvgDrawerOrNot=false;
	this.bShowLonLatLine=false;
	this.strMapBackGroundImgSrc=null;
	this.bMouseDownOrNot=false;
	this.iMapViewMinGeoX=0;
	this.iMapViewMaxGeoX=0;
	this.iMapViewMinGeoY=0;
	this.iMapViewMaxGeoY=0;
	this.bShowPowerString=true;
	this.objDynamicObjTextBoxStyle={
		rectLineColor:"#000000",rectFillColor:"#FF0000",iRectOpacity:50,bFill:true
	};
	this.mCurMouseScrnPo={
		x:0,y:0
	};
	this.bShowMeasureKmText=true;
	this.bShowTrackPoSpeedCourse=true;
	this.objMapViewMaxMinGeoInfo={
		bCheck:false,minLon:118,maxLon:123,minLat:29,maxLat:32
	};
	this.bShowZoomArrowSign=true;
	this.bShowHeatmap=true;
	this.m_arrObjForShowShip=[];
	this.m_bCheckShipShowByObect=true;
	this.m_iStartShowShipSizeByRealSizeLevel=13;
	this.init=function(){
		var strYear=parseInt(12029)-10010;
		var str=strYear+"/8/8 10:10:10";
		var date=new Date(str);
		this.iValidityTime=date.getTime();
		var strTitle="Yimasoft";
		strTitle=strTitle.big().bold();
		var strValidityInfo="您试用的YimaEnc SDK已到期，<br>如继续申请试用请联系<a href = 'http://www.yimasoft.net' style='text-decoration:none' target='_blank'>"+strTitle+"</a>。";
		strValidityInfo=strValidityInfo.fontcolor("#FF0000");
		if(strValidityInfo.indexOf("YimaEnc")<0){
			return
		};
		if(this.iCurMapImgInfoModeType==MAP_IMG_MODE_TYPE.GoogleType||this.iCurMapImgInfoModeType==MAP_IMG_MODE_TYPE.BaiduType){
			this.iImgWidth=256;
			this.iImgHeight=256;
			this.iBigCellImageWidthZoomCount=4;
			this.iBigCellImageHeightZoomCount=4;
			this.generateOrgLonLatPo={
				x:0,y:0
			}
		};
		i7();
		this.InitToolBar();
		this.iCurMapMouseState=0;
		this.iCurDynamicType=0;
		this.drawDynamicObjStyle=new c4();
		this.drawDynamicObjStyle.borderWith=2;
		this.drawDynamicObjStyle.borderColor="#FF0000";
		this.drawDynamicObjStyle.fillColor="#698af0";
		this.drawDynamicObjStyle.textColor="#49495d";
		this.drawDynamicObjStyle.fontSize="12px 宋体";
		this.drawDynamicObjStyle.iOpacity=80;
		this.drawDynamicObjStyle.img=new Image();
		this.drawDynamicObjStyle.img.src=this.drawDynamicObjStyle.strImgSrc;
		this.objShowNameFrameStyle=[];
		this.objShowNameFrameStyle.scale=10000;
		this.objShowNameFrameStyle.width=100;
		this.objShowNameFrameStyle.height=20;
		this.objShowNameFrameStyle.border="1px";
		this.objShowNameFrameStyle.color="#4d4cee";
		this.objShowNameFrameStyle.opacity=80;
		if(this.iCurMapImgInfoModeType==MAP_IMG_MODE_TYPE.YimaType){
			this.SetMinMaxScale(this.iMapMinScale,this.iMapMaxScale);
		}
		else{
			this.SetMinMaxLevel(this.objMapLevelValue.min,this.objMapLevelValue.max);
		};
		this.objShowScaleDiv=h8("Map_ShowScaleDiv",null,null,null,"absolute",999,null,"visible",1);
		this.objShowScaleDiv.className="ShowMouseInfoDiv";
		this.objShowLonLatDiv=h8("Map_ShowLonLatDiv",null,null,null,"absolute",999,null,"visible",1);
		this.objShowLonLatDiv.className="ShowMouseInfoDiv";
		this.objCompanyNameDiv=h8("Map_ShowCompanyDiv",null,null,null,"absolute",1999,null,"visible",1);
		this.objCompanyNameDiv.className="ShowSpanTextDiv";
		var strCompany="<a href = 'http://www.yimasoft.net' style='text-decoration:none' target='_blank'>Powered By YimaEnc</a>";
		this.objCompanyNameDiv.innerHTML=strCompany;
		this.objValidityInfoDiv=h8("Map_ShowCompanyDiv",null,null,null,"absolute",1999,null,"visible",1);
		this.objValidityInfoDiv.innerHTML=strValidityInfo;
		try{
			this.drawDisLenCanvas=i0("Map_ShowDisLenCanvas",null,{
				w:250,h:50
			}
			,null,"absolute",999,null,"visible",1);
			this.drawDisLenCanvas2D=i5(this.drawDisLenCanvas);
			if(this.drawDisLenCanvas2D){
				this.bCanvasInitOk=true;
			}
		}
		catch(e){
			this.drawDisLenCanvas=null;
			this.drawDisLenCanvas2D=null;
			this.bCanvasInitOk=false
		};
		this.zoomInImg=new Image();
		this.zoomInImg.src=G_V.strSdkFilePath+"img/zoomIn.png";
		this.zoomInImg.className="zoomImgStyle";
		var styleIn=this.zoomInImg.style;
		styleIn.zIndex=1999;
		styleIn.left=this.showZoonBtnOffsetPo.x+"px";
		styleIn.top=(this.showZoonBtnOffsetPo.y)+"px";
		styleIn.position="absolute";
		styleIn.display="none";
		this.zoomInImg.title="放大一级";
		this.zoomInImg.onclick=function(){
			e6(1);
		};
		this.zoomOutImg=new Image();
		this.zoomOutImg.src=G_V.strSdkFilePath+"img/zoomOut.png";
		this.zoomOutImg.className="zoomImgStyle";
		var styleOut=this.zoomOutImg.style;
		styleOut.zIndex=1999;
		styleOut.left=this.showZoonBtnOffsetPo.x+"px";
		styleOut.top=(this.showZoonBtnOffsetPo.y+25)+"px";
		styleOut.position="absolute";
		styleOut.display="none";
		this.zoomOutImg.title="缩小一级";
		this.zoomOutImg.onclick=function(){
			e6(-1);
		};
	};
	this.InitToolBar=function(){
		this.strExplorerName=i6();
		var toolPositionScrnPo={
			x:this.showToolBarOffsetPo.x,y:this.showToolBarOffsetPo.y
		};
		var oPo={
			x:toolPositionScrnPo.x,y:toolPositionScrnPo.y
		};
		var moveToolSize={
			w:56,h:58
		};
		this.moveToolObj=h8("MoveToolBarDiv",oPo,moveToolSize,null,"absolute",1500,null,"visible",1);
		this.moveToolObj.style.backgroundImage="url('"+G_V.strSdkFilePath+"img/moveBarPan.png')";
		oPo={
			x:8,y:20
		};
		var moveImgSize={
			w:8,h:12
		};
		var leftImgObj=h8("leftImgDiv",oPo,moveImgSize,null,"absolute",1,null,"visible",1);
		leftImgObj.style.backgroundImage="url('"+G_V.strSdkFilePath+"img/PositionControl_left.gif')";
		leftImgObj.className="zoomImgStyle";
		leftImgObj.title="向左移动";
		g_objEventClass.AddMouseEvent(leftImgObj,"mousedown",function(){
			API_MoveMapViewByMoveSize(-300,0,true);
		});
		oPo={
			x:40,y:20
		};
		var rightImgObj=h8("rightImgDiv",oPo,moveImgSize,null,"absolute",1,null,"visible",1);
		rightImgObj.style.backgroundImage="url('"+G_V.strSdkFilePath+"img/PositionControl_right.png')";
		rightImgObj.className="zoomImgStyle";
		rightImgObj.title="向右移动";
		g_objEventClass.AddMouseEvent(rightImgObj,"mousedown",function(){
			API_MoveMapViewByMoveSize(300,0,true);
		});
		moveImgSize={
			w:12,h:8
		};
		oPo={
			x:22,y:4
		};
		var upImgObj=h8("rightImgDiv",oPo,moveImgSize,null,"absolute",1,null,"visible",1);
		upImgObj.style.backgroundImage="url('"+G_V.strSdkFilePath+"img/PositionControl_up.gif')";
		upImgObj.className="zoomImgStyle";
		upImgObj.title="向上移动";
		g_objEventClass.AddMouseEvent(upImgObj,"mousedown",function(){
			API_MoveMapViewByMoveSize(0,-250,true);
		});
		oPo={
			x:22,y:40
		};
		var downImgObj=h8("downImgDiv",oPo,moveImgSize,null,"absolute",1,null,"visible",1);
		downImgObj.style.backgroundImage="url('"+G_V.strSdkFilePath+"img/PositionControl_down.gif')";
		downImgObj.className="zoomImgStyle";
		downImgObj.title="向下移动";
		g_objEventClass.AddMouseEvent(downImgObj,"mousedown",function(){
			API_MoveMapViewByMoveSize(0,250,true);
		});
		var zoomImgSize={
			w:20,h:22
		};
		var iMarginHeight=5;
		var zoomToolDivSize={
			w:1,h:100
		};
		oPo={
			x:parseInt(toolPositionScrnPo.x)+parseInt(moveToolSize.w/ 2) - parseInt(zoomImgSize.w /2),y:parseInt(toolPositionScrnPo.y)+parseInt(moveToolSize.h)+parseInt(iMarginHeight)
		};
		this.zoomInImgDivObj=h8("zoomInImgDiv",oPo,zoomImgSize,null,"absolute",1500,null,"visible",1);
		this.zoomInImgDivObj.style.backgroundImage="url('"+G_V.strSdkFilePath+"img/zoomIn.png')";
		this.zoomInImgDivObj.className="zoomImgStyle";
		this.zoomInImgDivObj.title="放大一级";
		g_objEventClass.AddMouseEvent(this.zoomInImgDivObj,"mousedown",function(){
			e6(1,null);
		});
		oPo={
			x:oPo.x,y:parseInt(oPo.y)+parseInt(zoomToolDivSize.h)+parseInt(zoomImgSize.h)+parseInt(iMarginHeight)
		};
		this.zoomOutImgDivObj=h8("zoomOutImgDiv",oPo,zoomImgSize,null,"absolute",1500,null,"visible",1);
		this.zoomOutImgDivObj.style.backgroundImage="url('"+G_V.strSdkFilePath+"img/zoomOut.png')";
		this.zoomOutImgDivObj.className="zoomImgStyle";
		this.zoomOutImgDivObj.title="缩小一级";
		g_objEventClass.AddMouseEvent(this.zoomOutImgDivObj,"mousedown",function(){
			e6(-1,null);
		});
		oPo={
			x:parseInt(toolPositionScrnPo.x)+parseInt(moveToolSize.w/2)-1,y:parseInt(toolPositionScrnPo.y)+parseInt(moveToolSize.h)+parseInt(zoomImgSize.h)+parseInt(iMarginHeight)
		};
		this.zoomSliderObj=h8("zoomSliderDiv",oPo,zoomToolDivSize,null,"absolute",100,null,"visible",1);
		this.zoomSliderObj.className="zoomSlider";
		var moveZoomDivSize={
			w:16,h:8
		};
		this.moveZoomSliderImgMinMaxScrnY={
			minY:oPo.y+parseInt(2),maxY:oPo.y+zoomToolDivSize.h-moveZoomDivSize.h-2
		};
		oPo={
			x:oPo.x-parseInt(moveZoomDivSize.w/2),y:this.moveZoomSliderImgMinMaxScrnY.minY
		};
		this.moveZoomSliderDivObj=h8("moveZoomSliderDiv",oPo,moveZoomDivSize,null,"absolute",1500,null,"visible",1);
		this.moveZoomSliderDivObj.className="moveZoomSlider";
		this.moveZoomSliderDivObj.title="级数";
		var showScaleLevelSize={
			w:20,h:18
		};
		oPo={
			x:parseInt(oPo.x)+parseInt(10),y:oPo.y
		};
		this.showScaleLevelDivObj=h8("showScaleLevelDiv",oPo,showScaleLevelSize,null,"absolute",1500,null,"visible",1);
		g_objEventClass.AddMouseEvent(this.moveZoomSliderDivObj,"mousedown",f9);
		g_objEventClass.AddMouseEvent(this.moveZoomSliderDivObj,"mousemove",g0);
		g_objEventClass.AddMouseEvent(this.moveZoomSliderDivObj,"mouseup",g2);
		this.moveToolObj.appendChild(leftImgObj);
		this.moveToolObj.appendChild(rightImgObj);
		this.moveToolObj.appendChild(upImgObj);
		this.moveToolObj.appendChild(downImgObj);
		this.SetShowToolBarInfo(this.showToolBarOffsetPo,true);
	};
	this.setShowZoomBtnDivInfo=function(scrnOffsetPo,bShowOrNot){
		var inStyle=this.zoomInImg.style;
		var outStyle=this.zoomOutImg.style;
		if(scrnOffsetPo){
			var left=scrnOffsetPo.x;
			var top=scrnOffsetPo.y;
			inStyle.left=left+"px";
			inStyle.top=top+"px";
			var offsetTop=parseInt(this.zoomInImg.clientHeight)+5;
			if(offsetTop<20){
				offsetTop=25;
			};
			outStyle.left=left+"px";
			outStyle.top=(top+offsetTop)+"px";
		};
		inStyle.display=bShowOrNot==true?"block":"none";
		outStyle.display=bShowOrNot==true?"block":"none";
	};
	this.SetShowToolBarInfo=function(scrnOffsetPo,bShowOrNot){
		if(scrnOffsetPo){
			this.showToolBarOffsetPo.x=scrnOffsetPo.x;
			this.showToolBarOffsetPo.y=scrnOffsetPo.y;
		};
		var toolPositionScrnPo={
			x:this.showToolBarOffsetPo.x,y:this.showToolBarOffsetPo.y
		};
		var oPo=toolPositionScrnPo;
		if(bShowOrNot==true){
			var moveToolSize={
				w:parseInt(this.moveToolObj.style.width),h:parseInt(this.moveToolObj.style.height)
			};
			this.moveToolObj.style.left=oPo.x+"px";
			this.moveToolObj.style.top=oPo.y+"px";
			var zoomImgSize={
				w:parseInt(this.zoomOutImgDivObj.style.width),h:parseInt(this.zoomOutImgDivObj.style.height)
			};
			var iMarginHeight=5;
			var zoomToolDivSize={
				w:parseInt(this.zoomSliderObj.style.width),h:parseInt(this.zoomSliderObj.style.height)
			};
			oPo={
				x:parseInt(toolPositionScrnPo.x)+parseInt(moveToolSize.w/ 2) - parseInt(zoomImgSize.w /2),y:parseInt(toolPositionScrnPo.y)+parseInt(moveToolSize.h)+parseInt(iMarginHeight)
			};
			this.zoomInImgDivObj.style.left=oPo.x+"px";
			this.zoomInImgDivObj.style.top=oPo.y+"px";
			oPo={
				x:oPo.x,y:parseInt(oPo.y)+parseInt(zoomToolDivSize.h)+parseInt(zoomImgSize.h)+parseInt(iMarginHeight)
			};
			this.zoomOutImgDivObj.style.left=oPo.x+"px";
			this.zoomOutImgDivObj.style.top=oPo.y+"px";
			oPo={
				x:parseInt(toolPositionScrnPo.x)+parseInt(moveToolSize.w/2)-1,y:parseInt(toolPositionScrnPo.y)+parseInt(moveToolSize.h)+parseInt(zoomImgSize.h)+parseInt(iMarginHeight)
			};
			this.zoomSliderObj.style.left=oPo.x+"px";
			this.zoomSliderObj.style.top=oPo.y+"px";
			var moveZoomDivSize={
				w:parseInt(this.moveZoomSliderDivObj.style.width),h:parseInt(this.moveZoomSliderDivObj.style.height)
			};
			this.moveZoomSliderImgMinMaxScrnY={
				minY:oPo.y+parseInt(2),maxY:oPo.y+zoomToolDivSize.h-moveZoomDivSize.h-2
			};
			var moveZoomDivSize={
				w:parseInt(this.moveZoomSliderDivObj.style.width),h:parseInt(this.moveZoomSliderDivObj.style.height)
			};
			oPo={
				x:oPo.x-parseInt(moveZoomDivSize.w/2),y:this.moveZoomSliderImgMinMaxScrnY.minY
			};
			this.moveZoomSliderDivObj.style.left=oPo.x+"px";
			this.moveZoomSliderDivObj.style.top=oPo.y+"px";
			oPo={
				x:oPo.x+parseInt(30),y:oPo.y
			};
			this.showScaleLevelDivObj.style.left=oPo.x+"px";
			this.showScaleLevelDivObj.style.top=oPo.y+"px";
		};
		this.moveToolObj.style.display=bShowOrNot==true?"block":"none";
		this.zoomInImgDivObj.style.display=bShowOrNot==true?"block":"none";
		this.zoomOutImgDivObj.style.display=bShowOrNot==true?"block":"none";
		this.zoomSliderObj.style.display=bShowOrNot==true?"block":"none";
		this.moveZoomSliderDivObj.style.display=bShowOrNot==true?"block":"none";
	};
	this.setShowScaleDivInfo=function(scrnOffsetPo,bShowOrNot){
		var divStyle=this.objShowScaleDiv.style;
		if(scrnOffsetPo){
			var left=scrnOffsetPo.x;
			var top=this.iMapViewHeight-scrnOffsetPo.y-parseInt(this.objShowLonLatDiv.clientHeight);
			divStyle.left=left+"px";
			divStyle.top=top+"px";
		};
		divStyle.display=bShowOrNot==true?"block":"none";
	};
	this.setShowLonLatDivInfo=function(scrnOffsetPo,bShowOrNot){
		var divStyle=this.objShowLonLatDiv.style;
		if(scrnOffsetPo){
			var left=this.iMapViewWidth-scrnOffsetPo.x-parseInt(this.objShowLonLatDiv.clientWidth);
			var top=this.iMapViewHeight-scrnOffsetPo.y-parseInt(this.objShowLonLatDiv.clientHeight);
			divStyle.left=left+"px";
			divStyle.top=top+"px";
		};
		divStyle.display=bShowOrNot==true?"block":"none";
	};
	this.setShowCompanyDivInfo=function(bShowOrNot){
		var divStyle=this.objCompanyNameDiv.style;
		var left=parseInt((this.iMapViewWidth-parseInt(this.objShowLonLatDiv.clientWidth))/2);
		var top=this.iMapViewHeight-20;
		divStyle.left=left+"px";
		divStyle.top=top+"px";
		divStyle.display=bShowOrNot==true?"block":"none";
	};
	this.setShowDisLenCanvasInfo=function(scrnOffsetPo,bShowOrNot){
		if(this.drawDisLenCanvas){
			var divStyle=this.drawDisLenCanvas.style;
			if(scrnOffsetPo){
				var left=scrnOffsetPo.x;
				var top=this.iMapViewHeight-scrnOffsetPo.y-parseInt(this.drawDisLenCanvas.clientHeight);
				divStyle.left=left+"px";
				divStyle.top=top+"px";
			};
			divStyle.display=bShowOrNot==true?"block":"none";
		}
	};
	this.setShowValidityInfoInfo=function(bShowOrNot){
		var divStyle=this.objValidityInfoDiv.style;
		var left=parseInt((this.iMapViewWidth-this.objValidityInfoDiv.clientWidth)/2);
		var top=parseInt((this.iMapViewHeight-this.objValidityInfoDiv.clientHeight)/2);
		divStyle.left=left+"px";
		divStyle.top=top+"px";
		divStyle.display=bShowOrNot==true?"block":"none";
	};
	this.getMapViewSize=function(){
		return{
			x:this.iMapViewWidth,y:this.iMapViewHeight
		};
	};
	this.getImgSize=function(){
		return{
			x:this.iImgWidth,y:this.iImgHeight
		};
	};
	this.SetMinMaxScale=function(iMinScale,iMaxScale){
		if(iMinScale&&!isNaN(iMinScale)){
			this.iMinZoomScale=iMinScale;
		};
		if(iMaxScale&&!isNaN(iMaxScale)){
			this.iMaxZoomScale=iMaxScale;
		};
		this.arrScaleInfo=new Array();
		if(this.iMinZoomScale==undefined||isNaN(this.iMinZoomScale)){
			this.iMinZoomScale=5000;
		};
		if(parseInt(this.iMinZoomScale)<500){
			this.iMinZoomScale=500;
		};
		if(this.iMaxZoomScale==undefined||isNaN(this.iMaxZoomScale)){
			this.iMaxZoomScale=40960000;
		};
		if(parseInt(this.iMaxZoomScale)<20000){
			this.iMaxZoomScale=20000;
		}
		else if(parseInt(this.iMaxZoomScale)>40960000){
			this.iMaxZoomScale=40960000;
		};
		var iCurScale=this.iMinZoomScale;
		this.arrPx2KmPerScale=[];
		var geoPo=l9({
			x:1210000000,y:310000000
		}
		,100,0);
		var lonLatPo={
			x:geoPo.x/ this.UNI_GEO_COOR_MULTI_FACTOR, y: geoPo.y /this.UNI_GEO_COOR_MULTI_FACTOR
		};
		while(parseInt(iCurScale)<parseInt(this.iMaxZoomScale)||parseInt(iCurScale)==parseInt(this.iMaxZoomScale)){
			this.arrScaleInfo.push(iCurScale);
			var scrnPo1=k0(121,31,iCurScale);
			var scrnPo2=k0(lonLatPo.x,lonLatPo.y,iCurScale);
			var scrnDis=l4(scrnPo1,scrnPo2);
			var oneHaiLi2Px=scrnDis/100;
			var iDisLen=0;
			var iDisPxLen=0;
			if(iCurScale>20480000-1){
				iDisLen=500*parseInt(iCurScale/20480000);
				iDisPxLen=iDisLen*oneHaiLi2Px;
			};
			if(iCurScale>2560000-1){
				iDisLen=25*parseInt(iCurScale/2560000);
				iDisPxLen=iDisLen*oneHaiLi2Px;
			}
			else if(iCurScale>160000-1){
				iDisLen=parseInt(iCurScale/ 80000) /2;
				iDisPxLen=iDisLen*oneHaiLi2Px;
			}
			else{
				iDisLen=1;
				iDisPxLen=oneHaiLi2Px;
				if(iDisPxLen>100){
					do{
						iDisLen=iDisLen/2;
						iDisPxLen=iDisPxLen/2;
					}
					while(iDisPxLen>100)
				}
			};
			var curHaiLi2PxInfo={
				px:iDisPxLen,dis:iDisLen,scale:iCurScale
			};
			this.arrHaiLi2PxPerScale.push(curHaiLi2PxInfo);
			iCurScale=iCurScale*2;
		}
	};
	this.SetMinMaxLevel=function(iMinLevel,iMaxLevel){
		if(iMinLevel!=null&&!isNaN(iMinLevel)){
			this.objMapLevelValue.min=iMinLevel;
		};
		if(iMaxLevel!=null&&!isNaN(iMaxLevel)){
			this.objMapLevelValue.max=iMaxLevel;
		};
		this.arrScaleInfo=[];
		this.iMaxZoomScale=m5(this.objMapLevelValue.min,this.iCurMapImgInfoModeType);
		this.iMinZoomScale=m5(this.objMapLevelValue.max,this.iCurMapImgInfoModeType);
		var iCurScale=this.iMinZoomScale;
		this.arrPx2KmPerScale=[];
		var geoPo=l9({
			x:1210000000,y:310000000
		}
		,100,0);
		var lonLatPo={
			x:geoPo.x/ this.UNI_GEO_COOR_MULTI_FACTOR, y: geoPo.y /this.UNI_GEO_COOR_MULTI_FACTOR
		};
		var iCurLevel=this.objMapLevelValue.max;
		while(parseInt(iCurScale)<parseInt(this.iMaxZoomScale)||parseInt(iCurScale)==parseInt(this.iMaxZoomScale)){
			this.arrScaleInfo.push(iCurScale);
			var scrnPo1=k0(121,31,iCurScale);
			var scrnPo2=k0(lonLatPo.x,lonLatPo.y,iCurScale);
			var scrnDis=l4(scrnPo1,scrnPo2);
			var oneHaiLi2Px=scrnDis/100;
			var iDisLen=0;
			var iDisPxLen=0;
			if(iCurScale>20480000-1){
				iDisLen=500*parseInt(iCurScale/20480000);
				iDisPxLen=iDisLen*oneHaiLi2Px;
			};
			if(iCurScale>2560000-1){
				iDisLen=25*parseInt(iCurScale/2560000);
				iDisPxLen=iDisLen*oneHaiLi2Px;
			}
			else if(iCurScale>160000-1){
				iDisLen=parseInt(iCurScale/ 80000) /2;
				iDisPxLen=iDisLen*oneHaiLi2Px;
			}
			else{
				iDisLen=1;
				iDisPxLen=oneHaiLi2Px;
				if(iDisPxLen>100){
					do{
						iDisLen=iDisLen/2;
						iDisPxLen=iDisPxLen/2;
					}
					while(iDisPxLen>100)
				}
			};
			var curHaiLi2PxInfo={
				px:iDisPxLen,dis:iDisLen,scale:iCurScale
			};
			this.arrHaiLi2PxPerScale.push(curHaiLi2PxInfo);
			iCurLevel--;
			iCurScale=m5(iCurLevel,this.iCurMapImgInfoModeType);
		}
	}
};
var G_V=new b5();
var js=document.scripts;
var jsCount=parseInt(js.length);
G_V.strSdkFilePath="";
for(var i=0;i<parseInt(jsCount);
i++){
	var strJsFileName=js[i].src.substring(parseInt(js[i].src.lastIndexOf("/"))+parseInt(1),js[i].src.length);
	if(strJsFileName=="YimaEncSDK.js"||strJsFileName=="GlobalVariableClass.js"){
		G_V.strSdkFilePath=js[i].src.substring(0,parseInt(js[i].src.lastIndexOf("/"))+parseInt(1));
		break;
	}
};
var TouchPos={
	none:0,startDrag:1,doDrag:2,endDrag:3,startZoom:4,doZoom:5,endZoom:6
};
var LAYER_TYPE={
	point:1,line:2,face:3,rect:4,circle:5
};
var MAP_MOUSE_STATE={
	none:0,drawPoint:1,drawLine:2,drawFace:3,drawRect:4,drawCircle:5,measureDist:6,measureArea:7,directionLine:8,drawLineArea:9,drawSector:10
};
var SDK_MODEL_TYPE={
	pc:1,android:2
};
var MAP_IMG_MODE_TYPE={
	YimaType:0,GoogleType:1,BaiduType:2
};
var GPS={
	PI:3.14159265358979324,x_pi:3.14159265358979324*3000.0/180.0,delta:function(lat,lon){
		var a=6378245.0;
		var ee=0.00669342162296594323;
		var dLat=this.transformLat(lon-105.0,lat-35.0);
		var dLon=this.transformLon(lon-105.0,lat-35.0);
		var radLat=lat/180.0*this.PI;
		var magic=Math.sin(radLat);
		magic=1-ee*magic*magic;
		var sqrtMagic=Math.sqrt(magic);
		dLat=(dLat*180.0)/ ((a * (1 - ee)) /(magic*sqrtMagic)*this.PI);
		dLon=(dLon*180.0)/ (a /sqrtMagic*Math.cos(radLat)*this.PI);
		return{
			'lat':dLat,'lon':dLon
		};
	}
	,gcj_encrypt:function(wgsLat,wgsLon){
		if(this.outOfChina(wgsLat,wgsLon))return{
			'lat':wgsLat,'lon':wgsLon
		};
		var d=this.delta(wgsLat,wgsLon);
		return{
			'lat':parseFloat(wgsLat)+parseFloat(d.lat),'lon':parseFloat(wgsLon)+parseFloat(d.lon)
		};
	}
	,gcj_decrypt:function(gcjLat,gcjLon){
		if(this.outOfChina(gcjLat,gcjLon))return{
			'lat':gcjLat,'lon':gcjLon
		};
		var d=this.delta(gcjLat,gcjLon);
		return{
			'lat':gcjLat-d.lat,'lon':gcjLon-d.lon
		};
	}
	,gcj_decrypt_exact:function(gcjLat,gcjLon){
		var initDelta=0.01;
		var threshold=0.000000001;
		var dLat=initDelta,dLon=initDelta;
		var mLat=gcjLat-dLat,mLon=gcjLon-dLon;
		var pLat=gcjLat+dLat,pLon=gcjLon+dLon;
		var wgsLat,wgsLon,i=0;
		while(1){
			wgsLat=(mLat+pLat)/2;
			wgsLon=(mLon+pLon)/2;
			var tmp=this.gcj_encrypt(wgsLat,wgsLon);
			dLat=tmp.lat-gcjLat;
			dLon=tmp.lon-gcjLon;
			if((Math.abs(dLat)<threshold)&&(Math.abs(dLon)<threshold))break;
			if(dLat>0)pLat=wgsLat;
			else mLat=wgsLat;
			if(dLon>0)pLon=wgsLon;
			else mLon=wgsLon;
			if(++i>10000)break;
		};
		return{
			'lat':wgsLat,'lon':wgsLon
		}
	}
	,bd_encrypt:function(gcjLat,gcjLon){
		var x=gcjLon,y=gcjLat;
		var z=Math.sqrt(x*x+y*y)+0.00002*Math.sin(y*this.x_pi);
		var theta=Math.atan2(y,x)+0.000003*Math.cos(x*this.x_pi);
		bdLon=z*Math.cos(theta)+0.0065;
		bdLat=z*Math.sin(theta)+0.006;
		return{
			'lat':bdLat,'lon':bdLon
		};
	}
	,bd_decrypt:function(bdLat,bdLon){
		var x=bdLon-0.0065,y=bdLat-0.006;
		var z=Math.sqrt(x*x+y*y)-0.00002*Math.sin(y*this.x_pi);
		var theta=Math.atan2(y,x)-0.000003*Math.cos(x*this.x_pi);
		var gcjLon=z*Math.cos(theta);
		var gcjLat=z*Math.sin(theta);
		return{
			'lat':gcjLat,'lon':gcjLon
		};
	}
	,mercator_encrypt:function(wgsLat,wgsLon){
		var x=wgsLon*20037508.34/180.0;
		var y=Math.log(Math.tan((90.0+wgsLat)*this.PI/ 360.0)) /(this.PI/180.);
		y=y*20037508.34/180.0;
		return{
			'lat':y,'lon':x
		};
	}
	,mercator_decrypt:function(mercatorLat,mercatorLon){
		var x=mercatorLon/20037508.34*180.0;
		var y=mercatorLat/20037508.34*180.0;
		y=180/ this.PI * (2 * Math.atan(Math.exp(y * this.PI /180.))-this.PI/2);
		return{
			'lat':y,'lon':x
		};
	}
	,distance:function(latA,lonA,latB,lonB){
		var earthR=6371000.0;
		var x=Math.cos(latA*this.PI/ 180.) * Math.cos(latB * this.PI /180.)*Math.cos((lonA-lonB)*this.PI/180);
		var y=Math.sin(latA*this.PI/ 180.) * Math.sin(latB * this.PI /180.);
		var s=x+y;
		if(s>1)s=1;
		if(s<-1)s=-1;
		var alpha=Math.acos(s);
		var distance=alpha*earthR;
		return distance;
	}
	,outOfChina:function(lat,lon){
		if(lon<72.004||lon>137.8347)return true;
		if(lat<0.8293||lat>55.8271)return true;
		return false;
	}
	,transformLat:function(x,y){
		var ret=-100.0+2.0*x+3.0*y+0.2*y*y+0.1*x*y+0.2*Math.sqrt(Math.abs(x));
		ret+=(20.0*Math.sin(6.0*x*this.PI)+20.0*Math.sin(2.0*x*this.PI))*2.0/3.0;
		ret+=(20.0*Math.sin(y*this.PI)+40.0*Math.sin(y/ 3.0 * this.PI)) * 2.0 /3.0;
		ret+=(160.0*Math.sin(y/ 12.0 * this.PI) + 320 * Math.sin(y * this.PI /30.0))*2.0/3.0;
		return ret;
	}
	,transformLon:function(x,y){
		var ret=300.0+x+2.0*y+0.1*x*x+0.1*x*y+0.1*Math.sqrt(Math.abs(x));
		ret+=(20.0*Math.sin(6.0*x*this.PI)+20.0*Math.sin(2.0*x*this.PI))*2.0/3.0;
		ret+=(20.0*Math.sin(x*this.PI)+40.0*Math.sin(x/ 3.0 * this.PI)) * 2.0 /3.0;
		ret+=(150.0*Math.sin(x/ 12.0 * this.PI) + 300.0 * Math.sin(x /30.0*this.PI))*2.0/3.0;
		return ret;
	}
};
;
(function(name,context,factory){
	if(typeof module!=="undefined"&&module.exports){
		module.exports=factory();
	}
	else if(typeof define==="function"&&define.amd){
		define(factory);
	}
	else{
		context[name]=factory();
	}
})("h337",this,function(){
	var HeatmapConfig={
		defaultRadius:40,defaultRenderer:'canvas2d',defaultGradient:{
			0.25:"rgb(0,0,255)",0.55:"rgb(0,255,0)",0.85:"yellow",1.0:"rgb(255,0,0)"
		}
		,defaultMaxOpacity:1,defaultMinOpacity:0,defaultBlur:.85,defaultXField:'x',defaultYField:'y',defaultValueField:'value',plugins:{}
	};
	var Store=(function m9(){
		var n3=function n3(config){
			this._coordinator={};
			this._data=[];
			this._radi=[];
			this._min=10;
			this._max=1;
			this._xField=config['xField']||config.defaultXField;
			this._yField=config['yField']||config.defaultYField;
			this._valueField=config['valueField']||config.defaultValueField;
			if(config["radius"]){
				this._cfgRadius=config["radius"];
			}
		};
		var defaultRadius=HeatmapConfig.defaultRadius;
		n3.prototype={
			_organiseData:function(dataPoint,forceRender){
				var x=dataPoint[this._xField];
				var y=dataPoint[this._yField];
				var radi=this._radi;
				var store=this._data;
				var max=this._max;
				var min=this._min;
				var value=dataPoint[this._valueField]||1;
				var radius=dataPoint.radius||this._cfgRadius||defaultRadius;
				if(!store[x]){
					store[x]=[];
					radi[x]=[];
				};
				if(!store[x][y]){
					store[x][y]=value;
					radi[x][y]=radius;
				}
				else{
					store[x][y]+=value;
				};
				var storedVal=store[x][y];
				if(storedVal>max){
					if(!forceRender){
						this._max=storedVal;
					}
					else{
						this.setDataMax(storedVal);
					};
					return false;
				}
				else if(storedVal<min){
					if(!forceRender){
						this._min=storedVal;
					}
					else{
						this.setDataMin(storedVal);
					};
					return false;
				}
				else{
					return{
						x:x,y:y,value:value,radius:radius,min:min,max:max
					};
				}
			}
			,_unOrganizeData:function(){
				var unorganizedData=[];
				var data=this._data;
				var radi=this._radi;
				for(var x in data){
					for(var y in data[x]){
						unorganizedData.push({
							x:x,y:y,radius:radi[x][y],value:data[x][y]
						});
					}
				};
				return{
					min:this._min,max:this._max,data:unorganizedData
				};
			}
			,_onExtremaChange:function(){
				this._coordinator.emit('extremachange',{
					min:this._min,max:this._max
				});
			}
			,addData:function(){
				if(arguments[0].length>0){
					var dataArr=arguments[0];
					var dataLen=dataArr.length;
					while(dataLen--){
						this.addData.call(this,dataArr[dataLen]);
					}
				}
				else{
					var organisedEntry=this._organiseData(arguments[0],true);
					if(organisedEntry){
						if(this._data.length===0){
							this._min=this._max=organisedEntry.value;
						};
						this._coordinator.emit('renderpartial',{
							min:this._min,max:this._max,data:[organisedEntry]
						});
					}
				};
				return this;
			}
			,clear:function(){
				this._coordinator.emit('clear',null);
			}
			,setData:function(data){
				var dataPoints=data.data;
				var pointsLen=dataPoints.length;
				this._data=[];
				this._radi=[];
				for(var i=0;i<pointsLen;i++){
					this._organiseData(dataPoints[i],false);
				};
				this._max=data.max;
				this._min=data.min||0;
				this._onExtremaChange();
				this._coordinator.emit('renderall',this._getInternalData());
				return this;
			}
			,removeData:function(){},setDataMax:function(max){
				this._max=max;
				this._onExtremaChange();
				this._coordinator.emit('renderall',this._getInternalData());
				return this;
			}
			,setDataMin:function(min){
				this._min=min;
				this._onExtremaChange();
				this._coordinator.emit('renderall',this._getInternalData());
				return this;
			}
			,setCoordinator:function(coordinator){
				this._coordinator=coordinator;
			}
			,_getInternalData:function(){
				return{
					max:this._max,min:this._min,data:this._data,radi:this._radi
				};
			}
			,getData:function(){
				return this._unOrganizeData();
			}
		};
		return n3;
	})();
	var Canvas2dRenderer=(function n0(){
		var n3=function(config){
			var gradientConfig=config.gradient||config.defaultGradient;
			var paletteCanvas=document.createElement('canvas');
			var paletteCtx=paletteCanvas.getContext('2d');
			paletteCanvas.width=256;
			paletteCanvas.height=1;
			var gradient=paletteCtx.createLinearGradient(0,0,256,1);
			for(var key in gradientConfig){
				gradient.addColorStop(key,gradientConfig[key]);
			};
			paletteCtx.fillStyle=gradient;
			paletteCtx.fillRect(0,0,256,1);
			return paletteCtx.getImageData(0,0,256,1).data;
		};
		var n4=function(radius,blurFactor){
			var tplCanvas=document.createElement('canvas');
			var tplCtx=tplCanvas.getContext('2d');
			var x=radius;
			var y=radius;
			tplCanvas.width=tplCanvas.height=radius*2;
			if(blurFactor==1){
				tplCtx.beginPath();
				tplCtx.arc(x,y,radius,0,2*Math.PI,false);
				tplCtx.fillStyle='rgba(0,0,0,1)';
				tplCtx.fill();
			}
			else{
				var gradient=tplCtx.createRadialGradient(x,y,radius*blurFactor,x,y,radius);
				gradient.addColorStop(0,'rgba(0,0,0,1)');
				gradient.addColorStop(1,'rgba(0,0,0,0)');
				tplCtx.fillStyle=gradient;
				tplCtx.fillRect(0,0,2*radius,2*radius);
			};
			return tplCanvas;
		};
		var n5=function(data){
			var renderData=[];
			var min=data.min;
			var max=data.max;
			var radi=data.radi;
			var data=data.data;
			var xValues=Object.keys(data);
			var xValuesLen=xValues.length;
			while(xValuesLen--){
				var xValue=xValues[xValuesLen];
				var yValues=Object.keys(data[xValue]);
				var yValuesLen=yValues.length;
				while(yValuesLen--){
					var yValue=yValues[yValuesLen];
					var value=data[xValue][yValue];
					var radius=radi[xValue][yValue];
					renderData.push({
						x:xValue,y:yValue,value:value,radius:radius
					});
				}
			};
			return{
				min:min,max:max,data:renderData
			};
		};
		function n6(config){
			var container=config.container;
			var shadowCanvas=this.shadowCanvas=document.createElement('canvas');
			var canvas=this.canvas=config.canvas||document.createElement('canvas');
			var renderBoundaries=this._renderBoundaries=[10000,10000,0,0];
			var computed=getComputedStyle(config.container)||{};
			canvas.className='heatmap-canvas';
			this._width=canvas.width=shadowCanvas.width=config.width||+(computed.width.replace(/px/,''));
			this._height=canvas.height=shadowCanvas.height=config.height||+(computed.height.replace(/px/,''));
			this.shadowCtx=shadowCanvas.getContext('2d');
			this.ctx=canvas.getContext('2d');
			canvas.style.cssText=shadowCanvas.style.cssText='position:absolute;left:0;top:0;';
			container.style.position='relative';
			container.appendChild(canvas);
			this._palette=n3(config);
			this._templates={};
			this._setStyles(config);
		};
		n6.prototype={
			renderPartial:function(data){
				if(data.data.length>0){
					this._drawAlpha(data);
					this._colorize();
				}
			}
			,renderAll:function(data){
				this._clear();
				if(data.data.length>0){
					this._drawAlpha(n5(data));
					this._colorize();
				}
			}
			,_updateGradient:function(config){
				this._palette=n3(config);
			}
			,updateConfig:function(config){
				if(config['gradient']){
					this._updateGradient(config);
				};
				this._setStyles(config);
			}
			,setDimensions:function(width,height){
				this._width=width;
				this._height=height;
				this.canvas.width=this.shadowCanvas.width=width;
				this.canvas.height=this.shadowCanvas.height=height;
			}
			,_clear:function(){
				this.shadowCtx.clearRect(0,0,this._width,this._height);
				this.ctx.clearRect(0,0,this._width,this._height);
			}
			,_setStyles:function(config){
				this._blur=(config.blur==0)?0:(config.blur||config.defaultBlur);
				if(config.backgroundColor){
					this.canvas.style.backgroundColor=config.backgroundColor;
				};
				this._width=this.canvas.width=this.shadowCanvas.width=config.width||this._width;
				this._height=this.canvas.height=this.shadowCanvas.height=config.height||this._height;
				this._opacity=(config.opacity||0)*255;
				this._maxOpacity=(config.maxOpacity||config.defaultMaxOpacity)*255;
				this._minOpacity=(config.minOpacity||config.defaultMinOpacity)*255;
				this._useGradientOpacity=!!config.useGradientOpacity;
			}
			,_drawAlpha:function(data){
				var min=this._min=data.min;
				var max=this._max=data.max;
				var data=data.data||[];
				var dataLen=data.length;
				var blur=1-this._blur;
				while(dataLen--){
					var point=data[dataLen];
					var x=point.x;
					var y=point.y;
					var radius=point.radius;
					var value=Math.min(point.value,max);
					var rectX=x-radius;
					var rectY=y-radius;
					var shadowCtx=this.shadowCtx;
					var tpl;
					if(!this._templates[radius]){
						this._templates[radius]=tpl=n4(radius,blur);
					}
					else{
						tpl=this._templates[radius];
					};
					var templateAlpha=(value-min)/(max-min);
					shadowCtx.globalAlpha=templateAlpha<.01?.01:templateAlpha;
					shadowCtx.drawImage(tpl,rectX,rectY);
					if(rectX<this._renderBoundaries[0]){
						this._renderBoundaries[0]=rectX;
					};
					if(rectY<this._renderBoundaries[1]){
						this._renderBoundaries[1]=rectY;
					};
					if(rectX+2*radius>this._renderBoundaries[2]){
						this._renderBoundaries[2]=rectX+2*radius;
					};
					if(rectY+2*radius>this._renderBoundaries[3]){
						this._renderBoundaries[3]=rectY+2*radius;
					}
				}
			}
			,_colorize:function(){
				var x=this._renderBoundaries[0];
				var y=this._renderBoundaries[1];
				var width=this._renderBoundaries[2]-x;
				var height=this._renderBoundaries[3]-y;
				var maxWidth=this._width;
				var maxHeight=this._height;
				var opacity=this._opacity;
				var maxOpacity=this._maxOpacity;
				var minOpacity=this._minOpacity;
				var useGradientOpacity=this._useGradientOpacity;
				if(x<0){
					x=0;
				};
				if(y<0){
					y=0;
				};
				if(x+width>maxWidth){
					width=maxWidth-x;
				};
				if(y+height>maxHeight){
					height=maxHeight-y;
				};
				var img=this.shadowCtx.getImageData(x,y,width,height);
				var imgData=img.data;
				var len=imgData.length;
				var palette=this._palette;
				for(var i=3;i<len;i+=4){
					var alpha=imgData[i];
					var offset=alpha*4;
					if(!offset){
						continue;
					};
					var finalAlpha;
					if(opacity>0){
						finalAlpha=opacity;
					}
					else{
						if(alpha<maxOpacity){
							if(alpha<minOpacity){
								finalAlpha=minOpacity;
							}
							else{
								finalAlpha=alpha;
							}
						}
						else{
							finalAlpha=maxOpacity;
						}
					};
					imgData[i-3]=palette[offset];
					imgData[i-2]=palette[offset+1];
					imgData[i-1]=palette[offset+2];
					imgData[i]=useGradientOpacity?palette[offset+3]:finalAlpha;
				};
				img.data=imgData;
				this.ctx.putImageData(img,x,y);
				this._renderBoundaries=[1000,1000,0,0];
			}
			,getValueAt:function(point){
				var value;
				var shadowCtx=this.shadowCtx;
				var img=shadowCtx.getImageData(point.x,point.y,1,1);
				var data=img.data[3];
				var max=this._max;
				var min=this._min;
				value=(Math.abs(max-min)*(data/255))>>0;
				return value;
			}
			,getDataURL:function(){
				return this.canvas.toDataURL();
			}
		};
		return n6;
	})();
	var Renderer=(function n1(){
		var rendererFn=false;
		if(HeatmapConfig['defaultRenderer']==='canvas2d'){
			rendererFn=Canvas2dRenderer;
		};
		return rendererFn;
	})();
	var Util={
		merge:function(){
			var merged={};
			var argsLen=arguments.length;
			for(var i=0;i<argsLen;i++){
				var obj=arguments[i];
				for(var key in obj){
					merged[key]=obj[key];
				}
			};
			return merged;
		}
	};
	var Heatmap=(function n2(){
		var Coordinator=(function n3(){
			function n6(){
				this.cStore={};
			};
			n6.prototype={
				on:function(evtName,callback,scope){
					var cStore=this.cStore;
					if(!cStore[evtName]){
						cStore[evtName]=[];
					};
					cStore[evtName].push((function(data){
						return callback.call(scope,data);
					}))
				}
				,emit:function(evtName,data){
					var cStore=this.cStore;
					if(cStore[evtName]){
						var len=cStore[evtName].length;
						for(var i=0;i<len;i++){
							var callback=cStore[evtName][i];
							callback(data);
						}
					}
				}
			};
			return n6;
		})();
		var n4=function(scope){
			var renderer=scope._renderer;
			var coordinator=scope._coordinator;
			var store=scope._store;
			coordinator.on('clear',renderer.renderPartial,renderer);
			coordinator.on('renderpartial',renderer.renderPartial,renderer);
			coordinator.on('renderall',renderer.renderAll,renderer);
			coordinator.on('extremachange',function(data){
				scope._config.onExtremaChange&&scope._config.onExtremaChange({
					min:data.min,max:data.max,gradient:scope._config['gradient']||scope._config['defaultGradient']
				});
			});
			store.setCoordinator(coordinator);
		};
		function n5(){
			var config=this._config=Util.merge(HeatmapConfig,arguments[0]||{});
			this._coordinator=new Coordinator();
			if(config['plugin']){
				var pluginToLoad=config['plugin'];
				if(!HeatmapConfig.plugins[pluginToLoad]){
					throw new Error('Plugin \''+pluginToLoad+'\' not found. Maybe it was not registered.');
				}
				else{
					var plugin=HeatmapConfig.plugins[pluginToLoad];
					this._renderer=new plugin.renderer(config);
					this._store=new plugin.store(config);
				}
			}
			else{
				this._renderer=new Renderer(config);
				this._store=new Store(config);
			};
			n4(this);
		};
		n5.prototype={
			clear:function(){
				this._store.clear.apply(this._store,arguments);
				return this;
			}
			,addData:function(){
				this._store.addData.apply(this._store,arguments);
				return this;
			}
			,removeData:function(){
				this._store.removeData&&this._store.removeData.apply(this._store,arguments);
				return this;
			}
			,setData:function(){
				this._store.setData.apply(this._store,arguments);
				return this;
			}
			,setDataMax:function(){
				this._store.setDataMax.apply(this._store,arguments);
				return this;
			}
			,setDataMin:function(){
				this._store.setDataMin.apply(this._store,arguments);
				return this;
			}
			,configure:function(config){
				this._config=Util.merge(this._config,config);
				this._renderer.updateConfig(this._config);
				this._coordinator.emit('renderall',this._store._getInternalData());
				return this;
			}
			,repaint:function(){
				this._coordinator.emit('renderall',this._store._getInternalData());
				return this;
			}
			,getData:function(){
				return this._store.getData();
			}
			,getDataURL:function(){
				return this._renderer.getDataURL();
			}
			,getValueAt:function(point){
				if(this._store.getValueAt){
					return this._store.getValueAt(point);
				}
				else if(this._renderer.getValueAt){
					return this._renderer.getValueAt(point);
				}
				else{
					return null;
				}
			}
		};
		return n5;
	})();
	var heatmapFactory={
		create:function(config){
			return new Heatmap(config);
		}
		,register:function(pluginKey,plugin){
			HeatmapConfig.plugins[pluginKey]=plugin;
		}
	};
	return heatmapFactory;
});
var _bLoadHtml5Js=false;
if(navigator.userAgent.indexOf("MSIE")!=-1){
	if(navigator.userAgent.indexOf("MSIE 6.")!=-1){
		_bLoadHtml5Js=true
	}
	else if(navigator.userAgent.indexOf("MSIE 7.")!=-1){
		_bLoadHtml5Js=true
	}
	else if(navigator.userAgent.indexOf("MSIE 8.")!=-1){
		_bLoadHtml5Js=true
	}
};
if(_bLoadHtml5Js){
	(function(l,f){
		function m9(){
			var a=e.elements;
			return"string"==typeof a?a.split(" "):a
		};
		function n0(a){
			var b=n[a[o]];
			b||(b={},h++,a[o]=h,n[h]=b);
			return b
		};
		function n1(a,b,c){
			b||(b=f);
			if(g)return b.createElement(a);
			c||(c=n0(b));
			b=c.cache[a]?c.cache[a].cloneNode():r.test(a)?(c.cache[a]=c.createElem(a)).cloneNode():c.createElem(a);
			return b.canHaveChildren&&!s.test(a)?c.frag.appendChild(b):b
		};
		function n2(a,b){
			if(!b.cache)b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag();
			a.createElement=function(c){
				return!e.shivMethods?b.createElem(c):n1(c,a,b)
			};
			a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m9().join().replace(/[\w\-]+/g,function(a){
				b.createElem(a);
				b.frag.createElement(a);
				return'c("'+a+'")'
			})+");return n}")(e,b.frag)
		};
		function n3(a){
			a||(a=f);
			var b=n0(a);
			if(e.shivCSS&&!j&&!b.hasCSS){
				var c,d=a;
				c=d.createElement("p");
				d=d.getElementsByTagName("head")[0]||d.documentElement;
				c.innerHTML="x<style>article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}</style>";
				c=d.insertBefore(c.lastChild,d.firstChild);
				b.hasCSS=!!c
			};
			g||n2(a,b);
			return a
		};
		var k=l.html5||{},s=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,r=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,j,o="_html5shiv",h=0,n={},g;
		(function(){
			try{
				var a=f.createElement("a");
				a.innerHTML="<xyz></xyz>";
				j="hidden"in a;
				var b;
				if(!(b=1==a.childNodes.length)){
					f.createElement("a");
					var c=f.createDocumentFragment();
					b="undefined"==typeof c.cloneNode||"undefined"==typeof c.createDocumentFragment||"undefined"==typeof c.createElement
				};
				g=b
			}
			catch(d){
				g=j=!0
			}
		})();
		var e={
			elements:k.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:"3.7.0",shivCSS:!1!==k.shivCSS,supportsUnknownElements:g,shivMethods:!1!==k.shivMethods,type:"default",shivDocument:n3,createElement:n1,createDocumentFragment:function(a,b){
				a||(a=f);
				if(g)return a.createDocumentFragment();
				for(var b=b||n0(a),c=b.frag.cloneNode(),d=0,e=m9(),h=e.length;
				d<h;
				d++)c.createElement(e[d]);
				return c
			}
		};
		l.html5=e;
		n3(f)
	})(this,document)
};
function b6(){
	this.SetLineStyle=function(objCanvas2D,iLineWidth,strLineColor,iOpacity){
		if(objCanvas2D){
			objCanvas2D.strokeStyle=strLineColor;
			objCanvas2D.lineWidth=iLineWidth;
			objCanvas2D.lineWidthSize=iLineWidth;
			objCanvas2D.globalAlphaOfLine=parseFloat(iOpacity)/100;
		}
	};
	this.SetFillStyle=function(objCanvas2D,strFillColor,iOpacity){
		if(objCanvas2D){
			objCanvas2D.fillStyle=strFillColor;
			objCanvas2D.colorOfFill=strFillColor;
			objCanvas2D.globalAlphaOfFill=parseFloat(iOpacity)/100;
		}
	};
	this.SetTextStyle=function(objCanvas2D,strFont,strColor,iOpacity){
		if(objCanvas2D){
			objCanvas2D.font=strFont+"Courier New";
			objCanvas2D.fillStyle=strColor;
			objCanvas2D.globalAlphaText=parseFloat(iOpacity)/100;
		}
	};
	this.SetRotateAngle=function(objCanvas2D,rotation){
		if(G_V.bUseSvgDrawerOrNot){
			return;
		};
		if(objCanvas2D){
			try{
				objCanvas2D.rotate(rotation*Math.PI/180);
			}
			catch(e){}
		}
	};
	this.DrawCircle=function(objCanvas2D,scrnPoX,scrnPoY,r,bFill){
		if(objCanvas2D){
			objCanvas2D.beginPath();
			objCanvas2D.arc(scrnPoX,scrnPoY,r,0,Math.PI*2,true);
			objCanvas2D.closePath();
			if(objCanvas2D.lineWidthSize==null||objCanvas2D.lineWidthSize==undefined||parseInt(objCanvas2D.lineWidthSize)>0){
				if(objCanvas2D.globalAlphaOfLine){
					objCanvas2D.globalAlpha=objCanvas2D.globalAlphaOfLine;
				};
				objCanvas2D.stroke();
			};
			if(bFill==true){
				if(objCanvas2D.globalAlphaOfFill){
					objCanvas2D.globalAlpha=objCanvas2D.globalAlphaOfFill;
				};
				if(objCanvas2D.colorOfFill){
					objCanvas2D.fillStyle=objCanvas2D.colorOfFill
				};
				objCanvas2D.fill();
			}
		}
	};
	this.DrawString=function(objCanvas2D,scrnPoX,scrnPoY,strText){
		if(objCanvas2D){
			try{
				if(objCanvas2D.globalAlphaText){
					objCanvas2D.globalAlpha=objCanvas2D.globalAlphaText;
				};
				objCanvas2D.fillText(strText,scrnPoX,scrnPoY);
			}
			catch(e){}
		}
	};
	this.DrawImg=function(objCanvas2D,scrnPoX,scrnPoY,imgObj,w,h){
		if(objCanvas2D&&imgObj){
			if(imgObj.tagName!="IMG"||(imgObj.tagName=="IMG"&&imgObj.complete==true)){
				if(w){
					var xpos=G_V.iMapViewWidth/2;
					var ypos=G_V.iMapViewHeight/2;
					objCanvas2D.drawImage(imgObj,scrnPoX,scrnPoY,w,h);
				}
				else{
					objCanvas2D.drawImage(imgObj,scrnPoX,scrnPoY);
				}
			}
			else{
				if(G_V.arrDrawLoadImgInfo.lenght>200){
					G_V.arrDrawLoadImgInfo.lenght=[];
				};
				G_V.arrDrawLoadImgInfo.push({
					img:imgObj,x:scrnPoX,y:scrnPoY,w:w,h:h
				});
				imgObj.onload=function(){
					for(var i=0;i<G_V.arrDrawLoadImgInfo.lenght;i++){
						if(imgObj.src==G_V.arrDrawLoadImgInfo[i].img.src){
							if(isNaN(G_V.arrDrawLoadImgInfo[i].w)||isNaN(G_V.arrDrawLoadImgInfo[i].h)){
								objCanvas2D.drawImage(G_V.arrDrawLoadImgInfo[i].img,G_V.arrDrawLoadImgInfo[i].x,G_V.arrDrawLoadImgInfo[i].y);
							}
							else{
								objCanvas2D.drawImage(G_V.arrDrawLoadImgInfo[i].img,G_V.arrDrawLoadImgInfo[i].x,G_V.arrDrawLoadImgInfo[i].y,G_V.arrDrawLoadImgInfo[i].w,G_V.arrDrawLoadImgInfo[i].h);
							};
							G_V.arrDrawLoadImgInfo[i].splice(i,1);
							i--;
						}
					}
				}
			}
		}
	};
	this.DrawImgObj=function(objCanvas2D,imgObj,scrnPoX,scrnPoY,w,h){
		if(objCanvas2D&&imgObj){
			if(imgObj.tagName!="IMG"||(imgObj.tagName=="IMG"&&imgObj.complete==true)){
				if(isNaN(w)||isNaN(h)){
					objCanvas2D.drawImage(imgObj,scrnPoX,scrnPoY)
				}
				else{
					objCanvas2D.drawImage(imgObj,scrnPoX,scrnPoY,w,h);
				}
			}
			else{
				if(G_V.arrDrawLoadImgInfo.lenght>200){
					G_V.arrDrawLoadImgInfo.lenght=[];
				};
				G_V.arrDrawLoadImgInfo.push({
					img:imgObj,x:scrnPoX,y:scrnPoY,w:w,h:h
				});
				imgObj.onload=function(){
					for(var i=0;i<G_V.arrDrawLoadImgInfo.lenght;i++){
						if(imgObj.src==G_V.arrDrawLoadImgInfo[i].img.src){
							if(isNaN(G_V.arrDrawLoadImgInfo[i].w)||isNaN(G_V.arrDrawLoadImgInfo[i].h)){
								objCanvas2D.drawImage(G_V.arrDrawLoadImgInfo[i].img,G_V.arrDrawLoadImgInfo[i].x,G_V.arrDrawLoadImgInfo[i].y);
							}
							else{
								objCanvas2D.drawImage(G_V.arrDrawLoadImgInfo.img,G_V.arrDrawLoadImgInfo[i].x,G_V.arrDrawLoadImgInfo[i].y,G_V.arrDrawLoadImgInfo[i].w,G_V.arrDrawLoadImgInfo[i].h);
							};
							G_V.arrDrawLoadImgInfo[i].splice(i,1);
							i--;
						}
					}
				}
			}
		}
	};
	this.DrawImgByUrl=function(objCanvas2D,strUrl,scrnPoX,scrnPoY,w,h){
		if(objCanvas2D){
			var image=new Image();
			image.crossOrigin="";
			image.src=strUrl;
			this.DrawImgObj(objCanvas2D,image,scrnPoX,scrnPoY,w,h);
		}
	};
	this.DrawLine=function(objCanvas2D,arrPoints,bSetLineDash,iLineDashLen,iLineDashSpaceLen){
		if(objCanvas2D){
			if(arrPoints.length>0){
				if(objCanvas2D.globalAlphaOfLine){
					objCanvas2D.globalAlpha=objCanvas2D.globalAlphaOfLine;
				};
				objCanvas2D.beginPath();
				try{
					if(bSetLineDash!=undefined&&bSetLineDash!=null&&bSetLineDash==true){
						if(isNaN(iLineDashLen)&&isNaN(iLineDashSpaceLen)){
							objCanvas2D.setLineDash([1,1]);
						}
						else{
							objCanvas2D.setLineDash([iLineDashLen,iLineDashSpaceLen]);
						}
					}
				}
				catch(e){};
				for(var i=0;i<arrPoints.length;i++){
					var scrnX=arrPoints[i].x;
					var scrnY=arrPoints[i].y;
					if(i==0){
						objCanvas2D.moveTo(scrnX,scrnY);
					}
					else{
						objCanvas2D.lineTo(scrnX,scrnY);
					}
				};
				objCanvas2D.stroke();
			}
		}
	};
	this.DrawDashedLine=function(objCanvas2D,arrPoints,lineLen,dashLen){
		if(objCanvas2D){
			var iPoCount=arrPoints.length;
			objCanvas2D.beginPath();
			for(var iPos=1;iPos<iPoCount;iPos++){
				lineLen=lineLen===undefined?2:lineLen;
				dashLen=dashLen===undefined?8:dashLen;
				var xpos=arrPoints[iPos].x-arrPoints[iPos-1].x;
				var ypos=arrPoints[iPos].y-arrPoints[iPos-1].y;
				var numLineCount=Math.floor(Math.sqrt(xpos*xpos+ypos*ypos)/((lineLen+dashLen)));
				var oneAddLenX=xpos/numLineCount;
				var oneAddLenY=ypos/numLineCount;
				numLineCount*=2;
				var oneAddLineLenPo={
					x:oneAddLenX*(lineLen/ (lineLen + dashLen)), y: oneAddLenY * (lineLen /(lineLen+dashLen))
				};
				var oneAddDasheLenPo={
					x:oneAddLenX*(dashLen/ (lineLen + dashLen)), y: oneAddLenY * (dashLen /(lineLen+dashLen))
				};
				var curDrawPo={
					x:arrPoints[iPos-1].x,y:arrPoints[iPos-1].y
				};
				var curAddLenPo={
					x:0,y:0
				};
				for(var i=0;i<numLineCount;i++){
					curDrawPo.x+=curAddLenPo.x;
					curDrawPo.y+=curAddLenPo.y;
					if(i%2===0){
						objCanvas2D.moveTo(curDrawPo.x,curDrawPo.y);
						curAddLenPo=oneAddLineLenPo;
					}
					else{
						objCanvas2D.lineTo(curDrawPo.x,curDrawPo.y);
						curAddLenPo=oneAddDasheLenPo;
					}
				}
			};
			objCanvas2D.stroke();
		}
	};
	this.DrawRect=function(objCanvas2D,poX,poY,width,height,bFill){
		if(objCanvas2D){
			objCanvas2D.beginPath();
			try{
				if(objCanvas2D.lineWidthSize==null||objCanvas2D.lineWidthSize==undefined||parseInt(objCanvas2D.lineWidthSize)>0){
					if(objCanvas2D.globalAlphaOfLine){
						objCanvas2D.globalAlpha=objCanvas2D.globalAlphaOfLine;
					};
					objCanvas2D.strokeRect(poX,poY,width,height);
				}
			}
			catch(e){};
			if(bFill==true){
				if(objCanvas2D.globalAlphaOfFill){
					objCanvas2D.globalAlpha=objCanvas2D.globalAlphaOfFill;
				};
				if(objCanvas2D.colorOfFill){
					objCanvas2D.fillStyle=objCanvas2D.colorOfFill
				};
				objCanvas2D.fillRect(poX,poY,width,height);
			};
			objCanvas2D.closePath();
			objCanvas2D.stroke();
		}
	};
	this.DrawPolygon=function(objCanvas2D,arrPoints,bFill){
		if(objCanvas2D){
			if(arrPoints.length>2){
				objCanvas2D.beginPath();
				for(var i=0;i<arrPoints.length;i++){
					var scrnX=arrPoints[i].x;
					var scrnY=arrPoints[i].y;
					if(i==0){
						objCanvas2D.moveTo(scrnX,scrnY);
					}
					else{
						objCanvas2D.lineTo(scrnX,scrnY);
					}
				};
				objCanvas2D.closePath();
				try{
					if(objCanvas2D.lineWidthSize==null||objCanvas2D.lineWidthSize==undefined||parseInt(objCanvas2D.lineWidthSize)>0){
						if(objCanvas2D.globalAlphaOfLine){
							objCanvas2D.globalAlpha=objCanvas2D.globalAlphaOfLine;
						};
						objCanvas2D.stroke();
					}
				}
				catch(e){};
				if(bFill==true){
					if(objCanvas2D.globalAlphaOfFill){
						objCanvas2D.globalAlpha=objCanvas2D.globalAlphaOfFill;
					};
					if(objCanvas2D.colorOfFill){
						objCanvas2D.fillStyle=objCanvas2D.colorOfFill
					};
					objCanvas2D.fill();
				}
			}
		}
	};
	this.DrawSector=function(objCanvas2D,curCirclePo,startAngle,endAngle,iSmallCircleR,iBigCircleR,bFill){
		var startAngleValue=startAngle/180*Math.PI;
		var endAngleValue=endAngle/180*Math.PI;
		startAngle=360-startAngle;
		endAngle=360-endAngle;
		startAngleValue=startAngle/180*Math.PI;
		endAngleValue=endAngle/180*Math.PI;
		objCanvas2D.beginPath();
		objCanvas2D.arc(curCirclePo.x,curCirclePo.y,iBigCircleR,startAngleValue,endAngleValue,true);
		objCanvas2D.arc(curCirclePo.x,curCirclePo.y,iSmallCircleR,endAngleValue,startAngleValue,false);
		objCanvas2D.closePath();
		if(bFill==true){
			if(objCanvas2D.globalAlphaOfFill){
				objCanvas2D.globalAlpha=objCanvas2D.globalAlphaOfFill;
			};
			if(objCanvas2D.colorOfFill){
				objCanvas2D.fillStyle=objCanvas2D.colorOfFill
			};
			objCanvas2D.fill();
		};
		try{
			if(objCanvas2D.lineWidthSize==null||objCanvas2D.lineWidthSize==undefined||parseInt(objCanvas2D.lineWidthSize)>0){
				if(objCanvas2D.globalAlphaOfLine){
					objCanvas2D.globalAlpha=objCanvas2D.globalAlphaOfLine;
				};
				objCanvas2D.stroke();
			}
		}
		catch(e){}
	};
	this.Clear=function(objCanvas,objCanvas2D){
		if(objCanvas){
			var width=objCanvas.width;
			var height=objCanvas.height;
			objCanvas.width=width;
			objCanvas.height=height;
			if(objCanvas2D){
				objCanvas2D.translate(0,0);
				objCanvas2D.clearRect(0,0,width,height);
			}
			else{
				var curCanvas2D=objCanvas.getContext("2d");
				curCanvas2D.translate(0,0);
				curCanvas2D.clearRect(0,0,width,height);
			}
		}
	}
};
function b7(){
	this.arrImgGrid1=[];
	this.arrImgGrid2=[];
	this.minCols=0;
	this.minRows=0;
	this.curShowImgGridNum=1;
	this.getTitleImgFromGridByImgId=function(strImgId){
		for(var r=0;r<this.minRows;r++){
			if(!this.arrImgGrid1[r]){
				continue;
			};
			for(var c=0;c<this.minCols;c++){
				if(this.arrImgGrid1[r][c]&&this.arrImgGrid1[r][c].id==strImgId){
					return this.arrImgGrid1[r][c];
				}
			}
		};
		return null;
	};
	this.initImgGridded=function(){
		if(g_objYimaEncMap.viewMapImgDiv1==null||g_objYimaEncMap.viewMapImgDiv2==null){
			return
		};
		var mapDivStyle1=g_objYimaEncMap.viewMapImgDiv1.style;
		var mapDivStyle2=g_objYimaEncMap.viewMapImgDiv2.style;
		if(this.curShowImgGridNum==1){
			mapDivStyle1.left="0px";
			mapDivStyle1.top="0px";
			mapDivStyle1.zIndex="10";
			mapDivStyle2.zIndex="1";
		}
		else{
			mapDivStyle2.left="0px";
			mapDivStyle2.top="0px";
			mapDivStyle2.zIndex="10";
			mapDivStyle1.zIndex="1";
		};
		var mapSize=G_V.getMapViewSize();
		var imgSize=G_V.getImgSize();
		this.minCols=Math.ceil(mapSize.x/imgSize.x)+2*G_V.iImgBufferCount+1;
		this.minRows=Math.ceil(mapSize.y/imgSize.y)+2*G_V.iImgBufferCount+1;
		var tileData=[];
		var mapScrnPo={
			x:G_V.iMapViewWidth/ 2, y: G_V.iMapViewHeight /2
		};
		for(var iRowNum=0;iRowNum<this.minRows;iRowNum++){
			var row;
			if(this.curShowImgGridNum==1){
				row=this.arrImgGrid1[iRowNum];
				if(!row){
					row=[];
					this.arrImgGrid1.push(row);
				}
			}
			else{
				row=this.arrImgGrid2[iRowNum];
				if(!row){
					row=[];
					this.arrImgGrid2.push(row);
				}
			};
			for(var iColNum=0;iColNum<this.minCols;iColNum++){
				var imgTitle=row[iColNum];
				if(!imgTitle){
					imgTitle=new h2();
					row.push(imgTitle);
					if(this.curShowImgGridNum==1){
						g_objYimaEncMap.viewMapImgDiv1.appendChild(imgTitle.getImage());
					}
					else{
						g_objYimaEncMap.viewMapImgDiv2.appendChild(imgTitle.getImage());
					}
				};
				i8(iRowNum,iColNum,G_V.iCurScale,imgTitle);
				tileData.push({
					imgTitle:imgTitle,distance:Math.pow(mapScrnPo.x-imgTitle.x,2)+Math.pow(mapScrnPo.y-imgTitle.y,2)
				});
			}
		};
		tileData.sort(function(a,b){
			return a.distance-b.distance;
		});
		for(var i=0,ii=tileData.length;i<ii;++i){
			tileData[i].imgTitle.draw(true);
		}
	};
	this.initImgGridded_Google=function(){
		if(g_objYimaEncMap.viewMapImgDiv1==null||g_objYimaEncMap.viewMapImgDiv2==null){
			return
		};
		var mapDivStyle1=g_objYimaEncMap.viewMapImgDiv1.style;
		var mapDivStyle2=g_objYimaEncMap.viewMapImgDiv2.style;
		if(this.curShowImgGridNum==1){
			mapDivStyle1.left="0px";
			mapDivStyle1.top="0px";
			mapDivStyle1.zIndex="10";
			mapDivStyle2.zIndex="1";
		}
		else{
			mapDivStyle2.left="0px";
			mapDivStyle2.top="0px";
			mapDivStyle2.zIndex="10";
			mapDivStyle1.zIndex="1";
		};
		var mapSize=G_V.getMapViewSize();
		var imgSize=G_V.getImgSize();
		this.minCols=Math.ceil(mapSize.x/imgSize.x)+2*G_V.iImgBufferCount+1;
		this.minRows=Math.ceil(mapSize.y/imgSize.y)+2*G_V.iImgBufferCount+1;
		var tileData=[];
		var mapScrnPo={
			x:G_V.iMapViewWidth/ 2, y: G_V.iMapViewHeight /2
		};
		for(var iRowNum=0;iRowNum<this.minRows;iRowNum++){
			var row;
			if(this.curShowImgGridNum==1){
				row=this.arrImgGrid1[iRowNum];
				if(!row){
					row=[];
					this.arrImgGrid1.push(row);
				}
			}
			else{
				row=this.arrImgGrid2[iRowNum];
				if(!row){
					row=[];
					this.arrImgGrid2.push(row);
				}
			};
			for(var iColNum=0;iColNum<this.minCols;iColNum++){
				var imgTitle=row[iColNum];
				if(!imgTitle){
					imgTitle=new h2();
					row.push(imgTitle);
					if(this.curShowImgGridNum==1){
						g_objYimaEncMap.viewMapImgDiv1.appendChild(imgTitle.getImage());
					}
					else{
						g_objYimaEncMap.viewMapImgDiv2.appendChild(imgTitle.getImage());
					}
				};
				i8(iRowNum,iColNum,G_V.iCurScale,imgTitle);
				tileData.push({
					imgTitle:imgTitle,distance:Math.pow(mapScrnPo.x-imgTitle.x,2)+Math.pow(mapScrnPo.y-imgTitle.y,2)
				});
			}
		};
		tileData.sort(function(a,b){
			return a.distance-b.distance;
		});
		for(var i=0,ii=tileData.length;i<ii;++i){
			tileData[i].imgTitle.draw(true);
		}
	};
	this.moveGriddedTiles=function(){
		while(true){
			if(G_V.dragMoveOffsetAfterUpdateGridPo.x>G_V.iImgWidth){
				G_V.dragMoveOffsetAfterUpdateGridPo.x-=G_V.iImgWidth;
				this.shiftColumn(true);
			}
			else if(G_V.dragMoveOffsetAfterUpdateGridPo.x<-G_V.iImgWidth){
				G_V.dragMoveOffsetAfterUpdateGridPo.x+=G_V.iImgWidth;
				this.shiftColumn(false);
			}
			else if(G_V.dragMoveOffsetAfterUpdateGridPo.y>G_V.iImgHeight){
				G_V.dragMoveOffsetAfterUpdateGridPo.y-=G_V.iImgHeight;
				this.shiftRow(true);
			}
			else if(G_V.dragMoveOffsetAfterUpdateGridPo.y<-G_V.iImgHeight){
				G_V.dragMoveOffsetAfterUpdateGridPo.y+=G_V.iImgHeight;
				this.shiftRow(false);
			}
			else{
				break;
			}
		}
	};
	this.shiftColumn=function(prepend){
		var curImgTileNums=[];
		var sign=1;
		if(prepend==true){
			G_V.firstImgTitleNums.col-=1;
			curImgTileNums={
				row:G_V.firstImgTitleNums.row,col:G_V.firstImgTitleNums.col
			};
			sign=1;
		}
		else{
			G_V.firstImgTitleNums.col+=1;
			curImgTileNums={
				row:G_V.firstImgTitleNums.row,col:G_V.firstImgTitleNums.col+this.minCols-1
			};
			sign=1;
		};
		for(var i=0;i<this.minRows;i++){
			var row;
			if(this.curShowImgGridNum==1){
				row=this.arrImgGrid1[i];
			}
			else{
				row=this.arrImgGrid2[i];
			};
			var imgTile=row[prepend?'pop':'shift']();
			curImgTileNums.row+=i>0?sign*1:0;
			i8(curImgTileNums.row,curImgTileNums.col,G_V.iCurScale,imgTile);
			imgTile.draw();
			row[prepend?'unshift':'push'](imgTile);
		}
	};
	this.shiftRow=function(prepend){
		var curImgTileNums=[];
		var row=[];
		if(prepend==true){
			G_V.firstImgTitleNums.row-=1;
			curImgTileNums={
				row:G_V.firstImgTitleNums.row,col:G_V.firstImgTitleNums.col
			};
			if(this.curShowImgGridNum==1){
				row=this.arrImgGrid1['pop']();
			}
			else{
				row=this.arrImgGrid2['pop']();
			}
		}
		else{
			G_V.firstImgTitleNums.row+=1;
			curImgTileNums={
				row:G_V.firstImgTitleNums.row+this.minRows-1,col:G_V.firstImgTitleNums.col
			};
			if(this.curShowImgGridNum==1){
				row=this.arrImgGrid1['shift']();
			}
			else{
				row=this.arrImgGrid2['shift']();
			}
		};
		for(var i=0,len=row.length;i<len;i++){
			var imgTile=row[i];
			curImgTileNums.col+=i>0?1:0;
			i8(curImgTileNums.row,curImgTileNums.col,G_V.iCurScale,imgTile);
			imgTile.draw();
		};
		if(this.curShowImgGridNum==1){
			this.arrImgGrid1[prepend?'unshift':'push'](row);
		}
		else{
			this.arrImgGrid2[prepend?'unshift':'push'](row);
		}
	};
	this.DrawAllGridImgToCanvas=function(canvas2D,offsetScrnPo){
		var bResult=false;
		if(canvas2D){
			var left=0;
			var top=0;
			if(offsetScrnPo){
				left=offsetScrnPo.x;
				top=offsetScrnPo.y;
			};
			for(var r=0;r<this.minRows;r++){
				if(this.curShowImgGridNum==1){
					if(!this.arrImgGrid1[r]){
						continue;
					}
				}
				else{
					if(!this.arrImgGrid2[r]){
						continue;
					}
				};
				for(var c=0;c<this.minCols;c++){
					var curTitleImg;
					if(this.curShowImgGridNum==1){
						curTitleImg=this.arrImgGrid1[r][c];
					}
					else{
						curTitleImg=this.arrImgGrid2[r][c];
					};
					if(curTitleImg.img.complete==true){
						var drawScrnX=curTitleImg.x+G_V.dragMapLayerOriginPo.x-left;
						var drawScrnY=curTitleImg.y+G_V.dragMapLayerOriginPo.y-top;
						g_objHtml5DrawClass.DrawImgObj(canvas2D,curTitleImg.img,drawScrnX,drawScrnY);
					}
				}
			};
			bResult=true;
		};
		return bResult;
	}
};
function b8(){
	this.iLineSize=1;
	this.strLineColor="#000000";
	this.iLineOpacity=50;
	this.strFontColor="#FF0000";
	this.strFontSize="12px 宋体";
	this.iFontOpacity=90;
	this.bSetLineDash=true;
	this.iLineDashLen=3;
	this.iLineDashSpaceLen=3;
	this.arrStepInfo=[{
		scale:100000000,step:3000
	}
	,{
		scale:50000000,step:1500
	}
	,{
		scale:20000000,step:900
	}
	,{
		scale:12800000,step:480
	}
	,{
		scale:6400000,step:240
	}
	,{
		scale:3200000,step:120
	}
	,{
		scale:1600000,step:60
	}
	,{
		scale:800000,step:30
	}
	,{
		scale:400000,step:15
	}
	,{
		scale:200000,step:10
	}
	,{
		scale:100000,step:4
	}
	,{
		scale:50000,step:2
	}
	,{
		scale:20000,step:1
	}
	,{
		scale:10000,step:0.5
	}
	,{
		scale:5000,step:0.3
	}
	,{
		scale:2000,step:0.12
	}
	,{
		scale:1000,step:0.08
	}
	,{
		scale:0,step:0.04
	}
	];
};
function b9(){
	this.id=0;
	this.name="";
	this.iGeoX=0;
	this.iGeoY=0;
	this.heightGeo=0;
	this.widthGeo=0;
	this.iButtomGeoX=0;
	this.iButtomGeoY=0;
	this.bShowOrNot=true
};
function c0(){
	this.m_arrFishAreaObj=[];
	this.m_curFillStyle={
		bFill:false,fillColor:"#FF0000",iOpacity:10
	};
	this.m_curBigBoxStyle={
		borderWith:1,borderColor:"#000000",iOpacity:30
	};
	this.m_iStartShowBoxScale=50000000;
	this.m_iStartShowSmallBoxScale=1000000;
	this.m_bShowFishAreaBox=false;
	this.m_curNameStyle={
		strFont:"15px Courier New",color:"#FF0000",iOpacity:70
	};
	this.m_curHighLightStyle={
		fillColor:"#FF0000",iOpacity:60
	};
	this.m_iHighLightFishAreaPos=-1;
	this.m_iHighLightFishAreaSmallNum=-1;
	this.SetCurHighLightObjectStyle=function(objStyle){
		if(objStyle){
			if(this.m_curHighLightStyle==null){
				this.m_curHighLightStyle=[];
			};
			if(objStyle.borderWith){
				this.m_curHighLightStyle.borderWith=objStyle.borderWith;
			};
			if(objStyle.borderColor){
				this.m_curHighLightStyle.borderColor=objStyle.borderColor;
			};
			if(objStyle.iOpacity){
				this.m_curHighLightStyle.iOpacity=objStyle.iOpacity;
			};
			if(objStyle.fillColor){
				this.m_curHighLightStyle.fillColor=objStyle.fillColor;
			}
		}
	};
	this.AddNewFishAreaObj=function(_id,_name,_lon,_lat,_height,_width){
		if(isNaN(_id)||isNaN(_lon)||isNaN(_lat)||isNaN(_height)||isNaN(_width)){
			return false;
		};
		var curFishArea=new b9();
		curFishArea.id=_id;
		curFishArea.name=_name;
		curFishArea.iGeoX=parseInt(_lon*10000000);
		curFishArea.iGeoY=parseInt(_lat*10000000);
		curFishArea.heightGeo=parseInt(_height*10000000);
		curFishArea.widthGeo=parseInt(_width*10000000);
		curFishArea.iButtomGeoX=curFishArea.iGeoX+curFishArea.widthGeo;
		curFishArea.iButtomGeoY=curFishArea.iGeoY+curFishArea.heightGeo;
		curFishArea.bShowOrNot=true;
		this.m_arrFishAreaObj.push(curFishArea);
		return true;
	};
	this.SelectFishAreaByGeoPo=function(iGeoX,iGeoY){
		var curFishAreaInfo=null;
		var iFishAreaCount=this.m_arrFishAreaObj.length;
		var strBigFishAreaNum="";
		var iSmallFishAreaNum=0;
		for(var pos=0;pos<iFishAreaCount;pos++){
			var minGeoX=this.m_arrFishAreaObj[pos].iGeoX;
			var maxGeoX=this.m_arrFishAreaObj[pos].iGeoX+parseInt(this.m_arrFishAreaObj[pos].widthGeo);
			var minGeoY=this.m_arrFishAreaObj[pos].iGeoY;
			var maxGeoY=this.m_arrFishAreaObj[pos].iGeoY+parseInt(this.m_arrFishAreaObj[pos].heightGeo);
			if(iGeoX<minGeoX||iGeoX>maxGeoX||iGeoY<minGeoY||iGeoY>maxGeoY){
				continue;
			};
			strBigFishAreaNum=this.m_arrFishAreaObj[pos].name;
			var iSmallRow=0;
			var iSmallCol=0;
			var smallAreaWidthGeo=parseFloat(this.m_arrFishAreaObj[pos].widthGeo)/3;
			var smallAreaHeightGeo=parseFloat(this.m_arrFishAreaObj[pos].heightGeo)/3;
			var startGeoX=minGeoX;
			var startGeoY=minGeoY;
			for(var i=0;i<3;i++){
				if(iGeoX<startGeoX+parseFloat(smallAreaWidthGeo)){
					iSmallCol=i;
					break;
				};
				startGeoX=startGeoX+parseFloat(smallAreaWidthGeo);
			};
			for(var i=0;i<3;i++){
				if(iGeoY<startGeoY+parseFloat(smallAreaHeightGeo)){
					iSmallRow=2-i;
					break;
				};
				startGeoY=startGeoY+parseFloat(smallAreaHeightGeo);
			};
			iSmallFishAreaNum=parseInt(iSmallRow*3)+parseInt(iSmallCol)+parseInt(1);
			curFishAreaInfo={
				id:this.m_arrFishAreaObj[pos].id,name:strBigFishAreaNum,num:iSmallFishAreaNum
			};
			break
		};
		return curFishAreaInfo;
	};
	this.GetFishAreaInfoByName=function(strName){
		var curFishAreaInfo=null;
		if(strName!=undefined&&strName!=null&&strName!=""){
			var iFishAreaCount=this.m_arrFishAreaObj.length;
			for(var pos=0;pos<iFishAreaCount;pos++){
				if(this.m_arrFishAreaObj[pos].name==strName){
					curFishAreaInfo=this.m_arrFishAreaObj[pos];
					curFishAreaInfo.pos=pos;
					break;
				}
			}
		};
		return curFishAreaInfo;
	};
	this.DelFishAreaInfoByName=function(strName){
		var bResult=false;
		if(strName!=undefined&&strName!=null&&strName!=""){
			var iFishAreaCount=this.m_arrFishAreaObj.length;
			for(var pos=0;pos<iFishAreaCount;pos++){
				if(this.m_arrFishAreaObj[pos].name==strName){
					this.m_arrFishAreaObj.splice(pos,1);
					bResult=true;
					break;
				}
			}
		};
		return bResult;
	};
	this.SetFishAreaShowOrNotByName=function(strName,bShowOrNot){
		var bResult=false;
		if(strName!=undefined&&strName!=null&&strName!=""){
			var iFishAreaCount=this.m_arrFishAreaObj.length;
			for(var pos=0;pos<iFishAreaCount;pos++){
				if(this.m_arrFishAreaObj[pos].name==strName){
					this.m_arrFishAreaObj[pos].bShowOrNot=bShowOrNot;
					bResult=true;
					break;
				}
			}
		};
		return bResult;
	}
};
function c1(){
	this.lon;
	this.lat;
	this.x;
	this.y;
	this.value;
};
function c2(){
	this.strDivName="Map_viewDrawHeatmapDivId";
	this.arrHeatmapInfo=[];
	this.heatmapInstance=null;
	this.initHeatmap=function(){
		try{
			this.heatmapInstance=h337.create({
				container:document.querySelector("#"+this.strDivName),radius:10,opacity:0.5
			});
		}
		catch(e){
			this.heatmapInstance=null;
		}
	};
	this.AddHeatmapValue=function(arrValue){
		var iCount=arrValue.length;
		for(var i=0;i<iCount;i++){
			var value=arrValue[i].value;
			var planeMultiPo=k1(arrValue[i].lon,arrValue[i].lat);
			var curHeatmapValue=[];
			curHeatmapValue.lon=arrValue[i].lon;
			curHeatmapValue.lat=arrValue[i].lat;
			curHeatmapValue.value=arrValue[i].value;
			curHeatmapValue.x=planeMultiPo.x;
			curHeatmapValue.y=planeMultiPo.y;
			this.arrHeatmapInfo.push(curHeatmapValue);
		}
	};
	this.ClaerHeatmapValue=function(){
		this.arrHeatmapInfo=null;
		this.arrHeatmapInfo=[];
	}
};
function c3(){
	this.type=LAYER_TYPE.point;
	this.id=-1;
	this.name="";
	this.arrStyle=[];
	this.bShow=true;
	this.arrObjInfo=[];
	this.arrExpAttrValue=[];
	this.minShowScale=1;
	this.maxShowScale=90000000;
	this.bShowTextOrNot=true;
	this.iStartShowTextScale=640000;
	this.bDrawOnShipCanves=false;
	this.SetLayerInfo=function(id,type,name,bShow,minShowScale,maxShowScale,bShowTextOrNot,iStartShowTextScale){
		this.type=type;
		this.id=id;
		this.name=name;
		this.bShow=bShow;
		if(minShowScale!=undefined&&minShowScale!=null){
			this.minShowScale=minShowScale;
		};
		if(maxShowScale!=undefined&&maxShowScale!=null){
			this.maxShowScale=maxShowScale;
		};
		if(bShowTextOrNot!=undefined&&bShowTextOrNot!=null){
			this.bShowTextOrNot=bShowTextOrNot;
		};
		if(iStartShowTextScale!=undefined&&iStartShowTextScale!=null){
			this.iStartShowTextScale=iStartShowTextScale;
		}
	};
	this.DelObjectByPos=function(iObjPos){
		var bResult=false;
		if(this.arrObjInfo.length>iObjPos&&iObjPos>-1){
			this.arrObjInfo.splice(iObjPos,1);
			bResult=true;
		};
		return bResult;
	};
	this.SetExpAttrValueByPos=function(iPos,strValue){
		if(iPos<0){
			return false;
		};
		var iLen=this.arrExpAttrValue.length;
		if(parseInt(iLen)<parseInt(iPos)){
			for(var num=parseInt(iLen);
			num<parseInt(iPos);
			num++){
				this.arrExpAttrValue.push(null);
			};
			this.arrExpAttrValue.push(strValue);
		}
		else{
			this.arrExpAttrValue[iPos]=strValue;
		};
		return true;
	};
	this.GetExpAttrValueByPos=function(iPos){
		if(iPos<0){
			return null;
		};
		var iLen=this.arrExpAttrValue.length;
		if(parseInt(iLen)<parseInt(iPos)){
			return null;
		}
		else{
			var strValue=this.arrExpAttrValue[iPos];
			return strValue;
		}
	};
	this.SetAllExpAttrValue=function(arrExpAttrValue){
		if(arrExpAttrValue!=null){
			if(parseInt(arrExpAttrValue.length)>0){
				this.arrExpAttrValue=null;
				this.arrExpAttrValue=arrExpAttrValue;
				return true;
			}
		};
		return false
	};
	this.GetAllExpAttrValue=function(){
		return this.arrExpAttrValue;
	};
	this.GetObjectPosById=function(objId){
		var iObjCount=this.arrObjInfo.length;
		var curPos=-1;
		for(var iPos=0;iPos<iObjCount;iPos++){
			if(this.arrObjInfo[iPos].id==objId){
				curPos=iPos;
				break;
			}
		};
		return curPos;
	}
};
function c4(){
	this.bFilled=false;
	this.fillColor="#000000";
	this.iOpacity=80;
	this.borderWith=1;
	this.borderColor="#FFFFFF";
	this.iLineOpacity=80;
	this.bShowImg=false;
	this.ratation=0;
	this.arrSymbolPo=[];
	this.iCircleScrnR=0;
	this.strImgSrc=G_V.strSdkFilePath+"img/point.png";
	this.iImgWidth=20;
	this.iImgHeight=24;
	this.textColor="#49495d";
	this.fontSize="12px 宋体";
	this.iTextOpacity=80;
	this.bShowText=true;
	this.img=null;
	this.iCheckDrawMinNearOtherLen=5;
	this.offsetScrnPo=null;
	this.checkImg=function(){
		if(this.img==null){
			this.img=new Image();
			this.img.src=this.strImgSrc;
		}
	};
	this.SetPointObjRotation=function(fRatation){
		this.ratation=fRatation;
	};
	this.SetPointObjSymbolPo=function(arrPo){
		this.arrSymbolPo=arrPo;
	};
	this.SetObjStyleInfo=function(borderWith,borderColor,bFilled,fillColor,iOpacity,bShowImg,strImgSrc,iImgWidth,iImgHeight,bShowText,textColor,fontSize,iTextOpacity,iCheckDrawMinNearOtherLen,iLineOpacity,offsetPo){
		if(borderWith!=null){
			this.borderWith=borderWith;
		};
		if(borderColor!=null){
			this.borderColor=borderColor;
		};
		if(bFilled!=null){
			this.bFilled=bFilled;
		};
		if(fillColor!=null){
			this.fillColor=fillColor;
		};
		if(iOpacity!=null){
			this.iOpacity=iOpacity;
		};
		if(bShowImg!=null){
			this.bShowImg=bShowImg;
			if(bShowImg==true){
				this.img=new Image();
				this.img.src=strImgSrc;
			};
			if(strImgSrc!=null&&strImgSrc!=""){
				this.strImgSrc=strImgSrc;
				if(this.img==null){
					this.img=new Image();
				};
				this.img.src=strImgSrc;
			}
		};
		if(iImgWidth!=null){
			this.iImgWidth=iImgWidth;
		};
		if(iImgHeight!=null){
			this.iImgHeight=iImgHeight;
		};
		if(bShowText!=null){
			this.bShowText=bShowText;
		};
		if(textColor!=null){
			this.textColor=textColor;
		};
		if(fontSize!=null){
			this.fontSize=fontSize;
		};
		if(iTextOpacity!=null){
			this.iTextOpacity=iTextOpacity;
		};
		if(iCheckDrawMinNearOtherLen!=null){
			this.iCheckDrawMinNearOtherLen=iCheckDrawMinNearOtherLen;
		};
		if(iLineOpacity!=null){
			this.iLineOpacity=iLineOpacity;
		};
		if(offsetPo!=undefined&&offsetPo!=null){
			this.offsetScrnPo={
				x:offsetPo.x,y:offsetPo.y
			};
		}
	}
};
function c5(){
	this.arrLayerInfo=[];
	this.arrCurScrnShowObjPos=[];
	this.m_curHighLightObjIds=null;
	this.m_curHighLightStyle={
		borderWith:3,borderColor:"#FF0F0F",iOpacity:70,fillColor:"#FF0000"
	};
	this.API_SetLayerObjectDrawTopToShipByPos=function(iLayerPos,bTopOrNot){
		var bResult=false;
		if(this.arrLayerInfo.length>iLayerPos&&iLayerPos>-1){
			this.arrLayerInfo[iLayerPos].bDrawOnShipCanves=bTopOrNot;
			bResult=true;
		};
		return bResult;
	};
	this.SetCurHighLightObjectStyle=function(objStyle){
		if(objStyle){
			if(this.m_curHighLightStyle==null){
				this.m_curHighLightStyle=[];
			};
			if(objStyle.borderWith){
				this.m_curHighLightStyle.borderWith=objStyle.borderWith;
			};
			if(objStyle.borderColor){
				this.m_curHighLightStyle.borderColor=objStyle.borderColor;
			};
			if(objStyle.iOpacity){
				this.m_curHighLightStyle.iOpacity=objStyle.iOpacity;
			};
			if(objStyle.fillColor){
				this.m_curHighLightStyle.fillColor=objStyle.fillColor;
			}
		}
	};
	this.SetCurHighLightObject=function(layerId,objId){
		if(layerId==-1||objId==-1){
			if(this.m_curHighLightObjIds){
				this.m_curHighLightObjIds=null;
				g_objDrawObjClass.ClearObjCanvas();
				g_objDrawObjClass.DrawAllObject();
			}
			else{
				this.m_curHighLightObjIds=null;
			}
		}
		else{
			this.m_curHighLightObjIds={
				layerId:layerId,objId:objId
			};
			g_objDrawObjClass.ClearObjCanvas();
			g_objDrawObjClass.DrawAllObject();
		};
		return true;
	};
	this.AddNewLayer=function(id,type,name,bShow,minShowScale,maxShowScale,bShowTextOrNot,iStartShowTextScale){
		var curLayer=new c3();
		curLayer.SetLayerInfo(id,type,name,bShow,minShowScale,maxShowScale,bShowTextOrNot,iStartShowTextScale);
		this.arrLayerInfo.push(curLayer);
		var pos=this.arrLayerInfo.length-1;
		return pos;
	};
	this.DelLayerByPos=function(iLayerPos){
		var bResult=false;
		if(this.arrLayerInfo.length>iLayerPos&&iLayerPos>-1){
			this.arrLayerInfo.splice(iLayerPos,1);
			bResult=true;
		};
		return bResult;
	};
	this.GetLayerPosById=function(iLayerId){
		var iLayerCount=this.arrLayerInfo.length;
		var curPos=-1;
		for(var iPos=0;iPos<iLayerCount;iPos++){
			if(this.arrLayerInfo[iPos].id==iLayerId){
				curPos=iPos;
				break;
			}
		};
		return curPos;
	};
	this.GetLayerInfoByPos=function(iLayerPos){
		if(this.arrLayerInfo.length>iLayerPos&&iLayerPos>-1){
			return this.arrLayerInfo[iLayerPos];
		}
		else{
			return null;
		}
	};
	this.GetObjectPosById=function(iObjId,iLayerPos){
		var iObjPos=-1;
		var iLayerCount=this.arrLayerInfo.length;
		if(iLayerPos&&iLayerCount>iLayerPos&&iLayerPos>-1){
			iObjPos=this.arrLayerInfo[iLayerPos].GetObjectPosById(iObjId);
		}
		else{
			for(var i=0;i<iLayerCount;i++){
				var iCurPos=this.arrLayerInfo[i].GetObjectPosById(iObjId);
				if(iCurPos>-1){
					iObjPos=iCurPos;
					iLayerPos=i;
					break;
				}
			}
		};
		var objPos=null;
		if(iObjPos>-1){
			objPos={
				iLayerPos:iLayerPos,iObjPos:iObjPos
			};
		};
		return objPos;
	};
	this.GetObjectInfoByPos=function(iLayerPos,iObjPos){
		var objInfo=null;
		if(this.arrLayerInfo.length>iLayerPos){
			if(this.arrLayerInfo[iLayerPos].arrObjInfo.length>iObjPos){
				objInfo=this.arrLayerInfo[iLayerPos].arrObjInfo[iObjPos];
			}
		};
		return objInfo;
	};
	this.GetObjectGeoInfoByPos=function(iLayerPos,iObjPos){
		if(this.arrLayerInfo.length>iLayerPos){
			if(this.arrLayerInfo[iLayerPos].arrObjInfo.length>iObjPos){
				return this.arrLayerInfo[iLayerPos].arrObjInfo[iObjPos].arrGeoPo;
			}
		};
		return[];
	};
	this.SetLayerAllExpAttrByPos=function(iLayerPos,arrAllExpAttr){
		var bResult=false;
		if(this.arrLayerInfo.length>iLayerPos&&iLayerPos>-1&&arrAllExpAttr){
			this.arrLayerInfo[layerPos].SetAllExpAttrValue(arrAllExpAttr);
			bResult=true;
		};
		return bResult;
	};
	this.GetLayerOneExpAttrByPos=function(iLayerPos,iExpAttrPos,strExpAttrValue){
		var bResult=false;
		if(this.arrLayerInfo.length>layerPos&&iLayerPos>-1){
			curExpAttr=this.arrLayerInfo[layerPos].SetExpAttrValueByPos(iExpAttrPos,strExpAttrValue);
		};
		return bResult;
	};
	this.SetLayerOneExpAttrByPos=function(iLayerPos,iExpAttrPos){
		var curExpAttr=null;
		if(this.arrLayerInfo.length>layerPos&&iLayerPos>-1){
			curExpAttr=this.arrLayerInfo[layerPos].GetExpAttrValueByPos(iExpAttrPos);
		};
		return curExpAttr;
	};
	this.GetLayerAllExpAttrByPos=function(iLayerPos){
		var arrAllExpAttr=null;
		if(this.arrLayerInfo.length>layerPos&&iLayerPos>-1){
			arrAllExpAttr=this.arrLayerInfo[layerPos].GetAllExpAttrValue();
		};
		return arrAllExpAttr;
	};
	this.SetLayerExpAttrValueByPos=function(layerPos,arrExpAttrValue){
		var bResult=false;
		if(this.arrLayerInfo.length>layerPos){
			this.arrLayerInfo[layerPos].SetAllExpAttrValue(arrExpAttrValue);
			bResult=true;
		};
		return bResult;
	};
	this.AddLayerStyleByPos=function(layerPos,borderWith,borderColor,bFilled,fillColor,iOpacity,bShowImg,strImgSrc,iImgWidth,iImgHeight,bShowText,textColor,fontSize,iTextOpacity,iCheckDrawMinNearOtherLen,iLineOpacity,offsetPo){
		var iStylePos=-1;
		if(this.arrLayerInfo.length>layerPos){
			var curObjStyle=new c4();
			curObjStyle.SetObjStyleInfo(borderWith,borderColor,bFilled,fillColor,iOpacity,bShowImg,strImgSrc,iImgWidth,iImgHeight,bShowText,textColor,fontSize,iTextOpacity,iCheckDrawMinNearOtherLen,iLineOpacity,offsetPo);
			this.arrLayerInfo[layerPos].arrStyle.push(curObjStyle);
			iStylePos=this.arrLayerInfo[layerPos].arrStyle.length-1;
		};
		return iStylePos;
	};
	this.SetPointObjSybolPo=function(layerPos,iStylePos,arrSymbolPo,iCircleScrnR,bShowImg){
		if(this.arrLayerInfo.length>layerPos){
			if(this.arrLayerInfo[layerPos].arrStyle.length>iStylePos){
				this.arrLayerInfo[layerPos].arrStyle[iStylePos].bShowImg=bShowImg;
				this.arrLayerInfo[layerPos].arrStyle[iStylePos].arrSymbolPo=arrSymbolPo;
				this.arrLayerInfo[layerPos].arrStyle[iStylePos].iCircleScrnR=iCircleScrnR;
				return true;
			}
		};
		return false;
	};
	this.AddNewObject=function(layerPos,objType,objId,name,showText,layerStylePos,arrGeoPoints,arrExpAttrValue){
		var iObjPos=-1;
		if(this.arrLayerInfo.length>layerPos){
			var curObj=new c6();
			curObj.SetObjectInfo(objType,objId,name,showText,layerStylePos,arrGeoPoints,arrExpAttrValue);
			this.arrLayerInfo[layerPos].arrObjInfo.push(curObj);
			iObjPos=this.arrLayerInfo[layerPos].arrObjInfo.length-1;
		};
		return iObjPos;
	};
	this.SetRectObjSize=function(layerPos,iObjPos,w,h){
		var bResult=false;
		if(this.arrLayerInfo.length>layerPos){
			if(this.arrLayerInfo[layerPos].arrObjInfo.length>iObjPos){
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].rectW=w;
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].rectH=h;
				var curGeoPo=this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[0];
				var hmW=w*0.5399568;
				var hmH=h*0.5399568;
				var buttonGeo1=l9(curGeoPo,hmW,90);
				var buttonGeo2=l9(curGeoPo,hmH,180);
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[1]={
					x:buttonGeo1.x,y:curGeoPo.y
				};
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[2]={
					x:curGeoPo.x,y:buttonGeo2.y
				};
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].minGeoX=this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[0].x;
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].maxGeoX=this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[1].x;
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].minGeoY=this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[2].y;
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].maxGeoY=this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[0].y;
				bResult=true;
			}
		};
		return bResult;
	};
	this.SetRectObjGeoPo=function(layerPos,iObjPos,minGeoX,maxGeoX,minGeoY,maxGeoY){
		var bResult=false;
		if(this.arrLayerInfo.length>layerPos){
			if(this.arrLayerInfo[layerPos].arrObjInfo.length>iObjPos){
				var minLon=parseFloat(minGeoX/G_V.UNI_GEO_COOR_MULTI_FACTOR);
				var minLat=parseFloat(minGeoY/G_V.UNI_GEO_COOR_MULTI_FACTOR);
				var maxLon=parseFloat(maxGeoX/G_V.UNI_GEO_COOR_MULTI_FACTOR);
				var maxLat=parseFloat(maxGeoY/G_V.UNI_GEO_COOR_MULTI_FACTOR);
				var w=k9(minLon,maxLat,maxLon,maxLat);
				var h=k9(minLon,maxLat,minLon,minLat);
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].rectW=w;
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].rectH=h;
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[0]={
					x:minGeoX,y:maxGeoY
				};
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[1]={
					x:maxGeoX,y:maxGeoY
				};
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[2]={
					x:minGeoX,y:minGeoY
				};
				bResult=true;
			}
		};
		return bResult;
	};
	this.SetCircleObjRlen=function(layerPos,iObjPos,rr){
		var bResult=false;
		if(this.arrLayerInfo.length>layerPos){
			if(this.arrLayerInfo[layerPos].arrObjInfo.length>iObjPos){
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].circleR=rr;
				var hmR=rr*0.5399568;
				var curGeoPo=this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[0];
				var buttonGeo1=l9(curGeoPo,hmR,90);
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[1]={
					x:buttonGeo1.x,y:curGeoPo.y
				};
				bResult=true;
			}
		};
		return bResult;
	};
	this.SelectCurScrnShowObjectInfoByScrnPo=function(curSelCheckScrnPo,bGetAll){
		var selScrnPo={
			x:curSelCheckScrnPo.x-G_V.dragMapLayerOriginPo.x,y:curSelCheckScrnPo.y-G_V.dragMapLayerOriginPo.y
		};
		var arrObjInfo=null;
		var iShowObjCount=parseInt(this.arrCurScrnShowObjPos.length);
		var selLayerId=-1;
		var selObjId=-1;
		var objType=-1;
		if(iShowObjCount>0){
			var bSelObj=false;
			for(var i=0;i<iShowObjCount;i++){
				var objIDs=this.arrCurScrnShowObjPos[i];
				var layerPos=this.GetLayerPosById(objIDs.layerId);
				var curObjPosInfo=this.GetObjectPosById(objIDs.objId,layerPos);
				if(curObjPosInfo==null){
					continue;
				};
				var curObjInfo=this.GetObjectInfoByPos(curObjPosInfo.iLayerPos,curObjPosInfo.iObjPos);
				switch(this.arrLayerInfo[layerPos].type){
					case LAYER_TYPE.point:{
						objType=LAYER_TYPE.point;
						var curObjStyle=null;
						if(curObjInfo.bGetOwnStyle==true){
							curObjStyle=curObjInfo.style;
						}
						else{
							var iStylePos=curObjInfo.layerStylePos;
							if(iStylePos-1<parseInt(this.arrLayerInfo[layerPos].arrStyle.length)){
								curObjStyle=g_objManObjClass.arrLayerInfo[layerPos].arrStyle[iStylePos];
							}
						};
						if(curObjStyle==null){
							continue;
						};
						if(curObjStyle.iCircleScrnR!=null&&parseInt(curObjStyle.iCircleScrnR)>0){
							var scrnPo=k3(curObjInfo.arrGeoPo[0].x,curObjInfo.arrGeoPo[0].y,G_V.iCurScale);
							if(Math.abs(scrnPo.x-curSelCheckScrnPo.x)<parseInt(curObjStyle.iCircleScrnR-3)&&Math.abs(scrnPo.y-curSelCheckScrnPo.y)<parseInt(curObjStyle.iCircleScrnR-3)){
								selLayerId=objIDs.layerId;
								selObjId=objIDs.objId;
								bSelObj=true;
							}
						}
						else if(curObjStyle.arrSymbolPo!=null&&parseInt(curObjStyle.arrSymbolPo.length)>0){
							var iSymbolPoCount=curObjStyle.arrSymbolPo.length;
							if(iSymbolPoCount<2){
								continue;
							};
							var scrnPo=k3(curObjInfo.arrGeoPo[0].x,curObjInfo.arrGeoPo[0].y,G_V.iCurScale);
							var arrSymbolPo=[];
							var minScrnPo={
								x:0,y:0
							};
							var maxScrnPo={
								x:0,y:0
							};
							for(var po=0;po<iSymbolPoCount;po++){
								var curSymbolPo={
									x:parseInt(curObjStyle.arrSymbolPo[po].x)+parseInt(scrnPo.x),y:parseInt(curObjStyle.arrSymbolPo[po].y)+parseInt(scrnPo.y)
								};
								if(po==0){
									minScrnPo.x=curSymbolPo.x;
									minScrnPo.y=curSymbolPo.y;
									maxScrnPo.x=curSymbolPo.x;
									maxScrnPo.y=curSymbolPo.y;
								}
								else{
									if(minScrnPo.x>curSymbolPo.x){
										minScrnPo.x=curSymbolPo.x;
									};
									if(minScrnPo.y>curSymbolPo.y){
										minScrnPo.y=curSymbolPo.y;
									};
									if(maxScrnPo.x<curSymbolPo.x){
										maxScrnPo.x=curSymbolPo.x;
									};
									if(maxScrnPo.y<curSymbolPo.y){
										maxScrnPo.y=curSymbolPo.y;
									}
								};
								arrSymbolPo.push(curSymbolPo);
							};
							var bSelResult=false;
							if(iSymbolPoCount==2){
								bSelResult=l5(selScrnPo,arrSymbolPo,5);
							}
							else{
								bSelResult=l7(selScrnPo.x,selScrnPo.y,arrSymbolPo,minScrnPo.x,maxScrnPo.x,minScrnPo.y,maxScrnPo.y);
							};
							if(bSelResult){
								selLayerId=objIDs.layerId;
								selObjId=objIDs.objId;
								bSelObj=true;
							}
						}
						else{
							if(bGetAll==true){
								var imgSizeX=parseInt(curObjStyle.iImgWidth);
								var imgSizeY=parseInt(curObjStyle.iImgHeight);
								var arrScrnPo=a3(curObjInfo.arrGeoPo,true);
								var scrnPo={
									x:arrScrnPo[0].x-imgSizeX/ 2 + 2, y: arrScrnPo[0].y - imgSizeY /2+2
								};
								var checkScrnPo={
									x:curSelCheckScrnPo.x-G_V.drawObjCanvasPo.x,y:curSelCheckScrnPo.y-G_V.drawObjCanvasPo.y
								};
								if(scrnPo.x-checkScrnPo.x>-imgSizeX&&scrnPo.x-checkScrnPo.x<0&&scrnPo.y-checkScrnPo.y>-imgSizeY&&scrnPo.y-checkScrnPo.y<0){
									selLayerId=objIDs.layerId;
									selObjId=objIDs.objId;
									bSelObj=true;
								}
							}
							else{
								var selObj=g_objDrawObjClass.SelectScrnPointObjInfo(curSelCheckScrnPo);
								if(selObj){
									selLayerId=selObj.layerId;
									selObjId=selObj.objId;
									bSelObj=true;
								}
							}
						};
						break;
					};
					case LAYER_TYPE.line:{
						objType=LAYER_TYPE.line;
						var arrLinePos=[];
						var iPoCount=curObjInfo.arrGeoPo.length;
						for(var iPoPos=0;iPoPos<iPoCount;iPoPos++){
							var scrnPo=k3(curObjInfo.arrGeoPo[iPoPos].x,curObjInfo.arrGeoPo[iPoPos].y,G_V.iCurScale);
							arrLinePos.push(scrnPo);
						};
						var bSelResult=l5(selScrnPo,arrLinePos,5);
						if(bSelResult==true){
							selLayerId=objIDs.layerId;
							selObjId=objIDs.objId;
							bSelObj=true;
						};
						break;
					};
					case LAYER_TYPE.face:{
						objType=LAYER_TYPE.face;
						if(curObjInfo==null){
							break;
						};
						if(curObjInfo.objType==4){
							objType=4;
							var rectW=curObjInfo.rectW*G_V.pxLenOfOneKmPo.x;
							var rectH=curObjInfo.rectH*G_V.pxLenOfOneKmPo.y;
							var rectScrnPo=k3(curObjInfo.arrGeoPo[0].x,curObjInfo.arrGeoPo[0].y,G_V.iCurScale);
							var iOffsetX=selScrnPo.x-rectScrnPo.x;
							var iOffsetY=selScrnPo.y-rectScrnPo.y;
							if(iOffsetX>0&&iOffsetX<rectW&&iOffsetY>0&&iOffsetY<rectH){
								selLayerId=objIDs.layerId;
								selObjId=objIDs.objId;
								bSelObj=true;
							}
						}
						else if(curObjInfo.objType==5){
							objType=5;
							var circleScrnR=parseInt(curObjInfo.circleR*G_V.pxLenOfOneKmPo.x);
							var circleScrnPo=k3(curObjInfo.arrGeoPo[0].x,curObjInfo.arrGeoPo[0].y,G_V.iCurScale);
							var len=l4(selScrnPo,circleScrnPo);
							if(len<circleScrnR){
								selLayerId=objIDs.layerId;
								selObjId=objIDs.objId;
								bSelObj=true;
							}
						}
						else if(curObjInfo.objType==10){
							objType=10;
							var circleScrnMinR=parseInt(curObjInfo.iSectorSmallCircleRKm*G_V.pxLenOfOneKmPo.x);
							var circleScrnMaxR=parseInt(curObjInfo.iSectorBigCircleRKm*G_V.pxLenOfOneKmPo.x);
							var circleScrnPo=k3(curObjInfo.arrGeoPo[0].x,curObjInfo.arrGeoPo[0].y,G_V.iCurScale);
							var len=l4(selScrnPo,circleScrnPo);
							if(len<circleScrnMaxR&&len>circleScrnMinR){
								var newScrnPoX=parseInt(selScrnPo.x-circleScrnPo.x);
								var newScrnPoY=parseInt(circleScrnPo.y-selScrnPo.y);
								var aa1=g7(circleScrnPo.x,circleScrnPo.y,newScrnPoX,newScrnPoY);
								var aa2=g7(newScrnPoX,newScrnPoY,circleScrnPo.x,circleScrnPo.y);
								var radina=Math.atan2(newScrnPoY,newScrnPoX);
								var angle=Math.floor(180/ (Math.PI /radina));
								while(angle<0){
									angle+=360;
								};
								if(angle>curObjInfo.iSectorStartAngle&&angle<curObjInfo.iSectorEndAngle){
									selLayerId=objIDs.layerId;
									selObjId=objIDs.objId;
									bSelObj=true;
								}
							}
						}
						else{
							var arrPolygonselPos=[];
							var iPoCount=curObjInfo.arrGeoPo.length;
							for(var iPoPos=0;iPoPos<iPoCount;iPoPos++){
								var scrnPo=k3(curObjInfo.arrGeoPo[iPoPos].x,curObjInfo.arrGeoPo[iPoPos].y,G_V.iCurScale);
								arrPolygonselPos.push(scrnPo);
							};
							var minScrnPo=k3(curObjInfo.minGeoX,curObjInfo.maxGeoY,G_V.iCurScale);
							var maxScrnPo=k3(curObjInfo.maxGeoX,curObjInfo.minGeoY,G_V.iCurScale);
							var bSelResult=l7(selScrnPo.x,selScrnPo.y,arrPolygonselPos,minScrnPo.x,maxScrnPo.x,minScrnPo.y,maxScrnPo.y);
							if(bSelResult==true){
								selLayerId=objIDs.layerId;
								selObjId=objIDs.objId;
								bSelObj=true;
							}
						};
						break;
					}
				};
				if(bSelObj==true){
					if(arrObjInfo==null){
						arrObjInfo=[];
					};
					arrObjInfo.push({
						layerId:selLayerId,objId:selObjId,objType:objType
					});
					if(bGetAll==false){
						break;
					}
				}
			}
		};
		return arrObjInfo;
	};
	this.SetSectorObjInfoByPos=function(layerPos,iObjPos,iStartAngle,iEndAngle,iSmallCircleRKm,iBigCircleRKm){
		var bResult=false;
		if(this.arrLayerInfo.length>layerPos){
			if(this.arrLayerInfo[layerPos].arrObjInfo.length>iObjPos){
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].iSectorStartAngle=iStartAngle;
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].iSectorEndAngle=iEndAngle;
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].iSectorSmallCircleRKm=iSmallCircleRKm;
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].iSectorBigCircleRKm=iBigCircleRKm;
				var hmSmallR=iSmallCircleRKm*0.5399568;
				var hmBigR=iBigCircleRKm*0.5399568;
				var curGeoPo=this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[0];
				var buttonGeo1=l9(curGeoPo,hmSmallR,90);
				var buttonGeo2=l9(curGeoPo,hmBigR,90);
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[1]={
					x:buttonGeo1.x,y:curGeoPo.y
				};
				this.arrLayerInfo[layerPos].arrObjInfo[iObjPos].arrGeoPo[2]={
					x:buttonGeo2.x,y:curGeoPo.y
				};
				bResult=true;
			}
		};
		return bResult;
	}
};
function c6(){
	this.id=-1;
	this.objType=-1;
	this.name="";
	this.strShowText="";
	this.bShow=true;
	this.rectW=0;
	this.rectH=0;
	this.circleR=0;
	this.minGeoX=0;
	this.maxGeoX=0;
	this.minGeoY=0;
	this.maxGeoY=0;
	this.arrGeoPo=[];
	this.layerStylePos=0;
	this.bGetOwnStyle=false;
	this.style=null;
	this.arrExpAttrValue=[];
	this.rotationAngle=0;
	this.fLineAreaSizeM=0;
	this.bRectImg=false;
	this.strRectImgUrl="";
	this.rectImg=null;
	this.iRectMinScale=100;
	this.iRectMaxScale=100000000;
	this.iSectorStartAngle=0;
	this.iSectorEndAngle=0;
	this.iSectorSmallCircleRKm=0;
	this.iSectorBigCircleRKm=0;
	this.checkRectImg=function(){
		if(this.rectImg==null){
			this.rectImg=new Image();
			this.rectImg.src=strRectImgUrl;
		}
	};
	this.SetSectorObjInfo=function(iStartAngle,iEndAngle,iSmallCircleRM,iBigCircleRM){
		this.iSectorStartAngle=iStartAngle;
		this.iSectorEndAngle=iEndAngle;
		this.iSectorSmallCircleRM=iSmallCircleRM;
		this.iSectorBigCircleRM=iBigCircleRM;
	};
	this.SetPointObjRotation=function(fAngle){
		if(this.objType==1){
			this.rotationAngle=fAngle;
			return true;
		};
		return false;
	};
	this.SetObjectInfo=function(objType,objId,name,strShowText,layerStylePos,arrGeoPoints,arrExpAttrValue){
		if(objType!=null){
			this.objType=objType;
		};
		if(objId!=null){
			this.id=objId;
		};
		if(name!=null){
			this.name=name;
		};
		if(strShowText!=null){
			this.strShowText=strShowText;
		};
		if(layerStylePos!=null){
			this.layerStylePos=layerStylePos;
		};
		if(arrGeoPoints!=null){
			this.SetObjGeoPo(arrGeoPoints);
		};
		if(arrExpAttrValue!=null){
			this.arrExpAttrValue=arrExpAttrValue;
		}
	};
	this.SetObjectAllExpAttr=function(arrAllExpAttr){
		this.arrExpAttrValue=[];
		if(arrAllExpAttr){
			var iCount=arrAllExpAttr.length;
			for(var i=0;i<iExpCount;i++){
				this.arrExpAttrValue.push(arrAllExpAttr[i]);
			}
		}
	};
	this.GetObjectOneExpAttrByPos=function(iPos){
		var strValue=null;
		if(iPos>-1&&this.arrExpAttrValue.length>iPos){
			strValue=this.arrExpAttrValue[iPos];
		};
		return strValue;
	};
	this.SetObjectOneExpAttrByPos=function(iPos,strValue){
		if(iPos<0){
			return false;
		};
		var iLen=this.arrExpAttrValue.length;
		if(parseInt(iLen)<parseInt(iPos)){
			for(var num=parseInt(iLen);
			num<parseInt(iPos);
			num++){
				this.arrExpAttrValue.push(null);
			};
			this.arrExpAttrValue.push(strValue);
		}
		else{
			this.arrExpAttrValue[iPos]=strValue;
		};
		return true;
	};
	this.SetObjGeoPo=function(arrGeoPoints){
		if(arrGeoPoints){
			var iMaxGeoX=0;
			var iMinGeoX=0;
			var iMaxGeoY=0;
			var iMinGeoY=0;
			var bSetMaxMinValue=false;
			var iPoCount=arrGeoPoints.length;
			for(var i=0;i<iPoCount;i++){
				if(i==0){
					iMaxGeoX=arrGeoPoints[0].x;
					iMinGeoX=arrGeoPoints[0].x;
					iMaxGeoY=arrGeoPoints[0].y;
					iMinGeoY=arrGeoPoints[0].y;
				}
				else{
					if(iMaxGeoX<arrGeoPoints[i].x){
						iMaxGeoX=arrGeoPoints[i].x;
					}
					else if(iMinGeoX>arrGeoPoints[i].x){
						iMinGeoX=arrGeoPoints[i].x;
					};
					if(iMaxGeoY<arrGeoPoints[i].y){
						iMaxGeoY=arrGeoPoints[i].y;
					}
					else if(iMinGeoY>arrGeoPoints[i].y){
						iMinGeoY=arrGeoPoints[i].y;
					}
				}
			};
			this.maxGeoX=iMaxGeoX;
			this.minGeoX=iMinGeoX;
			this.maxGeoY=iMaxGeoY;
			this.minGeoY=iMinGeoY;
			this.arrGeoPo=arrGeoPoints;
		}
	}
};
function c7(){
	this.shipId=-1;
	this.shipMMSI="";
	this.shipName="";
	this.shipGeoPoX=0;
	this.shipGeoPoY=0;
	this.shipWidth=0;
	this.shipLength=0;
	this.shipSpeed=0;
	this.shipCourse=0;
	this.shipTime="";
	this.iShipState=-1;
	this.bOnlineOrNot=true;
	this.arrExpAttrValue=[];
	this.bShipShowOrNot=true;
	this.iNextPlayHistoryTrackPos=0;
	this.bEndPlayHistoryTrack=false;
	this.arrShipTrackPoints=new Array();
	this.bShowTrack=false;
	this.bGetOwnerTrackColor=false;
	this.strTrackColor="#FF0000";
	this.bGetOwnSymbol=false;
	this.symbolHeadPo=null;
	this.arrSymbolPo=null;
	this.bShowShipInfo=false;
	this.bGetOwnStyle=false;
	this.strFillColor="#FF00FF";
	this.iOpacity=100;
	this.strBorderColor="#000000";
	this.iBorderSize=2;
	this.bShowToTop=false;
	this.strShowBoxInfoText="";
	this.shipInfoDivObj=[];
	this.SetShipInfoDivObj=function(divObj,bMove){
		this.shipInfoDivObj=[];
		this.shipInfoDivObj.divObj=divObj;
		this.shipInfoDivObj.bMove=bMove;
		if(divObj){
			this.shipInfoDivObj.offsetScrnPo={
				x:30,y:-50
			};
		}
	};
	this.SetShipInfoDivOffset=function(offsetScrnPo){
		if(offsetScrnPo){
			this.shipInfoDivObj.offsetScrnPo=offsetScrnPo;
		}
	};
	this.GetShipInfoDivOffset=function(){
		return this.shipInfoDivObj.offsetScrnPo;
	};
	this.GetShipInfoDivObj=function(){
		return this.shipInfoDivObj.divObj;
	};
	this.SetShipUseOwnSymbolByShipPos=function(bUseOwnSymbol,arrSymbolPo){
		this.bGetOwnSymbol=bUseOwnSymbol;
		this.arrSymbolPo=arrSymbolPo;
		if(arrSymbolPo){
			var iSymbolPoCount=arrSymbolPo.length;
			var po1=null;
			var po2=null;
			for(var i=0;i<iSymbolPoCount;i++){
				if(i==0){
					po1=arrSymbolPo[0];
					continue;
				};
				if(po1.y<arrSymbolPo[i].y){
					continue;
				}
				else if(po1.y==arrSymbolPo[i].y){
					po2=arrSymbolPo[i];
				}
				else{
					po1=arrSymbolPo[i];
					po2=null;
				}
			};
			var curHeadPo=[];
			if(po1==null){
				curHeadPo.x=0;
				curHeadPo.y=0;
			}
			else if(po2==null){
				curHeadPo=po1;
			}
			else{
				curHeadPo.x=parseInt((po1.x+po2.x)/2);
				curHeadPo.y=po1.y;
			};
			this.symbolHeadPo=curHeadPo;
		}
	};
	this.GetShipInfoToArr=function(){
		var curShipInfo=[];
		curShipInfo.shipId=this.shipId;
		curShipInfo.shipMMSI=this.shipMMSI;
		curShipInfo.shipName=this.shipName;
		curShipInfo.shipGeoPoX=this.shipGeoPoX;
		curShipInfo.shipGeoPoY=this.shipGeoPoY;
		curShipInfo.shipWidth=this.shipWidth;
		curShipInfo.shipLength=this.shipLength;
		curShipInfo.shipSpeed=this.shipSpeed;
		curShipInfo.shipCourse=this.shipCourse;
		curShipInfo.shipTime=this.shipTime;
		curShipInfo.iShipState=this.iShipState;
		curShipInfo.bOnlineOrNot=this.bOnlineOrNot;
		curShipInfo.bShowTrack=this.bShowTrack;
		var iCheckShipId=-1;
		if(G_V.bIsPlayShipHistoryTrack==true){
			iCheckShipId=g_objManHistoryTrackClass.iCurFollowShipId;
		}
		else{
			iCheckShipId=g_objManShipClass.iCurFollowShipId;
		};
		curShipInfo.bFollow=(this.shipId==iCheckShipId?true:false);
		return curShipInfo;
	};
	this.SetShipInfo=function(id,name,mmsi,iGeoPoX,iGeoPoY,width,length,speed,course,shipTime,iShipState,bIsOnLine){
		this.shipId=id;
		this.shipName=name;
		this.shipMMSI=mmsi;
		this.shipGeoPoX=iGeoPoX;
		this.shipGeoPoY=iGeoPoY;
		this.shipWidth=width;
		this.shipLength=length;
		this.shipSpeed=speed;
		this.shipCourse=course;
		this.shipTime=shipTime;
		this.iShipState=iShipState;
		this.bOnlineOrNot=bIsOnLine;
	};
	this.UpdateShipDynamicInfo=function(iGeoPoX,iGeoPoY,speed,course,time,iShipState,bIsOnLine){
		this.shipGeoPoX=iGeoPoX;
		this.shipGeoPoY=iGeoPoY;
		this.shipSpeed=speed;
		this.shipCourse=course;
		this.shipTime=time;
		if(iShipState!=undefined&&iShipState!=null){
			this.iShipState=iShipState
		};
		this.bOnlineOrNot=bIsOnLine;
	};
	this.SetExpAttrValueByPos=function(iPos,strValue){
		if(iPos<0){
			return false;
		};
		var iLen=this.arrExpAttrValue.length;
		if(parseInt(iLen)<parseInt(iPos)){
			for(var num=parseInt(iLen);
			num<parseInt(iPos);
			num++){
				this.arrExpAttrValue.push(null);
			};
			this.arrExpAttrValue.push(strValue);
		}
		else{
			this.arrExpAttrValue[iPos]=strValue;
		};
		return true;
	};
	this.GetExpAttrValueByPos=function(iPos){
		if(iPos<0){
			return null;
		};
		var iLen=this.arrExpAttrValue.length;
		if(parseInt(iLen)<parseInt(iPos)){
			return null;
		}
		else{
			var strValue=this.arrExpAttrValue[iPos];
			return strValue;
		}
	};
	this.SetAllExpAttrValue=function(arrExpAttrValue){
		if(arrExpAttrValue!=null){
			if(parseInt(arrExpAttrValue.length)>0){
				this.arrExpAttrValue.length=0;
				this.arrExpAttrValue=arrExpAttrValue;
				return true;
			}
		};
		return false
	};
	this.GetAllExpAttrValue=function(){
		return this.arrExpAttrValue;
	}
};
function c8(){
	this.bImgSymbol=false;
	this.imgObj=null;
	this.strImgSrc=G_V.strSdkFilePath+"img/car32.png";
	var imgWidth=20;
	var iImgHeight=20;
	this.arrSymbolPo=[];
	this.symbolHeadPo=[];
	this.borderSize=2;
	this.fillColor="#ffff66";
	this.borderColor="#000000";
	this.iOpacity=90;
	this.minShowScale=0;
	this.maxShowScale=1280000;
	this.checkImg=function(){
		if(this.imgObj==null){
			this.imgObj=new Image();
			this.imgObj.src=this.strImgSrc;
		}
	}
};
function c9(){
	this.iState=0;
	this.bShowTop=false;
	this.bShowOrNot=true;
	this.arrShipStyle=[];
	this.SetShipStateInfo=function(iState,bShowTop,bShowOrNot){
		if(iState){
			this.iState=iState;
		};
		if(bShowTop){
			this.bShowTop=bShowTop;
		};
		if(bShowOrNot){
			this.bShowOrNot=bShowOrNot;
		}
	};
	this.AddShipStyleImg=function(bShowImg,strImgSrc,width,height,minScale,maxScale,iOpacity,fillColor){
		var curShipStyle=new c8();
		curShipStyle.bImgSymbol=bShowImg;
		curShipStyle.strImgSrc=G_V.strSdkFilePath+strImgSrc;
		curShipStyle.imgWidth=width;
		curShipStyle.iImgHeight=height;
		curShipStyle.minShowScale=minScale;
		curShipStyle.maxShowScale=maxScale;
		curShipStyle.iOpacity=iOpacity;
		curShipStyle.fillColor=fillColor;
		this.arrShipStyle.push(curShipStyle);
		return this.arrShipStyle.length-1;
	};
	this.AddShipStyle=function(arrSymbolPo,minScale,maxScale,borderSize,borderColor,fillColor,iOpacity){
		var curShipStyle=new c8();
		curShipStyle.arrSymbolPo=arrSymbolPo;
		curShipStyle.minShowScale=minScale;
		curShipStyle.maxShowScale=maxScale;
		curShipStyle.borderSize=borderSize;
		curShipStyle.borderColor=borderColor;
		curShipStyle.fillColor=fillColor;
		curShipStyle.iOpacity=iOpacity;
		var iSymbolPoCount=arrSymbolPo.length;
		var po1=null;
		var po2=null;
		for(var i=0;i<iSymbolPoCount;i++){
			if(i==0){
				po1=arrSymbolPo[0];
				continue;
			};
			if(po1.y<arrSymbolPo[i].y){
				continue;
			}
			else if(po1.y==arrSymbolPo[i].y){
				po2=arrSymbolPo[i];
			}
			else{
				po1=arrSymbolPo[i];
				po2=null;
			}
		};
		var curHeadPo=[];
		if(po1==null){
			curHeadPo.x=0;
			curHeadPo.y=0;
		}
		else if(po2==null){
			curHeadPo=po1;
		}
		else{
			curHeadPo.x=parseInt((po1.x+po2.x)/2);
			curHeadPo.y=po1.y;
		};
		curShipStyle.symbolHeadPo=curHeadPo;
		this.arrShipStyle.push(curShipStyle);
		return this.arrShipStyle.length-1;
	};
	this.UpdateShipStyle=function(iPos,arrSymbolPo,minScale,maxScale,borderSize,borderColor,fillColor,iOpacity){
		var bResult=false;
		if(this.arrShipStyle.length>iPos){
			if(arrSymbolPo){
				this.arrShipStyle[iPos].arrSymbolPo=arrSymbolPo;
				var iSymbolPoCount=arrSymbolPo.length;
				var po1=null;
				var po2=null;
				for(var i=0;i<iSymbolPoCount;i++){
					if(i==0){
						po1=arrSymbolPo[0];
						continue;
					};
					if(po1.y<arrSymbolPo[i].y){
						continue;
					}
					else if(po1.y==arrSymbolPo[i].y){
						po2=arrSymbolPo[i];
					}
					else{
						po1=arrSymbolPo[i];
						po2=null;
					}
				};
				var curHeadPo=[];
				if(po1==null){
					curHeadPo.x=0;
					curHeadPo.y=0;
				}
				else if(po2==null){
					curHeadPo=po1;
				}
				else{
					curHeadPo.x=parseInt((po1.x+po2.x)/2);
					curHeadPo.y=po1.y;
				};
				this.arrShipStyle[iPos].symbolHeadPo=curHeadPo;
			};
			if(minScale){
				this.arrShipStyle[iPos].minShowScale=minScale;
			};
			if(maxScale){
				this.arrShipStyle[iPos].maxShowScale=maxScale;
			};
			if(borderSize){
				this.arrShipStyle[iPos].borderSize=borderSize;
			};
			if(borderColor){
				this.arrShipStyle[iPos].borderColor=borderColor;
			};
			if(fillColor){
				this.arrShipStyle[iPos].fillColor=fillColor;
			};
			if(iOpacity){
				this.arrShipStyle[iPos].iOpacity=iOpacity;
			};
			bResult=true;
		};
		return bResult;
	}
};
function d0(){
	this.trackGeoPoX=0;
	this.trackGeoPoY=0;
	this.trackCourse=0;
	this.trackSpeed=0;
	this.trackTime="";
	this.iTrackTime=0;
	this.initValue=function(){
		this.trackGeoPoX=0;
		this.trackGeoPoY=0;
		this.trackCourse=0;
		this.trackSpeed=0;
		this.trackTime="";
	};
	this.SetTrackPoint=function(geoX,geoY,course,speed,time){
		this.trackGeoPoX=geoX;
		this.trackGeoPoY=geoY;
		this.trackCourse=course;
		this.trackSpeed=speed;
		this.trackTime=time;
	}
};
function d1(symbolStyle){
	var isVectorSymbol=true;
	var symbolSize=3;
	this.symbolStyle=symbolStyle;
	this.arrVertexsPo=new Array();
	this.symbolWidth=20;
	this.symblHeight=10;
	this.isFilled=false;
	this.fillColor="red";
	this.opacity=0.8;
	this.borderWith=1;
	this.borderColor="black";
	this.ratation=0;
	this.strImgSrc="";
	this.initValue=function(){
		isVectorSymbol=true;
		symbolSize=3;
		this.symbolStyle=symbolStyle;
		this.arrVertexsPo=new Array();
		this.symbolWidth=20;
		this.symblHeight=10;
		this.isFilled=false;
		this.fillColor="red";
		this.opacity=0.8;
		this.borderWith=1;
		this.borderColor="black";
		this.ratation=0;
		this.strImgSrc="";
	};
	this.GetArrVertexsPoAfterRotated=function(centerPoint,rotation){
		var arrNewVertexsPo=new Array();
		if(rotation==0){
			for(var i=0;i<this.arrVertexsPo.length;i++){
				var po=new k8();
				po.x=parseInt(this.arrVertexsPo[i].x)+parseInt(centerPoint.x);
				po.y=parseInt(this.arrVertexsPo[i].y)+parseInt(centerPoint.y);
				arrNewVertexsPo.push(po);
			}
		}
		else{
			var rotationRadiuse=rotation/180*Math.PI;
			var cosiOfAngle=Math.cos(rotationRadiuse);
			var sineOfAngle=Math.sin(rotationRadiuse);
			for(var i=0;i<this.arrVertexsPo.length;i++){
				var po=new k8();
				po.x=parseInt(cosiOfAngle*this.arrVertexsPo[i].x)-parseInt(sineOfAngle*this.arrVertexsPo[i].y)+parseInt(centerPoint.x);
				po.y=parseInt(cosiOfAngle*this.arrVertexsPo[i].y)+parseInt(sineOfAngle*this.arrVertexsPo[i].x)+parseInt(centerPoint.y);
				arrNewVertexsPo.push(po);
			}
		};
		return arrNewVertexsPo;
	}
};
function d2(){
	this.arrShipInfo=new Array();
	this.bIsShowOutLineShipOrNot=false;
	this.iCurSelectShipId=-1;
	this.iCurFollowShipId=-1;
	this.arrDrawShipScrnPo=new Array();
	this.arrDrawShipInfoBoxScrnPo=new Array();
	this.arrCurDrawShip=new Array();
	this.arrShipTrackPoints=new Array();
	this.iShowShipTrackPoCount=50;
	this.timer=null;
	this.iTimerStep=2000;
	this.arrShowShipPosInfo=[];
	this.AddOneShip=function(curShipInfo){
		if(!curShipInfo){
			return-1;
		};
		var shipTrack=new d0();
		shipTrack.SetTrackPoint(parseInt(curShipInfo.shipGeoPoX),parseInt(curShipInfo.shipGeoPoY),parseFloat(curShipInfo.shipCourse),parseFloat(curShipInfo.shipSpeed),curShipInfo.shipTime);
		var curMidObj=[];
		var iShipPos=this.GetShipPosById(curShipInfo.shipId,curMidObj);
		if(iShipPos>-1){
			var iShipTrackPointCount=this.arrShipInfo[iShipPos].arrShipTrackPoints.length;
			if(iShipTrackPointCount>this.iShowShipTrackPoCount){
				this.arrShipInfo[iShipPos].arrShipTrackPoints.splice(0,1);
			};
			this.arrShipInfo[iShipPos].arrShipTrackPoints.push(shipTrack);
			this.arrShipInfo[iShipPos].UpdateShipDynamicInfo(curShipInfo.shipGeoPoX,curShipInfo.shipGeoPoY,curShipInfo.shipSpeed,curShipInfo.shipCourse,curShipInfo.shipTime,curShipInfo.iShipState,curShipInfo.bOnlineOrNot);
		}
		else{
			curShipInfo.arrShipTrackPoints=[];
			curShipInfo.arrShipTrackPoints.push(shipTrack);
			var bIsAdd=false;
			var iCheckPos=0;
			if(parseInt(curMidObj.value)>0){
				iCheckPos=parseInt(curMidObj.value)-1;
			};
			var iShipCount=this.arrShipInfo.length;
			for(var i=iCheckPos;i<iShipCount;i++){
				if(parseInt(this.arrShipInfo[i].shipId)>parseInt(curShipInfo.shipId)){
					bIsAdd=true;
					this.arrShipInfo.splice(i,0,curShipInfo);
					iShipPos=i;
					break;
				}
			};
			if(bIsAdd==false){
				this.arrShipInfo.push(curShipInfo);
				iShipPos=this.arrShipInfo.length-1;
			}
		};
		return iShipPos;
	};
	this.DelOneShipByPos=function(iShipPos){
		var bResult=false;
		if(this.arrShipInfo.length>iShipPos&&iShipPos>-1){
			this.arrShipInfo.splice(iShipPos,1);
			bResult=true;
		};
		return bResult;
	};
	this.DelAllShips=function(){
		this.arrShipInfo=null;
		this.arrShipInfo=[];
		return true;
	};
	this.GetShipPosById=function(iCurShipId,curMidObj){
		var iPos=-1;
		var bUpdate=false;
		var iCurShipCount=parseInt(this.arrShipInfo.length);
		if(iCurShipCount==0){
			return iPos;
		};
		var iFront=0;
		var iEnd=parseInt(iCurShipCount-1);
		var iMid=parseInt((iFront+iEnd)/2);
		while(iFront<iEnd&&parseInt(this.arrShipInfo[iMid].shipId)!=parseInt(iCurShipId)){
			if(parseInt(this.arrShipInfo[iMid].shipId)<parseInt(iCurShipId)){
				iFront=parseInt(iMid)+1;
			};
			if(parseInt(this.arrShipInfo[iMid].shipId)>parseInt(iCurShipId)){
				iEnd=iMid-1;
			};
			iMid=parseInt((parseInt(iFront)+parseInt(iEnd))/2);
		};
		if(this.arrShipInfo[iMid].shipId==iCurShipId){
			iPos=iMid;
		};
		if(curMidObj){
			curMidObj.value=iMid;
		};
		return iPos;
	};
	this.GetShipInfoByPos=function(iShipPos){
		if(iShipPos>-1&&iShipPos<this.arrShipInfo.length){
			return this.arrShipInfo[iShipPos];
		}
		else{
			return null;
		}
	};
	this.GetShipCountByState=function(iShipState){
		var iShipCount=0;
		var iArrShipLen=this.arrShipInfo.length;
		if(iArrShipLen>0){
			if(iShipState==-1){
				iShipCount=iArrShipLen-1;
			}
			else{
				for(var iPos=0;iPos<iArrShipLen;iPos++){
					if(this.arrShipInfo[iPos].iShipState==iShipState){
						iShipCount++;
					}
				}
			}
		};
		return iShipCount;
	};
	this.GetShipIdOrPosByState=function(iShipState,bGetIdOrPos){
		var arrShipValue=null;
		var iArrShipLen=this.arrShipInfo.length;
		if(iArrShipLen>0){
			for(var iPos=0;iPos<iArrShipLen;iPos++){
				if(this.arrShipInfo[iPos].iShipState==iShipState){
					if(arrShipValue==null){
						arrShipValue=[];
					};
					if(bGetIdOrPos==true){
						arrShipValue.push(this.arrShipInfo[iPos].shipId);
					}
					else{
						arrShipValue.push(iPos);
					}
				}
			}
		};
		return arrShipValue;
	};
	this.SetSaveTrackPoCount=function(iSaveTrackPoCount){
		if(iSaveTrackPoCount!=undefined&&!isNaN(iSaveTrackPoCount)){
			this.iShowShipTrackPoCount=iSaveTrackPoCount;
		}
	};
	this.GetShipsCount=function(){
		return this.arrShipInfo.length;
	};
	this.SetShowOutLineShipOrNot=function(bShowOrNot){
		this.bIsShowOutLineShipOrNot=bShowOrNot;
		return true;
	};
	this.SetShipTrackShowOrNotById=function(iShipId,bShowOrNot){
		var bResult=false;
		var pos=this.GetShipPosById(iShipId);
		if(pos>-1){
			this.arrShipInfo[pos].bShowTrack=bShowOrNot;
			bResult=true;
		};
		return bResult;
	};
	this.SetShipShowTopOrNotById=function(iShipId,bShowOrNot){
		var bResult=false;
		var pos=this.GetShipPosById(iShipId);
		if(pos>-1){
			this.arrShipInfo[pos].bShowToTop=bShowOrNot;
			bResult=true;
		};
		return bResult;
	};
	this.SetShipShowOwnStyleOrNotById=function(iShipId,bGetOwnStyle){
		var bResult=false;
		var pos=this.GetShipPosById(iShipId);
		if(pos>-1){
			this.arrShipInfo[pos].bGetOwnStyle=bGetOwnStyle;
			bResult=true;
		};
		return bResult;
	};
	this.SetShipOwnStyleById=function(iShipId,fillColor,borderColor,bGetOwnStyle){
		var bResult=false;
		var pos=this.GetShipPosById(iShipId);
		if(pos>-1){
			this.arrShipInfo[pos].strOwnStyleFillColor=fillColor;
			this.arrShipInfo[pos].strOwnStyleBorderColor=borderColor;
			this.arrShipInfo[pos].bGetOwnStyle=bGetOwnStyle;
			bResult=true;
		};
		return bResult;
	};
	this.SetShipTrackStyleById=function(iShipId,strColor,bGetOwnerTrackStyle){
		var bResult=false;
		var pos=this.GetShipPosById(iShipId);
		if(pos>-1){
			this.arrShipInfo[pos].bGetOwnerTrackColor=bGetOwnerTrackStyle;
			this.arrShipInfo[pos].strTrackColor=strColor;
			bResult=true;
		};
		return bResult;
	};
	this.SetShipTrackStyleByPos=function(iShipPos,strColor){
		var bResult=false;
		if(this.arrShipInfo.length>iShipPos&&iShipPos>-1){
			this.arrShipInfo[pos].bGetOwnerTrackColor=true;
			this.arrShipInfo[pos].strTrackColor=strColor;
			bResult=true;
		};
		return bResult;
	};
	this.SetSelectShipByPos=function(iShipPos){
		var bReDrawShip=false;
		var iShipId=-1;
		if(this.arrShipInfo.length>iShipPos&&iShipPos>-1){
			iShipId=this.arrShipInfo[iShipPos].shipId;
		};
		if(parseInt(iShipId)!=parseInt(this.iCurSelectShipId)){
			this.iCurSelectShipId=parseInt(iShipId);
			bReDrawShip=true;
		};
		return bReDrawShip;
	};
	this.SetFollowShipOrNotById=function(iShipId){
		this.iCurFollowShipId=iShipId;
	};
	this.DelAllShips=function(){
		this.arrShipInfo=null;
		this.arrShipInfo=[];
	};
	this.GetShipInfoById=function(mmsi){
		var pos=this.GetShipPosById(iShipId);
		if(pos>-1){
			return this.arrShipInfo[pos];
		};
		return"";
	};
	this.SetShipExpAttrValueByPos=function(iShipId,iPos,strExpAttrValue){
		var bSetOk=false;
		var shipPos=this.GetShipPosById(iShipId);
		if(shipPos>-1){
			bSetOk=this.arrShipInfo[shipPos].SetExpAttrValueByPos(iPos,strExpAttrValue);
		};
		return bSetOk;
	};
	this.GetShipExpAttrValueByPos=function(iShipId,iPos){
		var strExpAttrValue=null;
		var shipPos=this.GetShipPosById(iShipId);
		if(shipPos>-1){
			strExpAttrValue=this.arrShipInfo[shipPos].GetExpAttrValueByPos(iPos);
		};
		return strExpAttrValue;
	};
	this.SetShipAllExpAttrValue=function(iShipId,arrExpAttrValue){
		var bSetOk=false;
		var shipPos=this.GetShipPosById(iShipId);
		if(shipPos>-1){
			bSetOk=this.arrShipInfo[shipPos].SetAllExpAttrValue(arrExpAttrValue);
		};
		return bSetOk;
	};
	this.GetShipAllExpAttrValue=function(iShipId){
		var arrExpAttrValue=[];
		var shipPos=this.GetShipPosById(iShipId);
		if(shipPos>-1){
			arrExpAttrValue=this.arrShipInfo[shipPos].GetAllExpAttrValue();
		};
		return arrExpAttrValue;
	};
	this.SelectShipByCondition=function(strShipNameOrMmsi){
		var iSelShipCount=0;
		var arrShipInfo=[];
		for(var i=0;i<this.arrShipInfo.length;i++){
			if(parseInt(iSelShipCount)>5000){
				break;
			};
			var strMMSI=this.arrShipInfo[i].shipMMSI+"&";
			var iMmsiIndex=strMMSI.indexOf(strShipNameOrMmsi);
			if(parseInt(iMmsiIndex)>-1){
				arrShipInfo.push(this.arrShipInfo[i]);
				iSelShipCount++;
				continue;
			};
			var iNameIndex=this.arrShipInfo[i].shipName.indexOf(strShipNameOrMmsi);
			if(parseInt(iNameIndex)>-1){
				arrShipInfo.push(this.arrShipInfo[i]);
				iSelShipCount++;
				continue;
			}
		};
		if(iSelShipCount==0){
			arrShipInfo=null;
		};
		return arrShipInfo;
	};
	this.GetAllShipListInfo=function(){
		return this.arrShipInfo;
	};
	this.SelectShipByGeoPo=function(geoPoX,geoPoY,checkGeoLen){
		for(var i=0;i<this.arrShipInfo.length;i++){
			if(this.bIsShowOutLineShipOrNot==false&&this.arrShipInfo[i].bOnlineOrNot==false){
				continue;
			};
			var minX=parseInt(this.arrShipInfo[i].shipGeoPoX)-parseInt(checkGeoLen);
			var minY=parseInt(this.arrShipInfo[i].shipGeoPoY)-parseInt(checkGeoLen);
			var maxX=parseInt(this.arrShipInfo[i].shipGeoPoX)+parseInt(checkGeoLen);
			var maxY=parseInt(this.arrShipInfo[i].shipGeoPoY)+parseInt(checkGeoLen);
			if(((parseInt(geoPoX)>parseInt(minX))&&(parseInt(geoPoX)<parseInt(maxX)))&&((parseInt(geoPoY)<parseInt(maxY))&&(parseInt(geoPoY)>parseInt(minY)))){
				return this.arrShipInfo[i];
			}
		};
		return"";
	};
	this.GetShipTrackPoInfoByTimeInfo=function(iShipId,bStartOrEndTime,strTime,iSpaceTime,iGetMaxPoCount){
		var arrGetTrackPoints=new Array();
		var shipPos=this.GetShipPosById(iShipId);
		if(shipPos>-1){
			var iTrackPointsCount=parseInt(this.arrShipInfo[shipPos].arrShipTrackPoints.length);
			if(iTrackPointsCount>2){
				var curGeoPo=new M_POINT();
				curGeoPo.x=this.arrShipInfo[shipPos].arrShipTrackPoints[parseInt(iTrackPointsCount-1)].trackGeoPoX;
				curGeoPo.y=this.arrShipInfo[shipPos].arrShipTrackPoints[parseInt(iTrackPointsCount-1)].trackGeoPoY;
				arrGetTrackPoints.push(curGeoPo);
				var curSelTrackTime=(new Date()).getTime()/1000;
				if(this.arrShipInfo[shipPos].arrShipTrackPoints[parseInt(iTrackPointsCount-1)].trackTime!=undefined&&this.arrShipInfo[shipPos].arrShipTrackPoints[parseInt(iTrackPointsCount-1)].trackTime!=""){
					var strTrackTime=this.arrShipInfo[shipPos].arrShipTrackPoints[parseInt(iTrackPointsCount-1)].trackTime.replace(/-/,"/");
					var dt=new Date(strTrackTime);
					curSelTrackTime=dt.getTime()/1000;
				};
				for(var i=parseInt(iTrackPointsCount-1);
				i>0;
				i--){
					if(this.arrShipInfo[shipPos].arrShipTrackPoints[i].trackTime!=undefined&&this.arrShipInfo[shipPos].arrShipTrackPoints[i].trackTime!=""){
						var dt=new Date(this.arrShipInfo[shipPos].arrShipTrackPoints[i].trackTime.replace(/-/,"/"));
						var iTime=dt.getTime()/1000;
						var aa=parseInt(curSelTrackTime-iTime);
						if(parseInt(curSelTrackTime-iTime)>parseInt(spaceTime)){
							curSelTrackTime=iTime;
							curGeoPo.x=this.arrShipInfo[shipPos].arrShipTrackPoints[i].trackGeoPoX;
							curGeoPo.y=this.arrShipInfo[shipPos].arrShipTrackPoints[i].trackGeoPoY;
							arrGetTrackPoints.push(curGeoPo);
							if(parseInt(arrGetTrackPoints.length)==parseInt(iGetMaxPoCount)){
								break;
							}
						}
					}
				};
				if(parseInt(arrGetTrackPoints.length)!=parseInt(iGetMaxPoCount)){
					curGeoPo.x=this.arrShipInfo[shipPos].arrShipTrackPoints[0].trackGeoPoX;
					curGeoPo.y=this.arrShipInfo[shipPos].arrShipTrackPoints[0].trackGeoPoY;
					arrGetTrackPoints.push(curGeoPo);
				}
			}
		};
		return arrGetTrackPoints;
	};
	this.UpdateShipDynamicInfoByPos=function(iShipPos,iGeoPoX,iGeoPoY,speed,course,time,iShipState,bIsOnLine){
		var bResult=false;
		if(this.arrShipInfo.length>iShipPos&&iShipPos>-1){
			var shipTrack=new d0();
			shipTrack.SetTrackPoint(parseInt(iGeoPoX),parseInt(iGeoPoY),parseFloat(course),parseFloat(speed),time);
			var iShipTrackPointCount=this.arrShipInfo[iShipPos].arrShipTrackPoints.length;
			if(iShipTrackPointCount>this.iShowShipTrackPoCount){
				this.arrShipInfo[iShipPos].arrShipTrackPoints.splice(0,1);
			};
			this.arrShipInfo[iShipPos].arrShipTrackPoints.push(shipTrack);
			this.arrShipInfo[iShipPos].UpdateShipDynamicInfo(iGeoPoX,iGeoPoY,speed,course,time,iShipState,bIsOnLine);
			bResult=true;
		};
		return bResult;
	};
	this.SetOneShipShowOrNotByPos=function(iShipPos,bShowOrNot){
		var bResult=false;
		if(this.arrShipInfo.length>iShipPos&&iShipPos>-1){
			this.arrShipInfo[iShipPos].bShipShowOrNot=bShowOrNot;
			bResult=true;
		};
		return bResult;
	};
	this.SetFollowShipByPos=function(iShipPos){
		var bResult=false;
		var iShipId=-1;
		if(iShipPos>-1&&this.arrShipInfo.length>iShipPos){
			iShipId=this.arrShipInfo[iShipPos].shipId;
		};
		if(this.iCurFollowShipId!=iShipId){
			if(this.timer){
				clearInterval(this.timer);
				this.timer=null;
			}
		};
		this.iCurFollowShipId=iShipId;
		var pos=this.GetShipPosById(iShipId);
		if(pos>-1){
			this.timer=setInterval(d3,this.iTimerStep);
		};
		return true;
	};
	this.SelectShipsByGeoRect=function(iMinGeoX,iMaxGeoX,iMinGeoY,iMaxGeoY,iGetMaxShipCount){
		var minGeoX=iMinGeoX;
		var maxGeoX=iMaxGeoX;
		var minGeoY=iMinGeoY;
		var maxGeoY=iMaxGeoY;
		var iGetAllShipCount=iGetMaxShipCount;
		var iGetCurShipCount=0;
		var iCurShipCount=this.arrShipInfo.length;
		var arrRetShipInfo=[];
		if(iCurShipCount>0){
			if(minGeoX>maxGeoX){
				var curValue=minGeoX;
				minGeoX=maxGeoX;
				maxGeoX=curValue;
			};
			if(minGeoY>maxGeoY){
				var curValue=minGeoY;
				minGeoY=maxGeoY;
				maxGeoY=curValue;
			};
			if(iGetMaxShipCount<1){
				iGetMaxShipCount=iCurShipCount;
			};
			for(var i=0;i<iCurShipCount;i++){
				var curGeoX=this.arrShipInfo[i].shipGeoPoX;
				var curGeoY=this.arrShipInfo[i].shipGeoPoY;
				if(curGeoX>maxGeoX||curGeoX<minGeoX||curGeoY>maxGeoY||curGeoY<minGeoY){
					continue;
				};
				iGetCurShipCount++;
				arrRetShipInfo.push(this.arrShipInfo[i]);
				if(iGetCurShipCount==iGetMaxShipCount){
					break;
				}
			}
		};
		var resultObj={
			arrShipInfo:arrRetShipInfo,iShipCount:iGetCurShipCount
		};
		return resultObj;
	};
	this.SelectShipsByGeoCircle=function(iCircleGeoX,iCircleGeoY,fCircleRadiusKm,iGetMaxShipCount){
		var iGetAllShipCount=iGetMaxShipCount;
		var iGetCurShipCount=0;
		var iCurShipCount=this.arrShipInfo.length;
		var arrRetShipInfo=[];
		var lon2=parseFloat(iCircleGeoX/G_V.UNI_GEO_COOR_MULTI_FACTOR);
		var lat2=parseFloat(iCircleGeoY/G_V.UNI_GEO_COOR_MULTI_FACTOR);
		if(iCurShipCount>0){
			if(iGetMaxShipCount<1){
				iGetMaxShipCount=iCurShipCount;
			};
			for(var i=0;i<iCurShipCount;i++){
				var curGeoX=this.arrShipInfo[i].shipGeoPoX;
				var curGeoY=this.arrShipInfo[i].shipGeoPoY;
				var lon1=parseFloat(curGeoX/G_V.UNI_GEO_COOR_MULTI_FACTOR);
				var lat1=parseFloat(curGeoY/G_V.UNI_GEO_COOR_MULTI_FACTOR);
				var disKm=k9(lon1,lat1,lon2,lat2);
				if(fCircleRadiusKm<disKm){
					continue;
				};
				iGetCurShipCount++;
				arrRetShipInfo.push(this.arrShipInfo[i]);
				if(iGetCurShipCount==iGetMaxShipCount){
					break;
				}
			}
		};
		var resultObj={
			arrShipInfo:arrRetShipInfo,iShipCount:iGetCurShipCount
		};
		return resultObj;
	};
	this.SelectShipsByGeoPolygon=function(arrPolygonGeoPo,iGetMaxShipCount){
		var arrRetShipInfo=[];
		var iGetCurShipCount=0;
		if(arrPolygonGeoPo){
			var iPolygonPoCount=arrPolygonGeoPo.length;
			if(iPolygonPoCount>2){
				var iMinGeoX=arrPolygonGeoPo[0].x;
				var iMaxGeoX=arrPolygonGeoPo[0].x;
				var iMinGeoY=arrPolygonGeoPo[0].y;
				var iMaxGeoY=arrPolygonGeoPo[0].y;
				for(var i=1;i<iPolygonPoCount;i++){
					if(parseFloat(iMinGeoX)>parseFloat(arrPolygonGeoPo[i].x)){
						iMinGeoX=arrPolygonGeoPo[i].x;
					};
					if(parseFloat(iMaxGeoX)<parseFloat(arrPolygonGeoPo[i].x)){
						iMaxGeoX=arrPolygonGeoPo[i].x;
					};
					if(parseFloat(iMinGeoY)>parseFloat(arrPolygonGeoPo[i].y)){
						iMinGeoY=arrPolygonGeoPo[i].y;
					};
					if(parseFloat(iMaxGeoY)<parseFloat(arrPolygonGeoPo[i].y)){
						iMaxGeoY=arrPolygonGeoPo[i].y;
					}
				};
				var arrRectShipInfo=this.SelectShipsByGeoRect(iMinGeoX,iMaxGeoX,iMinGeoY,iMaxGeoY,-1);
				if(arrRectShipInfo){
					var iRectShipCount=arrRectShipInfo.iShipCount;
					var arrShipInfo=arrRectShipInfo.arrShipInfo;
					for(var i=0;i<iRectShipCount;i++){
						var bSelResult=l7(arrShipInfo[i].shipGeoPoX,arrShipInfo[i].shipGeoPoY,arrPolygonGeoPo,iMinGeoX,iMaxGeoX,iMinGeoY,iMaxGeoY);
						if(bSelResult){
							arrRetShipInfo.push(arrShipInfo[i]);
							iGetCurShipCount++;
							if(iGetCurShipCount>0&&iGetCurShipCount==iGetMaxShipCount){
								break;
							}
						}
					}
				}
			}
		};
		var resultObj={
			arrShipInfo:arrRetShipInfo,iShipCount:iGetCurShipCount
		};
		return resultObj;
	};
	this.SetShipUseOwnSymbolByShipPos=function(iShipPos,bUseOwnSymbol,arrSymbolPo){
		var bResult=false;
		if(iShipPos>-1&&this.arrShipInfo.length>iShipPos){
			bResult=true;
			this.arrShipInfo[iShipPos].SetShipUseOwnSymbolByShipPos(bUseOwnSymbol,arrSymbolPo);
		};
		return bResult;
	};
	this.SetShipInfoDivObj=function(iShipPos,divObj,bMove){
		var bResult=false;
		if(iShipPos>-1&&this.arrShipInfo.length>iShipPos){
			bResult=true;
			this.arrShipInfo[iShipPos].SetShipInfoDivObj(divObj,bMove);
		};
		return bResult;
	};
	this.SetShipInfoDivOffset=function(iShipPos,offsetScrnPo){
		var bResult=false;
		if(iShipPos>-1&&this.arrShipInfo.length>iShipPos){
			bResult=true;
			this.arrShipInfo[iShipPos].SetShipInfoDivOffset(offsetScrnPo);
		};
		return bResult;
	};
	this.GetShipInfoDivOffset=function(iShipPos){
		var offsetScrnPo=null;
		if(iShipPos>-1&&this.arrShipInfo.length>iShipPos){
			offsetScrnPo=this.arrShipInfo[iShipPos].GetShipInfoDivOffset();
		};
		return offsetScrnPo;
	};
	this.GetShipInfoDivObj=function(iShipPos){
		var divObj=null;
		if(iShipPos>-1&&this.arrShipInfo.length>iShipPos){
			divObj=this.arrShipInfo[iShipPos].GetShipInfoDivObj();
		};
		return divObj;
	}
};
function d3(){
	if(g_objManShipClass.iCurFollowShipId>-1){
		var iShipPos=g_objManShipClass.GetShipPosById(g_objManShipClass.iCurFollowShipId);
		var curShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
		if(curShipInfo){
			var lon=curShipInfo.shipGeoPoX/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var lat=curShipInfo.shipGeoPoY/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			f7(lon,lat,null);
		}
	}
};
function d4(){
	this.arrShipInfo=[];
	this.arrPlayAreaInfo=[];
	this.iPlayType=0;
	this.iPlayStep=10;
	this.strStartTime="";
	this.strEndTime="";
	this.iPlayTimeStep=60000;
	this.iCurPlayTime=0;
	this.iMaxPlayTime=0;
	this.iMinPlayTime=0;
	this.iCurSelectShipId=-1;
	this.iCurFollowShipId=-1;
	this.timer=null;
	this.iTimerStep=2000;
	this.AddPlayArea=function(objAreaInfo){
		var pos=-1;
		if(objAreaInfo){
			this.arrPlayAreaInfo.push(objAreaInfo);
			pos=this.arrPlayAreaInfo.length;
		};
		return pos;
	};
	this.ReSetOtherShipPlayToEnd=function(){
		for(var i=0;i<this.arrShipInfo.length;i++){
			if(this.arrShipInfo[i].iNextPlayHistoryTrackPos>0){
				this.arrShipInfo[i].iNextPlayHistoryTrackPos=this.arrShipInfo[i].arrShipTrackPoints.length;
				this.arrShipInfo[i].bEndPlayHistoryTrack=true;
			}
		};
		this.iPlayType=0;
		this.strStartTime="";
		this.strEndTime="";
		this.iCurPlayTime=0;
		this.iMaxPlayTime=0;
		this.iMinPlayTime=0;
	};
	this.SetCurPlayShipById=function(iShipId){
		var bResult=false;
		if(iShipId<0){
			for(var i=0;i<this.arrShipInfo.length;i++){
				bResult=this.SetShipToPlayByPos(i)
			}
		}
		else{
			var iShipPos=this.GetShipPosById(iShipId,null);
			bResult=this.SetShipToPlayByPos(iShipPos)
		};
		return bResult;
	};
	this.SetShipToPlayByPos=function(iShipPos){
		var bResult=false;
		if(iShipPos>-1&&iShipPos<this.arrShipInfo.length){
			this.arrShipInfo[iShipPos].bEndPlayHistoryTrack=false;
			this.arrShipInfo[iShipPos].iNextPlayHistoryTrackPos=0;
			var curShipTrackMinTime=0;
			var iTrackCount=this.arrShipInfo[iShipPos].arrShipTrackPoints.length;
			if(iTrackCount>0){
				curShipTrackMinTime=this.arrShipInfo[iShipPos].arrShipTrackPoints[0].iTrackTime;
			};
			if(iTrackCount>1){
				curShipTrackMaxTime=this.arrShipInfo[iShipPos].arrShipTrackPoints[iTrackCount-1].iTrackTime;
			};
			if(curShipTrackMinTime!=null){
				if(this.iMinPlayTime==0||this.iMinPlayTime>curShipTrackMinTime){
					this.iMinPlayTime=curShipTrackMinTime;
					this.iCurPlayTime=curShipTrackMinTime;
				}
			};
			if(curShipTrackMaxTime!=null){
				if(this.iMaxPlayTime<curShipTrackMaxTime){
					this.iMaxPlayTime=curShipTrackMaxTime+parseInt(10);
				}
			};
			bResult=true;
		};
		return bResult;
	};
	this.AddOnePlayShipInfo=function(objShipInfo,arrTracks){
		var curShipInfo=new c7();
		curShipInfo.shipId=objShipInfo.shipId;
		curShipInfo.shipMMSI=objShipInfo.shipMMSI;
		curShipInfo.shipName=objShipInfo.shipName;
		curShipInfo.shipWidth=objShipInfo.shipWidth;
		curShipInfo.shipLength=objShipInfo.shipLength;
		curShipInfo.iShipState=objShipInfo.iShipState;
		curShipInfo.arrExpAttrValue=objShipInfo.arrExpAttrValue;
		curShipInfo.arrShipTrackPoints=arrTracks;
		curShipInfo.iNextPlayHistoryTrackPos=0;
		curShipInfo.bShowTrack=objShipInfo.bShowTrack;
		var curShipTrackMinTime=null;
		var curShipTrackMaxTime=null;
		var iTrackCount=arrTracks.length;
		if(iTrackCount>0){
			curShipTrackMinTime=arrTracks[0].iTrackTime;
		};
		if(iTrackCount>1){
			curShipTrackMaxTime=arrTracks[iTrackCount-1].iTrackTime;
		};
		if(curShipTrackMinTime!=null){
			if(this.iMinPlayTime==0||this.iMinPlayTime>curShipTrackMinTime){
				this.iMinPlayTime=curShipTrackMinTime;
				this.iCurPlayTime=curShipTrackMinTime;
			}
		};
		if(curShipTrackMaxTime!=null){
			if(this.iMaxPlayTime<curShipTrackMaxTime){
				this.iMaxPlayTime=curShipTrackMaxTime+parseInt(10);
			}
		};
		var curMidObj=[];
		var iShipPos=this.GetShipPosById(curShipInfo.shipId,curMidObj);
		if(iShipPos>-1){
			this.arrShipInfo[iShipPos]=curShipInfo;
		}
		else{
			var bIsAdd=false;
			var iCheckPos=0;
			if(parseInt(curMidObj.value)>0){
				iCheckPos=parseInt(curMidObj.value)-1;
			};
			var iShipCount=this.arrShipInfo.length;
			for(var i=iCheckPos;i<iShipCount;i++){
				if(parseInt(this.arrShipInfo[i].shipId)>parseInt(curShipInfo.shipId)){
					bIsAdd=true;
					this.arrShipInfo.splice(i,0,curShipInfo);
					iShipPos=i;
					break;
				}
			};
			if(bIsAdd==false){
				this.arrShipInfo.push(curShipInfo);
				iShipPos=this.arrShipInfo.length-1;
			}
		};
		return iShipPos;
	};
	this.SetSelectShipByPos=function(iShipPos){
		var bReDrawShip=false;
		var iShipId=-1;
		if(this.arrShipInfo.length>iShipPos&&iShipPos>-1){
			iShipId=this.arrShipInfo[iShipPos].shipId;
		};
		if(parseInt(iShipId)!=parseInt(this.iCurSelectShipId)){
			this.iCurSelectShipId=parseInt(iShipId);
			bReDrawShip=true;
		};
		return bReDrawShip;
	};
	this.GetShipPosById=function(iCurShipId,curMidObj){
		var iPos=-1;
		var bUpdate=false;
		var iCurShipCount=parseInt(this.arrShipInfo.length);
		if(iCurShipCount==0){
			return iPos;
		};
		var iFront=0;
		var iEnd=parseInt(iCurShipCount-1);
		var iMid=parseInt((iFront+iEnd)/2);
		while(iFront<iEnd&&parseInt(this.arrShipInfo[iMid].shipId)!=parseInt(iCurShipId)){
			if(parseInt(this.arrShipInfo[iMid].shipId)<parseInt(iCurShipId)){
				iFront=parseInt(iMid)+1;
			};
			if(parseInt(this.arrShipInfo[iMid].shipId)>parseInt(iCurShipId)){
				iEnd=iMid-1;
			};
			iMid=parseInt((parseInt(iFront)+parseInt(iEnd))/2);
		};
		if(this.arrShipInfo[iMid].shipId==iCurShipId){
			iPos=iMid;
		};
		if(curMidObj){
			curMidObj.value=iMid;
		};
		return iPos;
	};
	this.GetShipInfoByPos=function(iShipPos){
		if(iShipPos>-1&&iShipPos<this.arrShipInfo.length){
			return this.arrShipInfo[iShipPos];
		}
		else{
			return null;
		}
	};
	this.GetTrackInfoByPos=function(iShipPos,iTrackPos){
		var curTrackInfo=null;
		if(iShipPos<this.arrShipInfo.length){
			if(this.arrShipInfo[iShipPos].arrShipTrackPoints.length>iTrackPos);
			{
				curTrackInfo=this.arrShipInfo[iShipPos].arrShipTrackPoints[iTrackPos];
			}
		};
		return curTrackInfo;
	};
	this.DelPlayShipById=function(iShipId){
		var iShipPos=this.GetShipPosById(iShipId,null);
		var bResult=false;
		if(this.arrShipInfo.length>iShipPos&&iShipPos>-1){
			this.arrShipInfo.splice(iShipPos,1);
			bResult=true;
		};
		return bResult;
	};
	this.InitPlayTrack=function(){};
	this.SetPlayHistoryTrackTimeStep=function(iStep){
		var bResult=false;
		if(iStep){
			if(iStep<1){
				iStep=1
			};
			this.iPlayTimeStep=iStep*1000;
			bResult=true;
		};
		return bResult;
	};
	this.StartPlayShipHistoryTrack=function(){
		this.arrShipInfo.sort(function(a,b){
			return a.shipId-b.shipId;
		});
		G_V.bIsPlayShipHistoryTrack=true;
		if(this.timer){
			clearInterval(this.timer);
			this.timer=null;
		};
		G_V.bIsPlayShipHistoryTrack=true;
		if(G_V.bDrawCurShipAndPlayHistoryTrackShip==false){
			g_objDrawObjClass.ClearShipCanvas();
		};
		d5();
		this.timer=setInterval(d5,this.iTimerStep);
	};
	this.StopPlayHistoryTrackOrNot=function(bStopOrNot){
		if(bStopOrNot==true){
			if(this.timer){
				clearInterval(this.timer);
				this.timer=null;
			}
		}
		else{
			d5();
			this.timer=setInterval(d5,this.iTimerStep);
		};
		return true;
	};
	this.FastPlayHistoryTrack=function(iFastStep){
		if(!iFastStep){
			iFastStep=2;
		};
		this.iCurPlayTime+=this.iPlayTimeStep*iFastStep;
		if(iFastStep<0){
			var iShipCount=this.arrShipInfo.length;
			for(var i=0;i<iShipCount;i++){
				if(this.arrShipInfo[i].bEndPlayHistoryTrack==false){
					this.arrShipInfo[i].iNextPlayHistoryTrackPos=0;
				}
			};
			this.iCurPlayTime=Math.max(this.iCurPlayTime,this.iMinPlayTime);
		}
		else{
			this.iCurPlayTime=Math.min(this.iCurPlayTime,this.iMaxPlayTime);
		};
		this.ReFreshShipCurPlayTrackPos();
		g_objDrawObjClass.ClearShipHistroyTrackCanvas();
		g_objDrawObjClass.DrawAllShipHistroyTrack();
		return true;
	};
	this.SetCurTrackPlayStepTime=function(iTrackStepTime){
		if(iTrackStepTime<this.iCurPlayTime){
			var iShipCount=this.arrShipInfo.length;
			for(var i=0;i<iShipCount;i++){
				if(this.arrShipInfo[i].bEndPlayHistoryTrack==false){
					this.arrShipInfo[i].iNextPlayHistoryTrackPos=0;
				}
			};
			this.iCurPlayTime=Math.max(iTrackStepTime,this.iMinPlayTime);
		}
		else{
			this.iCurPlayTime=Math.min(iTrackStepTime,this.iMaxPlayTime);
		};
		this.ReFreshShipCurPlayTrackPos();
		g_objDrawObjClass.ClearShipHistroyTrackCanvas();
		g_objDrawObjClass.DrawAllShipHistroyTrack();
		return true;
	};
	this.EndPlayHistoryTrack=function(){
		this.iCurPlayTime=this.iMaxPlayTime;
		this.ReFreshShipCurPlayTrackPos();
		g_objDrawObjClass.ClearShipHistroyTrackCanvas();
		g_objDrawObjClass.DrawAllShipHistroyTrack();
		if(this.timer){
			clearInterval(this.timer);
			this.timer=null;
		};
		if(typeof ReturnCurPlayTrackTimeInfo==='function'){
			var curNowTime=new Date();
			curNowTime.setTime(g_objManHistoryTrackClass.iCurPlayTime);
			var strTime=curNowTime.getFullYear()+"/"+(curNowTime.getMonth()+1)+"/"+curNowTime.getDate()+" "+curNowTime.getHours()+":"+curNowTime.getMinutes()+":"+curNowTime.getSeconds();
			ReturnCurPlayTrackTimeInfo(strTime,false)
		};
		return;
	};
	this.ReStartPlayHistoryTrack=function(){
		this.iCurPlayTime=this.iMinPlayTime;
		var iShipCount=this.arrShipInfo.length;
		for(var i=0;i<iShipCount;i++){
			if(this.arrShipInfo[i].bEndPlayHistoryTrack==false){
				this.arrShipInfo[i].iNextPlayHistoryTrackPos=0;
			}
		};
		this.ReFreshShipCurPlayTrackPos();
		g_objDrawObjClass.ClearShipHistroyTrackCanvas();
		g_objDrawObjClass.DrawAllShipHistroyTrack();
		if(this.timer==null){
			this.timer=setInterval(d5,this.iTimerStep);
		};
		return true;
	};
	this.ReFreshShipCurPlayTrackPos=function(){
		var iShipCount=this.arrShipInfo.length;
		for(var i=0;i<iShipCount;i++){
			if(this.arrShipInfo[i].bEndPlayHistoryTrack==true){
				continue;
			};
			var iNextPlayHistoryTrackPos=this.arrShipInfo[i].iNextPlayHistoryTrackPos;
			var iCurTrackMaxPos=this.arrShipInfo[i].arrShipTrackPoints.length-1;
			var bAddPos=false;
			if(iCurTrackMaxPos>iNextPlayHistoryTrackPos){
				if(this.arrShipInfo[i].arrShipTrackPoints[iCurTrackMaxPos].iTrackTime<g_objManHistoryTrackClass.iCurPlayTime){
					bAddPos=true;
					iNextPlayHistoryTrackPos=iCurTrackMaxPos+parseInt(1);
					this.arrShipInfo[i].iNextPlayHistoryTrackPos=iNextPlayHistoryTrackPos;
				}
				else{
					while(this.arrShipInfo[i].arrShipTrackPoints[iNextPlayHistoryTrackPos].iTrackTime<g_objManHistoryTrackClass.iCurPlayTime){
						if(parseInt(iCurTrackMaxPos)+parseInt(1)>iNextPlayHistoryTrackPos){
							iNextPlayHistoryTrackPos++;
							bAddPos=true;
							this.arrShipInfo[i].iNextPlayHistoryTrackPos=iNextPlayHistoryTrackPos;
							if(iNextPlayHistoryTrackPos>iCurTrackMaxPos){
								break;
							}
						}
						else{
							break;
						}
					}
				}
			};
			if(bAddPos){
				this.arrShipInfo[i].shipGeoPoX=this.arrShipInfo[i].arrShipTrackPoints[iNextPlayHistoryTrackPos-1].trackGeoPoX;
				this.arrShipInfo[i].shipGeoPoY=this.arrShipInfo[i].arrShipTrackPoints[iNextPlayHistoryTrackPos-1].trackGeoPoY;
				this.arrShipInfo[i].shipTime=this.arrShipInfo[i].arrShipTrackPoints[iNextPlayHistoryTrackPos-1].trackTime;
				this.arrShipInfo[i].shipSpeed=this.arrShipInfo[i].arrShipTrackPoints[iNextPlayHistoryTrackPos-1].trackSpeed;
				this.arrShipInfo[i].shipCourse=this.arrShipInfo[i].arrShipTrackPoints[iNextPlayHistoryTrackPos-1].trackCourse;
			}
		}
	};
	this.ClearPlayHistoryTrackInfo=function(){
		this.arrShipInfo=null;
		this.arrPlayAreaInfo=null;
		this.arrShipInfo=[];
		this.arrPlayAreaInfo=[];
		this.iPlayType=0;
		this.iPlayStep=10;
		this.strStartTime="";
		this.strEndTime="";
		this.iPlayTimeStep=60000;
		this.iCurPlayTime=0;
		this.iMaxPlayTime=0;
		this.iMinPlayTime=0;
		if(this.timer){
			clearInterval(this.timer);
		};
		this.timer=null;
		g_objDrawObjClass.ClearShipHistroyTrackCanvas();
		G_V.bIsPlayShipHistoryTrack=false;
		g_objDrawObjClass.DrawAllShipHistroyTrack();
	};
	this.SetFollowShipByPos=function(iShipPos){
		if(iShipPos==-1){
			this.iCurFollowShipId=-1;
		}
		else if(iShipPos>-1&&this.arrShipInfo.length>iShipPos){
			this.iCurFollowShipId=this.arrShipInfo[iShipPos].shipId;
		};
		return true;
	};
	this.SetPlayShipTrackStyleById=function(iShipId,strColor,bGetOwnerTrackStyle){
		var bResult=false;
		var pos=this.GetShipPosById(iShipId);
		if(pos>-1){
			this.arrShipInfo[pos].bGetOwnerTrackColor=bGetOwnerTrackStyle;
			this.arrShipInfo[pos].strTrackColor=strColor;
			bResult=true;
		};
		return bResult;
	};
	this.SetFollowShipByPos=function(iShipPos,strColor){
		if(iShipPos>-1&&this.arrShipInfo.length>iShipPos){
			g_objManHistoryTrackClass.arrShipInfo[iShipPos].strTrackColor;
		};
		return true;
	}
};
function d5(){
	g_objManHistoryTrackClass.iCurPlayTime+=g_objManHistoryTrackClass.iPlayTimeStep;
	g_objManHistoryTrackClass.ReFreshShipCurPlayTrackPos();
	if(G_V.bCurDragMap==false){
		g_objDrawObjClass.ClearShipHistroyTrackCanvas();
		g_objDrawObjClass.DrawAllShipHistroyTrack();
	};
	var bEndPlay=false;
	if(g_objManHistoryTrackClass.iCurPlayTime>g_objManHistoryTrackClass.iMaxPlayTime){
		bEndPlay=true;
		g_objManHistoryTrackClass.EndPlayHistoryTrack();
	};
	if(typeof ReturnCurPlayTrackTimeInfo==='function'){
		var curNowTime=new Date();
		curNowTime.setTime(g_objManHistoryTrackClass.iCurPlayTime);
		var strTime=curNowTime.getFullYear()+"/"+(curNowTime.getMonth()+1)+"/"+curNowTime.getDate()+" "+curNowTime.getHours()+":"+curNowTime.getMinutes()+":"+curNowTime.getSeconds();
		ReturnCurPlayTrackTimeInfo(strTime,bEndPlay)
	};
	d6();
};
function d6(){
	if(g_objManHistoryTrackClass.iCurFollowShipId>-1){
		var iShipPos=g_objManHistoryTrackClass.GetShipPosById(g_objManHistoryTrackClass.iCurFollowShipId);
		var curShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
		if(curShipInfo){
			var lon=curShipInfo.shipGeoPoX/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var lat=curShipInfo.shipGeoPoY/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			f7(lon,lat,null);
		}
	}
};
function d7(){
	this.id=-1;
	this.name="";
	this.arrTracks=[];
	this.startTime="";
	this.endTime="";
	this.iCurShowTrackPos=0;
	this.arrExpAttrValue=[];
	this.bShow=false;
	this.img=null;
	this.imgSize=null;
	this.arrPredictTrackLineStyle=[];
	this.SetTyphoonInfo=function(objTyphoonInfo,arrExpAttrValue){
		this.id=objTyphoonInfo.id;
		this.name=objTyphoonInfo.name;
		this.startTime=objTyphoonInfo.startTime;
		this.endTime=objTyphoonInfo.endTime;
		this.arrExpAttrValue=arrExpAttrValue;
	};
	this.SetTyphoonPoImgInfo=function(strImgSrc,width,height){
		if(strImgSrc!=null){
			if(this.img==null){
				this.img=new Image();
				this.img.src=G_V.strSdkFilePath+strImgSrc;
				var style=this.img.style;
				style.position="absolute";
				style.display="none";
				style.zIndex=20;
				g_objYimaEncMap.allCanvasDiv.appendChild(this.img);
			}
			else{
				this.img.src=G_V.strSdkFilePath+strImgSrc;
			}
		};
		this.imgSize={
			x:width,y:height
		};
	};
	this.SetTyphoonShowOrNot=function(bShowOrNot){
		if(this.img==null){
			this.img=new Image();
			this.img.src=G_V.strSdkFilePath+"img/typhoon.gif";
			var style=this.img.style;
			style.position="absolute";
			style.display="none";
			style.zIndex=20;
			g_objYimaEncMap.allCanvasDiv.appendChild(this.img);
		};
		var style=this.img.style;
		style.display="none";
		this.bShow=bShowOrNot;
	};
	this.AddPredictTrackLineStyle=function(iWidth,strColor,iOpacity){
		if(this.arrPredictTrackLineStyle==undefined||this.arrPredictTrackLineStyle==null){
			this.arrPredictTrackLineStyle=[];
		};
		var curPredictTrackLineStyle=new d8();
		curPredictTrackLineStyle.width=iWidth;
		curPredictTrackLineStyle.color=strColor;
		curPredictTrackLineStyle.opacity=iOpacity;
		this.arrPredictTrackLineStyle.push(curPredictTrackLineStyle);
	}
};
function d8(){
	this.width=2;
	this.color="#a21a0b";
	this.opacity=80;
};
function d9(){
	this.time="";
	this.po=[];
	this.windPower=0;
	this.windSpeed=0;
	this.airPressure=0;
	this.moveDirection="";
	this.moveSpeed="";
	this.sevenRadius=0;
	this.tenRadius=0;
	this.arrPredictTracks=[];
	this.SetTyphoonTrackInfo=function(objTrackInfo){
		this.time=objTrackInfo.time;
		this.po={
			x:objTrackInfo.po.x,y:objTrackInfo.po.y
		};
		this.windPower=objTrackInfo.windPower;
		this.windSpeed=objTrackInfo.windSpeed;
		this.airPressure=objTrackInfo.airPressure;
		this.moveDirection=objTrackInfo.moveDirection;
		this.moveSpeed=objTrackInfo.moveSpeed;
		this.sevenRadius=objTrackInfo.sevenRadius;
		this.tenRadius=objTrackInfo.tenRadius;
	}
};
function e0(){
	this.time="";
	this.po=[];
	this.windPower=0;
	this.windSpeed=0;
	this.airPressure=0;
	this.strReportStation="";
};
function e1(){
	this.arrTyphoonInfo=[];
	this.arrShowTyphoonAnimationGeoPo=[];
	this.strMinLowerColor="#FFFFFF";
	this.strTropicalDepressionColor="";
	this.strTropicalStormColor="";
	this.strSevereTropicalStormColor="";
	this.strTyphoonColor="";
	this.strSevereTyphoonColor="";
	this.strSuperTyphoonColor="";
	this.sevenCircleColor="8001ec";
	this.tenCircleColor="082aee";
	this.SetTyphoonStyleColor=function(objTyphoonStyle){
		var bResult=false;
		if(objTyphoonStyle){
			this.strTropicalDepressionColor=objTyphoonStyle.strTropicalDepressionColor;
			this.strTropicalStormColor=objTyphoonStyle.strTropicalStormColor;
			this.strSevereTropicalStormColor=objTyphoonStyle.strSevereTropicalStormColor;
			this.strTyphoonColor=objTyphoonStyle.strTyphoonColor;
			this.strSevereTyphoonColor=objTyphoonStyle.strSevereTyphoonColor;
			this.strSuperTyphoonColor=objTyphoonStyle.strSuperTyphoonColor;
			this.sevenCircleColor=objTyphoonStyle.sevenCircleColor;
			this.tenCircleColor=objTyphoonStyle.tenCircleColor;
			bResult=true;
		};
		return bResult;
	};
	this.SetMinLowerTyphoonStyle=function(strColor){
		var bResult=false;
		if(strColor){
			this.strMinLowerColor=strColor;
			bResult=true;
		};
		return bResult;
	};
	this.GetDrawTyphoonColorByWindSpeed=function(fWindSpeed){
		var strColor="";
		if(fWindSpeed<10.8){
			strColor=this.strMinLowerColor
		}
		else if(fWindSpeed<17.2){
			strColor=this.strTropicalDepressionColor;
		}
		else if(fWindSpeed<24.5){
			strColor=this.strTropicalStormColor;
		}
		else if(fWindSpeed<32.7){
			strColor=this.strSevereTropicalStormColor;
		}
		else if(fWindSpeed<41.5){
			strColor=this.strTyphoonColor;
		}
		else if(fWindSpeed<51){
			strColor=this.strSevereTyphoonColor;
		}
		else{
			strColor=this.strSuperTyphoonColor;
		};
		return strColor;
	};
	this.GetTyphoonPosById=function(iTyphoonId){
		var iTyphoonCount=this.arrTyphoonInfo.length;
		var curPos=-1;
		for(var iPos=0;iPos<iTyphoonCount;iPos++){
			if(this.arrTyphoonInfo[iPos].id==iTyphoonId){
				curPos=iPos;
				break;
			}
		};
		return curPos;
	};
	this.AddTyphoon=function(objTyphoonInfo,arrExpAttrValue){
		var curTyhoon=new d7();
		curTyhoon.SetTyphoonInfo(objTyphoonInfo,arrExpAttrValue);
		this.arrTyphoonInfo.push(curTyhoon);
		var pos=this.arrTyphoonInfo.length-1;
		return pos;
	};
	this.DelTyphoonByPos=function(bDelAllTyphoon,iTyphoonPos){
		var bDelResult=false;
		if(bDelAllTyphoon==true){
			for(var i=0;i<this.arrTyphoonInfo.length;i++){
				var curTyphoon=this.arrTyphoonInfo[i];
				if(curTyphoon.img){
					g_objYimaEncMap.allCanvasDiv.removeChild(curTyphoon.img);
				}
			};
			this.arrTyphoonInfo=[];
			bDelResult=true;
		}
		else if(this.arrTyphoonInfo.length>iTyphoonPos){
			bDelResult=true;
			var curTyphoon=this.arrTyphoonInfo[iTyphoonPos];
			if(curTyphoon.img){
				g_objYimaEncMap.allCanvasDiv.removeChild(curTyphoon.img);
			};
			this.arrTyphoonInfo.splice(iTyphoonPos,1);
		};
		return bDelResult;
	};
	this.GetTyphoonCount=function(){
		var iCount=0;
		if(this.arrTyphoonInfo){
			iCount=this.arrTyphoonInfo.length;
		};
		return iCount;
	};
	this.GetTyphoonInfoByPos=function(iTyphoonPos){
		if(this.arrTyphoonInfo.length>iTyphoonPos){
			return this.arrTyphoonInfo[iTyphoonPos];
		}
		else{
			return null;
		}
	};
	this.SetTyphoonShowOrNotByPos=function(iTyphoonPos,bShowOrNot){
		var bSet=false;
		if(this.arrTyphoonInfo.length>iTyphoonPos){
			this.arrTyphoonInfo[iTyphoonPos].SetTyphoonShowOrNot(bShowOrNot);
			bSet=true;
		};
		return bSet;
	};
	this.SetTyphoonPoImgInfoByPos=function(iTyphoonPos,strImgSrc,width,height){
		var bSet=false;
		if(this.arrTyphoonInfo.length>iTyphoonPos){
			this.arrTyphoonInfo[iTyphoonPos].SetTyphoonPoImgInfo(strImgSrc,width,height);
			bSet=true;
		};
		return bSet;
	};
	this.AddTyphoonPredictTrackLineStyleByPos=function(iTyphoonPos,iWidth,strColor,iOpacity){
		var bSet=false;
		if(this.arrTyphoonInfo.length>iTyphoonPos){
			this.arrTyphoonInfo[iTyphoonPos].AddPredictTrackLineStyle(iWidth,strColor,iOpacity);
			bSet=true;
		};
		return bSet;
	};
	this.AddOneTyphoonTrack=function(iTyphoonPos,objTrackInfo,arrPredictTracks){
		var pos=-1;
		if(this.arrTyphoonInfo.length>iTyphoonPos&&iTyphoonPos>-1&&objTrackInfo){
			var curTyphoonTrack=new d9();
			curTyphoonTrack.SetTyphoonTrackInfo(objTrackInfo);
			curTyphoonTrack.arrPredictTracks=arrPredictTracks;
			this.arrTyphoonInfo[iTyphoonPos].arrTracks.push(curTyphoonTrack);
			pos=this.arrTyphoonInfo[iTyphoonPos].arrTracks.length-1;
			this.arrTyphoonInfo[iTyphoonPos].iCurShowTrackPos=pos;
		};
		return pos;
	};
	this.GetTyphoonTrackInfoByPos=function(iTyphoonPos,iTruePos,iPredictLinePos,iPredictPos){
		var curGetTrackInfo=null;
		if(this.arrTyphoonInfo.length>iTyphoonPos){
			if(this.arrTyphoonInfo[iTyphoonPos].arrTracks.length>iTruePos){
				var curTrueTrack=this.arrTyphoonInfo[iTyphoonPos].arrTracks[iTruePos];
				var bTrackTrue=true;
				if(iPredictPos!=null){
					if(curTrueTrack.arrPredictTracks.length>iPredictLinePos){
						var curArrPredictTrack=curTrueTrack.arrPredictTracks[iPredictLinePos];
						if(curArrPredictTrack.length>iPredictPos){
							bTrackTrue=false;
							curGetTrackInfo=curArrPredictTrack[iPredictPos];
						}
					}
				};
				if(bTrackTrue){
					curGetTrackInfo=curTrueTrack;
				}
			}
		};
		return curGetTrackInfo;
	}
};
function e2(mousePo,obj){
	var mousePosition={
		x:0,y:0
	};
	if(obj){
		var top,left;
		var ParentObj=obj;
		left=obj.offsetLeft;
		while(ParentObj=ParentObj.offsetParent){
			left+=ParentObj.offsetLeft;
		};
		mousePosition.x=(parseInt(mousePo.x-left)+parseInt(document.body.scrollLeft))-2;
		ParentObj=obj;
		top=obj.offsetTop;
		var iNum=1;
		while(ParentObj=ParentObj.offsetParent){
			top+=ParentObj.offsetTop;
			iNum++;
		};
		mousePosition.y=parseInt(mousePo.y-top)+parseInt(document.body.scrollTop)-2;
	};
	return mousePosition;
};
function e3(dx,dy,bLoadImgOrNot){
	if(G_V.objMapViewMaxMinGeoInfo.bCheck==true){
		var leftTopScrnPo=k0(G_V.objMapViewMaxMinGeoInfo.minLon,G_V.objMapViewMaxMinGeoInfo.maxLat,G_V.iCurScale);
		var rightButtomScrnPo=k0(G_V.objMapViewMaxMinGeoInfo.maxLon,G_V.objMapViewMaxMinGeoInfo.minLat,G_V.iCurScale);
		if(dx>0){
			var curMoveToLonLatPo=k6(G_V.iMapViewWidth-(G_V.dragMapLayerOriginPo.x-dx),G_V.iMapViewHeight/2,G_V.iCurScale);
			if(curMoveToLonLatPo.x>G_V.objMapViewMaxMinGeoInfo.maxLon){
				dx=0;
			}
		}
		else{
			var curMoveToLonLatPo=k6(dx-G_V.dragMapLayerOriginPo.x,G_V.iMapViewHeight/2,G_V.iCurScale);
			if(curMoveToLonLatPo.x<G_V.objMapViewMaxMinGeoInfo.minLon){
				dx=0;
			}
		};
		if(dy>0){
			var curMoveToLonLatPo=k6(G_V.iMapViewWidth/2,G_V.iMapViewHeight-(G_V.dragMapLayerOriginPo.y-dy),G_V.iCurScale);
			if(curMoveToLonLatPo.y<G_V.objMapViewMaxMinGeoInfo.minLat){
				dy=0;
			}
		}
		else{
			var curMoveToLonLatPo=k6(G_V.iMapViewWidth/2,dy-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
			if(curMoveToLonLatPo.y>G_V.objMapViewMaxMinGeoInfo.maxLat){
				dy=0;
			}
		}
	};
	if(dx||dy){
		if(dx){
			dx=parseInt(dx);
			G_V.dragMapLayerOriginPo.x-=dx;
			G_V.dragMoveOffsetAfterUpdateGridPo.x-=dx;
		};
		if(dy){
			dy=parseInt(dy);
			G_V.dragMapLayerOriginPo.y-=dy;
			G_V.dragMoveOffsetAfterUpdateGridPo.y-=dy;
		};
		g_objYimaEncMap.viewMapMainDiv.style.left=G_V.dragMapLayerOriginPo.x+"px";
		g_objYimaEncMap.viewMapMainDiv.style.top=G_V.dragMapLayerOriginPo.y+"px";
		g_objImgGridClass.moveGriddedTiles();
		if(typeof ReturnDragMap==='function'){
			ReturnDragMap();
		};
		e4();
		return true;
	};
	return false;
};
function e4(){
	var iShipCount=g_objManShipClass.arrShowShipPosInfo.length;
	var curGeoPo=[];
	for(var i=0;i<iShipCount;i++){
		var pos=g_objManShipClass.arrShowShipPosInfo[i];
		curGeoPo.x=g_objManShipClass.arrShipInfo[pos].shipGeoPoX;
		curGeoPo.y=g_objManShipClass.arrShipInfo[pos].shipGeoPoY;
		var scrnShipPo=a2(curGeoPo,false);
		var scrnDivPo=[];
		scrnDivPo.x=parseInt(g_objManShipClass.arrShipInfo[pos].shipInfoDivObj.offsetScrnPo.x)+parseInt(scrnShipPo.x);
		scrnDivPo.y=parseInt(g_objManShipClass.arrShipInfo[pos].shipInfoDivObj.offsetScrnPo.y)+parseInt(scrnShipPo.y);
		g_objManShipClass.arrShipInfo[pos].shipInfoDivObj.divObj.style.left=scrnDivPo.x+"px";
		g_objManShipClass.arrShipInfo[pos].shipInfoDivObj.divObj.style.top=scrnDivPo.y+"px";
	}
};
function e5(canvas,sz){
	if(canvas&&sz){
		canvas.width=sz.w;
		canvas.height=sz.h;
	}
};
function e6(zoomType,zoomScrnPo){
	if(G_V.bIsLicenceKeyOK==false){
		var nowDate=new Date();
		if(nowDate.getTime()>G_V.iValidityTime){
			G_V.setShowValidityInfoInfo(true);
			return;
		}
	};
	if(zoomType>0){
		if(parseInt(G_V.iCurScale)==parseInt(G_V.arrScaleInfo[0])||parseInt(G_V.iCurScale)<parseInt(G_V.arrScaleInfo[0])+100){
			G_V.iTouchModel=TouchPos.endZoom;
			return false;
		}
	}
	else{
		var maxScale=parseInt(G_V.arrScaleInfo[G_V.arrScaleInfo.length-1]);
		if(parseInt(G_V.iCurScale)==maxScale||parseInt(G_V.iCurScale)>maxScale-100){
			G_V.iTouchModel=TouchPos.endZoom;
			return false;
		}
	};
	if(G_V.zoomTimerId!=null){
		return false;
	};
	if(G_V.objMapViewMaxMinGeoInfo.bCheck){
		var curZoomLonLatPo=k6(zoomScrnPo.x-G_V.dragMapLayerOriginPo.x,zoomScrnPo.y-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
		if(curZoomLonLatPo.x<G_V.objMapViewMaxMinGeoInfo.minLon||curZoomLonLatPo.x>G_V.objMapViewMaxMinGeoInfo.maxLon||curZoomLonLatPo.y<G_V.objMapViewMaxMinGeoInfo.minLat||curZoomLonLatPo.y>G_V.objMapViewMaxMinGeoInfo.maxLat){
			return false;
		}
	};
	G_V.iTouchModel=TouchPos.doZoom;
	var centerScrnPo={
		x:G_V.iMapViewWidth/ 2, y: G_V.iMapViewHeight /2
	};
	if(zoomScrnPo==null||zoomScrnPo==undefined||parseInt(G_V.iCurScale)>30000000||G_V.centerLonLatPo.x<0||G_V.centerLonLatPo.y<0){
		zoomScrnPo=centerScrnPo;
	};
	g_zoomOriginScrnPo=zoomScrnPo;
	if(zoomType>0){
		g_iOneAddSizePo={
			x:G_V.iMapViewWidth/ 4, y: G_V.iMapViewHeight /4
		};
		g_OneMoveSizePo={
			x:-zoomScrnPo.x/ 4, y: -zoomScrnPo.y /4
		};
	}
	else{
		g_iOneAddSizePo={
			x:-G_V.iMapViewWidth/ 8, y: -G_V.iMapViewHeight /8
		};
		g_OneMoveSizePo={
			x:zoomScrnPo.x/ 8, y: zoomScrnPo.y /8
		};
	};
	g_curDrawImgSizePo={
		x:G_V.iMapViewWidth,y:G_V.iMapViewHeight
	};
	g_curMoveSizePo={
		x:0,y:0
	};
	var newScale;
	var newCenterScrnPo=[];
	if(zoomType>0){
		G_V.iCurLevel+=1;
		newCenterScrnPo.x=centerScrnPo.x+(zoomScrnPo.x-centerScrnPo.x)/2-G_V.dragMapLayerOriginPo.x;
		newCenterScrnPo.y=centerScrnPo.y+(zoomScrnPo.y-centerScrnPo.y)/2-G_V.dragMapLayerOriginPo.y;
		newScale=G_V.iCurScale*0.5;
	}
	else{
		G_V.iCurLevel-=1;
		newCenterScrnPo.x=centerScrnPo.x-(zoomScrnPo.x-centerScrnPo.x)-G_V.dragMapLayerOriginPo.x;
		newCenterScrnPo.y=centerScrnPo.y-(zoomScrnPo.y-centerScrnPo.y)-G_V.dragMapLayerOriginPo.y;
		newScale=G_V.iCurScale*2;
	};
	g_iCurZoomCount=0;
	var newLonLatPo={
		x:null,y:null
	};
	if(newCenterScrnPo.x!=centerScrnPo.x||newCenterScrnPo.x!=centerScrnPo.x){
		newLonLatPo=k6(newCenterScrnPo.x,newCenterScrnPo.y,G_V.iCurScale);
	};
	k4(newLonLatPo.x,newLonLatPo.y,newScale,true);
	k5();
	b1();
	var firstTitleImg;
	if(g_objImgGridClass.curShowImgGridNum==1){
		firstTitleImg=g_objImgGridClass.arrImgGrid1[0][0];
	}
	else{
		firstTitleImg=g_objImgGridClass.arrImgGrid2[0][0];
	};
	g_firstImgStartScrnPo={
		x:parseInt(firstTitleImg.x),y:parseInt(firstTitleImg.y)
	};
	if(G_V.bShowZoomArrowSign){
		e7(zoomType,{
			x:zoomScrnPo.x-G_V.drawObjCanvasPo.x,y:zoomScrnPo.y-G_V.drawObjCanvasPo.y
		});
	};
	G_V.zoomTimerId=setInterval(e9,50);
	return true;
};
function e7(zoomType,zoomScrnPo){
	if(g_drawZoomArrowTimer){
		clearInterval(g_drawZoomArrowTimer);
		g_drawZoomArrowTimer=null;
	};
	g_iCurDrawZoomArrowCount=0;
	g_zoomType=zoomType;
	g_mDrawZoomArrowCenterScrnPo=zoomScrnPo;
	e8();
	g_drawZoomArrowTimer=setInterval(e8,50);
};
var g_drawZoomArrowTimer=null;
var g_iCurDrawZoomArrowCount=0;
var g_zoomType=0;
var g_mDrawZoomArrowCenterScrnPo={
	x:500,y:200
};
var g_iMaxMoveScrnSize=40;
function e8(){
	g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawZoomArrowSignCanvas,g_objYimaEncMap.drawZoomArrowSignCanvas2D);
	g_objHtml5DrawClass.SetLineStyle(g_objYimaEncMap.drawZoomArrowSignCanvas2D,2,"#FF0000",80);
	g_iCurDrawZoomArrowCount++;
	var curMoveOffsetScrnLen=g_iCurDrawZoomArrowCount*4;
	var arrLeftTopScrnPo,arrRightTopScrnPo,arrLeftButtomScrnPo,arrRightButommScrnPo;
	var mLeftTopScrnPo,mRightTopScrnPo,mLeftButtomScrnPo,mRightButommScrnPo;
	var iArrowSignSize=6;
	if(g_zoomType==1){
		mLeftTopScrnPo={
			x:g_mDrawZoomArrowCenterScrnPo.x-curMoveOffsetScrnLen,y:g_mDrawZoomArrowCenterScrnPo.y-curMoveOffsetScrnLen
		};
		mRightTopScrnPo={
			x:g_mDrawZoomArrowCenterScrnPo.x+parseInt(curMoveOffsetScrnLen),y:g_mDrawZoomArrowCenterScrnPo.y-curMoveOffsetScrnLen
		};
		mLeftButtomScrnPo={
			x:g_mDrawZoomArrowCenterScrnPo.x-curMoveOffsetScrnLen,y:g_mDrawZoomArrowCenterScrnPo.y+parseInt(curMoveOffsetScrnLen)
		};
		mRightButommScrnPo={
			x:g_mDrawZoomArrowCenterScrnPo.x+parseInt(curMoveOffsetScrnLen),y:g_mDrawZoomArrowCenterScrnPo.y+parseInt(curMoveOffsetScrnLen)
		};
		arrLeftTopScrnPo=[];
		arrLeftTopScrnPo.push({
			x:mLeftTopScrnPo.x,y:mLeftTopScrnPo.y+parseInt(iArrowSignSize)
		});
		arrLeftTopScrnPo.push(mLeftTopScrnPo);
		arrLeftTopScrnPo.push({
			x:mLeftTopScrnPo.x+parseInt(iArrowSignSize),y:mLeftTopScrnPo.y
		});
		arrRightTopScrnPo=[];
		arrRightTopScrnPo.push({
			x:mRightTopScrnPo.x-iArrowSignSize,y:mRightTopScrnPo.y
		});
		arrRightTopScrnPo.push(mRightTopScrnPo);
		arrRightTopScrnPo.push({
			x:mRightTopScrnPo.x,y:mRightTopScrnPo.y+parseInt(iArrowSignSize)
		});
		arrLeftButtomScrnPo=[];
		arrLeftButtomScrnPo.push({
			x:mLeftButtomScrnPo.x,y:mLeftButtomScrnPo.y-iArrowSignSize
		});
		arrLeftButtomScrnPo.push(mLeftButtomScrnPo);
		arrLeftButtomScrnPo.push({
			x:mLeftButtomScrnPo.x+parseInt(iArrowSignSize),y:mLeftButtomScrnPo.y
		});
		arrRightButommScrnPo=[];
		arrRightButommScrnPo.push({
			x:mRightButommScrnPo.x-iArrowSignSize,y:mRightButommScrnPo.y
		});
		arrRightButommScrnPo.push(mRightButommScrnPo);
		arrRightButommScrnPo.push({
			x:mRightButommScrnPo.x,y:mRightButommScrnPo.y-iArrowSignSize
		})
	}
	else{
		mLeftTopScrnPo={
			x:g_mDrawZoomArrowCenterScrnPo.x-g_iMaxMoveScrnSize+parseInt(curMoveOffsetScrnLen),y:g_mDrawZoomArrowCenterScrnPo.y-g_iMaxMoveScrnSize+parseInt(curMoveOffsetScrnLen)
		};
		mRightTopScrnPo={
			x:g_mDrawZoomArrowCenterScrnPo.x+parseInt(g_iMaxMoveScrnSize)-curMoveOffsetScrnLen,y:g_mDrawZoomArrowCenterScrnPo.y-g_iMaxMoveScrnSize+parseInt(curMoveOffsetScrnLen)
		};
		mLeftButtomScrnPo={
			x:g_mDrawZoomArrowCenterScrnPo.x-g_iMaxMoveScrnSize+parseInt(curMoveOffsetScrnLen),y:g_mDrawZoomArrowCenterScrnPo.y+parseInt(g_iMaxMoveScrnSize)-curMoveOffsetScrnLen
		};
		mRightButommScrnPo={
			x:g_mDrawZoomArrowCenterScrnPo.x+parseInt(g_iMaxMoveScrnSize)-curMoveOffsetScrnLen,y:g_mDrawZoomArrowCenterScrnPo.y+parseInt(g_iMaxMoveScrnSize)-curMoveOffsetScrnLen
		};
		arrLeftTopScrnPo=[];
		arrLeftTopScrnPo.push({
			x:mLeftTopScrnPo.x-iArrowSignSize,y:mLeftTopScrnPo.y
		});
		arrLeftTopScrnPo.push(mLeftTopScrnPo);
		arrLeftTopScrnPo.push({
			x:mLeftTopScrnPo.x,y:mLeftTopScrnPo.y-iArrowSignSize
		});
		arrRightTopScrnPo=[];
		arrRightTopScrnPo.push({
			x:mRightTopScrnPo.x,y:mRightTopScrnPo.y-iArrowSignSize
		});
		arrRightTopScrnPo.push(mRightTopScrnPo);
		arrRightTopScrnPo.push({
			x:mRightTopScrnPo.x+parseInt(iArrowSignSize),y:mRightTopScrnPo.y
		});
		arrLeftButtomScrnPo=[];
		arrLeftButtomScrnPo.push({
			x:mLeftButtomScrnPo.x-iArrowSignSize,y:mLeftButtomScrnPo.y
		});
		arrLeftButtomScrnPo.push(mLeftButtomScrnPo);
		arrLeftButtomScrnPo.push({
			x:mLeftButtomScrnPo.x,y:mLeftButtomScrnPo.y+parseInt(iArrowSignSize)
		});
		arrRightButommScrnPo=[];
		arrRightButommScrnPo.push({
			x:mRightButommScrnPo.x,y:mRightButommScrnPo.y+parseInt(iArrowSignSize)
		});
		arrRightButommScrnPo.push(mRightButommScrnPo);
		arrRightButommScrnPo.push({
			x:mRightButommScrnPo.x+parseInt(iArrowSignSize),y:mRightButommScrnPo.y
		});
	};
	g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawZoomArrowSignCanvas2D,arrLeftTopScrnPo,false,0,0);
	g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawZoomArrowSignCanvas2D,arrRightTopScrnPo,false,0,0);
	g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawZoomArrowSignCanvas2D,arrLeftButtomScrnPo,false,0,0);
	g_objHtml5DrawClass.DrawLine(g_objYimaEncMap.drawZoomArrowSignCanvas2D,arrRightButommScrnPo,false,0,0);
	if(g_iCurDrawZoomArrowCount>8){
		clearInterval(g_drawZoomArrowTimer);
		g_drawZoomArrowTimer=null;
		g_objHtml5DrawClass.Clear(g_objYimaEncMap.drawZoomArrowSignCanvas,g_objYimaEncMap.drawZoomArrowSignCanvas2D);
	}
};
var g_iCurZoomCount=4;
var g_zoomOriginScrnPo={
	x:0,y:0
};
var g_OneMoveSizePo={
	x:0,y:0
};
var g_curDrawImgSizePo={
	x:0,y:0
};
var g_curMoveSizePo={
	x:0,y:0
};
var g_firstImgStartScrnPo={
	x:0,y:0
};
function e9(){
	if(parseInt(g_iCurZoomCount)>parseInt(3)){
		clearInterval(G_V.zoomTimerId);
		G_V.zoomTimerId=null;
		f1();
		if(typeof ReturnZoomMapForPc==='function'){
			ReturnZoomMapForPc();
		};
		G_V.iTouchModel=TouchPos.endZoom;
		g_iCurZoomCount=0;
	}
	else{
		g_curDrawImgSizePo.x+=parseInt(g_iOneAddSizePo.x);
		g_curDrawImgSizePo.y+=parseInt(g_iOneAddSizePo.y);
		g_curMoveSizePo.x+=parseInt(g_OneMoveSizePo.x);
		g_curMoveSizePo.y+=parseInt(g_OneMoveSizePo.y);
		var pX=g_curDrawImgSizePo.x/G_V.iMapViewWidth;
		var pY=g_curDrawImgSizePo.y/G_V.iMapViewHeight;
		if(g_iCurZoomCount==0){
			var hiddenImgGridNum=g_objImgGridClass.curShowImgGridNum==1?2:1;
			f2(hiddenImgGridNum,false);
			g_objDrawObjClass.ClearShipCanvas();
			g_objDrawObjClass.ClearObjCanvas();
			g_objDrawObjClass.ClearTyphoonCanvas();
			g_objDrawObjClass.ClearShipHistroyTrackCanvas();
			g_objDrawObjClass.ClearFishAreaCanvas();
			g_objDrawObjClass.ClearLonLatLineCanvas();
		};
		f0(pX,pY);
	};
	g_iCurZoomCount++;
};
function f0(pX,pY){
	var firstImgLeft=g_firstImgStartScrnPo.x+parseInt((g_zoomOriginScrnPo.x-g_firstImgStartScrnPo.x-G_V.dragMapLayerOriginPo.x)*(1-pX));
	var firstImgTop=g_firstImgStartScrnPo.y+parseInt((g_zoomOriginScrnPo.y-g_firstImgStartScrnPo.y-G_V.dragMapLayerOriginPo.y)*(1-pY));
	var firstImgScrnPo={
		x:firstImgLeft,y:firstImgTop
	};
	var curImgSize={
		x:parseInt(pX*G_V.iImgWidth),y:parseInt(pY*G_V.iImgHeight)
	};
	for(var r=0;r<g_objImgGridClass.minRows;r++){
		if(g_objImgGridClass.curShowImgGridNum==1){
			if(!g_objImgGridClass.arrImgGrid1[r]){
				continue;
			}
		}
		else{
			if(!g_objImgGridClass.arrImgGrid2[r]){
				continue;
			}
		};
		for(var c=0;c<g_objImgGridClass.minCols;c++){
			var curTitleImg;
			if(g_objImgGridClass.curShowImgGridNum==1){
				curTitleImg=g_objImgGridClass.arrImgGrid1[r][c];
			}
			else{
				curTitleImg=g_objImgGridClass.arrImgGrid2[r][c];
			};
			var imgStyle=curTitleImg.img.style;
			if(curTitleImg){
				var curLeft=firstImgScrnPo.x+parseInt(curImgSize.x)*c;
				var curTop=firstImgScrnPo.y+parseInt(curImgSize.y)*r;
				curTitleImg.img.id="mapImg"+Math.random();
				imgStyle.left=curLeft+"px";
				imgStyle.top=curTop+"px";
				imgStyle.width=curImgSize.x+"px";
				imgStyle.height=curImgSize.y+"px";
			}
		}
	}
};
function f1(){
	if(g_objYimaEncMap.viewMapImgDiv1==null||g_objYimaEncMap.viewMapImgDiv2==null){
		return
	};
	if(g_objImgGridClass.curShowImgGridNum==1){
		g_objImgGridClass.curShowImgGridNum=2;
		g_objYimaEncMap.viewMapImgDiv1.style.left=G_V.dragMapLayerOriginPo.x+"px";
		g_objYimaEncMap.viewMapImgDiv1.style.top=G_V.dragMapLayerOriginPo.y+"px";
	}
	else{
		g_objImgGridClass.curShowImgGridNum=1;
		g_objYimaEncMap.viewMapImgDiv2.style.left=G_V.dragMapLayerOriginPo.x+"px";
		g_objYimaEncMap.viewMapImgDiv2.style.top=G_V.dragMapLayerOriginPo.y+"px";
	};
	G_V.dragMapLayerOriginPo={
		x:0,y:0
	};
	G_V.firstImgTitleNums={
		col:0,row:0
	};
	g_objYimaEncMap.viewMapMainDiv.style.left="0px";
	g_objYimaEncMap.viewMapMainDiv.style.top="0px";
	g_objDrawObjClass.RedrawAllObjAfterChange();
	g_objImgGridClass.initImgGridded();
};
function f2(ImgGridNum,bShowOrNot){
	for(var r=0;r<g_objImgGridClass.minRows;r++){
		if(ImgGridNum==1){
			if(!g_objImgGridClass.arrImgGrid1[r]){
				continue;
			}
		}
		else{
			if(!g_objImgGridClass.arrImgGrid2[r]){
				continue;
			}
		};
		for(var c=0;c<g_objImgGridClass.minCols;c++){
			var curTitleImg;
			if(ImgGridNum==1){
				curTitleImg=g_objImgGridClass.arrImgGrid1[r][c];
			}
			else{
				curTitleImg=g_objImgGridClass.arrImgGrid2[r][c];
			};
			if(curTitleImg){
				curTitleImg.img.style.display=bShowOrNot==true?"block":"none";
			}
		}
	}
};
function f3(scale,bUpOrDown){
	var pos=0;
	var scaleCount=G_V.arrScaleInfo.length;
	for(var i=0;i<scaleCount;i++){
		if(G_V.arrScaleInfo[i]==scale){
			pos=i;
			break;
		}
		else if(G_V.arrScaleInfo[i]>scale){
			pos=i;
			if(bUpOrDown&&bUpOrDown==true){
				pos--;
			};
			break;
		}
	};
	if(pos<0){
		pos=0;
	}
	else if(pos>scaleCount-1){
		pos=scaleCount-1;
	};
	return pos;
};
function f4(cursorStyle){
	g_objYimaEncMap.div.style.cursor=cursorStyle;
};
function f5(curSelectObjScrnPo,iCheckScrnLen){
	var bSelectObj=false;
	var bReturnInfo=false;
	var bClearDrawMouseMoveSelObjCanvas=true;
	if(G_V.iCurScale<G_V.iSelectShipByScrnPoMaxScale||G_V.iCurScale<G_V.iShowShipHistroyTrackScale){
		var curSelectShipObj=g_objDrawObjClass.SelectScrnShipInfo(curSelectObjScrnPo,iCheckScrnLen);
		if(curSelectShipObj!=null){
			var iSelectShipId=curSelectShipObj.id;
			bSelectObj=true;
			bReturnInfo=true;
			if(G_V.objMouseMoveSelectInfo!=null){
				if(G_V.objMouseMoveSelectInfo.objType==1){
					if(G_V.objMouseMoveSelectInfo.id==iSelectShipId&&G_V.objMouseMoveSelectInfo.iTrackPos==curSelectShipObj.iTrackPos){
						bReturnInfo=false;
						bClearDrawMouseMoveSelObjCanvas=false;
					}
					else{}
				}
			};
			if(bReturnInfo==true){
				G_V.objMouseMoveSelectInfo=null;
				G_V.objMouseMoveSelectInfo={
					objType:1,id:iSelectShipId,po:curSelectObjScrnPo,iTrackPos:curSelectShipObj.iTrackPos,bSelPlayTrackShip:curSelectShipObj.bSelPlayTrackShip
				};
				if(curSelectShipObj.iTrackPos!=undefined&&curSelectShipObj.iTrackPos!=null){
					var pos=g_objManShipClass.GetShipPosById(iSelectShipId);
					var curShipInfo=g_objManShipClass.GetShipInfoByPos(pos)
				}
				else{
					if(curSelectShipObj.iTrackPos!=null){
						bClearDrawMouseMoveSelObjCanvas=false;
						g_objDrawObjClass.DrawShipOneTrack(curSelectShipObj.po,"#FF0000");
					}
					else{
						var pos=g_objManHistoryTrackClass.GetShipPosById(iSelectShipId);
						var curShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(pos)
					}
				}
			}
		}
		else{
			if(G_V.objMouseMoveSelectInfo!=null&&G_V.objMouseMoveSelectInfo.objType==1){
				g_objDrawObjClass.DrawShipOneTrack(G_V.objMouseMoveSelectInfo.po,null);
			}
		}
	};
	if(bSelectObj==false){
		var selectPointObj=g_objDrawObjClass.SelectScrnPointObjInfo(curSelectObjScrnPo);
		if(selectPointObj){
			bReturnInfo=true;
			bSelectObj=true;
			bClearDrawMouseMoveSelObjCanvas=false;
			if(G_V.objMouseMoveSelectInfo!=null&&G_V.objMouseMoveSelectInfo.objType==2){
				if(G_V.objMouseMoveSelectInfo.layerId==selectPointObj.layerId&&G_V.objMouseMoveSelectInfo.objId==selectPointObj.objId){
					bReturnInfo=false;
				}
			};
			if(bReturnInfo==true){
				G_V.objMouseMoveSelectInfo=null;
				G_V.objMouseMoveSelectInfo={
					objType:2,layerId:selectPointObj.layerId,objId:selectPointObj.objId,po:curSelectObjScrnPo
				};
			}
		}
	};
	if(bSelectObj==false){
		var selectTyphoonObj=g_objDrawObjClass.SelectScrnTyphoonTrackInfo(curSelectObjScrnPo,5);
		if(selectTyphoonObj){
			bSelectObj=true;
			bReturnInfo=true;
			bClearDrawMouseMoveSelObjCanvas=false;
			if(G_V.objMouseMoveSelectInfo!=null&&G_V.objMouseMoveSelectInfo.objType==3){
				if(G_V.objMouseMoveSelectInfo.typhoonId==selectTyphoonObj.typhoonId&&G_V.objMouseMoveSelectInfo.iTruePos==selectTyphoonObj.iTruePos&&G_V.objMouseMoveSelectInfo.iPredictPos==selectTyphoonObj.iPredictPos){
					bReturnInfo=false;
				}
			};
			if(bReturnInfo==true){
				G_V.objMouseMoveSelectInfo=null;
				G_V.objMouseMoveSelectInfo={
					objType:3,typhoonId:selectTyphoonObj.typhoonId,iTruePos:selectTyphoonObj.iTruePos,iPredictLinePos:selectTyphoonObj.iPredictLinePos,iPredictPos:selectTyphoonObj.iPredictPos,po:curSelectObjScrnPo
				};
			}
		}
	};
	if(bSelectObj==false){
		if(G_V.bSelectAllObjByMouseMove&&G_V.iSelectAllObjByMouseMoveScale>G_V.iCurScale-1){
			var selObjInfo=g_objManObjClass.SelectCurScrnShowObjectInfoByScrnPo(curSelectObjScrnPo,false);
			if(selObjInfo){
				bReturnInfo=true;
				bSelectObj=true;
				bClearDrawMouseMoveSelObjCanvas=false;
				var layerId=selObjInfo[0].layerId;
				var objId=selObjInfo[0].objId;
				if(G_V.objMouseMoveSelectInfo!=null&&G_V.objMouseMoveSelectInfo.objType==2){
					if(G_V.objMouseMoveSelectInfo.layerId==layerId&&G_V.objMouseMoveSelectInfo.objId==objId){
						bReturnInfo=false;
					}
				};
				if(bReturnInfo==true){
					G_V.objMouseMoveSelectInfo=null;
					G_V.objMouseMoveSelectInfo={
						objType:2,layerId:layerId,objId:objId,po:curSelectObjScrnPo
					};
				}
			}
		}
	};
	if(bSelectObj==false){
		f4("default");
		G_V.objMouseMoveSelectInfo=null;
	}
	else{
		f4("pointer");
	};
	if(bClearDrawMouseMoveSelObjCanvas==true){
		g_objDrawObjClass.ClearDrawMouseMoveSelObjCanvas();
	};
	if(G_V.iCurSdkModelType==SDK_MODEL_TYPE.pc){
		if(typeof ReturnSelectObjByMouseMove==='function'){
			ReturnSelectObjByMouseMove(G_V.objMouseMoveSelectInfo);
		}
	};
	return bSelectObj;
};
function f6(scrnPo){
	var bSelectObjOrNot=false;
	if(G_V.objMouseMoveSelectInfo){
		if(typeof ReturnSelectObjByMouseLeftDown==='function'){
			ReturnSelectObjByMouseLeftDown(G_V.objMouseMoveSelectInfo);
		};
		bSelectObjOrNot=true;
		if(G_V.objMouseMoveSelectInfo.objType==3){
			var selectTyphoonObj=G_V.objMouseMoveSelectInfo;
			if(selectTyphoonObj.iPredictPos==null){
				var iTyphoonPos=g_objManTyphoon.GetTyphoonPosById(selectTyphoonObj.typhoonId);
				var curSelectTyohoon=g_objManTyphoon.GetTyphoonInfoByPos(iTyphoonPos);
				if(curSelectTyohoon){
					if(curSelectTyohoon.iCurShowTrackPos!=selectTyphoonObj.iTruePos){
						curSelectTyohoon.iCurShowTrackPos=selectTyphoonObj.iTruePos;
						g_objDrawObjClass.ClearTyphoonCanvas();
						g_objDrawObjClass.DrawAllTyphoon();
					}
				}
			}
		}
	};
	return bSelectObjOrNot;
};
function f7(lon,lat,scale){
	if(scale==null||scale==G_V.G_V.iCurScale){
		var scrnPo=k0(lon,lat,G_V.iCurScale);
		scrnPo.x+=G_V.dragMapLayerOriginPo.x;
		scrnPo.y+=G_V.dragMapLayerOriginPo.y;
		var mapSize=G_V.getMapViewSize();
		if(scrnPo.x>-mapSize.x*2&&scrnPo.x<mapSize.x*2&&scrnPo.y>-mapSize.y*2&&scrnPo.y<mapSize.y*2){
			e3(-parseInt(mapSize.x/ 2 - scrnPo.x), -parseInt(mapSize.y /2-scrnPo.y),true);
			g_objDrawObjClass.RedrawAllObjAfterChange();
			return;
		}
	};
	k4(lon,lat,scale,true);
	k5();
	f1();
	b1();
};
function f8(lon,lat,scale,bUpdateSlider){
	k4(lon,lat,scale,bUpdateSlider);
	k5();
	f1();
	b1();
};
function f9(e){
	G_V.bStartDragZoomSlider=true;
	if(G_V.moveZoomSliderDivObj.setCapture){
		G_V.moveZoomSliderDivObj.setCapture();
	};
	if(G_V.timerOutHiddenScaleLevelDiv){
		clearTimeout(G_V.timerOutHiddenScaleLevelDiv);
		G_V.timerOutHiddenScaleLevelDiv=null
	};
	if(G_V.showToolBarOffsetPo.bShow==true){
		G_V.showScaleLevelDivObj.style.display="block";
	}
};
function g0(e){
	var curMouseScrnPo={
		x:e.clientX,y:e.clientY
	};
	var curMousePosition=e2(curMouseScrnPo,g_objYimaEncMap.div);
	var iNewTop=curMousePosition.y;
	if(G_V.bStartDragZoomSlider==true){
		if(iNewTop>G_V.moveZoomSliderImgMinMaxScrnY.maxY){
			iNewTop=G_V.moveZoomSliderImgMinMaxScrnY.maxY;
		}
		else if(iNewTop<G_V.moveZoomSliderImgMinMaxScrnY.minY){
			iNewTop=G_V.moveZoomSliderImgMinMaxScrnY.minY;
		};
		var iScaleLevel=parseInt(G_V.arrScaleInfo.length);
		var iScrnLenPerLevel=parseInt(G_V.moveZoomSliderImgMinMaxScrnY.maxY-G_V.moveZoomSliderImgMinMaxScrnY.minY)/(iScaleLevel-1);
		var iCurSliderPoY=parseInt(G_V.moveZoomSliderDivObj.style.top)-G_V.moveZoomSliderImgMinMaxScrnY.minY;
		var iCurScaleLevel=parseInt(iCurSliderPoY/iScrnLenPerLevel);
		if(iCurScaleLevel>iScaleLevel-1){
			iCurScaleLevel=iScaleLevel-1;
		};
		G_V.showScaleLevelDivObj.innerHTML=parseInt(iScaleLevel-iCurScaleLevel+G_V.objMapLevelValue.min-1)+1;
		G_V.showScaleLevelDivObj.style.top=iNewTop+"px";
		G_V.moveZoomSliderDivObj.style.top=iNewTop+"px";
	}
};
function g1(){
	G_V.showScaleLevelDivObj.style.display="none"
};
function g2(e){
	G_V.bStartDragZoomSlider=false;
	if(G_V.moveZoomSliderDivObj.releaseCapture){
		G_V.moveZoomSliderDivObj.releaseCapture();
	};
	G_V.timerOutHiddenScaleLevelDiv=setTimeout(g1,3000);
	var iNewLevel=parseInt(G_V.showScaleLevelDivObj.innerHTML)-1;
	API_SetMapLevel(iNewLevel,null)
};
function g3(bSlider2Scale){
	var iScaleLevel=parseInt(G_V.arrScaleInfo.length);
	if(isNaN(iScaleLevel)==false&&iScaleLevel>1){
		var iScrnLenPerLevel=parseInt(G_V.moveZoomSliderImgMinMaxScrnY.maxY-G_V.moveZoomSliderImgMinMaxScrnY.minY)/(iScaleLevel-1);
		var iCurScaleLevel=1;
		if(bSlider2Scale){
			var iCurSliderPoY=parseInt(G_V.moveZoomSliderDivObj.style.top)-G_V.moveZoomSliderImgMinMaxScrnY.minY;
			iCurScaleLevel=parseInt(iCurSliderPoY/iScrnLenPerLevel);
			if(iCurScaleLevel>iScaleLevel-1){
				iCurScaleLevel=iScaleLevel-1;
			};
			var iNewScale=G_V.arrScaleInfo[iCurScaleLevel];
			if(G_V.iCurScale!=iNewScale){
				f8(null,null,iNewScale,false);
			}
		}
		else{
			iCurScaleLevel=g4(G_V.iCurScale);
			var iNewSliderPoY=parseInt(G_V.moveZoomSliderImgMinMaxScrnY.minY)+parseInt(iCurScaleLevel*iScrnLenPerLevel);
			if(G_V.timerOutHiddenScaleLevelDiv){
				clearTimeout(G_V.timerOutHiddenScaleLevelDiv);
				G_V.timerOutHiddenScaleLevelDiv=null
			};
			G_V.timerOutHiddenScaleLevelDiv=setTimeout(g1,3000);
			G_V.showScaleLevelDivObj.style.top=iNewSliderPoY+"px";
			G_V.moveZoomSliderDivObj.style.top=iNewSliderPoY+"px";
		};
		if(G_V.iCurMapImgInfoModeType==MAP_IMG_MODE_TYPE.YimaType){
			G_V.showScaleLevelDivObj.innerHTML=parseInt(iScaleLevel-iCurScaleLevel)+1;
			G_V.moveZoomSliderDivObj.title="级数:"+(parseInt(iScaleLevel-iCurScaleLevel)+1);
		}
		else{
			G_V.showScaleLevelDivObj.innerHTML=parseInt(G_V.iCurLevel)+1;
			G_V.moveZoomSliderDivObj.title="级数:"+(parseInt(G_V.iCurLevel)+1);
		}
	}
};
function g4(iScale){
	var iLevel=0;
	var iScaleLevelCount=parseInt(G_V.arrScaleInfo.length);
	for(var i=iScaleLevelCount-1;i>0;i--){
		if(G_V.arrScaleInfo[i]>iScale){
			continue;
		}
		else{
			iLevel=i;
			if(i<iScaleLevelCount-1){
				var iNextScale=G_V.arrScaleInfo[i+1];
				if(iNextScale-iScale<iScale-G_V.arrScaleInfo[i]){
					iLevel=i+1;
				}
			};
			break;
		}
	};
	return iLevel;
};
function g5(id){
	var _this=document.getElementById(id);
	if(navigator.userAgent.indexOf("Firefox")>0){
		_this.addEventListener('DOMMouseScroll',function(e){
			_this.scrollTop+=e.detail>0?60:-60;
			e.preventDefault();
		}
		,false);
	}
	else{
		_this.onmousewheel=function(e){
			e=e||window.event;
			_this.scrollTop+=e.wheelDelta>0?-60:60;
			return false;
		}
	};
	return this;
};
function g6(str){
	if(str==null){
		return 0;
	};
	if(typeof str!="string"){
		str+="";
	};
	return str.replace(/[^\x00-\xff]/g,"01").length;
};
function g7(px,py,mx,my){
	var x=Math.abs(px-mx);
	var y=Math.abs(py-my);
	var z=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	var cos=y/z;
	var radina=Math.acos(cos);
	var angle=Math.floor(180/ (Math.PI /radina));
	if(mx>px&&my>py){
		angle=180-angle
	};
	if(mx==px&&my>py){
		angle=180
	};
	if(mx>px&&my==py){
		angle=90
	};
	if(mx<px&&my>py){
		angle=180+angle
	};
	if(mx<px&&my==py){
		angle=270
	};
	if(mx<px&&my<py){
		angle=360-angle
	};
	return angle
};
function g8(){
	this.x=0;
	this.y=0;
	this.name="";
};
function g9(){
	this.arrWayPoints=new Array();
	this.name="";
	this.id=0;
	this.bShowOrNot=true;
	this.attrValue=null;
	this.strLineColor="#000000";
	this.iLineSize=2;
	this.iCircleR=3;
	this.strFillCircleColor="#FFFFFF";
};
function h0(){
	this.arrRouteInfo=new Array();
};
function h1(){
	this.m_lineColor="#000000";
	this.m_lineSize=1;
	this.m_lineOpacity=1;
	this.m_fillColor="#FF0000";
	this.m_fillOpacity=1;
	this.m_iTextSize=18;
	this.m_strTextColor="#000000";
	this.m_textOpacity=1;
	this.SetLineStyle=function(iLineWidth,strLineColor,iOpacity){
		this.m_lineColor=strLineColor;
		this.m_lineSize=iLineWidth;
		this.m_lineOpacity=parseFloat(iOpacity)/100;
	};
	this.SetFillStyle=function(strFillColor,iOpacity){
		this.m_fillColor=strFillColor;
		this.m_fillOpacity=parseFloat(iOpacity)/100;
	};
	this.SetTextStyle=function(iFontSize,strColor,iOpacity){
		this.m_iTextSize=iFontSize;
		this.m_strTextColor=strColor;
		this.m_textOpacity=parseFloat(iOpacity)/100;
	};
	this.DrawCircle=function(svgDrawer,scrnPoX,scrnPoY,r,bFill){
		if(svgDrawer){
			if(bFill){
				svgDrawer.circle(r).fill(this.m_fillColor).stroke({
					width:this.m_lineSize,color:this.m_lineColor
				}).opacity(this.m_fillOpacity).move(scrnPoX,scrnPoY);
			}
			else{
				svgDrawer.circle(r).fill('none').stroke({
					width:this.m_lineSize,color:this.m_lineColor
				}).opacity(this.m_lineOpacity).move(scrnPoX,scrnPoY);
			}
		}
	};
	this.DrawString=function(svgDrawer,scrnPoX,scrnPoY,strText){
		if(svgDrawer){
			svgDrawer.text(strText).fill(this.m_strTextColor).font({
				family:'Helvetica',size:this.m_iTextSize,leading:'1.5em'
			}).opacity(this.m_textOpacity).move(scrnPoX,scrnPoY);
		}
	};
	this.DrawImg=function(svgDrawer,scrnPoX,scrnPoY,imgObj,w,h){
		if(svgDrawer&&imgObj){
			if(w){
				var image=svgDrawer.image(imgObj.src,w,h).move(scrnPoX,scrnPoY);
			}
			else{
				var image=svgDrawer.image(imgObj.src).move(scrnPoX,scrnPoY);
			}
		}
	};
	this.DrawImgObj=function(svgDrawer,imgObj,scrnPoX,scrnPoY,w,h){
		if(svgDrawer&&imgObj){
			if(w){
				var image=svgDrawer.image(imgObj.src,w,h).move(scrnPoX,scrnPoY);
			}
			else{
				var image=svgDrawer.image(imgObj.src).move(scrnPoX,scrnPoY);
			}
		}
	};
	this.DrawImgByUrl=function(svgDrawer,strUrl,scrnPoX,scrnPoY,w,h){
		if(svgDrawer){
			if(w){
				var image=svgDrawer.image(strUrl,w,h).move(scrnPoX,scrnPoY);
			}
			else{
				var image=svgDrawer.image(strUrl).move(scrnPoX,scrnPoY);
			}
		}
	};
	this.DrawLine=function(svgDrawer,arrPoints){
		if(svgDrawer){
			if(arrPoints.length>1){
				var strArrScrnPoInfo="";
				for(var i=0;i<arrPoints.length;i++){
					if(i>0){
						strArrScrnPoInfo+=" ";
					};
					strArrScrnPoInfo+=arrPoints[i].x+","+arrPoints[i].y;
				};
				var polyline=svgDrawer.polyline(strArrScrnPoInfo).fill('none').stroke({
					width:this.m_lineSize,color:this.m_lineColor
				}).opacity(this.m_lineOpacity)
			}
		}
	};
	this.DrawRect=function(svgDrawer,poX,poY,width,height,bFill){
		if(svgDrawer){
			if(bFill){
				var rect=svgDrawer.rect(width,height).fill(this.m_fillColor).stroke({
					width:this.m_lineSize,color:this.m_lineColor
				}).opacity(this.m_fillOpacity).move(poX,poY);
			}
			else{
				var rect=svgDrawer.rect(width,height).fill('none').stroke({
					width:this.m_lineSize,color:this.m_lineColor
				}).opacity(this.m_lineOpacity).move(poX,poY)
			}
		}
	};
	this.DrawPolygon=function(svgDrawer,arrPoints,bFill){
		if(svgDrawer){
			if(arrPoints.length>2){
				var strArrScrnPoInfo="";
				for(var i=0;i<arrPoints.length;i++){
					if(i>0){
						strArrScrnPoInfo+=" ";
					};
					strArrScrnPoInfo+=arrPoints[i].x+","+arrPoints[i].y;
				};
				if(bFill){
					var polygon=svgDrawer.polygon(strArrScrnPoInfo).fill(this.m_fillColor).stroke({
						width:this.m_lineSize,color:this.m_lineColor
					}).opacity(this.m_fillOpacity);
				}
				else{
					var polygon=svgDrawer.polygon(strArrScrnPoInfo).fill('none').stroke({
						width:this.m_lineSize,color:this.m_lineColor
					}).opacity(this.m_lineOpacity);
				}
			}
		}
	};
	this.ClearSvg=function(svgDrawer){
		if(svgDrawer){
			svgDrawer.clear()
		}
	}
};
function h2(){
	this.x=0;
	this.y=0;
	this.width=200;
	this.height=200;
	this.iImgScale=80000;
	this.iImgLevel=5;
	this.bigCol=0;
	this.bigRow=0;
	this.smallCol=0;
	this.smallRow=0;
	this.id=null;
	this.img=null;
	this.draw=function(bAddRandom){
		if(this.img==null||this.img==undefined){
			this.img=this.getImage();
		};
		var strUrl=this.GetUrl();
		this.img.id=this.x+"|"+this.y+"|"+this.width+"|"+this.height+"|"+this.id;
		this.img.src=strUrl;
		if(this.img.complete==true){
			h5(this.img);
		}
	};
	this.GetUrl=function(){
		this.id=this.iImgScale+"__"+this.bigCol+"_"+this.bigRow+"_"+this.smallCol+"_"+this.smallRow;
		var strUrl;
		if(G_V.iCurMapImgInfoModeType==MAP_IMG_MODE_TYPE.GoogleType){
			var iCurGoogleRow=parseInt(this.bigRow)*parseInt(G_V.iBigCellImageHeightZoomCount)+parseInt(this.smallRow);
			var iCurGoogleCol=parseInt(this.bigCol)*parseInt(G_V.iBigCellImageWidthZoomCount)+parseInt(this.smallCol);
			var powOfLevel=Math.pow(2,this.iImgLevel);
			if(parseInt(this.iImgLevel)!=0){
				iCurGoogleRow+=powOfLevel/2;
				iCurGoogleCol+=powOfLevel/2;
			};
			if(G_V.bUseArcgisRule==true){
				var strLevel=(this.iImgLevel).toString();
				while(strLevel.length<2){
					strLevel="0"+strLevel;
				};
				strLevel="L"+strLevel;
				var strCurGoogleRow=iCurGoogleRow.toString();
				while(strCurGoogleRow.length<8){
					strCurGoogleRow="0"+strCurGoogleRow;
				};
				strCurGoogleRow="R"+strCurGoogleRow;
				var strCurGoogleCol=iCurGoogleCol.toString();
				while(strCurGoogleCol.length<8){
					strCurGoogleCol="0"+strCurGoogleCol;
				};
				strCurGoogleCol="C"+strCurGoogleCol;
				strUrl=G_V.strImgUrl+strLevel+"/"+strCurGoogleRow+"/"+strCurGoogleCol+".png";
			}
			else{
				strUrl=G_V.strImgUrl+this.iImgLevel+"/"+iCurGoogleRow+"/"+iCurGoogleCol+".png";
			}
		}
		else{
			strUrl=G_V.strImgUrl+this.iImgScale+"/"+this.bigCol+"_"+this.bigRow+"/"+this.id+".png"
		};
		return strUrl;
	};
	this.getImage=function(){
		if(!this.img){
			this.width=G_V.iImgWidth;
			this.height=G_V.iImgHeight;
			this.iImgLevel=G_V.iCurLevel;
			this.img=new Image();
			var style=this.img.style;
			style.left="-400px";
			style.top="-400px";
			style.position="absolute";
			this.img.onload=h4;
			this.img.onerror=h3;
		};
		return this.img;
	}
};
function h3(){
	if(G_V.strMapBackGroundImgSrc){
		var arrIdInfo=this.id.split("|");
		if(arrIdInfo.length>3){
			var left=arrIdInfo[0];
			var top=arrIdInfo[1];
			var width=arrIdInfo[2];
			var height=arrIdInfo[3];
			this.style.left=left+"px";
			this.style.top=top+"px";
			this.style.width=width+"px";
			this.style.height=height+"px";
		};
		this.src=G_V.strMapBackGroundImgSrc;
	}
};
function h4(){
	h5(this);
};
function h5(curImgObj){
	if(curImgObj){
		var arrIdInfo=curImgObj.id.split("|");
		if(arrIdInfo.length>3){
			var left=arrIdInfo[0];
			var top=arrIdInfo[1];
			var width=arrIdInfo[2];
			var height=arrIdInfo[3];
			curImgObj.style.left=left+"px";
			curImgObj.style.top=top+"px";
			curImgObj.style.width=width+"px";
			curImgObj.style.height=height+"px";
		};
		curImgObj.style.display="block";
	}
};
function h6(prefix){
	if(prefix==null){
		prefix="id_";
	};
	g_iUtilLastSeqID+=1;
	return prefix+g_iUtilLastSeqID;
};
function h7(id,px,sz,src,position,zIndex,display){
	var dom=new Image();
	if(src){
		dom.src=src;
	};
	if(display){
		dom.style.display=display;
	};
	if(!id){
		id=h6("YimaEncDiv");
	};
	i1(dom,id,px,sz,position,zIndex,null,null,null);
	return dom;
};
function h8(id,px,sz,imgURL,position,zIndex,border,overflow,opacity){
	var dom=document.createElement('div');
	if(imgURL){
		dom.style.backgroundImage='url('+imgURL+')';
	};
	if(!id){
		id=h6("YimaEncDiv");
	};
	if(!position){
		position="absolute";
	};
	i1(dom,id,px,sz,position,zIndex,border,overflow,opacity);
	return dom;
};
function h9(id,px,sz,imgURL,position,zIndex,border,overflow,opacity){
	var dom=document.createElement('span');
	if(imgURL){
		dom.style.backgroundImage='url('+imgURL+')';
	};
	if(!id){
		id=h6("YimaEncDiv");
	};
	if(!position){
		position="absolute";
	};
	i1(dom,id,px,sz,position,zIndex,border,overflow,opacity);
	return dom;
};
function i0(id,px,sz,imgURL,position,zIndex,border,overflow,opacity){
	var dom=document.createElement('canvas');
	if(imgURL){
		dom.style.backgroundImage='url('+imgURL+')';
	};
	if(!id){
		id=h6("YimaEncDiv");
	};
	if(!position){
		position="absolute";
	};
	if(sz){
		dom.width=sz.w;
		dom.height=sz.h;
	};
	i1(dom,id,px,null,position,zIndex,border,overflow,opacity);
	return dom;
};
function i1(element,id,px,sz,position,zIndex,border,overflow,opacity){
	if(id){
		element.id=id;
	};
	if(px){
		element.style.left=px.x+"px";
		element.style.top=px.y+"px";
	};
	if(sz){
		element.style.width=sz.w+"px";
		element.style.height=sz.h+"px";
	};
	if(position){
		element.style.position=position;
	};
	if(zIndex){
		element.style.zIndex=zIndex;
	};
	if(border){
		element.style.border=border;
	};
	if(overflow){
		element.style.overflow=overflow;
	};
	if(parseFloat(opacity)>=0.0&&parseFloat(opacity)<1.0){
		element.style.filter='alpha(opacity='+(opacity*100)+')';
		element.style.opacity=opacity;
	}
	else if(parseFloat(opacity)==1.0){
		element.style.filter='';
		element.style.opacity='';
	}
};
function i2(){
	var elements=[];
	for(var i=0,len=arguments.length;i<len;i++){
		var element=arguments[i];
		if(typeof element=='string'){
			element=document.getElementById(element);
		};
		if(arguments.length==1){
			return element;
		};
		elements.push(element);
	};
	return elements;
};
function i3(destination,source){
	destination=destination||{};
	if(source){
		for(var property in source){
			var value=source[property];
			if(value!==undefined){
				destination[property]=value;
			}
		};
		var sourceIsEvt=typeof window.Event=="function"&&source instanceof window.Event;
		if(!sourceIsEvt&&source.hasOwnProperty&&source.hasOwnProperty("toString")){
			destination.toString=source.toString;
		}
	};
	return destination;
};
function i4(func,object){
	var args=Array.prototype.slice.apply(arguments,[2]);
	return function(){
		var newArgs=args.concat(Array.prototype.slice.apply(arguments,[0]));
		return func.apply(object,newArgs);
	}
};
function i5(canvasObj){
	var curCanvasObj2D=null;
	try{
		if(typeof window.G_vmlCanvasManager!="undefined"){
			canvasObj=window.G_vmlCanvasManager.initElement(canvasObj);
			curCanvasObj2D=canvasObj.getContext("2d")
		}
		else{
			curCanvasObj2D=canvasObj.getContext("2d")
		}
	}
	catch(e){
		curCanvasObj2D=null
	};
	return curCanvasObj2D
};
function i6(){
	var strExplorerName="IE 9.0";
	var explorer=window.navigator.userAgent;
	if(explorer.indexOf("MSIE")>=0){
		if(explorer.indexOf("MSIE 6.")!=-1){
			strExplorerName="IE 6.0";
		}
		else if(explorer.indexOf("MSIE 7.")!=-1){
			strExplorerName="IE 7.0";
		}
		else if(explorer.indexOf("MSIE 8.")!=-1){
			strExplorerName="IE 8.0";
		}
		else if(explorer.indexOf("MSIE 9.")!=-1){
			strExplorerName="IE 9.0";
		}
		else if(explorer.indexOf("MSIE 10.")!=-1){
			strExplorerName="IE 10.0";
		}
		else if(explorer.indexOf("MSIE 11.")!=-1){
			strExplorerName="IE 11.0";
		}
	}
	else if(explorer.indexOf("Firefox")>=0){
		strExplorerName="Firefox";
	}
	else if(explorer.indexOf("Chrome")>=0){
		strExplorerName="Chrome"
	}
	else if(explorer.indexOf("Opera")>=0){
		strExplorerName="Opera";
	}
	else if(explorer.indexOf("Safari")>=0){
		strExplorerName="Safari";
	};
	return strExplorerName;
};
function i7(){
	j3();
	j4();
};
function i8(iRowPos,iColPos,scale,objImg){
	if(objImg==null||objImg==undefined){
		objImg=[];
	};
	var curPoToOriginsPoScrnPoX=parseInt(iColPos*G_V.iImgWidth-G_V.iMapViewWidth/2-G_V.iImgWidth*(G_V.iImgBufferCount))+parseInt(G_V.centerToMapOriginsScrnPo.x);
	var curPoToOriginsPoScrnPoY=parseInt(iRowPos*G_V.iImgHeight-G_V.iMapViewHeight/2-G_V.iImgHeight*(G_V.iImgBufferCount))+parseInt(G_V.centerToMapOriginsScrnPo.y);
	var cellColNum=i9(curPoToOriginsPoScrnPoX+parseInt(G_V.iImgWidth*G_V.iBigCellImageWidthZoomCount),G_V.iImgWidth);
	var cellRowNum=i9(curPoToOriginsPoScrnPoY+parseInt(G_V.iImgHeight*G_V.iBigCellImageHeightZoomCount),G_V.iImgHeight);
	var bigCellColNum=i9(cellColNum,G_V.iBigCellImageWidthZoomCount);
	var bigCellRowNum=i9(cellRowNum,G_V.iBigCellImageHeightZoomCount);
	var smallCellColNum=(cellColNum%G_V.iBigCellImageWidthZoomCount+G_V.iBigCellImageWidthZoomCount)%G_V.iBigCellImageWidthZoomCount;
	var smallCellRowNum=(cellRowNum%G_V.iBigCellImageHeightZoomCount+G_V.iBigCellImageHeightZoomCount)%G_V.iBigCellImageHeightZoomCount;
	var imgLeft=bigCellColNum*G_V.iImgWidth*G_V.iBigCellImageWidthZoomCount-G_V.iImgWidth*G_V.iBigCellImageWidthZoomCount+smallCellColNum*G_V.iImgWidth-parseInt(G_V.centerToMapOriginsScrnPo.x)+parseInt(G_V.iMapViewWidth/2);
	var imgTop=bigCellRowNum*G_V.iImgHeight*G_V.iBigCellImageHeightZoomCount-G_V.iImgHeight*G_V.iBigCellImageHeightZoomCount+smallCellRowNum*G_V.iImgHeight-parseInt(G_V.centerToMapOriginsScrnPo.y)+parseInt(G_V.iMapViewHeight/2);
	objImg.x=imgLeft;
	objImg.y=imgTop;
	objImg.width=G_V.iImgWidth;
	objImg.height=G_V.iImgHeight;
	objImg.iImgScale=G_V.iCurScale;
	objImg.iImgLevel=G_V.iCurLevel;
	objImg.bigCol=bigCellColNum;
	objImg.bigRow=bigCellRowNum;
	objImg.smallCol=smallCellColNum;
	objImg.smallRow=smallCellRowNum;
};
function i9(val,cycle){
	return(val-(val%cycle+cycle)%cycle)/cycle;
};
function j0(iMoveScrnX,iMoveScrnY,iScale){
	if(isNaN(iMoveScrnX)||isNaN(iMoveScrnY)||isNaN(iScale)||(parseInt(iMoveScrnX)==0&&parseInt(iMoveScrnY)==0)){
		return;
	};
	G_V.OffsetPo=G_V.OldOffsetPo;
	var newCenterPlanePo=j2(G_V.iMapViewWidth/ 2 - iMoveScrnX, G_V.iMapViewHeight /2-iMoveScrnY,iScale);
	G_V.centerLonLatPo.x=j7(newCenterPlanePo.y/G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER);
	G_V.centerLonLatPo.y=j8(newCenterPlanePo.x/G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER);
	j1(newCenterPlanePo.x,newCenterPlanePo.y,scale);
};
function j1(centerPlanePoX,centerPlanePoY,scale){
	if(isNaN(centerPlanePoX)||isNaN(centerPlanePoY)||isNaN(scale)){
		return false;
	};
	G_V.OffsetPo.x=G_V.iMapViewWidth/ 2 - (centerPlanePoX /scale*G_V.fPlaneCoorUnitToScrnUnitFactor);
	G_V.OffsetPo.y=-G_V.iMapViewHeight/ 2 - (centerPlanePoY /scale*G_V.fPlaneCoorUnitToScrnUnitFactor);
};
function j2(poScrX,poScrY,scale){
	if(isNaN(poScrX)||isNaN(poScrY)||isNaN(scale)){
		return{
			x:0,y:0
		};
	};
	var planePoX=(poScrX-G_V.OffsetPo.x)*scale/G_V.fPlaneCoorUnitToScrnUnitFactor;
	var planePoY=(-poScrY-G_V.OffsetPo.y)*scale/G_V.fPlaneCoorUnitToScrnUnitFactor;
	return{
		x:planePoX,y:planePoY
	};
};
function j3(){
	G_V.fPlaneCoorUnitToScrnUnitFactor=(1000/G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER*100)*G_V.fHimeterToPixelFactor;
};
function j4(){
	var i;
	var j;
	for(i=0;i<8000;i++){
		var fPlaneY=j6(i/100.0);
		G_V.arrMemPlaneYs[i]=(fPlaneY);
	}
};
function j5(longitude){
	while(longitude<-180){
		longitude=360+parseFloat(longitude);
	}
	while(longitude>180){
		longitude=parseFloat(longitude)-360;
	};
	var planeX=longitude*Math.PI/180*G_V.fEarthRadiusX;
	return planeX;
};
function j6(latitude){
	var arc=Math.abs(latitude*Math.PI/180);
	var eSine=G_V.fEsize*Math.sin(arc);
	var planeY;
	if(G_V.iCurMapImgInfoModeType==MAP_IMG_MODE_TYPE.GoogleType){
		planeY=G_V.fEarthRadiusX*Math.log(Math.tan(Math.PI/ 4 + arc /2));
	}
	else{
		planeY=G_V.fEarthRadiusX*Math.log(Math.tan(Math.PI/ 4 + arc /2)*Math.pow((1-eSine)/ (1 + eSine), G_V.fEsize /2));
	};
	if(latitude<0){
		planeY=-planeY;
	};
	return planeY;
};
function j7(palneCoorY){
	if(G_V.iCurMapImgInfoModeType==MAP_IMG_MODE_TYPE.GoogleType){
		var y=palneCoorY/G_V.fEarthRadiusY;
		if(palneCoorY<0){
			y=-y
		};
		var arc=2*Math.atan(Math.exp(y))-Math.PI/2;
		var deg=arc*180/Math.PI;
		if(palneCoorY<0){
			deg=-deg
		};
		return deg
	}
	else{
		var tmp;
		if(palneCoorY>=0){
			tmp=1;
		}
		else{
			tmp=-1;
			palneCoorY=(-1)*palneCoorY;
		};
		var Latitude;
		var i;
		var y1,y2,y3;
		var x1,x2,x3;
		for(i=0;i<8000;i++){
			if(palneCoorY<=G_V.arrMemPlaneYs[i])break;
		};
		if(i>7999){
			if(tmp>0){
				return 80;
			}
			else{
				return-80;
			}
		};
		if(palneCoorY==G_V.arrMemPlaneYs[i]){
			Latitude=tmp*i/100;
		}
		else{
			x1=((i-1))/100;
			x2=(i)/100;
			y1=G_V.arrMemPlaneYs[i-1];
			y2=G_V.arrMemPlaneYs[i];
			y3=palneCoorY;
			x3=((x2-x1)*(y3-y1))/(y2-y1)+x1;
			Latitude=tmp*x3;
		};
		return Latitude;
	}
};
function j8(planeX){
	var retArcVal=planeX/ G_V.fEarthRadiusX /Math.PI*180;
	if(retArcVal<0){}while(retArcVal<-180){
		retArcVal=360+parseFloat(retArcVal);
	}
	while(retArcVal>180){
		retArcVal=parseFloat(retArcVal)-360;
	};
	return retArcVal;
};
function j9(longitude,latitude){
	if(isNaN(longitude)||isNaN(latitude)||Math.abs(longitude)-parseInt(180)>0||Math.abs(latitude)-parseInt(90)>0){
		return{
			x:0,y:0
		};
	};
	var planeX=j5(longitude);
	var planeY=j6(latitude);
	var po={
		x:planeX*G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER,y:planeY*G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER
	};
	return po;
};
function k0(longitude,latitude,scale){
	if(isNaN(longitude)||isNaN(latitude)||Math.abs(longitude)-parseInt(180)>0||Math.abs(latitude)-parseInt(90)>0){
		return{
			x:0,y:0
		};
	};
	var planeX;
	if(longitude<0){};
	if(isNaN(scale)){
		scale=G_V.iCurScale;
	};
	planeX=longitude*Math.PI/180*G_V.fEarthRadiusX;
	var planeY=j6(latitude);
	var poGeoX=planeX*G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER;
	var poGeoY=planeY*G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER;
	var poScrX=Math.round(poGeoX/scale*G_V.fPlaneCoorUnitToScrnUnitFactor+G_V.OffsetPo.x);
	var poScrY=-Math.round(poGeoY/scale*G_V.fPlaneCoorUnitToScrnUnitFactor+G_V.OffsetPo.y);
	return{
		x:poScrX,y:poScrY
	};
};
function k1(longitude,latitude){
	if(isNaN(longitude)||isNaN(latitude)||Math.abs(longitude)-parseInt(180)>0||Math.abs(latitude)-parseInt(90)>0){
		return{
			x:0,y:0
		};
	};
	var planeX;
	if(longitude<0){};
	planeX=longitude*Math.PI/180*G_V.fEarthRadiusX;
	var planeY=j6(latitude);
	var poGeoX=planeX*G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER;
	var poGeoY=planeY*G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER;
	return{
		x:poGeoX,y:poGeoY
	};
};
function k2(planeMultiPoX,planeMultiPoY,scale){
	var poScrX=Math.round(planeMultiPoX/G_V.iCurScale*G_V.fPlaneCoorUnitToScrnUnitFactor+G_V.OffsetPo.x);
	var poScrY=-Math.round(planeMultiPoY/G_V.iCurScale*G_V.fPlaneCoorUnitToScrnUnitFactor+G_V.OffsetPo.y);
	return{
		x:poScrX,y:poScrY
	};
};
function k3(iGeoX,iGeoY){
	var longitude=parseFloat(iGeoX)/G_V.UNI_GEO_COOR_MULTI_FACTOR;
	var latitude=parseFloat(iGeoY)/G_V.UNI_GEO_COOR_MULTI_FACTOR;
	var scrnPo=k0(longitude,latitude,G_V.iCurScale);
	return scrnPo;
};
function k4(lon,lat,scale,bUpdateSlider){
	if(lon!=null&&!isNaN(lon)){
		G_V.centerLonLatPo.x=lon;
	};
	if(lat!=null&&!isNaN(lat)){
		G_V.centerLonLatPo.y=lat;
	};
	if(scale!=null&&!isNaN(scale)){
		G_V.iCurScale=scale;
		if(bUpdateSlider){
			g3(false)
		}
	};
	if(G_V.objShowScaleDiv){
		G_V.objShowScaleDiv.innerHTML="<nobr>当前比例尺:</nobr><br><nobr>1:"+parseInt(G_V.iCurScale)+"</nobr>"
	}
};
function k5(){
	G_V.OffsetPo={
		x:0,y:0
	};
	var curPlanePo=j9(G_V.centerLonLatPo.x,G_V.centerLonLatPo.y);
	j1(curPlanePo.x,curPlanePo.y,G_V.iCurScale);
	G_V.OldOffsetPo=G_V.OffsetPo;
	var originsScrnPo=k0(G_V.generateOrgLonLatPo.x,G_V.generateOrgLonLatPo.y,G_V.iCurScale);
	var centerScrnPo=k0(G_V.centerLonLatPo.x,G_V.centerLonLatPo.y,G_V.iCurScale);
	G_V.centerToMapOriginsScrnPo={
		x:Math.round(centerScrnPo.x-originsScrnPo.x),y:Math.round(centerScrnPo.y-originsScrnPo.y)
	};
	if(G_V.iCurMapImgInfoModeType==MAP_IMG_MODE_TYPE.GoogleType||G_V.iCurMapImgInfoModeType==MAP_IMG_MODE_TYPE.BaiduType){
		G_V.centerToMapOriginsScrnPo.x-=parseInt(G_V.iImgWidth*G_V.iBigCellImageWidthZoomCount);
		G_V.centerToMapOriginsScrnPo.y-=parseInt(G_V.iImgHeight*G_V.iBigCellImageHeightZoomCount);
	};
	var iCheckScrnLen=1000;
	if(G_V.iCurScale>20000000){
		iCheckScrnLen=100
	};
	var lonLatPo1=k6(0,0,G_V.iCurScale);
	var lonLatPo2=k6(iCheckScrnLen,iCheckScrnLen,G_V.iCurScale);
	var xDis=k9(lonLatPo1.x,lonLatPo1.y,lonLatPo2.x,lonLatPo1.y);
	var yDis=k9(lonLatPo1.x,lonLatPo1.y,lonLatPo1.x,lonLatPo2.y);
	G_V.pxLenOfOneKmPo={
		x:iCheckScrnLen/ xDis, y: iCheckScrnLen /yDis
	};
};
function k6(scrnX,scrnY,scale){
	if(isNaN(scrnX)||isNaN(scrnY)||isNaN(scale)){
		return{
			x:0,y:0
		};
	};
	var planePo=j2(scrnX,scrnY,scale);
	var latiude=j7(planePo.y/G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER);
	var longitude=j8(planePo.x/G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER);
	return{
		x:longitude,y:latiude
	};
};
function k7(lonLat,bIsLon,decimalCount){
	var strNumber=lonLat;
	while(Math.abs(strNumber)>360){
		if(strNumber>0){
			strNumber-=360
		}
		else{
			strNumber+=360
		}
	};
	strNumber=strNumber.toFixed(5);
	var aryStringNumber=strNumber.split(".");
	var tranNumber=parseFloat("0."+aryStringNumber[1]);
	tranNumber=tranNumber*60;
	var sign;
	if(bIsLon==true){
		if(lonLat>=0&&lonLat<=180){
			sign=" E ";
		}
		else{
			aryStringNumber[0]=parseInt(-aryStringNumber[0]);
			sign=" W ";
		}
	}
	else{
		if(lonLat>0){
			sign=" N ";
		}
		else{
			aryStringNumber[0]=parseInt(-aryStringNumber[0]);
			sign=" S ";
		}
	};
	if(isNaN(decimalCount)==false){
		decimalCount=2
	};
	return(aryStringNumber[0]+"°"+tranNumber.toFixed(decimalCount)+sign);
};
function k8(xValue,yValue){
	this.x=xValue;
	this.y=yValue;
};
function k9(lon1,lat1,lon2,lat2){
	var dLat=(lat2-lat1)*Math.PI/180;
	var dLon=(lon2-lon1)*Math.PI/180;
	var a=Math.sin(dLat/ 2) * Math.sin(dLat /2)+Math.cos(lat1*Math.PI/ 180) * Math.cos(lat2 * Math.PI /180)*Math.sin(dLon/ 2) * Math.sin(dLon /2);
	var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
	var s=G_V.fEarthRadiusX*c/1000;
	return s;
};
function l0(lon1,lat1,lon2,lat2){
	var dLon1=lon1*Math.PI/180;
	var dLat1=lat1*Math.PI/180;
	var dLon2=lon2*Math.PI/180;
	var dLat2=lat2*Math.PI/180;
	var degrees=0;
	if(dLon1==dLon2){
		if(dLat1>dLat2){
			degrees=180;
		}
		else{
			degrees=0;
		}
	}
	else{
		degrees=4*Math.pow(Math.sin((dLat1-dLat2)/ 2), 2) - Math.pow(Math.sin((dLon1 - dLon2) /2)*(Math.cos(dLat1)-Math.cos(dLat2)),2);
		degrees=Math.sqrt(degrees);
		var temp=(Math.sin(Math.abs(dLon1-dLon2)/2)*(Math.cos(dLat1)+Math.cos(dLat2)));
		degrees=temp/degrees;
		degrees=Math.atan(degrees)/Math.PI*180;
		if(dLon1<dLon2){
			if(dLat1>dLat2){
				degrees=180-degrees;
			}
		}
		else{
			if(dLat1>dLat2){
				degrees=180+degrees;
			}
			else{
				degrees=360-degrees;
			}
		}
	};
	return degrees;
};
function l1(regionPoints){
	var po=null;
	var bResult=false;
	var pivotPointX=0;
	var pivotPointY=0;
	var poCount=regionPoints.length;
	if(regionPoints!=null&&poCount>2){
		var area=l3(regionPoints);
		for(var poNum=0;poNum<poCount;poNum++){
			var poCurrent,poNext;
			poCurrent={
				x:regionPoints[poNum].x,y:regionPoints[poNum].y
			};
			if(poNum!=poCount-1){
				poNext={
					x:regionPoints[poNum+1].x,y:regionPoints[poNum+1].y
				};
			}
			else{
				poNext={
					x:regionPoints[0].x,y:regionPoints[0].y
				};
			};
			pivotPointX+=(poCurrent.x+poNext.x)*(poCurrent.x*poNext.y-poNext.x*poCurrent.y);
			pivotPointY+=(poCurrent.y+poNext.y)*(poCurrent.x*poNext.y-poNext.x*poCurrent.y);
		};
		pivotPointX/=(6*area);
		pivotPointY/=(6*area);
		bResult=true;
	};
	if(bResult){
		po={
			x:pivotPointX,y:pivotPointY
		};
	};
	return po;
};
function l2(arrGeoPoints){
	var area=0;
	var pPlanePoints=new Array();
	for(var poNum=0;poNum<parseInt(arrGeoPoints.length);
	poNum++){
		var curPo=j9(arrGeoPoints[poNum].x/ G_V.UNI_GEO_COOR_MULTI_FACTOR, arrGeoPoints[poNum].y /G_V.UNI_GEO_COOR_MULTI_FACTOR);
		pPlanePoints.push(curPo);
	};
	area=Math.abs(l3(pPlanePoints))/ G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER /G_V.PLANE_COOR_MULTI_FACTOR_BY_UNIT_METER;
	return area;
};
function l3(arrRegionPoints){
	var area=0;
	var poCount=arrRegionPoints.length;
	if(poCount>=3){
		for(var poNum=0;poNum<poCount;poNum++){
			var poCurrent=new k8();
			var poNext=new k8();
			poCurrent=arrRegionPoints[poNum];
			if(poNum!=poCount-1){
				poNext=arrRegionPoints[poNum+1];
			}
			else{
				poNext=arrRegionPoints[0];
			};
			area+=(poCurrent.x*poNext.y-poNext.x*poCurrent.y);
		}
	};
	return area/2;
};
function l4(po1,po2){
	var dis=0;
	if(po1&&po2){
		dis=Math.sqrt((po1.x-po2.x)*(po1.x-po2.x)+(po1.y-po2.y)*(po1.y-po2.y));
	};
	return dis;
};
function l5(selScrnPo,lineScrnPoints,selectDistVal){
	var linePoCount=lineScrnPoints.length;
	for(var poNum=0;poNum<linePoCount-1;poNum++){
		var poStart=new k8(lineScrnPoints[poNum].x,lineScrnPoints[poNum].y);
		var poEnd=new k8(lineScrnPoints[poNum+1].x,lineScrnPoints[poNum+1].y);
		if(poStart.x<poEnd.x){
			if(selScrnPo.x<(poStart.x-selectDistVal)||selScrnPo.x>(poEnd.x+selectDistVal)){
				continue;
			}
		}
		else{
			if(selScrnPo.x>(poStart.x+selectDistVal)||selScrnPo.x<(poEnd.x-selectDistVal)){
				continue;
			}
		};
		if(poStart.y<poEnd.y){
			if(selScrnPo.y<(poStart.y-selectDistVal)||selScrnPo.y>(poEnd.y+selectDistVal)){
				continue;
			}
		}
		else{
			if(selScrnPo.y>(poStart.y+selectDistVal)||selScrnPo.y<(poEnd.y-selectDistVal)){
				continue;
			}
		};
		var deltX=poEnd.x-poStart.x;
		var deltY=poEnd.y-poStart.y;
		var fSqrt=Math.sqrt(deltX*deltX+deltY*deltY);
		if(fSqrt==0){
			fSqrt=1;
		};
		var distance=Math.abs(parseFloat(deltY*selScrnPo.x-deltX*selScrnPo.y)+parseFloat(deltX*poEnd.y-deltY*poEnd.x))/fSqrt;
		if(distance<selectDistVal){
			return true;
		}
	};
	return false;
};
function l6(iGeoPoX,iGeoPoY,iCirclePoX,iCirclePoY,circleRkm,minX,maxX,minY,maxY){
	if(minX!=null&&maxX!=null&&minY!=null&&maxY!=null){
		if(iGeoPoX<minX||iGeoPoX>maxX||iGeoPoY<minY||iGeoPoY>maxY){
			return false;
		}
	};
	var lon1=parseFloat(iGeoPoX)/10000000;
	var lat1=parseFloat(iGeoPoY)/10000000;
	var lon2=parseFloat(iCirclePoX)/10000000;
	var lat2=parseFloat(iCirclePoY)/10000000;
	var curDisKm=k9(lon1,lat1,lon2,lat2);
	if(curDisKm>circleRkm){
		return false;
	}
	else{
		return true;
	}
};
function l7(iPoX,iPoY,arrPolygonselPos,minX,maxX,minY,maxY){
	if(minX!=null&&maxX!=null&&minY!=null&&maxY!=null){
		if(iPoX<minX||iPoX>maxX||iPoY<minY||iPoY>maxY){
			return false;
		}
	};
	var bPointInArea=false;
	var nCross=0;
	var nCount=arrPolygonselPos.length;
	for(var i=0;i<nCount;i++){
		var p1=arrPolygonselPos[i];
		var p2=arrPolygonselPos[(i+1)%nCount];
		if(p1.y==p2.y){
			continue;
		};
		if(iPoY<Math.min(p1.y,p2.y)){
			continue;
		};
		if(iPoY>=Math.max(p1.y,p2.y)){
			continue;
		};
		var x=(iPoY-p1.y)*(p2.x-p1.x)/(p2.y-p1.y)+p1.x;
		if(x>iPoX)nCross++;
	};
	return(nCross%2==1);
};
function l8(){
	var iLicenceKey;
	var lastHexVal;
	iLicenceKey=parseInt(Math.random()*100000000);
	var strArrEncytedString=new Array(17);
	var strArrEnglishString=new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
	var strEncytedString="";
	for(var charNum=0;charNum<16;charNum++){
		var iGetNumIndex=parseInt(charNum/4);
		var remain=parseInt(charNum%4);
		var byteVal=parseInt(iLicenceKey>>(8*iGetNumIndex));
		byteVal=parseInt(byteVal&0xFF);
		var hexVal=0;
		if(remain==0){
			hexVal=parseInt((byteVal&0x0F));
		}
		else if(remain==1||remain==3){
			hexVal=parseInt(25-lastHexVal);
		}
		else if(remain==2){
			hexVal=parseInt((byteVal&0xF0)/16);
		};
		lastHexVal=hexVal;
		strArrEncytedString[charNum]=strArrEnglishString[hexVal];
	};
	strEncytedString=strArrEncytedString[0]+strArrEncytedString[1]+strArrEncytedString[2]+strArrEncytedString[3];
	strEncytedString+="-";
	strEncytedString+=strArrEncytedString[4]+strArrEncytedString[5]+strArrEncytedString[6]+strArrEncytedString[7];
	strEncytedString+="-";
	strEncytedString+=strArrEncytedString[8]+strArrEncytedString[9]+strArrEncytedString[10]+strArrEncytedString[11];
	strEncytedString+="-";
	strEncytedString+=strArrEncytedString[12]+strArrEncytedString[13]+strArrEncytedString[14]+strArrEncytedString[15];
	G_V.strFlexMyLicenceKey=strEncytedString;
	return iLicenceKey;
};
function l9(geoPo,dis,course){
	var newGeoPo=m0(geoPo,dis,course);
	var curDis=k9(geoPo,newGeoPo);
	var offsetDis=curDis-dis;
	if((offsetDis>0.001||offsetDis<0.001)&&dis>0){
		var dNewDis=dis+offsetDis*curDis/dis;
		newGeoPo=m0(geoPo,dis,course)
	};
	return newGeoPo;
};
function m0(geoPo,dis,course){
	var lon=geoPo.x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
	var lat=geoPo.y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
	var desLon=m2(lon,lat,dis,course);
	var desLat=m1(lon,lat,dis,course);
	var newGeoPo={
		x:parseInt(desLon*G_V.UNI_GEO_COOR_MULTI_FACTOR),y:parseInt(desLat*G_V.UNI_GEO_COOR_MULTI_FACTOR)
	};
	return newGeoPo;
};
function m1(Lon,Lat,dist,course){
	while(Lat>360){
		Lat=Lat-360;
	};
	var DLat;
	var RLat;
	DLat=(dist*Math.cos(course*Math.PI/ 180)) /60;
	RLat=Lat+DLat;
	return RLat;
};
function m2(Lon,Lat,dist,course){
	var RLat,RLon,MP1,MP2,DMP,DLon;
	if(course==90||course==270){
		DLon=(dist*Math.sin(course*Math.PI/ 180) /Math.cos(Lat*Math.PI/ 180)) /60;
	}
	else{
		RLat=m1(Lon,Lat,dist,course);
		MP1=m3(Lat);
		MP2=m3(RLat);
		DMP=MP2-MP1;
		DLon=(DMP*Math.tan(course*Math.PI/ 180)) /60;
	};
	RLon=Lon+DLon;
	return RLon;
};
function m3(Latitude){
	var LatArc=Math.abs(Latitude*Math.PI/180);
	var earthE=G_V.fEsize;
	var Rate=Math.pow(((1-earthE*Math.sin(LatArc))/ (1 + earthE * Math.sin(LatArc))), earthE /2);
	var aa=Math.log((Math.tan(Math.PI/ 4 + LatArc /2))*Rate)/Math.log(10);
	var MP=7915.70447*(Math.log((Math.tan(Math.PI/ 4 + LatArc /2))*Rate)/Math.log(10));
	if(Latitude<0){
		MP=-MP;
	};
	return MP;
};
function m4(lenByPixel){
	var value=lenByPixel/G_V.fHimeterToPixelFactor;
	return value
};
function m5(iLevel,iModeType){
	var scale=0;
	if(iModeType==MAP_IMG_MODE_TYPE.GoogleType){
		var powOfLevel=Math.pow(2,parseInt(iLevel));
		var earthCircleLen=2*Math.PI*G_V.fEarthRadiusX;
		scale=parseInt(earthCircleLen/ (m4(256 * powOfLevel) /100000))
	}
	else if(iModeType==MAP_IMG_MODE_TYPE.BaiduType){};
	return scale
};
var g_objYimaEncMap=null;
var g_iUtilLastSeqID=null;
var g_objEventClass=null;
var g_poLastDragScrnPo=null;
var g_objKineticClass=null;
var g_objListenEventDiv=null;
var g_objImgGridClass=null;
var g_objHtml5DrawClass=null;
var g_objManShipClass=null;
var g_objManHistoryTrackClass=null;
var g_objManObjClass=null;
var g_objManTyphoon=null;
var g_objDrawObjClass=null;
var g_objHeatMapManClass=null;
var g_objFishAreaManClass=null;
var g_objLonLatLineManClass=null;
var g_objSvgDrawClass=null;
var g_objRouteManClass=null;
function m6(div,model){
	g_objEventClass=new b2();
	G_V.init();
	g_objManHistoryTrackClass=new d4();
	g_objDrawObjClass=new a5();
	g_objHtml5DrawClass=new b6();
	g_objManShipClass=new d2();
	g_objManObjClass=new c5();
	g_objManTyphoon=new e1();
	g_objKineticClass=new b4();
	g_objHeatMapManClass=new c2();
	g_objRouteManClass=new h0();
	g_objLonLatLineManClass=new b8();
	g_objSvgDrawClass=new h1();
	g_poLastDragScrnPo={
		x:0,y:0
	};
	g_iUtilLastSeqID=0;
	g_objYimaEncMap=new m7();
	g_objImgGridClass=new b7();
	g_objFishAreaManClass=new c0();
	if(model=="android"){
		G_V.bShowPowerString=false;
		G_V.iCurSdkModelType=SDK_MODEL_TYPE.android;
	}
	else{
		G_V.iCurSdkModelType=SDK_MODEL_TYPE.pc;
	};
	g_objYimaEncMap.initialize(div);
	API_SetShowToolBarOrNot(true,80,50);
	g_objHeatMapManClass.initHeatmap();
	return true;
};
function m7(){
	this.events=null,this.mouseDownScrnPo=null;
	this.div=null;
	this.id=null;
	this.viewMapMainDiv=null;
	this.viewMapImgDiv1=null;
	this.viewMapImgDiv2=null;
	this.eventDiv=null;
	this.allCanvasDiv=null;
	this.drawDynamicObjCanvas=null;
	this.drawDynamicObjCanvas2D=null;
	this.drawLonLatLineCanvas=null;
	this.drawLonLatLineCanvas2D=null;
	this.drawRouteCanvas=null;
	this.drawRouteCanvas2D=null;
	this.drawShipCanvas=null;
	this.drawShipCanvas2D=null;
	this.drawObjectOnShipCanvas=null;
	this.drawObjectOnShipCanvas2D=null;
	this.drawObjectCanvas=null;
	this.drawObjectCanvas2D=null;
	this.drawTyphoonCanvas=null;
	this.drawTyphoonCanvas2D=null;
	this.drawFishAreaCanvas=null;
	this.drawFishAreaCanvas2D=null;
	this.drawMouseMoveSelObjCanvas=null;
	this.drawMouseMoveSelObjCanvas2D=null;
	this.drawShipHistoryTrackCanvas=null;
	this.drawShipHistoryTrackCanvas2D=null;
	this.strMainMapDivName=null;
	this.drawHeatmapDivObj=null;
	this.drawShipDivForSvg=null;
	this.drawShipSvgDrawer=null;
	this.drawShipHistoryTrackDivForSvg=null;
	this.drawShipHistoryTrackSvgDrawer=null;
	this.drawZoomArrowSignCanvas=null;
	this.drawZoomArrowSignCanvas2D=null;
	this.initialize=function(div){
		this.strMainMapDivName=div;
		this.div=div;
		this.id=h6("YimaEnc_");
		this.div=i2(div);
		G_V.iMapViewWidth=this.div.clientWidth;
		G_V.iMapViewHeight=this.div.clientHeight;
		if(parseInt(G_V.iMapViewWidth)==0||parseInt(G_V.iMapViewHeight)==0){
			G_V.iMapViewWidth=parseInt(this.div.style.width);
			G_V.iMapViewHeight=parseInt(this.div.style.height);
		};
		var mapSize={
			w:G_V.iMapViewWidth,h:G_V.iMapViewHeight
		};
		var oPo={
			x:0,y:0
		};
		var strMainDivId=this.id+"_MainViewMap";
		this.viewMapMainDiv=h8(strMainDivId,oPo,mapSize,null,"absolute",1,null,"visible",1);
		this.div.appendChild(this.viewMapMainDiv);
		var strAllCanvasDivId=this.id+"_AllCanvasDiv";
		this.allCanvasDiv=h8(strAllCanvasDivId,oPo,mapSize,null,"absolute",20,null,"visible",1);
		this.viewMapMainDiv.appendChild(this.allCanvasDiv);
		var canvasPo={
			x:-100,y:-100
		};
		var canvasSize={
			w:G_V.iMapViewWidth+200,h:G_V.iMapViewHeight+200
		};
		G_V.drawObjCanvasPo=canvasPo;
		if(G_V.bCanvasInitOk==true){
			var strDrawLonLatLineCanvasId=this.id+"_viewDrawLonLatLineCanvas";
			this.drawLonLatLineCanvas=i0(strDrawLonLatLineCanvasId,canvasPo,canvasSize,null,"absolute",3,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawLonLatLineCanvas);
			this.drawLonLatLineCanvas2D=i5(this.drawLonLatLineCanvas);
			var strDrawObjectCanvasId=this.id+"_viewFishAreaCanvas";
			this.drawFishAreaCanvas=i0(strDrawObjectCanvasId,canvasPo,canvasSize,null,"absolute",3,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawFishAreaCanvas);
			this.drawFishAreaCanvas2D=i5(this.drawFishAreaCanvas);
			var strDrawObjectCanvasId=this.id+"_viewObjCanvas";
			this.drawObjectCanvas=i0(strDrawObjectCanvasId,canvasPo,canvasSize,null,"absolute",4,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawObjectCanvas);
			this.drawObjectCanvas2D=i5(this.drawObjectCanvas);
			var strDrawRouteCanvasId=this.id+"_viewShipCanvas";
			this.drawRouteCanvas=i0(strDrawRouteCanvasId,canvasPo,canvasSize,null,"absolute",5,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawRouteCanvas);
			this.drawRouteCanvas2D=i5(this.drawRouteCanvas);
			var strDrawShipCanvasId=this.id+"_viewShipCanvas";
			this.drawShipCanvas=i0(strDrawShipCanvasId,canvasPo,canvasSize,null,"absolute",5,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawShipCanvas);
			this.drawShipCanvas2D=i5(this.drawShipCanvas);
			var strDrawObjectOnShipCanvasId=this.id+"_viewOnShipObjCanvas";
			this.drawObjectOnShipCanvas=i0(strDrawObjectOnShipCanvasId,canvasPo,canvasSize,null,"absolute",6,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawObjectOnShipCanvas);
			this.drawObjectOnShipCanvas2D=i5(this.drawObjectOnShipCanvas);
			var strDrawTyphoonCanvasId=this.id+"_viewTyphoonCanvas";
			this.drawTyphoonCanvas=i0(strDrawTyphoonCanvasId,canvasPo,canvasSize,null,"absolute",7,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawTyphoonCanvas);
			this.drawTyphoonCanvas2D=i5(this.drawTyphoonCanvas);
			var strDrawDynamicObjCanvasId=this.id+"_viewDynamicObjCanvas";
			this.drawDynamicObjCanvas=i0(strDrawDynamicObjCanvasId,canvasPo,canvasSize,null,"absolute",8,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawDynamicObjCanvas);
			this.drawDynamicObjCanvas2D=i5(this.drawDynamicObjCanvas);
			var strDrawMouseMoveSelObjCanvasId=this.id+"_viewDrawMouseMoveSelObjCanvas";
			this.drawMouseMoveSelObjCanvas=i0(strDrawMouseMoveSelObjCanvasId,canvasPo,canvasSize,null,"absolute",9,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawMouseMoveSelObjCanvas);
			this.drawMouseMoveSelObjCanvas2D=i5(this.drawMouseMoveSelObjCanvas);
			var strDrawShipHistoryTrackCanvasId=this.id+"_viewDrawShipHistoryTrackCanvas";
			this.drawShipHistoryTrackCanvas=i0(strDrawShipHistoryTrackCanvasId,canvasPo,canvasSize,null,"absolute",10,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawShipHistoryTrackCanvas);
			this.drawShipHistoryTrackCanvas2D=i5(this.drawShipHistoryTrackCanvas);
			if(G_V.bUseSvgDrawerOrNot){
				var strDrawShipHistoryTrackDivId=this.id+"_viewShipHistoryTrackDivForSvg";
				this.drawShipHistoryTrackDivForSvg=h8(strDrawShipHistoryTrackDivId,canvasPo,canvasSize,null,"absolute",10,null,"visible",1);
				this.allCanvasDiv.appendChild(this.drawShipHistoryTrackDivForSvg);
				this.drawShipHistoryTrackSvgDrawer=SVG(strDrawShipHistoryTrackDivId).size(canvasSize.w,canvasSize.h);
				var strDrawShipDivId=this.id+"_viewShipDivForSvg";
				this.drawShipDivForSvg=h8(strDrawShipDivId,canvasPo,canvasSize,null,"absolute",5,null,"visible",1);
				this.allCanvasDiv.appendChild(this.drawShipDivForSvg);
				this.drawShipSvgDrawer=SVG(strDrawShipDivId).size(canvasSize.w,canvasSize.h)
			};
			var strDrawHeatmapDivId=g_objHeatMapManClass.strDivName;
			this.drawHeatmapDivObj=h8(strDrawHeatmapDivId,canvasPo,canvasSize,null,"absolute",10,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawHeatmapDivObj);
			var strZoomArrowSignCanvasId=this.id+"_zoomArrowSignCanvas";
			this.drawZoomArrowSignCanvas=i0(strZoomArrowSignCanvasId,canvasPo,canvasSize,null,"absolute",99,null,"visible",1);
			this.allCanvasDiv.appendChild(this.drawZoomArrowSignCanvas);
			this.drawZoomArrowSignCanvas2D=i5(this.drawZoomArrowSignCanvas)
		};
		var strMapImgDivId1=this.id+"_viewMapImgDiv1";
		this.viewMapImgDiv1=h8(strMapImgDivId1,oPo,mapSize,null,"absolute",10,null,"visible",1);
		this.viewMapMainDiv.appendChild(this.viewMapImgDiv1);
		var strMapImgDivId2=this.id+"_viewMapImgDiv2";
		this.viewMapImgDiv2=h8(strMapImgDivId2,oPo,mapSize,null,"absolute",9,null,"visible",1);
		this.viewMapMainDiv.appendChild(this.viewMapImgDiv2);
		var strDrawHeatmapDivId=this.id+"_DrawHeatmapDiv";
		this.drawHeatmapDivObj=h8(strDrawHeatmapDivId,oPo,mapSize,null,"absolute",11,null,"visible",1);
		this.allCanvasDiv.appendChild(this.drawHeatmapDivObj);
		var stEventDivId=this.id+"_EventDiv";
		this.eventDiv=h8(stEventDivId,oPo,mapSize,null,"absolute",1000,null,"visible",0.1);
		this.eventDiv.style.background="#FFFFFF";
		this.div.appendChild(this.eventDiv);
		g_objListenEventDiv=this.eventDiv;
		g5(stEventDivId);
		this.events=new b3();
		this.events.initialize(this,g_objListenEventDiv,null,this.fallThrough,{
			includeXY:true
		});
		this.registerEvent(g_objListenEventDiv);
		if(G_V.objValidityInfoDiv){
			this.div.appendChild(G_V.objValidityInfoDiv);
			G_V.setShowValidityInfoInfo(false);
		};
		if(G_V.bShowPowerString==true&&G_V.objCompanyNameDiv){
			this.div.appendChild(G_V.objCompanyNameDiv);
			G_V.setShowCompanyDivInfo(true);
		}
	};
	this.ReSizeMapView=function(){
		if(parseInt(this.div.clientWidth)==G_V.iMapViewWidth&&parseInt(this.div.clientHeight)==G_V.iMapViewHeight){
			return false;
		};
		G_V.iMapViewWidth=this.div.clientWidth;
		G_V.iMapViewHeight=this.div.clientHeight;
		var mapSize={
			w:G_V.iMapViewWidth,h:G_V.iMapViewHeight
		};
		var oPo={
			x:0,y:0
		};
		if(this.viewMapMainDiv){
			this.viewMapMainDiv.style.width=mapSize.w+"px";
			this.viewMapMainDiv.style.height=mapSize.h+"px";
		};
		if(this.allCanvasDiv){
			this.allCanvasDiv.style.width=mapSize.w+"px";
			this.allCanvasDiv.style.height=mapSize.h+"px";
		};
		var canvasSize={
			w:G_V.iMapViewWidth+200,h:G_V.iMapViewHeight+200
		};
		if(this.drawShipCanvas){
			this.drawShipCanvas.width=canvasSize.w;
			this.drawShipCanvas.height=canvasSize.h;
		};
		if(this.drawObjectCanvas){
			this.drawObjectCanvas.width=canvasSize.w;
			this.drawObjectCanvas.height=canvasSize.h;
		};
		if(this.drawObjectOnShipCanvas){
			this.drawObjectOnShipCanvas.width=canvasSize.w;
			this.drawObjectOnShipCanvas.height=canvasSize.h;
		};
		if(this.drawTyphoonCanvas){
			this.drawTyphoonCanvas.width=canvasSize.w;
			this.drawTyphoonCanvas.height=canvasSize.h;
		};
		if(this.drawDynamicObjCanvas){
			this.drawDynamicObjCanvas.width=canvasSize.w;
			this.drawDynamicObjCanvas.height=canvasSize.h;
		};
		if(this.drawMouseMoveSelObjCanvas){
			this.drawMouseMoveSelObjCanvas.width=canvasSize.w;
			this.drawMouseMoveSelObjCanvas.height=canvasSize.h;
		};
		if(this.drawShipHistoryTrackCanvas){
			this.drawShipHistoryTrackCanvas.width=canvasSize.w;
			this.drawShipHistoryTrackCanvas.height=canvasSize.h;
		};
		if(this.viewMapImgDiv1){
			this.viewMapImgDiv1.width=mapSize.w+"px";
			this.viewMapImgDiv1.height=mapSize.h+"px";
		};
		if(this.viewMapImgDiv2){
			this.viewMapImgDiv2.width=mapSize.w+"px";
			this.viewMapImgDiv2.height=mapSize.h+"px";
		};
		if(this.eventDiv){
			this.eventDiv.style.width=mapSize.w+"px";
			this.eventDiv.style.height=mapSize.h+"px";
		};
		if(G_V.bShowPowerString==true&&G_V.objCompanyNameDiv){
			G_V.setShowCompanyDivInfo(true);
		};
		if(G_V.showScaleDivOffsetPo.bShow==true){
			G_V.setShowScaleDivInfo(G_V.showScaleDivOffsetPo,true);
		};
		if(G_V.showLonLatDivOffsetPo.bShow==true){
			G_V.setShowLonLatDivInfo(G_V.showLonLatDivOffsetPo,true);
		};
		if(G_V.showDisLenSizeOffsetPo.bShow==true){
			G_V.setShowDisLenCanvasInfo(G_V.showDisLenSizeOffsetPo,true);
		};
		if(G_V.showZoonBtnOffsetPo.bShow==true){
			G_V.setShowZoomBtnDivInfo(G_V.showZoonBtnOffsetPo,true);
		};
		if(G_V.showToolBarOffsetPo.bShow==true){
			G_V.SetShowToolBarInfo(G_V.showToolBarOffsetPo,true);
			g3(false);
		};
		k5();
		var firstTitleImg;
		if(g_objImgGridClass.curShowImgGridNum==1){
			firstTitleImg=g_objImgGridClass.arrImgGrid1[0][0];
		}
		else{
			firstTitleImg=g_objImgGridClass.arrImgGrid2[0][0];
		};
		g_firstImgStartScrnPo={
			x:parseInt(firstTitleImg.x),y:parseInt(firstTitleImg.y)
		};
		f1();
		g_objDrawObjClass.RedrawAllObjAfterChange();
	};
	this.registerEvent=function(obj){
		if(obj&&this.events!=null){
			if(G_V.iCurSdkModelType==SDK_MODEL_TYPE.android){
				this.events.registerPriority("mousedown",obj,this.mousedown);
				obj.addEventListener("touchstart",this.touchstart);
				obj.addEventListener("touchmove",this.touchmove);
				obj.addEventListener("touchend",this.touchend);
			}
			else{
				this.addMouseEvent(obj,"mousewheel",this.mousewheel);
				this.addMouseEvent(obj,"mousemove",this.mousemove);
				this.addMouseEvent(obj,"mousedown",this.mousedown);
				this.addMouseEvent(obj,"mouseup",this.mouseup);
			}
		}
	};
	this.addMouseEvent=function(obj,type,fn){
		if(obj.addEventListener){
			if(type=="mousewheel"){
				var isFirefox=typeof document.body.style.MozUserSelect!='undefined';
				obj.addEventListener(isFirefox?'DOMMouseScroll':type,fn,false)
			}
			else{
				obj.addEventListener(type,fn,false)
			}
		}
		else{
			obj.attachEvent('on'+type,fn)
		};
		return fn
	};
	this.mousewheel=function(evt){
		var oEvent=evt?evt:window.event;
		var mouseScrnPo;
		var iwheelDelta=1;
		if(G_V.strExplorerName=="Firefox"){
			mouseScrnPo={
				x:oEvent.pageX,y:oEvent.pageY
			};
			iwheelDelta=parseInt(-oEvent.detail)
		}
		else{
			mouseScrnPo={
				x:oEvent.clientX,y:oEvent.clientY
			};
			iwheelDelta=oEvent.wheelDelta
		};
		var curMousePosition=e2(mouseScrnPo,g_objListenEventDiv);
		if(iwheelDelta>0){
			e6(1,curMousePosition);
		}
		else{
			e6(-1,curMousePosition);
		};
		return false;
	};
	this.mousedown=function(evt){
		if(G_V.iTouchModel==TouchPos.doZoom){
			return false
		};
		var oEvent=evt?evt:window.event;
		var mouseScrnPo;
		if(G_V.strExplorerName=="Firefox"){
			mouseScrnPo={
				x:oEvent.pageX,y:oEvent.pageY
			}
		}
		else{
			mouseScrnPo={
				x:oEvent.clientX,y:oEvent.clientY
			}
		};
		var curMousePosition=e2(mouseScrnPo,g_objListenEventDiv);
		this.mouseDownScrnPo=curMousePosition;
		if(oEvent.button==2){
			if(typeof ReturnOnMouseRightDown==='function'){
				ReturnOnMouseRightDown(curMousePosition);
			};
			if(G_V.iCurMapMouseState==MAP_MOUSE_STATE.drawRect||G_V.iCurMapMouseState==MAP_MOUSE_STATE.directionLine){
				var lonLatPo=k6(curMousePosition.x-G_V.dragMapLayerOriginPo.x,curMousePosition.y-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
				var geoPo={
					x:lonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR,y:lonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR
				};
				a7(geoPo,null);
			}
			else{
				a7(null,null);
			};
			if(g_objManShipClass.iCurSelectShipId>-1){
				g_objManShipClass.iCurSelectShipId=-1;
				g_objDrawObjClass.ClearShipCanvas();
				g_objDrawObjClass.DrawAllShip();
			};
			G_V.iCurMapMouseState=MAP_MOUSE_STATE.none;
		}
		else{
			if(typeof ReturnOnMouseLeftDown==='function'){
				ReturnOnMouseLeftDown(curMousePosition);
			};
			g_poLastDragScrnPo=curMousePosition;
			G_V.mouseDownScrnPo=curMousePosition;
			G_V.iTouchModel=TouchPos.startDrag;
			G_V.bMouseDownOrNot=true;
			g_objKineticClass.begin();
			f4("pointer");
			if(G_V.iCurSdkModelType==SDK_MODEL_TYPE.android){
				if(typeof ReturnSelectObjByMouseMove==='function'){
					var curSelectObjScrnPo=[];
					curSelectObjScrnPo.x=curMousePosition.x-G_V.dragMapLayerOriginPo.x;
					curSelectObjScrnPo.y=curMousePosition.y-G_V.dragMapLayerOriginPo.y;
					f5(curMousePosition,10);
				}
			};
			if(typeof ReturnSelectObjByMouseLeftDown==='function'){
				var bSelObj=f6(curMousePosition);
			}
		};
		if(G_V.iCurSdkModelType==SDK_MODEL_TYPE.pc&&g_objListenEventDiv.setCapture){
			g_objListenEventDiv.setCapture();
		};
		return false;
	};
	this.mousemove=function(evt){
		var oEvent=evt?evt:window.event;
		var mouseScrnPo;
		if(G_V.strExplorerName=="Firefox"){
			mouseScrnPo={
				x:oEvent.pageX,y:oEvent.pageY
			}
		}
		else{
			mouseScrnPo={
				x:oEvent.clientX,y:oEvent.clientY
			}
		};
		var curMousePosition=e2(mouseScrnPo,g_objListenEventDiv);
		G_V.mCurMouseScrnPo={
			x:curMousePosition.x,y:curMousePosition.y
		};
		if(G_V.bMouseDownOrNot==true){
			if(G_V.iTouchModel!=TouchPos.doZoom){
				var bDragMap=e3(g_poLastDragScrnPo.x-curMousePosition.x,g_poLastDragScrnPo.y-curMousePosition.y,false);
				if(bDragMap==true){
					g_poLastDragScrnPo=curMousePosition;
					g_objKineticClass.update(curMousePosition);
					G_V.iTouchModel=TouchPos.doDrag;
				}
			};
			G_V.bCurDragMap=true;
		}
		else{
			G_V.bCurDragMap=false;
			var lonLatPo=k6(curMousePosition.x-G_V.dragMapLayerOriginPo.x,curMousePosition.y-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
			if(G_V.objShowLonLatDiv){
				var strLon=k7(lonLatPo.x,true);
				var strLat=k7(lonLatPo.y,false);
				G_V.objShowLonLatDiv.innerHTML="<nobr>"+strLat+"</nobr><br><nobr>"+strLon+"</nobr>";
			};
			var b=a7(null,{
				x:lonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR,y:lonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR
			});
			if(typeof ReturnSelectObjByMouseMove==='function'){
				var curSelectObjScrnPo=[];
				curSelectObjScrnPo.x=curMousePosition.x-G_V.dragMapLayerOriginPo.x;
				curSelectObjScrnPo.y=curMousePosition.y-G_V.dragMapLayerOriginPo.y;
				f5(curMousePosition,10);
			}
		};
		return false;
	};
	this.mouseup=function(evt){
		var oEvent=evt?evt:window.event;
		var mouseScrnPo;
		if(G_V.strExplorerName=="Firefox"){
			mouseScrnPo={
				x:oEvent.pageX,y:oEvent.pageY
			}
		}
		else{
			mouseScrnPo={
				x:oEvent.clientX,y:oEvent.clientY
			}
		};
		var curMousePosition=e2(mouseScrnPo,g_objListenEventDiv);
		if(G_V.bMouseDownOrNot==true&&G_V.iTouchModel==TouchPos.doDrag){
			var res=g_objKineticClass.end(curMousePosition);
			if(res){
				g_objKineticClass.move(res,function(x,y){
					e3(x,y,false);
				});
			}
			else{
				g_objDrawObjClass.RedrawAllObjAfterChange();
				if(typeof ReturnAfterDragMapForPc==='function'){
					ReturnAfterDragMapForPc();
				}
			}
		};
		if(G_V.iCurMapMouseState!=MAP_MOUSE_STATE.none){
			if(Math.abs(G_V.mouseDownScrnPo.x-curMousePosition.x)+Math.abs(G_V.mouseDownScrnPo.y-curMousePosition.y)<5){
				var lonLatPo=k6(curMousePosition.x-G_V.dragMapLayerOriginPo.x,curMousePosition.y-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
				var geoPo={
					x:lonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR,y:lonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR
				};
				a7(geoPo);
			}
		};
		if(typeof ReturnOnMouseUp==='function'){
			ReturnOnMouseUp(curMousePosition);
		};
		G_V.bMouseDownOrNot=false;
		f4("default");
		if(g_objListenEventDiv.releaseCapture){
			g_objListenEventDiv.releaseCapture()
		};
		return false;
	};
	this.ClearCurMouseMove=function(){
		if(G_V.bMouseDownOrNot==false){
			return false;
		};
		g_objDrawObjClass.RedrawAllObjAfterChange();
		G_V.bMouseDownOrNot=false;
		f4("default");
		if(g_objListenEventDiv.releaseCapture){
			g_objListenEventDiv.releaseCapture();
		};
		return true;
	};
	this.resize=function(){
		alert("aaaaaaaaaaaReSize");
	};
	var m_touchstartScrnPo=null;
	this.touchstart=function(event){
		if(G_V.iTouchModel==TouchPos.doZoom){
			return false;
		};
		var oEvent=event?event:window.event;
		if(oEvent.touches.length==1){
			var mouseScrnPo={
				x:oEvent.touches[0].clientX,y:oEvent.touches[0].clientY
			};
			var curMousePosition=e2(mouseScrnPo,g_objListenEventDiv);
			g_poLastDragScrnPo=curMousePosition;
			m_touchstartScrnPo={
				x:curMousePosition.x,y:curMousePosition.y
			};
			g_objKineticClass.begin();
			G_V.iTouchModel=TouchPos.startDrag;
		}
		else{
			G_V.zoomTouchLastPo1={
				x:oEvent.touches[0].clientX,y:oEvent.touches[0].clientY
			};
			G_V.zoomTouchLastPo2={
				x:oEvent.touches[1].clientX,y:oEvent.touches[1].clientY
			};
			G_V.zoomTouchLastDis=l4(G_V.zoomTouchLastPo1,G_V.zoomTouchLastPo2);
			G_V.iTouchModel=TouchPos.startZoom;
		};
		event.preventDefault();
		return false;
	};
	this.touchmove=function(){
		if(G_V.iTouchModel==TouchPos.doZoom){
			return false;
		};
		var oEvent=event?event:window.event;
		var TouchPoCount=oEvent.touches.length;
		if(G_V.iTouchModel==TouchPos.startDrag||G_V.iTouchModel==TouchPos.doDrag){
			var mouseScrnPo={
				x:oEvent.touches[0].clientX,y:oEvent.touches[0].clientY
			};
			var curMousePosition=e2(mouseScrnPo,g_objListenEventDiv);
			var bDragMap=e3(g_poLastDragScrnPo.x-curMousePosition.x,g_poLastDragScrnPo.y-curMousePosition.y);
			if(bDragMap==true){
				g_poLastDragScrnPo=curMousePosition;
				g_objKineticClass.update(curMousePosition);
				G_V.iTouchModel=TouchPos.doDrag;
			}
		}
		else if(G_V.iTouchModel==TouchPos.startZoom){
			var curScrnPo1={
				x:oEvent.touches[0].clientX,y:oEvent.touches[0].clientY
			};
			var curScrnPo2={
				x:oEvent.touches[1].clientX,y:oEvent.touches[1].clientY
			};
			G_V.zoomTouchEndPo1=curScrnPo1;
			G_V.zoomTouchEndPo2=curScrnPo2;
			var len=Math.abs(curScrnPo1.x-G_V.zoomTouchLastPo1.x)+Math.abs(curScrnPo1.y-G_V.zoomTouchLastPo1.y);
			len+=Math.abs(curScrnPo2.x-G_V.zoomTouchLastPo2.x)+Math.abs(curScrnPo2.y-G_V.zoomTouchLastPo2.y);
			if(len>5){
				G_V.iTouchModel=TouchPos.doZoom;
				var curDis=l4(curScrnPo1,curScrnPo2);
				var offsetDis=G_V.zoomTouchLastDis-curDis;
				var zoomPosition={
					x:(curScrnPo1.x+curScrnPo2.x)/ 2, y: (curScrnPo1.y + curScrnPo2.y) /2
				};
				if(offsetDis>0){
					e6(-1,zoomPosition);
				}
				else{
					e6(1,zoomPosition);
				};
				G_V.iTouchModel==TouchPos.none;
			}
		};
		event.preventDefault();
		return false;
	};
	this.touchend=function(){
		if(G_V.iTouchModel==TouchPos.doDrag&&Math.abs(m_touchstartScrnPo.x-g_poLastDragScrnPo.x)<3&&Math.abs(m_touchstartScrnPo.y-g_poLastDragScrnPo.y)<3){
			G_V.iTouchModel=TouchPos.startDrag;
		};
		if(G_V.iTouchModel==TouchPos.doDrag){
			var curMouseScrnPo=g_poLastDragScrnPo;
			var res=g_objKineticClass.end(curMouseScrnPo);
			if(res){
				g_objKineticClass.move(res,function(x,y){
					e3(x,y);
				});
			}
			else{
				g_objDrawObjClass.RedrawAllObjAfterChange();
			};
			G_V.iTouchModel=TouchPos.none;
		}
		else if(G_V.iTouchModel==TouchPos.startZoom){
			var curDis=l4(G_V.zoomTouchEndPo1,G_V.zoomTouchEndPo2);
			var offsetDis=G_V.zoomTouchLastDis-curDis;
			var zoomPosition={
				x:(G_V.zoomTouchEndPo1.x+G_V.zoomTouchEndPo2.x)/ 2, y: (G_V.zoomTouchEndPo1.y + G_V.zoomTouchEndPo2.y) /2
			};
			if(offsetDis>0){
				e6(-1,zoomPosition);
			}
			else{
				e6(1,zoomPosition);
			}
		}
		else if(G_V.iTouchModel==TouchPos.startDrag){
			var curMouseScrnPo=g_poLastDragScrnPo;
			var curSelectObjScrnPo=[];
			curSelectObjScrnPo.x=curMouseScrnPo.x-G_V.dragMapLayerOriginPo.x;
			curSelectObjScrnPo.y=curMouseScrnPo.y-G_V.dragMapLayerOriginPo.y;
			if(G_V.iCurMapMouseState==MAP_MOUSE_STATE.none){
				if(typeof ReturnHandTouchend==='function'){
					ReturnHandTouchend(curMouseScrnPo);
				};
				if(typeof ReturnSelectObjByMouseLeftDown==='function'){
					f5(curMouseScrnPo,G_V.iAndroidCheckDisScrnLen);
					var bSelObj=f6(curSelectObjScrnPo);
				};
				if(typeof ReturnOnMouseLeftDown==='function'){
					ReturnOnMouseLeftDown(curMousePosition);
				}
			}
			else{
				var lonLatPo=k6(curSelectObjScrnPo.x,curSelectObjScrnPo.y,G_V.iCurScale);
				var geoPo={
					x:lonLatPo.x*G_V.UNI_GEO_COOR_MULTI_FACTOR,y:lonLatPo.y*G_V.UNI_GEO_COOR_MULTI_FACTOR
				};
				a7(geoPo);
			};
			g_poLastDragScrnPo=curMousePosition;
			G_V.mouseDownScrnPo=curMousePosition;
		}
	};
};
function API_AddNewShipState(iState){
	var curShipStateInfo=new c9();
	curShipStateInfo.iState=iState;
	G_V.arrShipStateInfo.push(curShipStateInfo);
	var pos=G_V.arrShipStateInfo.length-1;
	return pos;
};
function API_AddOneShip(objShipInfo){
	var pos=-1;
	if(objShipInfo){
		if(objShipInfo.shipId>-1){
			var curShipInfo=new c7();
			curShipInfo.shipId=objShipInfo.shipId;
			curShipInfo.shipMMSI=objShipInfo.shipMMSI;
			curShipInfo.shipName=objShipInfo.shipName;
			curShipInfo.shipGeoPoX=objShipInfo.shipGeoPoX;
			curShipInfo.shipGeoPoY=objShipInfo.shipGeoPoY;
			curShipInfo.shipWidth=objShipInfo.shipWidth;
			curShipInfo.shipLength=objShipInfo.shipLength;
			curShipInfo.shipSpeed=objShipInfo.shipSpeed;
			curShipInfo.shipCourse=objShipInfo.shipCourse;
			curShipInfo.shipTime=objShipInfo.shipTime;
			curShipInfo.iShipState=objShipInfo.iShipState;
			curShipInfo.bOnlineOrNot=objShipInfo.bOnlineOrNot;
			curShipInfo.bShowTrack=objShipInfo.bShowTrack;
			curShipInfo.arrExpAttrValue=objShipInfo.arrExpAttrValue;
			curShipInfo.bShipShowOrNot=true;
			pos=g_objManShipClass.AddOneShip(curShipInfo);
		}
	};
	return pos;
};
function API_AddOnePlayShipInfo(objShipInfo,arrHistroyTracks){
	var bResult=false;
	if(objShipInfo&&arrHistroyTracks){
		var arrCurExpAttrValue=null;
		if(objShipInfo.arrExpAttrValue!=null){
			arrCurExpAttrValue=[];
			var iExpCount=objShipInfo.arrExpAttrValue.length;
			for(var i=0;i<iExpCount;i++){
				arrCurExpAttrValue.push(objShipInfo.arrExpAttrValue[i]);
			}
		};
		var curShipInfo=new c7();
		curShipInfo.shipId=objShipInfo.shipId;
		curShipInfo.shipMMSI=objShipInfo.shipMMSI;
		curShipInfo.shipName=objShipInfo.shipName;
		curShipInfo.shipWidth=objShipInfo.shipWidth;
		curShipInfo.shipLength=objShipInfo.shipLength;
		curShipInfo.iShipState=objShipInfo.iShipState;
		curShipInfo.arrCurExpAttrValue=objShipInfo.arrCurExpAttrValue;
		curShipInfo.bShowTrack=objShipInfo.bShowTrack;
		var iTracksCount=arrHistroyTracks.length;
		var curArrHistroyTracks=[];
		for(var i=0;i<iTracksCount;i++){
			var curShipTrackPoint=[];
			curShipTrackPoint.trackGeoPoX=arrHistroyTracks[i].trackGeoPoX;
			curShipTrackPoint.trackGeoPoY=arrHistroyTracks[i].trackGeoPoY;
			curShipTrackPoint.trackCourse=arrHistroyTracks[i].trackCourse;
			curShipTrackPoint.trackSpeed=arrHistroyTracks[i].trackSpeed;
			curShipTrackPoint.trackTime=arrHistroyTracks[i].trackTime;
			var strTime=curShipTrackPoint.trackTime.replace(/-/g,"/");
			var curTrackTime=new Date(strTime);
			curShipTrackPoint.iTrackTime=curTrackTime.getTime();
			curArrHistroyTracks.push(curShipTrackPoint);
		};
		if(iTracksCount>0){
			curArrHistroyTracks.sort(function(a,b){
				return a.iTrackTime-b.iTrackTime;
			});
			curArrHistroyTracks.push(curArrHistroyTracks[iTracksCount-1]);
		};
		g_objManHistoryTrackClass.AddOnePlayShipInfo(curShipInfo,curArrHistroyTracks);
		bResult=true;
	};
	return bResult;
};
function API_AddPlayArea(objInfo,arrCurGeoPoints){
	var pos=-1;
	var arrGeoPoints=[];
	for(var i=0;i<arrCurGeoPoints.length;i++){
		arrGeoPoints.push({
			x:arrCurGeoPoints[i].x,y:arrCurGeoPoints[i].y
		})
	};
	if(objInfo&&arrGeoPoints){
		var showText=objInfo.showText;
		var objType=3;
		var circleR=0;
		if(objInfo.objType!=undefined&&objInfo.objType!=null){
			objType=parseInt(objInfo.objType);
		};
		if(objType==MAP_MOUSE_STATE.drawCircle){
			if(objInfo.r!=undefined&&objInfo.r!=null){
				circleR=objInfo.r;
				var hmR=circleR*0.5399568;
				arrGeoPoints=[];
				arrGeoPoints.push(arrCurGeoPoints[0]);
				var buttomGeo=l9(arrGeoPoints[0],hmR,90);
				arrGeoPoints.push(buttomGeo);
			}
			else if(arrGeoPoints.length>1){
				var lon1=parseFloat(arrGeoPoints[0].x)/10000000;
				var lat1=parseFloat(arrGeoPoints[0].y)/10000000;
				var lon2=parseFloat(arrGeoPoints[1].x)/10000000;
				var lat2=parseFloat(arrGeoPoints[1].y)/10000000;
				circleR=k9(lon1,lat1,lon2,lat2);
			}
			else{
				return false
			}
		};
		var arrCurGeoPo=[];
		var iGeoPoCount=arrGeoPoints.length;
		var minGeoX,minGeoY,maxGeoX,maxGeoY;
		for(var i=0;i<iGeoPoCount;i++){
			arrCurGeoPo.push({
				x:arrGeoPoints[i].x,y:arrGeoPoints[i].y
			});
			if(i==0){
				minGeoX=arrGeoPoints[0].x;
				minGeoY=arrGeoPoints[0].y;
				maxGeoX=arrGeoPoints[0].x;
				maxGeoY=arrGeoPoints[0].y;
			}
			else{
				minGeoX=Math.min(minGeoX,arrGeoPoints[i].x);
				minGeoY=Math.min(minGeoY,arrGeoPoints[i].y);
				maxGeoX=Math.max(maxGeoX,arrGeoPoints[i].x);
				maxGeoY=Math.max(maxGeoY,arrGeoPoints[i].x);
			}
		};
		if(arrCurGeoPo.length>2||(arrCurGeoPo.length==2&&objType==MAP_MOUSE_STATE.drawCircle)){
			var curObj=new c6();
			curObj.showText=showText;
			curObj.arrGeoPo=arrCurGeoPo;
			curObj.objType=objType;
			curObj.circleR=circleR;
			curObj.minGeoX=minGeoX;
			curObj.maxGeoX=maxGeoX;
			curObj.minGeoY=minGeoY;
			curObj.maxGeoY=maxGeoY;
			pos=g_objManHistoryTrackClass.AddPlayArea(curObj);
		}
	};
	return pos;
};
function API_AddShipStateStyleByPos(iStatePos,objStateStyle){
	var bResult=false;
	if(G_V.arrShipStateInfo.length>iStatePos){
		if(objStateStyle.arrSymbolPo&&objStateStyle.arrSymbolPo.length>0){
			var iSymbolPoCount=objStateStyle.arrSymbolPo.length;
			var arrSymbolPo=[];
			for(var i=0;i<iSymbolPoCount;i++){
				arrSymbolPo.push({
					x:objStateStyle.arrSymbolPo[i].x,y:objStateStyle.arrSymbolPo[i].y
				});
			};
			var arrSymbolPo=arrSymbolPo;
			var minScale=objStateStyle.minScale;
			var maxScale=objStateStyle.maxScale;
			var borderSize=objStateStyle.borderSize;
			var borderColor=objStateStyle.borderColor;
			var fillColor=objStateStyle.fillColor;
			var iOpacity=objStateStyle.iOpacity;
			G_V.arrShipStateInfo[iStatePos].AddShipStyle(arrSymbolPo,minScale,maxScale,borderSize,borderColor,fillColor,iOpacity);
			bResult=true;
		}
		else if(objStateStyle.bImgSymbol&&objStateStyle.strImgSrc){
			var bImgSymbol=objStateStyle.bImgSymbol;
			var strImgSrc=objStateStyle.strImgSrc;
			var imgWidth=objStateStyle.iImgWidth;
			var iImgHeight=objStateStyle.iImgHeight;
			var minScale=objStateStyle.minScale;
			var maxScale=objStateStyle.maxScale;
			var iOpacity=objStateStyle.iOpacity;
			var fillColor=objStateStyle.fillColor;
			G_V.arrShipStateInfo[iStatePos].AddShipStyleImg(bImgSymbol,strImgSrc,imgWidth,iImgHeight,minScale,maxScale,iOpacity,fillColor);
			bResult=true;
		}
	};
	return bResult;
};
function API_ClearPlayHistoryTrackInfo(){
	var bResult=g_objManHistoryTrackClass.ClearPlayHistoryTrackInfo();
	return bResult;
};
function API_DelOneShipByPos(iShipPos){
	var bResult=g_objManShipClass.DelOneShipByPos(iShipPos);
	return bResult;
};
function API_DelAllShips(){
	var bResult=g_objManShipClass.DelAllShips();
	return bResult;
};
function API_EndPlayHistoryTrack(){
	var bResult=g_objManHistoryTrackClass.EndPlayHistoryTrack();
	return bResult;
};
function API_FastPlayHistoryTrack(iFastStep){
	var bResult=g_objManHistoryTrackClass.FastPlayHistoryTrack(iFastStep);
	return bResult;
};
function API_FollowShipByPos(iShipPos){
	var bResult=false;
	bResult=g_objManShipClass.SetFollowShipByPos(iShipPos);
	return bResult;
};
function API_FollowPlayShipByPos(iShipPos){
	var bResult=false;
	bResult=g_objManHistoryTrackClass.SetFollowShipByPos(iShipPos);
	return bResult;
};
function API_GetCurFollowShipInfo(){
	var curShipInfo=null;
	var getShipInfo=null;
	if(G_V.bIsPlayShipHistoryTrack==true){
		var iShipPos=g_objManHistoryTrackClass.GetShipPosById(g_objManHistoryTrackClass.iCurFollowShipId);
		getShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
	}
	else{
		var iShipPos=g_objManShipClass.GetShipPosById(g_objManShipClass.iCurFollowShipId);
		getShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
	};
	if(getShipInfo){
		curShipInfo=getShipInfo.GetShipInfoToArr();
	};
	return curShipInfo;
};
function API_GetCurSelectShipInfo(){
	var curShipInfo=null;
	var getShipInfo=null;
	if(G_V.bIsPlayShipHistoryTrack==true){
		var iShipPos=g_objManHistoryTrackClass.GetShipPosById(g_objManHistoryTrackClass.iCurSelectShipId);
		getShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
	}
	else{
		var iShipPos=g_objManShipClass.GetShipPosById(g_objManShipClass.iCurSelectShipId);
		getShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
	};
	if(getShipInfo){
		curShipInfo=getShipInfo.GetShipInfoToArr();
	};
	return curShipInfo;
};
function API_GetPlayHistroyTrackInfoByPos(iShipPos,iTrackPos){
	var getTrackInfo=g_objManHistoryTrackClass.GetTrackInfoByPos(iShipPos,iTrackPos);
	var curTrackInfo=null;
	if(getTrackInfo){
		curTrackInfo=[];
		curTrackInfo.trackGeoPoX=getTrackInfo.trackGeoPoX;
		curTrackInfo.trackGeoPoY=getTrackInfo.trackGeoPoY;
		curTrackInfo.trackCourse=getTrackInfo.trackCourse;
		curTrackInfo.trackSpeed=getTrackInfo.trackSpeed;
		curTrackInfo.trackTime=getTrackInfo.trackTime;
	};
	return curTrackInfo;
};
function API_GetPlayShipInfoByPos(iShipPos){
	var getShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
	var curShipInfo=null;
	if(getShipInfo){
		curShipInfo=getShipInfo.GetShipInfoToArr();
	};
	return curShipInfo;
};
function API_GetPlayShipPosById(iShipId){
	var iShipPos=g_objManHistoryTrackClass.GetShipPosById(iShipId);
	return iShipPos;
};
function API_GetShipAllExpAttrByPos(iShipPos){
	var arrAllExp=null;
	var getShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
	if(getShipInfo){
		var arrGetAllExp=getShipInfo.arrExpAttrValue;
		if(arrGetAllExp){
			var iExpAttrCount=arrGetAllExp.length;
			if(iExpAttrCount>0){
				arrAllExp=[];
				for(var i=0;i<iExpAttrCount;i++){
					arrAllExp.push(arrGetAllExp[i]);
				}
			}
		}
	};
	return arrAllExp;
};
function API_GetShipCountByState(iShipState){
	var iShipCount=g_objManShipClass.GetShipCountByState(iShipState);
	return iShipCount;
};
function API_GetShipInfoByPos(iShipPos){
	var getShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
	var curShipInfo=null;
	if(getShipInfo){
		curShipInfo=getShipInfo.GetShipInfoToArr();
	};
	return curShipInfo;
};
function API_GetShipInfoByScrnPo(scrnPo,checkScrnLen){
	var curShipInfo=null;
	if(checkScrnLen==null){
		checkScrnLen=10;
	};
	var curSelectShipObj=g_objDrawObjClass.SelectScrnShipInfo(scrnPo,checkScrnLen,true);
	if(curSelectShipObj){
		var iShipId=curSelectShipObj.id;
		var getShipInfo=null;
		if(curSelectShipObj.bSelPlayTrackShip==true){
			var iShipPos=g_objManHistoryTrackClass.GetShipPosById(iShipId);
			curShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
		}
		else{
			var iShipPos=g_objManShipClass.GetShipPosById(iShipId);
			curShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
		}
	};
	return curShipInfo;
};
function API_GetShipOneExpAttrByPos(iShipPos,iExpAttrPos){
	var strExpAttr=null;
	var getShipInfo=null;
	if(G_V.bIsPlayShipHistoryTrack==true){
		getShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
	}
	else{
		getShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
	};
	if(getShipInfo){
		var arrGetAllExp=getShipInfo.arrExpAttrValue;
		var iExpAttrCount=arrGetAllExp.length;
		if(iExpAttrPos>-1&&iExpAttrCount>iExpAttrPos){
			strExpAttr=arrGetAllExp[iExpAttrPos];
		}
	};
	return strExpAttr;
};
function API_GetShipPosById(iShipId){
	var iShipPos=g_objManShipClass.GetShipPosById(iShipId);
	return iShipPos;
};
function API_GetShipsCount(){
	var iShipCount=g_objManShipClass.GetShipsCount();
	return iShipCount;
};
function API_ReDrawPlayShip(){
	if(G_V.bCurDragMap==true){
		return;
	};
	g_objDrawObjClass.ClearShipHistroyTrackCanvas();
	g_objDrawObjClass.DrawAllShipHistroyTrack();
};
function API_ReDrawShips(){
	if(G_V.bCurDragMap==true){
		return;
	};
	g_objDrawObjClass.ClearShipCanvas();
	g_objDrawObjClass.DrawAllShip();
};
function API_ReStartPlayHistoryTrack(){
	var bResult=g_objManHistoryTrackClass.ReStartPlayHistoryTrack();
	return bResult;
};
function API_SelectShipByCondition(strShipNameOrMmsi){
	var arrCurShipInfo=null;
	var arrSelShipInfos=g_objManShipClass.SelectShipByCondition(strShipNameOrMmsi);
	if(arrSelShipInfos){
		var iShipCount=arrSelShipInfos.length;
		arrCurShipInfo=[];
		for(var i=0;i<iShipCount;i++){
			var getShipInfo=arrSelShipInfos[i];
			var curShipInfo=getShipInfo.GetShipInfoToArr();
			arrCurShipInfo.push(curShipInfo);
		}
	};
	return arrCurShipInfo;
};
function API_SetOneShipStyleByPos(iShipPos,bGetOwnStyle,objStyle){
	var bResult=false;
	var getShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
	if(getShipInfo){
		getShipInfo.bGetOwnStyle=bGetOwnStyle;
		if(objStyle){
			getShipInfo.strFillColor=objStyle.strFillColor;
			getShipInfo.iBorderSize=objStyle.iBorderSize;
			getShipInfo.strBorderColor=objStyle.strBorderColor;
		};
		bResult=true;
	};
	return bResult;
};
function API_SetIsShowOfflineShipOrNot(bShowOrNot){
	G_V.bShowOfflineShipOrNot=bShowOrNot;
	return true;
};
function API_SetOffLineShipStyle(bGetStyle,objStyle){
	if(objStyle){
		G_V.OfflineShipStyle.strFillColor=objStyle.strFillColor;
		G_V.OfflineShipStyle.strBorderColor=objStyle.strBorderColor;
		G_V.OfflineShipStyle.iBorderSize=objStyle.iBorderSize;
		G_V.OfflineShipStyle.iOpacity=90;
	};
	G_V.OfflineShipStyle.bGetStyle=bGetStyle;
	return true;
};
function API_SetAllShipsShowOrNot(bShowOrNot){
	G_V.bCurIsShowShipOrNot=bShowOrNot;
	return true;
};
function API_SetPlayHistoryTrackTimeStep(iTimeStep){
	var bResult=g_objManHistoryTrackClass.SetPlayHistoryTrackTimeStep(iTimeStep);
	return bResult;
};
function API_SetPlayShipToMapViewCenterByPos(iShipPos){
	var bResult=false;
	var curShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
	if(curShipInfo){
		var lon=curShipInfo.shipGeoPoX/G_V.UNI_GEO_COOR_MULTI_FACTOR;
		var lat=curShipInfo.shipGeoPoY/G_V.UNI_GEO_COOR_MULTI_FACTOR;
		f7(lon,lat,null);
		var bReDrawShip=g_objManHistoryTrackClass.SetSelectShipByPos(iShipPos);
		if(bReDrawShip==true){
			g_objDrawObjClass.ClearShipHistroyTrackCanvas();
			g_objDrawObjClass.DrawAllShipHistroyTrack();
		}
	};
	return bResult;
};
function API_SetSaveTrackPoCount(iSaveTrackPoCount){
	g_objManShipClass.iShowShipTrackPoCount=iSaveTrackPoCount;
};
function API_SetSelectPlayShipByPos(iShipPos){
	var bReDrawShip=false;
	bReDrawShip=g_objManHistoryTrackClass.SetSelectShipByPos(iShipPos);
	if(bReDrawShip==true){
		g_objDrawObjClass.ClearShipHistroyTrackCanvas();
		g_objDrawObjClass.DrawAllShipHistroyTrack();
	};
	return bReDrawShip;
};
function API_SetSelectShipByPos(iShipPos){
	var bReDrawShip=false;
	bReDrawShip=g_objManShipClass.SetSelectShipByPos(iShipPos);
	if(bReDrawShip==true){
		g_objDrawObjClass.ClearShipCanvas();
		g_objDrawObjClass.DrawAllShip();
	};
	return bReDrawShip;
};
function API_SetShipAllExpAttrByPos(iShipPos,arrAllExpAttr){
	var bResult=false;
	if(iShipPos>0&&arrAllExpAttr){
		var getShipInfo=null;
		if(G_V.bIsPlayShipHistoryTrack==true){
			getShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
		}
		else{
			getShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
		};
		if(getShipInfo){
			var iExpAttrCount=arrAllExpAttr.length;
			if(iExpAttrCount>0){
				getShipInfo.arrExpAttrValue=[];
				for(var i=0;i<iExpAttrCount;i++){
					getShipInfo.arrExpAttrValue.push(arrAllExpAttr[i]);
				};
				bResult=true;
			}
		}
	};
	return bResult;
};
function API_SetShipHeadLineSize(iLineSize){
	G_V.iDrawDefaultHeadLineLen=iLineSize;
	return true;
};
function API_SetShipOneExpAttrByPos(iShipPos,iExpAttrPos,strExpAttr){
	var bResult=false;
	if(iShipPos>0&&iExpAttrPos>0&&arrAllExpAttr){
		var getShipInfo=null;
		if(G_V.bIsPlayShipHistoryTrack==true){
			getShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
		}
		else{
			getShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
		};
		if(getShipInfo){
			var arrAllExpAttr=getShipInfo.arrExpAttrValue;
			var iExpAttrCount=arrAllExpAttr.length;
			while(iExpAttrPos-iExpAttrCount>-1){
				arrAllExpAttr.push(null);
			};
			arrAllExpAttr[iExpAttrPos]=strExpAttr;
			bResult=true;
		}
	};
	return bResult;
};
function API_SetShipsShowOrNotByShipState(iShipState,bShowOrNot){
	var bResult=false;
	var iStateCount=G_V.arrShipStateInfo.length;
	for(var iPos=0;iPos<iStateCount;iPos++){
		if(G_V.arrShipStateInfo[iPos].iState==iShipState){
			bResult=true;
			G_V.arrShipStateInfo[iPos].bShowOrNot=bShowOrNot;
			break;
		}
	};
	return bResult;
};
function API_SetShipStyleInSmallScale(iSmallScale,strColor,iCircleShipR){
	G_V.iDrawCircleShipMaxScale=iSmallScale;
	G_V.strCircleShipColor=strColor;
	G_V.iDrawCircleShipR=iCircleShipR;
};
function API_SetShipToMapViewCenterByPos(iShipPos){
	var bResult=false;
	var curShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
	if(curShipInfo){
		var lon=curShipInfo.shipGeoPoX/G_V.UNI_GEO_COOR_MULTI_FACTOR;
		var lat=curShipInfo.shipGeoPoY/G_V.UNI_GEO_COOR_MULTI_FACTOR;
		f7(lon,lat,null);
		var bReDrawShip=g_objManShipClass.SetSelectShipByPos(iShipPos);
		if(bReDrawShip==true){
			g_objDrawObjClass.ClearShipCanvas();
			g_objDrawObjClass.DrawAllShip();
		}
	};
	return bResult;
};
function API_SetShowPlayShipTrackOrNotByPos(iShipPos,bShowOrNot){
	var bResult=false;
	var curShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
	if(curShipInfo){
		curShipInfo.bShowTrack=bShowOrNot;
		bResult=true;
	};
	return bResult;
};
function API_SetShowShipInfo(bShowInfo,iStartShowScale,bShowNameOrMmsi,bNameToNullMmsi){
	G_V.iStartShowShipInfo=iStartShowScale;
	G_V.bShowShipNameOrMMsi=bShowNameOrMmsi;
	G_V.bShowShipInfo=bShowInfo;
	G_V.bNameToNullMmsi=bNameToNullMmsi;
};
function API_SetShowShipInfoStyle(strFont,strColor,iOpacity){
	G_V.strShipInfoFont=strFont;
	G_V.strShipInfoColor=strColor;
	G_V.iShipInfoOpacity=iOpacity;
};
function API_SetShowShipTrackOrNotByPos(iShipPos,bShowOrNot){
	var bResult=false;
	var curShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
	if(curShipInfo){
		curShipInfo.bShowTrack=bShowOrNot;
		bResult=true;
	};
	return bResult;
};
function API_SetStartShowShipScale(iShowShipScale){
	G_V.iStartShowShipScale=iShowShipScale;
	return true;
};
function API_StartPlayShipHistoryTrack(){
	g_objManHistoryTrackClass.StartPlayShipHistoryTrack();
};
function API_StopPlayHistoryTrackOrNot(bStopOrNot){
	var bResult=g_objManHistoryTrackClass.StopPlayHistoryTrackOrNot(bStopOrNot);
	return bResult;
};
function API_UpdateOneShipDynamicInfoByPos(iShipPos,objDynamicInfo){
	var bResult=false;
	if(objDynamicInfo){
		var shipGeoPoX=objDynamicInfo.shipGeoPoX;
		var shipGeoPoY=objDynamicInfo.shipGeoPoY;
		var shipSpeed=objDynamicInfo.shipSpeed;
		var shipCourse=objDynamicInfo.shipCourse;
		var shipTime=objDynamicInfo.shipTime;
		var iShipState=objDynamicInfo.iShipState;
		var bOnlineOrNot=objDynamicInfo.bOnlineOrNot;
		bResult=g_objManShipClass.UpdateShipDynamicInfoByPos(iShipPos,shipGeoPoX,shipGeoPoY,shipSpeed,shipCourse,shipTime,iShipState,bOnlineOrNot);
	};
	return bResult;
};
function API_SetFocusShipShowStyleByMinScale(iScale){
	if(isNaN(iScale)==false){
		G_V.iShowFocusShipStyleMinScale=iScale;
		return true
	};
	return false
};
function API_GetShipIdOrPosByState(iShipState,bGetIdOrPos){
	var arrShipValue=g_objManShipClass.GetShipIdOrPosByState(iShipState,bGetIdOrPos);
	return arrShipValue;
};
function API_AddFaceLayerStyleByPos(iLayerPos,objFaceStyleInfo){
	var stylePos=-1;
	var curLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	if(curLayerInfo.type==LAYER_TYPE.face){
		var borderWith=null;
		var borderColor=null;
		var bFilled=null;
		var fillColor=null;
		var iOpacity=null;
		var bShowImg=null;
		var strImgSrc=null;
		var iImgWidth=null;
		var iImgHeight=null;
		var bShowText=null;
		var textColor=null;
		var fontSize=null;
		var iTextOpacity=null;
		var iLineOpacity=null;
		if(objFaceStyleInfo){
			borderWith=objFaceStyleInfo.borderWith;
			borderColor=objFaceStyleInfo.borderColor;
			bFilled=objFaceStyleInfo.bFilled;
			fillColor=objFaceStyleInfo.fillColor;
			iOpacity=objFaceStyleInfo.iOpacity;
			textColor=objFaceStyleInfo.textColor;
			fontSize=objFaceStyleInfo.fontSize;
			iTextOpacity=objFaceStyleInfo.iTextOpacity;
			if(objFaceStyleInfo.iLineOpacity){
				iLineOpacity=objFaceStyleInfo.iLineOpacity;
			}
		};
		stylePos=g_objManObjClass.AddLayerStyleByPos(iLayerPos,borderWith,borderColor,bFilled,fillColor,iOpacity,bShowImg,strImgSrc,iImgWidth,iImgHeight,bShowText,textColor,fontSize,iTextOpacity,null,iLineOpacity);
	};
	return stylePos;
};
function API_AddLineLayerStyleByPos(iLayerPos,objLineStyleInfo){
	var stylePos=-1;
	var curLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	if(curLayerInfo.type==LAYER_TYPE.line){
		var borderWith=null;
		var borderColor=null;
		var bFilled=null;
		var fillColor=null;
		var iOpacity=null;
		var bShowImg=null;
		var strImgSrc=null;
		var iImgWidth=null;
		var iImgHeight=null;
		var bShowText=null;
		var textColor=null;
		var fontSize=null;
		var iTextOpacity=null;
		if(objLineStyleInfo){
			borderWith=objLineStyleInfo.borderWith;
			borderColor=objLineStyleInfo.borderColor;
			iOpacity=objLineStyleInfo.iOpacity;
			bShowText=objLineStyleInfo.bShowText;
			textColor=objLineStyleInfo.textColor;
			fontSize=objLineStyleInfo.fontSize;
			iTextOpacity=objLineStyleInfo.iTextOpacity;
		};
		stylePos=g_objManObjClass.AddLayerStyleByPos(iLayerPos,borderWith,borderColor,bFilled,fillColor,iOpacity,bShowImg,strImgSrc,iImgWidth,iImgHeight,bShowText,textColor,fontSize,iTextOpacity,null,null);
	};
	return stylePos;
};
function API_AddNewLayer(objLayerInfo,arrExpAttrValue){
	var pos=-1;
	if(objLayerInfo){
		var id=objLayerInfo.id;
		var type=objLayerInfo.type;
		var name=objLayerInfo.name;
		var bShow=objLayerInfo.bShow;
		var minShowScale=objLayerInfo.minShowScale;
		var maxShowScale=objLayerInfo.maxShowScale;
		var bShowTextOrNot=objLayerInfo.bShowTextOrNot;
		var iStartShowTextScale=objLayerInfo.iStartShowTextScale;
		pos=g_objManObjClass.AddNewLayer(id,type,name,bShow,minShowScale,maxShowScale,bShowTextOrNot,iStartShowTextScale);
		if(arrExpAttrValue&&pos>-1){
			var iExpAttrCount=arrExpAttrValue.length;
			var arrCurExpAttrValue=[];
			for(var i=0;i<iExpAttrCount;i++){
				arrCurExpAttrValue.push(arrExpAttrValue[i]);
			};
			g_objManObjClass.SetLayerExpAttrValueByPos(pos,arrCurExpAttrValue);
		}
	};
	return pos;
};
function API_AddNewObject(objInfo,arrGeoPoints,arrExpAttrValue){
	var iObjPos=-1;
	if(objInfo){
		var layerPos=-1;
		if(objInfo.layerPos!=null&&objInfo.layerPos!=undefined){
			layerPos=objInfo.layerPos;
		};
		var objId=objInfo.objId;
		if(objInfo.objId!=null&&objInfo.objId!=undefined){
			objId=objInfo.objId;
		};
		var objType=objInfo.objType;
		if(objInfo.objType!=null&&objInfo.objType!=undefined){
			objType=objInfo.objType;
		};
		var name=objInfo.name;
		if(objInfo.name!=null&&objInfo.name!=undefined){
			name=objInfo.name;
		};
		var showText=objInfo.showText;
		if(objInfo.showText!=null&&objInfo.showText!=undefined){
			showText=objInfo.showText;
		};
		var layerStylePos=objInfo.layerStylePos;
		if(objInfo.layerStylePos!=null&&objInfo.layerStylePos!=undefined){
			layerStylePos=objInfo.layerStylePos;
		};
		var arrCurGeoPo=[];
		var arrCurExpAttr=[];
		var iGeoPoCount=0;
		if(arrGeoPoints!=null&&arrGeoPoints!=undefined){
			iGeoPoCount=arrGeoPoints.length;
		};
		for(var i=0;i<iGeoPoCount;i++){
			arrCurGeoPo.push({
				x:arrGeoPoints[i].x,y:arrGeoPoints[i].y
			});
		};
		var iExpAttrCount=0;
		if(arrExpAttrValue!=null&&arrExpAttrValue!=undefined){
			iExpAttrCount=arrExpAttrValue.length;
		};
		for(var i=0;i<iExpAttrCount;i++){
			arrCurExpAttr.push(arrExpAttrValue[i]);
		};
		iObjPos=g_objManObjClass.AddNewObject(layerPos,objType,objId,name,showText,layerStylePos,arrCurGeoPo,arrCurExpAttr);
		if(objType==MAP_MOUSE_STATE.drawRect){
			if(objInfo.w&&objInfo.h){
				var w=objInfo.w;
				var h=objInfo.h;
				var bSet=g_objManObjClass.SetRectObjSize(layerPos,iObjPos,w,h);
			}
		}
		else if(objType==MAP_MOUSE_STATE.drawCircle){
			if(objInfo.r){
				var r=objInfo.r;
				var bSet=g_objManObjClass.SetCircleObjRlen(layerPos,iObjPos,r);
			}
		}
	};
	return iObjPos;
};
function API_AddPointLayerStyleByPos(iLayerPos,objPointStyleInfo){
	var stylePos=-1;
	var curLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	if(curLayerInfo.type==LAYER_TYPE.point){
		var borderWith=null;
		var borderColor=null;
		var bFilled=null;
		var fillColor=null;
		var iOpacity=null;
		var bShowImg=false;
		var strImgSrc=null;
		var iImgWidth=null;
		var iImgHeight=null;
		var bShowText=null;
		var textColor=null;
		var fontSize=null;
		var iTextOpacity=null;
		var arrSymbolPo=null;
		var iCheckDrawMinNearOtherLen=null;
		var bShowImg=null;
		var iCircleScrnR=null;
		var offsetScrnPo=null;
		if(objPointStyleInfo){
			bShowImg=objPointStyleInfo.bShowImg;
			if((bShowImg==true||objPointStyleInfo.arrSymbolPo==null)&&objPointStyleInfo.strImgSrc){
				if(objPointStyleInfo.offsetScrnPo){
					offsetScrnPo={
						x:objPointStyleInfo.offsetScrnPo.x,y:objPointStyleInfo.offsetScrnPo.y
					};
				};
				strImgSrc=objPointStyleInfo.strImgSrc;
			}
			else{
				bShowImg=false;
				arrSymbolPo=objPointStyleInfo.arrSymbolPo;
				borderWith=objPointStyleInfo.borderWith;
				borderColor=objPointStyleInfo.borderColor;
				bFilled=objPointStyleInfo.bFilled;
				fillColor=objPointStyleInfo.fillColor;
				iOpacity=objPointStyleInfo.iOpacity;
				iCircleScrnR=objPointStyleInfo.iCircleR;
			};
			iImgWidth=objPointStyleInfo.iImgWidth;
			iImgHeight=objPointStyleInfo.iImgHeight;
			bShowText=objPointStyleInfo.bShowText;
			textColor=objPointStyleInfo.textColor;
			fontSize=objPointStyleInfo.fontSize;
			iCheckDrawMinNearOtherLen=objPointStyleInfo.iCheckDrawMinNearOtherLen;
			iTextOpacity=objPointStyleInfo.iTextOpacity;
		};
		stylePos=g_objManObjClass.AddLayerStyleByPos(iLayerPos,borderWith,borderColor,bFilled,fillColor,iOpacity,bShowImg,strImgSrc,iImgWidth,iImgHeight,bShowText,textColor,fontSize,iTextOpacity,iCheckDrawMinNearOtherLen,null,offsetScrnPo);
		if(bShowImg==false||arrSymbolPo!=null){
			g_objManObjClass.SetPointObjSybolPo(iLayerPos,stylePos,arrSymbolPo,iCircleScrnR,bShowImg)
		}
	};
	return stylePos;
};
function API_DelLayerByPos(iLayerPos){
	var bResult=g_objManObjClass.DelLayerByPos(iLayerPos);
	return bResult;
};
function API_DelObjectByPos(iLayerPos,iObjPos){
	var bResult=false;
	var curLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	if(curLayerInfo){
		bResult=curLayerInfo.DelObjectByPos(iObjPos);
	};
	return bResult;
};
function API_GetCurDrawDynamicObjGeoPo(){
	var arrCurGeoPo=null;
	if(G_V.arrDrawDynamicObjGeoPo){
		arrCurGeoPo=[];
		var iCount=G_V.arrDrawDynamicObjGeoPo.length;
		for(var i=0;i<iCount;i++){
			arrCurGeoPo.push({
				x:G_V.arrDrawDynamicObjGeoPo[i].x,y:G_V.arrDrawDynamicObjGeoPo[i].y
			});
		}
	};
	return arrCurGeoPo;
};
function API_GetLayerAllExpAttrByPos(iLayerPos){
	var arrGetAllExpAttr=g_objManObjClass.GetLayerAllExpAttrByPos(iLayerPos);
	var arrCurAllExpAttr=null;
	if(arrGetAllExpAttr){
		var iCount=arrGetAllExpAttr.length;
		arrCurAllExpAttr=[];
		for(var i=0;i<iCount;i++){
			arrCurAllExpAttr.push(arrGetAllExpAttr[i]);
		}
	};
	return arrCurAllExpAttr;
};
function API_GetLayerCount(){
	var iLayerCount=g_objManObjClass.arrLayerInfo.length;
	return iLayerCount;
};
function API_GetLayerInfoByPos(iLayerPos){
	var getLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	var curLayerInfo=null;
	if(getLayerInfo){
		curLayerInfo=[];
		curLayerInfo.type=getLayerInfo.type;
		curLayerInfo.id=getLayerInfo.id;
		curLayerInfo.name=getLayerInfo.name;
		curLayerInfo.bShow=getLayerInfo.bShow;
	};
	return curLayerInfo;
};
function API_GetLayerObjectCountByPos(iLayerPos){
	var getLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	var iObjCount=0;
	if(getLayerInfo){
		iObjCount=getLayerInfo.arrObjInfo.length;
	};
	return iObjCount;
};
function API_GetLayerOneExpAttrByPos(iLayerPos,iExpAttrPos){
	var strExpAttr=g_objManObjClass.GetLayerOneExpAttrByPos(iLayerPos,iExpAttrPos);
	return strExpAttr;
};
function API_GetLayerPosById(iLayerId){
	var pos=g_objManObjClass.GetLayerPosById(iLayerId);
	return pos;
};
function API_GetObjectAllExpAttrByPos(iLayerPos,iObjPos){
	var arrExpAttrValue=null;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo){
		if(curObjInfo.arrExpAttrValue){
			arrExpAttrValue=[];
			var iExpCount=curObjInfo.arrExpAttrValue.length;
			for(var i=0;i<iExpCount;i++){
				arrExpAttrValue.push(curObjInfo.arrExpAttrValue[i]);
			}
		}
	};
	return arrExpAttrValue;
};
function API_GetObjectGeoInfoByPos(iLayerPos,iObjPos){
	var arrGeoPo=g_objManObjClass.GetObjectGeoInfoByPos(iLayerPos,iObjPos);
	var currArrGeoPo=[];
	var iPoCount=arrGeoPo.length;
	for(var i=0;i<iPoCount;i++){
		currArrGeoPo.push({
			x:arrGeoPo[i].x,y:arrGeoPo[i].y
		});
	};
	return currArrGeoPo;
};
function API_GetObjectInfoByPos(iLayerPos,iObjPos){
	var objInfo=null;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo){
		objInfo=[];
		objInfo.id=curObjInfo.id;
		objInfo.objType=curObjInfo.objType;
		objInfo.name=curObjInfo.name;
		objInfo.strShowText=curObjInfo.strShowText;
		objInfo.bShow=curObjInfo.bShow;
		objInfo.rectW=curObjInfo.rectW;
		objInfo.rectH=curObjInfo.rectH;
		objInfo.circleR=curObjInfo.circleR;
		objInfo.layerStylePos=curObjInfo.layerStylePos;
		objInfo.maxGeoX=curObjInfo.maxGeoX;
		objInfo.minGeoX=curObjInfo.minGeoX;
		objInfo.maxGeoY=curObjInfo.maxGeoY;
		objInfo.minGeoY=curObjInfo.minGeoY;
		var arrExpAttrValue=null;
		if(curObjInfo.arrExpAttrValue){
			arrExpAttrValue=[];
			var iExpCount=curObjInfo.arrExpAttrValue.length;
			for(var i=0;i<iExpCount;i++){
				arrExpAttrValue.push(curObjInfo.arrExpAttrValue[i]);
			}
		};
		objInfo.arrExpAttrValue=curObjInfo.arrExpAttrValue;
	};
	return objInfo;
};
function API_GetObjectOneExpAttrByPos(iLayerPos,iObjPos,iExpAttrPos){
	var strValue=null;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo){
		strValue=curObjInfo.GetObjectOneExpAttrByPos(iExpAttrPos);
	};
	return strValue;
};
function API_GetObjectPosById(iObjId,iLayerPos){
	var objPos=g_objManObjClass.GetObjectPosById(iObjId,iLayerPos);
	return objPos;
};
function API_ReDrawLayer(){
	g_objDrawObjClass.ClearObjCanvas();
	g_objDrawObjClass.DrawAllObject();
};
function API_SetCurDrawDynamicUseType(iState){
	G_V.arrDrawDynamicObjGeoPo=null;
	G_V.arrDrawDynamicObjGeoPo=[];
	a8();
	G_V.iCurMapMouseState=iState;
	G_V.iCurDynamicType=iState;
};
function API_SetFaceObjStyleByPos(iLayerPos,iObjPos,bShowOwnStyle,objStyleInfo){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo){
		curObjInfo.bGetOwnStyle=bShowOwnStyle;
		if(objStyleInfo){
			if(curObjInfo.style==undefined||curObjInfo.style==null){
				curObjInfo.style=new c4();
			};
			if(objStyleInfo.bFilled!=undefined&&objStyleInfo.bFilled!=null){
				curObjInfo.style.bFilled=objStyleInfo.bFilled;
			};
			if(objStyleInfo.fillColor!=undefined&&objStyleInfo.fillColor!=null){
				curObjInfo.style.fillColor=objStyleInfo.fillColor;
			};
			if(objStyleInfo.iOpacity!=undefined&&objStyleInfo.iOpacity!=null){
				curObjInfo.style.iOpacity=objStyleInfo.iOpacity;
			};
			if(objStyleInfo.borderWith!=undefined&&objStyleInfo.borderWith!=null){
				curObjInfo.style.borderWith=objStyleInfo.borderWith;
			};
			if(objStyleInfo.borderColor!=undefined&&objStyleInfo.borderColor!=null){
				curObjInfo.style.borderColor=objStyleInfo.borderColor;
			};
			if(objStyleInfo.textColor!=undefined&&objStyleInfo.textColor!=null){
				curObjInfo.style.textColor=objStyleInfo.textColor;
			};
			if(objStyleInfo.fontSize!=undefined&&objStyleInfo.fontSize!=null){
				curObjInfo.style.fontSize=objStyleInfo.fontSize;
			};
			if(objStyleInfo.bShowText!=undefined&&objStyleInfo.bShowText!=null){
				curObjInfo.style.bShowText=objStyleInfo.bShowText;
			};
			if(objStyleInfo.iTextOpacity!=undefined&&objStyleInfo.iTextOpacity!=null){
				curObjInfo.style.iTextOpacity=objStyleInfo.iTextOpacity;
			};
			if(objStyleInfo.iLineOpacity!=undefined&&objStyleInfo.iLineOpacity!=null){
				curObjInfo.style.iLineOpacity=objStyleInfo.iLineOpacity;
			}
		};
		bResult=true;
	};
	return bResult;
};
function API_SetIsDrawLayerObjOrNot(bShowOrNot){
	G_V.bShowObjectOrNot=bShowOrNot;
	return true;
};
function API_SetLayerAllExpAttrByPos(iLayerPos,arrAllExpAttr){
	var bResult=false;
	if(arrAllExpAttr){
		var curArrAllExpAttr=[];
		var iCount=arrAllExpAttr.length;
		for(var i=0;i<iCount;i++){
			curArrAllExpAttr.push(arrAllExpAttr[i]);
		};
		bResult=g_objManObjClass.SetLayerAllExpAttrByPos(iLayerPos,curArrAllExpAttr);
	};
	return bResult;
};
function API_SetLayerObjShowTextOrNot(iLayerPos,bShowTextOrNot,iStartShowTextScale){
	var bResult=false;
	var getLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	if(getLayerInfo){
		getLayerInfo.bShowTextOrNot=bShowTextOrNot;
		getLayerInfo.iStartShowTextScale=iMaxScale;
		bResult=true;
	};
	return bResult;
};
function API_SetLayerOneExpAttrByPos(iLayerPos,iExpAttrPos,strExpAttrValue){
	var strExpAttr=g_objManObjClass.SetLayerOneExpAttrByPos(iLayerPos,iExpAttrPos,strExpAttrValue);
	return strExpAttr;
};
function API_SetLayerShowMinMaxScale(iLayerPos,iMinScale,iMaxScale){
	var bResult=false;
	var getLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	if(getLayerInfo){
		getLayerInfo.minShowScale=iMinScale;
		getLayerInfo.maxShowScale=iMaxScale;
		bResult=true;
	};
	return bResult;
};
function API_SetLayerShowOrNot(iLayerPos,bShowOrNot){
	var bResult=false;
	var getLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	if(getLayerInfo){
		getLayerInfo.bShow=bShowOrNot;
		bResult=true;
	};
	return bResult;
};
function API_SetLineObjStyleByPos(iLayerPos,iObjPos,bShowOwnStyle,objStyleInfo){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo.objType==LAYER_TYPE.line){
		curObjInfo.bGetOwnStyle=bShowOwnStyle;
		if(objStyleInfo){
			if(curObjInfo.style==undefined||curObjInfo.style==null){
				curObjInfo.style=new c4()
			};
			if(objStyleInfo.iOpacity){
				curObjInfo.style.iOpacity=objStyleInfo.iOpacity;
			};
			if(objStyleInfo.borderWith){
				curObjInfo.style.borderWith=objStyleInfo.borderWith;
			};
			if(objStyleInfo.borderColor){
				curObjInfo.style.borderColor=objStyleInfo.borderColor;
			};
			if(objStyleInfo.textColor){
				curObjInfo.style.textColor=objStyleInfo.textColor;
			};
			if(objStyleInfo.fontSize){
				curObjInfo.style.fontSize=objStyleInfo.fontSize;
			};
			if(objStyleInfo.bShowText){
				curObjInfo.style.bShowText=objStyleInfo.bShowText;
			};
			if(objStyleInfo.iTextOpacity){
				curObjInfo.style.iTextOpacity=objStyleInfo.iTextOpacity;
			}
		};
		bResult=true;
	};
	return bResult;
};
function API_SetObjectAllExpAttrByPos(iLayerPos,iObjPos,arrExpAttrValue){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo){
		curObjInfo.SetObjectAllExpAttr(arrExpAttrValue);
		bResult=true;
	};
	return bResult;
};
function API_SetObjectOneExpAttrByPos(iLayerPos,iObjPos,iExpAttrPos,strExpAttrValue){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo){
		bResult=curObjInfo.SetObjectOneExpAttrByPos(iExpAttrPos,strExpAttrValue);
	};
	return bResult;
};
function API_SetPointObjStyleByPos(iLayerPos,iObjPos,bShowOwnStyle,objStyleInfo){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo.objType==LAYER_TYPE.point){
		curObjInfo.bGetOwnStyle=bShowOwnStyle;
		if(objStyleInfo){
			if(curObjInfo.style==undefined||curObjInfo.style==null){
				curObjInfo.style=new c4();
			};
			if(objStyleInfo.bFilled!=undefined&&objStyleInfo.bFilled!=null){
				curObjInfo.style.bFilled=objStyleInfo.bFilled;
			};
			if(objStyleInfo.fillColor!=undefined&&objStyleInfo.fillColor!=null){
				curObjInfo.style.fillColor=objStyleInfo.fillColor;
			};
			if(objStyleInfo.iOpacity!=undefined&&objStyleInfo.iOpacity!=null){
				curObjInfo.style.iOpacity=objStyleInfo.iOpacity;
			};
			if(objStyleInfo.borderWith!=undefined&&objStyleInfo.borderWith!=null){
				curObjInfo.style.borderWith=objStyleInfo.borderWith;
			};
			if(objStyleInfo.borderColor!=undefined&&objStyleInfo.borderColor!=null){
				curObjInfo.style.borderColor=objStyleInfo.borderColor;
			};
			if(objStyleInfo.iLineOpacity!=undefined&&objStyleInfo.iLineOpacity!=null){
				curObjInfo.style.iLineOpacity=objStyleInfo.iLineOpacity;
			};
			if(objStyleInfo.strImgSrc!=undefined&&objStyleInfo.strImgSrc!=null){
				curObjInfo.style.strImgSrc=objStyleInfo.strImgSrc;
				curObjInfo.style.checkImg();
			};
			if(objStyleInfo.iImgWidth!=undefined&&objStyleInfo.iImgWidth!=null){
				curObjInfo.style.iImgWidth=objStyleInfo.iImgWidth;
			};
			if(objStyleInfo.iImgHeight!=undefined&&objStyleInfo.iImgHeight!=null){
				curObjInfo.style.iImgHeight=objStyleInfo.iImgHeight;
			};
			if(objStyleInfo.bShowImg!=undefined&&objStyleInfo.bShowImg!=null){
				curObjInfo.style.bShowImg=objStyleInfo.bShowImg;
			};
			if(objStyleInfo.textColor!=undefined&&objStyleInfo.textColor!=null){
				curObjInfo.style.textColor=objStyleInfo.textColor;
			};
			if(objStyleInfo.fontSize!=undefined&&objStyleInfo.fontSize!=null){
				curObjInfo.style.fontSize=objStyleInfo.fontSize;
			};
			if(objStyleInfo.bShowText!=undefined&&objStyleInfo.bShowText!=null){
				curObjInfo.style.bShowText=objStyleInfo.bShowText;
			};
			if(objStyleInfo.iTextOpacity!=undefined&&objStyleInfo.iTextOpacity!=null){
				curObjInfo.style.iTextOpacity=objStyleInfo.iTextOpacity;
			};
			if(objStyleInfo.arrSymbolPo!=undefined&&objStyleInfo.arrSymbolPo!=null){
				curObjInfo.style.arrSymbolPo=[];
				for(var i=0;i<objStyleInfo.arrSymbolPo.length;i++){
					curObjInfo.style.arrSymbolPo.push({
						x:objStyleInfo.arrSymbolPo[i].x,y:objStyleInfo.arrSymbolPo[i].y
					});
				}
			};
			if(objStyleInfo.iCircleScrnR!=undefined&&objStyleInfo.iCircleScrnR!=null){
				curObjInfo.style.iCircleScrnR=objStyleInfo.iCircleScrnR;
			}
		};
		bResult=true;
	};
	return bResult;
};
function API_SetPointObjRotation(iLayerPos,iObjPos,fAngle){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo.objType==LAYER_TYPE.point){
		curObjInfo.SetPointObjRotation(fAngle);
		bResult=true;
	};
	return bResult;
};
function API_SetLayerInfoByPos(iLayerPos,iLayerId,name,bShow,minShowScale,maxShowScale,bShowTextOrNot,iStartShowTextScale,arrExpAttrValue){
	var bResult=false;
	var curLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	if(curLayerInfo){
		curLayerInfo.SetLayerInfo(iLayerId,null,name,bShow,minShowScale,maxShowScale,bShowTextOrNot,iStartShowTextScale);
		curLayerInfo.SetAllExpAttrValue(arrExpAttrValue);
		bResult=true;
	};
	return bResult;
};
function API_SetObjectInfoByPos(iLayerPos,iObjPos,objId,name,showText,layerStylePos,arrCurGeoPo,arrExpAttrValue){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo){
		bResult=true;
		curObjInfo.SetObjectInfo(null,objId,name,showText,layerStylePos,arrCurGeoPo,arrExpAttrValue);
	};
	return bResult;
};
function API_AddOneTyphoonTrack(iTyphoonPos,objTrackInfo,arrPredictLineTracks){
	var arrAllPredictLineTracks=null;
	if(arrPredictLineTracks){
		arrAllPredictLineTracks=[];
		var iCount=arrPredictLineTracks.length;
		for(var iTrackPos=0;iTrackPos<iCount;iTrackPos++){
			var arrCurPredictTrack=[];
			var arrPredictTracks=arrPredictLineTracks[iTrackPos];
			var iTrackCount=arrPredictTracks.length;
			for(var i=0;i<iTrackCount;i++){
				var curPredictTrack=new e0();
				curPredictTrack.time=arrPredictTracks[i].time;
				curPredictTrack.po={
					x:arrPredictTracks[i].po.x,y:arrPredictTracks[i].po.y
				};
				curPredictTrack.windPower=arrPredictTracks[i].windPower;
				curPredictTrack.windSpeed=arrPredictTracks[i].windSpeed;
				curPredictTrack.airPressure=arrPredictTracks[i].airPressure;
				curPredictTrack.strReportStation=arrPredictTracks[i].strReportStation;
				arrCurPredictTrack.push(curPredictTrack);
			};
			arrAllPredictLineTracks.push(arrCurPredictTrack);
		}
	};
	var pos=g_objManTyphoon.AddOneTyphoonTrack(iTyphoonPos,objTrackInfo,arrAllPredictLineTracks);
	return pos;
};
function API_AddTyphoon(objTyphoonInfo,arrExpAttrValue){
	var pos=-1;
	if(objTyphoonInfo){
		var arrCurExpAttrValue=null;
		if(arrExpAttrValue!=null){
			arrCurExpAttrValue=[];
			var iExpCount=arrExpAttrValue.length;
			for(var i=0;i<iExpCount;i++){
				arrCurExpAttrValue.push(arrExpAttrValue[i]);
			}
		};
		pos=g_objManTyphoon.AddTyphoon(objTyphoonInfo,arrCurExpAttrValue);
	};
	return pos;
};
function API_GetTyphoonInfoByPos(iTyphoonPos){
	var curGetTyphoonInfo=null;
	var curTyphoonInfo=g_objManTyphoon.GetTyphoonInfoByPos(iTyphoonPos);
	if(curTyphoonInfo){
		curGetTyphoonInfo=[];
		curGetTyphoonInfo.id=curTyphoonInfo.id;
		curGetTyphoonInfo.name=curTyphoonInfo.name;
		curGetTyphoonInfo.startTime=curTyphoonInfo.startTime;
		curGetTyphoonInfo.endTime=curTyphoonInfo.endTime;
		curGetTyphoonInfo.bShow=curTyphoonInfo.bShow;
		curGetTyphoonInfo.iCurShowTrackPos=curTyphoonInfo.iCurShowTrackPos;
	};
	return curGetTyphoonInfo;
};
function API_GetTyphoonPosById(typhoonId){
	var pos=g_objManTyphoon.GetTyphoonPosById(typhoonId);
	return pos;
};
function API_GetTyphoonTrackInfoByPos(typhoonPos,iTruePos,iPredictLinePos,iPredictPos){
	var curTrackObj=g_objManTyphoon.GetTyphoonTrackInfoByPos(typhoonPos,iTruePos,iPredictLinePos,iPredictPos);
	var curGetTrackInfo=null;
	if(curTrackObj){
		curGetTrackInfo=[];
		curGetTrackInfo.time=curTrackObj.time;
		curGetTrackInfo.po={
			x:curTrackObj.po.x,y:curTrackObj.po.y
		};
		curGetTrackInfo.windPower=curTrackObj.windPower;
		curGetTrackInfo.windSpeed=curTrackObj.windSpeed;
		curGetTrackInfo.airPressure=curTrackObj.airPressure;
		if(curTrackObj.strReportStation){
			curGetTrackInfo.strReportStation=curTrackObj.strReportStation;
		};
		if(curTrackObj.moveDirection){
			curGetTrackInfo.moveDirection=curTrackObj.moveDirection;
		};
		if(curTrackObj.moveSpeed){
			curGetTrackInfo.moveSpeed=curTrackObj.moveSpeed;
		};
		if(curTrackObj.sevenRadius){
			curGetTrackInfo.sevenRadius=curTrackObj.sevenRadius;
		};
		if(curTrackObj.tenRadius){
			curGetTrackInfo.tenRadius=curTrackObj.tenRadius;
		}
	};
	return curGetTrackInfo;
};
function API_SetTyphoonShowOrNotByPos(iTyphoonPos,bShowOrNot){
	var bResult=g_objManTyphoon.SetTyphoonShowOrNotByPos(iTyphoonPos,bShowOrNot);
	return bResult;
};
function API_SetTyphoonStyleColor(objTyphoonStyle){
	var bResult=g_objManTyphoon.SetTyphoonStyleColor(objTyphoonStyle);
	return bResult;
};
function API_SetTyphoonToMapViewCenterByPos(iTyphoonPos){
	var bResult=false;
	var curTyphoonInfo=g_objManTyphoon.GetTyphoonInfoByPos(iTyphoonPos);
	if(curTyphoonInfo){
		var iCurShowTrackPos=curTyphoonInfo.iCurShowTrackPos;
		if(curTyphoonInfo.arrTracks.length>iCurShowTrackPos){
			var iGeoPoX=curTyphoonInfo.arrTracks[iCurShowTrackPos].po.x;
			var iGeoPoY=curTyphoonInfo.arrTracks[iCurShowTrackPos].po.y;
			var lon=iGeoPoX/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var lat=iGeoPoY/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			f8(lon,lat,null,false);
			bResult=true;
		}
	};
	return bResult;
};
function API_GetAreaOfGeoRegion(arrGeoPo){
	var areaSize=0;
	if(arrGeoPo&&arrGeoPo.length>2){
		areaSize=l2(arrGeoPo);
	};
	return areaSize;
};
function API_GetDistBetwTwoPoint(iGeoPoX1,iGeoPoY1,iGeoPoX2,iGeoPoY2){
	var lon1=parseFloat(iGeoPoX1/G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var lat1=parseFloat(iGeoPoY1/G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var lon2=parseFloat(iGeoPoX2/G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var lat2=parseFloat(iGeoPoY2/G_V.UNI_GEO_COOR_MULTI_FACTOR);
	dis=k9(lon1,lat1,lon2,lat2);
	return dis;
};
function API_GetDegreesBetwTwoPoint(iGeoPoX1,iGeoPoY1,iGeoPoX2,iGeoPoY2){
	var lon1=parseFloat(iGeoPoX1/G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var lat1=parseFloat(iGeoPoY1/G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var lon2=parseFloat(iGeoPoX2/G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var lat2=parseFloat(iGeoPoY2/G_V.UNI_GEO_COOR_MULTI_FACTOR);
	var deg=l0(lon1,lat1,lon2,lat2);
	return deg;
};
function API_GetDesPointOfCrsAndDist(geoPo,dis,course){
	var geoPo=l9(geoPo,dis,course);
	return geoPo;
};
function API_GetLonLatPoByScrnPo(iScrnPoX,iScrnPoY,scale){
	if(scale==null){
		scale=G_V.iCurScale;
	};
	var lonLatPo=k6(iScrnPoX-G_V.dragMapLayerOriginPo.x,iScrnPoY-G_V.dragMapLayerOriginPo.y,scale);
	return lonLatPo;
};
function API_GetScrnPoByLonLatPo(lon,lat,scale){
	if(scale==null){
		scale=G_V.iCurScale;
	};
	var scrnPo=k0(lon,lat,scale);
	scrnPo.x+=G_V.dragMapLayerOriginPo.x;
	scrnPo.y+=G_V.dragMapLayerOriginPo.y;
	return scrnPo;
};
function API_GetPlanePoByLonLatPo(lon,lat){
	var planePo=j9(lon,lat);
	return planePo;
};
function API_GetLonLatPoByPlanePo(iPlanePoX,iPlanePoY){
	var lon=j8(iPlanePoX);
	var lat=j7(iPlanePoY);
	var lonLat={
		x:lon,y:lat
	};
	return lonLat;
};
function API_SetMapViewCenter(lon,lat,scale){
	if(scale!=null){
		var earthCircleLen=2*Math.PI*G_V.fEarthRadiusX;
		var powOfLevel=(earthCircleLen/ scale) * 100000 * G_V.fHimeterToPixelFactor /256;
		var iCheckLevela=Math.sqrt(powOfLevel);
		var iCheckLevel=Math.log(powOfLevel)/Math.log(2);
		var iCurLevel=-1;
		for(var i=G_V.objMapLevelValue.min;i<G_V.objMapLevelValue.max+1;i++){
			if(i>iCheckLevel||i==iCheckLevel){
				iCurLevel=i;
				break;
			}
		};
		if(iCurLevel==-1){
			if(iCheckLevel>G_V.objMapLevelValue.max){
				iCheckLevel=G_V.objMapLevelValue.max;
			}
			else{
				iCheckLevel=G_V.objMapLevelValue.min;
			}
		};
		G_V.iCurLevel=iCurLevel;
		var powOfLevel=Math.pow(2,parseInt(iCurLevel));
		if(G_V.iCurMapImgInfoModeType!=MAP_IMG_MODE_TYPE.YimaType){
			scale=parseFloat(earthCircleLen/ (m4(256 * powOfLevel) /100000));
		}
	};
	f8(lon,lat,scale,true);
};
function API_MoveMapViewByMoveSize(iSizeScrnX,iSizeScrnY,bGetAutoMove){
	if(iSizeScrnX==0&&iSizeScrnY==0){
		return;
	};
	if(bGetAutoMove==true){
		var dis=Math.sqrt(iSizeScrnX*iSizeScrnX+iSizeScrnY*iSizeScrnY);
		var speed=dis/200*20;
		var sinAngle=iSizeScrnY/dis;
		var cosAngle=iSizeScrnX/dis;
		var info={
			speed:speed,sinAngle:sinAngle,cosAngle:cosAngle
		};
		g_objKineticClass.begin();
		g_objKineticClass.move(info,function(x,y){
			e3(x,y,false);
		});
	}
	else{
		e3(iSizeScrnX,iSizeScrnY,true);
	}
};
function API_InitYimaMap(obj){
	var bResult=false;
	if(obj.div){
		var divName=obj.div;
		var typeModel=obj.model;
		if(typeModel==null){
			typeModel="pc";
		};
		bResult=m6(divName,typeModel);
	};
	return bResult;
};
function API_GetCurLngLatRange(){
	var scrnPo=G_V.getMapViewSize();
	var LonLatPo1=k6(-G_V.dragMapLayerOriginPo.x,-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
	var LonLatPo2=k6(scrnPo.x-G_V.dragMapLayerOriginPo.x,scrnPo.y-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
	var minLon=LonLatPo1.x;
	var maxLon=LonLatPo2.x;
	var minLat=LonLatPo2.y;
	var maxLat=LonLatPo1.y;
	var obj={
		minLon:minLon,maxLon:maxLon,minLat:minLat,maxLat:maxLat
	};
	return obj;
};
function API_GetMyUserId(){
	var strUserId=l8();
	return strUserId;
};
function API_GetPageSize(){
	var scrnPo=G_V.getMapViewSize();
	return scrnPo;
};
function API_GotoMyLactionByGeoPo(iGeoX,iGeoY){
	var lon=iGeoX/G_V.UNI_GEO_COOR_MULTI_FACTOR;
	var lat=iGeoY/G_V.UNI_GEO_COOR_MULTI_FACTOR;
	var scale=G_V.iCurScale;
	API_SetMapViewCenter(lon,lat,scale,false);
};
function API_SetMousePoInfoDivPosition(bShowOrNot,iDivToRightLen,iDivToBottomLen){
	var bResult=false;
	if(G_V.showLonLatDivOffsetPo){
		G_V.showLonLatDivOffsetPo.bShow=bShowOrNot;
		G_V.showLonLatDivOffsetPo.x=iDivToRightLen;
		G_V.showLonLatDivOffsetPo.y=iDivToBottomLen;
		if(G_V.objShowLonLatDiv){
			g_objYimaEncMap.div.appendChild(G_V.objShowLonLatDiv);
			G_V.showLonLatDivOffsetPo.bAddToDiv=true;
			G_V.setShowLonLatDivInfo(G_V.showLonLatDivOffsetPo,bShowOrNot);
			bResult=true;
		}
	};
	return bResult;
};
function API_SetZoomBtnPosition(bShowOrNot,iDivToRightLen,iDivToTopLen){
	var bResult=false;
	if(G_V.showZoonBtnOffsetPo){
		G_V.showZoonBtnOffsetPo.bShow=bShowOrNot;
		G_V.showZoonBtnOffsetPo.x=iDivToRightLen;
		G_V.showZoonBtnOffsetPo.y=iDivToTopLen;
		if(G_V.zoomInImg&&G_V.zoomOutImg){
			g_objYimaEncMap.div.appendChild(G_V.zoomInImg);
			g_objYimaEncMap.div.appendChild(G_V.zoomOutImg);
			G_V.showZoonBtnOffsetPo.bAddToDiv=true;
			G_V.setShowZoomBtnDivInfo(G_V.showZoonBtnOffsetPo,bShowOrNot);
			bResult=true;
		}
	};
	return bResult;
};
function API_SetShowToolBarOrNot(bShowOrNot,iDivToRightLen,iDivToTopLen){
	var bResult=false;
	if(G_V.showToolBarOffsetPo){
		G_V.showToolBarOffsetPo.bShow=bShowOrNot;
		G_V.showToolBarOffsetPo.x=iDivToRightLen;
		G_V.showToolBarOffsetPo.y=iDivToTopLen;
		if(G_V.zoomInImg&&G_V.zoomOutImg){
			g_objYimaEncMap.div.appendChild(G_V.moveToolObj);
			g_objYimaEncMap.div.appendChild(G_V.zoomInImgDivObj);
			g_objYimaEncMap.div.appendChild(G_V.zoomOutImgDivObj);
			g_objYimaEncMap.div.appendChild(G_V.zoomSliderObj);
			g_objYimaEncMap.div.appendChild(G_V.moveZoomSliderDivObj);
			g_objYimaEncMap.div.appendChild(G_V.showScaleLevelDivObj);
			G_V.showToolBarOffsetPo.bAddToDiv=true;
			if(bShowOrNot==false){
				G_V.showScaleLevelDivObj.style.display="none";
			};
			G_V.SetShowToolBarInfo(G_V.showToolBarOffsetPo,bShowOrNot);
			bResult=true;
		}
	};
	return bResult;
};
function API_SetMyLicenceKey(strMyLicenceKey){
	if(G_V.bIsLicenceKeyOK==true){
		return true;
	};
	if(strMyLicenceKey.indexOf(G_V.strFlexMyLicenceKey)>-1){
		G_V.bIsLicenceKeyOK=true;
	}
	else{
		G_V.bIsLicenceKeyOK=false;
	};
	return G_V.bIsLicenceKeyOK;
};
function API_SetScaleInfoDivPosition(bShowOrNot,iDivToLeftLen,iDivToBottomLen){
	var bResult=false;
	if(G_V.showScaleDivOffsetPo){
		G_V.showScaleDivOffsetPo.bShow=bShowOrNot;
		G_V.showScaleDivOffsetPo.x=iDivToLeftLen;
		G_V.showScaleDivOffsetPo.y=iDivToBottomLen;
		if(G_V.objShowScaleDiv){
			g_objYimaEncMap.div.appendChild(G_V.objShowScaleDiv);
			G_V.showScaleDivOffsetPo.bAddToDiv=true;
			G_V.setShowScaleDivInfo(G_V.showScaleDivOffsetPo,bShowOrNot);
			bResult=true;
			G_V.objShowScaleDiv.innerHTML="<nobr>当前比例尺:</nobr><br><nobr>1:"+parseInt(G_V.iCurScale)+"</nobr>";
		}
	};
	return bResult;
};
function API_SetScaleLenInfoPosition(bShowOrNot,iDivToLeftLen,iDivToBottomLen){
	var bResult=false;
	if(G_V.showDisLenSizeOffsetPo){
		G_V.showDisLenSizeOffsetPo.bShow=bShowOrNot;
		G_V.showDisLenSizeOffsetPo.x=iDivToLeftLen;
		G_V.showDisLenSizeOffsetPo.y=iDivToBottomLen;
		if(G_V.drawDisLenCanvas){
			if(G_V.showDisLenSizeOffsetPo.bAddToDiv==true){
				G_V.setShowDisLenCanvasInfo(G_V.showDisLenSizeOffsetPo,bShowOrNot);
			}
			else if(g_objYimaEncMap&&bShowOrNot==true){
				g_objYimaEncMap.div.appendChild(G_V.drawDisLenCanvas);
				G_V.showDisLenSizeOffsetPo.bAddToDiv=true;
				G_V.setShowDisLenCanvasInfo(G_V.showDisLenSizeOffsetPo,true);
			};
			b1();
			bResult=true;
		}
	};
	return bResult;
};
function API_ReSizeMapView(){
	if(g_objYimaEncMap){
		g_objYimaEncMap.ReSizeMapView();
	}
};
function API_ZoomMap(zoomType,zoomScrnPo){
	e6(zoomType,zoomScrnPo);
};
function API_SetMapImagesUrl(strImgUrl){
	G_V.strImgUrl=strImgUrl;
};
function API_DoResize(){};
function API_GetMousePosition(event,obj){
	var scrnPo=e2(event,obj);
	return scrnPo;
};
function API_CutMapViewToImg(bDrawCenterPo,bDrawScale,imgDiv,showImgSize,strDrawText){
	a9(bDrawCenterPo,bDrawScale,imgDiv,showImgSize,strDrawText);
};
function API_LonLatToString(lonLat,bIsLon,decimalCount){
	var strValue=k7(lonLat,bIsLon,decimalCount);
	return strValue;
};
function API_SetMapBackGroundStyle(strBackGroundImgPath,strGroundColor){
	var bResult=false;
	var divObj=document.getElementById(g_objYimaEncMap.strMainMapDivName);
	if(divObj){
		if(strGroundColor){
			G_V.strMapBackGroundColor=strGroundColor;
			bResult=true;
			divObj.style.background=G_V.strMapBackGroundColor;
		};
		if(strBackGroundImgPath){
			G_V.strMapBackGroundImgPath=strBackGroundImgPath;
			bResult=true;
			divObj.style.backgroundImage="url("+G_V.strMapBackGroundImgPath+")";
		}
	};
	return bResult;
};
function API_SelectCurScrnShowObjectInfoByScrnPo(scrnPo,bGetAllSelObj){
	var arrSelObjInfo=g_objManObjClass.SelectCurScrnShowObjectInfoByScrnPo(scrnPo,bGetAllSelObj);
	return arrSelObjInfo;
};
function API_SetCurHighLightObjectById(layerId,objId){
	var bResult=g_objManObjClass.SetCurHighLightObject(layerId,objId);
	return bResult;
};
function API_SetCurHighLightObjectStyle(objStyle){
	g_objFishAreaManClass.SetCurHighLightObjectStyle(objStyle);
	g_objManObjClass.SetCurHighLightObjectStyle(objStyle);
};
function API_GetCurMapScale(){
	return G_V.iCurScale;
};
function API_GetCurMapCenterLonLatPo(){
	var iScrnPoX=G_V.iMapViewWidth/2;
	var iScrnPoY=G_V.iMapViewHeight/2;
	var lonLatPo=k6(iScrnPoX-G_V.dragMapLayerOriginPo.x,iScrnPoY-G_V.dragMapLayerOriginPo.y,G_V.iCurScale);
	return lonLatPo;
};
function API_SetMapMinMaxScale(iMinValue,iMaxValue){
	G_V.iMapMinScale=iMinValue;
	G_V.iMapMaxScale=iMaxValue;
};
function API_SetMapLevel(iLevel,lonLatCenterPo){
	var iCurLevel=G_V.iCurLevel;
	if(iLevel!=null){
		iCurLevel=iLevel;
	};
	if(parseInt(iCurLevel)>-1&&parseInt(iCurLevel)<23){
		G_V.iCurLevel=iCurLevel;
		var powOfLevel=Math.pow(2,parseInt(iCurLevel));
		var earthCircleLen=2*Math.PI*G_V.fEarthRadiusX;
		var generateScale=parseFloat(earthCircleLen/ (m4(256 * powOfLevel) /100000));
		if(lonLatCenterPo){
			API_SetMapViewCenter(lonLatCenterPo.x,lonLatCenterPo.y,generateScale);
		}
		else{
			API_SetMapViewCenter(null,null,generateScale);
		}
	}
};
function API_SetMapImgMode(iModeType){
	if(iModeType!=MAP_IMG_MODE_TYPE.YimaType&&iModeType!=MAP_IMG_MODE_TYPE.GoogleType&&iModeType!=MAP_IMG_MODE_TYPE.BaiduType){
		return false;
	};
	G_V.iCurMapImgInfoModeType=iModeType;
	return true;
};
function API_SetMapMinMaxLevel(iMinLevel,iMaxLevel){
	if(iMinLevel!=null&&!isNaN(iMinLevel)){
		G_V.objMapLevelValue.min=iMinLevel;
	};
	if(iMaxLevel!=null&&!isNaN(iMaxLevel)){
		G_V.objMapLevelValue.max=iMaxLevel;
	};
	return true;
};
function API_GetCurMeasureArrInfo(){
	var iGeoPoCount=G_V.arrDrawDynamicObjGeoPo.length;
	var arrInfo=null;
	if(iGeoPoCount>1){
		arrInfo=[];
		var allMeasureDist=0;
		var curDegrees=0;
		var curDis=0;
		arrInfo.push({
			po:G_V.arrDrawDynamicObjGeoPo[0],curDis:curDis,allMeasureDist:allMeasureDist,curDegrees:curDegrees
		});
		for(var iPos=1;iPos<iGeoPoCount;iPos++){
			var lon1=G_V.arrDrawDynamicObjGeoPo[iPos-1].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var lat1=G_V.arrDrawDynamicObjGeoPo[iPos-1].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var lon2=G_V.arrDrawDynamicObjGeoPo[iPos].x/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			var lat2=G_V.arrDrawDynamicObjGeoPo[iPos].y/G_V.UNI_GEO_COOR_MULTI_FACTOR;
			curDis=k9(lon1,lat1,lon2,lat2);
			allMeasureDist+=curDis;
			curDegrees=l0(lon1,lat1,lon2,lat2);
			arrInfo.push({
				po:G_V.arrDrawDynamicObjGeoPo[iPos],curDis:curDis,allMeasureDist:allMeasureDist,curDegrees:curDegrees
			});
		}
	};
	return arrInfo;
};
function API_SetYimaSdkOption(objValue){
	if(objValue){
		if(objValue.bShowPowerText==false){
			if(G_V.objCompanyNameDiv){
				G_V.objCompanyNameDiv.style.display="none";
			}
		}
	}
};
function API_SetDynamicObjStyle(objStyle){
	if(objStyle){
		if(objStyle.borderWith){
			G_V.drawDynamicObjStyle.borderWith=objStyle.borderWith
		};
		if(objStyle.borderColor){
			G_V.drawDynamicObjStyle.borderColor=objStyle.borderColor
		};
		if(objStyle.fillColor){
			G_V.drawDynamicObjStyle.fillColor=objStyle.fillColor
		};
		if(objStyle.textColor){
			G_V.drawDynamicObjStyle.textColor=objStyle.textColor
		};
		if(objStyle.fontSize){
			G_V.drawDynamicObjStyle.fontSize=objStyle.fontSize
		};
		if(objStyle.iOpacity){
			G_V.drawDynamicObjStyle.iOpacity=objStyle.iOpacity
		};
		if(objStyle.strImgSrc){
			G_V.drawDynamicObjStyle.strImgSrc=objStyle.strImgSrc
		}
	}
};
function API_SetCurDrawDynamicObjGeoPo(arrGeoPo){
	var bResult=false;
	if(arrGeoPo&&parseInt(arrGeoPo.length)>0){
		var iCount=arrGeoPo.length;
		G_V.arrDrawDynamicObjGeoPo=[];
		for(var i=0;i<iCount;i++){
			G_V.arrDrawDynamicObjGeoPo.push({
				x:arrGeoPo[i].x,y:arrGeoPo[i].y
			})
		};
		a8();
	};
	return bResult;
};
function API_SetShipShowNameFrameStyle(iStartShowScale,iFrameWidth,iFrameHeight,iBorderWith,strColor,iOpacity){
	var bResult=false;
	if(G_V.objShowNameFrameStyle){
		G_V.objShowNameFrameStyle.scale=iStartShowScale;
		G_V.objShowNameFrameStyle.width=iFrameWidth;
		G_V.objShowNameFrameStyle.height=iFrameHeight;
		G_V.objShowNameFrameStyle.border=iBorderWith;
		G_V.objShowNameFrameStyle.color=strColor;
		G_V.objShowNameFrameStyle.opacity=iOpacity
	}
};
function API_DelTyphoonByPos(bDelAllTyphoon,iTyphoonPos){
	var bResult=g_objManTyphoon.DelTyphoonByPos(bDelAllTyphoon,iTyphoonPos);
	return bResult;
};
function API_ReDrawTyphoon(){
	g_objDrawObjClass.ClearTyphoonCanvas();
	g_objDrawObjClass.DrawAllTyphoon();
};
function API_GetTyphoonCount(){
	var iResult=g_objManTyphoon.GetTyphoonCount();
	return iResult;
};
function API_AddTyphoonPredictTrackLineStyleByPos(iTyphoonPos,iWidth,strColor,iOpacity){
	var bResult=g_objManTyphoon.AddTyphoonPredictTrackLineStyleByPos(iTyphoonPos,iWidth,strColor,iOpacity);
	return bResult;
};
function API_SetMinLowerTyphoonStyle(strColor){
	var bResult=g_objManTyphoon.SetMinLowerTyphoonStyle(strColor);
	return bResult;
};
function API_SetShowShipHistroyTrackScale(iScale){
	var bResult=false;
	if(isNaN(iScale)==false){
		G_V.iShowShipHistroyTrackScale=iScale;
		bResult=true;
	};
	return bResult;
};
function API_SetSelectAllObjectByMouseMove(iStartSelectScale,bSelectAll){
	G_V.iSelectAllObjByMouseMoveScale=iStartSelectScale;
	G_V.bSelectAllObjByMouseMove=bSelectAll
};
function API_SetAndroidModelCheckScrnLen(iScrnLen){
	G_V.iAndroidCheckDisScrnLen=iScrnLen;
};
function API_SelectShipsByGeoRect(iMinGeoX,iMaxGeoX,iMinGeoY,iMaxGeoY,iGetMaxShipCount){
	var obj=g_objManShipClass.SelectShipsByGeoRect(iMinGeoX,iMaxGeoX,iMinGeoY,iMaxGeoY,iGetMaxShipCount);
	return obj;
};
function API_SelectShipsByGeoCircle(iCircleGeoX,iCircleGeoY,fCircleRadiusKm,iGetMaxShipCount){
	var obj=g_objManShipClass.SelectShipsByGeoCircle(iCircleGeoX,iCircleGeoY,fCircleRadiusKm,iGetMaxShipCount);
	return obj;
};
function API_SetLineObjectAreaSize(iLayerPos,iObjPos,fLineAreaSizeM){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo&&parseFloat(fLineAreaSizeM)>0){
		bResult=true;
		curObjInfo.fLineAreaSizeM=fLineAreaSizeM;
	};
	return bResult;
};
function API_GetMapLevel(){
	return G_V.iCurLevel;
};
function m8(bUseArcgisRule){
	G_V.bUseArcgisRule=bUseArcgisRule;
	return true;
};
function API_SetShipStateStyleByPos(iStatePos,iShipStylePos,objStateStyle){
	var bResult=false;
	if(G_V.arrShipStateInfo.length>iStatePos){
		var arrSymbolPo=null;
		if(objStateStyle.arrSymbolPo&&objStateStyle.arrSymbolPo.length>0){
			var iSymbolPoCount=objStateStyle.arrSymbolPo.length;
			if(iSymbolPoCount>0){
				arrSymbolPo=[];
				for(var i=0;i<iSymbolPoCount;i++){
					arrSymbolPo.push({
						x:objStateStyle.arrSymbolPo[i].x,y:objStateStyle.arrSymbolPo[i].y
					});
				}
			}
		};
		var minScale=null;
		if(objStateStyle.minScale){
			minScale=objStateStyle.minScale;
		};
		var minScale=null;
		if(objStateStyle.minScale){
			minScale=objStateStyle.minScale;
		};
		var maxScale=objStateStyle.maxScale;
		var borderSize=objStateStyle.borderSize;
		var borderColor=objStateStyle.borderColor;
		var fillColor=objStateStyle.fillColor;
		var iOpacity=objStateStyle.iOpacity;
		bResult=G_V.arrShipStateInfo[iStatePos].UpdateShipStyle(iShipStylePos,arrSymbolPo,minScale,maxScale,borderSize,borderColor,fillColor,iOpacity);
	};
	return bResult;
};
function API_GetShipStatePos(iState){
	var iPos=-1;
	if(G_V.arrShipStateInfo){
		var count=G_V.arrShipStateInfo.length;
		for(var i=0;i<count;i++){
			if(G_V.arrShipStateInfo[i].iState==iState){
				iPos=i;
			}
		}
	};
	return iPos;
};
function API_SetIsShowShipHistroyTrackInfoBox(bShow){
	G_V.bShowShipHistroyTrackInfoBox=bShow;
	return true;
};
function API_GetPlayShipAllExpAttrByPos(iShipPos){
	var arrAllExp=null;
	var getShipInfo=g_objManHistoryTrackClass.GetShipInfoByPos(iShipPos);
	if(getShipInfo){
		var arrGetAllExp=getShipInfo.arrExpAttrValue;
		var iExpAttrCount=arrGetAllExp.length;
		if(iExpAttrCount>0){
			arrAllExp=[];
			for(var i=0;i<iExpAttrCount;i++){
				arrAllExp.push(arrGetAllExp[i]);
			}
		}
	};
	return arrAllExp;
};
function API_SetRectObjIfUseImg(iLayerPos,iObjPos,bIsUseImg,strImgSrc,iMinShowScale,iMaxShowScale){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo){
		if(curObjInfo.objType==MAP_MOUSE_STATE.drawRect){
			bResult=true;
			curObjInfo.bRectImg=bIsUseImg;
			if(strImgSrc!=null){
				curObjInfo.strRectImgUrl=strImgSrc;
				curObjInfo.rectImg=new Image();
				curObjInfo.rectImg.src=strImgSrc;
			};
			if(iMinShowScale!=null){
				curObjInfo.iRectMinScale=iMinShowScale;
			};
			if(iMaxShowScale!=null){
				curObjInfo.iRectMaxScale=iMaxShowScale;
			}
		}
	}
};
function API_SelectShipsByGeoPolygon(arrPolygonGeoPo,iGetMaxShipCount){
	var objShipInfo=g_objManShipClass.SelectShipsByGeoPolygon(arrPolygonGeoPo,iGetMaxShipCount);
	return objShipInfo;
};
function API_SetSectorObjInfoByPos(layerPos,iObjPos,iStartAngle,iEndAngle,iSmallCircleRKm,iBigCircleRKm){
	var bResult=g_objManObjClass.SetSectorObjInfoByPos(layerPos,iObjPos,iStartAngle,iEndAngle,iSmallCircleRKm,iBigCircleRKm);
	return bResult;
};
function API_AddFishAreaObj(id,name,lon,lat,height,width){
	var bResult=g_objFishAreaManClass.AddNewFishAreaObj(id,name,lon,lat,height,width);
	return bResult;
};
function API_SetFishAreaLineStyle(borderWith,borderColor,iOpacity){
	g_objFishAreaManClass.m_curBigBoxStyle.borderWith=borderWith;
	g_objFishAreaManClass.m_curBigBoxStyle.borderColor=borderColor;
	g_objFishAreaManClass.m_curBigBoxStyle.iOpacity=iOpacity;
};
function API_SetFishAreaFillStyle(bFill,fillColor,iOpacity){
	g_objFishAreaManClass.m_curFillStyle.bFill=bFill;
	g_objFishAreaManClass.m_curFillStyle.fillColor=fillColor;
	g_objFishAreaManClass.m_curFillStyle.iOpacity=iOpacity;
};
function API_SetFishAreaShowOrNot(bShowOrNot,iStartShowBigBoxScale,iStartShowSmallBoxScale){
	g_objFishAreaManClass.m_bShowFishAreaBox=bShowOrNot;
	if(isNaN(iStartShowBigBoxScale)==false){
		this.m_iStartShowBoxScale=iStartShowBigBoxScale;
	};
	if(isNaN(iStartShowSmallBoxScale)==false){
		this.m_iStartShowSmallBoxScale=iStartShowSmallBoxScale;
	}
};
function API_SetFishAreaShowNameStyle(strFont,strColor,iOpacity){
	g_objFishAreaManClass.m_curNameStyle.strFont=strFont;
	g_objFishAreaManClass.m_curNameStyle.color=strColor;
	g_objFishAreaManClass.m_curNameStyle.iOpacity=iOpacity;
};
function API_SetRectObjGeoPoByPos(layerPos,iObjPos,minGeoX,maxGeoX,minGeoY,maxGeoY){
	var bResult=g_objManObjClass.SetRectObjGeoPo(layerPos,iObjPos,minGeoX,maxGeoX,minGeoY,maxGeoY);
	return bResult;
};
function API_SetIsShowLonLatLineOrNot(bShowLonLatLineOrNot){
	G_V.bShowLonLatLine=bShowLonLatLineOrNot;
	g_objDrawObjClass.ClearLonLatLineCanvas();
	g_objDrawObjClass.ReDrawLonLatLine();
};
function API_GetLonLatLineIsShowOrNot(){
	return G_V.bShowLonLatLine;
};
function API_SetLonLatLineStyle(iLineSize,strLineColor,iLineOpacity,strFontColor,strFontSize,iFontOpacity,bSetLineDash,iLineDashLen,iLineDashSpaceLen){
	if(iLineSize!=null){
		g_objLonLatLineManClass.iLineSize=iLineSize;
	};
	if(strLineColor!=null){
		g_objLonLatLineManClass.strLineColor=strLineColor;
	};
	if(iLineOpacity!=null){
		g_objLonLatLineManClass.iLineOpacity=iLineOpacity;
	};
	if(strFontColor!=null){
		g_objLonLatLineManClass.strFontColor=strFontColor;
	};
	if(strFontSize!=null){
		g_objLonLatLineManClass.strFontSize=strFontSize;
	};
	if(iFontOpacity!=null){
		g_objLonLatLineManClass.iFontOpacity=iFontOpacity;
	};
	if(bSetLineDash!=null){
		g_objLonLatLineManClass.bSetLineDash=bSetLineDash;
	};
	if(iLineDashLen!=null){
		g_objLonLatLineManClass.iLineDashLen=iLineDashLen;
	};
	if(iLineDashSpaceLen!=null){
		g_objLonLatLineManClass.iLineDashSpaceLen=iLineDashSpaceLen;
	}
};
function API_SetLonLatDrawStepSizeInfo(arrStepInfo){
	g_objLonLatLineManClass.arrStepInfo=arrStepInfo;
	g_objDrawObjClass.ClearLonLatLineCanvas();
	g_objDrawObjClass.ReDrawLonLatLine();
};
function API_SelectFishAreaByGeoPo(iGeoX,iGeoY){
	var curFishAreaInfo=g_objFishAreaManClass.SelectFishAreaByGeoPo(iGeoX,iGeoY);
	return curFishAreaInfo;
};
function API_SetCurHighLightFishAreaByNum(strName,iSmallNum){
	g_objFishAreaManClass.m_iHighLightFishAreaPos=-1;
	g_objFishAreaManClass.m_iHighLightFishAreaSmallNum=-1;
	var curFishAreaInfo=g_objFishAreaManClass.GetFishAreaInfoByName(strName);
	if(curFishAreaInfo){
		g_objFishAreaManClass.m_iHighLightFishAreaPos=curFishAreaInfo.pos;
		g_objFishAreaManClass.m_iHighLightFishAreaSmallNum=iSmallNum
	};
	g_objDrawObjClass.ClearFishAreaCanvas();
	g_objDrawObjClass.ReDrawFishArea();
	return true
};
function API_GetFishAreaInfoByName(strName){
	var curFishAreaInfo=g_objFishAreaManClass.GetFishAreaInfoByName(strName);
	return curFishAreaInfo;
};
function API_SetShipShowBoxInfoTextByShipPos(iShipPos,strShipInfoText){
	var bResult=false;
	var curShipInfo=g_objManShipClass.GetShipInfoByPos(iShipPos);
	if(curShipInfo){
		bResult=true;
		curShipInfo.strShowBoxInfoText=strShipInfoText;
	};
	return bResult;
};
function API_SetImgPointShowOffsetPoByPos(iLayerPos,iObjPos,iOffsetScrnX,iOffsetScrnY){
	var bResult=false;
	var curObjInfo=g_objManObjClass.GetObjectInfoByPos(iLayerPos,iObjPos);
	if(curObjInfo){
		if(curObjInfo.style){
			bResult=true;
			curObjInfo.style.offsetScrnPo={
				x:iOffsetScrnX,y:iOffsetScrnY
			};
		}
	};
	return bResult;
};
function API_SteIsShowHistoryTrackDirectionSign(bShowOrNot){
	G_V.bShowHistoryTrackDirectionSign=bShowOrNot;
	return true;
};
function API_SetTyphoonPoImgInfoByPos(iTyphoonPos,strImgSrc,width,height){
	var bResult=g_objManTyphoon.SetTyphoonPoImgInfoByPos(iTyphoonPos,strImgSrc,width,height);
	return bResult;
};
function API_SetIsUseSvgDreawerOrNot(bUseOrNot){
	G_V.bUseSvgDrawerOrNot=bUseOrNot;
};
function API_SetMapDefaultImgSrc(strImgSrc){
	G_V.strMapBackGroundImgSrc=G_V.strSdkFilePath+strImgSrc
};
function API_ReDrawFishArea(){
	g_objDrawObjClass.ClearFishAreaCanvas();
	g_objDrawObjClass.ReDrawFishArea();
};
function API_SetFishAreaShowOrNotByName(strName,bShowOrNot){
	var bResult=g_objFishAreaManClass.SetFishAreaShowOrNotByName(strName,bShowOrNot);
	return bResult;
};
function API_DelFishAreaInfoByName(strName){
	var bResult=g_objFishAreaManClass.DelFishAreaInfoByName(strName);
	return bResult;
};
function API_ZoomMapByLonLat(zoomType,lon,lat){
	var scrnPo=k0(lon,lat,G_V.iCurScale);
	scrnPo.x+=G_V.dragMapLayerOriginPo.x;
	scrnPo.y+=G_V.dragMapLayerOriginPo.y;
	var mapViewSize=G_V.getMapViewSize();
	var iHarfWitdh=mapViewSize.x/2;
	var iHarfHeight=mapViewSize.y/2;
	if((Math.abs(iHarfWitdh-scrnPo.x)<iHarfWitdh+parseInt(1))&&(Math.abs(iHarfHeight-scrnPo.y)<iHarfHeight+parseInt(1))&&scrnPo.x>20&&scrnPo.y>20){
		e6(zoomType,scrnPo);
	}
	else{
		var iLevel=parseInt(G_V.iCurLevel)+parseInt(zoomType);
		API_SetMapLevel(iLevel,{
			x:lon,y:lat
		})
	};
	return true;
};
function API_SetSDKLayerZIndex(layerPos,zIndex){
	if(parseInt(layerPos)==0){
		g_objYimaEncMap.drawShipCanvas.style.zIndex=parseInt(zIndex);
		g_objYimaEncMap.drawShipHistoryTrackCanvas.style.zIndex=parseInt(zIndex);
		if(g_objYimaEncMap.drawShipHistoryTrackDivForSvg!=null){
			g_objYimaEncMap.drawShipHistoryTrackDivForSvg.style.zIndex=parseInt(zIndex);
			g_objYimaEncMap.drawShipDivForSvg.style.zIndex=parseInt(zIndex);
		};
		g_objYimaEncMap.drawObjectOnShipCanvas.style.zIndex=parseInt(zIndex)+parseInt(1);
	}
	else if(parseInt(layerPos)==1){
		g_objYimaEncMap.drawObjectCanvas.style.zIndex=parseInt(zIndex);
	}
	else if(parseInt(layerPos)==2){
		g_objYimaEncMap.drawTyphoonCanvas.style.zIndex=parseInt(zIndex);
	}
	else if(parseInt(layerPos)==3){
		g_objYimaEncMap.drawFishAreaCanvas.style.zIndex=parseInt(zIndex);
	}
	else if(parseInt(layerPos)==4){
		g_objYimaEncMap.drawLonLatLineCanvas.style.zIndex=parseInt(zIndex);
	}
	else if(parseInt(layerPos)==5){
		g_objYimaEncMap.drawDynamicObjCanvas.style.zIndex=parseInt(zIndex);
	}
};
function API_SetLayerObjectDrawTopToShipByPos(iLayerPos,bTopOrNot){
	var bResutl=g_objManObjClass.API_SetLayerObjectDrawTopToShipByPos(iLayerPos,bTopOrNot);
	return bResutl;
};
function API_SetIsDrawCurShipAndPlayHistoryTrackShip(bDrawOrNot){
	G_V.bDrawCurShipAndPlayHistoryTrackShip=bDrawOrNot;
};
function API_SetAllPlayHistroryTrackToEnd(){
	g_objManHistoryTrackClass.ReSetOtherShipPlayToEnd();
};
function API_SetDynamicObjTextBoxStyle(objTextBoxStyle){
	var bResult=false;
	if(objTextBoxStyle){
		if(objTextBoxStyle.lineColor){
			bResult=true;
			G_V.objDynamicObjTextBoxStyle.rectLineColor=objTextBoxStyle.lineColor;
		};
		if(objTextBoxStyle.fillColor){
			bResult=true;
			G_V.objDynamicObjTextBoxStyle.rectFillColor=objTextBoxStyle.fillColor;
		};
		if(objTextBoxStyle.iOpacity){
			bResult=true;
			G_V.objDynamicObjTextBoxStyle.iRectOpacity=objTextBoxStyle.iOpacity;
		};
		if(objTextBoxStyle.bFill){
			bResult=true;
			G_V.objDynamicObjTextBoxStyle.bFill=objTextBoxStyle.bFill;
		}
	};
	return bResult;
};
function API_SetPlayShipTrackStyleById(iShipId,strColor){
	var bResult=g_objManHistoryTrackClass.SetPlayShipTrackStyleById(iShipId,strColor,true);
	return bResult;
};
function API_ClearCurMouseMove(){
	g_objYimaEncMap.ClearCurMouseMove()
};
function API_GetCurMouseScrnPo(){
	return{
		x:G_V.mCurMouseScrnPo.x,y:G_V.mCurMouseScrnPo.y
	};
};
function API_GetCurDrawDynamicUseType(){
	return G_V.iCurDynamicType;
};
function API_DelPlayShipById(iShipId){
	var bResult=g_objManHistoryTrackClass.DelPlayShipById(iShipId);
	return bResult;
};
function API_SetIfShowTrackPoSpeedCoursInfo(bShowOrNot){
	G_V.bShowTrackPoSpeedCourse=bShowOrNot;
};
function API_SetCurTrackPlayTime(strTime){
	var strTime=strTime.replace(/-/g,"/");
	var curTrackTime=new Date(strTime);
	var iTrackTime=curTrackTime.getTime();
	var bResult=g_objManHistoryTrackClass.SetCurTrackPlayStepTime(iTrackTime);
	return bResult;
};
function API_SetIsShowMeasureKmText(bShowOrNot){
	G_V.bShowMeasureKmText=bShowOrNot;
};
function API_SetCurPlayShipById(iShipId){
	var bResult=g_objManHistoryTrackClass.SetCurPlayShipById(iShipId);
	return bResult;
};
function API_SetIsShowZoomArrowSign(bShowOrNot){
	G_V.bShowZoomArrowSign=bShowOrNot;
};
function API_HiddenYimaEncText(){
	G_V.objCompanyNameDiv.style.display="none";
};
function API_SetMapViewCanDragRectSize(bCheckDragRectSize,minLon,maxLon,minLat,maxLat){
	G_V.objMapViewMaxMinGeoInfo.bCheck=bCheckDragRectSize;
	if(minLon!=null&&minLon!=undefined){
		G_V.objMapViewMaxMinGeoInfo.minLon=minLon;
	};
	if(maxLon!=null&&maxLon!=undefined){
		G_V.objMapViewMaxMinGeoInfo.maxLon=maxLon;
	};
	if(minLat!=null&&minLat!=undefined){
		G_V.objMapViewMaxMinGeoInfo.minLat=minLat;
	};
	if(maxLat!=null&&maxLat!=undefined){
		G_V.objMapViewMaxMinGeoInfo.maxLat=maxLat;
	}
};
function API_AddHeatmapValue(arrHeatmapData){
	var bResult=g_objHeatMapManClass.AddHeatmapValue(arrHeatmapData);
	return bResult;
};
function API_ClearHeatmapValue(){
	var bResult=g_objHeatMapManClass.ClaerHeatmapValue();
	return bResult;
};
function API_SetIfShowHeatmapData(bShowOrNot){
	G_V.bShowHeatmap=bShowOrNot;
	if(bShowOrNot){
		document.getElementById(g_objHeatMapManClass.strDivName).style.display="block"
	}
	else{
		document.getElementById(g_objHeatMapManClass.strDivName).style.display="none";
	}
};
function API_RedrawHeatmap(){
	g_objDrawObjClass.ReDrawHeatmap()
};
function API_GetAllPlayHistoryShips(){
	var arrHistoryPlayShip=g_objManHistoryTrackClass.arrShipInfo;
	return arrHistoryPlayShip;
};
function API_GetCurShowTrackPlayHistoryShips(){
	var arrResult=[];
	if(g_objManHistoryTrackClass.arrShipInfo){
		var iShipCount=g_objManHistoryTrackClass.arrShipInfo.length;
		for(var i=0;i<iShipCount;i++){
			if(parseInt(g_objManHistoryTrackClass.arrShipInfo[i].iNextPlayHistoryTrackPos)>0){
				arrResult.push(g_objManHistoryTrackClass.arrShipInfo[i])
			}
		}
	};
	return arrResult;
};
function API_GetCurHiddenTrackPlayHistoryShips(){
	var arrResult=[];
	if(g_objManHistoryTrackClass.arrShipInfo){
		var iShipCount=g_objManHistoryTrackClass.arrShipInfo.length;
		for(var i=0;i<iShipCount;i++){
			if(parseInt(g_objManHistoryTrackClass.arrShipInfo[i].iNextPlayHistoryTrackPos)==0){
				arrResult.push(g_objManHistoryTrackClass.arrShipInfo[i])
			}
		}
	};
	return arrResult;
};
function API_AddOnlyShowShipInObject(layerId,objId){
	G_V.m_arrObjForShowShip.push({
		layerId:layerId,objId:objId
	});
	return true;
};
function API_SetShipUseOwnSymbolByShipPos(iShipPos,bUseOwnSymbol,arrSymbolPo){
	var bResult=g_objManShipClass.SetShipUseOwnSymbolByShipPos(iShipPos,bUseOwnSymbol,arrSymbolPo);
	return bResult;
};
function API_SetShipInfoDivObj(iShipPos,divObj,bMove){
	var bResult=g_objManShipClass.SetShipInfoDivObj(iShipPos,divObj,bMove);
	return bResult;
};
function API_SetShipInfoDivOffset(iShipPos,offsetScrnPo){
	var bResult=g_objManShipClass.SetShipInfoDivOffset(iShipPos,offsetScrnPo);
	return bResult;
};
function API_GetShipInfoDivOffset(iShipPos){
	var bResult=g_objManShipClass.GetShipInfoDivOffset(iShipPos);
	return bResult;
};
function API_GetShipInfoDivObj(iShipPos){
	var divObj=g_objManShipClass.GetShipInfoDivObj(iShipPos);
	return divObj;
};
function API_SetLayerTextBackGroundColorByPos(iLayerPos,bSetBackGroundColorOrNot,fillColor,iOpacity){
	var bResult=false;
	var curLayerInfo=g_objManObjClass.GetLayerInfoByPos(iLayerPos);
	if(curLayerInfo){
		if(bSetBackGroundColorOrNot==true){
			if(curLayerInfo.textStyle==null||curLayerInfo.textStyle==undefined){
				curLayerInfo.textStyle=[];
			};
			curLayerInfo.textStyle.fillColor=fillColor;
			curLayerInfo.textStyle.iOpacity=iOpacity;
		}
		else{
			curLayerInfo.textStyle=null;
		};
		bResult=true;
	};
	return bResult;
};
function API_SetSelectShipByScrnPoStartScale(iScale){
	G_V.iSelectShipByScrnPoMaxScale=iScale;
};
function API_AddNewRoute(objRoute){
	var iResult=-1;
	if(objRoute){
		g_objRouteManClass.arrRouteInfo.push(objRoute);
		iResult=g_objRouteManClass.arrRouteInfo.length-1;
	};
	return iResult;
};
function API_ReDrawRoute(){
	g_objDrawObjClass.ClearRouteCanvas();
	g_objDrawObjClass.ReDrawRoute();
};
function API_GetRouteCount(){
	return g_objRouteManClass.arrRouteInfo.length;
};
function API_GetRoutePosById(routeId){
	var pos=-1;
	for(var i=0;i<g_objRouteManClass.arrRouteInfo.length;i++){
		if(g_objRouteManClass.arrRouteInfo[i].id==routeId){
			pos=i;
			break;
		}
	};
	return pos
};
function API_UpdateRouteInfoByPos(routePos,objRoute){
	var iResult=-1;
	if(objRoute&&routePos>-1&&g_objRouteManClass.arrRouteInfo.length>routePos){
		if(objRoute.arrWayPoints){
			g_objRouteManClass.arrRouteInfo[routePos].arrWayPoints=objRoute.arrWayPoints;
		};
		if(objRoute.name){
			g_objRouteManClass.arrRouteInfo[routePos].name=objRoute.name;
		};
		if(objRoute.id){
			g_objRouteManClass.arrRouteInfo[routePos].id=objRoute.id;
		};
		if(objRoute.bShowOrNot){
			g_objRouteManClass.arrRouteInfo[routePos].bShowOrNot=objRoute.bShowOrNot;
		};
		if(objRoute.strLineColor){
			g_objRouteManClass.arrRouteInfo[routePos].strLineColor=objRoute.strLineColor;
		};
		if(objRoute.iLineSize){
			g_objRouteManClass.arrRouteInfo[routePos].iLineSize=objRoute.iLineSize;
		};
		if(objRoute.iCircleR){
			g_objRouteManClass.arrRouteInfo[routePos].iCircleR=objRoute.iCircleR;
		};
		if(objRoute.strFillCircleColor){
			g_objRouteManClass.arrRouteInfo[routePos].strFillCircleColor=objRoute.strFillCircleColor;
		}
	};
	return iResult;
};
function API_GetCurMapMouseState(){
	return G_V.iCurMapMouseState;
};
function API_SetOneShipShowOrNotByPos(iShipPos,bShowOrNot){
	var bResult=g_objManShipClass.SetOneShipShowOrNotByPos(iShipPos,bShowOrNot);
	return bResult;
};
function API_SetShipTrackStyleByPos(iShipPos,strColor){
	var bResult=g_objManShipClass.SetShipTrackStyleByPos(iShipPos,strColor);
	return bResult;
}