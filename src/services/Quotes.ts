import { randomInteger } from "./utils";
import LocalStorageService from "./LocalStorageService";

export type Quote = { quote: string; caption: string };

export default class Quotes extends LocalStorageService {
    private readonly quotes = this.db.getCollection<Quote>("quotes");

    getRandomQuote() {
        const all = this.getAll();
        if (all.length === 0) return undefined;
        return all[randomInteger(0, all.length - 1)];
    }

    getAll = () => this.quotes.data;
}
