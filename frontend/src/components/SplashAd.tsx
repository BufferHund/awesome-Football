import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Crown, Zap, Star } from 'lucide-react';

interface SplashAdProps {
  onClose: () => void;
}

const SplashAd = ({ onClose }: SplashAdProps) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [canSkip, setCanSkip] = useState(false);
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    // 倒计时
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 3秒后自动关闭视频，显示会员服务
    const videoTimer = setTimeout(() => {
      setShowVideo(false);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(videoTimer);
    };
  }, []);

  const handleSkip = () => {
    if (canSkip) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-green-900 via-green-700 to-emerald-900 overflow-hidden">
      {/* 动态背景粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* 跳过按钮（右上角） */}
      <button
        onClick={handleSkip}
        disabled={!canSkip}
        className={`absolute top-6 right-6 z-50 px-6 py-3 rounded-full font-medium transition-all ${
          canSkip
            ? 'bg-white text-green-700 hover:bg-gray-100 cursor-pointer'
            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
        }`}
      >
        {canSkip ? (
          <span className="flex items-center gap-2">
            <X className="w-4 h-4" />
            跳过广告
          </span>
        ) : (
          <span>{countdown}秒后可跳过</span>
        )}
      </button>

      {/* 视频广告区域 */}
      {showVideo && (
        <div className="absolute inset-0 flex items-center justify-center p-8 animate-fade-in">
          <div className="max-w-4xl w-full">
            {/* 视频播放器 */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
              <video
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"
              >
                {/* 如果有视频源，在这里添加 */}
                <source src="" type="video/mp4" />
              </video>

              {/* 视频遮罩 - 显示宣传信息 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-8">
                <div className="text-center text-white">
                  <h2 className="text-4xl font-bold mb-2 animate-slide-up">
                    懂球帝 Pro
                  </h2>
                  <p className="text-xl opacity-90 animate-slide-up animation-delay-200">
                    开启全新足球观赛体验
                  </p>
                </div>
              </div>
            </div>

            {/* 广告标识（符合广告法） */}
            <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded">
              广告
            </div>
          </div>
        </div>
      )}

      {/* 会员服务展示（3秒后显示） */}
      {!showVideo && (
        <div className="absolute inset-0 flex items-center justify-center p-8 animate-fade-in">
          <div className="max-w-6xl w-full">
            {/* Logo和标题 */}
            <div className="text-center mb-12 animate-slide-up">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-2xl animate-bounce-slow">
                {/* 足球SVG动画 */}
                <svg className="w-16 h-16 text-green-600 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                懂球帝 Pro 会员
              </h1>
              <p className="text-2xl text-green-200">
                解锁全部高级功能，畅享足球世界
              </p>
            </div>

            {/* 会员特权卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* 特权1 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 animate-slide-up animation-delay-100">
                <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-4 mx-auto">
                  <Crown className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 text-center">
                  无广告体验
                </h3>
                <p className="text-green-100 text-center">
                  畅享纯净观赛，专注足球本身
                </p>
              </div>

              {/* 特权2 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 animate-slide-up animation-delay-200">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-400 rounded-full mb-4 mx-auto">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 text-center">
                  实时数据
                </h3>
                <p className="text-green-100 text-center">
                  最快的比分更新，领先一步
                </p>
              </div>

              {/* 特权3 */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 animate-slide-up animation-delay-300">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-400 rounded-full mb-4 mx-auto">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 text-center">
                  专属内容
                </h3>
                <p className="text-green-100 text-center">
                  独家分析、战术解读、球员访谈
                </p>
              </div>
            </div>

            {/* CTA按钮 */}
            <div className="flex items-center justify-center gap-4 animate-slide-up animation-delay-400">
              <button
                onClick={() => {
                  onClose();
                  navigate('/membership');
                }}
                className="px-8 py-4 bg-white text-green-700 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl"
              >
                立即开通会员
              </button>
              <button
                onClick={onClose}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all"
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部法律声明 */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-xs">
        本广告仅为功能展示 · 符合《互联网广告管理办法》
      </div>

      {/* 自定义动画样式 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(5px); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashAd;
