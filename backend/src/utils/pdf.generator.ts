import puppeteer from "puppeteer";
import { ITemplate } from "../models/template.model";
import { IStudent } from "../models/student.model";

interface GenerateIDCardOptions {
    template: ITemplate;
    student: IStudent;
    schoolLogo?: string;
    qrCodeData?: string;
}

/**
 * Generate HTML content for ID card
 */
const generateHTML = (options: GenerateIDCardOptions): string => {
    const { template, student, schoolLogo, qrCodeData } = options;

    // Create base HTML structure with template dimensions
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          .id-card {
            width: ${template.layout.width}px;
            height: ${template.layout.height}px;
            position: relative;
            background: white;
          }
          .element {
            position: absolute;
          }
        </style>
      </head>
      <body>
        <div class="id-card">
          ${template.layout.elements
              .map((element) => {
                  const style = `
                left: ${element.x}px;
                top: ${element.y}px;
                ${element.width ? `width: ${element.width}px;` : ""}
                ${element.height ? `height: ${element.height}px;` : ""}
                ${element.fontSize ? `font-size: ${element.fontSize}px;` : ""}
                ${element.fontFamily ? `font-family: ${element.fontFamily};` : ""}
                ${element.color ? `color: ${element.color};` : ""}
              `;

                  switch (element.type) {
                      case "text":
                          // Replace field placeholders with actual student data
                          const value = element.field
                              ? (student as any)[element.field] || element.value
                              : element.value;
                          return `<div class="element" style="${style}">${value}</div>`;

                      case "image":
                          // Handle school logo or student profile image
                          const imgSrc =
                              element.field === "schoolLogo"
                                  ? schoolLogo
                                  : element.field === "profileImage"
                                  ? student.profileImage
                                  : element.value;
                          return `<img class="element" src="${imgSrc}" style="${style}" />`;

                      case "qr":
                          // Add QR code if provided
                          return qrCodeData
                              ? `<img class="element" src="${qrCodeData}" style="${style}" />`
                              : "";

                      default:
                          return "";
                  }
              })
              .join("")}
        </div>
      </body>
    </html>
  `;

    return html;
};

/**
 * Generate PDF ID card
 */
export const generateIDCard = async (
    template: ITemplate,
    student: IStudent,
    schoolLogo?: string
): Promise<Buffer> => {
    try {
        const html = generateHTML({ template, student, schoolLogo });

        // Launch browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"],
        });

        // Create new page
        const page = await browser.newPage();

        // Set content
        await page.setContent(html, {
            waitUntil: "networkidle0",
        });

        // Generate PDF
        const pdf = await page.pdf({
            width: `${template.layout.width}px`,
            height: `${template.layout.height}px`,
            printBackground: true,
            format: "A4",
        });

        // Close browser
        await browser.close();

        return Buffer.from(pdf);
    } catch (error) {
        console.error("Error generating ID card:", error);
        throw new Error("Failed to generate ID card");
    }
};

/**
 * Generate multiple ID cards in batch
 */
export const generateBatchIDCards = async (
    template: ITemplate,
    students: IStudent[],
    schoolLogo?: string
): Promise<Buffer> => {
    try {
        // Launch browser once for batch processing
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"],
        });

        const page = await browser.newPage();

        // Generate HTML for all cards
        const html = students
            .map((student) =>
                generateHTML({
                    template,
                    student,
                    schoolLogo,
                })
            )
            .join('<div style="page-break-after: always;"></div>');

        // Set content
        await page.setContent(html, {
            waitUntil: "networkidle0",
        });

        // Generate PDF
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        // Close browser
        await browser.close();

        return Buffer.from(pdf);
    } catch (error) {
        console.error("Error generating batch ID cards:", error);
        throw new Error("Failed to generate batch ID cards");
    }
};
