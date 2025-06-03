// src/components/auth-choice.jsx
import { ArrowRight } from 'lucide-react';

export default function AuthChoice({ onLogin, onSignup }) {
  return (
    <>
      {/* Left sidebar */}
      <div className="bg-[#1d968e] flex flex-col justify-center items-start p-8 md:p-16 md:w-1/2 relative overflow-hidden">
        <div className="relative z-10">
          <div className="bg-white rounded-full py-4 px-6 inline-flex items-center mb-12">
            <span className="text-[#1d968e] mr-2 text-2xl">*</span>
            <span className="text-gray-400 text-2xl font-bold tracking-wider">GA TEST</span>
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
            Start your Screening journey with us!
          </h1>
        </div>

        {/* Decorative dots pattern */}
        <div className="absolute top-0 right-0 p-4 grid grid-cols-4 gap-4 opacity-20">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-white"></div>
          ))}
        </div>

        {/* Bottom dots pattern */}
        <div className="absolute bottom-0 left-0 p-8 grid grid-cols-4 gap-6 opacity-20">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-white"></div>
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="bg-white p-8 md:p-16 flex flex-col justify-center md:w-1/2">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6">Welcome to GA TEST</h1>
          <p className="text-gray-600 mb-12">Choose how you want to continue</p>

          <div className="space-y-4">
            <button
              onClick={onLogin}
              className="w-full flex justify-between items-center p-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-medium text-left">Sign in</h3>
                <p className="text-gray-500 text-sm text-left">Already have an account? Sign in</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>

            <button
              onClick={onSignup}
              className="w-full flex justify-between items-center p-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-medium text-left">Create account</h3>
                <p className="text-gray-500 text-sm text-left">New to GA TEST? Create an account</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}