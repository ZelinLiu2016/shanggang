/**
 * 
 */
package com.sg.abnormalDetection;

import java.util.ArrayList;
import java.util.List;

import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.utils.SpatialRelationUtil;

/**
 * @author yuchang xu
 *
 * 2017-08-21
 */
public class Quadrilateral  {
	List<LatLng> mpoints= new ArrayList<LatLng>();
	 
	public Quadrilateral(String str) {
		
		String[] points = str.split("-");
		for(int i =0;i<points.length;i++){
			Point point = new Point(points[i]);
			mpoints.add(new LatLng(point.lat, point.lon));
		}
	}
	
	public boolean isContainsPoint(LatLng point){
		boolean contain = SpatialRelationUtil.isPolygonContainsPoint(mpoints, point);
		return contain;		
	}
	
	public static void main(String[] args) {
//		Quadrilateral qu = new Quadrilateral("31:16:32,121:45:39-31:16:44,121:45:51-31:16:24,121:46:20-31:16:11,121:46:08");
		Quadrilateral qu = new Quadrilateral("122:10:22.15761,30:33:53.48025-122:10:18.39148,30:33:33.11945-122:17:18.08089,30:32:55.71872-122:17:14.29433,30:32:35.36090");
//		Point po = new Point("31:16:32,121:45:39");
		Point po = new Point("122:10:22.15761,30:33:53.48025");
		System.out.println(po.lon);
		LatLng point = new LatLng(30.56486,122.17282);
		System.out.println(qu.isContainsPoint(point));
	}
}
