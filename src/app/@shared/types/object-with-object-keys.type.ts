export type ObjWithObjectKeys<O = any, T = any> = {
    [P in keyof O]?: T;
};