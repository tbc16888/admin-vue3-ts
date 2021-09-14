export declare interface DynamicFormItem {
    type: string,
    value: string | number | [],
    style?: string,
    remark?: string,
    disabled?: boolean,
    readonly?: boolean,
    step?: number,
    min?: number,
    max?: number,
    showAlpha?: false,
    options?: { label: string, value: string }[]
}