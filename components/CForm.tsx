import { Checkbox, IconButton, Stack, TextField } from "@mui/material";
import { Choice, DraftChoice } from "interfaces";
import DeleteIcon from "@mui/icons-material/Delete";

interface CFormProps {
	choices: (DraftChoice | Choice)[];
	choice: DraftChoice | Choice;
	index: number;
	setChoices: Function;
}

export default function CForm({ choices, choice, index, setChoices }: CFormProps) {
	return (
		<Stack direction="row" spacing={1}>
			<IconButton
				onClick={() => {
					setChoices(choices.filter((c) => c !== choice));
				}}
			>
				<DeleteIcon />
			</IconButton>
			<TextField
				label={index + 1}
				value={choice.text}
				onChange={({ target }) => {
					setChoices(
						choices.map((c) => {
							return c === choice ? { ...c, text: target.value } : c;
						})
					);
				}}
				multiline
				sx={{ flex: 1 }}
			/>
			<Checkbox
				checked={choice.isCorrect}
				onChange={({ target }) => {
					setChoices(
						choices.map((c) => {
							return c === choice ? { ...c, isCorrect: target.checked } : c;
						})
					);
				}}
			/>
		</Stack>
	);
}
