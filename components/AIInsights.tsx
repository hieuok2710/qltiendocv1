
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Task, TaskStatus } from '../types';
import { Sparkles, Loader2, AlertTriangle, CheckCircle, TrendingUp, RefreshCcw, BrainCircuit } from 'lucide-react';

interface AIInsightsProps {
  tasks: Task[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ tasks }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Bạn là một chuyên gia quản lý dự án cấp cao. Dưới đây là danh sách các công việc báo cáo:
        ${JSON.stringify(tasks.map(t => ({ content: t.content, deadline: t.deadline, status: t.status, notes: t.notes })))}
        
        Hãy thực hiện:
        1. Tóm tắt ngắn gọn tình hình hiện tại (tổng số việc, bao nhiêu trễ, bao nhiêu xong).
        2. Chỉ ra 3 rủi ro lớn nhất dựa trên deadline và ghi chú.
        3. Đưa ra 3 lời khuyên hành động cụ thể để đẩy nhanh tiến độ.
        
        Yêu cầu: Viết bằng tiếng Việt, giọng văn chuyên nghiệp, súc tích, định dạng Markdown rõ ràng.
      `;

      // Updated to gemini-3-pro-preview for complex reasoning task as per guidelines
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setInsight(response.text || "Không thể khởi tạo phân tích.");
    } catch (error) {
      console.error("AI Error:", error);
      setInsight("Đã xảy ra lỗi khi kết nối với trí tuệ nhân tạo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit size={160} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            AI Assistant Powered
          </div>
          <h2 className="text-3xl font-bold mb-4">Trợ Lý Phân Tích Thông Minh</h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Sử dụng trí tuệ nhân tạo để tự động tổng hợp báo cáo, nhận diện rủi ro tiềm ẩn và đề xuất phương án xử lý công việc tối ưu.
          </p>
          <button 
            onClick={generateInsight}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg active:scale-95 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCcw size={20} />}
            {loading ? 'Đang phân tích dữ liệu...' : 'Bắt đầu phân tích báo cáo'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
            <div>
                <h4 className="font-bold text-slate-800">Cảnh báo rủi ro</h4>
                <p className="text-sm text-slate-500">Tự động phát hiện các đầu việc có nguy cơ trễ hạn cao.</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={24} /></div>
            <div>
                <h4 className="font-bold text-slate-800">Tối ưu hiệu suất</h4>
                <p className="text-sm text-slate-500">Đề xuất ưu tiên các công việc quan trọng dựa trên ngữ cảnh.</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={24} /></div>
            <div>
                <h4 className="font-bold text-slate-800">Xu hướng tiến độ</h4>
                <p className="text-sm text-slate-500">Dự báo khả năng hoàn thành mục tiêu tháng/quý.</p>
            </div>
        </div>
      </div>

      {insight && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in duration-300">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <BrainCircuit size={18} className="text-blue-600" />
                Kết quả phân tích từ AI
            </h3>
          </div>
          <div className="p-8 prose prose-slate max-w-none">
             <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                {insight}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
