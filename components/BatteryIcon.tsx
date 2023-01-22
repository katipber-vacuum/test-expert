import { AnswerStatus } from "interfaces";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import Battery1BarIcon from "@mui/icons-material/Battery1Bar";
import Battery3BarIcon from "@mui/icons-material/Battery3Bar";
import Battery4BarIcon from "@mui/icons-material/Battery4Bar";
import Battery6BarIcon from "@mui/icons-material/Battery6Bar";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import BatteryUnknownIcon from "@mui/icons-material/BatteryUnknown";
import { Tooltip } from "@mui/material";

interface BatteryIconProps {
	score: number | null;
	answerStatus: AnswerStatus;
}

export default function BatteryIcon({ score, answerStatus }: BatteryIconProps) {
	if (answerStatus === AnswerStatus.Unknown) {
		if (score === null)
			return (
				<Tooltip title="Not Scored">
					<BatteryUnknownIcon />
				</Tooltip>
			);
		return (
			<Tooltip title="Not Answered">
				<BatteryAlertIcon />
			</Tooltip>
		);
	}
	if (score! < 1)
		return (
			<Tooltip title="Not Answered">
				<Battery0BarIcon color={answerStatus === "known" ? "error" : "inherit"} />
			</Tooltip>
		);
	if (score! < 30)
		return (
			<Tooltip title="[0-30)">
				<Battery1BarIcon color={answerStatus === "known" ? "error" : "inherit"} />
			</Tooltip>
		);
	if (score! < 50)
		return (
			<Tooltip title="[30-50)">
				<Battery3BarIcon color={answerStatus === "known" ? "warning" : "inherit"} />
			</Tooltip>
		);
	if (score! < 70)
		return (
			<Tooltip title="[50-70)">
				<Battery4BarIcon color={answerStatus === "known" ? "warning" : "inherit"} />
			</Tooltip>
		);
	if (score! < 90)
		return (
			<Tooltip title="[70-90)">
				<Battery6BarIcon color={answerStatus === "known" ? "success" : "inherit"} />
			</Tooltip>
		);
	return (
		<Tooltip title="[90-100)">
			<BatteryFullIcon color={answerStatus === "known" ? "success" : "inherit"} />
		</Tooltip>
	);
}
