var minimunInterval = 200;
function Rad(d) {
       return d * Math.PI / 180.0;
}

function testdistance(lat1,lng1,lat2,lng2){
    lat1/=10000000;
    lng1/=10000000;
    lat2/=10000000;
    lng2/=10000000;
    // console.log('dis');
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s*6378.137 ;
    s = Math.round(s * 10000) / 10;
    return s;
}

function getTriangleArea(v1, v2, v3) {
    var a = testdistance(v1.y, v1.x, v2.y, v2.x);
    var b = testdistance(v1.y, v1.x, v3.y, v3.x);
    var c = testdistance(v2.y, v2.x, v3.y, v3.x);
    // console.log(v1.y, v1.x, v2.y, v2.x);
    // console.log(a, b, c);
    //area of triangle
    var p = (a + b + c) / 2;
    var s = Math.sqrt(Math.abs(p * (p - a) * (p - b) * (p - c)));
    return s;
}

// check {@url http://www.w856.com/tft/post/37.html} to get the equation.
function calculateOneVertexOverSurface(s, d1, d2, d3, threshold) {
    return s * (threshold - d1) / (d2 - d1) * (threshold - d1) / (d3 - d1) * (threshold - d1);
}

// check {@url http://www.w856.com/tft/post/37.html} to get the equation.
function calculateTwoVertexOverSurface(s, d1, d2, d3, threshold) {
    var res1 = s * (threshold - d1) / (d3 - d1) * (threshold - d2);
    // console.log(res1)
    var res2 = s * (1 - (threshold - d1) / (d3 - d1)) * (threshold - d2) / (d3 - d2) * (threshold * 2 - d1 - d2);
    // console.log(threshold * 2 - d1 - d2)
    // console.log(d1)
    // console.log(d2)
    // console.log(threshold)
    return (res1 + res2) / 3;
}

function determinePolyArea(v, rangedThreshold, rangedArea, threshold, k, u) {
    u = typeof u !== 'undefined' ? u : 0;
    var best = 1.0;
    var bestD = 0;
    for (var i = 0; i < rangedThreshold.length; i++) {
        var area = 0.0;
        for (var j = 0; j < rangedThreshold[i].co.length - 1; j++) {
            area += getTriangleArea(v, rangedThreshold[i].co[j], rangedThreshold[i].co[j + 1]);
        }
        // console.log(v);
        area += getTriangleArea(v, rangedThreshold[i].co[rangedThreshold[i].co.length - 1], rangedThreshold[i].co[0]);
        // console.log(area);
        if (Math.abs(area - rangedArea[i]) / area < best) {
            best = Math.abs(area - rangedArea[i]) / area;
            bestD = rangedThreshold[i].d;
        }
    }
    if(u == 0){

    if (best < 0.004) {
        return bestD;
    } else {
        return threshold;
    }
    }
    else return bestD;
}

function getEarthWork(data, verticalSlope, horizontalSlope, superWidth, superDepth, threshold, rangedThreshold, u) {
    u = typeof u !== 'undefined' ? u : 0;
    var rangedArea = new Array(rangedThreshold.length);
    for (var i = 0; i < rangedThreshold.length; i++) {
        rangedArea[i] = 0.0;
        for (var j = 1; j < rangedThreshold[i].co.length - 1; j++) {
            rangedArea[i] += getTriangleArea(rangedThreshold[i].co[j], rangedThreshold[i].co[j + 1], rangedThreshold[i].co[0]);
        } 
        // console.log(rangedArea[i]);
    }

    var triangles = Delaunay.triangulate(data);
    var sum = 0.0;
    for (var i = triangles.length; i >= 3; i-=3) {
        var v1 = {x: data[triangles[i - 1]][1],y: data[triangles[i - 1]][0]};
        var v2 = {x: data[triangles[i - 2]][1],y: data[triangles[i - 2]][0]};
        var v3 = {x: data[triangles[i - 3]][1],y: data[triangles[i - 3]][0]};
        //determine range
        var t1 = determinePolyArea(v1, rangedThreshold, rangedArea, threshold, i / 3 - 1, u);
        var t2 = determinePolyArea(v2, rangedThreshold, rangedArea, threshold, i / 3 - 1, u);
        var t3 = determinePolyArea(v3, rangedThreshold, rangedArea, threshold, i / 3 - 1, u);
        var ft = 1.0 * (t1 + t2 + t3) / 3 + superDepth;
        //depth
        var d1 = data[triangles[i - 1]][2];
        var d2 = data[triangles[i - 2]][2];
        var d3 = data[triangles[i - 3]][2];
        //edge
        // console.log(v1.y);
        // testdistance();
        var a = testdistance(v1.y, v1.x, v2.y, v2.x);
        var b = testdistance(v1.y, v1.x, v3.y, v3.x);
        var c = testdistance(v2.y, v2.x, v3.y, v3.x);
        // console.log(a)
        //area of triangle
        var p = (a + b + c) / 2;
        var s = Math.sqrt(Math.abs(p * (p - a) * (p - b) * (p - c)));

        if (a <= minimunInterval && b <= minimunInterval && c <= minimunInterval) {
            if (d1 < ft && d2 < ft && d3 < ft) {
                sum +=  s * (ft * 3 - d1 - d2 -d3) / 3;
            } else if (d1 < ft && d2 < ft) {
                sum += calculateTwoVertexOverSurface(s, d1, d2, d3, ft);
            } else if (d1 < ft && d3 < ft) {
                sum += calculateTwoVertexOverSurface(s, d1, d3, d2, ft);
                                // console.log(calculateTwoVertexOverSurface(s, d1, d3, d2, threshold))
            } else if (d2 < ft && d3 < ft) {
                sum += calculateTwoVertexOverSurface(s, d2, d3, d1, ft);
                // console.log(calculateTwoVertexOverSurface(s, d2, d3, d1, threshold))
            } else if (d1 < ft) {
                sum += calculateOneVertexOverSurface(s, d1, d2, d3, ft)
            } else if (d2 < ft) {
                sum += calculateOneVertexOverSurface(s, d2, d1, d3, ft)
            } else if (d3 < ft) {
                sum += calculateOneVertexOverSurface(s, d3, d1, d2, ft)
            }
        }

        // console.log(v1)
        // var depth = (d1 + d2 + d3) / 3;
        // if (depth < threshold && a <= 100 && b <= 100 && c <= 100) {
        //     sum += s * (threshold - depth);
        // }
    }

    sum += getSideWork(data, triangles, verticalSlope, horizontalSlope, superWidth, superDepth, threshold, rangedThreshold, rangedArea);
    sum = Math.round(sum);
    return sum;
}

