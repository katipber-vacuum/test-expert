import { Question, Stats, Result, Answer, AnswerStatus } from "interfaces";
import { getAnswers } from "./client";
import { zipWith } from "lodash";

const scoreWeights = [5, 4, 3, 2, 1];

export async function getStats(question: Question) {
	const answers = await getAnswers(question);

	const boolResults: (boolean | null)[] = answers.map((answer) => {
		return isCorrectAnswer(question, answer);
	});

	const score =
		answers.length === 0
			? 0
			: question.answerStatus === "unknown"
			? null
			: Math.max(
					1,
					(boolResults.reduce<number>((prev, curr, index) => prev + (curr ? scoreWeights[index] : 0), 0) * 100) / 15
			  );

	const results = zipWith(boolResults.reverse(), scoreWeights, (rawResult, _) => {
		if (rawResult === undefined) return Result.Empty;
		if (question.answerStatus === "unknown") return Result.NA;
		return rawResult ? Result.Correct : Result.False;
	});

	const stats: Stats = {
		results: results,
		score: score,
	};

	return stats;
}

export function isCorrectAnswer(question: Question, answer: Answer) {
	if (question.answerStatus === AnswerStatus.Unknown) return null;
	const correctChoiceIds = question.choices.filter((choice) => choice.isCorrect).map((choice) => choice.id);
	return (
		answer.choiceIds.length === correctChoiceIds.length &&
		answer.choiceIds.every((choice) => correctChoiceIds.includes(choice))
	);
}
