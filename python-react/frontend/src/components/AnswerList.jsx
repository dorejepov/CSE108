/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { castVote, getVote } from '../services/api';

const AnswerList = ({ answers }) => {
    const userId = localStorage.getItem("userId");
    const [voteCounts, setVoteCounts] = useState({}); 

    useEffect(() => {
        const fetchVoteCounts = async () => {
            try {
                const counts = {};
                for (const answer of answers) {
                    const { data } = await getVote(answer._id);
                    counts[answer._id] = { upvotes: data.upvotes, downvotes: data.downvotes };
                }
                setVoteCounts(counts);
            } catch (error) {
                console.error("Error fetching vote counts:", error);
            }
        };

        fetchVoteCounts();
    }, [answers]);

    const handleVote = async (answerId, voteType) => {
        try {
            await castVote(answerId, { voteType, userId });
            const { data } = await getVote(answerId);
            setVoteCounts((prev) => ({
                ...prev,
                [answerId]: { upvotes: data.upvotes, downvotes: data.downvotes },
            }));
        } catch (error) {
            console.error("Error casting vote:", error);
        }
    };

    return (
        <ul className="space-y-4">
            {answers.map((a) => (
                <li
                    key={a._id}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                    <p className="text-gray-800 text-sm md:text-base">{a.content}</p>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex space-x-4">
                            <span className="text-gray-600 text-sm">
                                Upvotes:{" "}
                                <span className="font-semibold">
                                    {voteCounts[a._id]?.upvotes || 0}
                                </span>
                            </span>
                            <span className="text-gray-600 text-sm">
                                Downvotes:{" "}
                                <span className="font-semibold">
                                    {voteCounts[a._id]?.downvotes || 0}
                                </span>
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleVote(a._id, "up")}
                                className="bg-green-500 text-white font-medium py-1 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                            >
                                Upvote
                            </button>
                            <button
                                onClick={() => handleVote(a._id, "down")}
                                className="bg-red-500 text-white font-medium py-1 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                            >
                                Downvote
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default AnswerList;
