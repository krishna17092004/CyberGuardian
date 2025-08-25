import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Threat, SystemMetrics } from '@/lib/types';

interface ThreatFilters {
  severity?: string;
  status?: string;
  type?: string;
  search?: string;
}

export function useThreatData(filters?: ThreatFilters) {
  const queryClient = useQueryClient();

  // Fetch threats with optional filters
  const threatsQuery = useQuery({
    queryKey: ['/api/threats', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.severity) params.append('severity', filters.severity);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      
      const response = await fetch(`/api/threats?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch threats: ${response.statusText}`);
      }
      return response.json() as Promise<Threat[]>;
    },
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchInterval: 60000, // Auto-refresh every minute
  });

  // Fetch system metrics
  const metricsQuery = useQuery({
    queryKey: ['/api/metrics'],
    queryFn: async () => {
      const response = await fetch('/api/metrics');
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.statusText}`);
      }
      return response.json() as Promise<SystemMetrics>;
    },
    staleTime: 15000, // Consider data stale after 15 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Fetch specific threat by ID
  const useThreatById = (id: string) => {
    return useQuery({
      queryKey: ['/api/threats', id],
      queryFn: async () => {
        const response = await fetch(`/api/threats/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch threat: ${response.statusText}`);
        }
        return response.json() as Promise<Threat>;
      },
      enabled: !!id,
    });
  };

  // Create new threat
  const createThreatMutation = useMutation({
    mutationFn: async (threatData: Partial<Threat>) => {
      const response = await apiRequest('POST', '/api/threats', threatData);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch threats and metrics
      queryClient.invalidateQueries({ queryKey: ['/api/threats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/metrics'] });
    },
    onError: (error) => {
      console.error('Failed to create threat:', error);
    },
  });

  // Update existing threat
  const updateThreatMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Threat> }) => {
      const response = await apiRequest('PATCH', `/api/threats/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch threats and metrics
      queryClient.invalidateQueries({ queryKey: ['/api/threats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/metrics'] });
    },
    onError: (error) => {
      console.error('Failed to update threat:', error);
    },
  });

  // Mitigate threat (convenience method)
  const mitigateThreatMutation = useMutation({
    mutationFn: async (threatId: string) => {
      const response = await apiRequest('PATCH', `/api/threats/${threatId}`, {
        status: 'mitigated',
        mitigatedAt: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/threats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/metrics'] });
    },
    onError: (error) => {
      console.error('Failed to mitigate threat:', error);
    },
  });

  // Filter threats on client side for search functionality
  const filteredThreats = threatsQuery.data?.filter((threat) => {
    if (!filters?.search) return true;
    
    const searchTerm = filters.search.toLowerCase();
    return (
      threat.title.toLowerCase().includes(searchTerm) ||
      threat.description.toLowerCase().includes(searchTerm) ||
      threat.sourceIp?.toLowerCase().includes(searchTerm) ||
      threat.targetSystem?.toLowerCase().includes(searchTerm) ||
      threat.location?.toLowerCase().includes(searchTerm)
    );
  });

  // Helper functions for threat statistics
  const getThreatsByStatus = (status: string) => {
    return threatsQuery.data?.filter(threat => threat.status === status) || [];
  };

  const getThreatsBySeverity = (severity: string) => {
    return threatsQuery.data?.filter(threat => threat.severity === severity) || [];
  };

  const getCriticalThreats = () => getThreatsBySeverity('critical');
  const getActiveThreats = () => getThreatsByStatus('active');

  return {
    // Query results
    threats: filteredThreats || [],
    allThreats: threatsQuery.data || [],
    metrics: metricsQuery.data,
    
    // Query states
    isLoadingThreats: threatsQuery.isLoading,
    isLoadingMetrics: metricsQuery.isLoading,
    threatsError: threatsQuery.error,
    metricsError: metricsQuery.error,
    
    // Mutations
    createThreat: createThreatMutation.mutate,
    updateThreat: updateThreatMutation.mutate,
    mitigateThreat: mitigateThreatMutation.mutate,
    
    // Mutation states
    isCreatingThreat: createThreatMutation.isPending,
    isUpdatingThreat: updateThreatMutation.isPending,
    isMitigatingThreat: mitigateThreatMutation.isPending,
    
    // Helper functions
    useThreatById,
    getThreatsByStatus,
    getThreatsBySeverity,
    getCriticalThreats,
    getActiveThreats,
    
    // Manual refetch functions
    refetchThreats: threatsQuery.refetch,
    refetchMetrics: metricsQuery.refetch,
  };
}
