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
import { useThemeMode } from "../contexts/ThemeContext";
import weatherIllustration from "../assets/Frame 10.png";

const Login: React.FC = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const muiTheme = useTheme();
  const { theme } = useThemeMode();
  const mode: "light" | "dark" = theme === "dark" ? "dark" : "light";

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
        backgroundColor:
          mode === "dark" ? "#151D32" : muiTheme.palette.background.default,
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
              mode === "dark" ? "#151D32" : muiTheme.palette.background.paper,
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
              color:
                mode === "dark"
                  ? "#292F45 !important"
                  : muiTheme.palette.text.primary,
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
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor:
                    mode === "light"
                      ? "#fff"
                      : muiTheme.palette.background.default,
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
                backgroundColor: muiTheme.palette.primary.main,
                color: muiTheme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: muiTheme.palette.primary.dark,
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
            flex: 0.99,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "stretch",
            p: 0,
            minHeight: { xs: 300, md: 500 },
            backgroundColor:
              mode === "dark"
                ? "#151D32"
                : mode === "light"
                ? "#e3f2fd"
                : muiTheme.palette.background.default,
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
