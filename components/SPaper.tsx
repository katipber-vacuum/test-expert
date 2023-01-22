import { useEffect, useState } from "react";
import { Alert, Box, Button, Divider, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { StudyQuestion, Answer, Question, DraftAnswer } from "interfaces";
import { isCorrectAnswer } from "utils/scoring";
import Schoices from "./SChoices";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function getFeedback(question: Question, answer: Answer) {
	const isCorrect = isCorrectAnswer(question, answer);

	if (isCorrect === null)
		return (
			<Alert severity="info" sx={{ flexGrow: 1 }}>
				Question answered!
			</Alert>
		);
	if (!isCorrect)
		return (
			<Alert severity="error" sx={{ flexGrow: 1 }}>
				Wrong answer!
			</Alert>
		);
	return (
		<Alert severity="success" sx={{ flexGrow: 1 }}>
			Correct answer!
		</Alert>
	);
}

interface SPaperProps {
	question: StudyQuestion;
	submitAnswer: Function;
	skipQuestion: Function;
}

export default function SPaper({ question, submitAnswer, skipQuestion }: SPaperProps) {
	const [answer, setAnswer] = useState<DraftAnswer | Answer>();
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSkipQuestion = () => {
		setAnswer(undefined);
		setIsSubmitted(false);
		skipQuestion();
	};

	useEffect(() => {
		question.choiceType === "single"
			? setAnswer(undefined)
			: setAnswer({
					questionId: question.id,
					choiceIds: [],
					time: new Date(),
			  });
		setIsSubmitted(false);
	}, [question.id]);

	return question ? (
		<Paper sx={{ p: 8 }}>
			<Stack spacing={2}>
				<Stack direction="row" spacing={2} marginBottom={4}>
					<Typography fontWeight="bold">#{question.id}</Typography>
					<Typography>{question.text}</Typography>
				</Stack>

				<Box>
					<Schoices question={question} answer={answer} setAnswer={setAnswer} isLocked={isSubmitted} />
				</Box>

				<Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
					{!isSubmitted && (
						<Button variant="outlined" onClick={handleSkipQuestion}>
							skip
						</Button>
					)}
					{!isSubmitted && (
						<Button
							variant="contained"
							disabled={answer === undefined}
							onClick={async () => {
								await submitAnswer(answer);
								setIsSubmitted(true);
							}}
						>
							submit
						</Button>
					)}
					{isSubmitted && getFeedback(question, answer as Answer)}
					{isSubmitted && (
						<Button variant="contained" onClick={handleSkipQuestion}>
							next
						</Button>
					)}
				</Stack>
				<Divider />
				<div>
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography fontWeight="bold">Notes & Links</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<TextField name="notes" value={question.notes} fullWidth multiline minRows={4} />
							<Stack spacing={1} padding={4}>
								{question.noteLinks?.map((noteLink, index) => (
									<Link
										key={index.toString()}
										href={noteLink.href}
										variant="subtitle1"
										target="_blank"
										underline="none"
									>
										<Stack direction="row" spacing={1}>
											<Typography>{noteLink.label}</Typography>
											<OpenInNewIcon fontSize="small" />
										</Stack>
									</Link>
								))}
							</Stack>
						</AccordionDetails>
					</Accordion>
				</div>
			</Stack>
		</Paper>
	) : (
		<></>
	);
}
