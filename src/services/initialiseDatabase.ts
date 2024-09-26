import Loki from "lokijs";

export default function initialiseDatabase(db: Loki) {
    if (db.getCollection("quotes") === null) db.addCollection("quotes");
    if (db.getCollection("quizzes") === null) db.addCollection("quizzes");
}
