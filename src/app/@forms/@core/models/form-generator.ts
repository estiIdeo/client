export type ModelConverter<T = any, O = any> = (values: any[], objInEdit?: any, options?: any) => O;

export interface IFormGenerator<T, O = any> {
  generate(...params: any[]): T;
  convert?: ModelConverter<any, O>;
}
