import { randomInteger } from "./utils";
import LocalStorageService from "./LocalStorageService";

export type Quote = {
    id: number;
    quote: string;
    caption?: string;
    who: string;
};

export default class Quotes extends LocalStorageService {
    private readonly quotes = this.db.getCollection<Quote>("quotes");

    addQuote = (quote: Quote) => this.quotes.insert(quote);

    deleteQuote(id: number) {
        if (!this.quotes.findOne({ id })) throw "ID not found";
        this.quotes.chain().find({ id }).remove();
    }

    getRandomQuote() {
        const all = this.getAll();
        if (all.length === 0) return undefined;
        return all[randomInteger(0, all.length - 1)];
    }

    getAll = () => this.quotes.data;
}
