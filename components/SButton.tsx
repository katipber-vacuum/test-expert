import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { StudyQuestion } from "interfaces";
import ResultIcon from "./ResultIcon";
import BatteryIcon from "./BatteryIcon";

interface SButtonProps {
	question: StudyQuestion;
	selectQuestion: Function;
	isSelected?: boolean;
}

export default function SButton({ question, selectQuestion, isSelected }: SButtonProps) {
	return (
		<Paper variant="outlined">
			<Button fullWidth sx={{ color: "dimgray" }} onClick={() => selectQuestion(question)}>
				<Stack direction="row" flexGrow={1} justifyContent="space-around" alignItems="center">
					<Typography variant="h6" color={isSelected ? "primary" : "inherit"} fontWeight={"bold"}>
						#{question.id}
					</Typography>
					<Divider orientation="vertical" flexItem />
					<Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
						{question.stats.results.map((result, index) => (
							<ResultIcon key={index.toString()} question={question} result={result} />
						))}
					</Stack>
					<Divider orientation="vertical" flexItem />
					<BatteryIcon score={question.stats.score} answerStatus={question.answerStatus} />
				</Stack>
			</Button>
		</Paper>
	);
}
