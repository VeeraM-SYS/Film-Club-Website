import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CLUB_DETAILS, INITIAL_HIERARCHY, UPCOMING_EVENTS } from '../constants';
import {
    Users, LogOut, LayoutDashboard, FileText, Settings, Shield, Plus, Lock, Key, RotateCcw, Upload, Trash2, Edit2,
    ShieldCheck, Save, Info, UserCheck, Layers, Calendar, MessageSquare, UserPlus, Camera, Check, X
} from 'lucide-react';
import { ClubDetails, ClubHierarchy, Event } from '../types';
import { apiService } from '../services/apiService';

interface AuditLog {
    id: number;
    action: string;
    status: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    user?: { username: string };
}

interface UserAccount {
    id: number;
    username: string;
    role: string;
    canViewReviews: boolean;
    createdAt: string;
}

interface UserReview {
    id: number;
    userName: string;
    comment: string;
    rating: number;
    status: string;
    createdAt: string;
}

const LeadsDashboard: React.FC = () => {
    const [details, setDetails] = useState<ClubDetails>(CLUB_DETAILS);
    const [hierarchy, setHierarchy] = useState<ClubHierarchy>(INITIAL_HIERARCHY);
    const [events, setEvents] = useState<Event[]>(UPCOMING_EVENTS);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]); // Initialize as empty array
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [userRole, setUserRole] = useState<string>('lead');
    const [canViewReviews, setPermViewReviews] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'general' | 'hierarchy' | 'departments' | 'events' | 'audit' | 'admin_center' | 'reviews'>('general');
    const [saved, setSaved] = useState(false);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserPass, setNewUserPass] = useState('');
    const [newUserRole, setNewUserRole] = useState('lead');
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [editForm, setEditForm] = useState<{ username: string, role: string, canViewReviews: boolean, roleUpgrade?: boolean }>({ username: '', role: '', canViewReviews: false });
    const navigate = useNavigate();

    // Consolidate logs into one state var to avoid confusion if auditLogs vs logs usage exists
    // The previous code used 'logs' in map but defined 'auditLogs'. I will use 'auditLogs' consistently.

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
            return;
        }

        if (userData) {
            const parsed = JSON.parse(userData);
            setUserRole(parsed.role);
            setPermViewReviews(parsed.canViewReviews || false);
        }

        const fetchData = async () => {
            const currentToken = token || '';
            const user = userData ? JSON.parse(userData) : null;

            try {
                // If admin, fetch logs and users
                if (user?.role === 'admin') {
                    setLoadingLogs(true);
                    setLoadingUsers(true);
                    // Use Promise.allSettled to avoid one failure blocking others if needed, but Promise.all is fine
                    const [logsData, usersData] = await Promise.all([
                        apiService.getAuditLogs(currentToken),
                        apiService.getUsers(currentToken)
                    ]);
                    setAuditLogs(logsData);
                    setUsers(usersData);
                }

                if (user?.role === 'admin' || user?.canViewReviews) {
                    setLoadingReviews(true);
                    const reviewList = await apiService.getReviews(currentToken);
                    setReviews(reviewList);
                }
            } catch (err) {
                console.error("Failed to fetch administrative data", err);
            } finally {
                setLoadingLogs(false);
                setLoadingUsers(false);
                setLoadingReviews(false);
            }
        };

        fetchData();

        const savedDetails = localStorage.getItem('club_details');
        if (savedDetails) setDetails(JSON.parse(savedDetails));

        const savedHierarchy = localStorage.getItem('club_hierarchy');
        if (savedHierarchy) setHierarchy(JSON.parse(savedHierarchy));

        const savedEvents = localStorage.getItem('club_events');
        if (savedEvents) setEvents(JSON.parse(savedEvents));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSave = () => {
        localStorage.setItem('club_details', JSON.stringify(details));
        localStorage.setItem('club_hierarchy', JSON.stringify(hierarchy));
        localStorage.setItem('club_events', JSON.stringify(events));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        if (confirm("Reset to production defaults? All unsaved changes will be lost.")) {
            setDetails(CLUB_DETAILS);
            setHierarchy(INITIAL_HIERARCHY);
            setEvents(UPCOMING_EVENTS);
            localStorage.clear();
            window.location.reload();
        }
    };

    const [newUserAccess, setNewUserAccess] = useState<'none' | 'view_only' | 'full'>('none');

    const handleCreateUser = async () => {
        if (!newUserName.trim() || !newUserPass.trim()) {
            alert("Username and password are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token') || '';

            // Determine final role and permissions
            const finalRole = newUserAccess === 'full' ? 'admin' : newUserRole;
            const canView = newUserAccess === 'view_only' || newUserAccess === 'full';

            const newUser = await apiService.createUser(token, {
                username: newUserName,
                password: newUserPass,
                role: finalRole
            });

            if (canView) {
                await apiService.toggleReviewAccess(token, newUser.id, true);
                newUser.canViewReviews = true;
            }

            setUsers([...users, { ...newUser, createdAt: new Date().toISOString() }]);
            setNewUserName('');
            setNewUserPass('');
            setNewUserAccess('none');
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleEditUser = (user: UserAccount) => {
        setEditingUser(user);
        setEditForm({ username: user.username, role: user.role, canViewReviews: user.canViewReviews, roleUpgrade: false });
    };

    const handleUpdateUserSubmit = async () => {
        if (!editingUser) return;
        try {
            const token = localStorage.getItem('token') || '';

            const finalRole = editForm.roleUpgrade ? 'admin' : editForm.role;
            const finalViewReviews = editForm.roleUpgrade ? true : editForm.canViewReviews;

            const updated = await apiService.updateUser(token, editingUser.id, {
                username: editForm.username,
                role: finalRole
            });

            if (editingUser.canViewReviews !== finalViewReviews || editForm.roleUpgrade) {
                await apiService.toggleReviewAccess(token, editingUser.id, finalViewReviews);
                updated.canViewReviews = finalViewReviews;
            }

            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updated } : u));
            setEditingUser(null);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Permanently delete this account?')) return;
        const token = localStorage.getItem('token') || '';
        try {
            await apiService.deleteUser(token, id);
            setUsers(users.filter(u => u.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleUpdateReview = async (id: number, status: string) => {
        const token = localStorage.getItem('token') || '';
        try {
            await apiService.updateReviewStatus(token, id, status);
            setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteReview = async (id: number) => {
        if (!confirm('Delete this review?')) return;
        const token = localStorage.getItem('token') || '';
        try {
            await apiService.deleteReview(token, id);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const updateHierarchyMember = (roleType: 'facultyCoordinators' | 'chairpersons' | 'viceChairpersons', index: number, field: string, value: string) => {
        const list = [...hierarchy[roleType]];
        // @ts-ignore
        list[index][field] = value;
        setHierarchy({ ...hierarchy, [roleType]: list });
    };

    const addMember = (roleType: 'facultyCoordinators' | 'chairpersons' | 'viceChairpersons') => {
        if (userRole !== 'admin' && !canViewReviews) {
            alert("Only admins or trusted leads can modify the hierarchy.");
            return;
        }
        const newMember = {
            name: "New Leader",
            role: roleType === 'facultyCoordinators' ? "Faculty" : roleType === 'chairpersons' ? "Chairperson" : "Vice Chairperson",
            favoriteFilm: "-",
            imageUrl: "https://picsum.photos/200/200"
        };
        setHierarchy({ ...hierarchy, [roleType]: [...hierarchy[roleType], newMember] });
    };

    const removeMember = (roleType: 'facultyCoordinators' | 'chairpersons' | 'viceChairpersons', index: number) => {
        if (userRole !== 'admin') return;
        if (!confirm("Remove this leader?")) return;
        const list = hierarchy[roleType].filter((_, i) => i !== index);
        setHierarchy({ ...hierarchy, [roleType]: list });
    };

    const updateDepartment = (index: number, field: string, value: string) => {
        const newDepts = [...hierarchy.departments];
        if (field === 'name') {
            newDepts[index].name = value;
        } else {
            // @ts-ignore
            newDepts[index].lead[field] = value;
        }
        setHierarchy({ ...hierarchy, departments: newDepts });
    };

    const updateEvent = (index: number, field: string, value: string) => {
        const newEvents = [...events];
        // @ts-ignore
        newEvents[index][field] = value;
        setEvents(newEvents);
    };

    const addEvent = () => {
        const newEvent: Event = {
            id: 'e' + Date.now(),
            title: 'New Production',
            description: 'Add details here...',
            date: 'TBD',
            imageUrl: 'https://picsum.photos/400/300?random=' + events.length,
            registrationLink: '#',
            type: 'Screening'
        };
        setEvents([...events, newEvent]);
    };

    const handleImageUpload = async (file: File, callback: (url: string) => void) => {
        try {
            const result = await apiService.uploadImage(file);
            callback(result.url);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const removeEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
    };

    return (
        <div className="pt-24 min-h-screen bg-[#020202] text-white">
            <div className="container mx-auto px-6 max-w-6xl pb-20">

                {/* Header Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-film-dark shadow-2xl p-8 border border-white/5 border-l-4 border-l-film-red">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-5 h-5 text-film-gold" />
                            <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-mono">Authenticated Session</span>
                        </div>
                        <h1 className="text-4xl font-cinzel text-white italic">Lead <span className="text-film-red">Control</span></h1>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-mono"
                        >
                            Logout
                        </button>
                        {userRole === 'admin' && (
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-4 py-2 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-mono"
                            >
                                <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-8 py-3 ${saved ? 'bg-green-600' : 'bg-film-red'} text-white hover:brightness-110 transition-all text-sm uppercase tracking-widest font-bold shadow-[0_0_30px_rgba(229,9,20,0.4)]`}
                        >
                            <Save className="w-5 h-5" /> {saved ? 'System Saved' : 'Save Production'}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1 space-y-2">
                        {[
                            { id: 'general', label: 'Identity', icon: Info },
                            { id: 'hierarchy', label: 'Elected Hierarchy', icon: UserCheck },
                            { id: 'departments', label: 'The 8 Pillars', icon: Layers },
                            { id: 'events', label: 'The Slate', icon: Calendar },
                            { id: 'reviews', label: 'User Feedback', icon: MessageSquare, permission: userRole === 'admin' || canViewReviews },
                            { id: 'audit', label: 'Access Records', icon: ShieldCheck, adminOnly: true },
                            { id: 'admin_center', label: 'Admin Center', icon: UserPlus, adminOnly: true },
                        ].filter(tab => (!tab.adminOnly || userRole === 'admin') && (tab.permission !== false)).map((tab: any) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center gap-4 px-6 py-4 transition-all border-r-2 ${activeTab === tab.id ? 'bg-film-red/10 border-film-red text-white' : 'border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-film-red' : ''}`} />
                                <span className="text-xs uppercase tracking-widest font-bold">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 bg-film-dark/50 border border-white/5 p-8 backdrop-blur-3xl min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'general' && (
                                <motion.div key="gen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <h2 className="text-2xl font-cinzel text-film-gold mb-8 flex items-center gap-3 italic">
                                        <Info className="w-6 h-6" /> Club Meta Details
                                    </h2>
                                    <div className="grid gap-6">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">Global Master Name</label>
                                            <input value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-film-gold outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">Primary Manifesto / Description</label>
                                            <textarea rows={5} value={details.description} onChange={e => setDetails({ ...details, description: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-film-gold outline-none resize-none" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">Instagram URL</label>
                                                <input value={details.instagram || ''} onChange={e => setDetails({ ...details, instagram: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-film-red outline-none" placeholder="https://instagram.com/..." />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">YouTube URL</label>
                                                <input value={details.youtube || ''} onChange={e => setDetails({ ...details, youtube: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-film-red outline-none" placeholder="https://youtube.com/..." />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">Recruitment Link</label>
                                                <input value={details.recruitment || ''} onChange={e => setDetails({ ...details, recruitment: e.target.value })} className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-film-red outline-none" placeholder="https://forms.gle/..." />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'hierarchy' && (
                                <motion.div key="hier" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                    <h2 className="text-2xl font-cinzel text-white mb-8 italic">Core Leadership</h2>

                                    {/* Faculty */}
                                    <div className="bg-black/40 p-6 border border-white/5 space-y-6">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                            <h3 className="text-film-gold text-xs uppercase tracking-[0.4em] font-bold">Faculty Mentors</h3>
                                            {(userRole === 'admin' || canViewReviews) && <button onClick={() => addMember('facultyCoordinators')} className="text-film-gold hover:text-white px-2 text-xs uppercase font-bold">+ Add Mentor</button>}
                                        </div>
                                        {hierarchy.facultyCoordinators.map((member, i) => (
                                            <div key={i} className="grid md:grid-cols-2 gap-4 relative group">
                                                <input placeholder="Name" value={member.name} onChange={e => updateHierarchyMember('facultyCoordinators', i, 'name', e.target.value)} className="bg-black border border-white/10 px-3 py-2 text-sm outline-none" />
                                                <div className="flex gap-2 items-center">
                                                    <input placeholder="Photo URL" value={member.imageUrl} onChange={e => updateHierarchyMember('facultyCoordinators', i, 'imageUrl', e.target.value)} className="bg-black border border-white/10 px-3 py-2 text-xs outline-none flex-grow" />
                                                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 p-2 rounded">
                                                        <Camera className="w-4 h-4 text-film-gold" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => updateHierarchyMember('facultyCoordinators', i, 'imageUrl', url))} />
                                                    </label>
                                                    {(userRole === 'admin' || canViewReviews) && <button onClick={() => removeMember('facultyCoordinators', i)} className="text-film-red opacity-0 group-hover:opacity-100 transition-opacity px-2"><Trash2 className="w-4 h-4" /></button>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chairs & Vice Chairs */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Chairpersons */}
                                        <div className="bg-black/40 p-6 border border-film-red/20 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-film-red text-xs uppercase tracking-widest font-bold">Chairpersons</h3>
                                                {userRole === 'admin' && <button onClick={() => addMember('chairpersons')} className="text-film-red hover:text-white text-[10px] uppercase font-bold">+ Add</button>}
                                            </div>
                                            {hierarchy.chairpersons.map((member, i) => (
                                                <div key={i} className="space-y-2 mb-4 group">
                                                    <div className="flex gap-2 items-center">
                                                        <input placeholder="Name" value={member.name} onChange={e => updateHierarchyMember('chairpersons', i, 'name', e.target.value)} className="w-full bg-black border border-white/10 px-3 py-2 text-sm outline-none" />
                                                        {userRole === 'admin' && <button onClick={() => removeMember('chairpersons', i)} className="text-gray-600 hover:text-film-red"><Trash2 className="w-3 h-3" /></button>}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input placeholder="Photo URL" value={member.imageUrl} onChange={e => updateHierarchyMember('chairpersons', i, 'imageUrl', e.target.value)} className="w-full bg-black border border-white/10 px-3 py-2 text-xs outline-none font-mono" />
                                                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 p-2 rounded">
                                                            <Camera className="w-4 h-4 text-film-red" />
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => updateHierarchyMember('chairpersons', i, 'imageUrl', url))} />
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Vice Chairpersons */}
                                        <div className="bg-black/40 p-6 border border-white/10 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold">Vice Chairpersons</h3>
                                                {userRole === 'admin' && <button onClick={() => addMember('viceChairpersons')} className="text-gray-500 hover:text-white text-[10px] uppercase font-bold">+ Add</button>}
                                            </div>
                                            {hierarchy.viceChairpersons.map((member, i) => (
                                                <div key={i} className="space-y-2 mb-4 group">
                                                    <div className="flex gap-2 items-center">
                                                        <input placeholder="Name" value={member.name} onChange={e => updateHierarchyMember('viceChairpersons', i, 'name', e.target.value)} className="w-full bg-black border border-white/10 px-3 py-2 text-sm outline-none" />
                                                        {userRole === 'admin' && <button onClick={() => removeMember('viceChairpersons', i)} className="text-gray-600 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input placeholder="Photo URL" value={member.imageUrl} onChange={e => updateHierarchyMember('viceChairpersons', i, 'imageUrl', e.target.value)} className="w-full bg-black border border-white/10 px-3 py-2 text-xs outline-none font-mono" />
                                                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 p-2 rounded">
                                                            <Camera className="w-4 h-4 text-gray-400" />
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => updateHierarchyMember('viceChairpersons', i, 'imageUrl', url))} />
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'departments' && (
                                <motion.div key="depts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <h2 className="text-2xl font-cinzel text-white mb-8 italic">The 8 Pillars</h2>
                                    <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {hierarchy.departments.map((dept: any, idx: number) => (
                                            <div key={dept.id} className="bg-black/40 border border-white/5 p-4 flex gap-4 items-start">
                                                <div className="shrink-0 w-8 h-8 rounded-full bg-film-gold text-black flex items-center justify-center font-bold text-xs">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                                    <input placeholder="Department Name" value={dept.name} onChange={e => updateDepartment(idx, 'name', e.target.value)} className="bg-black border border-white/10 px-3 py-2 text-xs font-bold text-film-gold" />
                                                    <input placeholder="Lead Name" value={dept.lead.name} onChange={e => updateDepartment(idx, 'name', e.target.value)} className="bg-black border border-white/10 px-3 py-2 text-xs" />
                                                    <div className="flex gap-1">
                                                        <input placeholder="Photo URL" value={dept.lead.imageUrl} onChange={e => updateDepartment(idx, 'imageUrl', e.target.value)} className="bg-black border border-white/10 px-3 py-2 text-[10px] font-mono flex-1" />
                                                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 p-1.5 rounded">
                                                            <Camera className="w-3 h-3 text-film-gold" />
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => updateDepartment(idx, 'imageUrl', url))} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'events' && (
                                <motion.div key="evts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-cinzel text-white italic">Current Slate</h2>
                                        <button onClick={addEvent} className="bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 flex items-center gap-2">
                                            <Plus className="w-3 h-3" /> Insert Entry
                                        </button>
                                    </div>
                                    <div className="grid gap-6">
                                        {events.map((evt: any, idx: number) => (
                                            <div key={evt.id} className="bg-black/40 border border-white/5 p-6 relative group">
                                                <button onClick={() => removeEvent(evt.id)} className="absolute top-4 right-4 text-gray-600 hover:text-film-red opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-4">
                                                        <input value={evt.title} onChange={e => updateEvent(idx, 'title', e.target.value)} className="w-full bg-black border border-white/10 px-3 py-2 text-sm font-bold text-film-gold" placeholder="Event Title" />
                                                        <textarea value={evt.description} onChange={e => updateEvent(idx, 'description', e.target.value)} className="w-full bg-black border border-white/10 px-3 py-2 text-xs resize-none" rows={3} placeholder="Description" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <input value={evt.date} onChange={e => updateEvent(idx, 'date', e.target.value)} className="w-full bg-black border border-white/10 px-3 py-2 text-xs" placeholder="Date/Time" />
                                                        <div className="flex items-center gap-2">
                                                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 p-2 rounded">
                                                                <Camera className="w-4 h-4 text-gray-500" />
                                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], (url) => updateEvent(idx, 'imageUrl', url))} />
                                                            </label>
                                                            <input value={evt.imageUrl} onChange={e => updateEvent(idx, 'imageUrl', e.target.value)} className="w-full bg-black border border-white/10 px-3 py-2 text-[9px] font-mono" placeholder="Image URL" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'audit' && (
                                <motion.div key="audit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-cinzel text-white italic">Director's Cut Access Log</h2>
                                        {userRole === 'admin' && (
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Create a clean slate? This will delete ALL history forever.')) {
                                                        const token = localStorage.getItem('token') || '';
                                                        await apiService.clearAuditLogs(token);
                                                        setAuditLogs([]);
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-film-red/50 text-film-red hover:bg-film-red hover:text-white transition-all text-xs uppercase tracking-widest font-bold"
                                            >
                                                <Trash2 className="w-4 h-4" /> Burn Archive
                                            </button>
                                        )}
                                    </div>
                                    {loadingLogs ? (
                                        <div className="text-gray-500 font-mono text-sm animate-pulse">Scanning archive...</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {auditLogs.map(log => (
                                                <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-film-gold/30 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-2 h-2 rounded-full ${log.action.includes('LOGIN') ? 'bg-green-500' : 'bg-film-gold'}`} />
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-white font-mono text-sm">{log.user?.username || 'UNKNOWN'}</span>
                                                            </div>
                                                            <div className="text-gray-400 text-xs mt-1">{log.action}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-gray-600 text-[10px] font-mono">{new Date(log.createdAt).toLocaleString()}</span>
                                                        {userRole === 'admin' && (
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={async () => {
                                                                        const newAction = prompt("Edit Action:", log.action);
                                                                        if (newAction) {
                                                                            const token = localStorage.getItem('token') || '';
                                                                            await apiService.updateAuditLog(token, log.id, { action: newAction });
                                                                            setAuditLogs(auditLogs.map(l => l.id === log.id ? { ...l, action: newAction } : l));
                                                                        }
                                                                    }}
                                                                    className="text-gray-400 hover:text-film-gold"
                                                                >
                                                                    <Edit2 className="w-3 h-3" />
                                                                </button>
                                                                <button
                                                                    onClick={async () => {
                                                                        if (confirm('Delete this record?')) {
                                                                            const token = localStorage.getItem('token') || '';
                                                                            await apiService.deleteAuditLog(token, log.id);
                                                                            setAuditLogs(auditLogs.filter(l => l.id !== log.id));
                                                                        }
                                                                    }}
                                                                    className="text-gray-400 hover:text-film-red"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {auditLogs.length === 0 && (
                                                <div className="p-10 text-center text-gray-600 italic">No access records found in history.</div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'admin_center' && (
                                <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                    <h2 className="text-2xl font-cinzel text-white mb-8 italic">Director's Admin Center</h2>

                                    {/* Create New User */}
                                    <div className="bg-black/40 p-6 border border-film-red/20 space-y-6">
                                        <h3 className="text-film-red text-xs uppercase tracking-[0.4em] font-bold border-b border-white/10 pb-2">Provision New Access</h3>
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <input placeholder="Username" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="bg-black border border-white/10 px-3 py-2 text-sm outline-none" />
                                            <input placeholder="Password" type="password" value={newUserPass} onChange={e => setNewUserPass(e.target.value)} className="bg-black border border-white/10 px-3 py-2 text-sm outline-none" />
                                            <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="bg-black border border-white/10 px-3 py-2 text-sm outline-none text-white">
                                                <option value="lead">Lead</option>
                                                <option value="chairperson">Chairperson</option>
                                                <option value="vice_chairperson">Vice Chairperson</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <button onClick={handleCreateUser} className="bg-film-red text-white py-2 px-4 text-xs font-bold uppercase tracking-widest hover:brightness-110">Create Account</button>
                                        </div>
                                    </div>

                                    {/* User List */}
                                    {/* Grouped User Lists */}
                                    {['admin', 'chairperson', 'vice_chairperson', 'lead'].map(roleGroup => {
                                        const groupUsers = users.filter(u => u.role === roleGroup);
                                        if (groupUsers.length === 0) return null;

                                        return (
                                            <div key={roleGroup} className="mb-8">
                                                <h3 className="text-film-gold text-xs uppercase tracking-[0.4em] font-bold mb-4 border-b border-white/10 pb-2">
                                                    {roleGroup.replace('_', ' ')}s
                                                </h3>
                                                <div className="border border-white/5 overflow-hidden">
                                                    <table className="w-full text-left text-xs font-mono uppercase tracking-wider">
                                                        <thead className="bg-white/5 border-b border-white/10">
                                                            <tr>
                                                                <th className="p-4 text-gray-500">Username</th>
                                                                <th className="p-4 text-gray-500">Privileges</th>
                                                                <th className="p-4 text-gray-500 text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-white/5">
                                                            {groupUsers.map((u) => (
                                                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                                    <td className="p-4 font-bold text-white">{u.username}</td>
                                                                    <td className="p-4">
                                                                        {u.role !== 'admin' ? (
                                                                            <span className={`px-2 py-1 rounded-sm text-[10px] font-bold ${u.canViewReviews ? 'bg-film-gold/20 text-film-gold' : 'text-gray-600'}`}>
                                                                                {u.canViewReviews ? 'Trusted Access' : 'Standard'}
                                                                            </span>
                                                                        ) : (<span className="text-film-red">Full Control</span>)}
                                                                    </td>
                                                                    <td className="p-4 text-right flex justify-end gap-2">
                                                                        <button onClick={() => handleEditUser(u)} className="text-gray-400 hover:text-film-gold"><Settings className="w-4 h-4" /></button>
                                                                        <button
                                                                            onClick={() => handleDeleteUser(u.id)}
                                                                            disabled={u.username === 'admin1' || u.username === 'admin2'}
                                                                            className="text-gray-600 hover:text-film-red disabled:opacity-0"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Edit Modal */}
                                    {editingUser && (
                                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                                            <div className="bg-zinc-900 border border-film-gold/20 p-8 w-full max-w-md relative">
                                                <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                                                <h3 className="text-xl font-cinzel text-film-gold mb-6">Edit Credentials</h3>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Username</label>
                                                        <input
                                                            value={editForm.username}
                                                            onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                                            className="w-full bg-black border border-white/10 px-3 py-2 text-sm text-white focus:border-film-gold outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Role</label>
                                                        <select
                                                            value={editForm.role}
                                                            onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                                                            className="w-full bg-black border border-white/10 px-3 py-2 text-sm text-white focus:border-film-gold outline-none"
                                                        >
                                                            <option value="lead">Lead</option>
                                                            <option value="chairperson">Chairperson</option>
                                                            <option value="vice_chairperson">Vice Chairperson</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </div>

                                                    {editForm.role !== 'admin' && (
                                                        <div className="mt-4 border border-white/5 p-4 bg-white/5">
                                                            <label className="block text-[10px] uppercase tracking-widest text-film-gold mb-3">Privilege Level</label>
                                                            <div className="space-y-3">
                                                                <label className="flex items-center gap-3 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        checked={!editForm.canViewReviews && !editForm.roleUpgrade}
                                                                        onChange={() => setEditForm({ ...editForm, canViewReviews: false, roleUpgrade: false })}
                                                                        className="accent-film-red bg-black"
                                                                    />
                                                                    <div>
                                                                        <span className="block text-sm text-white">Standard</span>
                                                                        <span className="text-[10px] text-gray-500">No special access</span>
                                                                    </div>
                                                                </label>
                                                                <label className="flex items-center gap-3 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        checked={editForm.canViewReviews && !editForm.roleUpgrade}
                                                                        onChange={() => setEditForm({ ...editForm, canViewReviews: true, roleUpgrade: false })}
                                                                        className="accent-film-red bg-black"
                                                                    />
                                                                    <div>
                                                                        <span className="block text-sm text-white">View Only</span>
                                                                        <span className="text-[10px] text-gray-500">Read reviews & audit logs</span>
                                                                    </div>
                                                                </label>
                                                                <label className="flex items-center gap-3 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        checked={editForm.roleUpgrade === true}
                                                                        onChange={() => setEditForm({ ...editForm, roleUpgrade: true, canViewReviews: true })}
                                                                        className="accent-film-red bg-black"
                                                                    />
                                                                    <div>
                                                                        <span className="block text-sm text-white">Full Unrestricted</span>
                                                                        <span className="text-[10px] text-gray-500">Elevate to Admin status</span>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button onClick={handleUpdateUserSubmit} className="w-full bg-film-gold text-black font-bold py-3 mt-4 hover:bg-yellow-500 transition-colors uppercase tracking-widest text-xs">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'reviews' && (
                                <motion.div key="reviews" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <h2 className="text-2xl font-cinzel text-white mb-8 italic">User Feedback Terminal</h2>
                                    {loadingReviews ? (
                                        <div className="text-gray-500 font-mono text-sm animate-pulse">Syncing feedback logs...</div>
                                    ) : (
                                        <div className="grid gap-6">
                                            {reviews.map((r) => (
                                                <div key={r.id} className="bg-black/40 border border-white/5 p-6 relative group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-film-gold text-sm tracking-widest uppercase">{r.userName}</h3>
                                                            <p className="text-[10px] text-gray-500 font-mono mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className={`px-2 py-1 rounded-sm text-[9px] font-bold ${r.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : r.status === 'REJECTED' ? 'bg-film-red/10 text-film-red' : 'bg-film-gold/10 text-film-gold'}`}>
                                                                {r.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-300 text-xs italic leading-relaxed mb-6">"{r.comment}"</p>
                                                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                                        {userRole === 'admin' && (
                                                            <>
                                                                <button onClick={() => handleUpdateReview(r.id, 'APPROVED')} className="p-2 bg-green-900/20 text-green-500 hover:bg-green-900/40 rounded transition-colors"><Check className="w-4 h-4" /></button>
                                                                <button onClick={() => handleUpdateReview(r.id, 'REJECTED')} className="p-2 bg-film-red/10 text-film-red hover:bg-film-red/20 rounded transition-colors"><X className="w-4 h-4" /></button>
                                                                <button onClick={() => handleDeleteReview(r.id)} className="p-2 bg-white/5 text-gray-500 hover:text-white rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {reviews.length === 0 && (
                                                <div className="p-20 text-center border border-dashed border-white/10 text-gray-600 font-cinzel italic">
                                                    No user feedback transmissions found.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadsDashboard;
