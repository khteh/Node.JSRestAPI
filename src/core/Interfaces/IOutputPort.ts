export interface IOutputPort<TUseCaseResponse> {
    Handle (response: TUseCaseResponse): Promise<void>;
}