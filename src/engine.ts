import { NounInstance } from "./noun";
import { multiply, add } from "./vector-math";

export type LevelState = {
  instances: NounInstance[];
}

// modifies state
export function tick(currentState: LevelState, delta: number): LevelState {
  const instances = currentState.instances;

  for (let i = 0; i < instances.length; i++) {
    const instance = instances[i];
    const dVelocity = multiply(instance.velocity, delta);
    instance.position = add(instance.position, dVelocity);
    instance.graphic.position.set(...instance.position);
  }

  return currentState;
}