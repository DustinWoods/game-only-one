import { NounInstance } from "./noun";
import { multiply, add, subtract, isZeroLength, Vector2, magnitude, normalize, dot } from "./vector-math";
import { NounScales } from "./nouns";
import { NOUN_RADIUS, RESTITUTION_COEFFICIENT, BALL_FRICTION_COEFFICIENT } from "./constants";

export type LevelState = {
  instances: NounInstance[];
}

export function moveColliders(childA: NounInstance, childB: NounInstance, normal: Vector2) {
  const normalMagnitude = magnitude(normal);
  const halfClosestDistance = (minDistance(childA, childB) - normalMagnitude) / 2;
  const moveVector = multiply(normalize(normal), halfClosestDistance);

  childA.position = add(childA.position, moveVector);
  childB.position = subtract(childB.position, moveVector);
}

export function bounceColliders(childA: NounInstance, childB: NounInstance, normal: Vector2) {
  const normalNormal = normalize(normal);

  const dotA = dot(childA.velocity, normalNormal) * RESTITUTION_COEFFICIENT;
  const uA = multiply(normalNormal, dotA);
  const wA = multiply(subtract(childA.velocity, uA), BALL_FRICTION_COEFFICIENT);

  const dotB = dot(childB.velocity, normalNormal) * RESTITUTION_COEFFICIENT;
  const uB = multiply(normalNormal, dotB);
  const wB = multiply(subtract(childB.velocity, uB), BALL_FRICTION_COEFFICIENT);

  childA.velocity = subtract(wA, uA);

  childB.velocity = subtract(wB, uB);
}

function minDistance(a: NounInstance, b: NounInstance): number {
  return (NounScales[a.name] || 1) * NOUN_RADIUS + (NounScales[b.name] || 1) * NOUN_RADIUS;
}

// modifies state
export function tick(currentState: LevelState, delta: number): LevelState {
  const instances = currentState.instances;

  for (let i = 0; i < instances.length; i++) {
    const instance = instances[i];

    // Apply velocities
    const dVelocity = multiply(instance.velocity, delta);
    instance.position = add(instance.position, dVelocity);
    instance.graphic.position.set(...instance.position);
  }

  // Check collision with each other
  for (let i = 0; i < instances.length; i++) {
    for (let j = i + 1; j < instances.length; j++) {
      const childA = instances[i];
      const childB = instances[j];
      const dxSq = Math.pow(childA.position[0] - childB.position[0], 2);
      const dySq = Math.pow(childA.position[1] - childB.position[1], 2);
      const drSq = Math.pow(minDistance(childA, childB), 2);
      if(dxSq + dySq < drSq) {
        // Collision!
        const normal = subtract(childA.position, childB.position);
        if(isZeroLength(normal)) {
          // uh oh! We're in the same spot. Let's use [1,0] for normal
          bounceColliders(childA, childB, [1,0]);
          moveColliders(childA, childB, [1,0]);
        } else {
          bounceColliders(childA, childB, normal);
          moveColliders(childA, childB, normal);
        }
      }
    }
  }

  return currentState;
}