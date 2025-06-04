"use client"
import React from 'react';
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; 

const InterviewQuestions = () => {
  const location = useLocation();       // ✅ get the location
  const navigate = useNavigate();       // ✅ needed to redirect
  const testId = location.state?.testId; // ✅ retrieve the testId from state

  // ✅ Redirect if testId is not present
  useEffect(() => {
    if (!testId) {
      alert("No test ID found. Redirecting to test creation page.");
      navigate("/importform"); // update if your test creation route is different
    }
  }, [testId, navigate]);
  const [formData, setFormData] = useState({
    sectionName: "",
    sectionType: "",
    timeLimit: "20",
    marksPerQuestion: "10",
    interviewDuration: "20",
  })

  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "text",
      text: "What professional skills do you have for Sales Executive positions?",
      direction: "skill",
      options: [],
      correctAnswer: "",
      videoTime: 60,
      audioTime: 60,
      passageText: "",
    },
    {
      id: 2,
      type: "multiple-choice",
      text: "Which of the following sales related work experience do you have?",
      direction: "ability",
      options: ["B2B Sales", "Retail Sales", "Account Management", "Inside Sales"],
      correctAnswer: "1",
      videoTime: 60,
      audioTime: 60,
      passageText: "",
    },
  ])

  const [jobInfo, setJobInfo] = useState(null)

  useEffect(() => {
    loadJobInfo()
    loadSavedData()
  }, [])

  useEffect(() => {
    saveFormData()
  }, [formData, questions])

  const loadJobInfo = () => {
    const importJobData = localStorage.getItem("importJobData")
    if (importJobData) {
      try {
        const jobData = JSON.parse(importJobData)
        setJobInfo(jobData)

        // Auto-populate section name if empty
        if (!formData.sectionName && jobData.jobTitle) {
          setFormData((prev) => ({
            ...prev,
            sectionName: `${jobData.jobTitle} Assessment`,
          }))}

        // Auto-populate section type based on department
        if (!formData.sectionType && jobData.department) {
          const dept = jobData.department.toLowerCase()
          let sectionType = "experience"

          if (dept.includes("sales") || dept.includes("marketing")) {
            sectionType = "experience"
          } else if (dept.includes("engineering") || dept.includes("develop") || dept.includes("it")) {
            sectionType = "technical"
          } else if (dept.includes("hr") || dept.includes("manage")) {
            sectionType = "behavioral"
          } else if (dept.includes("design") || dept.includes("product")) {
            sectionType = "technical"
          }

          setFormData((prev) => ({
            ...prev,
            sectionType,
          }))
        }

        // Auto-populate first question based on job data
        if (jobData.jobTitle && questions[0] && !questions[0].text.trim()) {
          setQuestions((prev) =>
            prev.map((q, index) =>
              index === 0
                ? { ...q, text: `What professional skills do you have for ${jobData.jobTitle} positions?`}
                : q,
            ),
          )
        }
      } catch (error) {
        console.error("Error parsing job data:", error)
      }
    }
  }

  const loadSavedData = () => {
    const savedData = localStorage.getItem("interviewFormData")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setFormData({
          sectionName: data.sectionName || "",
          sectionType: data.sectionType || "",
          timeLimit: data.timeLimit || "20",
          marksPerQuestion: data.marksPerQuestion || "10",
          interviewDuration: data.interviewDuration || "20",
        })

        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
        }
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
  }

  const saveFormData = () => {
    const dataToSave = {
      ...formData,
      questions: questions,
    }
    localStorage.setItem("interviewFormData", JSON.stringify(dataToSave))
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, " ")
  }

  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleQuestionChange = (questionId, field, value) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)))
  }

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      type: "text",
      text: "",
      direction: "skill",
      options: [],
      correctAnswer: "",
      videoTime: 60,
      audioTime: 60,
      passageText: "",
    }
    setQuestions((prev) => [...prev, newQuestion])
  }

  const deleteQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions((prev) => {
        const filtered = prev.filter((q) => q.id !== questionId)
        return filtered.map((q, index) => ({ ...q, id: index + 1 }))
      })
    } else {
      alert("You must have at least one question.")
    }
  }

  const addOption = (questionId) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, options: [...q.options, ""] } : q)))
  }

  const removeOption = (questionId, optionIndex) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, index) => index !== optionIndex),
              correctAnswer:
                q.correctAnswer > optionIndex ? (Number.parseInt(q.correctAnswer) - 1).toString() : q.correctAnswer,
            }
          : q,
      ),
    )
  }

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, index) => (index === optionIndex ? value : opt)),
            }
          : q,
      ),
    )
  }
  
  // CSV Import Functions
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.toLowerCase().endsWith(".csv")) {
        alert("Please upload a valid CSV file (.csv).");
        event.target.value = null; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target.result;
          parseAndAddQuestionsFromCSV(csvText);
        } catch (error) {
          console.error("Error processing CSV file:", error);
          alert("An error occurred while processing the CSV file. Please check the console for details.");
        } finally {
          if (event.target) event.target.value = null; // Reset file input after processing
        }
      };
      reader.onerror = () => {
        alert("Error reading the CSV file.");
        if (event.target) event.target.value = null;
      };
      reader.readAsText(file);
    }
  };

  const parseAndAddQuestionsFromCSV = (csvText) => {
    // CSV Columns (0-indexed):
    // 0: Question Text (Required)
    // 1: Type (text, multiple-choice, fill-in-blanks, video, audio, passage) - Default: "text"
    // 2: Direction (skill, ability, personality, language, experience) - Default: "skill"
    // 3: Options (For multiple-choice only. Semicolon-separated, e.g., "Yes;No;Maybe")
    // 4: Correct Answer (For multiple-choice: 1-based index or exact option text. For fill-in-blanks: the answer text.)
    // 5: Video Time (For video type. Seconds, 10-300) - Default: 60
    // 6: Audio Time (For audio type. Seconds, 10-300) - Default: 60
    // 7: Passage Text (For passage type)

    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0) {
      alert("CSV file is empty.");
      return;
    }

    const newQuestionsFromCSV = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const cells = line.split(/,(?=(?:(?:[^"]"){2})[^"]*$)/).map(cell => {
        let c = cell.trim();
        if (c.startsWith('"') && c.endsWith('"')) {
          c = c.slice(1, -1).replace(/""/g, '"');
        }
        return c;
      });

      const questionText = cells[0] || "";
      if (!questionText.trim()) {
        console.warn(`Skipping CSV line ${i + 1}: Question text is empty.`);
        continue;
      }

      let type = (cells[1] || "text").toLowerCase().trim();
      const validTypes = ["text", "multiple-choice", "fill-in-blanks", "video", "audio", "passage"];
      if (!validTypes.includes(type)) type = "text";

      let direction = (cells[2] || "skill").toLowerCase().trim();
      const validDirections = ["skill", "ability", "personality", "language", "experience"];
      if (!validDirections.includes(direction)) direction = "skill";
      
      let options = [];
      if (type === "multiple-choice") {
        if (cells[3]) {
          options = cells[3].split(';').map(opt => opt.trim()).filter(opt => opt);
        }
        if (options.length === 0) options = ["", ""]; 
        else if (options.length === 1) options.push("");
      }

      let correctAnswer = cells[4] || "";
      if (type === "multiple-choice") {
          if (options.length > 0 && correctAnswer.trim() !== "") {
              const caInput = correctAnswer.trim();
              const caIndex = parseInt(caInput, 10);
              if (!isNaN(caIndex) && caIndex >= 1 && caIndex <= options.length) {
                  correctAnswer = caIndex.toString();
              } else {
                  const foundIndex = options.findIndex(opt => opt.toLowerCase() === caInput.toLowerCase());
                  if (foundIndex !== -1) {
                      correctAnswer = (foundIndex + 1).toString();
                  } else {
                      correctAnswer = ""; 
                  }
              }
          } else {
               correctAnswer = "";
          }
      }

      const videoTimeRaw = parseInt(cells[5], 10);
      const videoTime = isNaN(videoTimeRaw) ? 60 : Math.max(10, Math.min(300, videoTimeRaw));

      const audioTimeRaw = parseInt(cells[6], 10);
      const audioTime = isNaN(audioTimeRaw) ? 60 : Math.max(10, Math.min(300, audioTimeRaw));
      
      const passageText = type === "passage" ? (cells[7] || "") : "";

      newQuestionsFromCSV.push({
        type: type,
        text: questionText,
        direction: direction,
        options: options,
        correctAnswer: correctAnswer,
        videoTime: videoTime,
        audioTime: audioTime,
        passageText: passageText,
      });
    }

    if (newQuestionsFromCSV.length > 0) {
      setQuestions(prevQuestions => {
        const combinedQuestions = [...prevQuestions, ...newQuestionsFromCSV];
        return combinedQuestions.map((q, index) => ({ ...q, id: index + 1 }));
      });
      alert(`${newQuestionsFromCSV.length} question(s) imported successfully from CSV.`);
    } else {
      alert("No valid questions found in the CSV to import, or the file was empty/malformed.");
    }
  };


  const clearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data? This action cannot be undone.")) {
      localStorage.removeItem("interviewFormData")
      // Reset state to initial defaults instead of just reloading
      setFormData({
        sectionName: "",
        sectionType: "",
        timeLimit: "20",
        marksPerQuestion: "10",
        interviewDuration: "20",
      });
      setQuestions([ // Reset to initial default questions or an empty array if preferred
         {
            id: 1, type: "text", text: "", direction: "skill", options: [], correctAnswer: "",
            videoTime: 60, audioTime: 60, passageText: "",
          },
      ]);
      setJobInfo(null); // Clear job info as well
      loadJobInfo(); // Try to reload job info to auto-populate if available
      alert("Form data has been cleared successfully.")
      // window.location.reload(); // Reloading might be simpler but loses any non-persisted state
    }
  }
  /*const clearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data? This action cannot be undone.")) {
      localStorage.removeItem("interviewFormData")
      alert("Form data has been cleared successfully.")
      window.location.reload()
    }
  }*/

  const validateForm = () => {
    if (!formData.sectionName.trim()) {
      alert("Please enter a section name.")
      return false
    }

    if (!formData.sectionType) {
      alert("Please select a section type.")
      return false
    }

    if (!formData.timeLimit || formData.timeLimit < 1) {
      alert("Please enter a valid time limit.")
      return false
    }

    if (!formData.marksPerQuestion || formData.marksPerQuestion < 1) {
      alert("Please enter valid marks per question.")
      return false
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]

      if (!question.text.trim()) {
        alert(`Please enter text for Question ${i + 1}.`)
        return false
      }

      if (question.type === "multiple-choice") {
        if (question.options.length < 2) {
          alert(`Question ${i + 1} must have at least 2 options.`)
          return false
        }

        for (let j = 0; j < question.options.length; j++) {
          if (!question.options[j].trim()) {
            alert(`Please enter text for Option ${String.fromCharCode(65 + j)} in Question ${i + 1}.`)
            return false
          }
        }

        if (!question.correctAnswer) {
          alert(`Please select a correct answer for Question ${i + 1}.`)
          return false
        }
      } else if (question.type === "fill-in-blanks") {
        if (!question.correctAnswer.trim()) {
          alert(`Please enter a correct answer for Question ${i + 1}.`)
          return false
        }
      } else if (question.type === "passage") {
        if (!question.passageText.trim()) {
          alert(`Please enter passage text for Question ${i + 1}.`)
          return false
        }
      }
    }

    if (!formData.interviewDuration || formData.interviewDuration < 1) {
      alert("Please enter a valid interview duration.")
      return false
    }

    return true
  }

