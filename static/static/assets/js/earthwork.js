function Rad(d) {
       return d * Math.PI / 180.0;
}
function GetDistance(lat1,lng1,lat2,lng2) {
    lat1/=10000000;
    lng1/=10000000;
    lat2/=10000000;
    lng2/=10000000;
    // console.log('dis');
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var  b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s*6378.137 ;
    s = Math.round(s * 10000) / 10;
    return s;
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

function getEarthWork(threshold, data) {
    threshold = typeof threshold !== 'undefined' ? threshold : 12;
    // for (var i = 0; i < data.length; i++) {
    //     data[i][0] = data[i][0]*10000000;
    //     data[i][1] = data[i][1]*10000000;
    // }
    var triangles = Delaunay.triangulate(data);
    var sum = 0.0;
    // console.log(data[0]);
    for (var i = triangles.length; i >= 3; i-=3) {
        var v1 = {x: data[triangles[i - 1]][1],y: data[triangles[i - 1]][0]};
        var v2 = {x: data[triangles[i - 2]][1],y: data[triangles[i - 2]][0]};
        var v3 = {x: data[triangles[i - 3]][1],y: data[triangles[i - 3]][0]};
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
        var s = Math.sqrt(p * (p - a) * (p - b) * (p - c))
        if (a <= 100 && b <= 100 && c <= 100) {
            if (d1 < threshold && d2 < threshold && d3 < threshold) {
                sum +=  s * (threshold * 3 - d1 - d2 -d3) / 3;
            } else if (d1 < threshold && d2 < threshold) {
                sum += calculateTwoVertexOverSurface(s, d1, d2, d3, threshold);
            } else if (d1 < threshold && d3 < threshold) {
                sum += calculateTwoVertexOverSurface(s, d1, d3, d2, threshold);
                                // console.log(calculateTwoVertexOverSurface(s, d1, d3, d2, threshold))
            } else if (d2 < threshold && d3 < threshold) {
                sum += calculateTwoVertexOverSurface(s, d2, d3, d1, threshold);
                // console.log(calculateTwoVertexOverSurface(s, d2, d3, d1, threshold))
            } else if (d1 < threshold) {
                sum += calculateOneVertexOverSurface(s, d1, d2, d3, threshold)
            } else if (d2 < threshold) {
                sum += calculateOneVertexOverSurface(s, d2, d1, d3, threshold)
            } else if (d3 < threshold) {
                sum += calculateOneVertexOverSurface(s, d3, d1, d2, threshold)
            }
        }
        // console.log(v1)
        // var depth = (d1 + d2 + d3) / 3;
        // if (depth < threshold && a <= 100 && b <= 100 && c <= 100) {
        //     sum += s * (threshold - depth);
        // }
    }
    // for (var i = 0; i < data.length; i++) {
    //     data[i][0] = data[i][0]/10000000;
    //     data[i][1] = data[i][1]/10000000;
    // }
    sum = Math.round(sum * 10) / 10;
    return sum;
}