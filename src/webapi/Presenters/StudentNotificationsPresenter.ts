import { StudentNotificationsResponse } from "webapi.core"
import { PresenterBase } from "./PresenterBase.js"
export class StudentNotificationsPresenter extends PresenterBase<StudentNotificationsResponse>
{
    public Recipients: string[] = [];
    public override async Handle (response: StudentNotificationsResponse): Promise<void> {
        super.Handle(response);
        this.Recipients = response.Recipients;
    }
}