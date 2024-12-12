import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestion, getAnswers } from '../services/api';
import AnswerForm from './AnswerForm';
import AnswerList from './AnswerList';

const QuestionDetails = () => {
    const { id: questionId } = useParams();  
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const { data } = await getQuestion(questionId);
                setQuestion(data);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        const fetchAnswers = async () => {
            try {
                const { data } = await getAnswers(questionId);
                setAnswers(data);
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        };

        fetchQuestion();
        fetchAnswers();
    }, [questionId]);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
            {question ? (
                <>
                    <div className="mb-12 border-b pb-6">
                        <h2 className="text-4xl font-bold text-gray-900">{question.title}</h2>
                        <p className="text-lg text-gray-700 mt-4">{question.content}</p>
                    </div>

                    <div className="space-y-8">
                        <AnswerForm questionId={questionId} />
                        
                        <div>
                            <h3 className="text-3xl font-semibold text-gray-900 mb-6">Answers</h3>
                            {answers.length === 0 ? (
                                <p className="text-lg text-gray-600">No answers yet. Be the first to answer!</p>
                            ) : (
                                <AnswerList answers={answers} />
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center text-gray-600">Loading question details...</div>
            )}
        </div>
    );
};

export default QuestionDetails;
