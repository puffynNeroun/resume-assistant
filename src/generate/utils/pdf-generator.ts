import PDFDocument from 'pdfkit';
import { ParsedResume } from '../../../types/parsed-resume.interface';

export function generateStructuredPDF(resume: ParsedResume): PDFKit.PDFDocument {
  const pdf = new PDFDocument({ size: 'A4', margin: 50 });
  pdf.registerFont('Cyrillic', 'src/assets/fonts/DejaVuSans.ttf');
  pdf.font('Cyrillic');

  // Заголовок
  pdf.fontSize(18).text('Резюме', { align: 'center' }).moveDown();

  // Саммари
  pdf.fontSize(12).text(resume.summary).moveDown();

  // Опыт работы
  if (resume.experience?.length) {
    pdf.fontSize(14).text('Опыт работы:', { underline: true }).moveDown(0.5);
    resume.experience.forEach((job) => {
      pdf.fontSize(12).text(`• ${job.role} в ${job.company} (${job.period})`);
      if (job.description) {
        pdf.text(`   ${job.description}`);
      }
      pdf.moveDown(0.5);
    });
  }

  // Навыки
  if (resume.skills) {
    pdf.fontSize(14).text('Навыки:', { underline: true }).moveDown(0.5);
    if (Array.isArray(resume.skills)) {
      resume.skills.forEach(s => {
        pdf.fontSize(12).text(`• ${s.name} — ${s.level}`);
      });
    } else {
      pdf.fontSize(12).text(resume.skills);
    }
    pdf.moveDown();
  }

  // Образование
  if (Array.isArray(resume.education)) {
    pdf.fontSize(14).text('Образование:', { underline: true }).moveDown(0.5);
    resume.education.forEach((edu) => {
      pdf.fontSize(12).text(`• ${edu.institution}`);
      if (edu.degree || edu.years) {
        pdf.text(`   ${edu.degree ?? ''} ${edu.years ?? ''}`);
      }
      pdf.moveDown(0.5);
    });
  } else if (typeof resume.education === 'string') {
    pdf.fontSize(14).text('Образование:', { underline: true }).moveDown(0.5);
    pdf.fontSize(12).text(resume.education).moveDown();
  }

  // Языки
  if (resume.languages?.length) {
    pdf.fontSize(14).text('Языки:', { underline: true }).moveDown(0.5);
    resume.languages.forEach((lang) => {
      if (typeof lang === 'string') {
        pdf.fontSize(12).text(`• ${lang}`);
      } else {
        pdf.fontSize(12).text(`• ${lang.name} — ${lang.level}`);
      }
    });
  }

  pdf.end();
  return pdf;
}
