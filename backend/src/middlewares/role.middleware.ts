import { Request, Response, NextFunction } from 'express';
import { StaffRole } from '../models/staff.model';

/**
 * Type for role-based permissions
 */
type Permission = 'create' | 'read' | 'update' | 'delete';

/**
 * Role-based access control matrix
 */
const rolePermissions: Record<StaffRole, Permission[]> = {
  [StaffRole.HEADMASTER]: ['create', 'read', 'update', 'delete'],
  [StaffRole.DOS]: ['create', 'read', 'update'],
  [StaffRole.BURSAR]: ['read', 'update'],
  [StaffRole.PATRON]: ['read', 'update'],
  [StaffRole.TEACHER]: ['read'],
};

/**
 * Check if a role has a specific permission
 */
const hasPermission = (role: StaffRole, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) || false;
};

/**
 * Middleware to check if user has required permission
 */
export const checkPermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as StaffRole;

    if (!userRole) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    if (!hasPermission(userRole, permission)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

/**
 * Middleware to restrict access to specific roles
 */
export const restrictToRoles = (allowedRoles: StaffRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as StaffRole;

    if (!userRole) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
};

/**
 * Middleware to ensure user is headmaster of their school
 */
export const isHeadmaster = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.user?.role as StaffRole;

  if (userRole !== StaffRole.HEADMASTER) {
    return res.status(403).json({
      message: 'Only headmasters can perform this action',
    });
  }

  next();
};

/**
 * Middleware to ensure user is DOS of their school
 */
export const isDOS = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.user?.role as StaffRole;

  if (userRole !== StaffRole.DOS) {
    return res.status(403).json({
      message: 'Only Directors of Studies can perform this action',
    });
  }

  next();
};