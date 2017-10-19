function Rad(d) {
       return d * Math.PI / 180.0;
}
function GetDistance(v1,v2) {
    var radLat1 = Rad(v1.x);
    var radLat2 = Rad(v2.x);
    var a = radLat1 - radLat2;
    var  b = Rad(v1.y) - Rad(v2.y);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;
    s = Math.round(s * 10000) / 10;
    return s;
}

function getSurface(triangle, vertex, levels) {
	extendVertices(triangle, vertex, levels);
	var dropTriangle = new Array(triangle.length / 3);
	dropIllegalTriangle(triangle, vertex, dropTriangle);
	var vertexToTriangle = getLinkedListOfVertexToTriangle(triangle, vertex);
	var surfaces = [];
	var visited = new Array(triangle.length / 3);
	for (var i = triangle.length; i >= 3; i-=3) {
		if (!visited[i / 3 - 1] && !dropTriangle[i / 3 - 1]) {
			var bfsEdges = generateNewSurface(surfaces, vertex, 
					triangle[i - 1], triangle[i - 2], triangle[i - 3], 
					levels);
			visited[i / 3 - 1] = true;
			var contains = new Array(vertex.length);
			contains[triangle[i - 1]] = true;
			contains[triangle[i - 2]] = true;
			contains[triangle[i - 3]] = true;

			applyBFS(bfsEdges, contains, visited, dropTriangle, vertexToTriangle, levels, surfaces, vertex, triangle);
		}
	}
	// console.log(surfaces);
	return surfaces;

}

function extendVertices(triangle, vertex, levels) {
	// console.log(triangle.length);
	var insertedVertex = new Array(vertex.length);
	for (var i = 0; i < insertedVertex.length; i++) {
		insertedVertex[i] = [];
	}
	for (var i = triangle.length; i >= 3; i-=3) {
		checkAndRotate(i - 1, i - 2, i - 3, triangle, vertex, levels, insertedVertex, 3);
	}
	// console.log(triangle.length);
}

function checkAndRotate(p1, p2, p3, triangle, vertex, levels, insertedVertex, cnt) {
	if (cnt == 0) {
		return;
	} else {
		var v1 = triangle[p1];
		var v2 = triangle[p2];
		var v3 = triangle[p3];
		if (checkDistance(vertex, v1, v2, v3)) {
			return;
		}
		var index = -1;
		for (var i = 0; i < levels.length; i++) {
			if ((vertex[v1][2] > levels[i] && vertex[v2][2] < levels[i]) || (vertex[v2][2] > levels[i] && vertex[v1][2] < levels[i])) {
				index = i;
				break;
			}
		}
		if (index == -1) {
			checkAndRotate(p2, p3, p1, triangle, vertex, levels, insertedVertex, cnt - 1);
		} else {
			var newVertex = -1;
			for (var i = 0; i < insertedVertex[v1].length; i++) {
				if (insertedVertex[v1][i].v2 == v2) {
					newVertex = insertedVertex[v1][i].newVertex;
				}
			}
			if (newVertex == -1) {
				var v = new Array(3);
				v[0] = vertex[v1][0] + (levels[index] - vertex[v1][2]) / (vertex[v2][2] - vertex[v1][2]) * (vertex[v2][0] - vertex[v1][0]);
				v[1] = vertex[v1][1] + (levels[index] - vertex[v1][2]) / (vertex[v2][2] - vertex[v1][2]) * (vertex[v2][1] - vertex[v1][1]);
				v[2] = levels[index];
				if (tooSharp(v, v1, v2, v3, vertex)) {
					checkAndRotate(p2, p3, p1, triangle, vertex, levels, insertedVertex, cnt - 1);
					return;
				}
				vertex.push(v);
				newVertex = vertex.length - 1;
				insertedVertex[v1].push({v2: v2, newVertex: newVertex});
				insertedVertex[v2].push({v2: v1, newVertex: newVertex});
				insertedVertex.push([]);
			}
			triangle[p2] = newVertex;
			triangle.push(newVertex);
			triangle.push(v2);
			triangle.push(v3);
			var next = triangle.length;
			checkAndRotate(p2, p3, p1, triangle, vertex, levels, insertedVertex, cnt - 1);
			checkAndRotate(next - 3, next - 2, next - 1, triangle, vertex, levels, insertedVertex, cnt - 1);
		}
		
	}
}

