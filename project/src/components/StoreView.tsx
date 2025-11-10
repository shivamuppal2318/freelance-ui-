import { ShoppingBag, Tag, Truck, Shield } from 'lucide-react';

export default function StoreView() {
  return (
    <div className="min-h-screen bg-[#1D1D1D] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#2D2D2D] p-8">
          <div className="w-20 h-20 bg-[#F7630C] mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-light text-white mb-4">Store Coming Soon</h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light">
            Get ready for an exclusive marketplace where you can sell your books, merchandise, 
            and digital products directly to your readers. Everything you need to monetize your creativity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#3D3D3D] p-4 border border-[#F7630C]/30">
              <Tag className="w-8 h-8 text-[#F7630C] mx-auto mb-2" />
              <h3 className="font-light text-white mb-1">Digital Products</h3>
              <p className="text-sm text-gray-400 font-light">eBooks, courses, and more</p>
            </div>
            <div className="bg-[#3D3D3D] p-4 border border-[#F7630C]/30">
              <Truck className="w-8 h-8 text-[#F7630C] mx-auto mb-2" />
              <h3 className="font-light text-white mb-1">Physical Goods</h3>
              <p className="text-sm text-gray-400 font-light">Merchandise and signed copies</p>
            </div>
            <div className="bg-[#3D3D3D] p-4 border border-[#F7630C]/30">
              <Shield className="w-8 h-8 text-[#F7630C] mx-auto mb-2" />
              <h3 className="font-light text-white mb-1">Secure Payments</h3>
              <p className="text-sm text-gray-400 font-light">Safe and reliable transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}