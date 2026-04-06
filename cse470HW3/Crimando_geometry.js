let numVertices = 0

function createCylinderPoints(radius = 0.5, height = 1.0, divides = 6) {
    let points = []
    let indices = []

    let topc = vec3(0, 0, height / 2)
    let botc = vec3(0, 0, -height / 2)

    points.push(topc, botc)

    for (let i = 0; i < divides; i++) {
        let t1 = 2 * Math.PI * i / divides
        let t2 = 2 * Math.PI * (i + 1) / divides

        let x1 = radius * Math.cos(t1)
        let y1 = radius * Math.sin(t1)
        let x2 = radius * Math.cos(t2)
        let y2 = radius * Math.sin(t2)

        let top1 = vec3(x1, y1, height / 2)
        let top2 = vec3(x2, y2, height / 2)
        let bot1 = vec3(x1, y1, -height / 2)
        let bot2 = vec3(x2, y2, -height / 2)

        let psize = points.length

        points.push(top1, top2, bot1, bot2)

        indices.push(
            0, psize, psize + 1,
            1, psize + 3, psize + 2,
            psize, psize + 2, psize + 3,
            psize, psize + 3, psize + 1
        )
    }

    return { points, indices }
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

    return points
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

    return points
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

cylinder = createCylinder()
cylinder2 = createCylinderPoints()

torus = createTorus()

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