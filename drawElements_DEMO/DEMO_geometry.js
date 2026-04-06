let numVertices = 0

var numTimesToSubdivide = 6;

function createCylinderPoints(divides = 6, radius = 0.5, height = 1.0) {
    let points = []
    let indices = []
    let normals = []

    let halfHeight = height / 2

    let topCenterIndex = points.length
    points.push(vec3(0.0, 0.0, halfHeight))
    normals.push(vec3(0.0, 0.0, 1.0))

    for (let i = 0; i < divides; i++) {
        let t = 2.0 * Math.PI * i / divides
        let x = radius * Math.cos(t)
        let y = radius * Math.sin(t)

        points.push(vec3(x, y, halfHeight))
        normals.push(vec3(0.0, 0.0, 1.0))
    }

    for (let i = 0; i < divides; i++) {
        let curr = topCenterIndex + 1 + i
        let next = topCenterIndex + 1 + ((i + 1) % divides)
        indices.push(topCenterIndex, curr, next)
    }

    let bottomCenterIndex = points.length
    points.push(vec3(0.0, 0.0, -halfHeight))
    normals.push(vec3(0.0, 0.0, -1.0))

    for (let i = 0; i < divides; i++) {
        let t = 2.0 * Math.PI * i / divides
        let x = radius * Math.cos(t)
        let y = radius * Math.sin(t)

        points.push(vec3(x, y, -halfHeight))
        normals.push(vec3(0.0, 0.0, -1.0))
    }

    for (let i = 0; i < divides; i++) {
        let curr = bottomCenterIndex + 1 + i
        let next = bottomCenterIndex + 1 + ((i + 1) % divides)
        indices.push(bottomCenterIndex, next, curr)
    }

    let sideStart = points.length

    for (let i = 0; i < divides; i++) {
        let t = 2.0 * Math.PI * i / divides
        let x = radius * Math.cos(t)
        let y = radius * Math.sin(t)
        let n = normalize(vec3(x, y, 0.0))

        points.push(vec3(x, y, halfHeight))
        normals.push(vec3(n[0], n[1], n[2]))

        points.push(vec3(x, y, -halfHeight))
        normals.push(vec3(n[0], n[1], n[2]))
    }

    for (let i = 0; i < divides; i++) {
        let currTop = sideStart + 2 * i
        let currBot = currTop + 1
        let nextTop = sideStart + 2 * ((i + 1) % divides)
        let nextBot = nextTop + 1

        indices.push(currTop, currBot, nextBot)
        indices.push(currTop, nextBot, nextTop)
    }

    return { points, indices, normals }
}

function createCylinder(radius = 0.5, height = 1.0, divides = 6) {
    let points = []

    let topc = vec3(0,0, height/2)
    let botc = vec3(0,0, -height/2)


    for (let i = 0; i < divides; i++) {
        let t1 = 2 * Math.PI * i / divides
        let t2 = 2 * Math.PI * (i + 1) / divides

        let x1 = radius * Math.cos(t1)
        let y1 = radius * Math.sin(t1)
        let x2 = radius * Math.cos(t2)
        let y2 = radius * Math.sin(t2)

        let top1 = vec3(x1, y1, height/2)
        let top2 = vec3(x2, y2, height/2)
        let bot1 = vec3(x1, y1, -height/2)
        let bot2 = vec3(x2, y2, -height/2)

        points.push(
            top1, bot1, bot2,
            top1, bot2, top2,
            top1, top2, topc,
            bot1, bot2, botc
        )
        numVertices += 12
    }

    return
}

// TODO: fix normals
function createTorusPoints(divides = 6, innerRadius = 0.40, outerRadius = 0.80, innerDivides = divides) {
    let points = []
    let indices = []
    let normals = []

    for (let i = 0; i < divides; i++) {
        let theta = 2 * Math.PI * i / divides
        let cosTheta = Math.cos(theta)
        let sinTheta = Math.sin(theta)

        for (let j = 0; j < innerDivides; j++) {
            let phi = 2 * Math.PI * j / innerDivides
            let cosPhi = Math.cos(phi)
            let sinPhi = Math.sin(phi)

            let x = (outerRadius + innerRadius * cosPhi) * cosTheta
            let y = (outerRadius + innerRadius * cosPhi) * sinTheta
            let z = innerRadius * sinPhi

            let p = vec3(x, y, z)
            points.push(p)

            let tubeCenter = vec3(
                outerRadius * cosTheta,
                outerRadius * sinTheta,
                0.0
            )

            let n = normalize(vec3(
                p[0] - tubeCenter[0],
                p[1] - tubeCenter[1],
                p[2] - tubeCenter[2]
            ))

            normals.push(vec3(n[0], n[1], n[2]))
        }
    }

    for (let i = 0; i < divides; i++) {
        let nextI = (i + 1) % divides

        for (let j = 0; j < innerDivides; j++) {
            let nextJ = (j + 1) % innerDivides

            let a = i * innerDivides + j
            let b = nextI * innerDivides + j
            let c = nextI * innerDivides + nextJ
            let d = i * innerDivides + nextJ

            indices.push(
                a, b, c,
                a, c, d
            )
        }
    }

    numVertices = indices.length

    return { points, indices, normals }
}

function createTorus(innerRadius = 0.40, outerRadius = 0.80, divides = 12, innerDivides = divides) {
    let points = []

    for (let i = 0; i < divides; i++) {
        let t1 = 2 * Math.PI * i / divides
        let t2 = 2 * Math.PI * (i + 1) / divides

        for (let j = 0; j < innerDivides; j++) {
            let p1 = 2 * Math.PI * j / innerDivides
            let p2 = 2 * Math.PI * (j + 1) / innerDivides

            let a = vec3(
                (outerRadius + innerRadius * Math.cos(p1)) * Math.cos(t1),
                (outerRadius + innerRadius * Math.cos(p1)) * Math.sin(t1),
                innerRadius * Math.sin(p1)
            )

            let b = vec3(
                (outerRadius + innerRadius * Math.cos(p1)) * Math.cos(t2),
                (outerRadius + innerRadius * Math.cos(p1)) * Math.sin(t2),
                innerRadius * Math.sin(p1)
            )

            let c = vec3(
                (outerRadius + innerRadius * Math.cos(p2)) * Math.cos(t2),
                (outerRadius + innerRadius * Math.cos(p2)) * Math.sin(t2),
                innerRadius * Math.sin(p2)
            )

            let d = vec3(
                (outerRadius + innerRadius * Math.cos(p2)) * Math.cos(t1),
                (outerRadius + innerRadius * Math.cos(p2)) * Math.sin(t1),
                innerRadius * Math.sin(p2)
            )

            points.push(
                a, b, c,
                a, c, d
            )

            numVertices += 6
        }
    }

    return points
}

cylinder2 = createCylinderPoints(numTimesToSubdivide)

torus2 = createTorusPoints(numTimesToSubdivide)

// FROM DEMO CODE
// ======================== sphere definition functions
function triangle(a, b, c) {

     normalsArray.push(a);
     normalsArray.push(b);
     normalsArray.push(c);
     
     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

     numVertices += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, false);
        ac = normalize(ac, false);
        bc = normalize(bc, false);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}