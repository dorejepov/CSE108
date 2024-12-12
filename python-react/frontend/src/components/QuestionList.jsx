import { useState, useEffect } from "react";
import { getQuestions, getTopics } from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topicMap, setTopicMap] = useState({}); 
  const [selectedTopic, setSelectedTopic] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await getQuestions();
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data } = await getTopics();
        setTopics(data);

        const map = data.reduce((acc, topic) => {
          acc[topic._id] = topic.name;
          return acc;
        }, {});
        setTopicMap(map);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
    };

    fetchTopics();
  }, []);

  const handleChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const filteredQuestions = selectedTopic
    ? questions.filter((q) => q.topicId === selectedTopic)
    : questions;

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login")

  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Questions</h2>
        <div className="flex items-center justify-between">
          <select
            id="topicId"
            name="topicId"
            value={selectedTopic}
            onChange={handleChange}
            required
            className="w-full pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic._id} value={topic._id}>
                {topic.name}
              </option>
            ))}
          </select>
          <button 
          onClick={handleLogout}
          className="rounded-sm ml-4 bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Logout
          </button>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <Link
          to="/questions/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Post a Question
        </Link>
      </div>
      <ul className="space-y-4">
        {filteredQuestions.map((q) => (
          <li
            key={q._id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition duration-300"
          >
            <Link to={`/questions/${q._id}`}>
              <div className="flex justify-between items-center p-3">
                <div>
                  <h1 className="text-lg font-medium text-blue-600 hover:underline">
                    {q.title}
                  </h1>
                  <p>{q.content}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-gray-500">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    {q.username || "Anonymous"}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700 font-semibold">
                {topicMap[q.topicId] || "No topic"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
