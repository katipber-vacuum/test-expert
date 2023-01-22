import { Checkbox, IconButton, Stack, TextField } from "@mui/material";
import { Choice, DraftChoice, NoteLink } from "interfaces";
import DeleteIcon from "@mui/icons-material/Delete";
import { link } from "fs";

interface LFormProps {
	links: NoteLink[];
	link: NoteLink;
	index: number;
	setLinks: Function;
}

export default function LForm({ links, link, setLinks }: LFormProps) {
	return (
		<Stack direction="row" spacing={1}>
			<IconButton
				onClick={() => {
					setLinks(links.filter((l) => l !== link));
				}}
			>
				<DeleteIcon />
			</IconButton>
			<TextField
				label="Label"
				value={link.label}
				onChange={({ target }) => {
					setLinks(
						links.map((l) => {
							return l === link ? { ...l, label: target.value } : l;
						})
					);
				}}
				multiline
				sx={{ width: "300px" }}
			/>
			<TextField
				label="Href"
				value={link.href}
				onChange={({ target }) => {
					setLinks(
						links.map((l) => {
							return l === link ? { ...l, href: target.value } : l;
						})
					);
				}}
				multiline
				sx={{ flex: 1 }}
			/>
		</Stack>
	);
}
