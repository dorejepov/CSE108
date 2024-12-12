/* eslint-disable react/prop-types */
import { useState } from 'react';
import { createAnswer } from '../services/api';

const AnswerForm = ({ questionId }) => {
    const [content, setContent] = useState('');

    const userId = localStorage.getItem("userId")

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createAnswer(questionId, { content, userId });
        window.location.reload();
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200 space-y-4"
        >
            <h2 className="text-lg font-semibold text-gray-800">Your Answer</h2>
            <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Write your answer here..." 
                className="w-full p-3 h-32 border rounded-md resize-none border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
                Submit Answer
            </button>
        </form>
    );
};

export default AnswerForm;
