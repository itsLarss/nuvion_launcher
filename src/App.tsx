import { motion } from 'framer-motion';

function App() {
    const isLoggedIn = false; // Später echte Logik
    const username = isLoggedIn ? 'DeinName' : 'No Login';
    const skinUrl = isLoggedIn ? 'https://mc-heads.net/avatar/dein-uuid/48' : 'https://mc-heads.net/avatar/steve/48';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-950 to-black text-white flex flex-col">
            {/* Titlebar */}
            <div className="h-10 bg-black/80 backdrop-blur-md flex items-center px-4 justify-between cursor-move drag">
                <span className="text-lg font-bold">Nuvion Launcher</span>
                <div className="flex gap-2 no-drag">
                    <button className="w-8 h-8 hover:bg-white/10 rounded-full text-gray-300 hover:text-white">-</button>
                    <button className="w-8 h-8 hover:bg-white/10 rounded-full text-gray-300 hover:text-white">□</button>
                    <button className="w-8 h-8 hover:bg-red-600/80 rounded-full text-gray-300 hover:text-white">×</button>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Sidebar links */}
                <div className="w-64 bg-black/70 backdrop-blur-lg border-r border-cyan-900/40 flex flex-col p-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shadow-cyan-500/50">
                            N
                        </div>
                        <span className="text-xl font-bold">Nuvion</span>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-cyan-900/30 transition text-cyan-200 hover:text-white">Home</button>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-cyan-900/30 transition text-cyan-200 hover:text-white">News</button>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-cyan-900/30 transition text-cyan-200 hover:text-white">Mods</button>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-cyan-900/30 transition text-cyan-200 hover:text-white">Skins</button>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-cyan-900/30 transition text-cyan-200 hover:text-white">Freunde</button>
                        <div className="flex-1"></div>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-cyan-900/30 transition bg-cyan-900/40 text-white font-medium">Settings</button>
                    </nav>
                </div>

                {/* Hauptbereich – alles zentriert */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                    {/* Login oben rechts */}
                    <div className="absolute top-4 right-8 bg-gradient-to-r from-orange-600 to-amber-600 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 cursor-pointer shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-400/50">
                            <img src={skinUrl} alt="Skin" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-white">{username}</span>
                    </div>

                    {/* Zentrierter Content */}
                    <div className="text-center max-w-xl">
                        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                            Nuvion Launcher
                        </h1>

                        <p className="text-xl text-cyan-200 mb-12 drop-shadow-md">
                            Bereit (Offline-Modus möglich)
                        </p>

                        <div className="flex flex-col items-center gap-8">
                            <select className="w-80 px-6 py-4 bg-black/60 border border-cyan-700/50 rounded-xl text-white text-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition">
                                <option>1.21.1</option>
                                <option>1.20.6</option>
                                <option>1.19.4</option>
                            </select>

                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 180, 255, 0.6)" }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                className="px-16 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-3xl font-bold shadow-2xl shadow-cyan-600/50 hover:shadow-cyan-700/70 transition"
                            >
                                LAUNCH
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;