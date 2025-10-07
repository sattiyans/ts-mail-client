"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options?: any;
  title?: string;
  description?: string;
}

export function Chart({ type, data, options, title, description }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb', // Light gray for dark theme
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1f2937', // Dark gray background
        titleColor: '#f9fafb', // Light text
        bodyColor: '#e5e7eb', // Light gray text
        borderColor: '#374151', // Border color
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        ticks: {
          color: '#9ca3af', // Medium gray
          font: {
            size: 12,
          },
        },
        grid: {
          color: '#374151', // Dark gray grid lines
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: '#9ca3af', // Medium gray
          font: {
            size: 12,
          },
        },
        grid: {
          color: '#374151', // Dark gray grid lines
          drawBorder: false,
        },
      },
    } : undefined,
    elements: type === 'doughnut' ? {
      arc: {
        borderWidth: 2,
      },
    } : undefined,
    ...options,
  };

  // Enhanced data with proper colors for dark theme
  const enhancedData = {
    ...data,
    datasets: data.datasets?.map((dataset: any, index: number) => {
      const colors = [
        '#3b82f6', // Blue
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#06b6d4', // Cyan
        '#84cc16', // Lime
        '#f97316', // Orange
      ];
      
      const doughnutColors = [
        '#3b82f6', // Blue
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#06b6d4', // Cyan
        '#84cc16', // Lime
        '#f97316', // Orange
      ];

      if (type === 'doughnut') {
        return {
          ...dataset,
          backgroundColor: doughnutColors.slice(0, dataset.data.length),
          borderColor: '#1f2937', // Dark border to match background
          borderWidth: 2,
          hoverBackgroundColor: doughnutColors.slice(0, dataset.data.length).map(color => color + '80'), // Add hover effect
          hoverBorderColor: '#374151',
          hoverBorderWidth: 3,
        };
      }

      return {
        ...dataset,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20', // Add transparency
        pointBackgroundColor: colors[index % colors.length],
        pointBorderColor: colors[index % colors.length],
        pointHoverBackgroundColor: colors[index % colors.length],
        pointHoverBorderColor: colors[index % colors.length],
      };
    }),
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={enhancedData} options={defaultOptions} />;
      case 'bar':
        return <Bar data={enhancedData} options={defaultOptions} />;
      case 'doughnut':
        return <Doughnut data={enhancedData} options={defaultOptions} />;
      default:
        return null;
    }
  };

  if (title || description) {
    return (
      <Card>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <div className="h-[300px]">{renderChart()}</div>
        </CardContent>
      </Card>
    );
  }

  return <div className="h-[300px]">{renderChart()}</div>;
}
