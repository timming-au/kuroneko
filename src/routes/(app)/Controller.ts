
import { Camera, Quaternion, Vector3 } from "three";

const KEYS = {
  'a': 65,
  's': 83,
  'w': 87,
  'd': 68,
};

function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

class InputController {
  target_: HTMLElement | undefined
  current_!: {
    leftButton: boolean;
    rightButton: boolean;
    mouseXDelta: number;
    mouseYDelta: number;
    mouseX: number;
    mouseY: number;
  };
  previous_!: {
    leftButton: boolean;
    rightButton: boolean;
    mouseXDelta: number;
    mouseYDelta: number;
    mouseX: number;
    mouseY: number;
  } | null;
  keys_!: {
    [key:string]: boolean;
  };
  previousKeys_!: {
    [key:string]: boolean;
  };
  constructor(target?: HTMLElement) {
    this.initialize_(target);    
  }

  initialize_(target?: HTMLElement) {
    this.current_ = {
      leftButton: false,
      rightButton: false,
      mouseXDelta: 0,
      mouseYDelta: 0,
      mouseX: 0,
      mouseY: 0,
    };
    this.previous_ = null;
    this.keys_ = {};
    Object.keys(KEYS).forEach((key) => this.keys_[key] = false);
    this.previousKeys_ = {};
    Object.keys(KEYS).forEach((key) => this.previousKeys_[key] = false);
    this.target_ = target || document as unknown as HTMLElement;
    this.target_.addEventListener('mousedown', (e) => this.onMouseDown_(e), false);
    this.target_.addEventListener('mousemove', (e) => this.onMouseMove_(e), false);
    this.target_.addEventListener('mouseup', (e) => this.onMouseUp_(e), false);
    this.target_.addEventListener('keydown', (e) => this.onKeyDown_(e), false);
    this.target_.addEventListener('keyup', (e) => this.onKeyUp_(e), false);
  }

  onMouseMove_(e) {
    this.current_.mouseX = e.pageX - window.innerWidth / 2;
    this.current_.mouseY = e.pageY - window.innerHeight / 2;

    if (this.previous_ === null) {
      this.previous_ = {...this.current_};
    }

    this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
    this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
  }

  onMouseDown_(e) {
    this.onMouseMove_(e);

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

  onMouseUp_(e) {
    this.onMouseMove_(e);

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

  onKeyDown_(e) {
    this.keys_[e.keyCode] = true;
  }

  onKeyUp_(e) {
    this.keys_[e.keyCode] = false;
  }

  key(keyCode) {
    return !!this.keys_[keyCode];
  }

  isReady() {
    return this.previous_ !== null;
  }

  update(_) {
    if (this.previous_ !== null) {
      this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
      this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;

      this.previous_ = {...this.current_};
    }
  }
};


export class FirstPersonCamera {
  camera_: Camera
  input_: InputController
  rotation_: Quaternion;
  translation_: Vector3;
  phi_: number;
  phiSpeed_: number;
  theta_: number;
  thetaSpeed_: number;
  constructor(camera) {
    this.camera_ = camera;
    this.input_ = new InputController();
    this.rotation_ = new Quaternion();
    this.translation_ = new Vector3(0, 2, 0);
    this.phi_ = 0;
    this.phiSpeed_ = 8;
    this.theta_ = 0;
    this.thetaSpeed_ = 5;
  }

  update(timeElapsedS) {
    this.updateRotation_(timeElapsedS);
    this.updateCamera_(timeElapsedS);
    this.updateTranslation_(timeElapsedS);
    this.input_.update(timeElapsedS);
  }

  updateCamera_(_) {
    this.camera_.quaternion.copy(this.rotation_);
    this.camera_.position.copy(this.translation_);

    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(this.rotation_);

    forward.multiplyScalar(100);
    forward.add(this.translation_);
  }
  
  updateTranslation_(timeElapsedS) {
    const forwardVelocity = (this.input_.key(KEYS.w) ? 1 : 0) + (this.input_.key(KEYS.s) ? -1 : 0)
    const strafeVelocity = (this.input_.key(KEYS.a) ? 1 : 0) + (this.input_.key(KEYS.d) ? -1 : 0)

    const qx = new Quaternion();
    qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi_);

    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(forwardVelocity * timeElapsedS * 10);

    const left = new Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(strafeVelocity * timeElapsedS * 10);

    this.translation_.add(forward);
    this.translation_.add(left);
  }

  updateRotation_(timeElapsedS) {
    const xh = this.input_.current_.mouseXDelta / window.innerWidth;
    const yh = this.input_.current_.mouseYDelta / window.innerHeight;

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