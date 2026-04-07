var canvas;
var gl;
var program;

var nBuffer;
var vBuffer;
var iBuffer;

var vNormal;
var vPosition;

var ambientProductLoc;
var diffuseProductLoc;
var specularProductLoc;
var lightPositionLoc;
var shininessLoc;
var modelViewMatrixLoc;
var projectionMatrixLoc;

var pointsArray;
var indicesArray;
var normalsArray;

var rotateBool = false;

// eye location and parameters to move
var viewer =
{
    eye: vec3(0.0, 0.0, 3.0),
    at:  vec3(0.0, 0.0, 0.0),
    up:  vec3(0.0, 1.0, 0.0),

    radius: 3,
    theta: 0,
    phi: 0
};

// ortho box
var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;
var near = 0.01;
var farFactor = 3.0;
var far = viewer.radius * farFactor;

// light position is defined in eye coordinates
var lightPosition = vec4(0.0, 0.0, 0.0, 1.0);

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

let curMaterial = materials.default;

let curShape = cylinder2

var materialAmbient = curMaterial.ambient;
var materialDiffuse = curMaterial.diffuse;
var materialSpecular = curMaterial.specular;
var materialShininess = curMaterial.shininess;

var ambientProduct;
var diffuseProduct;
var specularProduct;

var modelViewMatrix;
var projectionMatrix;

let lightAngle = 0

function rotateLight() {
    lightAngle += 1;
    lightPosition = vec4(
        3 * Math.sin(radians(lightAngle)),
        0,
        3 * Math.cos(radians(lightAngle)),
        1.0
    );
}

window.onload = function init() {
    pointsArray = cylinder2.points;
    indicesArray = cylinder2.indices;
    normalsArray = cylinder2.normals;

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    nBuffer = gl.createBuffer();
    vBuffer = gl.createBuffer();
    iBuffer = gl.createBuffer();

    vNormal = gl.getAttribLocation(program, "vNormal");
    vPosition = gl.getAttribLocation(program, "vPosition");

    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularProductLoc = gl.getUniformLocation(program, "specularProduct");
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    //TODO: change to perspective
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    updateGeometry();
    setupUI();
    mouseControls();

    render();
};

function setupUI() {
    
    let materialPicker = document.getElementById("materials");
    shapeSelected = document.getElementById("shapes")
    let shinySlider = document.getElementById("shininess");

    let lightRotate = document.getElementById();

    if (materialPicker) {
        materialPicker.addEventListener("change", function(event) {
            const selected = event.target.value;

            if (selected == "default") curMaterial = materials.default;
            else if (selected == "plastic") curMaterial = materials.redPlastic;
            else curMaterial = materials.blackRubber;

            materialAmbient = curMaterial.ambient;
            materialDiffuse = curMaterial.diffuse;
            materialSpecular = curMaterial.specular;
            materialShininess = curMaterial.shininess;

            shinySlider.value = materialShininess
        });
    }

    if (shinySlider) {
        shinySlider.addEventListener("input", function() {
            materialShininess = this.value;
        });
    }

    document.getElementById("buttonIncreaseSubdiv").onclick = function() {
        numTimesToSubdivide++;
        console.log(numTimesToSubdivide);
        cylinder2 = createCylinderPoints(numTimesToSubdivide);
        torus2 = createTorusPoints(numTimesToSubdivide);

        if (shapeSelected.value == "cylinder") curShape = cylinder2;
        else curShape = torus2

        updateGeometry();
    };

    document.getElementById("buttonDecreaseSubdiv").onclick = function() {
        if (numTimesToSubdivide) numTimesToSubdivide--;
        console.log(numTimesToSubdivide);
        cylinder2 = createCylinderPoints(numTimesToSubdivide);
        torus2 = createTorusPoints(numTimesToSubdivide);

        if (shapeSelected.value == "cylinder") curShape = cylinder2;
        else curShape = torus2

        updateGeometry();
    };

    shapeSelected.addEventListener("change", function(event){
        const selected = event.target.value;
        if (selected== "cylinder") curShape = cylinder2;
        else curShape = torus2;

        updateGeometry();
    })
}

function updateGeometry() {

    pointsArray = curShape.points;
    indicesArray = curShape.indices;
    normalsArray = curShape.normals;

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesArray), gl.STATIC_DRAW);
}

function render() {

    rotateLight()
    //console.log(lightPosition)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
    gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));
    gl.uniform4fv(specularProductLoc, flatten(specularProduct));
    gl.uniform4fv(lightPositionLoc, flatten(lightPosition));
    gl.uniform1f(shininessLoc, materialShininess);

    modelViewMatrix = lookAt(vec3(viewer.eye), viewer.at, viewer.up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawElements(gl.TRIANGLES, indicesArray.length, gl.UNSIGNED_SHORT, 0);

    window.requestAnimFrame(render);
}