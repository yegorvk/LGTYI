export const vertex = /* glsl */`
#define PHONG

uniform sampler2D zTexture;
uniform vec2 offset;
uniform vec2 scale;

varying vec3 vViewPosition;
varying vec3 vColor;
varying vec3 vGridPos;

#define UNIT_SIZE 1.0;

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

float getHeight(vec3 gridPos) {
	vec2 uv = vec2(gridPos.x / scale.x + 0.5, gridPos.y / scale.y + 0.5);
	return texture2D(zTexture, uv).r + 120.0;
}

vec3 getNormal() {
	float delta = scale.x * UNIT_SIZE;

	vec3 dA = delta * normalize(cross(normal.yzx, normal));
	vec3 dB = delta * normalize(cross(dA, normal));

	vec3 p = vGridPos;
	vec3 pA = vGridPos + dA;
	vec3 pB = vGridPos + dB;

	float h = getHeight(vGridPos);
	float hA = getHeight(pA);
	float hB = getHeight(pB);

	p += normal * h;
	pA += normal * hA;
	pB += normal * hB;

	return normalize(cross(pB - p, pA - p));
}

vec3 getColor(float h) {
	vec3 colors[6] = vec3[6](
		vec3(0.0, 0.258, 0.235),
		vec3(0.235, 0.690, 0.262),
		vec3(0.667, 1.0, 0.0),
		vec3(1.0, 0.0, 0.0),
		vec3(1.0, 1.0, 1.0),
		vec3(1.0, 1.0, 1.0)
	);

	float alts[6] = float[6](
		0.0,
		0.4,
		0.7,
		0.9,
		0.95,
		1.0
	);

	for (int i = 1; i < 6; i++) {
		if (h <= alts[i]) {
			float a = (h - alts[i-1]) / (alts[i] - alts[i-1]);
			return mix(colors[i-1], colors[i], a);
		}
	}
}

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	vGridPos = position + vec3(offset, 0.0);
	vGridPos /= UNIT_SIZE;
	vGridPos = floor(vGridPos) * UNIT_SIZE;

	float h = getHeight(vGridPos);

	vGridPos += normal * h;
	//vNormal = getNormal();

	#include <begin_vertex>

	transformed.z = h - 120.0;

	h /= 240.0;

	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

	vColor = getColor(h);
}
`;

export const fragment = /* glsl */`
#define PHONG

varying vec3 vColor;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>

	#include <color_fragment>

	diffuseColor.rgb *= vColor;

	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
`;
