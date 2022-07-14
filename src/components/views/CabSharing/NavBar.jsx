import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { NewBookingDialog } from "./NewBookingDialog";
import { useState } from "react";

const places = ["IITH", "RGIA", "Secunderabad Railway Station", "Lingampally"];

export function NavBar() {
  const [value, setValue] = useState(new Date());
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Community Portal
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                justifyContent: "center",
                marginRight: "300px",
              }}
            >
              Cab Sharing
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: 3,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ display: "flex" }}>
          <NewBookingDialog />
          <Button variant="contained">My Bookings</Button>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Time"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  sx={{
                    width: "175px",
                  }}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={places}
            sx={{ width: "300px", marginTop: "20px" }}
            renderInput={(params) => <TextField {...params} label="From" />}
          />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={places}
            sx={{ width: "300px", marginTop: "20px" }}
            renderInput={(params) => <TextField {...params} label="To" />}
          />
        </Stack>
      </Stack>
    </>
  );
}
