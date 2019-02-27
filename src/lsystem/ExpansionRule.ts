import { vec3 } from 'gl-matrix';

export default class ExpansionRule {
  constructor() {
    
  }

  expand(rand : number, currentChar : string) : string {
    // Get a random number
    // let rand = Math.random();
    if (currentChar == "F") {
      if (rand < 0.33) {
        return "F[+F]F[-F]F";
      } else if (rand < 0.66) {
        return "F[+F]F";
      } else {
        return "F[-F]F";
      }
    }
  }
}
