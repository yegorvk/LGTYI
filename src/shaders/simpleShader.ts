

export const vShader = `

attribute vec3 color;

varying vec3 vColor;

void main() {
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position / 2.0, 1.0);
}

`

export const fShader = `

varying vec3 vColor;

void main() {
	gl_FragColor = vec4(vColor, 1.0);
}

`