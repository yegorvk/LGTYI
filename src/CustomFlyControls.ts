import {
    Camera,
    EventDispatcher,
    Quaternion,
    Vector3,
    Vector2,
    Euler
} from 'three';

const _changeEvent = {type: 'change'};

interface MoveState {
    up: number;
    down: number;
    left: number;
    right: number;
    forward: number;
    back: number;
    pitchUp: number;
    pitchDown: number;
    yawLeft: number;
    yawRight: number;
    rollLeft: number;
    rollRight: number;
}

const EPS = 0.000001;

class CustomFlyControls extends EventDispatcher {
    object: Camera;
    domElement: HTMLElement;
    movementSpeed: number;
    rollSpeed: number;
    dragToLook: boolean;
    autoForward: boolean;

    private tmpQuaternion: Quaternion;
    private status: number;
    private moveState: MoveState;
    private moveVector: Vector3;
    private rotationVector: Vector3;
    private movementSpeedMultiplier: number;
    private lastQuaternion: Quaternion;
    private lastPosition: Vector3;
    private lastPoint: Vector2;
    private tmpEuler: Euler;

    private _pointerdown: (event: PointerEvent) => void;
    private _pointermove: (event: PointerEvent) => void;
    private _pointerup: (event: PointerEvent) => void;

    private _keydown: (event: KeyboardEvent) => void;
    private _keyup: (event: KeyboardEvent) => void;

    constructor(object, domElement) {

        super();

        this.object = object;
        this.domElement = domElement;

        // API

        this.movementSpeed = 1.0;
        this.rollSpeed = 0.005;

        this.dragToLook = false;
        this.autoForward = false;

        // disable default target object behavior

        // internals

        this.lastPoint = new Vector2();
        this.tmpEuler = new Euler();

        this.tmpQuaternion = new Quaternion();

        this.status = 0;

        this.moveState = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            forward: 0,
            back: 0,
            pitchUp: 0,
            pitchDown: 0,
            yawLeft: 0,
            yawRight: 0,
            rollLeft: 0,
            rollRight: 0
        };
        this.moveVector = new Vector3(0, 0, 0);
        this.rotationVector = new Vector3(0, 0, 0);

        this.lastPosition = new Vector3()
        this.lastQuaternion = new Quaternion()

        const _pointermove = this.pointermove.bind(this);
        const _pointerdown = this.pointerdown.bind(this);
        const _pointerup = this.pointerup.bind(this);
        const _keydown = this.keydown.bind(this);
        const _keyup = this.keyup.bind(this);

        this.domElement.addEventListener('contextmenu', contextmenu);
        this.domElement.addEventListener('pointerdown', _pointerdown);
        this.domElement.addEventListener('pointermove', _pointermove);
        this.domElement.addEventListener('pointerup', _pointerup);

        window.addEventListener('keydown', _keydown);
        window.addEventListener('keyup', _keyup);

