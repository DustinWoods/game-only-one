import { NounInstance } from "./noun";
import { multiply, add, subtract, isZeroLength, Vector2, magnitude, normalize, dot } from "./vector-math";
import { NounScales } from "./nouns";
import { NOUN_RADIUS, RESTITUTION_COEFFICIENT, BALL_FRICTION_COEFFICIENT, LEVEL_HEIGHT, LEVEL_WIDTH, MOVE_FRICTION_COEFFICIENT, COLLISION_EVENT_THRESHOLD, MAX_VELOCITY } from "./constants";
import { GAME_RULES, NounCollection } from "./noun-rules";

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

function getCollisionEvents(childA: NounInstance, childB: NounInstance): NounCollection | undefined {
  const rule = GAME_RULES.find(([inputs]) => {
    if(inputs[0] === childA.name && inputs[1] === childB.name) {
      return true;
    }
    if(inputs[0] === childB.name && inputs[1] === childA.name) {
      return true;
    }
    return false;
  });

  return rule && rule[1];
}

// modifies state
export function tick(currentState: LevelState, delta: number): LevelState {
  const instances = currentState.instances;

  for (let i = 0; i < instances.length; i++) {
    const instance = instances[i];

    if(instance.cooldown) {
      instance.cooldown -= 0.1 * delta;
      if(instance.cooldown <= 0) {
        delete instance.cooldown;
      }
    }

    if(instance.releaseCooldown) {
      instance.releaseCooldown -= 0.5;
      if(instance.releaseCooldown <= 0) {
        delete instance.releaseCooldown
      }
    }

    // Any attractors?
    if(instance.attractor) {
      const d: Vector2 = subtract(instance.attractor, instance.position);
      const md = Math.max(0, Math.min(magnitude(d) - (NounScales[instance.name] || 1) * NOUN_RADIUS * 0.5, MAX_VELOCITY));
      if(md > 0) {
        instance.velocity = multiply(normalize(d), md);
      }
    }

    // Apply velocities
    const dVelocity = multiply(instance.velocity, delta);
    instance.position = add(instance.position, dVelocity);

    // Check if out of bounds
    if(instance.position[0] - (NounScales[instance.name] || 1) * NOUN_RADIUS < 0) {
      instance.position[0] = (NounScales[instance.name] || 1) * NOUN_RADIUS;
      instance.velocity[0] = -instance.velocity[0];
    }
    if(instance.position[1] - (NounScales[instance.name] || 1) * NOUN_RADIUS < 0) {
      instance.position[1] = (NounScales[instance.name] || 1) * NOUN_RADIUS;
      instance.velocity[1] = -instance.velocity[1];
    }
    if(instance.position[0] + (NounScales[instance.name] || 1) * NOUN_RADIUS > LEVEL_WIDTH) {
      instance.position[0] = LEVEL_WIDTH - (NounScales[instance.name] || 1) * NOUN_RADIUS;
      instance.velocity[0] = -instance.velocity[0];
    }
    if(instance.position[1] + (NounScales[instance.name] || 1) * NOUN_RADIUS > LEVEL_HEIGHT) {
      instance.position[1] = LEVEL_HEIGHT - (NounScales[instance.name] || 1) * NOUN_RADIUS;
      instance.velocity[1] = -instance.velocity[1];
    }

    // Apply friction to velocity
    instance.velocity = multiply(instance.velocity, MOVE_FRICTION_COEFFICIENT);
    if(magnitude(instance.velocity) < 0.5) {
      instance.velocity = [0,0];
    }
  }

  const toAdd: Array<NounInstance> = [];
  const toRemove: Array<number> = [];

  // Check collision with each other
  for (let i = 0; i < instances.length; i++) {
    if(instances[i].attractor) continue;
    for (let j = i + 1; j < instances.length; j++) {
      if(instances[j].attractor) continue;
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
          moveColliders(childA, childB, [1,0]);
        } else {
          moveColliders(childA, childB, normal);
        }

        // > 0
        const collisionAmount = minDistance(childA, childB) - magnitude(normal);
        const intent = collisionAmount > COLLISION_EVENT_THRESHOLD && (childA.releaseCooldown || childB.releaseCooldown);
        if(!childA.cooldown && !childB.cooldown && intent) {
          const newNouns = getCollisionEvents(childA, childB);
          if(newNouns) {
            childA.cooldown = 1;
            childB.cooldown = 1;
            const spawnLocation: Vector2 = add(childB.position, multiply(subtract(childA.position, childB.position), 0.5));
            toRemove.push(i);
            toRemove.push(j);
            // Create newNouns
            for (let ni = 0; ni < newNouns.length; ni++) {
              const offsetRadian = Math.PI * 2 * (ni / newNouns.length);
              const offsetSpawn: Vector2 = [Math.cos(offsetRadian), Math.sin(offsetRadian)];
              toAdd.push({
                name: newNouns[ni],
                velocity: [0, 0],
                position: add(spawnLocation, multiply(offsetSpawn,10)),
                cooldown: 1,
              });
            }
          }
        }
      }
    }
  }

  toRemove.sort();
  for (let ri = 0; ri < toRemove.length; ri++) {
    const toRemoveInstance = currentState.instances[toRemove[ri] - ri];
    if(toRemoveInstance.graphic) {
      toRemoveInstance.graphic.destroy();
    }
    currentState.instances.splice(toRemove[ri] - ri,1);
  }

  for (let ai = 0; ai < toAdd.length; ai++) {
    currentState.instances.push(toAdd[ai]);
  }

  return currentState;
}