import React from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  activeTab: string;
}

export function TabPanel({ children, value, activeTab }: TabPanelProps) {
  if (value !== activeTab) return null;
  return <div className="mt-6">{children}</div>;
}