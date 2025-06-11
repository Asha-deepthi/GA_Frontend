// Sample data that lives on our "server"
const testSummaryData = {
    quizTitle: "Final Review",
    sections: [
        {
            name: "Mathematics",
            questions: [
                { id: 1, title: "Question 1", answer: "12" },
                { id: 2, title: "Question 2", answer: "25" },
                { id: 3, title: "Question 3", answer: "7" },
            ]
        },
        {
            name: "English",
            questions: [
                { id: 4, title: "Question 1", answer: "The quick brown fox jumps over the lazy dog." },
                { id: 5, title: "Question 2", answer: "A" },
                { id: 6, title: "Question 3", answer: null }, // Unanswered question
            ]
        },
        {
            name: "Science",
            questions: [
                { id: 7, title: "Question 1", answer: "Photosynthesis" },
                { id: 8, title: "Question 2", answer: "H2O" },
            ]
        },
        {
            name: "General Knowledge",
            questions: [
                { id: 9, title: "Question 1", answer: "Paris" },
                { id: 10, title: "Question 2", answer: "1969" },
            ]
        }
    ]
};


// --- PREVIOUS MOCK API FUNCTIONS ---
// ... (Your saveQuizSections and fetchQuizSections functions can remain here) ...


// --- NEW FUNCTION FOR TEST SUMMARY ---
export const fetchTestSummary = () => {
  return new Promise((resolve) => {
    console.log("Fetching test summary data from backend...");
    setTimeout(() => {
      console.log("Summary data fetched successfully.");
      // In a real app, this data would come from a database
      resolve({ success: true, data: testSummaryData });
    }, 1000); // 1-second delay to simulate network
  });
};