import {vec3, mat4, quat} from 'gl-matrix';

var turtleHistory: Turtle[] = []; // Stack of turtle history

export default class Turtle {
  position: vec3 = vec3.create();
  direction: vec3 = vec3.create(); // Ensure that orientation is normalized;
  quaternion: quat = quat.create();

  constructor(pos: vec3, orient: vec3, q: quat) {
    this.position = pos;
    this.direction = orient;
    this.quaternion = q;
  }

  clear() {
    this.position = vec3.fromValues(0, 0, 0);
    this.direction = vec3.fromValues(0, 1, 0);
    this.quaternion = quat.fromValues(0, 0, 1, 0);
  }

  // [
  pushState() {
    console.log("push state");
    let temp: Turtle = new Turtle(this.position,
                                  this.direction,
                                  this.quaternion);
    turtleHistory.push(temp);
  }
  // ]
  popState(){
    console.log("pop state");
      var s = turtleHistory.pop();
      this.position = s.position,
      this.direction = s.direction;
      this.quaternion = s.quaternion;
  }

  rotate(axis: vec3, degrees: number) {
    // Set up a rotation quaternion
    let q: quat = quat.create();
    vec3.normalize(axis, axis);
    quat.setAxisAngle(q, axis, degrees * Math.PI / 180.0);
    quat.normalize(q, q);

    // Update the orientation direction of our turtle
    this.direction = vec3.transformQuat(this.direction, this.direction, q);
    vec3.normalize(this.direction, this.direction);

    // Save the current rotation in our turtle's quaternion
    quat.rotationTo(this.quaternion, vec3.fromValues(0, 1, 0), this.direction);
  }

  // +
  rotateLeft() {
    console.log("rotate left");
    this.rotate(vec3.fromValues(0, 0, 1), -26.7);
  }

  // -
  rotateRight() {
    console.log("rotate right");
    this.rotate(vec3.fromValues(0, 0, 1), 26.7);
  }

  // F
  moveForward() {
    console.log("move forward");
    // move the turtle length 1 forward and returns the transformation
    vec3.add(this.position, this.position, this.direction);
  }

  getMatrix() {
    let transform: mat4 = mat4.create();
    // translate by the origin * rotate by the degree * scale by the length
    mat4.fromRotationTranslationScale(transform, this.quaternion, this.position,
                                      vec3.fromValues(0.1, 1, 1));
    return transform;
  }

}
