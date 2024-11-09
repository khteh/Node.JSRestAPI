import { UseCaseResponseMessage } from "webapi.core"
import { PresenterBase } from "./PresenterBase.js"
export class GenerateTextPresenter extends PresenterBase<UseCaseResponseMessage> {
    public override async Handle (response: UseCaseResponseMessage): Promise<void> {
        super.Handle(response);
    }
}