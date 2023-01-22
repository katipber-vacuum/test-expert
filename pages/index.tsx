import { AnswerStatus, DraftAnswer, QuestionFilter, StudyQuestion } from "interfaces";
import { getStats } from "utils/scoring";
import { getQuestions, saveAnswer } from "utils/client";
import { Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import Box from "@mui/material/Box";
import SButton from "components/SButton";
import SPaper from "components/SPaper";
import SFilter from "components/SFilter";

interface StudyProps {
	questions: StudyQuestion[];
}

export default function Study(props: StudyProps) {
	const [questions, setQuestions] = useState(props.questions);
	const [filteredQuestions, setFilteredQuestions] = useState(props.questions);
	const [selectedQuestion, setSelectedQuestion] = useState(props.questions && props.questions[0]);
	const [filters, setFilters] = useState<QuestionFilter[]>(() => []);

	const submitAnswer = async (answer: DraftAnswer) => {
		await saveAnswer(answer);

		const newStats = await getStats(selectedQuestion);
		const newQuestion = { ...selectedQuestion, stats: newStats };
		const newQuestions = questions.map((question) => (question.id === selectedQuestion.id ? newQuestion : question));

		setQuestions(newQuestions);
		setFilteredQuestions(applyFilters(newQuestions, filters));
		setSelectedQuestion(newQuestion);
	};

	const handleNextQuestion = () => {
		const nextIndex = (filteredQuestions.indexOf(selectedQuestion) + 1) % filteredQuestions.length;
		handleSelectQuestion(filteredQuestions[nextIndex]);
	};

	const handleSelectQuestion = (newQuestion: StudyQuestion) => {
		if (newQuestion === selectedQuestion) return;

		const newQuestions = filteredQuestions.map((question) =>
			question === selectedQuestion ? { ...selectedQuestion } : question
		);

		setFilteredQuestions(newQuestions);
		setSelectedQuestion(newQuestion);
	};

	const handleSort = (asc: boolean | null) => {
		if (asc === null) {
			const shuffledQuestions = shuffle(questions);
			setQuestions(shuffledQuestions);
			setFilteredQuestions(applyFilters(shuffledQuestions, filters));
		} else {
			const newQuestions = [...questions];
			newQuestions.sort((a, b) => (asc ? a.id - b.id : b.id - a.id));
			setQuestions(newQuestions);
			setFilteredQuestions(applyFilters(newQuestions, filters));
		}
	};

	const handleFilter = (filters: QuestionFilter[]) => {
		setFilters(filters);
		setFilteredQuestions(applyFilters(questions, filters));
	};

	const applyFilters = (questions: StudyQuestion[], filters: QuestionFilter[]) => {
		const newQuestions = filters.reduce<StudyQuestion[]>(
			(prev, curr) =>
				prev.filter((question) => {
					if (curr.answerStatus === AnswerStatus.Unknown) {
						if (curr.minScore === null)
							return (question.answerStatus !== AnswerStatus.Unknown || question.stats.score !== null) && question;
						return (question.answerStatus !== AnswerStatus.Unknown || question.stats.score !== 0) && question;
					}
					return (
						(question.answerStatus !== curr.answerStatus ||
							question.stats.score! < curr.minScore! ||
							question.stats.score! >= curr.maxScore!) &&
						question
					);
				}),
			questions
		);
		return newQuestions;
	};

	useEffect(() => {
		const initQuestions = async () => {
			const questions = await getQuestions();

			const studyQuestions: StudyQuestion[] = await Promise.all(
				questions.map(async (question) => {
					const stats = await getStats(question);
					return { ...question, id: question.id!, stats: stats };
				})
			);
			setQuestions(studyQuestions);
			setFilteredQuestions(studyQuestions);
			if (studyQuestions.length) setSelectedQuestion(studyQuestions[0]);
		};
		initQuestions().catch(console.error);
	}, []);

	return (
		<Grid container spacing={2} p={4}>
			<Grid item style={{ width: "320px" }}>
				<Box marginBottom={2}>
					<SFilter handleSort={handleSort} handleFilter={handleFilter} />
				</Box>
				<Stack maxHeight="65vh" sx={{ border: 1, borderColor: "lightgray", overflow: "auto" }}>
					{filteredQuestions?.map((question, index) => (
						<SButton
							key={index.toString()}
							question={question}
							selectQuestion={handleSelectQuestion}
							isSelected={selectedQuestion === question}
						/>
					))}
				</Stack>
			</Grid>
			{selectedQuestion && (
				<Grid item xs>
					<SPaper question={selectedQuestion} submitAnswer={submitAnswer} skipQuestion={handleNextQuestion} />
				</Grid>
			)}
		</Grid>
	);
}
