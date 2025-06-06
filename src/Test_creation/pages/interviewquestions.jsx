"use client"
import React from 'react';
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";

const InterviewQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testId = location.state?.testId;
  if (!testId) {
    alert("No testId found! Redirecting to test creation page.");
    navigate("/test-create"); // or wherever your test creation page is
    return null;
  }
  const [sections, setSections] = useState([
    {
      id: 1,
      name: "section 1",
      isActive: true,
      formData: {
        questionType: "",
        timeLimit: "20",
        marksPerQuestion: "10",
        maxMarks: "10",
        minMarks: "0",
        negativeMarks: "0",
        interviewDuration: "20",
        tags: "",
      },
      questions: [
        {
          id: 1,
          type: "text",
          text: "What professional skills do you have for Sales Executive positions?",
          direction: "skill",
          options: [],
          correctAnswer: "",
          correctAnswers: [],
          videoTime: 60,
          audioTime: 60,
          passageText: "",
          passageQuestions: [{ id: 1, text: "", correctAnswer: "" }],
        },
        {
          id: 2,
          type: "multiple-choice",
          text: "Which of the following sales related work experience do you have?",
          direction: "ability",
          options: ["B2B Sales", "Retail Sales", "Account Management", "Inside Sales"],
          correctAnswer: "1",
          correctAnswers: ["1"],
          videoTime: 60,
          audioTime: 60,
          passageText: "",
          passageQuestions: [{ id: 1, text: "", correctAnswer: "" }],
        },
      ],
    },
  ])

  const [jobInfo, setJobInfo] = useState(null)

  // Get current active section
  const activeSection = sections.find((s) => s.isActive) || sections[0]
  const currentFormData = activeSection?.formData || {}
  const currentQuestions = activeSection?.questions || []

  // Filter questions based on selected question type
  const filteredQuestions = currentFormData.questionType
    ? currentQuestions.filter((q) => q.type === currentFormData.questionType)
    : currentQuestions

  // Calculate total marks automatically
  const calculateTotalMaxMarks = () => {
    const maxMarksPerQuestion = Number.parseFloat(currentFormData.maxMarks) || 0
    return (maxMarksPerQuestion * filteredQuestions.length).toFixed(2)
  }

  const calculateTotalNegativeMarks = () => {
    const negativeMarksPerQuestion = Number.parseFloat(currentFormData.negativeMarks) || 0
    return (negativeMarksPerQuestion * filteredQuestions.length).toFixed(2)
  }

  useEffect(() => {
    loadJobInfo()
    loadSavedData()
  }, [])

  useEffect(() => {
    saveFormData()
  }, [sections])

  const loadJobInfo = () => {
    const importJobData = localStorage.getItem("importJobData")
    if (importJobData) {
      try {
        const jobData = JSON.parse(importJobData)
        setJobInfo(jobData)

        if (activeSection && !activeSection.name.includes("Assessment") && jobData.jobTitle) {
          updateSectionName(activeSection.id, `${jobData.jobTitle} Assessment`)
        }

        if (
          jobData.jobTitle &&
          currentQuestions.length > 0 &&
          currentQuestions[0] &&
          !currentQuestions[0].text.trim()
        ) {
          if (currentQuestions[0].id === 1) {
            updateSectionQuestions(activeSection.id, (prev) =>
              prev.map((q, index) =>
                index === 0
                  ? { ...q, text: `What professional skills do you have for ${jobData.jobTitle} positions? `}
                  : q,
              ),
            )
          }
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
        if (data.sections && data.sections.length > 0) {
          // Ensure backward compatibility for correctAnswers in questions
          const updatedSections = data.sections.map((section) => ({
            ...section,
            questions:
              section.questions?.map((q) => ({
                ...q,
                correctAnswers: q.correctAnswers || (q.correctAnswer ? [q.correctAnswer] : []),
              })) || [],
          }))
          setSections(updatedSections)
        }
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
  }

  const saveFormData = () => {
    const dataToSave = {
      sections: sections,
    }
    localStorage.setItem("interviewFormData", JSON.stringify(dataToSave))
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, " ")
  }

  // Section management functions
  const addSection = () => {
  const newSection = {
    id: sections.length + 1,
    name: `Section ${sections.length + 1}`, // Corrected template literal
    isActive: false,
    formData: {
      sectionName: "",
      questionType: "",
      timeLimit: "20",
      marksPerQuestion: "10",
      maxMarks: "10",
      minMarks: "0",
      negativeMarks: "0",
      interviewDuration: "20",
      tags: "",
    },
    questions: [
      {
        id: 1,
        type: "text",
        text: "",
        direction: "skill",
        options: [],
        correctAnswer: "",
        correctAnswers: [],
        videoTime: 60,
        audioTime: 60,
        passageText: "",
        passageQuestions: [{ id: 1, text: "", correctAnswer: "" }],
      },
    ],
  };

  setSections((prev) => [...prev, newSection]);
};
  const updateSectionName = (sectionId, newName) => {
    setSections((prev) => prev.map((section) => (section.id === sectionId ? { ...section, name: newName } : section)))
  }

  const deleteSection = (sectionId) => {
    if (sections.length > 1) {
      setSections((prev) => {
        const filtered = prev.filter((section) => section.id !== sectionId)
        const reindexed = filtered.map((section, index) => ({ ...section, id: index + 1 }))
        // If we deleted the active section, make the first one active
        if (prev.find((s) => s.id === sectionId)?.isActive) {
          reindexed[0].isActive = true
        }
        return reindexed
      })
    } else {
      alert("You must have at least one section.")
    }
  }

  const setActiveSection = (sectionId) => {
    setSections((prev) => prev.map((section) => ({ ...section, isActive: section.id === sectionId })))
  }

  // Form data management for current section
  const handleFormDataChange = (field, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.isActive
          ? {
              ...section,
              formData: {
                ...section.formData,
                [field]: value,
              },
            }
          : section,
      ),
    )
  }

  // Question management for current section
  const updateSectionQuestions = (sectionId, updateFunction) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: updateFunction(section.questions),
            }
          : section,
      ),
    )
  }

  const handleQuestionChange = (questionId, field, value) => {
    updateSectionQuestions(activeSection.id, (prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)),
    )
  }

  // Handle multiple correct answers for multiple choice
  const handleMultipleCorrectAnswers = (questionId, optionIndex, isChecked) => {
    updateSectionQuestions(activeSection.id, (prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const optionValue = (optionIndex + 1).toString()
          let newCorrectAnswers = [...(q.correctAnswers || [])]

          if (isChecked) {
            if (!newCorrectAnswers.includes(optionValue)) {
              newCorrectAnswers.push(optionValue)
            }
          } else {
            newCorrectAnswers = newCorrectAnswers.filter((ans) => ans !== optionValue)
          }

          return {
            ...q,
            correctAnswers: newCorrectAnswers,
            correctAnswer: newCorrectAnswers[0] || "",
          }
        }
        return q
      }),
    )
  }

  // New function to handle passage questions
  const handlePassageQuestionChange = (questionId, passageQuestionId, field, value) => {
    updateSectionQuestions(activeSection.id, (prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              passageQuestions: q.passageQuestions.map((pq) =>
                pq.id === passageQuestionId ? { ...pq, [field]: value } : pq,
              ),
            }
          : q,
      ),
    )
  }

  // Add passage question
  const addPassageQuestion = (questionId) => {
    updateSectionQuestions(activeSection.id, (prev) =>
      prev.map((q) =>
        q.id === questionId && q.passageQuestions.length < 5
          ? {
              ...q,
              passageQuestions: [
                ...q.passageQuestions,
                {
                  id: q.passageQuestions.length + 1,
                  text: "",
                  type: "text",
                  correctAnswer: "",
                  correctAnswers: [],
                  options: [],
                },
              ],
            }
          : q,
      ),
    )
  }

  // Remove passage question
  const removePassageQuestion = (questionId, passageQuestionId) => {
    updateSectionQuestions(activeSection.id, (prev) =>
      prev.map((q) =>
        q.id === questionId && q.passageQuestions.length > 1
          ? {
              ...q,
              passageQuestions: q.passageQuestions
                .filter((pq) => pq.id !== passageQuestionId)
                .map((pq, index) => ({ ...pq, id: index + 1 })),
            }
          : q,
      ),
    )
  }

  const addQuestion = () => {
    const questionType = currentFormData.questionType || "text"
    const newQuestionDefaults = {
      type: questionType,
      text: "",
      direction: "skill",
      options: questionType === "multiple-choice" ? ["", ""] : [],
      correctAnswer: "",
      correctAnswers: [],
      videoTime: 60,
      audioTime: 60,
      passageText: "",
      passageQuestions: [{ id: 1, text: "", correctAnswer: "" }],
    }
    updateSectionQuestions(activeSection.id, (prev) => {
      const updatedQuestions = [...prev, newQuestionDefaults]
      return updatedQuestions.map((q, index) => ({ ...q, id: index + 1 }))
    })
  }

  const deleteQuestion = (questionId) => {
    if (currentQuestions.length > 1) {
      updateSectionQuestions(activeSection.id, (prev) => {
        const filtered = prev.filter((q) => q.id !== questionId)
        return filtered.map((q, index) => ({ ...q, id: index + 1 }))
      })
    } else {
      alert("You must have at least one question.")
    }
  }

  const addOption = (questionId) => {
    updateSectionQuestions(activeSection.id, (prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, options: [...q.options, ""] } : q)),
    )
  }

  const removeOption = (questionId, optionIndex) => {
    updateSectionQuestions(activeSection.id, (prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, index) => index !== optionIndex),
              correctAnswers: (q.correctAnswers || [])
                .filter((ans) => Number.parseInt(ans) !== optionIndex + 1)
                .map((ans) => {
                  const ansNum = Number.parseInt(ans)
                  return ansNum > optionIndex + 1 ? (ansNum - 1).toString() : ans
                }),
              correctAnswer: q.correctAnswers && q.correctAnswers.length > 0 ? q.correctAnswers[0] : "",
            }
          : q,
      ),
    )
  }

  const updateOption = (questionId, optionIndex, value) => {
    updateSectionQuestions(activeSection.id, (prev) =>
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type !== "text/csv" && !file.name.toLowerCase().endsWith(".csv")) {
        alert("Please upload a valid CSV file (.csv).")
        event.target.value = null
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const csvText = e.target.result
          parseAndAddQuestionsFromCSV(csvText)
        } catch (error) {
          console.error("Error processing CSV file:", error)
          alert("An error occurred while processing the CSV file. Please check the console for details.")
        } finally {
          if (event.target) event.target.value = null
        }
      }
      reader.onerror = () => {
        alert("Error reading the CSV file.")
        if (event.target) event.target.value = null
      }
      reader.readAsText(file)
    }
  }

  const parseAndAddQuestionsFromCSV = (csvText) => {
    const lines = csvText.trim().split(/\r?\n/)
    if (lines.length === 0) {
      alert("CSV file is empty.")
      return
    }

    const newQuestionsFromCSV = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      const cells = line.split(/,(?=(?:(?:[^"]"){2})[^"]*$)/).map((cell) => {
        let c = cell.trim()
        if (c.startsWith('"') && c.endsWith('"')) {
          c = c.slice(1, -1).replace(/""/g, '"')
        }
        return c
      })

      const questionText = cells[0] || ""
      if (!questionText.trim()) {
        console.warn(`Skipping CSV line ${i + 1}: Question text is empty.`)
        continue
      }

      let type = (cells[1] || "text").toLowerCase().trim()
      const validTypes = ["text", "multiple-choice", "fill-in-blanks", "video", "audio", "passage"]
      if (!validTypes.includes(type)) type = "text"

      let direction = (cells[2] || "skill").toLowerCase().trim()
      const validDirections = ["skill", "ability", "personality", "language", "experience"]
      if (!validDirections.includes(direction)) direction = "skill"

      let options = []
      if (type === "multiple-choice") {
        if (cells[3]) {
          options = cells[3]
            .split(";")
            .map((opt) => opt.trim())
            .filter((opt) => opt)
        }
        if (options.length === 0) options = ["", ""]
        else if (options.length === 1) options.push("")
      }

      const correctAnswers = []
      if (type === "multiple-choice") {
        if (options.length > 0 && cells[4] && cells[4].trim() !== "") {
          const caInput = cells[4].trim()
          const caInputs = caInput.split(";").map((ca) => ca.trim())

          caInputs.forEach((ca) => {
            const caIndex = Number.parseInt(ca, 10)
            if (!isNaN(caIndex) && caIndex >= 1 && caIndex <= options.length) {
              correctAnswers.push(caIndex.toString())
            } else {
              const foundIndex = options.findIndex((opt) => opt.toLowerCase() === ca.toLowerCase())
              if (foundIndex !== -1) {
                correctAnswers.push((foundIndex + 1).toString())
              }
            }
          })
        }
      }

      const videoTimeRaw = Number.parseInt(cells[5], 10)
      const videoTime = isNaN(videoTimeRaw) ? 60 : Math.max(10, Math.min(300, videoTimeRaw))

      const audioTimeRaw = Number.parseInt(cells[6], 10)
      const audioTime = isNaN(audioTimeRaw) ? 60 : Math.max(10, Math.min(300, audioTimeRaw))

      const passageText = type === "passage" ? cells[7] || "" : ""

      newQuestionsFromCSV.push({
        type: type,
        text: questionText,
        direction: direction,
        options: options,
        correctAnswer: correctAnswers[0] || "",
        correctAnswers: correctAnswers,
        videoTime: videoTime,
        audioTime: audioTime,
        passageText: passageText,
        passageQuestions: [{ id: 1, text: "", correctAnswer: "" }],
      })
    }

    if (newQuestionsFromCSV.length > 0) {
      updateSectionQuestions(activeSection.id, (prevQuestions) => {
        const combinedQuestions = [...prevQuestions, ...newQuestionsFromCSV]
        return combinedQuestions.map((q, index) => ({ ...q, id: index + 1 }))
      })
      alert(`${newQuestionsFromCSV.length} question(s) imported successfully from CSV.`)
    } else {
      alert("No valid questions found in the CSV to import, or the file was empty/malformed.")
    }
  }

  const clearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data? This action cannot be undone.")) {
      localStorage.removeItem("interviewFormData")
      setSections([
        {
          id: 1,
          name: "Technical Skills",
          isActive: true,
          formData: {
            questionType: "",
            timeLimit: "20",
            marksPerQuestion: "10",
            maxMarks: "10",
            minMarks: "0",
            negativeMarks: "0",
            interviewDuration: "20",
            tags: "",
          },
          questions: [
            {
              id: 1,
              type: "text",
              text: "",
              direction: "skill",
              options: [],
              correctAnswer: "",
              correctAnswers: [],
              videoTime: 60,
              audioTime: 60,
              passageText: "",
              passageQuestions: [{ id: 1, text: "", correctAnswer: "" }],
            },
          ],
        },
      ])
      setJobInfo(null)
      loadJobInfo()
      alert("Form data has been cleared successfully.")
    }
  }

  const validateForm = () => {
    if (!activeSection.name.trim()) {
      alert("Please enter a section name.")
      return false
    }

    if (!currentFormData.timeLimit || Number.parseInt(currentFormData.timeLimit) < 1) {
      alert("Please enter a valid time limit.")
      return false
    }

    if (!currentFormData.marksPerQuestion || Number.parseInt(currentFormData.marksPerQuestion) < 1) {
      alert("Please enter valid marks per question.")
      return false
    }

    for (let i = 0; i < filteredQuestions.length; i++) {
      const question = filteredQuestions[i]

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

        if (!question.correctAnswers || question.correctAnswers.length === 0) {
          alert(`Please select at least one correct answer for Question ${i + 1}.`)
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

        for (let k = 0; k < question.passageQuestions.length; k++) {
          const passageQ = question.passageQuestions[k]
          if (!passageQ.text.trim()) {
            alert(`Please enter text for passage question ${k + 1} in Question ${i + 1}.`)
            return false
          }
        }
      }
    }

    if (!currentFormData.interviewDuration || Number.parseInt(currentFormData.interviewDuration) < 1) {
      alert("Please enter a valid interview duration.")
      return false
    }

    return true
  }
