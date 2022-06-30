export interface ContactFormModel{
    id: number;
    userId: number;
    name: string;
    email: string;
    request: string;
    phone: string;
    type: ContactUsTypeEnum;
    created: string;
}

export enum ContactUsTypeEnum{
    Form = 0,
    Call = 1,
    Chat = 2
}