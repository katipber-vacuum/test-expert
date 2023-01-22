import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";

interface LinkTabProps {
	label: string;
	href: string;
}

function LinkTab(props: LinkTabProps) {
	return (
		<Tab
			component="a"
			onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
				event.preventDefault();
			}}
			{...props}
		/>
	);
}

export default function Nav() {
	const tabs: LinkTabProps[] = [
		{
			label: "study",
			href: "/",
		},
		{
			label: "edit",
			href: "/edit",
		},
	];

	const router = useRouter();
	const [value, setValue] = React.useState(
		tabs.reduce<number>((prev, curr, idx) => (curr.href == router.route ? idx : prev), -1)
	);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		router.push((event.target as HTMLLinkElement).href);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Tabs value={value} onChange={handleChange}>
				{tabs.map((tab: LinkTabProps) => (
					<LinkTab key={tab.label} label={tab.label} href={tab.href} />
				))}
			</Tabs>
		</Box>
	);
}
