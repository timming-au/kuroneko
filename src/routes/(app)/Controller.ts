
import type { PerspectiveCamera } from "@threlte/core";
import { Quaternion, Vector3 } from "three";

const KEYS = {
  'a': 65,
  's': 83,
  'w': 87,
  'd': 68,
  'space': 32,
  'shift': 16,
};

function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

export class FirstPersonCamera {
  camera_: PerspectiveCamera
  rotation_: Quaternion;
  translation_: Vector3;
  sensitivity: number;
  phi_: number;
  phiSpeed_: number;
  theta_: number;
  thetaSpeed_: number;
  target_!: HTMLElement
  canvas_!: HTMLCanvasElement
  current_!: {
    leftButton: boolean;
    rightButton: boolean;
    mouseXDelta: number;
    mouseYDelta: number;
    mouseX: number;
    mouseY: number;
  };
  keys_!: {
    [key:string]: boolean;
  };
  previousKeys_!: {
    [key:string]: boolean;
  };
  enabled_: boolean

  constructor(camera: PerspectiveCamera,target:HTMLElement,canvas:HTMLCanvasElement,position = new Vector3(0,0,0), sensitivity = 1) {
    this.camera_ = camera;
    this.sensitivity = sensitivity
    this.canvas_ = canvas
    this.initializeInput_(target)
    this.rotation_ = new Quaternion();
    this.translation_ = position;
    this.phi_ = 0;
    this.phiSpeed_ = 8;
    this.theta_ = 0;
    this.thetaSpeed_ = 5;
    this.enabled_ = true
  }
  toggleAvailability(availability: boolean){
    this.enabled_ = availability
    this.releaseKeys_()
  }
  initializeInput_(target) {
    this.current_ = {
      leftButton: false,
      rightButton: false,
      mouseXDelta: 0,
      mouseYDelta: 0,
      mouseX: 0,
      mouseY: 0,
    };
    this.keys_ = {};
    Object.keys(KEYS).forEach((key) => this.keys_[key] = false);
    this.previousKeys_ = {};
    Object.keys(KEYS).forEach((key) => this.previousKeys_[key] = false);
    this.target_ = target
    this.target_.addEventListener('pointerdown', (e) => this.onMouseDown_(e), false);
    this.target_.addEventListener('pointermove', (e) => this.onMouseMove_(e), false);
    this.target_.addEventListener('pointerup', (e) => this.onMouseUp_(e), false);
    this.target_.addEventListener('keydown', (e) => this.onKeyDown_(e), false);
    this.target_.addEventListener('keyup', (e) => this.onKeyUp_(e), false);
    this.canvas_.addEventListener('pointerlockchange', () => this.releaseKeys_(),false)
  }

  destroy_(){
    if(this.target_){
      this.target_.removeEventListener('pointerdown', (e) => this.onMouseDown_(e), false);
      this.target_.removeEventListener('pointermove', (e) => this.onMouseMove_(e), false);
      this.target_.removeEventListener('pointerup', (e) => this.onMouseUp_(e), false);
      this.target_.removeEventListener('keydown', (e) => this.onKeyDown_(e), false);
      this.target_.removeEventListener('keyup', (e) => this.onKeyUp_(e), false);
      this.canvas_.removeEventListener('pointerlockchange', () => this.releaseKeys_(),false)
    }
  }
  releaseKeys_(){
    for(const key in this.keys_){
      this.keys_[key] = false
    }
  }
  onMouseMove_(e) {
    if(this.enabled_){
      this.current_.mouseXDelta = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      this.current_.mouseYDelta = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
      this.updateRotation_()
      this.updateCamera_()
      this.current_.mouseXDelta = 0;
      this.current_.mouseYDelta = 0;
    }
  }

  onMouseDown_(e) {
    if(this.enabled_){
      switch (e.button) {
        case 0: {
          this.current_.leftButton = true;
          break;
        }
        case 2: {
          this.current_.rightButton = true;
          break;
        }
      }
    }
  }

  onMouseUp_(e) {
    if(this.enabled_){
      switch (e.button) {
        case 0: {
          this.current_.leftButton = false;
          break;
        }
        case 2: {
          this.current_.rightButton = false;
          break;
        }
      }
    }
  }

  onKeyDown_(e) {
    
    if(this.enabled_){
      this.keys_[e.keyCode] = true;
    }
  }

  onKeyUp_(e) {
    
    if(this.enabled_){
      this.keys_[e.keyCode] = false;
    }
  }

  key(keyCode) {
    return !!this.keys_[keyCode];
  }

  update(timeElapsedS) {
    this.updateTranslation_(timeElapsedS);
    this.updateCamera_();
  }

  updateCamera_() {
    this.camera_.quaternion.copy(this.rotation_);
    this.camera_.position.copy(this.translation_);

    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(this.rotation_);

    forward.multiplyScalar(100);
    forward.add(this.translation_);
  }
  
  updateTranslation_(delta) {
    const forwardVelocity = (this.key(KEYS.w) ? 1 : 0) + (this.key(KEYS.s) ? -1 : 0)
    const strafeVelocity = (this.key(KEYS.a) ? 1 : 0) + (this.key(KEYS.d) ? -1 : 0)
    const jumpVelocity = (this.key(KEYS.space) ? 1 : 0) + (this.key(KEYS.shift) ? -1 : 0)
    const qx = new Quaternion();
    qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi_);
    const up = new Vector3(0,1,0)
    up.multiplyScalar(jumpVelocity)
    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(forwardVelocity);

    const left = new Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(strafeVelocity);
    forward.add(left).normalize().multiplyScalar(0.01)
    
    forward.add(up.multiplyScalar(0.005))
    this.translation_.add(forward.multiplyScalar(delta*200));
  }

  updateRotation_() {
    const xh = this.current_.mouseXDelta * 0.002 * this.sensitivity;
    const yh = this.current_.mouseYDelta * 0.002 * this.sensitivity;
 
    this.phi_ += -xh * this.phiSpeed_;
    this.theta_ = clamp(this.theta_ + -yh * this.thetaSpeed_, -Math.PI / 3, Math.PI / 3);

    const qx = new Quaternion();
    qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi_);
    const qz = new Quaternion();
    qz.setFromAxisAngle(new Vector3(1, 0, 0), this.theta_);

    const q = new Quaternion();
    q.multiply(qx);
    q.multiply(qz);

    this.rotation_.copy(q);
  }
}