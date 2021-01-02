import Flatten from '@flatten-js/core'

export interface LayerTagNameMap {
  'image':Flatten.Polygon;
  'polygon':Flatten.Polygon;
  'text':Flatten.Polygon;
  'circle':Flatten.Circle
}

export interface LayerGeometry<K extends keyof LayerTagNameMap>{
  type :K;
  value: LayerTagNameMap[K];
}

export type Geometry = LayerGeometry<keyof LayerTagNameMap>;

export enum operType{
  choose,
  move,
  transform
}

export enum ActionTypes { move, scale, rotate }

export interface anyObj{
  [key:string]:unknown
}
