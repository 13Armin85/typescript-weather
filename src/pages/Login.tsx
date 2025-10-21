import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Paper,
  SelectChangeEvent,
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
      setError(t ? t("login.nameRequired") : "Name is required");
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
        p: 2,
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
          borderRadius: "12px",
          backgroundColor: mode === "dark" ? "#151D32" : undefined,
          color: mode === "dark" ? "#E6E9F2" : undefined,
        }}
      >
        {/* Left Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 6, md: "80px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor:
              mode === "dark" ? "#151D32" : muiTheme.palette.background.paper,
            color: mode === "dark" ? "#E6E9F2" : undefined,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight={600}
            sx={{
              mb: 4,
              textAlign: "center",
              color:
                mode === "dark" ? "#E6E9F2" : muiTheme.palette.text.primary,
            }}
          >
            {t ? t("login.title") ?? "Login" : "Login"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder={
                t
                  ? t("login.namePlaceholder") ?? "Enter Your Name"
                  : "Enter Your Name"
              }
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
                  color: mode === "dark" ? "#E6E9F2" : undefined,
                },
                "& .MuiFormHelperText-root": {
                  color: mode === "dark" ? "#FFB4B4" : undefined,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: mode === "dark" ? "#37435A" : undefined,
                },
              }}
              autoFocus
            />

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
              {t ? t("login") ?? "LOGIN" : "LOGIN"}
            </Button>
          </form>
          <Box
            sx={{
              mt: { xs: 5, md: 7 },
              width: "100%",

              borderBottom:
                mode === "dark"
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(0,0,0,0.25)",
              pb: 1,
              px: { xs: 1, md: 0 },
            }}
          >
            <Typography
              component="div"
              sx={{
                fontSize: "15px",
                lineHeight: 1.2,
                color:
                  mode === "dark"
                    ? "rgba(230,233,242,0.7)"
                    : "rgba(0,0,0,0.54)",
                mb: 1,
                fontWeight: 400,
              }}
            >
              Language
            </Typography>

            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                minHeight: 64,
              }}
            >
              <Select
                value={i18n.language}
                onChange={(e: SelectChangeEvent) =>
                  handleLanguageChange(e.target.value as string)
                }
                variant="filled"
                sx={{
                  width: "100%",
                  backgroundColor: "transparent",
                  "& .MuiSelect-select": {
                    fontSize: "15px",
                    lineHeight: 1,
                    fontWeight: 300,
                    padding: 0,
                    justifyContent: "flex-start",
                    color: mode === "dark" ? "#E6E9F2" : "rgba(0,0,0,0.87)",
                  },
                  "& .MuiSvgIcon-root": {
                    position: "absolute",
                    right: 0,
                    top: "20%",
                    transform: "translateY(-50%)",
                    fontSize: 20,
                    color:
                      mode === "dark"
                        ? "rgba(230,233,242,0.7)"
                        : "rgba(0,0,0,0.54)",
                  },

                  "&:before, &:after": {
                    display: "none",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { mt: 1 },
                  },
                }}
                disableUnderline
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fa">فارسی</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>

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
                ? "#e9f2f8"
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
