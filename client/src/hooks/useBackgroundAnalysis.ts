import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface BackgroundAnalysisState {
  isAnalyzing: boolean;
  error: string | null;
  results: any;
  analysisType: 'competitive' | 'positioning' | null;
}

let globalState: BackgroundAnalysisState = {
  isAnalyzing: false,
  error: null,
  results: null,
  analysisType: null
};

const listeners = new Set<() => void>();

function updateGlobalState(updates: Partial<BackgroundAnalysisState>) {
  globalState = { ...globalState, ...updates };
  listeners.forEach(listener => listener());
}

export function useBackgroundAnalysis() {
  const [state, setState] = useState(globalState);
  const queryClient = useQueryClient();

  useEffect(() => {
    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const competitiveLandscapeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/competitive-landscape-analysis', {});
    },
    onMutate: () => {
      updateGlobalState({ 
        isAnalyzing: true, 
        error: null, 
        analysisType: 'competitive' 
      });
    },
    onSuccess: (data) => {
      updateGlobalState({ 
        isAnalyzing: false, 
        results: data, 
        analysisType: 'competitive' 
      });
      // Invalidate both competitive analyses and landscape analysis queries
      queryClient.invalidateQueries({ queryKey: ['/api/competitive-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/competitive-landscape-analysis'] });
    },
    onError: (error: any) => {
      updateGlobalState({ 
        isAnalyzing: false, 
        error: error.message, 
        analysisType: null 
      });
    }
  });

  const positioningMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/positioning-recommendations', {});
      return response.json();
    },
    onMutate: () => {
      updateGlobalState({ 
        isAnalyzing: true, 
        error: null, 
        analysisType: 'positioning' 
      });
    },
    onSuccess: (data) => {
      updateGlobalState({ 
        isAnalyzing: false, 
        results: data, 
        analysisType: 'positioning' 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/positioning-recommendations'] });
    },
    onError: (error: any) => {
      updateGlobalState({ 
        isAnalyzing: false, 
        error: error.message, 
        analysisType: null 
      });
    }
  });

  const startCompetitiveAnalysis = () => {
    if (!state.isAnalyzing) {
      competitiveLandscapeMutation.mutate();
    }
  };

  const startPositioningAnalysis = () => {
    if (!state.isAnalyzing) {
      positioningMutation.mutate();
    }
  };

  const clearResults = () => {
    updateGlobalState({ 
      results: null, 
      error: null, 
      analysisType: null 
    });
  };

  return {
    ...state,
    startCompetitiveAnalysis,
    startPositioningAnalysis,
    clearResults
  };
}