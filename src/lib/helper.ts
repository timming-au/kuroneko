import gsap from "gsap";
import type {RGB} from "three"
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