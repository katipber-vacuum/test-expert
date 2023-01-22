import { Answer, DraftAnswer, StudyQuestion } from "interfaces";
import { shuffle } from "lodash";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect, useState } from "react";
import { Checkbox, FormGroup } from "@mui/material";

interface SChoicessProps {
	question: StudyQuestion;
	answer?: DraftAnswer | Answer;
	setAnswer: Function;
	isLocked: boolean;
}

export default function Schoices({ question, answer, setAnswer, isLocked }: SChoicessProps) {
	const [choices, setChoices] = useState(question.choices);

	const colorAnswers = isLocked && question.answerStatus !== "unknown";

	useEffect(() => {
		setChoices(shuffle(question.choices));
	}, [question.id]);

	return question.choiceType === "single" ? (
		<RadioGroup
			value={answer && answer.choiceIds.length ? answer.choiceIds[0] : null}
			sx={{ ml: 4 }}
			onChange={({ target }) => {
				if (!isLocked) {
					const newAnswer: DraftAnswer = {
						questionId: question.id,
						choiceIds: [+target.value],
						time: new Date(),
					};
					setAnswer(newAnswer);
				}
			}}
		>
			{choices.map((choice) => (
				<FormControlLabel
					key={choice.id.toString()}
					value={choice.id}
					control={<Radio />}
					label={choice.text}
					sx={{
						color: colorAnswers ? (choice.isCorrect ? "green" : "red") : "inherit",
						mb: 2,
					}}
				/>
			))}
		</RadioGroup>
	) : (
		<FormGroup sx={{ ml: 4 }}>
			{choices.map((choice) => (
				<FormControlLabel
					key={choice.id.toString()}
					value={choice.id}
					control={
						<Checkbox
							key={choice.id.toString()}
							checked={answer ? answer.choiceIds.includes(choice.id) : false}
							onChange={({ target }) => {
								if (!isLocked) {
									const newAnswer: DraftAnswer = { ...answer! };

									if (target.checked && !newAnswer.choiceIds.includes(choice.id)) {
										newAnswer.choiceIds = [...newAnswer.choiceIds, choice.id];
									} else if (!target.checked && newAnswer.choiceIds.includes(choice.id)) {
										newAnswer.choiceIds = newAnswer.choiceIds.filter((id) => id !== choice.id);
									}

									setAnswer(newAnswer);
								}
							}}
						/>
					}
					label={choice.text}
					sx={{
						color: colorAnswers ? (choice.isCorrect ? "green" : "red") : "inherit",
						mb: 2,
					}}
				/>
			))}
		</FormGroup>
	);
}
