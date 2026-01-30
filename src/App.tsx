import { useState } from 'react';
import { Play, Settings, User, Download, ChevronDown, Users, MessageCircle, Plus, Upload, RefreshCw, Bell, Search, Check, UserPlus, Trash2, Edit3, Image as ImageIcon, LogOut, Palette } from 'lucide-react';
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
    id: string;
    title: string;
    description: string;
    date: string;
    image?: string;
    tag: 'update' | 'announcement' | 'event';
}

function App() {
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [showVersionSelector, setShowVersionSelector] = useState(false);
    const [activeTab, setActiveTab] = useState<'home' | 'versions' | 'friends' | 'skins' | 'accounts' | 'settings'>('home');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const versions: Version[] = [
        { id: '1.20.4', name: '1.20.4', type: 'vanilla', releaseDate: '2023-12-07' },
        { id: '1.20.4-fabric', name: '1.20.4 Fabric', type: 'fabric', releaseDate: '2023-12-07' },
        { id: '1.19.4', name: '1.19.4', type: 'vanilla', releaseDate: '2023-03-14' },
        { id: '1.19.4-fabric', name: '1.19.4 Fabric', type: 'fabric', releaseDate: '2023-03-14' },
        { id: '1.18.2', name: '1.18.2', type: 'vanilla', releaseDate: '2022-02-28' },
        { id: '1.18.2-fabric', name: '1.18.2 Fabric', type: 'fabric', releaseDate: '2022-02-28' },
        { id: '1.16.5', name: '1.16.5', type: 'vanilla', releaseDate: '2021-01-15' },
        { id: '1.16.5-fabric', name: '1.16.5 Fabric', type: 'fabric', releaseDate: '2021-01-15' },
        { id: '1.8.9', name: '1.8.9', type: 'vanilla', releaseDate: '2015-12-09' },
    ];

    const [profiles] = useState<Profile[]>([
        { id: '1', name: 'Latest Release', version: versions[0], lastPlayed: '2 hours ago' },
        { id: '2', name: 'PvP Practice', version: versions[8], lastPlayed: 'Yesterday' },
        { id: '3', name: 'Modded 1.20.4', version: versions[1], lastPlayed: '3 days ago' },
    ]);

    const [friends] = useState<Friend[]>([
        { id: '1', username: 'ShadowNinja', status: 'online', currentServer: 'Hypixel' },
        { id: '2', username: 'CreeperKing', status: 'ingame', currentServer: 'Practice PvP' },
        { id: '3', username: 'DiamondMiner', status: 'online' },
        { id: '4', username: 'EnderDragon', status: 'offline' },
        { id: '5', username: 'NetherQueen', status: 'ingame', currentServer: 'BedWars' },
    ]);

    const [accounts] = useState<Account[]>([
        { id: '1', username: 'MainAccount', email: 'main@example.com', type: 'microsoft' },
        { id: '2', username: 'AltAccount1', email: 'alt1@example.com', type: 'microsoft' },
        { id: '3', username: 'PvPAlt', email: 'pvp@example.com', type: 'mojang' },
    ]);

    const [news] = useState<NewsItem[]>([
        {
            id: '1',
            title: 'Nuvion Client v2.5 Released!',
            description: 'New performance optimizations, custom cosmetics, and bug fixes. Download now for the best experience!',
            date: '2 hours ago',
            tag: 'update'
        },
        {
            id: '2',
            title: 'Winter Event Starting Soon',
            description: 'Join our winter event starting next week! Exclusive cosmetics and rewards available.',
            date: '1 day ago',
            tag: 'event'
        },
        {
            id: '3',
            title: 'New Server Partnership',
            description: 'We partnered with HyperPvP! Get exclusive perks when using Nuvion Client.',
            date: '3 days ago',
            tag: 'announcement'
        },
    ]);

    const getVersionBadgeColor = (type: string) => {
        switch(type) {
            case 'vanilla': return 'from-emerald-400 to-cyan-500';
            case 'fabric': return 'from-cyan-400 to-blue-500';
            case 'forge': return 'from-orange-400 to-red-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'online': return 'bg-emerald-400';
            case 'ingame': return 'bg-cyan-400';
            case 'offline': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getTagColor = (tag: string) => {
        switch(tag) {
            case 'update': return 'from-cyan-400 to-blue-500';
            case 'announcement': return 'from-purple-400 to-pink-500';
            case 'event': return 'from-orange-400 to-red-500';
            default: return 'from-gray-400 to-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white font-sans">
            {/* Animated Background with Nuvion Theme */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse-slow"></div>
                <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/2 -right-48 animate-pulse-slow delay-1000"></div>
                <div className="absolute w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -bottom-48 left-1/2 animate-pulse-slow delay-2000"></div>

                {/* Geometric patterns inspired by banner */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-cyan-400 rotate-45 animate-spin-slow"></div>
                    <div className="absolute top-3/4 right-1/4 w-24 h-24 border-2 border-blue-400 rotate-12 animate-pulse"></div>
                </div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 flex h-screen">
                {/* Sidebar */}
                <div className="w-20 bg-slate-900/50 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col items-center py-6 gap-4">
                    {/* Logo - Triangle inspired by Nuvion icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/50 mb-6 relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <div className="relative">
                            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2 L22 20 L2 20 Z" />
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
                        <Play size={20} />
                        {activeTab === 'home' && (
                            <div className="absolute -right-1 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-full"></div>
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
                        <Download size={20} />
                        {activeTab === 'versions' && (
                            <div className="absolute -right-1 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-full"></div>
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
                        <Users size={20} />
                        {friends.filter(f => f.status !== 'offline').length > 0 && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                        )}
                        {activeTab === 'friends' && (
                            <div className="absolute -right-1 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-full"></div>
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
                        <Palette size={20} />
                        {activeTab === 'skins' && (
                            <div className="absolute -right-1 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-full"></div>
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
                        <RefreshCw size={20} />
                        {activeTab === 'accounts' && (
                            <div className="absolute -right-1 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-full"></div>
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
                        <Settings size={20} />
                        {activeTab === 'settings' && (
                            <div className="absolute -right-1 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-full"></div>
                        )}
                    </button>

                    <div className="mt-auto w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-all group relative">
                        <User size={20} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div className="h-16 bg-slate-900/30 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Nuvion Client
                            </h1>
                            <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                v2.5.0
              </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-all relative">
                                <Bell size={20} />
                                <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            </button>
                            <div className="w-px h-6 bg-slate-700"></div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-sm">{selectedAccount?.username || accounts[0].username}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'home' && (
                            <div className="max-w-7xl mx-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Quick Launch & Profiles */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Quick Launch Card */}
                                        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 shadow-2xl shadow-cyan-500/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                                        Quick Launch
                                                    </h2>
                                                    <p className="text-slate-400 text-sm">Select version and start playing</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowVersionSelector(!showVersionSelector)}
                                                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all flex items-center gap-2 border border-cyan-500/20 text-sm"
                                                >
                                                    {selectedProfile ? selectedProfile.version.name : versions[0].name}
                                                    <ChevronDown size={16} className={`transition-transform ${showVersionSelector ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>

                                            {showVersionSelector && (
                                                <div className="mb-6 p-3 bg-slate-900/60 rounded-xl border border-cyan-500/20 max-h-48 overflow-y-auto custom-scrollbar">
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
                                                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getVersionBadgeColor(version.type)}`}></div>
                                                                    <span className="font-medium text-sm">{version.name}</span>
                                                                </div>
                                                                <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getVersionBadgeColor(version.type)} opacity-80`}>
                                  {version.type}
                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
                                                <Play size={24} fill="currentColor" />
                                                Launch Minecraft
                                            </button>
                                        </div>

                                        {/* Profiles Grid */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl font-bold">Your Profiles</h2>
                                                <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all border border-cyan-500/30 text-sm flex items-center gap-2">
                                                    <Plus size={16} />
                                                    New Profile
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {profiles.map((profile) => (
                                                    <div
                                                        key={profile.id}
                                                        onClick={() => setSelectedProfile(profile)}
                                                        className={`p-5 bg-slate-800/40 backdrop-blur-xl rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                                                            selectedProfile?.id === profile.id
                                                                ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                                                                : 'border-slate-700/50 hover:border-slate-600/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                                                                <Play size={18} className="text-cyan-400" />
                                                            </div>
                                                            <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getVersionBadgeColor(profile.version.type)}`}>
                                {profile.version.type}
                              </span>
                                                        </div>

                                                        <h3 className="font-bold mb-1">{profile.name}</h3>
                                                        <p className="text-sm text-slate-400 mb-2">{profile.version.name}</p>
                                                        {profile.lastPlayed && (
                                                            <p className="text-xs text-slate-500">Last played: {profile.lastPlayed}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - News Feed */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                <Bell size={20} className="text-cyan-400" />
                                                Latest News
                                            </h2>
                                        </div>

                                        <div className="space-y-3">
                                            {news.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getTagColor(item.tag)} text-xs font-medium flex-shrink-0`}>
                                                            {item.tag}
                                                        </div>
                                                        <span className="text-xs text-slate-500">{item.date}</span>
                                                    </div>

                                                    <h3 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-400 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <button className="w-full py-3 bg-slate-800/40 hover:bg-slate-700/40 rounded-xl transition-all border border-slate-700/50 text-sm text-slate-400 hover:text-cyan-400">
                                            View All News
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'friends' && (
                            <div className="max-w-6xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                            Friends
                                        </h1>
                                        <p className="text-slate-400">
                                            {friends.filter(f => f.status !== 'offline').length} online • {friends.length} total
                                        </p>
                                    </div>
                                    <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 font-medium">
                                        <UserPlus size={18} />
                                        Add Friend
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search friends..."
                                            className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Friends List */}
                                <div className="grid gap-3">
                                    {friends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            className="p-5 bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold">
                                                            {friend.username[0]}
                                                        </div>
                                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-slate-900`}></div>
                                                    </div>

                                                    {/* Info */}
                                                    <div>
                                                        <h3 className="font-bold text-lg">{friend.username}</h3>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            {friend.status === 'online' && (
                                                                <span className="text-emerald-400">Online</span>
                                                            )}
                                                            {friend.status === 'ingame' && friend.currentServer && (
                                                                <span className="text-cyan-400">Playing on {friend.currentServer}</span>
                                                            )}
                                                            {friend.status === 'offline' && (
                                                                <span className="text-slate-500">Offline</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all">
                                                        <MessageCircle size={18} />
                                                    </button>
                                                    {friend.status === 'ingame' && (
                                                        <button className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all text-sm font-medium">
                                                            Join
                                                        </button>
                                                    )}
                                                    <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                                                        <Trash2 size={18} />
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
                                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Skin Changer
                                </h1>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Skin Preview */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 sticky top-0">
                                            <h2 className="text-lg font-bold mb-4">Preview</h2>

                                            {/* 3D Skin Preview Placeholder */}
                                            <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
                                                <User size={80} className="text-slate-600 relative z-10" />
                                                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 text-center text-xs">
                                                    Current Skin
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2">
                                                    <Upload size={18} />
                                                    Upload Skin
                                                </button>
                                                <button className="w-full py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                                                    <ImageIcon size={18} />
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
                                                <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium border border-cyan-500/30">
                                                    Your Skins
                                                </button>
                                                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm transition-all">
                                                    Popular
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                                <div
                                                    key={i}
                                                    className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer group"
                                                >
                                                    <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                                                        <User size={40} className="text-slate-600" />
                                                        <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-all"></div>
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
                                        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                            Account Manager
                                        </h1>
                                        <p className="text-slate-400">Switch between accounts seamlessly</p>
                                    </div>
                                    <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 font-medium">
                                        <Plus size={18} />
                                        Add Account
                                    </button>
                                </div>

                                <div className="grid gap-4">
                                    {accounts.map((account) => (
                                        <div
                                            key={account.id}
                                            onClick={() => setSelectedAccount(account)}
                                            className={`p-6 bg-slate-800/40 backdrop-blur-xl rounded-xl border cursor-pointer transition-all ${
                                                selectedAccount?.id === account.id
                                                    ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                                                    : 'border-slate-700/50 hover:border-slate-600/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {/* Account Avatar */}
                                                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl relative">
                                                        {account.username[0]}
                                                        {selectedAccount?.id === account.id && (
                                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                                                                <Check size={14} className="text-slate-900" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Account Info */}
                                                    <div>
                                                        <h3 className="font-bold text-xl mb-1">{account.username}</h3>
                                                        <p className="text-sm text-slate-400 mb-1">{account.email}</p>
                                                        <div className="flex items-center gap-2">
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                  account.type === 'microsoft'
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}>
                                {account.type === 'microsoft' ? 'Microsoft' : 'Mojang'}
                              </span>
                                                            {selectedAccount?.id === account.id && (
                                                                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                  Active
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    {selectedAccount?.id !== account.id && (
                                                        <button className="px-5 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all font-medium">
                                                            Switch
                                                        </button>
                                                    )}
                                                    <button className="p-2.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all">
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                                                        <LogOut size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Info Card */}
                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <User size={16} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-blue-400 mb-1">Account Security</h3>
                                            <p className="text-sm text-slate-400">
                                                Your account credentials are securely encrypted and stored locally. We never share your login information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'versions' && (
                            <div className="max-w-6xl mx-auto">
                                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Available Versions
                                </h1>

                                <div className="grid gap-3">
                                    {versions.map((version) => (
                                        <div
                                            key={version.id}
                                            className="p-6 bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getVersionBadgeColor(version.type)} shadow-lg`}></div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{version.name}</h3>
                                                    <p className="text-sm text-slate-400">Released: {version.releaseDate}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                        <span className={`text-xs px-4 py-2 rounded-full bg-gradient-to-r ${getVersionBadgeColor(version.type)}`}>
                          {version.type}
                        </span>
                                                <button className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all border border-cyan-500/30 opacity-0 group-hover:opacity-100">
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
                                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Settings
                                </h1>

                                <div className="space-y-6">
                                    {/* General Settings */}
                                    <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20">
                                        <h2 className="text-xl font-bold mb-4">General</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Game Directory</label>
                                                <input
                                                    type="text"
                                                    defaultValue="C:/Users/Player/.minecraft"
                                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-2">Language</label>
                                                <select className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-all">
                                                    <option>English</option>
                                                    <option>Deutsch</option>
                                                    <option>Français</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Settings */}
                                    <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20">
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
                                            <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                                                <div>
                                                    <p className="font-medium">GPU Acceleration</p>
                                                    <p className="text-sm text-slate-400">Better performance for modern GPUs</p>
                                                </div>
                                                <button className="w-14 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full relative shadow-lg shadow-cyan-500/30">
                                                    <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow"></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appearance */}
                                    <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20">
                                        <h2 className="text-xl font-bold mb-4">Theme</h2>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button className="p-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/50 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all"></div>
                                                <div className="text-sm font-medium mb-1">Nuvion</div>
                                                <div className="text-xs text-cyan-100">Default</div>
                                            </button>
                                            <button className="p-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl opacity-50 hover:opacity-100 transition-all">
                                                <div className="text-sm font-medium mb-1">Purple</div>
                                                <div className="text-xs text-purple-100">Coming Soon</div>
                                            </button>
                                            <button className="p-5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl opacity-50 hover:opacity-100 transition-all">
                                                <div className="text-sm font-medium mb-1">Green</div>
                                                <div className="text-xs text-emerald-100">Coming Soon</div>
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