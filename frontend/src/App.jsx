import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaLeaf, FaGithub, FaMoon, FaSun, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import HomePage from './components/HomePage';
import DiseaseInfoPage from './components/DiseaseInfoPage';
import AboutPage from './components/AboutPage';
import LanguageSelector from './components/LanguageSelector';
import ChatWidget from './components/ChatWidget';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ReviewsPage from './components/ReviewsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import GuestRoute from './components/GuestRoute';


function MainPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setResult('Healthy plant detected! No diseases found.');
      }, 2000);
    }
  };

  const faqs = [
    {
      question: t('faqs.questions.plants.question'),
      answer: t('faqs.questions.plants.answer')
    },
    {
      question: t('faqs.questions.accuracy.question'),
      answer: t('faqs.questions.accuracy.answer')
    },
    {
      question: t('faqs.questions.security.question'),
      answer: t('faqs.questions.security.answer')
    },
    {
      question: t('faqs.questions.offlineaccess.question'),
      answer: t('faqs.questions.offlineaccess.answer')
    },
    {
      question: t('faqs.questions.accuracy2.question'),
      answer: t('faqs.questions.accuracy2.answer')
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="fixed w-full bg-white dark:bg-gray-800 shadow-md z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <FaLeaf className="text-green-600 text-2xl mr-2" />
            <span className="text-xl font-bold text-green-600">CropCare AI</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600">{t('nav.home')}</Link>
            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-green-600">{t('nav.about')}</Link>
            <Link to="/reviews" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-600">
              <FaStar className="text-yellow-400" aria-hidden="true" />
              Reviews
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
              <FaGithub className="text-xl" />
            </a>
            <LanguageSelector />
            <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300 hover:text-green-600">
              {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
            {isAuthenticated && (
              <>
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Hi, {user?.username}
                </span>

                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage
                  handleImageUpload={handleImageUpload}
                  selectedImage={selectedImage}
                  isAnalyzing={isAnalyzing}
                  result={result}
                  faqs={faqs}
                />
              </ProtectedRoute>
            }
          />

          <Route path="/about" element={<AboutPage />} />

          <Route path="/reviews" element={<ReviewsPage />} />

          <Route
            path="/diseaseinfo/:diseaseName"
            element={<DiseaseInfoPage />}
          />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            }
          />
        </Routes>
      </main>
      {isAuthenticated && <ChatWidget />}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-8 text-center">
        <div className="flex justify-center">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-green-600 text-2xl">
            <FaGithub />
          </a>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2"> {t('footer.copyright')}</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainPage />
    </Router>
  );
}

export default App;