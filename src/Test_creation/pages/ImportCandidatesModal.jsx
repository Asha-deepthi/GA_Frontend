// Create a new file: ImportCandidatesModal.jsx

import React, { useState, useEffect } from 'react';

const ImportCandidatesModal = ({ isOpen, onClose, onImport }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchQuizzes = async () => {
                setIsLoading(true);
                const accessToken = sessionStorage.getItem("access_token");
                // This reuses your existing endpoint to get a list of tests
                const response = await fetch('http://localhost:8000/api/test-creation/tests/', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const data = await response.json();
                setQuizzes(data);
                setIsLoading(false);
            };
            fetchQuizzes();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Import Candidates from Previous Test</h2>
                <input
                    type="text"
                    placeholder="Search by test title..."
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="max-h-96 overflow-y-auto">
                    {isLoading ? <p>Loading tests...</p> : (
                        <ul className="divide-y divide-gray-200">
                            {filteredQuizzes.map(quiz => (
                                <li key={quiz.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{quiz.title}</p>
                                        <p className="text-sm text-gray-500">{quiz.description.substring(0, 50)}...</p>
                                    </div>
                                    <button
                                        // This calls the onImport function with the ID of the selected test
                                        onClick={() => onImport(quiz.id)}
                                        className="bg-teal-500 text-white px-4 py-1 rounded-md hover:bg-teal-600"
                                    >
                                        Import List
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportCandidatesModal;