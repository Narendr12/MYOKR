
import React from 'react';

export const metadata = {
  title: 'TMS',
  description: 'A comprehensive project management dashboard',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      primary: '#3b82f6',
                      secondary: '#64748b',
                      dark: '#0f172a',
                      darkSurface: '#1e293b',
                    }
                  }
                }
              }
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{
            __html: `
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            .dark ::-webkit-scrollbar-thumb { background: #475569; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `
        }} />
      </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-dark dark:text-gray-100 transition-colors duration-200 font-sans">
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
