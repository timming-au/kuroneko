/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";
import { DoubleSide, ShaderLib, ShaderMaterial, UniformsUtils, type Mesh, type RGB } from "three";
/**
 * Takes in RGB object 
 * @param color 
 * @returns Hex representation
 */
export function RGBToHex(color:RGB): number{
    const [r,g,b] = Object.values(color).map(c=>Math.trunc(c))
    return parseInt("0x" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1))
}

export function RGBToString(color:RGB):string{
    return `rgb(${Object.values(color).map(c=>Math.trunc(c)).join()})`
}

/**
 * Cubic easing.
 * @link https://easings.net/#easeOutCubic
 * */ 
export function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
}

/**
 * Quad easing.
 * @link https://easings.net/#easeOutQuad
 * */ 
export function easeOutQuad(x: number): number {
    return 1 - (1 - x) * (1 - x);
}

/**
 * Magnetise elements when hovered over.
 * @param {HTMLElement} [element] DOM element to magnetise
 * @param {number} [magnitude=0.5] Magnitude of magnetisation (0-1), defaults to 0.5
 * */ 
export const magnetise = {
    set(element: HTMLElement, magnitude = 0.5, scale = 1.3){
        element.addEventListener("mousemove",function(e:MouseEvent){
            const rect = element.getBoundingClientRect()
            const transX = (e.x - (rect.x + rect.width/2))* magnitude
            const transY = (e.y - (rect.y + rect.height/2)) * magnitude
            gsap.to(element,{
                translateX: transX,
                translateY: transY,
                scale: scale,
                ease: 'none',
                duration:0.2,
            })
        })
        element.addEventListener("mouseleave",function(){
            gsap.to(element,{
                translateX: 0,
                translateY: 0,
                scale:1,
                ease:'elastic.out(1,0.5)',
                duration:0.8,
            })
        })
    },
    clean(element: HTMLElement, magnitude = 0.5, scale = 1.3){
        element.removeEventListener("mousemove",function(e:MouseEvent){
            const rect = element.getBoundingClientRect()
            const transX = (e.x - (rect.x + rect.width/2)) * magnitude
            const transY = (e.y - (rect.y + rect.height/2)) * magnitude
            gsap.to(element,{
                translateX: transX,
                translateY: transY,
                scale:scale,
                duration:0.2,
            })
        })
        element.addEventListener("mouseleave",function(){
            gsap.to(element,{
                translateX: 0,
                translateY: 0,
                scale:1,
                ease:'elastic.out(1,0.5)',
                duration:0.8,
            })
        })
    },
}

export const getCentroid = (p:number[]) => {
    let res = 0
    const len = p.length
    for(let i = 0; i < len; i++){
        res += p[i]
    }
    return res/len
}

// // shamelessly stolen code from https://codepen.io/nicoptere/pen/gxzeOE because I don't know how shaders work
// const extendedMaterial = function ( material: any, uniforms: any, hooks: any, debug?:boolean ) {

//     let changed = false;
//     material.onBeforeCompile = function ( shader: any ) {

//         if( Boolean( changed ) === true )return;
//         changed = true;

//         let vertexShader = shader.vertexShader;
//         let fragmentShader = shader.fragmentShader;

//         if( uniforms !== undefined ){

//             let uniformName = '';
//             let uniformDeclaration = '';
//             uniforms.forEach(function( uniform: any ){

//                 //retrieve the name of the uniform
//                 for( const key in uniform ) uniformName = key;

//                 //retrieve the type of the uniform
//                 switch( uniform[ uniformName ].type ){
//                     case "f":
//                         uniformDeclaration += 'uniform float '+uniformName+';';
//                         break;
//                     case "v2":
//                         uniformDeclaration += 'uniform vec2 '+uniformName+';';
//                         break;
//                     case "v3":
//                         uniformDeclaration += 'uniform vec3 '+uniformName+';';
//                         break;
//                     case "v4":
//                         uniformDeclaration += 'uniform vec4 '+uniformName+';';
//                         break;
//                 }
//                 uniformDeclaration += "\n";

//                 //merge this uniforms to the existing ones
//                 shader.uniforms = UniformsUtils.merge([shader.uniforms, uniform ]);

//             });

//             //appends the uniforms declarations to the shader
//             vertexShader = uniformDeclaration + shader.vertexShader;

//             //creates a shortcut to the uniforms on the material for later update
//             this.uniforms = shader.uniforms;
//         }

//         //hack the shaders' text content
//         if( hooks !== undefined ){

//             hooks.forEach(function( hook: any ){

//                 const needle = hook.needle;

//                 const vertex = hook.vertex;
//                 if( vertex !== undefined && vertex !== '' ){
//                     vertexShader = vertexShader.replace( needle, vertex );
//                 }

//                 const fragment = hook.fragment;
//                 if( fragment !== undefined && fragment !== '' ){
//                     fragmentShader = fragmentShader.replace( needle, fragment );
//                 }
//             } );
//         }

//         shader.vertexShader = vertexShader;
//         shader.fragmentShader = fragmentShader;

//         if( Boolean(debug)===true ){
//             console.log( 'vertexShader:' );
//             console.log( vertexShader );
//             console.log( 'fragmentShader:' );
//             console.log( fragmentShader );
//         }
//     };
//     return material;

// };
// const uniforms = [
//     { time : { type:"f", value: 0 } },
//     { radius : { type:"f", value: 0 } }
// ];

// const shader = [
//     {
//       needle:'#include <begin_vertex>', 
//       vertex:'vec3 transformed = position + offset * (1.+abs( sin( time ) ) * radius );' 
//     },
//     { 
//       needle:new RegExp(/.*void.*main/), 
//       vertex:'attribute vec3 offset;\nvoid main'
//     }
// ];
// export function enableShadows(mesh: Mesh){
//     //ask it to cast / receive shadows
//     mesh.castShadow = true;

//     //only the original cube is casting a shadow ; we need the depthMaterial to position instances too
//     // > also hacks the depth material

//     // mesh.customDepthMaterial = extendedMaterial(new ShaderMaterial( {
//     //     vertexShader: ShaderLib.depth.vertexShader,
//     //     fragmentShader:"#define DEPTH_PACKING 3201\n" + ShaderLib.depth.fragmentShader,
//     //     side: DoubleSide
//     // } ),    uniforms,shader);
// }