import { ArrowRight, CheckCircle2, Database, ExternalLink, FileCheck, Github, Lock, Shield, Zap, MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const navigation=useNavigate()
  const goToApp=()=>{
    navigation("http://localhost:8080/")
  }

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Blockchain Security",
      description: "Immutable evidence storage on Ethereum blockchain ensures data integrity and prevents tampering"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "IPFS Storage",
      description: "Decentralized file storage via Pinata ensures maximum reliability and availability"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Role-Based Access",
      description: "Granular permissions for police officers and court officials with secure authentication"
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Tamper-Proof",
      description: "Cryptographic verification of all evidence submissions with complete audit trails"
    }
  ];

  const benefits = [
    "Complete chain of custody tracking",
    "Real-time evidence verification",
    "Secure multi-party collaboration",
    "Automated compliance reporting"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-pink-950/20" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, rgba(59, 130, 246, 0.15), transparent 50%)`,
            transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${50 - mousePos.x * 15}% ${50 - mousePos.y * 15}%, rgba(168, 85, 247, 0.15), transparent 50%)`,
            transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>

      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 opacity-20 mix-blend-overlay pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <Shield className="w-9 h-9 text-blue-400 transition-transform duration-700 group-hover:rotate-[360deg]" />
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TrustChain-EMS
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">Features</a>
            <a href="#benefits" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">Benefits</a>
            <Link to="/legal-chatbot" className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-medium hover:bg-white/20 transition-all duration-300">
              <MessageCircle className="w-4 h-4" />
              <span>Legal Chatbot</span>
            </Link>
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105" onClick={goToApp}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 px-6 pt-40 pb-32 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* Badge */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm text-blue-300 font-medium">Decentralized Evidence Management</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-12">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight leading-none">
              <div 
                className="inline-block mb-4"
                style={{
                  transform: `translateY(${scrollY * 0.2}px)`,
                  opacity: Math.max(0, 1 - scrollY * 0.002)
                }}
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Secure
                </span>
              </div>
              <br />
              <div 
                className="inline-block mb-4"
                style={{
                  transform: `translateY(${scrollY * 0.15}px)`,
                  opacity: Math.max(0, 1 - scrollY * 0.002)
                }}
              >
                <span className="text-white">Evidence</span>
              </div>
              <br />
              <div 
                className="inline-block"
                style={{
                  transform: `translateY(${scrollY * 0.1}px)`,
                  opacity: Math.max(0, 1 - scrollY * 0.002)
                }}
              >
                <span className="text-gray-600">Forever</span>
              </div>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionary blockchain-based system that ensures <span className="text-blue-400">immutable</span>, 
              <span className="text-purple-400"> transparent</span>, and 
              <span className="text-pink-400"> secure</span> management of digital evidence.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25" onClick={goToApp}>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Launch Application</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
              <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center space-x-2">
                <Github className="w-5 h-5" />
                <span>View Source</span>
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-6xl mx-auto">
            <div 
              className="relative transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1500px) rotateX(${mousePos.y * 3}deg) rotateY(${mousePos.x * 3}deg) translateZ(0)`
              }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
              
              {/* Main container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-2 rounded-3xl border border-white/10">
                <div className="bg-[#0f0f14] rounded-2xl overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1f] border-b border-white/5">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 mx-4 px-4 py-1.5 bg-[#0f0f14] rounded-lg text-xs text-gray-500 font-mono">
                      trustchain-ems.eth
                    </div>
                    <div className="w-20" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative aspect-video">
                    <img 
                      src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1400&h=800&fit=crop&q=90" 
                      alt="Dashboard Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-transparent to-transparent" />
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div 
                className="absolute -left-16 top-1/4 hidden lg:block"
                style={{
                  transform: `translateY(${Math.sin(Date.now() / 2000) * 10}px)`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-5 shadow-2xl">
                  <div className="text-4xl font-black text-blue-400 mb-1">100%</div>
                  <div className="text-sm text-gray-300">Immutable</div>
                </div>
              </div>
              
              <div 
                className="absolute -right-16 top-1/3 hidden lg:block"
                style={{
                  transform: `translateY(${Math.sin(Date.now() / 2500) * 10}px)`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-5 shadow-2xl">
                  <div className="text-4xl font-black text-purple-400 mb-1">24/7</div>
                  <div className="text-sm text-gray-300">Accessible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-sm text-purple-300 font-medium">FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Powerful By Design
              </span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Built with cutting-edge blockchain technology for uncompromising security
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 mb-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 px-6 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-3xl p-12 md:p-16 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <Zap className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
                <h2 className="text-4xl md:text-5xl font-black mb-4">Why Choose TrustChain-EMS?</h2>
                <p className="text-gray-400 text-lg">
                  The most advanced evidence management platform
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {benefits.map((benefit, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-white font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <button className="group relative px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25" onClick={goToApp}>
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Start Your Journey</span>
                    <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <Shield className="w-7 h-7 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TrustChain-EMS
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>© 2025 TrustChain-EMS. Securing justice with blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}