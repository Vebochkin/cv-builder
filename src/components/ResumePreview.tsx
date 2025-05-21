import React, { useEffect } from 'react';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([RadarChart, GridComponent, CanvasRenderer]);

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

interface ResumePreviewProps {
  formData: FormData;
  template: string;
  colorScheme: string;
  onTemplateChange: (template: string) => void;
  onColorSchemeChange: (colorScheme: string) => void;
  onExportPDF: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  formData,
  template,
  colorScheme,
  onTemplateChange,
  onColorSchemeChange,
  onExportPDF,
}) => {
  const getColorClass = () => {
    switch (colorScheme) {
      case 'blue': return 'bg-blue-600 text-white';
      case 'green': return 'bg-green-600 text-white';
      case 'red': return 'bg-red-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  const getTextColorClass = () => {
    switch (colorScheme) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getBorderColorClass = () => {
    switch (colorScheme) {
      case 'blue': return 'border-blue-600';
      case 'green': return 'border-green-600';
      case 'red': return 'border-red-600';
      default: return 'border-blue-600';
    }
  };

  useEffect(() => {
    if (formData.skills.length > 0 && template === 'minimal') {
      const chartDom = document.getElementById('skills-chart');
      if (chartDom) {
        const myChart = echarts.init(chartDom);
        const option = {
          radar: {
            indicator: formData.skills.map(skill => ({ name: skill.name, max: 100 })),
            radius: '65%',
          },
          series: [
            {
              type: 'radar',
              data: [
                {
                  value: formData.skills.map(skill => skill.level),
                  name: 'Навыки',
                  areaStyle: {
                    color: colorScheme === 'blue' ? 'rgba(64, 158, 255, 0.6)' :
                      colorScheme === 'green' ? 'rgba(103, 194, 58, 0.6)' :
                      'rgba(245, 108, 108, 0.6)'
                  },
                  lineStyle: {
                    color: colorScheme === 'blue' ? '#409EFF' :
                      colorScheme === 'green' ? '#67C23A' :
                      '#F56C6C'
                  }
                }
              ]
            }
          ],
          animation: false
        };
        myChart.setOption(option);

        const handleResize = () => myChart.resize();
        window.addEventListener('resize', handleResize);

        return () => {
          myChart.dispose();
          window.removeEventListener('resize', handleResize);
        };
      }
    }
  }, [formData.skills, colorScheme, template]);

  return (
    <div className="w-full lg:w-3/5">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Настройки шаблона</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Шаблон</label>
            <div className="flex gap-2">
              <button
                onClick={() => onTemplateChange('modern')}
                className={`px-3 py-1 border rounded whitespace-nowrap cursor-pointer ${template === 'modern' ? getColorClass() : 'border-gray-300'}`}
              >
                Современный
              </button>
              <button
                onClick={() => onTemplateChange('classic')}
                className={`px-3 py-1 border rounded whitespace-nowrap cursor-pointer ${template === 'classic' ? getColorClass() : 'border-gray-300'}`}
              >
                Классический
              </button>
              <button
                onClick={() => onTemplateChange('minimal')}
                className={`px-3 py-1 border rounded whitespace-nowrap cursor-pointer ${template === 'minimal' ? getColorClass() : 'border-gray-300'}`}
              >
                Минималистичный
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Цветовая схема</label>
            <div className="flex gap-2">
              <button
                onClick={() => onColorSchemeChange('blue')}
                className={`w-8 h-8 rounded-full bg-blue-600 cursor-pointer ${colorScheme === 'blue' ? 'ring-2 ring-offset-2 ring-blue-600' : ''}`}
                title="Синяя"
              ></button>
              <button
                onClick={() => onColorSchemeChange('green')}
                className={`w-8 h-8 rounded-full bg-green-600 cursor-pointer ${colorScheme === 'green' ? 'ring-2 ring-offset-2 ring-green-600' : ''}`}
                title="Зеленая"
              ></button>
              <button
                onClick={() => onColorSchemeChange('red')}
                className={`w-8 h-8 rounded-full bg-red-600 cursor-pointer ${colorScheme === 'red' ? 'ring-2 ring-offset-2 ring-red-600' : ''}`}
                title="Красная"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Предпросмотр</h2>
          <button
            onClick={onExportPDF}
            data-export-pdf
            className={`px-4 py-2 ${getColorClass()} rounded whitespace-nowrap cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <i className="fas fa-download"></i>
            Скачать PDF
          </button>
        </div>
        <div className="p-6 bg-gray-100 flex justify-center">
          <div id="resume-preview" className="w-full max-w-[595px] bg-white shadow-lg" style={{ minHeight: '842px' }}>
            {template === 'modern' && (
              <div className="h-full flex flex-col">
                <div className={`p-8 ${getColorClass()}`}>
                  <h1 className="text-3xl font-bold mb-1">{formData.basic.fullName}</h1>
                  <p className="text-xl">{formData.basic.position}</p>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/3 bg-gray-100 p-6">
                    <div className="mb-8">
                      <h2 className={`text-lg font-bold mb-3 pb-2 border-b ${getBorderColorClass()}`}>Контакты</h2>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <i className="fas fa-envelope text-gray-600 mt-1"></i>
                          <span>{formData.basic.email}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-phone text-gray-600 mt-1"></i>
                          <span>{formData.basic.phone}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-map-marker-alt text-gray-600 mt-1"></i>
                          <span>{formData.basic.location}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold mb-3 pb-2 border-b ${getBorderColorClass()}`}>Навыки</h2>
                      <ul className="space-y-2">
                        {formData.skills.map(skill => (
                          <li key={skill.id}>
                            <div className="flex justify-between mb-1">
                              <span>{skill.name}</span>
                              <span className="text-sm text-gray-500">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-300 h-1.5 rounded-full">
                              <div
                                className={colorScheme === 'blue' ? 'bg-blue-600 h-1.5 rounded-full' :
                                  colorScheme === 'green' ? 'bg-green-600 h-1.5 rounded-full' :
                                  'bg-red-600 h-1.5 rounded-full'}
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="w-2/3 p-6">
                    <div className="mb-6">
                      <h2 className={`text-lg font-bold mb-3 pb-2 border-b ${getBorderColorClass()}`}>О себе</h2>
                      <p className="text-gray-700">{formData.basic.about}</p>
                    </div>
                    <div className="mb-6">
                      <h2 className={`text-lg font-bold mb-3 pb-2 border-b ${getBorderColorClass()}`}>Опыт работы</h2>
                      <div className="space-y-4">
                        {formData.experience.map(exp => (
                          <div key={exp.id}>
                            <h3 className="font-bold">{exp.position}</h3>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>{exp.company}</span>
                              <span>
                                {exp.startDate && new Date(exp.startDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })} -
                                {exp.endDate ? new Date(exp.endDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' }) : 'По настоящее время'}
                              </span>
                            </div>
                            <p className="text-gray-700">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold mb-3 pb-2 border-b ${getBorderColorClass()}`}>Образование</h2>
                      <div className="space-y-4">
                        {formData.education.map(edu => (
                          <div key={edu.id}>
                            <h3 className="font-bold">{edu.degree}</h3>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>{edu.institution}</span>
                              <span>
                                {edu.startDate && new Date(edu.startDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })} -
                                {edu.endDate ? new Date(edu.endDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' }) : 'По настоящее время'}
                              </span>
                            </div>
                            <p className="text-gray-700">{edu.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {template === 'classic' && (
              <div className="h-full p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-1">{formData.basic.fullName}</h1>
                  <p className={`text-xl ${getTextColorClass()}`}>{formData.basic.position}</p>
                  <div className="flex justify-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-envelope"></i> {formData.basic.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-phone"></i> {formData.basic.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-map-marker-alt"></i> {formData.basic.location}
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className={`text-lg font-bold mb-3 ${getTextColorClass()} border-b-2 ${getBorderColorClass()} pb-1`}>О себе</h2>
                  <p className="text-gray-700">{formData.basic.about}</p>
                </div>
                <div className="mb-6">
                  <h2 className={`text-lg font-bold mb-3 ${getTextColorClass()} border-b-2 ${getBorderColorClass()} pb-1`}>Опыт работы</h2>
                  <div className="space-y-4">
                    {formData.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold">{exp.position}</h3>
                          <span className="text-sm text-gray-600">
                            {exp.startDate && new Date(exp.startDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })} -
                            {exp.endDate ? new Date(exp.endDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' }) : 'По настоящее время'}
                          </span>
                        </div>
                        <p className="text-gray-600 italic mb-1">{exp.company}</p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h2 className={`text-lg font-bold mb-3 ${getTextColorClass()} border-b-2 ${getBorderColorClass()} pb-1`}>Образование</h2>
                  <div className="space-y-4">
                    {formData.education.map(edu => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold">{edu.degree}</h3>
                          <span className="text-sm text-gray-600">
                            {edu.startDate && new Date(edu.startDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })} -
                            {edu.endDate ? new Date(edu.endDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' }) : 'По настоящее время'}
                          </span>
                        </div>
                        <p className="text-gray-600 italic mb-1">{edu.institution}</p>
                        <p className="text-gray-700">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className={`text-lg font-bold mb-3 ${getTextColorClass()} border-b-2 ${getBorderColorClass()} pb-1`}>Навыки</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.skills.map(skill => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-1">
                          <span>{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full">
                          <div
                            className={colorScheme === 'blue' ? 'bg-blue-600 h-1.5 rounded-full' :
                              colorScheme === 'green' ? 'bg-green-600 h-1.5 rounded-full' :
                              'bg-red-600 h-1.5 rounded-full'}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {template === 'minimal' && (
              <div className="h-full p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-1">{formData.basic.fullName}</h1>
                  <p className={`text-xl ${getTextColorClass()}`}>{formData.basic.position}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    <span>{formData.basic.email}</span>
                    <span>|</span>
                    <span>{formData.basic.phone}</span>
                    <span>|</span>
                    <span>{formData.basic.location}</span>
                  </div>
                </div>
                <div className="mb-8">
                  <p className="text-gray-700">{formData.basic.about}</p>
                </div>
                <div className="mb-8">
                  <h2 className={`text-base uppercase tracking-wider font-bold mb-4 ${getTextColorClass()}`}>Опыт работы</h2>
                  <div className="space-y-6">
                    {formData.experience.map(exp => (
                      <div key={exp.id} className="border-l-2 pl-4 ml-2 relative">
                        <div className={`w-3 h-3 rounded-full absolute -left-[7px] top-0 ${colorScheme === 'blue' ? 'bg-blue-600' : colorScheme === 'green' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                        <h3 className="font-bold">{exp.position}</h3>
                        <p className="text-gray-600 mb-1">{exp.company}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          {exp.startDate && new Date(exp.startDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })} -
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' }) : 'По настоящее время'}
                        </p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className={`text-base uppercase tracking-wider font-bold mb-4 ${getTextColorClass()}`}>Образование</h2>
                  <div className="space-y-6">
                    {formData.education.map(edu => (
                      <div key={edu.id} className="border-l-2 pl-4 ml-2 relative">
                        <div className={`w-3 h-3 rounded-full absolute -left-[7px] top-0 ${colorScheme === 'blue' ? 'bg-blue-600' : colorScheme === 'green' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                        <h3 className="font-bold">{edu.degree}</h3>
                        <p className="text-gray-600 mb-1">{edu.institution}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          {edu.startDate && new Date(edu.startDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })} -
                          {edu.endDate ? new Date(edu.endDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' }) : 'По настоящее время'}
                        </p>
                        <p className="text-gray-700">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className={`text-base uppercase tracking-wider font-bold mb-4 ${getTextColorClass()}`}>Навыки</h2>
                  <div id="skills-chart" style={{ width: '100%', height: '300px' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;