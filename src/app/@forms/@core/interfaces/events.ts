
export type setterActionType = 'setValue' | 'setDisabled' | 'setVisibility' | 'onPatchValue' | 'requiredSetter' | 'customEvent' | 'setValidation'
export interface FieldEvent<T = any | any[], O extends setterActionType = setterActionType> {
  type: O;
  value: T;
}