import { Result, StudyQuestion } from "interfaces";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleIcon from "@mui/icons-material/Circle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface ResultIconProps {
	question: StudyQuestion;
	result: Result;
}

export default function ResultIcon({ question, result }: ResultIconProps) {
	const setColor = question.answerStatus === "known";

	if (result === Result.Empty) return <RadioButtonUncheckedIcon fontSize="small" />;
	if (result === Result.NA) return <CircleIcon fontSize="small" />;
	if (result === Result.False) return <CancelIcon color={setColor ? "error" : "inherit"} fontSize="small" />;
	return <CheckCircleIcon color={setColor ? "success" : "inherit"} fontSize="small" />;
}
