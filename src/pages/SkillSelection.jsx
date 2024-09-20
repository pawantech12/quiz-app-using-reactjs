import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

function SkillSelection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available categories from QuizAPI
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://quizapi.io/api/v1/categories",
          {
            headers: {
              "x-api-key": `NzkjVWYwkM2sjg0IXxa8gSD7xpgIZZreoFaImAnM`,
              "Content-Type": "application/json",
            },
          }
        );
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="py-10 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-4xl font-bold text-center text-gray-800 drop-shadow-md">
        Select a Skill
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-[5rem]">
        {categories.map((category) => (
          <div
            key={category.name}
            className="p-6 bg-white rounded-lg shadow-lg hover:border-orange-500 border hover:bg-orange-100 transform transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col items-center justify-center max-sm:w-[300px]"
            onClick={() => navigate(`/quiz/${category.name.toLowerCase()}`)}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {category.name}
            </h3>

            <p className="text-center text-gray-600 mb-4">
              Click to start your quiz
            </p>
            <button className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg transition duration-300 font-medium">
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillSelection;
