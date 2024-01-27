export default interface Param {
  tag: string;
  classNames: string[];
  textContent?: string;
  callback?: (params: MouseEvent) => void;
  innerHTML?: string;
  href?: string;
}
