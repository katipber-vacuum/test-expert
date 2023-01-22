import { Answer, Choice, DraftAnswer, DraftChoice, DraftQuestion, Question, QuestionBase } from "interfaces";

const qPath = "http://localhost:3030/questions";
const cPath = "http://localhost:3030/choices";
const aPath = "http://localhost:3333/answers";
const headers = {
	"Content-type": "application/json; charset=UTF-8",
};

export async function getQuestions() {
	const includeChoices = "?_embed=choices";
	const questions: Question[] = await fetch(`${qPath}${includeChoices}`).then((response) => response.json());
	return questions;
}

export async function saveQuestion(question: DraftQuestion) {
	const { choices, ...qBase } = question;

	const newBase = qBase.id ? await updateQuestion(qBase) : await createQuestion(qBase);
	const newChoices = await updateChoices({ ...newBase, choices: choices });

	const newQuestion: Question = { ...newBase, id: newBase.id!, choices: newChoices };
	return newQuestion;
}

export async function deleteQuestion(question: Question) {
	question.choices.forEach(async (choice) => {
		await deleteChoice(choice);
	});

	await fetch(`${qPath}/${question.id}`, {
		method: "DELETE",
	});
}

export async function getAnswers(question: Question) {
	const filterQuestion = `&questionId=${question.id}`;
	const orderDesc = "?_sort=time&_order=desc";
	const limitFive = "&_limit=5";

	const answers: Answer[] = await fetch(`${aPath}${orderDesc}${filterQuestion}${limitFive}`).then((result) =>
		result.json()
	);
	return answers;
}

export async function saveAnswer(answer: DraftAnswer) {
	const aBody = JSON.stringify(answer);
	const newBase: Answer = await fetch(aPath, {
		method: "POST",
		body: aBody,
		headers: headers,
	}).then((response) => response.json());
	return newBase;
}

async function createQuestion(qBase: QuestionBase) {
	const qBody = JSON.stringify(qBase);
	const newBase: QuestionBase = await fetch(qPath, {
		method: "POST",
		body: qBody,
		headers: headers,
	}).then((response) => response.json());
	return newBase;
}

async function updateQuestion(qBase: QuestionBase) {
	const qBody = JSON.stringify(qBase);
	const newBase: QuestionBase = await fetch(`${qPath}/${qBase.id}`, {
		method: "PUT",
		body: qBody,
		headers: headers,
	}).then((response) => response.json());
	return newBase;
}

async function updateChoices(question: DraftQuestion) {
	const newChoices: Choice[] = await Promise.all(
		question.choices.map(async (choice) => {
			const newChoice = choice.id ? await updateChoice(question.id!, choice) : await createChoice(question.id!, choice);
			return newChoice;
		})
	);

	const newChoiceIds = newChoices.map((choice) => choice.id);
	const excludeNewChoices = newChoiceIds.reduce<string>(
		(prev, curr) => `${prev}&id_ne=${curr}`,
		`?questionId=${question.id}`
	);

	const deletedChoices: Choice[] = await fetch(`${cPath}${excludeNewChoices}`).then((response) => response.json());
	deletedChoices.forEach(async (choice) => {
		await deleteChoice(choice);
	});

	return newChoices;
}

async function createChoice(questionId: number, choice: DraftChoice) {
	const body = JSON.stringify({ ...choice, questionId: questionId });
	const newChoice: Choice = await fetch(cPath, {
		method: "POST",
		body: body,
		headers: headers,
	}).then((response) => response.json());
	return newChoice;
}

async function updateChoice(questionId: number, choice: DraftChoice) {
	const body = JSON.stringify({ ...choice, questionId: questionId });
	const newChoice: Choice = await fetch(`${cPath}/${choice.id}`, {
		method: "PUT",
		body: body,
		headers: headers,
	}).then((response) => response.json());
	return newChoice;
}

async function deleteChoice(choice: Choice) {
	await fetch(`${cPath}/${choice.id}`, {
		method: "DELETE",
	});
}
