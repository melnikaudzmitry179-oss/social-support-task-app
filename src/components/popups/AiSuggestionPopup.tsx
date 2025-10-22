import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
 Alert,
  TextField,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface AiSuggestionPopupProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  editableSuggestion: string;
  setEditableSuggestion: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  aiError: string | null;
}

const AiSuggestionPopup: React.FC<AiSuggestionPopupProps> = ({
  open,
  onClose,
  onAccept,
  editableSuggestion,
  setEditableSuggestion,
  isGenerating,
  aiError,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "400px", maxHeight: "70vh" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {t("situationDescriptionsForm.aiSuggestion")}
        <IconButton
          aria-label={t("situationDescriptionsForm.close")}
          onClick={onClose}
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {aiError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {aiError}
          </Alert>
        ) : null}
        {isGenerating ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TextField
            fullWidth
            multiline
            rows={6}
            value={editableSuggestion}
            onChange={(e) => setEditableSuggestion(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: {
                fontSize: "1rem",
                lineHeight: 1.6,
              }
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ mr: 1, ml: 1 }}
        >
          {t("situationDescriptionsForm.discard")}
        </Button>
        <Button
          onClick={onAccept}
          variant="contained"
          color="primary"
          sx={{ ml: 1, mr: 1 }}
        >
          {t("situationDescriptionsForm.accept")}
        </Button>
      </DialogActions>
    </Dialog>
 );
};

export default AiSuggestionPopup;