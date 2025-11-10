import { FileText, TrendingUp, Users, BarChart3 } from 'lucide-react';

export default function ArticlesView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-blue-200">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
            <FileText className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-slate-800 mb-4">Enhanced Articles</h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            We're working on powerful new features to help you create, analyze, and optimize your content. 
            Get ready for advanced analytics, better SEO tools, and enhanced reader engagement features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 mb-1">Advanced Analytics</h3>
              <p className="text-sm text-slate-600">Track reader engagement</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 mb-1">Audience Insights</h3>
              <p className="text-sm text-slate-600">Understand your readers</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 mb-1">Performance Metrics</h3>
              <p className="text-sm text-slate-600">Optimize your content</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-1 inline-block">
            <div className="bg-white rounded-lg px-6 py-3">
              <p className="text-blue-600 font-bold">New Features Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}