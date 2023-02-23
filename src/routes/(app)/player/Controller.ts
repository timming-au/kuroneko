import { Vector3, type Vector } from "@dimforge/rapier3d-compat";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { Quaternion } from "three";
export default class PlayerController{
  world: RAPIER.World
  rigidBody: RAPIER.RigidBody
  collider: RAPIER.Collider
  _controller: RAPIER.KinematicCharacterController
  speed: number
  constructor(world:RAPIER.World, rigidBody: RAPIER.RigidBody, collider: RAPIER.Collider, speed:number){
    this.world = world
    this.rigidBody = rigidBody
    this.collider = collider
    this._controller = this._createController()
    this.speed = speed
  }

  getCollider(){
    return this.collider
  }

  getRigidBody(){
    return this.rigidBody
  }

  rotate(rotation: Quaternion){
    this.rigidBody.setNextKinematicRotation(rotation)
  }
  move(key: "w" | "a" | "s" | "d", delta: number){
    const rotation = this.rigidBody.rotation()
    const keyDirection = (key =="w" ? Math.PI/2 : key == "a" ? Math.PI : key == "s" ? Math.PI*3/2 : 0)
    const computedDirection = rotation.z + keyDirection
    const x = Math.cos(computedDirection) * delta
    const z = Math.sin(computedDirection) * delta
    const desiredTranslation = new Vector3(x,this.world.gravity.y,z)
    this._computeMovement(desiredTranslation)
  }

  _createController(){
    // The gap the controller will leave between the character and its environment.
    const offset = 0.01;
    // Create the controller.
    const controller = this.world.createCharacterController(offset)

    // Autostep if the step height is smaller than 0.5, its width is larger than 0.2,
    // and allow stepping on dynamic bodies.
    controller.enableAutostep(0.5, 0.2, true);

    return controller;
  }

  _removeController(){
    this.world.removeCharacterController(this._controller)
  }

  _computeMovement(desiredTranslation: Vector){
    this._controller.computeColliderMovement(
      this.collider,           // The collider we would like to move.
      desiredTranslation, // The movement we would like to apply if there wasn’t any obstacle.
    );
    // Read the result.
    const correctedMovement = this._controller.computedMovement();

    this.rigidBody.setLinvel(correctedMovement,true)
  }
}