const handleSubmit = async (e) => {
  e.preventDefault();

  const accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) {
    alert("Authentication error: No access token found. Please log in again.");
    navigate("/login");
    return;
  }

  try {
    for (const section of sections) {
      console.log(`Submitting Section: "${section.formData.sectionName}"`);
      const formData = section.formData;
      const questionsToSubmit = section.questions;

      const sectionPayload = {
        test: parseInt(testId),
        section_name: formData.sectionName,
        question_type: formData.questionType,
        time_limit: parseInt(formData.timeLimit),
        marks_per_question: parseFloat(formData.marksPerQuestion),
        max_marks: parseFloat(formData.maxMarks),
        min_marks: parseFloat(formData.minMarks),
        negative_marks: parseFloat(formData.negativeMarks),
        interview_duration: parseInt(formData.interviewDuration),
        tags: formData.tags || "",
      };

      const sectionRes = await fetch("http://localhost:8000/api/test-creation/sections/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(sectionPayload),
      });

      if (!sectionRes.ok) {
        const errorText = await sectionRes.text();
        throw new Error(`Section creation failed for "${section.formData.sectionName}": ${sectionRes.status} - ${errorText}`);
      }

      const sectionData = await sectionRes.json();
      const newSectionId = sectionData.id;
      console.log(`Section "${section.formData.sectionName}" created with ID: ${newSectionId}`);

      // ==================================================================
      // THE FIX IS HERE: Filter out questions with no text before looping
      // ==================================================================
      for (const q of questionsToSubmit.filter(q => q.text && q.text.trim() !== "")) {
        
        let correctAnswersPayload = [];
        if (q.type === "multiple-choice") {
          correctAnswersPayload = q.correctAnswers || [];
        } else if (q.type === "fill-in-blanks" || q.type === "text") {
          if (q.correctAnswer && q.correctAnswer.trim() !== "") {
            correctAnswersPayload = [q.correctAnswer.trim()];
          }
        }
        
        const questionPayload = {
          section: newSectionId,
          type: q.type,
          text: q.text?.trim(),
          direction: q.direction?.trim() || "",
          passage_text: q.type === "passage" ? q.passageText?.trim() : null,
          video_time: q.type === "video" ? q.videoTime ?? 60 : 0,
          audio_time: q.type === "audio" ? q.audioTime ?? 60 : 0,
          correct_answers: correctAnswersPayload,
          parent_question: null,
        };
        const questionRes = await fetch("http://localhost:8000/api/test-creation/questions/create/", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify(questionPayload),
        });

        if (!questionRes.ok) {
          const errorText = await questionRes.text();
          throw new Error(`Question creation failed for "${q.text}": ${questionRes.status} - ${errorText}`);
        }

        const questionData = await questionRes.json();
        const newQuestionId = questionData.id;
        console.log(`Question "${q.text}" created with ID: ${newQuestionId}`);

        // Create options for regular Multiple-Choice questions
        if (q.type === "multiple-choice" && Array.isArray(q.options)) {
          // ... (this part is fine)
          for (const [index, optText] of q.options.entries()) {
            const isCorrect = (q.correctAnswers || []).includes((index + 1).toString());
            const optionPayload = {
              question: newQuestionId,
              text: optText?.trim(),
              is_correct: isCorrect,
              order_index: index,
            };
            await fetch("http://localhost:8000/api/test-creation/options/create/", {
              method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
              body: JSON.stringify(optionPayload)
            });
          }
        }

        // Handle passage sub-questions
        if (q.type === "passage" && Array.isArray(q.passageQuestions)) {
          console.log(`Creating sub-questions for passage ID ${newQuestionId}...`);

          // ==================================================================
          // ALSO ADD THE FIX HERE: Filter blank sub-questions too!
          // ==================================================================
          for (const passageQ of q.passageQuestions.filter(pq => pq.text && pq.text.trim() !== "")) {
            
            let subQCorrectAnswers = [];
            if (passageQ.type === "multiple-choice") {
              subQCorrectAnswers = passageQ.correctAnswers || [];
            } else if (passageQ.type === "fill-in-blanks" || passageQ.type === "text") {
              if (passageQ.correctAnswer && passageQ.correctAnswer.trim() !== "") {
                subQCorrectAnswers = [passageQ.correctAnswer.trim()];
              }
            }

            const childQuestionPayload = {
              section: newSectionId,
              type: passageQ.type,
              text: passageQ.text?.trim(),
              parent_question: newQuestionId,
              correct_answers: subQCorrectAnswers,
              direction: q.direction?.trim() || "skill",
              passage_text: q.passageText?.trim(), 
              video_time: passageQ.type === "video" ? passageQ.videoTime ?? 60 : 0,
              audio_time: passageQ.type === "audio" ? passageQ.audioTime ?? 60 : 0,
            };
            
            const childQuestionRes = await fetch("http://localhost:8000/api/test-creation/questions/create/", {
              method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
              body: JSON.stringify(childQuestionPayload)
            });

            if (!childQuestionRes.ok) {
                const errorText = await childQuestionRes.text();
                throw new Error(`Passage Sub-Question creation failed for "${passageQ.text}": ${childQuestionRes.status} - ${errorText}`);
            }
            
            const childQuestionData = await childQuestionRes.json();
            const newChildQuestionId = childQuestionData.id;
            console.log(`  - Sub-question "${passageQ.text}" created with ID: ${newChildQuestionId}`);
            
            // Create options if the sub-question is multiple-choice
            if (passageQ.type === "multiple-choice" && Array.isArray(passageQ.options)) {
              // ... (this part is fine)
              for (const [index, optText] of passageQ.options.entries()) {
                const isCorrect = (passageQ.correctAnswers || []).includes((index + 1).toString());
                const optionPayload = {
                  question: newChildQuestionId,
                  text: optText?.trim(),
                  is_correct: isCorrect,
                  order_index: index,
                };
                await fetch("http://localhost:8000/api/test-creation/options/create/", {
                  method: "POST", 
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                  body: JSON.stringify(optionPayload)
                });
              }
            }
          }
        }
      }
    }
    alert("All sections and questions created successfully!");
  } catch (error) {
    console.error("Error during form submission:", error);
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
                Correct Answer(s) <span className="required">*</span>
              </label>
              <p className="helper-text" style={{ marginBottom: "8px" }}>
                Select one or more correct answers
              </p>
              <div className="checkbox-options">
                {question.options.map((option, index) => (
                  <div key={index} className="checkbox-option">
                    <input
                      type="checkbox"
                      id={`correct-${question.id}-${index + 1}`}
                      checked={(question.correctAnswers || []).includes((index + 1).toString())}
                      onChange={(e) => handleMultipleCorrectAnswers(question.id, index, e.target.checked)}
                    />
                    <label htmlFor={`correct-${question.id}-${index + 1}`}>
                      {option || `Option ${String.fromCharCode(65 + index)}`}
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
                Reading Passage <span className="required">*</span>
              </label>
              <textarea
                className="passage-editor"
                placeholder="Enter the passage text here... You can format it with paragraphs, quotes, etc."
                value={question.passageText}
                onChange={(e) => handleQuestionChange(question.id, "passageText", e.target.value)}
                style={{
                  minHeight: "200px",
                  fontFamily: "Georgia, serif",
                  lineHeight: "1.6",
                  fontSize: "15px",
                }}
              />
              <p className="helper-text">
                Enter the reading passage that candidates will use to answer the questions below
              </p>
            </div>

            {/* Passage Questions Section */}
            <div className="passage-questions-container">
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}
              >
                <label className="form-label">Questions based on passage (up to 5 questions)</label>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  {question.passageQuestions.length}/5 questions
                </span>
              </div>

              {question.passageQuestions.map((passageQ, index) => (
                <div key={passageQ.id} className="passage-question-item">
                  <div className="passage-question-header">
                    <span>Question {index + 1}</span>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <select
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "4px",
                          fontSize: "12px",
                          backgroundColor: "white",
                        }}
                        value={passageQ.type || "text"}
                        onChange={(e) => handlePassageQuestionChange(question.id, passageQ.id, "type", e.target.value)}
                      >
                        <option value="text">Text Answer</option>
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="fill-in-blanks">Fill in the Blanks</option>
                      </select>
                      {question.passageQuestions.length > 1 && (
                        <button
                          type="button"
                          className="remove-passage-question-btn"
                          onClick={() => removePassageQuestion(question.id, passageQ.id)}
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
                  </div>
                  <input
                    type="text"
                    className="passage-question-input"
                    placeholder={`Enter question ${index + 1} based on the passage`}
                    value={passageQ.text}
                    onChange={(e) => handlePassageQuestionChange(question.id, passageQ.id, "text", e.target.value)}
                  />

                  {/* Render different question types */}
                  {passageQ.type === "multiple-choice" && (
                    <div className="passage-multiple-choice">
                      <div className="passage-options-list">
                        {(passageQ.options || ["", ""]).map((option, optIndex) => (
                          <div key={optIndex} className="passage-option-container">
                            <span>{String.fromCharCode(65 + optIndex)}.</span>
                            <input
                              type="text"
                              className="passage-option-input"
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(passageQ.options || ["", ""])]
                                newOptions[optIndex] = e.target.value
                                handlePassageQuestionChange(question.id, passageQ.id, "options", newOptions)
                              }}
                            />
                            {(passageQ.options || []).length > 2 && (
                              <button
                                type="button"
                                className="remove-passage-option-btn"
                                onClick={() => {
                                  const newOptions = (passageQ.options || []).filter((_, i) => i !== optIndex)
                                  const newCorrectAnswers = (passageQ.correctAnswers || [])
                                    .filter((ans) => Number.parseInt(ans) !== optIndex + 1)
                                    .map((ans) => {
                                      const ansNum = Number.parseInt(ans)
                                      return ansNum > optIndex + 1 ? (ansNum - 1).toString() : ans
                                    })
                                  handlePassageQuestionChange(question.id, passageQ.id, "options", newOptions)
                                  handlePassageQuestionChange(
                                    question.id,
                                    passageQ.id,
                                    "correctAnswers",
                                    newCorrectAnswers,
                                  )
                                }}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="add-passage-option-btn"
                        onClick={() => {
                          const newOptions = [...(passageQ.options || []), ""]
                          handlePassageQuestionChange(question.id, passageQ.id, "options", newOptions)
                        }}
                      >
                        + Add Option
                      </button>

                      <div className="passage-correct-answers">
                        <label style={{ fontSize: "12px", fontWeight: "500", display: "block", marginBottom: "4px" }}>
                          Correct Answer(s):
                        </label>
                        <div className="passage-checkbox-options">
                          {(passageQ.options || []).map((option, optIndex) => (
                            <div key={optIndex} className="passage-checkbox-option">
                              <input
                                type="checkbox"
                                id={`passage-correct-${question.id}-${passageQ.id}-${optIndex + 1}`}
                                checked={(passageQ.correctAnswers || []).includes((optIndex + 1).toString())}
                                onChange={(e) => {
                                  const optionValue = (optIndex + 1).toString()
                                  let newCorrectAnswers = [...(passageQ.correctAnswers || [])]

                                  if (e.target.checked) {
                                    if (!newCorrectAnswers.includes(optionValue)) {
                                      newCorrectAnswers.push(optionValue)
                                    }
                                  } else {
                                    newCorrectAnswers = newCorrectAnswers.filter((ans) => ans !== optionValue)
                                  }

                                  handlePassageQuestionChange(
                                    question.id,
                                    passageQ.id,
                                    "correctAnswers",
                                    newCorrectAnswers,
                                  )
                                  handlePassageQuestionChange(
                                    question.id,
                                    passageQ.id,
                                    "correctAnswer",
                                    newCorrectAnswers[0] || "",
                                  )
                                }}
                              />
                              <label htmlFor={`passage-correct-${question.id}-${passageQ.id}-${optIndex + 1}`}>
                                {option || `Option ${String.fromCharCode(65 + optIndex)}`}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {passageQ.type === "fill-in-blanks" && (
                    <div className="passage-fill-blanks">
                      <input
                        type="text"
                        className="passage-answer-input"
                        placeholder="Enter the correct answer(s) - separate multiple answers with commas"
                        value={passageQ.correctAnswer || ""}
                        onChange={(e) =>
                          handlePassageQuestionChange(question.id, passageQ.id, "correctAnswer", e.target.value)
                        }
                      />
                      <p style={{ fontSize: "11px", color: "#6b7280", margin: "4px 0 0 0" }}>
                        For multiple acceptable answers, separate them with commas
                      </p>
                    </div>
                  )}

                  {passageQ.type === "text" && (
                    <div className="passage-text-answer">
                      <textarea
                        className="passage-answer-input"
                        placeholder="Expected answer or key points (optional)"
                        value={passageQ.correctAnswer || ""}
                        onChange={(e) =>
                          handlePassageQuestionChange(question.id, passageQ.id, "correctAnswer", e.target.value)
                        }
                        style={{ minHeight: "60px", resize: "vertical" }}
                      />
                      <p style={{ fontSize: "11px", color: "#6b7280", margin: "4px 0 0 0" }}>
                        Provide sample answer or key points for manual evaluation
                      </p>
                    </div>
                  )}
                </div>
              ))
            }
              {question.passageQuestions?.length < 5 && (
                <button
                  type="button"
                  className="add-passage-question-btn"
                  onClick={() => addPassageQuestion(question.id)}
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  Add Another Question ({question.passageQuestions.length}/5)
                </button>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        backgroundColor: "#f9fafb",
        color: "#666",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Header/Navigation */}
      <header
        style={{
          borderBottom: "1px solid #e5e7eb",
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "48px",
            }}
          >
            <div style={{ width: "100px", height: "35px", backgroundColor: "#979797" }}></div>
            <nav
              style={{
                display: "flex",
                gap: "32px",
              }}
            >
              <a
                href="#"
                style={{
                  color: "#666",
                  textDecoration: "none",
                  padding: "8px",
                  fontSize: "14px",
                }}
              >
                Home
              </a>
              <a
                href="#"
                style={{
                  color: "#666",
                  textDecoration: "none",
                  padding: "8px",
                  fontSize: "14px",
                }}
              >
                Evaluations
              </a>
              <a
                href="#"
                style={{
                  color: "#00a398",
                  textDecoration: "none",
                  padding: "8px",
                  fontSize: "14px",
                  borderBottom: "2px solid #00a398",
                }}
              >
                Positions
              </a>
            </nav>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "100",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#ccc",
                overflow: "hidden",
              }}
            >
              <img src="/placeholder.svg?height=32&width=100" alt="User" />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
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

      {/* Main Content Container - COMPLETELY CENTERED */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "32px 16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {/* Progress Steps */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "48px",
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto 48px auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                height: "2px",
                backgroundColor: "#e5e7eb",
                width: "100%",
                top: "16px",
                zIndex: 0,
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                height: "2px",
                backgroundColor: "#00a398",
                width: jobInfo ? "50%" : "25%",
                top: "16px",
                zIndex: 1,
              }}
            ></div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 24 }}></div>
         {/* Step 1 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                flex: "1",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  marginBottom: "8px",
                  backgroundColor: "#00a398",
                  color: "white",
                }}
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
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  color: "#00a398",
                }}
              >
                Import a job
              </span>
            </div>

            {/* Step 2 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                flex: "1",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  marginBottom: "8px",
                  backgroundColor: "#00a398",
                  color: "white",
                }}
              >
                2
              </div>
              <span
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  color: "#00a398",
                  fontWeight: 500,
                }}
              >
                Set interview
                <br />
                questions
              </span>
            </div>

            {/* Step 3 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                flex: "1",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  marginBottom: "8px",
                  backgroundColor: "white",
                  color: "#6b7280",
                  border: "1px solid #e5e7eb",
                }}
              >
                3
              </div>
              <span
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Import
                <br />
                resumes
              </span>
            </div>

            {/* Step 4 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                flex: "1",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  marginBottom: "8px",
                  backgroundColor: "white",
                  color: "#6b7280",
                  border: "1px solid #e5e7eb",
                }}
              >
                4
              </div>
              <span
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Send interview
                <br />
                invitation
              </span>
            </div>
          </div>

          {/* Job Info Banner */}
          {jobInfo && (
            <div
              style={{
                backgroundColor: "#f0fdfc",
                border: "1px solid #00a398",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#00a398",
                  marginBottom: "8px",
                }}
              >
                {jobInfo.jobTitle || "Imported Job"}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
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
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {jobInfo.skills.slice(0, 8).map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e0f2f1",
                        color: "#00695c",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {skill.text || skill}
                    </span>
                  ))}
                  {jobInfo.skills.length > 8 && (
                    <span
                      style={{
                        backgroundColor: "#e0f2f1",
                        color: "#00695c",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      +{jobInfo.skills.length - 8} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section Details */}
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                marginBottom: "24px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff9e6",
                  border: "1px solid #ffeeba",
                  borderRadius: "4px",
                  padding: "16px",
                  margin: "32px 32px 24px 32px",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "16px", marginBottom: "12px" }}>Section Details</h3>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 10px",
                          border: section.isActive ? "2px solid #00a398" : "1px solid #d1d5db",
                          borderRadius: "4px",
                          backgroundColor: section.isActive ? "#f0fdfc" : "white",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <span style={{ color: section.isActive ? "#00a398" : "#666" }}>{section.name}</span>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSection(section.id)
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#6b7280",
                              cursor: "pointer",
                              padding: "2px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
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
                  <button
                    type="button"
                    onClick={addSection}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 10px",
                      border: "1px dashed #d1d5db",
                      borderRadius: "4px",
                      backgroundColor: "white",
                      color: "#6b7280",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Section
                  </button>
                </div>
              </div>
              <div style={{ padding: "0 32px 24px 32px", borderBottom: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Section Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
  type="text"
  required
  placeholder="e.g., Section 1"
  style={{
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    padding: "12px",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#666",
  }}
  value={activeSection?.formData.sectionName || ""}
  onChange={(e) => handleFormDataChange("sectionName", e.target.value)}
/>
                  </div>
                </div>
              </div>
              <div style={{ padding: "0 32px 32px 32px" }}>
                {/* Row 1: Question Type */}
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Question Type
                    </label>
                    <select
                      style={{
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
                      }}
                      value={currentFormData.questionType || ""}
                      onChange={(e) => handleFormDataChange("questionType", e.target.value)}
                    >
                      <option value="">All question types</option>
                      <option value="text">Text Answer</option>
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="fill-in-blanks">Fill in the Blanks</option>
                      <option value="video">Video Response</option>
                      <option value="audio">Audio Response</option>
                      <option value="passage">Passage Based</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Time Limit, Marks Per Question, Max Marks */}
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Time Limit (Minutes) <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      style={{
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "12px",
                        boxSizing: "border-box",
                        fontSize: "14px",
                        color: "#666",
                      }}
                      min="1"
                      max="120"
                      value={currentFormData.timeLimit || ""}
                      onChange={(e) => handleFormDataChange("timeLimit", e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Marks Per Question <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      style={{
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "12px",
                        boxSizing: "border-box",
                        fontSize: "14px",
                        color: "#666",
                      }}
                      min="1"
                      max="100"
                      value={currentFormData.marksPerQuestion || ""}
                      onChange={(e) => handleFormDataChange("marksPerQuestion", e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Max Marks
                    </label>
                    <input
                      type="number"
                      style={{
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "12px",
                        boxSizing: "border-box",
                        fontSize: "14px",
                        color: "#666",
                      }}
                      min="0"
                      step="0.5"
                      value={currentFormData.maxMarks || ""}
                      onChange={(e) => handleFormDataChange("maxMarks", e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 3: Min Marks, Negative Marks, Tags */}
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Min Marks
                    </label>
                    <input
                      type="number"
                      style={{
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "12px",
                        boxSizing: "border-box",
                        fontSize: "14px",
                        color: "#666",
                      }}
                      min="0"
                      step="0.5"
                      value={currentFormData.minMarks || ""}
                      onChange={(e) => handleFormDataChange("minMarks", e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Negative Marks
                    </label>
                    <input
                      type="number"
                      style={{
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "12px",
                        boxSizing: "border-box",
                        fontSize: "14px",
                        color: "#666",
                      }}
                      min="0"
                      step="0.25"
                      value={currentFormData.negativeMarks || ""}
                      onChange={(e) => handleFormDataChange("negativeMarks", e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Tags
                    </label>
                    <select
                      style={{
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
                      }}
                      value={currentFormData.tags || ""}
                      onChange={(e) => handleFormDataChange("tags", e.target.value)}
                    >
                      <option value="">Select a category</option>
                      <option value="technical-skills">Technical Skills</option>
                      <option value="programming">Programming</option>
                      <option value="algorithms">Algorithms & Data Structures</option>
                      <option value="soft-skills">Soft Skills</option>
                      <option value="communication">Communication</option>
                      <option value="leadership">Leadership</option>
                      <option value="problem-solving">Problem Solving</option>
                      <option value="analytical-thinking">Analytical Thinking</option>
                      <option value="teamwork">Teamwork</option>
                      <option value="customer-service">Customer Service</option>
                      <option value="sales">Sales</option>
                      <option value="marketing">Marketing</option>
                      <option value="finance">Finance</option>
                      <option value="operations">Operations</option>
                      <option value="project-management">Project Management</option>
                      <option value="language-proficiency">Language Proficiency</option>
                      <option value="industry-knowledge">Industry Knowledge</option>
                      <option value="experience-based">Experience Based</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="situational">Situational</option>
                    </select>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "4px",
                        margin: "4px 0 0 0",
                      }}
                    >
                      Choose a category for this question set
                    </p>
                  </div>
                </div>

                {/* Row 4: Total Max Marks, Total Negative Marks */}
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Total Max Marks
                    </label>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "12px",
                        boxSizing: "border-box",
                        fontSize: "14px",
                        color: "#666",
                        backgroundColor: "#f9fafb",
                      }}
                      value={calculateTotalMaxMarks()}
                      readOnly
                    />
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "4px",
                        margin: "4px 0 0 0",
                      }}
                    >
                      Auto-calculated: {filteredQuestions.length} questions × {currentFormData.maxMarks} marks
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      Total Negative Marks
                    </label>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "12px",
                        boxSizing: "border-box",
                        fontSize: "14px",
                        color: "#666",
                        backgroundColor: "#f9fafb",
                      }}
                      value={calculateTotalNegativeMarks()}
                      readOnly
                    />
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "4px",
                        margin: "4px 0 0 0",
                      }}
                    >
                      Auto-calculated: {filteredQuestions.length} questions × {currentFormData.negativeMarks} marks
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>{/* Empty div to maintain layout */}</div>
                </div>
              </div>
            </div>

            {/* Questions Section - Now shows filtered questions */}
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                marginBottom: "24px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff9e6",
                  border: "1px solid #ffeeba",
                  borderRadius: "4px",
                  padding: "16px",
                  margin: "32px 32px 24px 32px",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "16px" }}>
                  Interview Questions
                  {currentFormData.questionType && (
                    <span style={{ fontWeight: "normal", color: "#666", fontSize: "14px" }}>
                      {" "}
                      ({currentFormData.questionType.replace("-", " ")} questions only)
                    </span>
                  )}
                </h3>
              </div>
              <div style={{ padding: "0 32px 32px 32px" }}>
                {filteredQuestions.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    {currentFormData.questionType
                      ? `No ${currentFormData.questionType.replace("-", " ")} questions found. Add a new question below.`
                      : "No questions found. Add a new question below."}
                  </div>
                ) : (
                  filteredQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "4px",
                        padding: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        <div>Question {index + 1}</div>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
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
                            style={{
                              cursor: "pointer",
                              color: "#6b7280",
                            }}
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
                            style={{
                              cursor: "pointer",
                              color: "#6b7280",
                            }}
                            onClick={() => deleteQuestion(question.id)}
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path>
                          </svg>
                        </div>
                      </div>
                      <div
                        style={{
                          marginBottom: "16px",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            marginBottom: "8px",
                            display: "block",
                            color: "#666",
                          }}
                        >
                          Question Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          style={{
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
                          }}
                          value={question.type}
                          onChange={(e) => {
                            const newType = e.target.value
                            handleQuestionChange(question.id, "type", newType)
                            if (newType === "multiple-choice" && question.options.length === 0) {
                              handleQuestionChange(question.id, "options", ["", ""])
                              handleQuestionChange(question.id, "correctAnswer", "")
                              handleQuestionChange(question.id, "correctAnswers", [])
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
                     {/*This is the NEW, corrected code*/}
<textarea
  style={{
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    padding: "10px",
    boxSizing: "border-box",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#666",
    minHeight: "60px", // Good for multi-line questions
    resize: "vertical",
  }}
  placeholder={
    question.type === "passage"
      ? "Enter main instruction, e.g., 'Read the passage and answer...'"
      : "Enter your question text"
  }
  value={question.text}
  onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
  required // Add this for built-in browser validation
/>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "12px",
                          color: "#6b7280",
                          marginBottom: "12px",
                        }}
                      >
                        <span>Investigation direction:</span>
                        <select
                          style={{
                            width: "auto",
                            padding: "4px 24px 4px 8px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            backgroundColor: "white",
                            appearance: "none",
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            backgroundImage:
                              "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/%20strokeLinejoin='round'%3e%3cpolyline%20points='6%209%2012%2015%2018%209'%3e%3c/polyline%3e%3c/svg%3e\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 10px center",
                            backgroundSize: "16px",
                          }}
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
                      <div className="question-type-content">{renderQuestionTypeContent(question)}</div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ display: "flex", gap: "16px", marginBottom: "24px", padding: "0 32px" }}>
                <button
                  type="button"
                  style={{
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
                    fontSize: "14px",
                    width: "auto",
                    flexGrow: 1,
                    marginBottom: 0,
                  }}
                  onClick={addQuestion}
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
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
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
                  style={{
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
                    fontSize: "14px",
                    width: "auto",
                    flexGrow: 1,
                    marginBottom: 0,
                  }}
                  onClick={() => {
                    const fileInput = document.getElementById("csvFileInput")
                    if (fileInput) fileInput.click()
                  }}
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Import from CSV
                </button>
              </div>

              {/*<div style={{ padding: "0 32px 32px 32px" }}>
                <div
                  style={{
                    marginBottom: "24px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    Interview duration (Minutes) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    style={{
                      width: "100%",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      padding: "12px",
                      boxSizing: "border-box",
                      fontSize: "14px",
                      color: "#666",
                    }}
                    min="1"
                    max="120"
                    value={currentFormData.interviewDuration || ""}
                    onChange={(e) => handleFormDataChange("interviewDuration", e.target.value)}
                    required
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    This is the total length of the candidates' responses, you can modify the content manually
                  </p>
                </div>
              </div>*/}
            </div>

            {/* Button Container */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                marginTop: "24px",
                width: "100%",
              }}
            >
              <a
                href="#"
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#666",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  padding: "12px 24px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Back
              </a>
              <button
                type="button"
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#666",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={clearForm}
              >
                Clear Form
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: "#00a398",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "12px 48px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        /* CSS styles for question type content */
        .multiple-choice-options { margin-top: 16px; }
        .options-list { margin-bottom: 16px; }
        .option-container { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #666; }
        .option-input { flex: 1; border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; font-size: 14px; color: #666; }
        .add-option-btn { background: none; border: none; color: #00a398; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px; padding: 4px 0; }
        .add-option-btn:hover { text-decoration: underline; }
        .remove-option-btn { background: none; border: none; color: #6b7280; cursor: pointer; padding: 4px; }
        .remove-option-btn:hover { color: #ef4444; }
        .correct-answer-container { margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e5e7eb; }
        .correct-answer-label { font-size: 14px; font-weight: 500; margin-bottom: 8px; display: block; color: #666; }
        .radio-options { }
        .radio-option { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; color: #666; }
        .checkbox-options { }
        .checkbox-option { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; color: #666; }
        .fill-in-blanks { margin-top: 16px; }
        .video-response, .audio-response { margin-top: 16px; }
        .passage-based { margin-top: 16px; }
        .passage-container { margin-bottom: 16px; }
        .passage-editor {
          width: 100%; min-height: 150px; border: 1px solid #d1d5db; border-radius: 4px;
          padding: 10px; box-sizing: border-box; font-size: 14px; resize: vertical;
          color: #666;
        }
        .passage-questions-container { margin-top: 16px; }
        .passage-question-item { 
          border: 1px solid #e5e7eb; border-radius: 4px; padding: 12px; margin-bottom: 12px;
          background-color: #f9fafb;
        }
        .passage-question-header { 
          display: flex; justify-content: space-between; align-items: center; 
          margin-bottom: 8px; font-weight: 500; font-size: 14px; color: #666;
        }
        .passage-question-input, .passage-answer-input { 
          width: 100%; border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; 
          box-sizing: border-box; font-size: 14px; color: #666; margin-bottom: 8px;
        }
        .passage-answer-input { margin-bottom: 0; }
        .add-passage-question-btn { 
          background: none; border: 1px dashed #d1d5db; color: #00a398; cursor: pointer; 
          font-size: 12px; display: flex; align-items: center; gap: 4px; padding: 8px 12px;
          border-radius: 4px; width: 100%;
        }
        .add-passage-question-btn:hover { background-color: #f0fdfc; }
        .remove-passage-question-btn { 
          background: none; border: none; color: #6b7280; cursor: pointer; padding: 4px; 
        }
        .remove-passage-question-btn:hover { color: #ef4444; }
        .required { color: red; }
        .helper-text { font-size: 12px; color: #6b7280; margin-top: 4px; }
        @media (max-width: 768px) {
          .form-row { flex-direction: column !important; gap: 16px !important; }
        }

/* Add these new styles to the existing CSS */
.passage-multiple-choice { margin-top: 12px; }
.passage-options-list { margin-bottom: 8px; }
.passage-option-container { 
  display: flex; align-items: center; gap: 8px; margin-bottom: 6px; 
  font-size: 13px; color: #666;
}
.option-input { flex: 1; border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; font-size: 14px; color: #666; }
        .add-option-btn { background: none; border: none; color: #00a398; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px; padding: 4px 0; }
        .add-option-btn:hover { text-decoration: underline; }
        .remove-option-btn { background: none; border: none; color: #6b7280; cursor: pointer; padding: 4px; }
        .remove-option-btn:hover { color: #ef4444; }
        .correct-answer-container { margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e5e7eb; }
        .correct-answer-label { font-size: 14px; font-weight: 500; margin-bottom: 8px; display: block; color: #666; }
        .radio-options { }
        .radio-option { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; color: #666; }
        .checkbox-options { }
        .checkbox-option { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; color: #666; }
        .fill-in-blanks { margin-top: 16px; }
        .video-response, .audio-response { margin-top: 16px; }
        .passage-based { margin-top: 16px; }
        .passage-container { margin-bottom: 16px; }
        .passage-editor {
          width: 100%; min-height: 150px; border: 1px solid #d1d5db; border-radius: 4px;
          padding: 10px; box-sizing: border-box; font-size: 14px; resize: vertical;
          color: #666;
        }
        .passage-questions-container { margin-top: 16px; }
        .passage-question-item { 
          border: 1px solid #e5e7eb; border-radius: 4px; padding: 12px; margin-bottom: 12px;
          background-color: #f9fafb;
        }
        .passage-question-header { 
          display: flex; justify-content: space-between; align-items: center; 
          margin-bottom: 8px; font-weight: 500; font-size: 14px; color: #666;
        }
        .passage-question-input, .passage-answer-input { 
          width: 100%; border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; 
          box-sizing: border-box; font-size: 14px; color: #666; margin-bottom: 8px;
        }
        .passage-answer-input { margin-bottom: 0; }
        .add-passage-question-btn { 
          background: none; border: 1px dashed #d1d5db; color: #00a398; cursor: pointer; 
          font-size: 12px; display: flex; align-items: center; gap: 4px; padding: 8px 12px;
          border-radius: 4px; width: 100%;
        }
        .add-passage-question-btn:hover { background-color: #f0fdfc; }
        .remove-passage-question-btn { 
          background: none; border: none; color: #6b7280; cursor: pointer; padding: 4px; 
        }
        .remove-passage-question-btn:hover { color: #ef4444; }
        .required { color: red; }
        .helper-text { font-size: 12px; color: #6b7280; margin-top: 4px; }
        @media (max-width: 768px) {
          .form-row { flex-direction: column !important; gap: 16px !important; }
        }

/* Add these new styles to the existing CSS */
.passage-multiple-choice { margin-top: 12px; }
.passage-options-list { margin-bottom: 8px; }
.passage-option-container { 
  display: flex; align-items: center; gap: 8px; margin-bottom: 6px; 
  font-size: 13px; color: #666;
}
.passage-option-input { 
  flex: 1; border: 1px solid #d1d5db; border-radius: 3px; padding: 6px; 
  font-size: 13px; color: #666;
}
.add-passage-option-btn { 
  background: none; border: none; color: #00a398; cursor: pointer; 
  font-size: 11px; padding: 4px 0; margin-bottom: 8px;
}
.add-passage-option-btn:hover { text-decoration: underline; }
.remove-passage-option-btn { 
  background: none; border: none; color: #6b7280; cursor: pointer; 
  padding: 2px 6px; font-size: 14px; font-weight: bold;
}
.remove-passage-option-btn:hover { color: #ef4444; }
.passage-correct-answers { margin-top: 8px; }
.passage-checkbox-options { margin-top: 4px; }
.passage-checkbox-option { 
  display: flex; align-items: center; gap: 6px; margin-bottom: 3px; 
  font-size: 12px; color: #666;
}
.passage-fill-blanks { margin-top: 12px; }
.passage-text-answer { margin-top: 12px; }
      `}</style>
    </div>
  )
}

export default InterviewQuestions;