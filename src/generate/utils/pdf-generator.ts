import PDFDocument from 'pdfkit';
import {ParsedResume} from '../../../types/parsed-resume.interface';
import { Readable } from 'stream';

export function generateStructuredPDF(resume: ParsedResume): PDFKit.PDFDocument {
  const pdf = new PDFDocument({ size: 'A4', margin: 50 });
  pdf.registerFont('Cyrillic', 'src/assets/fonts/DejaVuSans.ttf');
  pdf.font('Cyrillic');

  // Заголовок
  pdf.fontSize(18).text('Резюме', { align: 'center' }).moveDown(1);

  // Саммари
  pdf.fontSize(12).text(resume.summary).moveDown();

  // Проекты
  pdf.fontSize(14).text('Проекты:', { underline: true }).moveDown(0.5);
  resume.projects.forEach(p => {
    pdf.fontSize(12).text(`• ${p.title}`);
    p.description.forEach(d => pdf.text(`   - ${d}`));
    pdf.moveDown(0.5);
  });

  // Навыки
  pdf.fontSize(14).text('Навыки:', { underline: true }).moveDown(0.5);
  resume.skills.forEach(s => pdf.text(`• ${s.name} — ${s.level}`));
  pdf.moveDown();

  // Образование
  pdf.fontSize(14).text('Образование:', { underline: true }).moveDown(0.5);
  pdf.text(resume.education).moveDown();

  // Языки
  pdf.fontSize(14).text('Языки:', { underline: true }).moveDown(0.5);
  resume.languages.forEach(l => pdf.text(`• ${l}`));

  pdf.end();
  return pdf;
}