        this.updateMovementVector();
        this.updateRotationVector();
    }

    keydown(event: KeyboardEvent) {
        if (event.altKey) {
            return;
        }

        switch (event.code) {
            case 'ShiftLeft':
            case 'ShiftRight':
                this.movementSpeedMultiplier = .1;
                break;

            case 'KeyW':
                this.moveState.forward = 1;
                break;
            case 'KeyS':
                this.moveState.back = 1;
                break;

            case 'KeyA':
                this.moveState.left = 1;
                break;
            case 'KeyD':
                this.moveState.right = 1;
                break;

            case 'KeyR':
                this.moveState.up = 1;
                break;
            case 'KeyF':
                this.moveState.down = 1;
                break;

            case 'ArrowUp':
                this.moveState.pitchUp = 1;
                break;
            case 'ArrowDown':
                this.moveState.pitchDown = 1;
                break;

            case 'ArrowLeft':
                this.moveState.yawLeft = 1;
                break;
            case 'ArrowRight':
                this.moveState.yawRight = 1;
                break;

            case 'KeyQ':
                this.moveState.rollLeft = 1;
                break;
            case 'KeyE':
                this.moveState.rollRight = 1;
                break;

        }

        this.updateMovementVector();
        this.updateRotationVector();
    };

    keyup(event: KeyboardEvent) {
        switch (event.code) {

            case 'ShiftLeft':
            case 'ShiftRight':
                this.movementSpeedMultiplier = 1;
                break;

            case 'KeyW':
                this.moveState.forward = 0;
                break;
            case 'KeyS':
                this.moveState.back = 0;
                break;

            case 'KeyA':
                this.moveState.left = 0;
                break;
            case 'KeyD':
                this.moveState.right = 0;
                break;

            case 'KeyR':
                this.moveState.up = 0;
                break;
            case 'KeyF':
                this.moveState.down = 0;
                break;

            case 'ArrowUp':
                this.moveState.pitchUp = 0;
                break;
            case 'ArrowDown':
                this.moveState.pitchDown = 0;
                break;

            case 'ArrowLeft':
                this.moveState.yawLeft = 0;
                break;
            case 'ArrowRight':
                this.moveState.yawRight = 0;
                break;

            case 'KeyQ':
                this.moveState.rollLeft = 0;
                break;
            case 'KeyE':
                this.moveState.rollRight = 0;
                break;

        }

        this.updateMovementVector();
        this.updateRotationVector();

    };

    pointerdown(event: PointerEvent) {
        /*if ( this.dragToLook ) {

            this.status ++;

        } else {

            switch ( event.button ) {

                case 0: this.moveState.forward = 1; break;
                case 2: this.moveState.back = 1; break;

            }

            this.lastPoint.set(event.x, event.y);

            this.updateMovementVector();
        }*/

    };

    pointermove(event: PointerEvent) {
        if (!this.dragToLook || this.status > 0) {

            /*const deltaX = event.x - this.lastPoint.x;
            const deltaY = event.y - this.lastPoint.y;

            this.tmpEuler.set(
                -deltaY * 0.001,
                -deltaX * 0.001,
                0
            )

            this.tmpQuaternion.setFromEuler(this.tmpEuler)

            this.object.quaternion.multiply(this.tmpQuaternion)

            this.lastPoint.set(event.x, event.y);*/

            /*const container = this.getContainerDimensions();
            const halfWidth = container.size[ 0 ] / 2;
            const halfHeight = container.size[ 1 ] / 2;

            this.moveState.yawLeft = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth ) / halfWidth;
            this.moveState.pitchDown = ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;
            */

            //this.updateRotationVector();
        }

    };

    pointerup(event: PointerEvent) {

        /*if ( this.dragToLook ) {

            this.status --;

            this.moveState.yawLeft = this.moveState.pitchDown = 0;

        } else {

            switch ( event.button ) {

                case 0: this.moveState.forward = 0; break;
                case 2: this.moveState.back = 0; break;

            }

            this.updateMovementVector();

        }

        this.updateRotationVector();*/

    };

    update(delta: number) {

        const moveMult = delta * this.movementSpeed;
        const rotMult = delta * this.rollSpeed;

        this.object.translateX(this.moveVector.x * moveMult);
        this.object.translateY(this.moveVector.y * moveMult);
        this.object.translateZ(this.moveVector.z * moveMult);

        this.tmpQuaternion.set(this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1).normalize();
        this.object.quaternion.multiply(this.tmpQuaternion);

        if (
            this.lastPosition.distanceToSquared(this.object.position) > EPS ||
            8 * (1 - this.lastQuaternion.dot(this.object.quaternion)) > EPS
        ) {

            this.dispatchEvent(_changeEvent);
            this.lastQuaternion.copy(this.object.quaternion);
            this.lastPosition.copy(this.object.position);

        }

    };

    updateMovementVector() {

        const forward = (this.moveState.forward || (this.autoForward && !this.moveState.back)) ? 1 : 0;

        this.moveVector.x = (-this.moveState.left + this.moveState.right);
        this.moveVector.y = (-this.moveState.down + this.moveState.up);
        this.moveVector.z = (-forward + this.moveState.back);

        //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

    };

    updateRotationVector() {

        this.rotationVector.x = (-this.moveState.pitchDown + this.moveState.pitchUp);
        this.rotationVector.y = (-this.moveState.yawRight + this.moveState.yawLeft);
        this.rotationVector.z = (-this.moveState.rollRight + this.moveState.rollLeft);

        //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

    };

    getContainerDimensions() {
        if (this.domElement != (document as any)) {

            return {
                size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
                offset: [this.domElement.offsetLeft, this.domElement.offsetTop]
            };

        } else {

            return {
                size: [window.innerWidth, window.innerHeight],
                offset: [0, 0]
            };

        }

    };

    dispose() {
        this.domElement.removeEventListener('contextmenu', contextmenu);
        this.domElement.removeEventListener('pointerdown', this._pointerdown);
        this.domElement.removeEventListener('pointermove', this._pointermove);
        this.domElement.removeEventListener('pointerup', this._pointerup);

        window.removeEventListener('keydown', this._keydown);
        window.removeEventListener('keyup', this._keyup);

    };
}

function contextmenu(event) {

    event.preventDefault();

}

export {CustomFlyControls};
