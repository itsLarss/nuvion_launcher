import {useEffect, useMemo, useState} from 'react';

import {
    Bell,
    Check,
    ChevronDown,
    Download,
    Edit3,
    Image as ImageIcon,
    LogOut,
    MessageCircle,
    Palette,
    Play,
    Plus,
    RefreshCw,
    Search,
    Settings,
    Trash2,
    Upload,
    User,
    UserPlus,
    Users
} from 'lucide-react';
import './App.css';

interface Version {
    id: string;
    name: string;
    type: 'vanilla' | 'fabric' | 'forge';
    releaseDate: string;
}

interface Profile {
    id: string;
    name: string;
    version: Version;
    lastPlayed?: string;
}

interface Friend {
    id: string;
    username: string;
    status: 'online' | 'offline' | 'ingame';
    avatar?: string;
    currentServer?: string;
}

interface Account {
    id: string;
    username: string;
    email: string;
    type: 'microsoft' | 'mojang';
    skin?: string;
}

interface NewsItem {
    id: number;
    title: string;
    description: string;
    tag: 'update' | 'announcement' | 'event';
    created_at: string;
    image_url?: string;
}


function App() {
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [showVersionSelector, setShowVersionSelector] = useState(false);
    const [activeTab, setActiveTab] = useState<'home' | 'news' | 'versions' | 'friends' | 'skins' | 'accounts' | 'settings'>('home');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const [newsSearch, setNewsSearch] = useState('');
    const [newsFilter, setNewsFilter] = useState<'all' | 'update' | 'announcement' | 'event'>('all');

    const [unreadCount, setUnreadCount] = useState(0);
    const [lastSeenNewsId, setLastSeenNewsId] = useState<number>(() => {
        const raw = localStorage.getItem('nuvion:lastSeenNewsId');
        return raw ? Number(raw) : 0;
    });

    const openNewsTab = () => {
        setActiveTab('news');

        // mark read: highest id as seen
        if (news && news.length > 0) {
            const maxId = Math.max(...news.map(n => n.id));
            setLastSeenNewsId(maxId);
            localStorage.setItem('nuvion:lastSeenNewsId', String(maxId));
        }
    };

    type Theme = 'nuvion' | 'purple' | 'green';

    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('nuvion:theme');
        return (stored as Theme) || 'nuvion';
    });

    useEffect(() => {
        document.documentElement.setAttribute(
            'data-theme',
            theme === 'nuvion' ? '' : theme
        );
        localStorage.setItem('nuvion:theme', theme);
    }, [theme]);



    const versions: Version[] = [
        {id: '1.20.4', name: '1.20.4', type: 'vanilla', releaseDate: '2023-12-07'},
        {id: '1.20.4-fabric', name: '1.20.4 Fabric', type: 'fabric', releaseDate: '2023-12-07'},
        {id: '1.19.4', name: '1.19.4', type: 'vanilla', releaseDate: '2023-03-14'},
        {id: '1.19.4-fabric', name: '1.19.4 Fabric', type: 'fabric', releaseDate: '2023-03-14'},
        {id: '1.18.2', name: '1.18.2', type: 'vanilla', releaseDate: '2022-02-28'},
        {id: '1.18.2-fabric', name: '1.18.2 Fabric', type: 'fabric', releaseDate: '2022-02-28'},
        {id: '1.16.5', name: '1.16.5', type: 'vanilla', releaseDate: '2021-01-15'},
        {id: '1.16.5-fabric', name: '1.16.5 Fabric', type: 'fabric', releaseDate: '2021-01-15'},
        {id: '1.8.9', name: '1.8.9', type: 'vanilla', releaseDate: '2015-12-09'},
    ];

    const [profiles] = useState<Profile[]>([
        {id: '1', name: 'Latest Release', version: versions[0], lastPlayed: '2 hours ago'},
        {id: '2', name: 'PvP Practice', version: versions[8], lastPlayed: 'Yesterday'},
        {id: '3', name: 'Modded 1.20.4', version: versions[1], lastPlayed: '3 days ago'},
    ]);

    const [friends] = useState<Friend[]>([
        {id: '1', username: 'ShadowNinja', status: 'online', currentServer: 'Hypixel'},
        {id: '2', username: 'CreeperKing', status: 'ingame', currentServer: 'Practice PvP'},
        {id: '3', username: 'DiamondMiner', status: 'online'},
        {id: '4', username: 'EnderDragon', status: 'offline'},
        {id: '5', username: 'NetherQueen', status: 'ingame', currentServer: 'BedWars'},
    ]);

    const [accounts] = useState<Account[]>([
        {id: '1', username: 'MainAccount', email: 'main@example.com', type: 'microsoft'},
        {id: '2', username: 'AltAccount1', email: 'alt1@example.com', type: 'microsoft'},
        {id: '3', username: 'PvPAlt', email: 'pvp@example.com', type: 'mojang'},
    ]);

    const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '')
        || 'https://api.eldorionmc.de';

    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [newsError, setNewsError] = useState<string | null>(null);

    useEffect(() => {
        console.log("API_BASE =", API_BASE);
        console.log("Fetching =", `${API_BASE}/api/news`);

        let cancelled = false;

        (async () => {
            try {
                setNewsLoading(true);
                setNewsError(null);

                const res = await fetch(`${API_BASE}/api/news`, {
                    headers: {'Accept': 'application/json'},
                });

                if (!res.ok) {
                    const txt = await res.text().catch(() => '');
                    throw new Error(`News API ${res.status}: ${txt}`);
                }

                const data = (await res.json()) as NewsItem[];

                if (cancelled) return;
                setNews(data);
            } catch (e: any) {
                if (cancelled) return;
                setNewsError(e?.message ?? 'Failed to load news');
                setNews([]); // optional
            } finally {
                if (cancelled) return;
                setNewsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [API_BASE]);

    useEffect(() => {
        if (!news || news.length === 0) {
            setUnreadCount(0);
            return;
        }
        const maxId = Math.max(...news.map(n => n.id));
        const unread = news.filter(n => n.id > lastSeenNewsId).length;
        setUnreadCount(unread);

        // Optional: wenn lastSeenNewsId > maxId (DB reset), dann korrigieren
        if (lastSeenNewsId > maxId) {
            setLastSeenNewsId(0);
            localStorage.setItem('nuvion:lastSeenNewsId', '0');
        }
    }, [news, lastSeenNewsId]);

    const filteredNews = useMemo(() => {
        const q = newsSearch.trim().toLowerCase();

        return news
            .map(item => {
                const mappedTag = (['update', 'announcement', 'event'].includes(item.tag) ? item.tag : 'announcement') as 'update' | 'announcement' | 'event';
                return {...item, tag: mappedTag};
            })
            .filter(item => newsFilter === 'all' ? true : item.tag === newsFilter)
            .filter(item => {
                if (!q) return true;
                return (
                    item.title.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q) ||
                    item.tag.toLowerCase().includes(q)
                );
            });
    }, [news, newsSearch, newsFilter]);

    const getVersionBadgeColor = (type: string) => {
        switch (type) {
            case 'vanilla':
                return 'from-emerald-400 to-cyan-500';
            case 'fabric':
                return 'from-cyan-400 to-blue-500';
            case 'forge':
                return 'from-orange-400 to-red-500';
            default:
                return 'from-gray-400 to-gray-500';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'bg-emerald-400';
            case 'ingame':
                return 'bg-cyan-400';
            case 'offline':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getTagColor = (tag: string) => {
        switch (tag) {
            case 'update':
                return 'from-cyan-400 to-blue-500';
            case 'announcement':
                return 'from-purple-400 to-pink-500';
            case 'event':
                return 'from-orange-400 to-red-500';
            default:
                return 'from-gray-400 to-gray-500';
        }
    };

            return (<div className="min-h-screen text-white font-sans" style={{
                backgroundImage: `linear-gradient(to bottom right,
                rgb(var(--bg-from)),
                rgb(var(--bg-via)),
                rgb(var(--bg-to)))`
            }}>
            {/* Animated Background with Nuvion Theme */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse-slow"></div>
                <div
                    className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/2 -right-48 animate-pulse-slow delay-1000"></div>
                <div
                    className="absolute w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl -bottom-48 left-1/2 animate-pulse-slow delay-2000"></div>

                {/* Geometric patterns inspired by banner */}
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-cyan-400 rotate-45 animate-spin-slow"></div>
                    <div
                        className="absolute top-3/4 right-1/4 w-24 h-24 border-2 border-blue-400 rotate-12 animate-pulse"></div>
                </div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 flex h-screen">
                {/* Sidebar */}
                <div
                    className="w-20 bg-slate-900/50 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] border-r border-cyan-500/20 flex flex-col items-center py-6 gap-4">
                    {/* Logo - Triangle inspired by Nuvion icon */}
                    <div
                        className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/50 mb-6 relative overflow-hidden group cursor-pointer">
                        <div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <div className="relative">
                            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor"
                                 strokeWidth="2">
                                <path d="M12 2 L22 20 L2 20 Z"/>
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab('home')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${
                            activeTab === 'home'
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                                : 'bg-slate-800/50 hover:bg-slate-700/50'
                        }`}
                    >
                        <Play size={20}/>
                        {activeTab === 'home' && (
                            <div
                                className="absolute -right-1 w-1 h-8 bg-gradient-to-b style={{
  backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
}}
 rounded-l-full"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('versions')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                            activeTab === 'versions'
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                                : 'bg-slate-800/50 hover:bg-slate-700/50'
                        }`}
                    >
                        <Download size={20}/>
                        {activeTab === 'versions' && (
                            <div
                                className="absolute -right-1 w-1 h-8 bg-gradient-to-b style={{
  backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
}}
 rounded-l-full"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                            activeTab === 'friends'
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                                : 'bg-slate-800/50 hover:bg-slate-700/50'
                        }`}
                    >
                        <Users size={20}/>
                        {friends.filter(f => f.status !== 'offline').length > 0 && (
                            <div
                                className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                        )}
                        {activeTab === 'friends' && (
                            <div
                                className="absolute -right-1 w-1 h-8 bg-gradient-to-b style={{
  backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
}}
 rounded-l-full"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('skins')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                            activeTab === 'skins'
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                                : 'bg-slate-800/50 hover:bg-slate-700/50'
                        }`}
                    >
                        <Palette size={20}/>
                        {activeTab === 'skins' && (
                            <div
                                className="absolute -right-1 w-1 h-8 bg-gradient-to-b style={{
  backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
}}
 rounded-l-full"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                            activeTab === 'accounts'
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                                : 'bg-slate-800/50 hover:bg-slate-700/50'
                        }`}
                    >
                        <RefreshCw size={20}/>
                        {activeTab === 'accounts' && (
                            <div
                                className="absolute -right-1 w-1 h-8 bg-gradient-to-b style={{
  backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
}}
 rounded-l-full"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                            activeTab === 'settings'
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                                : 'bg-slate-800/50 hover:bg-slate-700/50'
                        }`}
                    >
                        <Settings size={20}/>
                        {activeTab === 'settings' && (
                            <div
                                className="absolute -right-1 w-1 h-8 bg-gradient-to-b style={{
  backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
}}
 rounded-l-full"></div>
                        )}
                    </button>

                    <div
                        className="mt-auto w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-all group relative">
                        <User size={20}/>
                        <div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br style={{
  backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
}}
 rounded-full border-2 border-slate-900"></div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div
                        className="h-16 bg-slate-950/60 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] border-b border-cyan-500/20 flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl text-white font-bold bg-gradient-to-r style={{
  backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
}}
 bg-clip-text text-transparent">
                                Nuvion Client
                            </h1>
                            <span
                                className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                                v0.0.8-beta
                            </span>
                        </div>
                        {/*News Section*/}
                        <button
                            onClick={openNewsTab}
                            className="p-2 hover:bg-slate-800/50 rounded-lg transition-all relative"
                            title="News"
                        >
                            {unreadCount > 0 && (
                                <div
                                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-cyan-400 text-slate-900 text-[11px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </div>
                            )}

                            <Bell size={20}/>
                            <div
                                className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        </button>

                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'home' && (
                            <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Quick Launch & Profiles */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Quick Launch Card */}
                                        <div
                                            className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-2xl p-6 border border-cyan-500/20 shadow-2xl shadow-cyan-500/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h2 className="text-2xl font-bold mb-1 text-white bg-gradient-to-r style={{
  backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
}}
 bg-clip-text text-transparent">
                                                        Quick Launch
                                                    </h2>
                                                    <p className="text-slate-300 text-sm">Select version and start
                                                        playing</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowVersionSelector(!showVersionSelector)}
                                                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all flex items-center gap-2 border border-cyan-500/20 text-sm"
                                                >
                                                    {selectedProfile ? selectedProfile.version.name : versions[0].name}
                                                    <ChevronDown size={16}
                                                                 className={`transition-transform ${showVersionSelector ? 'rotate-180' : ''}`}/>
                                                </button>
                                            </div>

                                            {showVersionSelector && (
                                                <div
                                                    className="mb-6 p-3 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl border border-cyan-500/20 max-h-48 overflow-y-auto custom-scrollbar">
                                                    <div className="grid gap-2">
                                                        {versions.map((version) => (
                                                            <button
                                                                key={version.id}
                                                                onClick={() => {
                                                                    setSelectedProfile(profiles[0]);
                                                                    setShowVersionSelector(false);
                                                                }}
                                                                className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all flex items-center justify-between group"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${getVersionBadgeColor(version.type)}`}></div>
                                                                    <span
                                                                        className="font-medium text-sm">{version.name}</span>
                                                                </div>
                                                                <span
                                                                    className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getVersionBadgeColor(version.type)} opacity-80`}>
                                  {version.type}
                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
                                                <Play size={24} fill="currentColor"/>
                                                Launch Minecraft
                                            </button>
                                        </div>

                                        {/* Profiles Grid */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl text-white font-bold">Your Profiles</h2>
                                                <button
                                                    className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all border border-cyan-500/30 text-sm flex items-center gap-2">
                                                    <Plus size={16}/>
                                                    New Profile
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {profiles.map((profile) => (
                                                    <div
                                                        key={profile.id}
                                                        onClick={() => setSelectedProfile(profile)}
                                                        className={`p-5 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                                                            selectedProfile?.id === profile.id
                                                                ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                                                                : 'border-slate-700/50 hover:border-slate-600/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div
                                                                className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                                                                <Play size={18} className="text-cyan-400"/>
                                                            </div>
                                                            <span
                                                                className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getVersionBadgeColor(profile.version.type)}`}>
                                {profile.version.type}
                              </span>
                                                        </div>

                                                        <h3 className="font-bold mb-1">{profile.name}</h3>
                                                        <p className="text-sm text-slate-300 mb-2">{profile.version.name}</p>
                                                        {profile.lastPlayed && (
                                                            <p className="text-xs text-slate-400">Last
                                                                played: {profile.lastPlayed}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - News Feed */}
                                    <div className="space-y-4 h-[calc(100vh-160px)] flex flex-col">
                                        <div className="flex items-center justify-between mb-2 shrink-0">
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                <Bell size={20} className="text-cyan-400" />
                                                Latest News
                                            </h2>
                                        </div>

                                        {/* Scroll-Container */}
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                            {newsLoading && (
                                                <div className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl p-4 border border-slate-700/50 text-slate-300 text-sm">
                                                    Lade News...
                                                </div>
                                            )}

                                            {!newsLoading && newsError && (
                                                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 text-red-300 text-sm">
                                                    News konnten nicht geladen werden: {newsError}
                                                </div>
                                            )}

                                            {!newsLoading && !newsError && news.length === 0 && (
                                                <div className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl p-4 border border-slate-700/50 text-slate-300 text-sm">
                                                    Keine News verfügbar.
                                                </div>
                                            )}

                                            {!newsLoading && !newsError && news.slice(0, 20).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getTagColor(item.tag)} text-xs font-medium flex-shrink-0`}>
                                                            {item.tag}
                                                        </div>
                                                        <span className="text-xs text-slate-400">
                                                            {new Date(item.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {item.image_url && (
                                                        <img
                                                            src="https://api.eldorionmc.de/uploads/news/News.png"
                                                            className="w-full h-32 object-cover"
                                                        />
                                                    )}
                                                    <h3 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-300 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer Button bleibt unten */}
                                        <button
                                            onClick={() => setActiveTab('news')}
                                            className="shrink-0 w-full py-3 bg-slate-800/40 hover:bg-slate-700/40 rounded-xl transition-all border border-slate-700/50 text-sm text-slate-300 hover:text-cyan-300"
                                        >
                                            View All News
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'news' && (
                            <div className="w-full max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col relative">
                                {/* Header + Controls (fix oben) */}
                                <div className="shrink-0 mb-6">
                                    <div className="flex items-start justify-between gap-6">
                                        <div>
                                            <h1
                                                className="text-3xl font-bold mb-1 bg-clip-text text-transparent"
                                                style={{
                                                    backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`,
                                                }}
                                            >
                                                News
                                            </h1>
                                            <p className="text-slate-300">Latest updates and announcements</p>
                                        </div>

                                        {/* Search + Filter rechts oben */}
                                        <div className="w-full max-w-xl flex flex-col gap-3">
                                            {/* Search */}
                                            <div className="relative">
                                                <Search
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300"
                                                    size={18}
                                                />
                                                <input
                                                    value={newsSearch}
                                                    onChange={(e) => setNewsSearch(e.target.value)}
                                                    placeholder="Search news..."
                                                    className="w-full pl-11 pr-4 py-3 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] border border-slate-700/50 rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                                />
                                            </div>

                                            {/* Filter chips */}
                                            <div className="flex flex-wrap gap-2">
                                                {(['all', 'update', 'announcement', 'event'] as const).map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setNewsFilter(t)}
                                                        className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                                                            newsFilter === t
                                                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                                                : 'bg-slate-800/30 text-slate-300 border-slate-700/50 hover:border-cyan-500/30'
                                                        }`}
                                                    >
                                                        {t === 'all' ? 'All' : t}
                                                    </button>
                                                ))}

                                                {(newsSearch || newsFilter !== 'all') && (
                                                    <button
                                                        onClick={() => {
                                                            setNewsSearch('');
                                                            setNewsFilter('all');
                                                        }}
                                                        className="px-4 py-2 rounded-xl text-sm border bg-slate-800/30 text-slate-300 border-slate-700/50 hover:border-cyan-500/30 transition-all"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scrollbarer Content-Bereich */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Main news list (scrollt innen) */}
                                        <div className="lg:col-span-2 h-full overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="space-y-3">
                                                {newsLoading && (
                                                    <div className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl p-4 border border-slate-700/50 text-slate-300 text-sm">
                                                        Lade News...
                                                    </div>
                                                )}

                                                {!newsLoading && newsError && (
                                                    <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 text-red-300 text-sm">
                                                        News konnten nicht geladen werden: {newsError}
                                                    </div>
                                                )}

                                                {!newsLoading && !newsError && news.length === 0 && (
                                                    <div className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl p-4 border border-slate-700/50 text-slate-300 text-sm">
                                                        Keine News verfügbar.
                                                    </div>
                                                )}

                                                {!newsLoading &&
                                                    !newsError &&
                                                    filteredNews.map((item) => {
                                                        const tag = (['update', 'announcement', 'event'].includes(item.tag)
                                                            ? item.tag
                                                            : 'announcement') as 'update' | 'announcement' | 'event';

                                                        const date = new Date(item.created_at).toLocaleString();

                                                        return (
                                                            <div
                                                                key={item.id}
                                                                className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-2xl p-5 border border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-pointer group"
                                                            >
                                                                <div className="flex items-center justify-between gap-3 mb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className={`px-3 py-1 rounded-full bg-gradient-to-r ${getTagColor(
                                                                                tag
                                                                            )} text-xs font-medium`}
                                                                        >
                                                                            {tag}
                                                                        </div>
                                                                        <span className="text-xs text-slate-400">{date}</span>
                                                                    </div>
                                                                </div>

                                                                <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                                                                    {item.title}
                                                                </h3>
                                                                <p className="text-sm text-slate-300">{item.description}</p>
                                                            </div>
                                                        );
                                                    })}

                                                {!newsLoading && !newsError && filteredNews.length === 0 && (
                                                    <div className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl p-4 border border-slate-700/50 text-slate-300 text-sm">
                                                        No results for your filter/search.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Side panel (sticky + eigener Scroll falls nötig) */}
                                        <div className="lg:col-span-1 h-full overflow-hidden">
                                            <div className="h-full lg:sticky lg:top-0 overflow-y-auto pr-2 custom-scrollbar">
                                                <div className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-2xl p-5 border border-cyan-500/20">
                                                    <h2 className="text-lg font-bold mb-2">Tip</h2>
                                                    <p className="text-sm text-slate-300">
                                                        Hier kannst du später Filter, Suche oder ein “Pinned News” Modul reinpacken.
                                                    </p>

                                                    <div className="mt-4 p-3 bg-slate-900/40 rounded-xl border border-slate-700/50 text-sm text-slate-300">
                                                        Unsere News sind die besten ^^
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Back Button immer sichtbar */}
                                <button
                                    onClick={() => setActiveTab('home')}
                                    className="fixed bottom-6 right-6 z-50 px-5 py-2.5 bg-slate-800/70 hover:bg-slate-700/70 rounded-xl border border-white/10 shadow-lg"
                                >
                                    Back
                                </button>
                            </div>
                        )}

                        {activeTab === 'friends' && (
                            <div className="max-w-6xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r style={{backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`}}bg-clip-text text-transparent">
                                            Friends
                                        </h1>
                                        <p className="text-slate-300">
                                            {friends.filter(f => f.status !== 'offline').length} online
                                            • {friends.length} total
                                        </p>
                                    </div>
                                    <button
                                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 font-medium">
                                        <UserPlus size={18}/>
                                        Add Friend
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="mb-6">
                                    <div className="relative">
                                        <Search
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-300"
                                            size={20}/>
                                        <input
                                            type="text"
                                            placeholder="Search friends..."
                                            className="w-full pl-12 pr-4 py-3 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] border border-slate-700/50 rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Friends List */}
                                <div className="grid gap-3">
                                    {friends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            className="p-5 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div className="relative">
                                                        <div
                                                            className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold">
                                                            {friend.username[0]}
                                                        </div>
                                                        <div
                                                            className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-slate-900`}></div>
                                                    </div>

                                                    {/* Info */}
                                                    <div>
                                                        <h3 className="font-bold text-lg">{friend.username}</h3>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            {friend.status === 'online' && (
                                                                <span className="text-emerald-400">Online</span>
                                                            )}
                                                            {friend.status === 'ingame' && friend.currentServer && (
                                                                <span
                                                                    className="text-cyan-400">Playing on {friend.currentServer}</span>
                                                            )}
                                                            {friend.status === 'offline' && (
                                                                <span className="text-slate-400">Offline</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div
                                                    className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all">
                                                        <MessageCircle size={18}/>
                                                    </button>
                                                    {friend.status === 'ingame' && (
                                                        <button
                                                            className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all text-sm font-medium">
                                                            Join
                                                        </button>
                                                    )}
                                                    <button
                                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                                                        <Trash2 size={18}/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'skins' && (
                            <div className="max-w-6xl mx-auto">
                                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r style={{backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`}}bg-clip-text text-transparent">
                                    Skin Changer
                                </h1>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Skin Preview */}
                                    <div className="lg:col-span-1">
                                        <div
                                            className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-2xl p-6 border border-cyan-500/20 sticky top-0">
                                            <h2 className="text-lg font-bold mb-4">Preview</h2>

                                            {/* 3D Skin Preview Placeholder */}
                                            <div
                                                className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden group">
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
                                                <User size={80} className="text-slate-600 relative z-10"/>
                                                <div
                                                    className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 text-center text-xs">
                                                    Current Skin
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <button
                                                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2">
                                                    <Upload size={18}/>
                                                    Upload Skin
                                                </button>
                                                <button
                                                    className="w-full py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                                                    <ImageIcon size={18}/>
                                                    Choose from Gallery
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skin Gallery */}
                                    <div className="lg:col-span-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold">Skin Gallery</h2>
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium border border-cyan-500/30">
                                                    Your Skins
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm transition-all">
                                                    Popular
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                                <div
                                                    key={i}
                                                    className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl p-3 border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer group"
                                                >
                                                    <div
                                                        className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                                                        <User size={40} className="text-slate-600"/>
                                                        <div
                                                            className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/20 transition-all"></div>
                                                    </div>
                                                    <p className="text-sm font-medium text-center">Skin {i}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'accounts' && (
                            <div className="max-w-5xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r style={{backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`}}bg-clip-text text-transparent">
                                            Account Manager
                                        </h1>
                                        <p className="text-slate-300">Switch between accounts seamlessly</p>
                                    </div>
                                    <button
                                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 font-medium">
                                        <Plus size={18}/>
                                        Add Account
                                    </button>
                                </div>

                                <div className="grid gap-4">
                                    {accounts.map((account) => (
                                        <div
                                            key={account.id}
                                            onClick={() => setSelectedAccount(account)}
                                            className={`p-6 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl border cursor-pointer transition-all ${
                                                selectedAccount?.id === account.id
                                                    ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                                                    : 'border-slate-700/50 hover:border-slate-600/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {/* Account Avatar */}
                                                    <div
                                                        className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl relative">
                                                        {account.username[0]}
                                                        {selectedAccount?.id === account.id && (
                                                            <div
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                                                                <Check size={14} className="text-slate-900"/>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Account Info */}
                                                    <div>
                                                        <h3 className="font-bold text-xl mb-1">{account.username}</h3>
                                                        <p className="text-sm text-slate-300 mb-1">{account.email}</p>
                                                        <div className="flex items-center gap-2">
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                  account.type === 'microsoft'
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {account.type === 'microsoft' ? 'Microsoft' : 'Mojang'}
                              </span>
                                                            {selectedAccount?.id === account.id && (
                                                                <span
                                                                    className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                  Active
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    {selectedAccount?.id !== account.id && (
                                                        <button
                                                            className="px-5 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all font-medium">
                                                            Switch
                                                        </button>
                                                    )}
                                                    <button
                                                        className="p-2.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all">
                                                        <Edit3 size={18}/>
                                                    </button>
                                                    <button
                                                        className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                                                        <LogOut size={18}/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Info Card */}
                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <div className="flex gap-3">
                                        <div
                                            className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <User size={16} className="text-blue-400"/>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-blue-400 mb-1">Account Security</h3>
                                            <p className="text-sm text-slate-300">
                                                Your account credentials are securely encrypted and stored locally. We
                                                never share your login information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'versions' && (
                            <div className="max-w-6xl mx-auto">
                                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r style={{backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`}}bg-clip-text text-transparent">
                                    Available Versions
                                </h1>

                                <div className="grid gap-3">
                                    {versions.map((version) => (
                                        <div
                                            key={version.id}
                                            className="p-6 bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${getVersionBadgeColor(version.type)} shadow-lg`}></div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{version.name}</h3>
                                                    <p className="text-sm text-slate-300">Released: {version.releaseDate}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                        <span
                            className={`text-xs px-4 py-2 rounded-full bg-gradient-to-r ${getVersionBadgeColor(version.type)}`}>
                          {version.type}
                        </span>
                                                <button
                                                    className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all border border-cyan-500/30 opacity-0 group-hover:opacity-100">
                                                    Install
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r style={{backgroundImage: `linear-gradient(to right, rgb(var(--accent-from)), rgb(var(--accent-to)))`}}bg-clip-text text-transparent">
                                    Settings
                                </h1>

                                <div className="space-y-6">
                                    {/* General Settings */}
                                    <div
                                        className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl p-6 border border-cyan-500/20">
                                        <h2 className="text-xl font-bold mb-4">General</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-slate-300 mb-2">Game
                                                    Directory</label>
                                                <input
                                                    type="text"
                                                    defaultValue="C:/Users/Player/.minecraft"
                                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-300 mb-2">Language</label>
                                                <select
                                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-all">
                                                    <option>English</option>
                                                    <option>Deutsch</option>
                                                    <option>Français</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Settings */}
                                    <div
                                        className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl p-6 border border-cyan-500/20">
                                        <h2 className="text-xl font-bold mb-4">Performance</h2>
                                        <div className="space-y-5">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="font-medium">Allocated RAM</label>
                                                    <span className="text-cyan-400 font-bold">4 GB</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="2"
                                                    max="16"
                                                    defaultValue="4"
                                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                                />
                                            </div>
                                            <div
                                                className="flex items-center justify-between p-4 bg-slate-950/60 rounded-lg">
                                                <div>
                                                    <p className="font-medium">GPU Acceleration</p>
                                                    <p className="text-sm text-slate-300">Better performance for modern
                                                        GPUs</p>
                                                </div>
                                                <button
                                                    className="w-14 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full relative shadow-lg shadow-cyan-500/30">
                                                    <div
                                                        className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow"></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appearance */}
                                    <div
                                        className="bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] bg-[rgb(var(--surface-1))]/70 border border-[rgb(var(--border-soft))] rounded-xl p-6 border border-cyan-500/20">
                                        <h2 className="text-xl font-bold mb-4">Theme</h2>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button
                                                onClick={() => setTheme('nuvion')}
                                                className={`p-5 rounded-xl transition-all ${
                                                    theme === 'nuvion'
                                                        ? 'ring-2 ring-cyan-400'
                                                        : 'opacity-60 hover:opacity-100'
                                                }`}
                                                style={{
                                                    backgroundImage: `linear-gradient(to bottom right, rgb(var(--accent-from)), rgb(var(--accent-to)))`
                                                }}
                                            >
                                                <div className="text-sm font-medium mb-1">Nuvion</div>
                                                <div className="text-xs opacity-80">Default</div>
                                            </button>

                                            <button
                                                onClick={() => setTheme('purple')}
                                                className={`p-5 rounded-xl transition-all ${
                                                    theme === 'purple'
                                                        ? 'ring-2 ring-purple-400'
                                                        : 'opacity-60 hover:opacity-100'
                                                }`}
                                                style={{
                                                    backgroundImage: 'linear-gradient(to bottom right, rgb(192 132 252), rgb(236 72 153))'
                                                }}
                                            >
                                                <div className="text-sm font-medium mb-1">Purple</div>
                                                <div className="text-xs opacity-80">Violet vibes</div>
                                            </button>

                                            <button
                                                onClick={() => setTheme('green')}
                                                className={`p-5 rounded-xl transition-all ${
                                                    theme === 'green'
                                                        ? 'ring-2 ring-emerald-400'
                                                        : 'opacity-60 hover:opacity-100'
                                                }`}
                                                style={{
                                                    backgroundImage: 'linear-gradient(to bottom right, rgb(52 211 153), rgb(34 197 94))'
                                                }}
                                            >
                                                <div className="text-sm font-medium mb-1">Green</div>
                                                <div className="text-xs opacity-80">Fresh & clean</div>
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;