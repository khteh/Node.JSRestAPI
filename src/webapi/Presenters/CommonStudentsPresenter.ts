import { StudentDTO, CommonStudentsResponse } from "webapi.core"
import { PresenterBase } from "./PresenterBase.js"
export class CommonStudentsPresenter extends PresenterBase<CommonStudentsResponse>
{
    public Students: StudentDTO[] = [];
    public override async Handle (response: CommonStudentsResponse): Promise<void> {
        super.Handle(response);
        this.Students = response.Students;
    }
}