import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative font-sans text-news-dark overflow-hidden">
       {/* Background Floating Icons */}
       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
            <i className="fas fa-newspaper absolute text-6xl top-10 left-10 text-news-blue animate-float"></i>
            <i className="fas fa-microphone absolute text-8xl top-1/2 right-20 text-news-purple animate-float" style={{animationDelay: '1s'}}></i>
            <i className="fas fa-pen-nib absolute text-5xl bottom-20 left-1/3 text-news-green animate-float" style={{animationDelay: '2s'}}></i>
            <i className="fas fa-camera absolute text-7xl bottom-10 right-10 text-news-pink animate-float" style={{animationDelay: '3s'}}></i>
       </div>
       
       <div className="relative z-10 w-full min-h-screen flex flex-col">
         {children}
       </div>
    </div>
  );
};