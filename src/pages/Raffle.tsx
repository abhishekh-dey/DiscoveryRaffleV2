import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import GlassCard from '../components/GlassCard';
import { Trophy, Users, Clock, Play } from 'lucide-react';
import { Contestant } from '../types';
import { loadContestants, saveContestants } from '../utils/storage';
import { selectWinner } from '../utils/raffle';

export const Raffle: React.FC = () => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Contestant | null>(null);

  useEffect(() => {
    setContestants(loadContestants());
  }, []);

  const handleDraw = async () => {
    if (contestants.length === 0) return;

    setIsDrawing(true);
    setWinner(null);

    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedWinner = selectWinner(contestants);
    setWinner(selectedWinner);

    // Update contestants to mark winner
    const updatedContestants = contestants.map(c => 
      c.id === selectedWinner.id ? { ...c, hasWon: true } : c
    );
    setContestants(updatedContestants);
    saveContestants(updatedContestants);

    setIsDrawing(false);
  };

  const eligibleContestants = contestants.filter(c => !c.hasWon);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Raffle Draw
          </h1>
          <p className="text-gray-300 text-lg">
            Ready to select a winner from your contestants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Contestants</p>
                <p className="text-2xl font-bold text-white">{contestants.length}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Eligible</p>
                <p className="text-2xl font-bold text-white">{eligibleContestants.length}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Winners</p>
                <p className="text-2xl font-bold text-white">{contestants.filter(c => c.hasWon).length}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="text-center space-y-6">
            {winner && !isDrawing && (
              <div className="mb-8 p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
                <p className="text-xl text-gray-300">{winner.name}</p>
                <p className="text-gray-400">{winner.email}</p>
              </div>
            )}

            {isDrawing && (
              <div className="mb-8 p-6">
                <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-white mb-2">Drawing Winner...</h2>
                <p className="text-gray-400">Please wait while we select a winner</p>
              </div>
            )}

            <button
              onClick={handleDraw}
              disabled={isDrawing || eligibleContestants.length === 0}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              <Play className="w-5 h-5" />
              <span>
                {isDrawing ? 'Drawing...' : eligibleContestants.length === 0 ? 'No Eligible Contestants' : 'Draw Winner'}
              </span>
            </button>

            {eligibleContestants.length === 0 && contestants.length > 0 && (
              <p className="text-gray-400 text-sm">
                All contestants have already won. Add more contestants to continue.
              </p>
            )}
          </div>
        </GlassCard>

        {eligibleContestants.length > 0 && (
          <GlassCard>
            <h3 className="text-xl font-semibold text-white mb-4">Eligible Contestants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {eligibleContestants.map((contestant) => (
                <div
                  key={contestant.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <p className="font-medium text-white">{contestant.name}</p>
                  <p className="text-sm text-gray-400">{contestant.email}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </Layout>
  );
};