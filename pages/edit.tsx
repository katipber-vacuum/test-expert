import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { AnswerStatus, DraftQuestion, Question } from "interfaces";
import { getQuestions, saveQuestion, deleteQuestion } from "utils/client";
import QForm from "components/QForm";
import QSearchBar from "components/QSearchBar";

export default function Edit() {
	const [questions, setQuestions] = useState<(DraftQuestion | Question)[]>([]);
	const [filteredQuestions, setFilteredQuestions] = useState<(DraftQuestion | Question)[]>([]);
	const [filter, setFilter] = useState<string>("");

	const handleDeleteQuestion = async (deletedQuestion: DraftQuestion) => {
		deletedQuestion.id && (await deleteQuestion(deletedQuestion as Question));

		const newQuestions = questions.filter((question) => question !== deletedQuestion);
		setQuestions(newQuestions);
	};

	const handleSaveQuestion = async (updatedQuestion: DraftQuestion) => {
		saveQuestion(updatedQuestion).then((savedQuestion) => {
			const newQuestions = questions.map((question) => (question.id === updatedQuestion.id ? savedQuestion : question));
			setQuestions(newQuestions);
		});
	};

	const handleSetFilter = (filter: string) => {
		const newFilter = filter.toLowerCase();
		setFilter(newFilter);
	};

	useEffect(() => {
		const ids = filter
			.split(" ")
			.map((f) => +f)
			.filter((id) => !isNaN(id));
		const newFilteredQuestions = questions.filter(
			(question) =>
				question.id === undefined ||
				ids.includes(question.id) ||
				(filter && filter.length > 3 && question.text.toLocaleLowerCase().includes(filter))
		);
		setFilteredQuestions(newFilteredQuestions);
	}, [questions, filter]);

	useEffect(() => {
		const initQuestions = async () => {
			const questions = await getQuestions();
			setQuestions(questions);
		};

		initQuestions().catch(console.error);
	}, []);

	return (
		<Stack spacing={2} sx={{ p: 4 }}>
			<Stack direction="row" spacing={2}>
				<Button
					variant="contained"
					color="success"
					onClick={() => {
						const newQuestion: DraftQuestion = {
							choiceType: "single",
							answerStatus: AnswerStatus.Guessed,
							text: "",
							choices: [],
							notes: "",
							noteLinks: [],
						};
						setQuestions([newQuestion, ...questions]);
					}}
				>
					add question
				</Button>
				<QSearchBar setFilter={handleSetFilter} />
			</Stack>
			<div>
				{filteredQuestions?.map((question, index) => (
					<QForm
						key={index.toString()}
						question={question}
						deleteQuestion={handleDeleteQuestion}
						saveQuestion={handleSaveQuestion}
					/>
				))}
			</div>
		</Stack>
	);
}
