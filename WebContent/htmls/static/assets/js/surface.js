function getSurface(triangle, vertex, levels) {
	var vertexToTriangle = getLinkedListOfVertexToTriangle(triangle, vertex);
	var surfaces = [];
	var visited = new Array(triangle.length / 3);
	for (var i = triangle.length; i >= 3; i-=3) {
		if (!visited[i / 3 - 1]) {
			var bfsEdges = generateNewSurface(surfaces, vertex, 
					triangle[i - 1], triangle[i - 2], triangle[i - 3], 
					levels);
			visited[i / 3 - 1] = true;
			var contains = new Array(vertex.length);
			contains[triangle[i - 1]] = true;
			contains[triangle[i - 2]] = true;
			contains[triangle[i - 3]] = true;

			applyBFS(bfsEdges, contains, visited, vertexToTriangle, levels, surfaces, vertex, triangle);
		}
	}
	// console.log(surfaces);
	return surfaces;

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
				if (i == len - 1) {
					return i - 1;
				} else {
					return i;
				}	
			}
		}
	}
	return -1;
}


function applyBFS(bfsEdges, contains, visited, vertexToTriangle, levels, surfaces, vertex, triangle) {
	
	var left = 0;
	var right = bfsEdges.length - 1;
	while (left <= right) {
		var v1 = bfsEdges[left].x;
		var v2 = bfsEdges[left].y;
		var v3 = 0;

		for (var i = 0; i < vertexToTriangle[v1].length; i++) {
			if (!visited[vertexToTriangle[v1][i].t] && getLevel(levels, vertexToTriangle[v1][i].d) == surfaces[surfaces.length - 1].level) {
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
								bfsEdges.push({x: v1, y: v3});
								bfsEdges.push({x: v3, y: v2});
								contains[v3] = true;
								right+=2;
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
// 	var color = ["red", "#FFCC00", "#428BCA"]
// 	for (var i = 0; i < surfaces.length; i++) {
// 		ctx.beginPath();
// 		ctx.moveTo(vertex[surfaces[i].surface[0]][0], vertex[surfaces[i].surface[0]][1]);
// 		for (j = 1; j < surfaces[i].surface.length; j++) {
// 			ctx.lineTo(vertex[surfaces[i].surface[j]][0], vertex[surfaces[i].surface[j]][1]);
			
// 			// console.log("" + vertex[surfaces[i].surface[j]][0] + " " + vertex[surfaces[i].surface[j]][1]);
// 		}
// 		ctx.fillStyle = color[surfaces[i].level];
// 		ctx.closePath();
// 		ctx.fill();
// 		ctx.stroke();
// 	}
// }