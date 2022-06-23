import { IntelligenceKeys } from '../types/IntelligenceKeys.type'
export class ErrorMessages {
  200?: string;
  204?: string;
  400?: string;
  403?: string;
  404?: string;
  409?: string;
  422?: string;
  500?: string;
  cached?: IntelligenceKeys<'true'> | (string & number);
}