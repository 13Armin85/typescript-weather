import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "@mui/material/styles";
// remove useThemeMode to avoid error when ThemeProvider is not mounted
// import { useThemeMode } from "../contexts/ThemeContext";
import weatherIllustration from "../assets/Frame 10.png";

const Login: React.FC = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  // use MUI theme mode as a safe fallback (works even if custom ThemeProvider is commented out)
  const mode = (theme.palette.mode as "light" | "dark") ?? "light";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("login.nameRequired"));
      return;
    }
    login(name.trim());
    navigate("/dashboard");
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // changed: full page background in dark mode
        backgroundColor:
          mode === "dark" ? "#151D32" : theme.palette.background.default,
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: 900,
          width: "100%",
          overflow: "hidden",
          borderRadius: "4px",
          backgroundColor: mode === "dark" ? "#151D32" : undefined,
          // ensure header/text inside Paper uses the requested dark color
          color: mode === "dark" ? "#292F45" : undefined,
        }}
      >
        {/* Left Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            p: "80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor:
              mode === "dark" ? "#151D32" : theme.palette.background.paper,
            // set container text color so children inherit it
            color: mode === "dark" ? "#292F45" : undefined,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight={600}
            sx={{
              mb: 4,
              // force header color (use !important to override any other CSS)
              color:
                mode === "dark"
                  ? "#292F45 !important"
                  : theme.palette.text.primary,
            }}
          >
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              // changed: item colors in dark mode
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor:
                    mode === "light"
                      ? "#fff"
                      : theme.palette.background.default,
                },
                "& .MuiInputBase-input": {
                  color: mode === "dark" ? "#292F45" : undefined,
                },
                "& .MuiFormHelperText-root": {
                  color: mode === "dark" ? "#292F45" : undefined,
                },
                "& .MuiInputLabel-root": {
                  color: mode === "dark" ? "#292F45" : undefined,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: mode === "dark" ? "#292F45" : undefined,
                },
              }}
              autoFocus
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={i18n.language}
                label="Language"
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fa">فارسی</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "uppercase",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              LOGIN
            </Button>
          </form>
        </Box>

        {/* Right Side - Weather Illustration */}
        <Box
          sx={{
            flex: 0.99, // افزایش عرض بخش تصویر (نسبت به فرم)
            display: "flex",
            alignItems: "stretch",
            justifyContent: "stretch",
            p: 0,
            minHeight: { xs: 300, md: 500 },
            // changed: right box background in dark mode
            backgroundColor:
              mode === "dark"
                ? "#151D32"
                : mode === "light"
                ? "#e3f2fd"
                : theme.palette.background.default,
          }}
        >
          <Box
            component="img"
            src={weatherIllustration}
            alt="Weather Illustration"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
