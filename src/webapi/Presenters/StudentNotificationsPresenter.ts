import { StudentNotificationsResponse } from "core"
import { PresenterBase } from "./PresenterBase"
export class StudentNotificationsPresenter extends PresenterBase<StudentNotificationsResponse>
{
    public Recipients: string[] = [];
    public override async Handle (response: StudentNotificationsResponse): Promise<void> {
        super.Handle(response);
        this.Recipients = response.Recipients;
    }
}