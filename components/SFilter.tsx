import { useState } from "react";
import { Stack, Tooltip } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BlenderIcon from "@mui/icons-material/Blender";
import BatteryIcon from "./BatteryIcon";
import { AnswerStatus, QuestionFilter, ScoreInterval } from "interfaces";

interface SFilterProps {
	handleSort: Function;
	handleFilter: Function;
}

export default function SFilter({ handleSort, handleFilter }: SFilterProps) {
	const [filters, setFilters] = useState<string[]>(() => []);

	const scoreIntervals: ScoreInterval[] = [
		{
			minScore: 0,
			maxScore: 1,
		},
		{
			minScore: 1,
			maxScore: 30,
		},
		{
			minScore: 30,
			maxScore: 50,
		},
		{
			minScore: 50,
			maxScore: 70,
		},
		{
			minScore: 70,
			maxScore: 90,
		},
		{
			minScore: 90,
			maxScore: 100,
		},
	];

	const handleFilters = (event: React.MouseEvent<HTMLElement>, newFilters: string[]) => {
		setFilters(newFilters);
		handleFilter(newFilters.map((filter) => JSON.parse(filter))) as QuestionFilter;
	};

	return (
		<Stack spacing={1}>
			<Stack direction="row" flexGrow={1}>
				<ToggleButton value="bold" fullWidth onClick={() => handleSort(true)}>
					<Tooltip title="sort asc">
						<ExpandLessIcon fontSize="small" />
					</Tooltip>
				</ToggleButton>
				<ToggleButton value="bold" fullWidth onClick={() => handleSort(false)}>
					<Tooltip title="sort desc">
						<ExpandMoreIcon fontSize="small" />
					</Tooltip>
				</ToggleButton>
				<ToggleButton value="bold" fullWidth onClick={() => handleSort(null)}>
					<Tooltip title="shuffle">
						<BlenderIcon fontSize="small" />
					</Tooltip>
				</ToggleButton>
			</Stack>
			<Stack>
				<ToggleButtonGroup value={filters} onChange={handleFilters}>
					{scoreIntervals.map((interval, index) => (
						<ToggleButton
							key={index.toString()}
							value={JSON.stringify({ ...interval, answerStatus: AnswerStatus.Known })}
							sx={{ flexGrow: 1 }}
						>
							<BatteryIcon score={interval.minScore} answerStatus={AnswerStatus.Known} />
						</ToggleButton>
					))}
				</ToggleButtonGroup>
				<ToggleButtonGroup value={filters} onChange={handleFilters}>
					{scoreIntervals.map((interval, index) => (
						<ToggleButton
							key={index.toString()}
							value={JSON.stringify({ ...interval, answerStatus: AnswerStatus.Guessed })}
							sx={{ flexGrow: 1 }}
						>
							<BatteryIcon score={interval.minScore} answerStatus={AnswerStatus.Guessed} />
						</ToggleButton>
					))}
				</ToggleButtonGroup>
				<ToggleButtonGroup value={filters} onChange={handleFilters}>
					<ToggleButton
						value={JSON.stringify({
							minScore: 0,
							maxScore: 1,
							answerStatus: AnswerStatus.Unknown,
						})}
					>
						<BatteryIcon score={0} answerStatus={AnswerStatus.Unknown} />
					</ToggleButton>
					<ToggleButton
						value={JSON.stringify({
							minScore: null,
							maxScore: null,
							answerStatus: AnswerStatus.Unknown,
						})}
						sx={{ flexGrow: 1 }}
					>
						<BatteryIcon score={null} answerStatus={AnswerStatus.Unknown} />
					</ToggleButton>
				</ToggleButtonGroup>
			</Stack>
		</Stack>
	);
}
