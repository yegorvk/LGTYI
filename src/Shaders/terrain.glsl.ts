export const vertex = /* glsl */`
#define PHONG

varying vec3 vViewPosition;

uniform float minZ;
uniform float maxZ;

varying vec3 vTexDist;

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

#define SNOW_LEVEL 0.9
#define ROCK_LEVEL 0.8
#define GRASS_LEVEL 0.6

#define ROCK_ALT_REL ((ROCK_LEVEL - GRASS_LEVEL)  / (SNOW_LEVEL - GRASS_LEVEL))

void main() {

	float alt = clamp((position.z - minZ) / (maxZ - minZ), GRASS_LEVEL, SNOW_LEVEL);
	alt = (alt - GRASS_LEVEL) / (SNOW_LEVEL - GRASS_LEVEL);

	vTexDist = vec3(0.0);

	if (alt <= ROCK_ALT_REL) {
		vTexDist.x = 1.0 - alt / ROCK_ALT_REL;
		vTexDist.y = 1.0 - vTexDist.x;
	} else {
		vTexDist.y = 1.0 - (alt - ROCK_ALT_REL) / (1.0 - ROCK_ALT_REL);
		vTexDist.z = 1.0 - vTexDist.y;
	}

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

	#include <begin_vertex>
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

}
`;

export const fragment = /* glsl */`
#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

varying vec3 vTexDist;

uniform sampler2D grassTex;
uniform sampler2D rockTex;
uniform sampler2D snowTex;

//uniform sampler2D map;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
//#include <map_pars_fragment>
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

	//#include <map_fragment>

	#ifdef USE_MAP
		vec4 grassColor = texture2D(grassTex, vUv);
		vec4 rockColor = texture2D(rockTex, vUv);
		vec4 snowColor = texture2D(snowTex, vUv);

		rockColor.xyz = (rockColor.xyz-vec3(0.5))*2.0+vec3(0.5);
		rockColor.xyz = clamp(rockColor.xyz, 0.0, 1.0);		

		grassColor.xyz = (grassColor.xyz-vec3(0.5))*2.0+vec3(0.5);
		grassColor.xyz = clamp(grassColor.xyz, 0.0, 1.0);

		snowColor.xyz = (snowColor.xyz-vec3(0.5))*2.0+vec3(0.5);
		snowColor.xyz = clamp(snowColor.xyz, 0.0, 1.0);
	
		diffuseColor *= (grassColor*vTexDist.x + rockColor*vTexDist.y + snowColor*vTexDist.z);
	#endif

	#include <color_fragment>
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
