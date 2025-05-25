export class ReceiptItemModel {
    public Name: string;
    public Amount: number;
}
export class ReceiptModel {
    public Date: string;
    public Currency: string; // (3-character currency code)
    public Vendor: string;
    public Items: Array<ReceiptItemModel>;
    public TaxAmount: number;
    public Total: number;
}