import { UseCaseResponseMessage } from "webapi.core"
import { PresenterBase } from "./PresenterBase.js"
export class RegisterUserPresenter extends PresenterBase<UseCaseResponseMessage>
{
    public override async Handle (response: UseCaseResponseMessage): Promise<void> {
        this.Code = response.Success && !response.Errors.length ? 201 : 400;
        this.Message = response.Message;
        this.Errors = response.Errors;
    }
}