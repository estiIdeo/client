import { ButtonItem } from '../../../@ideo/core/models/button-item';
/**
* Must include customer id
*/
export class FormCreditCardModel {
    multiple?: boolean;
    customerId: number;
    addToken?: boolean;
    textByValue?: string;
    buttons?: ButtonItem[];
}

export type CCTypes =
    'amex' |
    'discover' |
    'mastercard' |
    'visa' |
    'maestro' |
    'isracard' |
    'paypal' |
    'unknown'

export interface CCData {
    name: string;
    brand?: string;
    length: number;
    minLength?: number;
    maxLength?: number;
    cvvDigits: number;
    image: string;
    pattern: RegExp;
}

// PrivateLabel (0) Mastercard (1) Visa (2) Maestro (3) Isracard (5)
export const CreditCardData: Record<CCTypes, CCData> =
{
    paypal: {
        name: 'paypal',
        brand: 'Paypal',
        length: null,
        image: '/assets/img/credit-card/paypal.svg',
        cvvDigits: 3,
        pattern: null,
    },
    visa: {
        name: 'Visa',
        brand: 'Visa',
        length: 16,
        image: '/assets/img/credit-card/visa.svg',
        cvvDigits: 3,
        pattern: /^4[0-9]{12}(?:[0-9]{3})?$/,
    },
    isracard: {
        name: 'isracard',
        brand: 'Isracard',
        length: null,
        image: '/assets/img/credit-card/isracard.svg',
        cvvDigits: 4,
        pattern: /^[0-9](?:[ -]?[0-9]){7,8}$/,
    },

    mastercard: {
        name: 'Master Card',
        brand: 'Mastercard',
        length: 16,
        image: '/assets/img/credit-card/master-card.svg',
        cvvDigits: 3,
        pattern: /^5[1-5][0-9]{14}$/
    },
    amex: {
        name: 'American Express',
        length: 15,
        image: '/assets/img/credit-card/amex.svg',
        cvvDigits: 4,
        pattern: /^3[47][0-9]{13}$/,
    },
    discover: {
        name: "Discover Card",
        length: 16,
        image: '/assets/img/credit-card/discover.svg',
        cvvDigits: 3,
        pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
    },
    maestro: {
        name: 'maestro',
        brand: 'Maestro',
        length: null,
        image: '/assets/img/credit-card/maesrto.svg',
        cvvDigits: 4,
        pattern: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
    },
    unknown: {
        name: '',
        length: 16,
        image: '/assets/img/credit-card/other.svg',
        cvvDigits: 4,
        pattern: null,
    }
};