import { ITemplate, ITemplateLayout } from "../models/template.model";

/**
 * Default template dimensions in pixels
 */
export const DEFAULT_DIMENSIONS = {
    width: 350, // Standard ID card width
    height: 220, // Standard ID card height
};

/**
 * Default template layout with common fields
 */
export const DEFAULT_TEMPLATE_LAYOUT: ITemplateLayout = {
    width: DEFAULT_DIMENSIONS.width,
    height: DEFAULT_DIMENSIONS.height,
    elements: [
        // School Logo
        {
            type: "image",
            field: "schoolLogo",
            x: 20,
            y: 20,
            width: 60,
            height: 60,
        },
        // School Name
        {
            type: "text",
            field: "schoolName",
            x: 90,
            y: 30,
            fontSize: 16,
            fontFamily: "Arial, sans-serif",
            color: "#000000",
        },
        // Student Photo
        {
            type: "image",
            field: "profileImage",
            x: 20,
            y: 90,
            width: 100,
            height: 120,
        },
        // Student Name
        {
            type: "text",
            field: "name",
            x: 130,
            y: 100,
            fontSize: 14,
            fontFamily: "Arial, sans-serif",
            color: "#000000",
        },
        // Registration Number
        {
            type: "text",
            field: "registrationNumber",
            x: 130,
            y: 120,
            fontSize: 12,
            fontFamily: "Arial, sans-serif",
            color: "#666666",
        },
        // Class
        {
            type: "text",
            field: "class",
            x: 130,
            y: 140,
            fontSize: 12,
            fontFamily: "Arial, sans-serif",
            color: "#666666",
        },
        // Academic Year
        {
            type: "text",
            field: "academicYear",
            x: 130,
            y: 160,
            fontSize: 12,
            fontFamily: "Arial, sans-serif",
            color: "#666666",
        },
        // QR Code
        {
            type: "qr",
            x: 250,
            y: 140,
            width: 60,
            height: 60,
        },
    ],
};

/**
 * Create a new template with default layout
 * @param schoolId - ID of the school
 * @param academicYear - Academic year for the template
 * @returns ITemplate object with default layout
 */
export const createDefaultTemplate = (
    schoolId: string,
    academicYear: number
): Partial<ITemplate> => {
    return {
        name: `Default Template ${academicYear}`,
        school: schoolId,
        academicYear,
        layout: DEFAULT_TEMPLATE_LAYOUT,
        isActive: true,
    };
};

/**
 * Validate template layout dimensions
 * @param layout - Template layout to validate
 * @returns boolean indicating if layout is valid
 */
export const validateTemplateLayout = (layout: ITemplateLayout): boolean => {
    // Check basic dimensions
    if (layout.width <= 0 || layout.height <= 0) {
        return false;
    }

    // Check elements
    if (!Array.isArray(layout.elements) || layout.elements.length === 0) {
        return false;
    }

    // Validate each element
    return layout.elements.every((element) => {
        // Check required properties
        if (!element.type || !element.x || !element.y) {
            return false;
        }

        // Check element type
        if (!["text", "image", "qr"].includes(element.type)) {
            return false;
        }

        // Check coordinates are within bounds
        if (element.x < 0 || element.y < 0) {
            return false;
        }

        // Check dimensions if specified
        if (element.width && element.width <= 0) return false;
        if (element.height && element.height <= 0) return false;

        return true;
    });
};
