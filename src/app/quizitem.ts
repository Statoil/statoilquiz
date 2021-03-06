import * as _ from 'lodash';
import * as moment from 'moment';

export class QuizItem {

    constructor(
        public quizItemId: number,
        public imageUrl: string,
        public question: string,
        public alternative1: string,
        public alternative2: string,
        public alternative3: string,
        public answer: number,
        public date: Date
    ) {}

    static fromObj(rawQuizItem: any) {
        //Special validation for image URL, as this for unknown reasons happens to be stored as an object on some rare occations
        return new QuizItem(rawQuizItem.quizItemId, typeof rawQuizItem.imageUrl === "string" ? rawQuizItem.imageUrl : null, rawQuizItem.question, rawQuizItem.alternative1,
            rawQuizItem.alternative2, rawQuizItem.alternative3, rawQuizItem.answer, new Date(rawQuizItem.date));
    }

    public equals(other: QuizItem) {
        return (
            this.quizItemId === other.quizItemId &&
            this.imageUrl === other.imageUrl &&
            this.question === other.question &&
            this.alternative1 === other.alternative1 &&
            this.alternative2 === other.alternative2 &&
            this.alternative3 === other.alternative3 &&
            this.answer === other.answer
        );
    }

    public isComplete() {
        return !_.isNil(this.quizItemId) &&
            !_.isNil(this.imageUrl) &&
            !_.isNil(this.question) &&
            !_.isNil(this.alternative1) &&
            !_.isNil(this.alternative2) &&
            !_.isNil(this.alternative3) &&
            !_.isNil(this.answer);
    }

    public isHistoric(): boolean {
        return moment(this.date).isBefore(moment().startOf('day'));
    }

    public isValid(): boolean {
        return !_.isNil(this.imageUrl) && typeof this.imageUrl === "string" && !_.isNil(this.question) && !_.isNil(this.alternative1)
        && !_.isNil(this.alternative2) && !_.isNil(this.alternative3) && !_.isNil(this.answer) ;
    }

    public isActiveToday(): boolean {
        return this.date && moment().isSame(this.date, 'day');
    }

}