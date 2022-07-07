import React, { useState } from "react";
import {
	Button,
	Box,
	Container,
	Typography,
	FormControl,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputLabel,
	TextField,
	MenuItem,
	Select,
	Divider,
	Stack,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const locations = [
	"IIT Hyderabad",
	"RGIA",
	"Secunderabad Railway Station",
	"Lingampally",
];

export function NewBookingDialog() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [date, setDate] = useState(new Date());
	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleFromChange = (event) => {
		setFrom(event.target.value);
	};
	const handleToChange = (event) => {
		setTo(event.target.value);
	};
	const destinations = locations.map((loc, i) => (
		<MenuItem key={i} value={loc}>
			{loc}
		</MenuItem>
	));
	return (
		<>
			<Button variant="contained" onClick={handleDialogOpen} disableElevation>
				Register Booking
			</Button>
			<Dialog open={dialogOpen} onClose={handleDialogClose}>
				<DialogTitle>New booking</DialogTitle>
				<DialogContent>
					<Stack gap={3}>
						Please fill the form to create a new booking. <br />
						Your email address will be automatically associated with your
						booking.
						<FormControl>
							<InputLabel id="new-book-from">From</InputLabel>
							<Select
								value={from}
								label="From"
								labelId="new-book-from"
								onChange={handleFromChange}
							>
								{destinations}
							</Select>
						</FormControl>
						<FormControl>
							<InputLabel id="new-book-to">To</InputLabel>
							<Select
								value={to}
								label="To"
								labelId="new-book-to"
								onChange={handleToChange}
							>
								{destinations}
							</Select>
						</FormControl>{" "}
						<FormControl>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DateTimePicker
									renderInput={(props) => <TextField {...props} />}
									label="Booking Date"
									value={date}
									onChange={(newValue) => {
										setDate(newValue);
									}}
								/>
							</LocalizationProvider>
						</FormControl>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button onClick={handleDialogClose}>Book</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
