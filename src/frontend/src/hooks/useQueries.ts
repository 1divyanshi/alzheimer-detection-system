import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ScanRecord } from "../backend";
import { useActor } from "./useActor";

export function useGetUserScans() {
  const { actor, isFetching } = useActor();
  return useQuery<ScanRecord[]>({
    queryKey: ["userScans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserScans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery<{ totalScans: bigint; modelAccuracy: string }>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return { totalScans: 0n, modelAccuracy: "94.7%" };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blobId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitScan(blobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userScans"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteScan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scanId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteScan(scanId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userScans"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
