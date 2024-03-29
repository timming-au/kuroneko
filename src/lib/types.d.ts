/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
export type Graph = {
	nodes: Record<string, any>
	materials: Record<string, any>
}
export type BloomType = "weak" | "strong" | "sun" | undefined
export type QualitySettings = "low" | "med" | "high"