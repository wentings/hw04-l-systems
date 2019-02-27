import {vec3} from 'gl-matrix';

export default class Turtle {
  position: vec3;
  direction: vec3;

  constructor(pos: vec3, dir: vec3) {
    this.position = pos;
    this.direction = dir;
  }
}
