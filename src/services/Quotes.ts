import { Collection } from "lokijs";
import { randomInteger } from "./utils";

export type Quote = { quote: string; caption: string };

export default function getRandomQuote(quotes: Collection) {
    const { data } = quotes;
    if (data.length === 0) return undefined;
    return data[randomInteger(0, data.length - 1)];
}
