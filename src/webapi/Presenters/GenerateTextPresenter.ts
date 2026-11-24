import { UseCaseResponseMessage, GenerateContentErrors } from "webapi.core"
import { PresenterBase } from "./PresenterBase.js"
export class GenerateTextPresenter extends PresenterBase<UseCaseResponseMessage> {
    public override async Handle (response: UseCaseResponseMessage): Promise<void> {
        super.Handle(response);
        // Server-side problems aren't the client's fault: 503 when Gemini isn't configured, 502 when the call fails.
        if (response.Errors.some(e => e.Code === GenerateContentErrors.NotConfigured))
            this.Code = 503;
        else if (response.Errors.some(e => e.Code === GenerateContentErrors.RequestFailed))
            this.Code = 502;
    }
}
