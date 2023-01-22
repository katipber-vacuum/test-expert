import { Box, IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface QSearchBarProps {
	setFilter: Function;
}

export default function QSearchBar({ setFilter }: QSearchBarProps) {
	return (
		<Paper
			component="form"
			sx={{ p: "2px 4px", display: "flex", alignItems: "center", flexGrow: 1 }}
			onSubmit={(e: React.SyntheticEvent) => {
				e.preventDefault();
			}}
		>
			<InputBase
				sx={{ ml: 1, flex: 1 }}
				placeholder="Search Questions"
				onChange={({ target }) => setFilter(target.value)}
			/>
			<Box sx={{ mr: 2, p: 1 }}>
				<SearchIcon />
			</Box>
		</Paper>
	);
}
