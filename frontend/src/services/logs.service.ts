import pb from "@/lib/pb";

export interface LogEntry {
  action: string;
  description: string;
  entityType: string;
  entityId?: string;
  userId: string;
  schoolId: string;
  metadata?: any;
  timestamp: string;
}

export const createLog = async (
  logData: Omit<LogEntry, "timestamp" | "userId" | "schoolId">
) => {
  const userId = pb.authStore.record?.id;
  const schoolId = pb.authStore.record?.school;

  if (!userId || !schoolId) {
    throw new Error("User or school not authenticated");
  }

  const logEntry: LogEntry = {
    ...logData,
    userId,
    schoolId,
    timestamp: new Date().toISOString(),
  };

  const res = await pb.collection("logs").create(logEntry);
  return res;
};

export const fetchLogs = async (filters?: {
  entityType?: string;
  action?: string;
  limit?: number;
  page?: number;
}) => {
  const schoolId = pb.authStore.record?.school;
  if (!schoolId) {
    throw new Error("School ID not found");
  }

  let filter = `schoolId = "${schoolId}"`;

  if (filters?.entityType) {
    filter += ` && entityType = "${filters.entityType}"`;
  }

  if (filters?.action) {
    filter += ` && action = "${filters.action}"`;
  }

  const res = await pb
    .collection("logs")
    .getList(filters?.page || 1, filters?.limit || 50, {
      filter,
      sort: "-timestamp",
      expand: "userId",
    });

  return res;
};

export const fetchRecentLogs = async (limit: number = 10) => {
  return fetchLogs({ limit });
};

export const fetchLogsByEntity = async (
  entityType: string,
  entityId: string
) => {
  const schoolId = pb.authStore.record?.school;
  if (!schoolId) {
    throw new Error("School ID not found");
  }

  const res = await pb.collection("logs").getFullList({
    filter: `schoolId = "${schoolId}" && entityType = "${entityType}" && entityId = "${entityId}"`,
    sort: "-timestamp",
    expand: "userId",
  });

  return res;
};
