export enum StatusEnum {
    NEW = "New",
    QUOTED = "Quoted",
    APPROVED = "Approved",
    REJECTED = "Rejected",
}
export const StatusColors = {
    [StatusEnum.NEW]: "custom.brightBlue",
    [StatusEnum.QUOTED]: "custom.kyberBlue",
    [StatusEnum.APPROVED]: "custom.activeGreen",
    [StatusEnum.REJECTED]: "custom.deepRed",
}
