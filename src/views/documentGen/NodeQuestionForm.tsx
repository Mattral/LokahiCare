import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles

interface NodeQuestionFormProps {
  open: boolean;
  onClose: () => void;
  selectionType: "single" | "select1" | "multiSelect";
  onSubmit: (data: any, parentId?: string) => void;
  parentId?: string;  // Optional parentId prop for child nodes
}

const NodeQuestionForm: React.FC<NodeQuestionFormProps> = ({ open, onClose, selectionType, onSubmit, parentId }) => {
  const [question, setQuestion] = useState<string>("");
  const [varName, setVarName] = useState<string>("");
  const [answerType, setAnswerType] = useState<string>("text");
  const [options, setOptions] = useState<string[]>([""]);
  const [condition, setCondition] = useState<string>("");
  const [paragraphInput, setParagraphInput] = useState<string>(""); // State to manage paragraph input for ReactQuill

  useEffect(() => {
    // Reset the state when the modal opens
    setQuestion("");
    setVarName("");
    setAnswerType("text");
    setOptions([""]);
    setCondition("");
    setParagraphInput(""); // Reset paragraph input as well
  }, [open]);

  const handleSubmit = () => {
    if (!question ) {
      alert("Question and Variable Name are required!");
      return;
    }
    const data = {
      question,
      answerType,
      options,
      condition,
      paragraphInput,
    };
    onSubmit(data, parentId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: "#4e73df", color: "#fff", fontWeight: "bold", textAlign: "center", borderRadius: "8px" }}>
        {`Create a  ${selectionType} Node`}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <TextField
          label="Node Name *"
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          margin="normal"
          variant="outlined"
          InputProps={{
            style: { borderRadius: "12px", backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
          }}
        />



        {/* ReactQuill for Paragraph Input */}
        <Box mb={3}>
          <label className="block text-sm font-medium text-gray-700">Node Text</label>
          <ReactQuill
            value={paragraphInput}
            onChange={setParagraphInput} // Updates state as user types
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                [{ 'align': [] }],
                ['blockquote'],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                ['code'],
                [{ 'direction': 'rtl' }],
                ['clean'] // Clean button
              ]
            }}
            formats={[
              'header', 'font', 'list', 'bold', 'italic', 'underline', 'align', 'blockquote', 'script', 'code', 'direction', 'clean'
            ]}
            className="react-quill-editor"
            style={{
              height: "300px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "10px",
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "10px", backgroundColor: "#fff", borderRadius: "0 0 8px 8px" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "8px", padding: "8px 24px", fontWeight: "bold", textTransform: "uppercase", borderColor: "#4e73df", color: "#4e73df" }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: "8px", padding: "8px 24px", fontWeight: "bold", textTransform: "uppercase", backgroundColor: "#4e73df", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)" }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeQuestionForm;


        {/* ToDo: add a text area below for the Node Name description (namely- Node Description)*/}
        {/* ToDo: add a label in the form as another part*/}
        {/* Node human guide WYSISWYG (what you see is what you get) */}