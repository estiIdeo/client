export interface IPagedList<TEntity = any> {
  total: number;
  data: TEntity[];
}