function tooSharp(vi, i1, i2, i3, vertex) {
	var v1 = {x: vertex[i1][0] / 10000000, y: vertex[i1][1] / 10000000};
	var v2 = {x: vertex[i2][0] / 10000000, y: vertex[i2][1] / 10000000};
	var v3 = {x: vertex[i3][0] / 10000000, y: vertex[i3][1] / 10000000};
	var vv = {x: vi[0] / 10000000, y: vi[1] / 10000000};

	var d1 = Math.min(GetDistance(vv, v1), GetDistance(vv, v2));
	var d2 = Math.max(GetDistance(v2, v3), GetDistance(v1, v3));
	if (d1 / d2 < 0.2) {
		return true;
	} else {
		return false;
	}
}

function checkDistance(vertex, i1, i2, i3) {
	var v1 = {x: vertex[i1][0] / 10000000, y: vertex[i1][1] / 10000000};
	var v2 = {x: vertex[i2][0] / 10000000, y: vertex[i2][1] / 10000000};
	var v3 = {x: vertex[i3][0] / 10000000, y: vertex[i3][1] / 10000000};
	if (GetDistance(v1, v2) > 300 || GetDistance(v1, v3) > 300 || GetDistance(v2, v3) > 300) {
		return true;
	} else {
		return false;
	}
}

function dropIllegalTriangle(triangle, vertex, dropTriangle) {
	for (var i = triangle.length; i >= 3; i-=3) {
		dropTriangle[i / 3 - 1] = checkDistance(vertex, triangle[i - 1], triangle[i - 2], triangle[i - 3]);
	}
}
function getLinkedListOfVertexToTriangle(triangle, vertex) {
	var res = new Array(vertex.length);
	for (var i = 0; i < vertex.length; i++) {
		res[i] = [];
	}
	for (var i = triangle.length; i >= 3; i-=3) {
		var depth = (vertex[triangle[i - 1]][2] + vertex[triangle[i - 2]][2] + vertex[triangle[i - 3]][2]) / 3;
		res[triangle[i - 1]].push({t: i / 3 - 1, d: depth});
		res[triangle[i - 2]].push({t: i / 3 - 1, d: depth});
		res[triangle[i - 3]].push({t: i / 3 - 1, d: depth});
	}
	return res;
}

function generateNewSurface(surfaces, vertex, v1, v2, v3, levels) {
	var surface = [v1, v2, v3];
	var c = (vertex[v1][2] + vertex[v2][2] + vertex[v3][2]) / 3;
	surfaces.push({surface: surface, level: getLevel(levels, c)});
	var re = [];
	re.push({x: v1, y: v2});
	re.push({x: v2, y: v3});
	re.push({x: v3, y: v1});
	return re;
}

function getLevel(levels, depth) {
	for (var i = 0; i < levels.length; i++) {
		if (depth < levels[i]) {
			return i;
		}
	}
	return levels.length - 1;
}

function getType(contains, v1, v2, v3) {
	var c = 0;

	if (contains[v1]) {
		c++;
	}
	if (contains[v2]) {
		c++;
	}
	if (contains[v3]) {
		c++;
	}
	return c;
}

function doubleIntersect(surface, v1, v2, v3) {
	var index = 0;
	var len = surface.surface.length;
	while (!((surface.surface[index] == v1 && surface.surface[(index + 1) % len] == v2) ||
				(surface.surface[index] == v2 && surface.surface[(index + 1) % len] == v1))) {
		index++;
		if (index == len) {
			return false;
		}
	}

	surface.surface.splice((index + 1) % len, 0, v3);
	return true;
}

