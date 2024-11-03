import { UseCaseResponseMessage } from "webapi.core"
import { PresenterBase } from "./PresenterBase.js"
import showdown from "showdown";
export class GenerateTextPresenter extends PresenterBase<UseCaseResponseMessage> {
    private _converter: showdown.Converter;
    public constructor() {
        super();
        this._converter = new showdown.Converter();
    }
    public override async Handle (response: UseCaseResponseMessage): Promise<void> {
        super.Handle(response);
        this.Message = this._converter.makeHtml(response.Message);
    }
}