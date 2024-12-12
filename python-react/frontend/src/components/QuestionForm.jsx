import { useState, useEffect } from 'react';
import { createQuestion, getTopics } from '../services/api';
import { useNavigate } from 'react-router-dom';

const QuestionForm = () => {
    const [form, setForm] = useState({ title: '', content: '', topicId: '' });
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const { data } = await getTopics();
                setTopics(data);
            } catch (err) {
                console.error('Error fetching topics:', err);
            }
        };

        fetchTopics();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem("userId")
            const formWithUserId = { ...form, userId };

            await createQuestion(formWithUserId);
            navigate('/questions');
        } catch (err) {
            alert('Error creating question. Please try again.', err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Post a New Question</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Title:
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>
                <div>
                    <label
                        htmlFor="content"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Content:
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>
                <div>
                    <label
                        htmlFor="topicId"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Topic:
                    </label>
                    <select
                        id="topicId"
                        name="topicId"
                        value={form.topicId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                    >
                        <option value="" disabled>
                            Select a topic
                        </option>
                        {topics.map((topic) => (
                            <option key={topic._id} value={topic._id}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                    Post Question
                </button>
            </form>
        </div>
    );
};

export default QuestionForm;
