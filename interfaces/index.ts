export const enum Result {
	Empty,
	NA,
	Correct,
	False,
}

export const enum AnswerStatus {
	Unknown = "unknown",
	Guessed = "guessed",
	Known = "known",
}

export interface NoteLink {
	label: string;
	href: string;
}

export interface DraftChoice {
	id?: number;
	text: string;
	isCorrect: boolean;
}

export interface Choice extends DraftChoice {
	id: number;
}

export interface QuestionBase {
	id?: number;
	choiceType: "single" | "multiple";
	answerStatus: AnswerStatus;
	text: string;
	notes: string;
	noteLinks: NoteLink[];
}

export interface DraftQuestion extends QuestionBase {
	choices: DraftChoice[];
}

export interface Question extends QuestionBase {
	id: number;
	choices: Choice[];
}

export interface StudyQuestion extends Question {
	stats: Stats;
}

export interface DraftAnswer {
	id?: number;
	questionId: number;
	choiceIds: number[];
	time: Date;
}

export interface Answer extends DraftAnswer {
	id: number;
}

export interface Stats {
	results: Result[];
	score: number | null;
}

export interface ScoreInterval {
	minScore: number;
	maxScore: number;
}

export interface QuestionFilter {
	minScore: number | null;
	maxScore: number | null;
	answerStatus: AnswerStatus;
}
