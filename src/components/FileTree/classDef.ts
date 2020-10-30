export interface Node {
  name: string;
  isLeaf: boolean;
  children?: Node[];
  _children?: Node[];
}

export class Loading {
  public loading = false;
}
