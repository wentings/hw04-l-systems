import { vec3, mat4, quat } from 'gl-matrix';
import Turtle from './Turtle';
import DrawingRule from './DrawingRule';
import ExpansionRule from './ExpansionRule';

// TODO: ask about the LSystem structure
export default class LSystem {
    turtle: Turtle = new Turtle(vec3.fromValues(0, 0, 0),
                               vec3.fromValues(0, 1, 0),
                               quat.fromValues(0, 0, 0, 1)); // Current turtle
    dr: DrawingRule = new DrawingRule(); // Map of drawing rules
    er: ExpansionRule = new ExpansionRule();
    grammar: string;
    transformHistory: mat4[] = [];
    // tempTransform: mat4;
    // this.transformHistory.push(tempTransform);

    constructor(axiom: string) {
        this.grammar = axiom;
    }

    expandGrammarSingle(str: string) : string {
        // Use the expansion rules
        let rand: number = Math.random();
        var result = "";
        result = this.er.expand(rand, str); // this expands a single char into something
        return result;
    }

    // Iterate over each char in the axiom and replace it with its expansion
    expandGrammar(iterations: number, str: string) : string {
        var output = this.grammar;
        for (let i = 0; i < iterations; i++) {
          for (var j = 0; j < str.length; j++) {
            output = output.concat(this.expandGrammarSingle(str.charAt(j)));
          }
        }
        return output;
    }

    drawGrammarSingle(str: string) : void {
        // Use the expansion rules
        let rand: number = Math.random();
        var result = "";
        let func = this.dr.draw(rand, str);
        if (func) {
          func();
          if (str == "F") {
            let transMat : any = this.turtle.getMatrix();
            this.transformHistory.push(transMat);
          }
        }
    }

    drawGrammar(str: string) : void {
      for (var j = 0; j < str.length; j++) {
        this.drawGrammarSingle(str.charAt(j));
      }
    }
}