function tripleIntersect(surface, v1, v2, v3) {
	// console.log(surface);
	// console.log("" + v1 + v2 + v3);
	var len = surface.surface.length;
	var arr = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]
	for (var i = 0; i < surface.surface.length; i++) {
		for (var k = 0; k < 6; k++) {
			if (surface.surface[(i + arr[k][0]) % len] == v1 && surface.surface[(i + arr[k][1]) % len] == v2 && surface.surface[(i + arr[k][2]) % len] == v3) {
				surface.surface.splice((i + 1) % len, 1);
				if (i < len - 1) {
					return i;
				} else {
					return i - 1;
				}	
			}
		}
	}
	return -1;
}


function applyBFS(bfsEdges, contains, visited, dropTriangle, vertexToTriangle, levels, surfaces, vertex, triangle) {
	
	var left = 0;
	var right = bfsEdges.length - 1;
	while (left <= right) {
		var v1 = bfsEdges[left].x;
		var v2 = bfsEdges[left].y;
		var v3 = 0;
		for (var i = 0; i < vertexToTriangle[v1].length; i++) {
			if (!visited[vertexToTriangle[v1][i].t] && !dropTriangle[vertexToTriangle[v1][i].t] && Math.abs(getLevel(levels, vertexToTriangle[v1][i].d) - surfaces[surfaces.length - 1].level) < 1) {

				for (var j = 0; j < vertexToTriangle[v2].length; j++) {
					if (vertexToTriangle[v2][j].t == vertexToTriangle[v1][i].t) {
						for (var k = vertexToTriangle[v1][i].t * 3; k < vertexToTriangle[v1][i].t * 3 + 3; k++) {
							if (triangle[k] != v1 && triangle[k] != v2) {
								v3 = triangle[k];
								// console.log(v1, v2, v3);
							}
						}
						
						if (getType(contains, v1, v2, v3) == 2) {
							if (doubleIntersect(surfaces[surfaces.length - 1], v1, v2, v3)) {
								visited[vertexToTriangle[v1][i].t] = true;
								contains[v3] = true;
								if (getLevel(levels, vertexToTriangle[v1][i].d) == surfaces[surfaces.length - 1].level)	{
									bfsEdges.push({x: v1, y: v3});
									bfsEdges.push({x: v3, y: v2});
									right+=2;
								}
								
							}
						} else {
							var index = tripleIntersect(surfaces[surfaces.length - 1], v1, v2, v3);
							if (index != -1) {
								visited[vertexToTriangle[v1][i].t] = true;
								bfsEdges.push({x: surfaces[surfaces.length - 1].surface[index], 
											   y: surfaces[surfaces.length - 1].surface[(index + 1) % surfaces[surfaces.length - 1].surface.length]});
								right++;
							}	
						}
						
					}
				}
			}
		}
		left++;
	}
}


// function drawSurface(surfaces, vertex, ctx) {
// 	for(i = vertex.length; i--; ) {

//         x = (vertex[i][0] / 10000000 - lm) / (lx - lm) * 1024;
//         y = (vertex[i][1] / 10000000 - om) / (ox - om) * 1024;

//         vertex[i] = [x, y, vertex[i][2]];
//       }

// 	var color = ["#FFFD92", "#CBFD85",  " #8BFF8D", " #8DFEC4", " #1AFFC6","#8DFFE3",
//     " #19FFFF", " #1AC6FF", " #1193FD", "#1455FD", "#161DFB", " #1A1AE0", " #191BC0", "#191A9F", " #1B1A82"]
// 	for (var i = 0; i < surfaces.length; i++) {
// 		ctx.beginPath();
// 		ctx.moveTo(vertex[surfaces[i].surface[0]][1], vertex[surfaces[i].surface[0]][0]);
// 		for (j = 1; j < surfaces[i].surface.length; j++) {
// 			ctx.lineTo(vertex[surfaces[i].surface[j]][1], vertex[surfaces[i].surface[j]][0]);
			
// 			// console.log("" + vertex[surfaces[i].surface[j]][0] + " " + vertex[surfaces[i].surface[j]][1]);
// 		}
// 		ctx.fillStyle = color[surfaces[i].level];
// 		ctx.closePath();
// 		ctx.fill();
// 		ctx.stroke();
// 	}
// }