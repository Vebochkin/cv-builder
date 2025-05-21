import React, { useState } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface FormData {
  basic: {
    fullName: string;
    position: string;
    email: string;
    phone: string;
    location: string;
    about: string;
  };
  experience: {
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    id: number;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: {
    id: number;
    name: string;
    level: number;
  }[];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [template, setTemplate] = useState('modern');
  const [colorScheme, setColorScheme] = useState('indigo');
  const [formData, setFormData] = useState<FormData>({
    basic: {
      fullName: 'Дмитрий Дмитриевич',
      position: 'Frontend Разработчик',
      email: 'dima@example.com',
      phone: '+3 334 123-45',
      location: 'Москва, Россия',
      about: 'Опытный frontend разработчик с более чем 5-летним стажем работы. Специализируюсь на создании отзывчивых и интуитивно понятных пользовательских интерфейсов с использованием современных JavaScript-фреймворков.'
    },
    experience: [
      {
        id: 1,
        company: 'ООО "Техно"',
        position: 'Старший Frontend Разработчик',
        startDate: '2020-01',
        endDate: '2023-05',
        description: 'Разработка и поддержка корпоративного веб-приложения. Внедрение React и TypeScript. Оптимизация производительности и улучшение UX/UI.'
      },
      {
        id: 2,
        company: 'ООО "Софт"',
        position: 'Frontend Разработчик',
        startDate: '2018-03',
        endDate: '2019-12',
        description: 'Создание интерактивных веб-интерфейсов для клиентских проектов. Работа с Vue.js и Webpack.'
      }
    ],
    education: [
      {
        id: 1,
        institution: 'Московский Государственный Университет',
        degree: 'Магистр компьютерных наук',
        startDate: '2016-09',
        endDate: '2018-06',
        description: 'Специализация в области веб-разработки и информационных систем.'
      }
    ],
    skills: [
      { id: 1, name: 'React', level: 90 },
      { id: 2, name: 'JavaScript', level: 85 },
      { id: 3, name: 'TypeScript', level: 85 },
      { id: 4, name: 'HTML/CSS', level: 75 },
      { id: 5, name: 'Node.js', level: 70 },
      { id: 6, name: 'Git', level: 0 }
    ]
  });

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const addNewItem = (section: string) => {
    if (section === 'experience') {
      const newId = formData.experience.length > 0
        ? Math.max(...formData.experience.map(item => item.id)) + 1
        : 1;
      updateFormData('experience', [
        ...formData.experience,
        {
          id: newId,
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]);
    } else if (section === 'education') {
      const newId = formData.education.length > 0
        ? Math.max(...formData.education.map(item => item.id)) + 1
        : 1;
      updateFormData('education', [
        ...formData.education,
        {
          id: newId,
          institution: '',
          degree: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]);
    } else if (section === 'skills') {
      const newId = formData.skills.length > 0
        ? Math.max(...formData.skills.map(item => item.id)) + 1
        : 1;
      updateFormData('skills', [
        ...formData.skills,
        {
          id: newId,
          name: '',
          level: 50
        }
      ]);
    }
  };

  const removeItem = (section: string, id: number) => {
    if (section === 'experience') {
      updateFormData('experience', formData.experience.filter(item => item.id !== id));
    } else if (section === 'education') {
      updateFormData('education', formData.education.filter(item => item.id !== id));
    } else if (section === 'skills') {
      updateFormData('skills', formData.skills.filter(item => item.id !== id));
    }
  };

  const updateItem = (section: string, id: number, field: string, value: any) => {
    if (section === 'experience') {
      updateFormData('experience', formData.experience.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ));
    } else if (section === 'education') {
      updateFormData('education', formData.education.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ));
    } else if (section === 'skills') {
      updateFormData('skills', formData.skills.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ));
    }
  };

  const updateBasicInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      basic: {
        ...prev.basic,
        [field]: value
      }
    }));
  };

  const exportToPDF = async () => {
    try {
      const element = document.getElementById('resume-preview');
      if (!element) return;

      // Создаем клон элемента для экспорта
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = '595px';
      clone.style.height = '842px';
      clone.style.boxShadow = 'none';
      clone.style.padding = '0';
      clone.style.margin = '0';
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 595,
        height: 842,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 595,
        windowHeight: 842
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`${formData.basic.fullName.trim() || 'resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-[1440px] min-h-[1024px]">
        <div className="flex flex-col lg:flex-row gap-6">
          <ResumeForm
            formData={formData}
            activeTab={activeTab}
            colorScheme={colorScheme}
            onTabChange={setActiveTab}
            onBasicInfoChange={updateBasicInfo}
            onAddItem={addNewItem}
            onRemoveItem={removeItem}
            onItemChange={updateItem}
            onExportPDF={exportToPDF}
          />
          <ResumePreview
            formData={formData}
            template={template}
            colorScheme={colorScheme}
            onTemplateChange={setTemplate}
            onColorSchemeChange={setColorScheme}
            onExportPDF={exportToPDF}
          />
        </div>
      </div>
    </div>
  );
};

export default App;