import { Mail, Clock, Send } from 'lucide-react';

export default function MailView() {
  return (
    <div className="min-h-screen bg-[#1D1D1D] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#2D2D2D] p-8">
          <div className="w-20 h-20 bg-[#8661C5] mx-auto mb-6 flex items-center justify-center">
            <Mail className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-light text-white mb-4">Coming Soon</h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light">
            We're building an amazing email experience for you. Stay tuned for powerful communication tools 
            that will help you connect with your readers and manage your author correspondence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#3D3D3D] p-4 border border-[#8661C5]/30">
              <Send className="w-8 h-8 text-[#8661C5] mx-auto mb-2" />
              <h3 className="font-light text-white mb-1">Smart Inbox</h3>
              <p className="text-sm text-gray-400 font-light">Organized communication with readers</p>
            </div>
            <div className="bg-[#3D3D3D] p-4 border border-[#8661C5]/30">
              <Clock className="w-8 h-8 text-[#8661C5] mx-auto mb-2" />
              <h3 className="font-light text-white mb-1">Scheduled Sending</h3>
              <p className="text-sm text-gray-400 font-light">Perfect timing for your messages</p>
            </div>
            <div className="bg-[#3D3D3D] p-4 border border-[#8661C5]/30">
              <Mail className="w-8 h-8 text-[#8661C5] mx-auto mb-2" />
              <h3 className="font-light text-white mb-1">Newsletters</h3>
              <p className="text-sm text-gray-400 font-light">Engage your audience regularly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}