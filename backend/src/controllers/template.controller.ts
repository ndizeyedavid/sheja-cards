import { Request, Response } from 'express';
import Template from '../models/template.model';
import { createDefaultTemplate } from '../utils/template.utils';

/**
 * Create a new template
 */
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, layout, academicYear } = req.body;
    const schoolId = req.user?.school;

    // Check if an active template already exists for this academic year
    const activeTemplate = await Template.findOne({
      school: schoolId,
      academicYear,
      isActive: true,
    });

    const template = await Template.create({
      name,
      school: schoolId,
      academicYear,
      layout,
      isActive: !activeTemplate, // Set as active only if no active template exists
    });

    res.status(201).json({
      message: 'Template created successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating template',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

/**
 * Get all templates
 */
export const getTemplates = async (req: Request, res: Response) => {
  try {
    const academicYear = parseInt(req.query.academicYear as string) || new Date().getFullYear();

    const templates = await Template.find({
      school: req.user?.school,
      academicYear,
    }).sort({ isActive: -1, createdAt: -1 });

    res.status(200).json({
      message: 'Templates retrieved successfully',
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving templates',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

/**
 * Get a single template
 */
export const getTemplate = async (req: Request, res: Response) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      school: req.user?.school,
    });

    if (!template) {
      return res.status(404).json({
        message: 'Template not found',
      });
    }

    res.status(200).json({
      message: 'Template retrieved successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving template',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

/**
 * Update a template
 */
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { name, layout } = req.body;

    const template = await Template.findOneAndUpdate(
      {
        _id: req.params.id,
        school: req.user?.school,
      },
      { name, layout },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({
        message: 'Template not found',
      });
    }

    res.status(200).json({
      message: 'Template updated successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating template',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

/**
 * Delete a template
 */
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const template = await Template.findOneAndDelete({
      _id: req.params.id,
      school: req.user?.school,
      isActive: false, // Can't delete active template
    });

    if (!template) {
      return res.status(404).json({
        message: 'Template not found or is currently active',
      });
    }

    res.status(200).json({
      message: 'Template deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting template',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

/**
 * Set a template as active
 */
export const setActiveTemplate = async (req: Request, res: Response) => {
  try {
    const templateId = req.params.id;
    const schoolId = req.user?.school;

    // Get the template to activate
    const template = await Template.findOne({
      _id: templateId,
      school: schoolId,
    });

    if (!template) {
      return res.status(404).json({
        message: 'Template not found',
      });
    }

    // Deactivate current active template
    await Template.findOneAndUpdate(
      {
        school: schoolId,
        academicYear: template.academicYear,
        isActive: true,
      },
      { isActive: false }
    );

    // Activate the selected template
    template.isActive = true;
    await template.save();

    res.status(200).json({
      message: 'Template set as active successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error setting active template',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

/**
 * Create default template
 */
export const createDefaultTemplate = async (req: Request, res: Response) => {
  try {
    const academicYear = parseInt(req.body.academicYear as string) || new Date().getFullYear();
    const schoolId = req.user?.school;

    // Check if a template already exists for this academic year
    const existingTemplate = await Template.findOne({
      school: schoolId,
      academicYear,
    });

    if (existingTemplate) {
      return res.status(400).json({
        message: 'A template already exists for this academic year',
      });
    }

    const defaultTemplate = createDefaultTemplate(schoolId, academicYear);
    const template = await Template.create(defaultTemplate);

    res.status(201).json({
      message: 'Default template created successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating default template',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};