import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	Icon,
	Paper,
	Radio,
	RadioGroup,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { AnswerStatus, DraftChoice, DraftQuestion, NoteLink, Question, QuestionBase } from "interfaces";
import { ChangeEvent, useEffect, useState } from "react";
import { cloneDeep, isEqual } from "lodash";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CForm from "./CForm";
import LForm from "./LForm";

interface QFormParams {
	question: DraftQuestion | Question;
	deleteQuestion: Function;
	saveQuestion: Function;
}

export default function QForm({ question, deleteQuestion, saveQuestion }: QFormParams) {
	const { choices: qChoices, ...qBase } = question;
	const [base, setBase] = useState<QuestionBase>(qBase);
	const [choices, setChoices] = useState(cloneDeep(qChoices));

	useEffect(() => {
		setBase(qBase);
		setChoices(qChoices);
	}, [question]);

	const updateBase = ({ target }: ChangeEvent<HTMLInputElement>) => {
		setBase({ ...base, [target.name]: target.value });
	};

	const handleSetLinks = (newNoteLinks: NoteLink[]) => {
		setBase({ ...base, noteLinks: newNoteLinks });
	};

	return (
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: "0px 40px 0px 0px " }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ p: "0px 20px" }}>
					{question.id && isEqual(question, { ...base, choices: choices }) ? (
						<Icon />
					) : (
						<Tooltip title={"Unsaved Data"}>
							<SaveAltIcon color="info" />
						</Tooltip>
					)}
					<Typography variant="h6" fontWeight="bold" marginRight={2}>
						#{base.id}
					</Typography>
					<Typography variant="h6" noWrap width={"70vw"}>
						{base.text}
					</Typography>
				</Stack>
			</AccordionSummary>
			<AccordionDetails>
				<Paper elevation={4} sx={{ p: 4 }}>
					<Stack spacing={2}>
						<FormControl>
							<FormLabel>Choices are ...</FormLabel>
							<RadioGroup name="choiceType" value={base.choiceType} onChange={updateBase} row>
								<FormControlLabel value="single" control={<Radio />} label="Single" />
								<FormControlLabel value="multiple" control={<Radio />} label="Multiple" />
							</RadioGroup>
						</FormControl>

						<FormControl>
							<FormLabel>Answer is ...</FormLabel>
							<RadioGroup name="answerStatus" value={base.answerStatus} onChange={updateBase} row>
								<FormControlLabel value={AnswerStatus.Unknown} control={<Radio />} label="Unknown" />
								<FormControlLabel value={AnswerStatus.Guessed} control={<Radio />} label="Guessed" />
								<FormControlLabel value={AnswerStatus.Known} control={<Radio />} label="Known" />
							</RadioGroup>
						</FormControl>

						<TextField name="text" label="Question" value={base.text} onChange={updateBase} multiline minRows={2} />

						{choices?.map((choice, index) => (
							<CForm key={index.toString()} choices={choices} choice={choice} index={index} setChoices={setChoices} />
						))}

						<Button
							color="secondary"
							onClick={() => {
								const newChoice: DraftChoice = {
									text: "",
									isCorrect: false,
								};
								setChoices([...choices, newChoice]);
							}}
						>
							add choice
						</Button>

						<TextField name="notes" label="Notes" value={base.notes} onChange={updateBase} multiline minRows={4} />

						{base.noteLinks?.map((noteLink, index) => (
							<LForm
								key={index.toString()}
								links={base.noteLinks}
								link={noteLink}
								index={index}
								setLinks={handleSetLinks}
							/>
						))}

						<Button
							color="secondary"
							onClick={() => {
								const newLink: NoteLink = {
									label: "",
									href: "",
								};
								handleSetLinks([...base.noteLinks, newLink]);
							}}
						>
							add link
						</Button>

						<Stack direction="row" spacing={2}>
							<Button
								color="error"
								onClick={() => {
									deleteQuestion(question);
								}}
							>
								delete
							</Button>
							<Button
								color="warning"
								onClick={() => {
									setBase(qBase);
									setChoices(qChoices);
								}}
							>
								reset
							</Button>
							<Button
								onClick={async () => {
									const newQuestion: DraftQuestion = { ...base, choices: choices };
									await saveQuestion(newQuestion);
								}}
								sx={{ flex: 1 }}
							>
								save
							</Button>
						</Stack>
					</Stack>
				</Paper>
			</AccordionDetails>
		</Accordion>
	);
}