/*const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const accessToken = sessionStorage.getItem("access_token");
  console.log("Access Token:", accessToken);

  try {
    // 1. Create Section
    const sectionPayload = {
      test: parseInt(testId), 
      section_name: formData.sectionName,
      section_type: formData.sectionType,
      time_limit: parseInt(formData.timeLimit),
      marks_per_question: parseInt(formData.marksPerQuestion),
      interview_duration: parseInt(formData.interviewDuration),
    };

    const sectionRes = await fetch(
      "http://localhost:8000/api/test-creation/sections/create/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(sectionPayload),
      }
    );

    if (!sectionRes.ok) {
      const errorText = await sectionRes.text();
      throw new Error(`Section creation failed: ${sectionRes.status} - ${errorText}`);
    }

    const sectionData = await sectionRes.json();
    const sectionId = sectionData.id;
    console.log("Section created with ID:", sectionId);

    // 2. Create Questions one by one
    for (const q of questions) {
const questionPayload = {
  section: sectionId,
  type: q.type,
  text: q.text || "",            // always send string, default empty if undefined
  direction: q.direction,                 // must always be valid string (dropdown selection)
  video_time: q.videoTime || 60,          // default to 60 if missing
  audio_time: q.audioTime || 60,          // default to 60 if missing

  // Only send correct_answer if question type is fill-in-the-blank, else send empty string
  correct_answer: q.type === "fill-in-the-blank" ? (q.correctAnswer || "") : "",

  // Only send passage_text if question type is passage, else send empty string
  passage_text: q.type === "passage" ? (q.passageText || "") : "",
};
      const questionRes = await fetch(
        "http://localhost:8000/api/test-creation/questions/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(questionPayload),
        }
      );

      if (!questionRes.ok) {
        const errorText = await questionRes.text();
        throw new Error(`Question creation failed: ${questionRes.status} - ${errorText}`);
      }

      const questionData = await questionRes.json();
      const questionId = questionData.id;
      console.log(`Question created with ID: ${questionId}`);

      // 3. Create options if multiple choice
    if (q.type === "mcq" && Array.isArray(q.options)) {
  const optionLabels = ["A", "B", "C", "D"]; // or dynamically generate if needed
  for (const [index, optText] of q.options.entries()) {
    const optionPayload = {
      question: questionId,
      text: optText,
      is_correct: q.correctAnswer === optionLabels[index],  // compare with correctAnswer
      order_index: index,  // optional but useful
    };
          const optionRes = await fetch(
            "http://localhost:8000/api/test-creation/options/create/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(optionPayload),
            }
          );

          if (!optionRes.ok) {
            const errorText = await optionRes.text();
            throw new Error(`Option creation failed: ${optionRes.status} - ${errorText}`);
          }

          const optionData = await optionRes.json();
          console.log(`Option created: ${optionData.text}`);
        }
      }
    }

    alert("Section, questions, and options created successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert(`There was an error submitting the form: ${error.message}`);
  }
};*/
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const accessToken = sessionStorage.getItem("access_token");
  console.log("Access Token:", accessToken);

  try {
    // 1. Create Section
    const sectionPayload = {
      test: parseInt(testId),
      section_name: formData.sectionName,
      section_type: formData.sectionType,
      time_limit: parseInt(formData.timeLimit),
      marks_per_question: parseInt(formData.marksPerQuestion),
      interview_duration: parseInt(formData.interviewDuration),
    };

    const sectionRes = await fetch("http://localhost:8000/api/test-creation/sections/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(sectionPayload),
    });

    if (!sectionRes.ok) {
      const errorText = await sectionRes.text();
      throw new Error(`Section creation failed: ${sectionRes.status} - ${errorText}`);
    }

    const sectionData = await sectionRes.json();
    const sectionId = sectionData.id;
    console.log("Section created with ID:", sectionId);

    // 2. Create Questions
    for (const q of questions) {
      const questionPayload = {
        section: sectionId,
        type: q.type,
        text: q.text?.trim() || "",
        direction: q.direction?.trim() || "",
        video_time: q.videoTime ?? 60,
        audio_time: q.audioTime ?? 60,
        correct_answer:
  q.type === "fill-in-blanks" || q.type === "multiple-choice"
    ? (q.correctAnswer?.trim() || "")
    : null,
        passage_text: q.type === "passage" ? (q.passageText?.trim() || "") : null,
      };

      console.log("Creating Question with Payload:", questionPayload);

      const questionRes = await fetch("http://localhost:8000/api/test-creation/questions/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(questionPayload),
      });

      if (!questionRes.ok) {
        const errorText = await questionRes.text();
        throw new Error(`Question creation failed: ${questionRes.status} - ${errorText}`);
      }

      const questionData = await questionRes.json();
      const questionId = questionData.id;
      console.log(`Question created with ID: ${questionId}`);

      // 3. Create Options if MCQ
      if (q.type === "multiple-choice" && Array.isArray(q.options)){
        const optionLabels = ["A", "B", "C", "D"]; // Assumes 4-option MCQ; change if needed

        for (const [index, optText] of q.options.entries()) {
          const label = optionLabels[index];
          const isCorrect =
  q.correctAnswer?.trim().toLowerCase() === label.toLowerCase() ||
  q.correctAnswer?.trim().toLowerCase() === optText?.trim().toLowerCase();

          const optionPayload = {
            question: questionId,
            text: optText?.trim() || "",
            is_correct: isCorrect,
            order_index: index,
          };

          console.log("Creating Option with Payload:", optionPayload);

          const optionRes = await fetch("http://localhost:8000/api/test-creation/options/create/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(optionPayload),
          });

          if (!optionRes.ok) {
            const errorText = await optionRes.text();
            throw new Error(`Option creation failed: ${optionRes.status} - ${errorText}`);
          }

          const optionData = await optionRes.json();
          console.log(`Option created: ${optionData.text}`);
        }
      }
    }

    alert("Section, questions, and options created successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert(`There was an error submitting the form: ${error.message}`);
  }
};
  const renderQuestionTypeContent = (question) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="multiple-choice-options">
            <div className="options-list">
              {question.options.map((option, index) => (
                <div key={index} className="option-container">
                  <span>{String.fromCharCode(65 + index)}.</span>
                  <input
                    type="text"
                    className="option-input"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => updateOption(question.id, index, e.target.value)}
                  />
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      className="remove-option-btn"
                      onClick={() => removeOption(question.id, index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="add-option-btn" onClick={() => addOption(question.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add Option
            </button>

            <div className="correct-answer-container">
              <label className="correct-answer-label">
                Correct Answer <span className="required">*</span>
              </label>
              <div className="radio-options">
                {question.options.map((option, index) => (
                  <div key={index} className="radio-option">
                    <input
                      type="radio"
                      id={`correct-${question.id}-${index + 1}`}
                      name={`correct-${question.id}`}
                      value={index + 1}
                      checked={question.correctAnswer === (index + 1).toString()}
                      onChange={(e) => handleQuestionChange(question.id, "correctAnswer", e.target.value)}
                    />
                    <label htmlFor={`correct-${question.id}-${index + 1}`}>
                      {`option || Option ${String.fromCharCode(65 + index)}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "fill-in-blanks":
        return (
          <div className="fill-in-blanks">
            <div className="correct-answer-container">
              <label className="correct-answer-label">
                Correct Answer <span className="required">*</span>
              </label>
              <input
                type="text"
                className="text-input"
                placeholder="Enter the correct answer"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(question.id, "correctAnswer", e.target.value)}
              />
              <p className="helper-text">For multiple acceptable answers, separate them with commas</p>
            </div>
          </div>
        )

      case "video":
        return (
          <div className="video-response">
            <div className="form-group">
              <label className="form-label">Maximum Recording Time (seconds)</label>
              <input
                type="number"
                className="text-input"
                min="10"
                max="300"
                value={question.videoTime}
                onChange={(e) => handleQuestionChange(question.id, "videoTime", e.target.value)}
              />
            </div>
          </div>
        )

      case "audio":
        return (
          <div className="audio-response">
            <div className="form-group">
              <label className="form-label">Maximum Recording Time (seconds)</label>
              <input
                type="number"
                className="text-input"
                min="10"
                max="300"
                value={question.audioTime}
                onChange={(e) => handleQuestionChange(question.id, "audioTime", e.target.value)}
              />
            </div>
          </div>
        )

      case "passage":
        return (
          <div className="passage-based">
            <div className="passage-container">
              <label className="form-label">
                Passage Text <span className="required">*</span>
              </label>
              <textarea
                className="passage-editor"
                placeholder="Enter the passage text here..."
                value={question.passageText}
                onChange={(e) => handleQuestionChange(question.id, "passageText", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "150px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  padding: "10px",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  resize: "vertical",
                  marginBottom: "16px",
                  color: "#666",
                }}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const styles = {
    body: {
      margin: 0,
      padding: 0,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      backgroundColor: "#f9fafb",
      color: "#666",
    },
    header: {
      borderBottom: "1px solid #e5e7eb",
      width: "100%",
      backgroundColor: "white",
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "64px",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 16px",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "48px",
    },
    navTabs: {
      display: "flex",
      gap: "32px",
    },
    navTab: {
      color: "#666",
      textDecoration: "none",
      padding: "8px",
      fontSize: "14px",
    },
    activeNavTab: {
      color: "#00a398",
      borderBottom: "2px solid #00a398",
    },
    userProfile: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    avatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: "#ccc",
      overflow: "hidden",
    },
    mainContent: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "32px 16px",
    },
    progressSteps: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "48px",
      position: "relative",
    },
    progressLine: {
      position: "absolute",
      height: "2px",
      backgroundColor: "#e5e7eb",
      width: "100%",
      top: "16px",
      zIndex: 0,
    },
    progressLineActive: {
      position: "absolute",
      height: "2px",
      backgroundColor: "#00a398",
      width: "25%",
      top: "16px",
      zIndex: 1,
    },
    step: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      zIndex: 2,
    },
    stepCircle: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      marginBottom: "8px",
    },
    activeStepCircle: {
      backgroundColor: "#00a398",
      color: "white",
    },
    completedStepCircle: {
      backgroundColor: "#00a398",
      color: "white",
    },
    inactiveStepCircle: {
      backgroundColor: "white",
      color: "#6b7280",
      border: "1px solid #e5e7eb",
    },
    stepText: {
      fontSize: "12px",
      textAlign: "center",
    },
    activeStepText: {
      color: "#00a398",
      fontWeight: 500,
    },
    completedStepText: {
      color: "#00a398",
    },
    inactiveStepText: {
      color: "#6b7280",
    },
    jobInfoBanner: {
      backgroundColor: "#f0fdfc",
      border: "1px solid #00a398",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "24px",
    },
    jobTitle: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#00a398",
      marginBottom: "8px",
    },
    jobDetails: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "12px",
    },
    jobSkills: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    skillTag: {
      backgroundColor: "#e0f2f1",
      color: "#00695c",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
    },
    formContainer: {
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "32px",
      marginBottom: "24px",
    },
    sectionHeader: {
      backgroundColor: "#fff9e6",
      border: "1px solid #ffeeba",
      borderRadius: "4px",
      padding: "16px",
      marginBottom: "24px",
    },
    formGroup: {
      marginBottom: "24px",
    },
    formRow: {
      display: "flex",
      gap: "32px",
      marginBottom: "24px",
    },
    formCol: {
      flex: 1,
    },
    formLabel: {
      display: "block",
      marginBottom: "12px",
      fontWeight: 500,
      fontSize: "14px",
      color: "#666",
    },
    required: {
      color: "red",
    },
    textInput: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      padding: "12px",
      boxSizing: "border-box",
      fontSize: "14px",
      color: "#666",
    },
    selectInput: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      padding: "12px",
      boxSizing: "border-box",
      backgroundColor: "white",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
      backgroundSize: "16px",
      fontSize: "14px",
      color: "#666",
    },
    questionContainer: {
      border: "1px solid #e5e7eb",
      borderRadius: "4px",
      padding: "16px",
      marginBottom: "16px",
    },
    questionHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
      fontWeight: 500,
      fontSize: "14px",
      color: "#666",
    },
    questionActions: {
      display: "flex",
      gap: "8px",
    },
    actionIcon: {
      cursor: "pointer",
      color: "#6b7280",
    },
    questionInput: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      padding: "10px",
      boxSizing: "border-box",
      marginBottom: "8px",
      fontSize: "14px",
      color: "#666",
    },
    investigationDirection: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px",
      color: "#6b7280",
      marginBottom: "12px",
    },
    addQuestionBtn: {
      width: "100%",
      padding: "12px",
      border: "1px dashed #d1d5db",
      backgroundColor: "white",
      borderRadius: "4px",
      color: "#6b7280",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "24px",
      fontSize: "14px",
    },
    confirmButton: {
      backgroundColor: "#00a398",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "12px 48px",
      cursor: "pointer",
      fontSize: "14px",
    },
    clearFormBtn: {
      backgroundColor: "#f3f4f6",
      color: "#666",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      padding: "12px 24px",
      cursor: "pointer",
      fontSize: "14px",
      marginRight: "16px",
    },
    backButton: {
      backgroundColor: "#f3f4f6",
      color: "#666",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      padding: "12px 24px",
      textDecoration: "none",
      fontSize: "14px",
    },
    buttonContainer: {
      display: "flex",
      gap: "16px",
      justifyContent: "center",
      marginTop: "24px",
    },
    optionContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
      color: "#666",
    },
    optionInput: {
      flex: 1,
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      padding: "8px",
      fontSize: "14px",
      color: "#666",
    },
    addOptionBtn: {
      background: "none",
      border: "none",
      color: "#00a398",
      cursor: "pointer",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 0",
    },
    removeOptionBtn: {
      background: "none",
      border: "none",
      color: "#6b7280",
      cursor: "pointer",
      padding: "4px",
    },
    correctAnswerContainer: {
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px dashed #e5e7eb",
    },
    correctAnswerLabel: {
      fontSize: "14px",
      fontWeight: 500,
      marginBottom: "8px",
      display: "block",
      color: "#666",
    },
    radioOption: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "4px",
      color: "#666",
    },
    questionTypeContainer: {
      marginBottom: "16px",
    },
    questionTypeLabel: {
      fontSize: "14px",
      fontWeight: 500,
      marginBottom: "8px",
      display: "block",
      color: "#666",
    },
    helperText: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px",
    },
  }

  return (
    <div style={styles.body}>
      {/* Header/Navigation */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.navLinks}>
            {/* Logo placeholder */}
            <div style={{ width: "100px", height: "35px", backgroundColor: "#979797" }}></div>

            {/* Navigation tabs */}
            <nav style={styles.navTabs}>
              <a href="#" style={styles.navTab}>
                Home
              </a>
              <a href="#" style={styles.navTab}>
                Evaluations
              </a>
              <a href="#" style={{ ...styles.navTab, ...styles.activeNavTab }}>
                Positions
              </a>
            </nav>
          </div>

          {/* User profile */}
          <div style={styles.userProfile}>
            <div style={styles.avatar}>
              <img src="/placeholder.svg?height=32&width=32" alt="User" />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Progress Steps */}
        <div style={styles.progressSteps}>
          <div style={styles.progressLine}></div>
          <div style={styles.progressLineActive}></div>

          {/* Step 1 */}
          <div style={styles.step}>
            <div style={{ ...styles.stepCircle, ...styles.completedStepCircle }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span style={{ ...styles.stepText, ...styles.completedStepText }}>Import a job</span>
          </div>

          {/* Step 2 */}
          <div style={styles.step}>
            <div style={{ ...styles.stepCircle, ...styles.activeStepCircle }}>2</div>
            <span style={{ ...styles.stepText, ...styles.activeStepText }}>
              Set interview
              <br />
              questions
            </span>
          </div>

          {/* Step 3 */}
          <div style={styles.step}>
            <div style={{ ...styles.stepCircle, ...styles.inactiveStepCircle }}>3</div>
            <span style={{ ...styles.stepText, ...styles.inactiveStepText }}>
              Import
              <br />
              resumes
            </span>
          </div>

          {/* Step 4 */}
          <div style={styles.step}>
            <div style={{ ...styles.stepCircle, ...styles.inactiveStepCircle }}>4</div>
            <span style={{ ...styles.stepText, ...styles.inactiveStepText }}>
              Send interview
              <br />
              invitation
            </span>
          </div>
        </div>

        {/* Job Info Banner */}
        {jobInfo && (
          <div style={styles.jobInfoBanner}>
            <div style={styles.jobTitle}>{jobInfo.jobTitle || "Imported Job"}</div>
            <div style={styles.jobDetails}>
              {[
                jobInfo.company,
                jobInfo.department && capitalizeFirstLetter(jobInfo.department),
                jobInfo.experienceLevel && capitalizeFirstLetter(jobInfo.experienceLevel),
                jobInfo.employmentType && capitalizeFirstLetter(jobInfo.employmentType),
                jobInfo.location,
              ]
                .filter(Boolean)
                .join(" • ")}
            </div>
            {jobInfo.skills && jobInfo.skills.length > 0 && (
              <div style={styles.jobSkills}>
                {jobInfo.skills.slice(0, 8).map((skill, index) => (
                  <span key={index} style={styles.skillTag}>
                    {skill.text || skill}
                  </span>
                ))}
                {jobInfo.skills.length > 8 && <span style={styles.skillTag}>+{jobInfo.skills.length - 8} more</span>}
              </div>
            )}
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {/* Section Details */}
          <div style={styles.formContainer}>
            <div style={styles.sectionHeader}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Section Details</h3>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={styles.formRow}>
                <div style={styles.formCol}>
                  <label style={styles.formLabel}>
                    Section Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    style={styles.textInput}
                    placeholder="e.g., Technical Skills"
                    value={formData.sectionName}
                    onChange={(e) => handleFormDataChange("sectionName", e.target.value)}
                    required
                  />
                </div>

                <div style={styles.formCol}>
                  <label style={styles.formLabel}>
                    Section Type <span style={styles.required}>*</span>
                  </label>
                  <select
                    style={styles.selectInput}
                    value={formData.sectionType}
                    onChange={(e) => handleFormDataChange("sectionType", e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="experience">Experience</option>
                    <option value="personality">Personality</option>
                    <option value="language">Language</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formCol}>
                  <label style={styles.formLabel}>
                    Time Limit (Minutes) <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    style={styles.textInput}
                    min="1"
                    max="120"
                    value={formData.timeLimit}
                    onChange={(e) => handleFormDataChange("timeLimit", e.target.value)}
                    required
                  />
                </div>

                <div style={styles.formCol}>
                  <label style={styles.formLabel}>
                    Marks Per Question <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    style={styles.textInput}
                    min="1"
                    max="100"
                    value={formData.marksPerQuestion}
                    onChange={(e) => handleFormDataChange("marksPerQuestion", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div style={styles.formContainer}>
            <div style={styles.sectionHeader}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Interview Questions</h3>
            </div>

            <div>
              {questions.map((question, index) => (
                <div key={question.id} style={styles.questionContainer}>
                  <div style={styles.questionHeader}>
                    <div>Question {index + 1}</div>
                    <div style={styles.questionActions}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={styles.actionIcon}
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={styles.actionIcon}
                        onClick={() => deleteQuestion(question.id)}
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Question Type Selector */}
                  <div style={styles.questionTypeContainer}>
                    <label style={styles.questionTypeLabel}>
                      Question Type <span style={styles.required}>*</span>
                    </label>
                    <select
                      style={styles.selectInput}
                      value={question.type}
                      onChange={(e) => {
                        const newType = e.target.value
                        handleQuestionChange(question.id, "type", newType)

                        // Reset type-specific fields when changing type
                        if (newType === "multiple-choice" && question.options.length === 0) {
                          handleQuestionChange(question.id, "options", ["", ""])
                          handleQuestionChange(question.id, "correctAnswer", "")
                        }
                      }}
                      required
                    >
                      <option value="text">Text Answer</option>
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="fill-in-blanks">Fill in the Blanks</option>
                      <option value="video">Video Response</option>
                      <option value="audio">Audio Response</option>
                      <option value="passage">Passage Based</option>
                    </select>
                  </div>

                  {/* Question Text */}
                  <input
                    type="text"
                    style={styles.questionInput}
                    placeholder="Enter your question"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                  />

                  {/* Investigation Direction */}
                  <div style={styles.investigationDirection}>
                    <span>Investigation direction:</span>
                    <select
                      style={{ ...styles.selectInput, width: "auto", padding: "4px 24px 4px 8px" }}
                      value={question.direction}
                      onChange={(e) => handleQuestionChange(question.id, "direction", e.target.value)}
                    >
                      <option value="skill">Skill</option>
                      <option value="ability">Ability</option>
                      <option value="personality">Personality</option>
                      <option value="language">Language</option>
                      <option value="experience">Experience</option>
                    </select>
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        color: "#6b7280",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                        <line x1="16" y1="8" x2="2" y2="22"></line>
                        <line x1="17.5" y1="15" x2="9" y2="15"></line>
                      </svg>
                      AI generate
                    </button>
                  </div>

                  {/* Question Type Specific Content */}
                  <div className="question-type-content">{renderQuestionTypeContent(question)}</div>
                </div>
              ))}
            </div>

          {/* Add Question / Import CSV Button Container */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <button
                type="button"
                style={{ ...styles.addQuestionBtn, width: 'auto', flexGrow: 1, marginBottom: 0 }}
                onClick={addQuestion}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add a new question
              </button>
              <input
                type="file"
                accept=".csv, text/csv"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="csvFileInput"
              />
              <button
                type="button"
                style={{ ...styles.addQuestionBtn, width: 'auto', flexGrow: 1, marginBottom: 0 }}
                onClick={() => {
                    const fileInput = document.getElementById('csvFileInput');
                    if (fileInput) fileInput.click();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Import from CSV
              </button>
            </div>
           
            {/* Interview Duration */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Interview duration (Minutes) <span style={styles.required}>*</span>
              </label>
              <input
                type="number"
                style={styles.textInput}
                min="1"
                max="120"
                value={formData.interviewDuration}
                onChange={(e) => handleFormDataChange("interviewDuration", e.target.value)}
                required
              />
              <p style={styles.helperText}>
                This is the total length of the candidates' responses, you can modify the content manually
              </p>
            </div>
          </div>

          {/* Button Container */}
          <div style={styles.buttonContainer}>
            <a href="#" style={styles.backButton}>
              Back
            </a>
            <button type="button" style={styles.clearFormBtn} onClick={clearForm}>
              Clear Form
            </button>
            <button type="submit" style={styles.confirmButton}>
              Confirm
            </button>
          </div>
        </form>
      </main>

      <style>{`
        .multiple-choice-options {
          margin-top: 16px;
        }
        
        .options-list {
          margin-bottom: 16px;
        }
        
        .option-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #666;
        }
        
        .option-input {
          flex: 1;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 8px;
          font-size: 14px;
          color: #666;
        }
        
        .add-option-btn {
          background: none;
          border: none;
          color: #00a398;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 0;
        }
        
        .add-option-btn:hover {
          text-decoration: underline;
        }
        
        .remove-option-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
        }
        
        .remove-option-btn:hover {
          color: #ef4444;
        }
        
        .correct-answer-container {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed #e5e7eb;
        }
        
        .correct-answer-label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          display: block;
          color: #666;
        }
        
        .radio-option {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          color: #666;
        }
        
        .fill-in-blanks {
          margin-top: 16px;
        }
        
        .video-response, .audio-response {
          margin-top: 16px;
        }
        
        .passage-based {
          margin-top: 16px;
        }
        
        .passage-container {
          margin-bottom: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 16px;
        }
        
        .passage-editor {
          width: 100%;
          min-height: 150px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 10px;
          box-sizing: border-box;
          font-size: 14px;
          resize: vertical;
          margin-bottom: 16px;
          color: #666;
        }
        
        .required {
          color: red;
        }
        
        .helper-text {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
export default InterviewQuestions;