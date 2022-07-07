import { Box } from "@mui/material";
import { DataTable } from "./DataTable";
import { NavBar } from "./NavBar";

export default function CabSharing() {
	return (
		<>
			<NavBar />
			<Box margin={3}>
				<DataTable />
			</Box>
		</>
	);
}
