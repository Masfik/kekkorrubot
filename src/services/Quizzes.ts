import LocalStorageService from './LocalStorageService';
import { randomInteger } from './utils';

export type Quiz = { id: string; question: string, options: string[], correct_option_id: number };

export default class Quizzes extends LocalStorageService {
    private quizzes = this.db.getCollection<Quiz>("quizzes");

    addQuiz({ id, question, options, correct_option_id }: Quiz) {
        this.quizzes.insert({ id, question, options, correct_option_id });
    }

    getAll = () => this.quizzes.data;

    getRandomQuiz(): undefined | Quiz {
        const allQuizzes = this.getAll();

        if (allQuizzes.length === 0) return undefined;
        return allQuizzes[randomInteger(0, allQuizzes.length - 1)];
    }
}
