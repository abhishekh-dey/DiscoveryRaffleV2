import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Search, Download, Trash2, Filter, Users } from 'lucide-react';
import Layout from '../components/Layout';
import Navigation from '../components/Navigation';
import GlassCard from '../components/GlassCard';
import { getWinners, clearWinners } from '../utils/storage';
import { exportToCSV } from '../utils/raffle';
import type { Department } from '../types';

export default function Winners() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const winners = getWinners();

  const filteredWinners = useMemo(() => {
    let filtered = winners;

    if (searchQuery) {
      filtered = filtered.filter(winner =>
        winner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        winner.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        winner.supervisor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(winner => winner.department === departmentFilter);
    }

    return filtered.sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
  }, [winners, searchQuery, departmentFilter]);

  const departmentStats = {
    'International Messaging': winners.filter(w => w.department === 'International Messaging').length,
    'India Messaging': winners.filter(w => w.department === 'India Messaging').length,
    'APAC': winners.filter(w => w.department === 'APAC').length,
  };

  const handleExport = () => {
    exportToCSV(filteredWinners);
  };

  const handleClearWinners = () => {
    clearWinners();
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <Layout title="Winners Dashboard">
      <Navigation />
      
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Winners</h3>
                <p className="text-3xl font-bold text-white mt-1">{winners.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500/20 backdrop-blur-md">
                <Trophy className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </GlassCard>

          {Object.entries(departmentStats).map(([dept, count]) => (
            <GlassCard key={dept} className="p-6" hover>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white/80 text-sm font-medium">{dept.replace(' Messaging', '')}</h3>
                  <p className="text-3xl font-bold text-white mt-1">{count}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/20 backdrop-blur-md">
                  <Users className="w-6 h-6 text-blue-300" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Controls */}
        <GlassCard className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search winners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Department Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value as Department | 'all')}
                  className="pl-10 pr-8 py-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="all">All Departments</option>
                  <option value="International Messaging">International Messaging</option>
                  <option value="India Messaging">India Messaging</option>
                  <option value="APAC">APAC</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                onClick={handleExport}
                disabled={filteredWinners.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-100 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </motion.button>

              <motion.button
                onClick={() => setShowClearConfirm(true)}
                disabled={winners.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-100 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </motion.button>
            </div>
          </div>
        </GlassCard>

        {/* Winners List */}
        {filteredWinners.length > 0 ? (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Winners List ({filteredWinners.length})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white/80 py-3 px-4 font-medium">#</th>
                    <th className="text-left text-white/80 py-3 px-4 font-medium">Name</th>
                    <th className="text-left text-white/80 py-3 px-4 font-medium">Department</th>
                    <th className="text-left text-white/80 py-3 px-4 font-medium">Supervisor</th>
                    <th className="text-left text-white/80 py-3 px-4 font-medium">Draw Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWinners.map((winner, index) => (
                    <motion.tr
                      key={winner.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white font-medium">{winner.name}</td>
                      <td className="py-4 px-4 text-white/80">{winner.department}</td>
                      <td className="py-4 px-4 text-white/80">{winner.supervisor}</td>
                      <td className="py-4 px-4 text-white/80">
                        {new Date(winner.drawDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-500/20 backdrop-blur-md flex items-center justify-center">
              <Trophy className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {winners.length === 0 ? 'No Winners Yet' : 'No Results Found'}
            </h3>
            <p className="text-white/80">
              {winners.length === 0 
                ? 'Start a raffle draw to see winners here!'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </GlassCard>
        )}

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center">
                    <Trash2 className="w-8 h-8 text-red-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Clear All Winners?</h3>
                  <p className="text-white/80 mb-6">
                    This action cannot be undone. All winner records will be permanently deleted.
                  </p>
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => setShowClearConfirm(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleClearWinners}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-200"
                    >
                      Clear All
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}