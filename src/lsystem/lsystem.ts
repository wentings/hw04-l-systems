import { vec3 } from 'gl-matrix';
import Turtle from './Turtle';
import DrawingRule from './DrawingRule';
import ExpansionRule from './ExpansionRule';

// TODO: ask about the LSystem structure
export default class LSystem {
    turtle: Turtle = new Turtle(vec3.fromValues(0, 0, 0),
                                vec3.fromValues(0, 1, 0)); // Current turtle
    turtleHistory: Turtle[]; // Stack of turtle history
    dr: DrawingRule; // Map of drawing rules
    er: ExpansionRule = new ExpansionRule();
    grammar: string;

    constructor(axiom: string) {
        // Set axiom
        this.grammar = axiom;
        // Set drawing rules -- TODO: where do we define the functions?

        // Set expansion rules
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
        var output = "";
        for (let i = 0; i < iterations; i++) {
          for (var j = 0; j < str.length; j++) {
            output = output.concat(this.expandGrammarSingle(str.charAt(j)));
          }
        }
        return output;
    }

    clear() {
      this.turtle.position = vec3.fromValues(0, 0, 0);
      this.turtle.direction = vec3.fromValues(0, 1, 0);
      this.turtleHistory = [];
    }

    pushState() {
        this.turtleHistory.push(new Turtle(this.turtle.position,
                                          this.turtle.direction));
    }

    popState(){
        var s = this.turtleHistory.pop();
        this.turtle.position = s.position,
        this.turtle.direction = s.direction;
    }

}
