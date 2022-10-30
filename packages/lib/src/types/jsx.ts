export type JsxLimoProps<T = {}> = T & {
  children?: LimoNode[];
};

export interface JsxLimo<T = void, U = {}, V = {}> {
  (props?: JsxLimoProps<U>, privateProps?: V): T;
}

export type LimoNode<T = {}, U = {}, V = void> = {
  props: JsxLimoProps<U>;
  fn: JsxLimo<T, U, V>;
  children: LimoNode[];
}
