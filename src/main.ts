import {vec3, mat4, quat} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import LSystem from './lsystem/LSystem'
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Mesh from './geometry/Mesh';
import {readTextFile} from './globals';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  iterations: 0,
  cactus_green: 1.0,
  starting_axiom: "F"
};

let iter : number = 0;
let prevCacGreen : number = 1.0;
let prevAxiom: string = "F";

let square: Square;
let branch: Mesh;
let leaf: Mesh;
let screenQuad: ScreenQuad;
let time: number = 0.0;

function loadScene(iterations : number, green : number, axi : string) {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  let obj0: string = readTextFile('./src/cyl_2.obj')
  branch = new Mesh(obj0, vec3.fromValues(0, 0, 0));
  branch.create();

  let obj1: string = readTextFile('./src/cyl_2.obj')
  leaf = new Mesh(obj1, vec3.fromValues(0, 0, 0));
  leaf.create();

  // initialize LSystem and a Turtle to draw
  var lsys = new LSystem(axi);
  var x = lsys.expandGrammar(iterations, lsys.grammar);
  let transformations: mat4[] = lsys.transformHistory;
  console.log(x);
  lsys.drawGrammar(x);
  let offsetsArray = [];
  let colorsArray = [];
  let col1Array = [];
  let col2Array = [];
  let col3Array = [];
  let col4Array = [];
  console.log("the length is " + lsys.transformHistory.length);
  for (let i = 0; i < transformations.length; i++) {
    let currTransform = transformations[i];
    console.log("this is transform " + i);
    console.log(currTransform[0] + " " + currTransform[4] + " " + currTransform[8] + " " + currTransform[12]);
    console.log(currTransform[1] + " " + currTransform[5] + " " + currTransform[9] + " " + currTransform[13]);
    console.log(currTransform[2] + " " + currTransform[6] + " " + currTransform[10] + " " + currTransform[14]);
    console.log(currTransform[3] + " " + currTransform[7] + " " + currTransform[11] + " " + currTransform[15]);
    // Dummy - todo, get rid of offsets
    offsetsArray.push(0);
    offsetsArray.push(0);
    offsetsArray.push(0);

    // push column vectors back
    col1Array.push(currTransform[0]);
    col1Array.push(currTransform[1]);
    col1Array.push(currTransform[2]);
    col1Array.push(currTransform[3]);

    col2Array.push(currTransform[4]);
    col2Array.push(currTransform[5]);
    col2Array.push(currTransform[6]);
    col2Array.push(currTransform[7]);

    col3Array.push(currTransform[8]);
    col3Array.push(currTransform[9]);
    col3Array.push(currTransform[10]);
    col3Array.push(currTransform[11]);

    col4Array.push(currTransform[12]);
    col4Array.push(currTransform[13]);
    col4Array.push(currTransform[14]);
    col4Array.push(currTransform[15]);

    // push colors back
    let rand: number = Math.random();
    colorsArray.push(0.1);
    colorsArray.push(green * 0.6);
    colorsArray.push(0.1);
    colorsArray.push(1.0);
  }

  let col1: Float32Array = new Float32Array(col1Array);
  let col2: Float32Array = new Float32Array(col2Array);
  let col3: Float32Array = new Float32Array(col3Array);
  let col4: Float32Array = new Float32Array(col4Array);
  let colors: Float32Array = new Float32Array(colorsArray);
  let offset: Float32Array = new Float32Array(offsetsArray);
  branch.setInstanceVBOs(offset, colors, col1, col2, col3, col4);
  branch.setNumInstances(transformations.length); // grid of "particles"
  // L E F A
  // leaf loading
  let offsetsArray_leaf = [];
  let colorsArray_leaf = [];
  let col1Array_leaf = [];
  let col2Array_leaf = [];
  let col3Array_leaf = [];
  let col4Array_leaf = [];

  for (let i = 0; i < lsys.leafHistory.length; i++) {
    let currTransform = lsys.leafHistory[i];
    offsetsArray_leaf.push(0);
    offsetsArray_leaf.push(0);
    offsetsArray_leaf.push(0);

    // push column vectors back
    col1Array_leaf.push(currTransform[0]);
    col1Array_leaf.push(currTransform[1]);
    col1Array_leaf.push(currTransform[2]);
    col1Array_leaf.push(currTransform[3]);

    col2Array_leaf.push(currTransform[4]);
    col2Array_leaf.push(currTransform[5]);
    col2Array_leaf.push(currTransform[6]);
    col2Array_leaf.push(currTransform[7]);

    col3Array_leaf.push(currTransform[8]);
    col3Array_leaf.push(currTransform[9]);
    col3Array_leaf.push(currTransform[10]);
    col3Array_leaf.push(currTransform[11]);

    col4Array_leaf.push(currTransform[12]);
    col4Array_leaf.push(currTransform[13]);
    col4Array_leaf.push(currTransform[14]);
    col4Array_leaf.push(currTransform[15]);

    // push colors back
    let rand: number = Math.random();
    colorsArray_leaf.push(1.0);
    colorsArray_leaf.push(105. / 255.);
    colorsArray_leaf.push(180. / 255.);
    colorsArray_leaf.push(1.0);
  }

  let col1_leaf: Float32Array = new Float32Array(col1Array_leaf);
  let col2_leaf: Float32Array = new Float32Array(col2Array_leaf);
  let col3_leaf: Float32Array = new Float32Array(col3Array_leaf);
  let col4_leaf: Float32Array = new Float32Array(col4Array_leaf);
  let colors_leaf: Float32Array = new Float32Array(colorsArray_leaf);
  let offset_leaf: Float32Array = new Float32Array(offsetsArray_leaf);
  leaf.setInstanceVBOs(offset_leaf, colors_leaf,
    col1_leaf, col2_leaf, col3_leaf, col4_leaf);
    leaf.setNumInstances(lsys.leafHistory.length); // grid of "particles"
  }

  function main() {
    // Initial display for framerate
    const stats = Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    // Add controls to the gui
    const gui = new DAT.GUI();
    gui.add(controls, 'iterations',  0, 10).step(1);
    gui.add(controls, 'cactus_green', 0, 8).step(1);
    gui.add(controls, 'starting_axiom', [ 'F', 'F+F', 'F-F' ] );

    // get canvas and webgl context
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
    if (!gl) {
      alert('WebGL 2 not supported!');
    }
    // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
    // Later, we can import `gl` from `globals.ts` to access it
    setGL(gl);

    // Initial call to load scene
    loadScene(iter, prevCacGreen, prevAxiom);

    const camera = new Camera(vec3.fromValues(0, 35, 70), vec3.fromValues(0, 5, 0));
    const renderer = new OpenGLRenderer(canvas);
    renderer.setClearColor(0.2, 0.2, 0.2, 1);
    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
    gl.enable(gl.DEPTH_TEST)

    const instancedShader = new ShaderProgram([
      new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
      new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
    ]);

    const flat = new ShaderProgram([
      new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
      new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
    ]);

    // This function will be called every frame
    function tick() {
      camera.update();
      stats.begin();
      instancedShader.setTime(time);
      flat.setTime(time++);
      gl.viewport(0, 0, window.innerWidth, window.innerHeight);

      if (controls.iterations != iter || controls.cactus_green != prevCacGreen ||
        controls.starting_axiom != prevAxiom) {
          iter = controls.iterations;
          prevCacGreen = controls.cactus_green;
          prevAxiom = controls.starting_axiom;
          loadScene(iter, prevCacGreen, prevAxiom);
        }

        renderer.clear();
        renderer.render(camera, flat, [screenQuad]);
        renderer.render(camera, instancedShader, [
          branch, leaf
        ]);
        stats.end();

        // Tell the browser to call `tick` again whenever it renders a new frame
        requestAnimationFrame(tick);
      }

      window.addEventListener('resize', function() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.setAspectRatio(window.innerWidth / window.innerHeight);
        camera.updateProjectionMatrix();
        flat.setDimensions(window.innerWidth, window.innerHeight);
      }, false);

      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.setAspectRatio(window.innerWidth / window.innerHeight);
      camera.updateProjectionMatrix();
      flat.setDimensions(window.innerWidth, window.innerHeight);

      // Start the render loop
      tick();
    }

    main();
