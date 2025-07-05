import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api';

const goalSuggestions = [
  'Lose 5 kg in 30 days',
  'Gain 3 kg of muscle',
  'Maintain current weight with balanced diet',
  'High-protein vegetarian plan',
  'Low-carb Indian keto diet',
  'Weight gain for underweight female',
  'Muscle building for gym routine',
  'Fat loss with intermittent fasting',
  'PCOS-friendly vegetarian meal plan',
];


const dietOptions = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Non-Vegetarian', value: 'non-vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Keto', value: 'keto' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Low-Carb', value: 'low-carb' },
  { label: 'Paleo', value: 'paleo' },
];

const SmartMealPlanner = () => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(7);
  const [startDate, setStartDate] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activity, setActivity] = useState('');
  const [dietType, setDietType] = useState([]);
  const [allergies, setAllergies] = useState('');
  const [healthIssues, setHealthIssues] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showGoalSuggestions, setShowGoalSuggestions] = useState(false);
const [filteredGoals, setFilteredGoals] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await api.get('/auth/verify');
        if (res.status === 200 && res.data.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          alert('Session expired. Please login again.');
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        alert('Token verification failed. Please login again.');
      }
    };

    verifyToken();
  }, []);

  const handleGenerate = async () => {
    if (!goal || !startDate || !duration || !weight || !height) {
      alert('Please fill all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/mealplanner/generate', {
        goal,
        startDate: startDate?.toISOString(),
        duration,
        weight,
        height,
        age,
        gender,
        activity,
        dietType: dietType.join(', '),
        allergies,
        healthIssues,
      });

      const data = res.data;
      if (data.success) {
        if (!data.metadata?.id) {
          alert("Meal plan generated, but ID is missing. You can't save or like it.");
          return;
        }

        navigate('/meal-result', {
          state: {
            plans: data.plan,
            nutritionTips: data.nutritionTips || [],
            liked: false,
            saved: false,
            planId: data.metadata.id,
          },
        });
      } else {
        setError(data.message || 'Failed to generate meal plan.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error while generating meal plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 p-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12 text-4xl font-bold text-center bg-gradient-to-r from-rose-500 to-pink-500 text-transparent bg-clip-text mb-6"
      >
        Smart Diet & Meal Planner
      </motion.h1>

      <div className="bg-white rounded-xl p-4 shadow-md w-full max-w-2xl space-y-4">
       <div className="relative">
  <textarea
    value={goal}
    onChange={(e) => {
      const val = e.target.value;
      setGoal(val);
      if (val.trim() === '') {
        setShowGoalSuggestions(false);
        setFilteredGoals([]);
      } else {
        const matches = goalSuggestions.filter((g) =>
          g.toLowerCase().includes(val.toLowerCase())
        );
        setFilteredGoals(matches);
        setShowGoalSuggestions(true);
      }
    }}
    onFocus={() => {
      if (goal.trim()) {
        setFilteredGoals(goalSuggestions.filter((g) =>
          g.toLowerCase().includes(goal.toLowerCase())
        ));
        setShowGoalSuggestions(true);
      }
    }}
    onBlur={() => {
      setTimeout(() => setShowGoalSuggestions(false), 200);
    }}
    placeholder="e.g., Gain 5 kg with a high-protein Indian vegetarian diet."
    rows={3}
    className="w-full border p-3 rounded-md shadow focus:ring-2 focus:ring-pink-300"
  />
  {showGoalSuggestions && filteredGoals.length > 0 && (
    <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto text-left mt-1">
      {filteredGoals.map((item, idx) => (
        <li
          key={idx}
          onClick={() => {
            setGoal(item);
            setShowGoalSuggestions(false);
          }}
          className="px-3 py-2 hover:bg-pink-100 cursor-pointer text-sm"
        >
          {item}
        </li>
      ))}
    </ul>
  )}
</div>



        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">⚖️ Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border p-2 rounded-md shadow"
              placeholder="e.g. 60"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">📏 Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full border p-2 rounded-md shadow"
              placeholder="e.g. 165"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">📆 Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full border p-2 rounded-md shadow"
              placeholderText="Select start date"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">📅 Duration (Days)</label>
            <input
              type="number"
              value={duration}
              min={1}
              max={30}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border p-2 rounded-md shadow"
              placeholder="e.g. 7"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-pink-600 hover:underline mt-1"
        >
          ⚙️ {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>

        {showAdvanced && (
          <div className="mt-2 border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">🎂 Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="border p-2 rounded-md shadow w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border p-2 rounded-md shadow w-full"
                >
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">🏃 Activity Level</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="border p-2 rounded-md shadow w-full"
                >
                  <option value="">Select</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">🥗 Diet Types</label>
                <Select
                  isMulti
                  options={dietOptions}
                  className="shadow"
                  value={dietType.map((type) => ({ label: type, value: type }))}
                  onChange={(selected) => setDietType(selected.map((opt) => opt.value))}
                  placeholder="Select or type diet preferences..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">🚫 Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Peanuts, Dairy"
                  className="border p-2 rounded-md shadow w-full"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">🩺 Health Issues</label>
                <input
                  type="text"
                  value={healthIssues}
                  onChange={(e) => setHealthIssues(e.target.value)}
                  placeholder="e.g. Diabetes, PCOS, High Cholesterol"
                  className="border p-2 rounded-md shadow w-full"
                />
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={() => {
                  setAge('');
                  setGender('');
                  setActivity('');
                  setDietType([]);
                  setAllergies('');
                  setHealthIssues('');
                }}
                className="text-xs text-pink-500 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-md font-semibold transition shadow"
          >
            Generate Meal Plan
          </button>
          {loading && <FaSpinner className="animate-spin text-pink-600 text-xl" />}
        </div>

        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>
    </section>
  );
};

export default SmartMealPlanner;
