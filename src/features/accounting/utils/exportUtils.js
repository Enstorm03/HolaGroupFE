import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId, filename = 'report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#F8FAFC',
      // Bổ sung xử lý lỗi màu sắc bằng cách ép kiểu các phần tử phức tạp
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Xử lý tất cả các phần tử để thay thế các hàm màu không hỗ trợ
          const allElements = clonedElement.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i];
            const style = window.getComputedStyle(el);
            
            const propertiesToSanitize = ['color', 'backgroundColor', 'borderColor', 'outlineColor'];
            propertiesToSanitize.forEach(prop => {
              const val = el.style[prop];
              if (val && (val.includes('color(') || val.includes('oklch') || val.includes('color-mix'))) {
                el.style[prop] = prop === 'backgroundColor' ? 'transparent' : '#0F172A';
              }
            });
          }
          clonedElement.style.fontFamily = 'Inter, sans-serif';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Nếu ảnh dài hơn 1 trang, có thể cuộn thêm (tạm thời xử lý fit 1 trang landscape)
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('PDF Export Error:', error);
    return false;
  }
};
