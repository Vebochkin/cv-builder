import React, { useState } from 'react';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';


import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

interface ResumeFormProps {
  formData: FormData;
  activeTab: string;
  colorScheme: string;
  onTabChange: (tab: string) => void;
  onBasicInfoChange: (field: string, value: string) => void;
  onAddItem: (section: string) => void;
  onRemoveItem: (section: string, id: number) => void;
  onItemChange: (section: string, id: number, field: string, value: any) => void;
  onExportPDF: () => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({
  formData,
  activeTab,
  colorScheme,
  onTabChange,
  onBasicInfoChange,
  onAddItem,
  onRemoveItem,
  onItemChange,
  onExportPDF,
}) => {
  // Получение класса цвета в зависимости от выбранной цветовой схемы
  const getColorClass = () => {
    switch (colorScheme) {
      case 'blue':
        return 'bg-blue-600 text-white';
      case 'green':
        return 'bg-green-600 text-white';
      case 'red':
        return 'bg-red-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  // Получение класса цвета для текста
  const getTextColorClass = () => {
    switch (colorScheme) {
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  // Получение класса цвета для границы
  const getBorderColorClass = () => {
    switch (colorScheme) {
      case 'blue':
        return 'border-blue-600';
      case 'green':
        return 'border-green-600';
      case 'red':
        return 'border-red-600';
      default:
        return 'border-blue-600';
    }
  };

  return (
    <div className="w-full lg:w-2/5 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CV Builder</h1>
      </div>

      {/* Вкладки для разделов резюме */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => onTabChange('basic')}
          className={`py-2 px-4 whitespace-nowrap cursor-pointer ${activeTab === 'basic' ? `${getBorderColorClass()} border-b-2 ${getTextColorClass()} font-medium` : 'text-gray-500'}`}
        >
          Основное
        </button>
        <button
          onClick={() => onTabChange('experience')}
          className={`py-2 px-4 whitespace-nowrap cursor-pointer ${activeTab === 'experience' ? `${getBorderColorClass()} border-b-2 ${getTextColorClass()} font-medium` : 'text-gray-500'}`}
        >
          Опыт
        </button>
        <button
          onClick={() => onTabChange('education')}
          className={`py-2 px-4 whitespace-nowrap cursor-pointer ${activeTab === 'education' ? `${getBorderColorClass()} border-b-2 ${getTextColorClass()} font-medium` : 'text-gray-500'}`}
        >
          Образование
        </button>
        <button
          onClick={() => onTabChange('skills')}
          className={`py-2 px-4 whitespace-nowrap cursor-pointer ${activeTab === 'skills' ? `${getBorderColorClass()} border-b-2 ${getTextColorClass()} font-medium` : 'text-gray-500'}`}
        >
          Навыки
        </button>
      </div>

      {/* Форма для активной вкладки */}
      <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
        {/* Основная информация */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
              <input
                type="text"
                value={formData.basic.fullName}
                onChange={(e) => onBasicInfoChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Введите ваше полное имя"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
              <input
                type="text"
                value={formData.basic.position}
                onChange={(e) => onBasicInfoChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Например: Frontend Разработчик"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.basic.email}
                onChange={(e) => onBasicInfoChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input
                type="tel"
                value={formData.basic.phone}
                onChange={(e) => onBasicInfoChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Местоположение</label>
              <input
                type="text"
                value={formData.basic.location}
                onChange={(e) => onBasicInfoChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Город, Страна"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">О себе</label>
              <textarea
                value={formData.basic.about}
                onChange={(e) => onBasicInfoChange('about', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={4}
                placeholder="Краткое описание вашего профессионального опыта и навыков"
              ></textarea>
            </div>
          </div>
        )}

        {/* Опыт работы */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 border border-gray-200 rounded-lg relative">
                <button
                  onClick={() => onRemoveItem('experience', exp.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                  title="Удалить"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                <h3 className="font-medium mb-3">Опыт работы #{index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => onItemChange('experience', exp.id, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Название компании"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => onItemChange('experience', exp.id, 'position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Ваша должность"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => onItemChange('experience', exp.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания</label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => onItemChange('experience', exp.id, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => onItemChange('experience', exp.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows={3}
                      placeholder="Опишите ваши обязанности и достижения"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => onAddItem('experience')}
              className={`w-full py-2 ${getColorClass()} rounded whitespace-nowrap cursor-pointer flex items-center justify-center gap-2`}
            >
              <i className="fas fa-plus"></i>
              Добавить опыт работы
            </button>
          </div>
        )}

        {/* Образование */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div key={edu.id} className="p-4 border border-gray-200 rounded-lg relative">
                <button
                  onClick={() => onRemoveItem('education', edu.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                  title="Удалить"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                <h3 className="font-medium mb-3">Образование #{index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Учебное заведение</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => onItemChange('education', edu.id, 'institution', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Название учебного заведения"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Степень/Специальность</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => onItemChange('education', edu.id, 'degree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Например: Бакалавр информатики"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => onItemChange('education', edu.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания</label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => onItemChange('education', edu.id, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => onItemChange('education', edu.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows={3}
                      placeholder="Дополнительная информация о вашем образовании"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => onAddItem('education')}
              className={`w-full py-2 ${getColorClass()} rounded whitespace-nowrap cursor-pointer flex items-center justify-center gap-2`}
            >
              <i className="fas fa-plus"></i>
              Добавить образование
            </button>
          </div>
        )}

        {/* Навыки */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {formData.skills.map((skill, index) => (
              <div key={skill.id} className="p-4 border border-gray-200 rounded-lg relative">
                <button
                  onClick={() => onRemoveItem('skills', skill.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                  title="Удалить"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                <h3 className="font-medium mb-3">Навык #{index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название навыка</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => onItemChange('skills', skill.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Например: JavaScript"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Уровень владения</label>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => onItemChange('skills', skill.id, 'level', parseInt(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${getBorderColorClass()}`}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => onAddItem('skills')}
              className={`w-full py-2 ${getColorClass()} rounded whitespace-nowrap cursor-pointer flex items-center justify-center gap-2`}
            >
              <i className="fas fa-plus"></i>
              Добавить навык
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;