function getSideWork(vertex, triangles, verticalSlope, horizontalSlope, superWidth, superDepth, threshold, rangedThreshold, rangedArea, u) {
    u = typeof u !== 'undefined' ? u : 0;
    var borders = getBorder(vertex, triangles, rangedThreshold, rangedArea);
    var sum = 0.0;  
    for (var i = 0; i < borders.length; i++) {
        var t1 = determinePolyArea({x:vertex[borders[i].v1][1], y:vertex[borders[i].v1][0]}, rangedThreshold, rangedArea, threshold, u);
        var t2 = determinePolyArea({x:vertex[borders[i].v2][1], y:vertex[borders[i].v2][0]}, rangedThreshold, rangedArea, threshold, u);
        var diff = 1.0 * (t1 + t2) / 2 + superDepth - (vertex[borders[i].v1][2] + vertex[borders[i].v2][2]) / 2;
        
        if (diff > 0) {
            var slope = 0;
            if (getBorderDir(vertex[borders[i].v1][1], vertex[borders[i].v1][0], vertex[borders[i].v2][1], vertex[borders[i].v2][0]) == 0) {
                slope = verticalSlope;
            } else {
                slope = horizontalSlope;
            }
            var len = testdistance(vertex[borders[i].v1][0], vertex[borders[i].v1][1], vertex[borders[i].v2][0], vertex[borders[i].v2][1]);
            sum += diff * diff * slope / 2 * len;
            sum += diff * superWidth;
        }
    }
    // console.log(cnt, cnt1);
    return sum;
}

function getBorderDir(x1, y1, x2, y2) {
    if (x1 == x2) {
        return 1;
    } else {
        var slope = (y2 - y1) / (x2 - x1);
        if (slope < 1 && slope > -2) {
            return 0;
        }
        return 1;
    }
}

function checkEdge(edges, border, v) {
    for (var j = 0; j < edges.length; j++) {
        if (edges[j] == v) {
            border[j] = false;
            return true;
        }
    }
    edges.push(v);
    border.push(true);
    return false;
}

function getBorder(vertex, triangles, rangedThreshold, rangedArea) {
    rangedThreshold = typeof rangedThreshold !== 'undefined' ? rangedThreshold : [];
    rangedArea = typeof rangedArea !== 'undefined' ? rangedArea : [];
    var edgeSet = new Array(vertex.length);
    var borders = new Array(vertex.length);
    for (var i = 0; i < edgeSet.length; i++) {
        edgeSet[i] = [];
        borders[i] = [];
    }
    for (var i = triangles.length; i >= 3; i-=3) {
        var vp1 = triangles[i - 1];
        var vp2 = triangles[i - 2];
        var vp3 = triangles[i - 3];
        var v1 = {x: vertex[triangles[i - 1]][1],y: vertex[triangles[i - 1]][0]};
        var v2 = {x: vertex[triangles[i - 2]][1],y: vertex[triangles[i - 2]][0]};
        var v3 = {x: vertex[triangles[i - 3]][1],y: vertex[triangles[i - 3]][0]};

        var a = testdistance(v1.y, v1.x, v2.y, v2.x);
        var b = testdistance(v1.y, v1.x, v3.y, v3.x);
        var c = testdistance(v2.y, v2.x, v3.y, v3.x);

        var t1 = determinePolyArea(v1, rangedThreshold, rangedArea, 0, i / 3 - 1);
        var t2 = determinePolyArea(v2, rangedThreshold, rangedArea, 0, i / 3 - 1);
        var t3 = determinePolyArea(v3, rangedThreshold, rangedArea, 0, i / 3 - 1);      
        var ft = 1.0 * (t1 + t2 + t3) / 3;
  
        if (a <= minimunInterval && b <= minimunInterval && c <= minimunInterval 
            && (rangedThreshold.length == 0 || (t1 > 0.01 && t2 > 0.01 && t3 > 0.01))) {
            checkEdge(edgeSet[vp1], borders[vp1], vp2);
            checkEdge(edgeSet[vp2], borders[vp2], vp1);
            checkEdge(edgeSet[vp1], borders[vp1], vp3);
            checkEdge(edgeSet[vp3], borders[vp3], vp1);
            checkEdge(edgeSet[vp2], borders[vp2], vp3);
            checkEdge(edgeSet[vp3], borders[vp3], vp2);
        } 
    }
    var result = [];
    for (var i = 0; i < edgeSet.length; i++) {
        for (var j = 0; j < edgeSet[i].length; j++) {
            if (borders[i][j] && i < edgeSet[i][j]) {
                result.push({v1: i, v2:edgeSet[i][j]});
            }
        }
    }
    return result;
}