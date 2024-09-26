import Loki from "lokijs";

export default abstract class LocalStorageService {
    constructor(protected db: Loki) {}
}
