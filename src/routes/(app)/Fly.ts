import {
  Camera,
	Euler,
	EventDispatcher,
	Quaternion,
	Vector3
} from 'three';

const _changeEvent = { type: 'change' };

class FlyControls extends EventDispatcher {
  object: Camera
  domElement: HTMLElement
  movementSpeed: number
  rollSpeed: number
  dragToLook: boolean
  autoForward: boolean
  tmpRotation: Euler
  status: number
  moveVector: Vector3
  rotationVector: Vector3
  moveState: { up: number, down: number, left: number, right: number, forward: number, back: number, pitchUp: number, pitchDown: number, yawLeft: number, yawRight: number, rollLeft: number, rollRight: number }
  movementSpeedMultiplier: number
  
  keydown: (event:KeyboardEvent) => void
  keyup: (event:KeyboardEvent) => void
  pointerdown: (event:MouseEvent) => void
  pointermove: (event:MouseEvent) => void
  pointerup: (event:MouseEvent) => void

  updateMovementVector: () => void
  updateRotationVector: () => void
  update: (delta:number) => void
  dispose: () => void

  getContainerDimensions: () => {
    size: [ number,number ],
    offset: [ number,number ]
  }
	constructor( object: Camera, domElement: HTMLElement ) {

		super();

		this.object = object;
		this.domElement = domElement;

		// API

		this.movementSpeed = 1.0;
		this.rollSpeed = 0.005;

		this.dragToLook = false;
		this.autoForward = false;
    this.movementSpeedMultiplier = 1

		// disable default target object behavior

		// internals

		const EPS = 0.000001;

		const lastQuaternion = new Quaternion();
		const lastPosition = new Vector3();

		this.tmpRotation = new Euler();

		this.status = 0;

		this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
		this.moveVector = new Vector3( 0, 0, 0 );
		this.rotationVector = new Vector3( 0, 0, 0 );

		this.keydown = function ( event: KeyboardEvent ) {

			if ( event.altKey ) {

				return;

			}

			switch ( event.code ) {

				case 'KeyW' || 'ArrowUp': this.moveState.forward = 1; break;
				case 'KeyS' || 'ArrowDown': this.moveState.back = 1; break;

				case 'KeyA' || 'ArrowLeft': this.moveState.left = 1; break;
				case 'KeyD' || 'ArrowRight': this.moveState.right = 1; break;

				case 'Space' : this.moveState.up = 1; break;
				case 'ShiftLeft' || 'ControlLeft': this.moveState.down = 1; break;

			}

			this.updateMovementVector();
			this.updateRotationVector();

		};

		this.keyup = function ( event ) {

			switch ( event.code ) {

				case 'KeyW' || 'ArrowUp': this.moveState.forward = 0; break;
				case 'KeyS' || 'ArrowDown': this.moveState.back = 0; break;

				case 'KeyA' || 'ArrowLeft': this.moveState.left = 0; break;
				case 'KeyD' || 'ArrowRight': this.moveState.right = 0; break;

				case 'Space' : this.moveState.up = 0; break;
				case 'ShiftLeft' || 'ControlLeft': this.moveState.down = 0; break;

			}

			this.updateMovementVector();
			this.updateRotationVector();

		};

		this.pointerdown = function ( event ) {

			if ( this.dragToLook ) {

				this.status ++;

			} else {

				switch ( event.button ) {

					case 0: this.moveState.forward = 1; break;
					case 2: this.moveState.back = 1; break;

				}

				this.updateMovementVector();

			}

		};

		this.pointermove = function ( event ) {

			if ( ! this.dragToLook || this.status > 0 ) {

        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        this.tmpRotation.y -= movementX * 0.01;
        this.tmpRotation.x -= movementY * 0.01;

        // this.moveState.yawLeft -= event.movementX * 0.00001
        // this.moveState.pitchDown -= event.movementY * 0.00001
				// this.moveState.yawLeft = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth ) / halfWidth;
				// this.moveState.pitchDown = ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

				this.updateRotationVector();

			}

		};

		this.pointerup = function ( event ) {

			if ( this.dragToLook ) {

				this.status --;

				this.moveState.yawLeft = this.moveState.pitchDown = 0;

			} else {

				switch ( event.button ) {

					case 0: this.moveState.forward = 0; break;
					case 2: this.moveState.back = 0; break;

				}

				this.updateMovementVector();

			}

			this.updateRotationVector();

		};

		this.update = function ( delta: number ) {

			const moveMult = delta * this.movementSpeed;

			this.object.translateX( this.moveVector.x * moveMult );
			this.object.translateY( this.moveVector.y * moveMult );
			this.object.translateZ( this.moveVector.z * moveMult );

			this.object.rotation.copy(this.tmpRotation)

      // clear rotationVector
      this.rotationVector.x = 0
			this.rotationVector.y = 0
			this.rotationVector.z = 0

		};

		this.updateMovementVector = function () {

			const forward = ( this.moveState.forward || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;

			this.moveVector.x = ( - this.moveState.left + this.moveState.right );
			this.moveVector.y = ( - this.moveState.down + this.moveState.up );
			this.moveVector.z = ( - forward + this.moveState.back );

			//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

		};

		this.updateRotationVector = function () {

			this.rotationVector.x += ( - this.moveState.pitchDown + this.moveState.pitchUp );
			this.rotationVector.y += ( - this.moveState.yawRight + this.moveState.yawLeft );
			this.rotationVector.z += ( - this.moveState.rollRight + this.moveState.rollLeft );

      
			//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

		};

		this.getContainerDimensions = function () {

			if ( this.domElement != document.documentElement ) {

				return {
					size: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
					offset: [ this.domElement.offsetLeft, this.domElement.offsetTop ]
				};

			} else {

				return {
					size: [ window.innerWidth, window.innerHeight ],
					offset: [ 0, 0 ]
				};

			}

		};

		this.dispose = function () {

			this.domElement.removeEventListener( 'contextmenu', contextmenu );
			this.domElement.removeEventListener( 'pointerdown', _pointerdown );
			this.domElement.removeEventListener( 'pointermove', _pointermove );
			this.domElement.removeEventListener( 'pointerup', _pointerup );

			window.removeEventListener( 'keydown', _keydown );
			window.removeEventListener( 'keyup', _keyup );

		};

		const _pointermove = this.pointermove.bind( this );
		const _pointerdown = this.pointerdown.bind( this );
		const _pointerup = this.pointerup.bind( this );
		const _keydown = this.keydown.bind( this );
		const _keyup = this.keyup.bind( this );

		this.domElement.addEventListener( 'contextmenu', contextmenu );
		this.domElement.addEventListener( 'pointerdown', _pointerdown );
		this.domElement.addEventListener( 'pointermove', _pointermove );
		this.domElement.addEventListener( 'pointerup', _pointerup );

		window.addEventListener( 'keydown', _keydown );
		window.addEventListener( 'keyup', _keyup );

		this.updateMovementVector();
		this.updateRotationVector();

	}

}

function contextmenu( event: Event ) {

	event.preventDefault();

}

export { FlyControls };

