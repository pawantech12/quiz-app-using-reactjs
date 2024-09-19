import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function SkillSelection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState();
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
        console.log(response);
        setCategories(response.data); // Store the fetched categories
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Select a Skill</h2>
      <div className="grid grid-cols-2 gap-6">
        {categories?.map((category) => (
          <div
            key={category.name}
            className="p-6 bg-white rounded-lg shadow-lg hover:bg-blue-200 cursor-pointer"
            onClick={() => navigate(`/quiz/${category.name.toLowerCase()}`)}
          >
            <h3 className="text-xl font-semibold text-center">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillSelection;
