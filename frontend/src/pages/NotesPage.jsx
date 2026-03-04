// Example: Drop VoiceTranscriber anywhere in your app
// e.g. src/pages/NotesPage.jsx  or  embed in your existing layout

import { useState } from 'react';
import VoiceTranscriber from '../components/VoiceTranscriber';

const NotesPage = () => {
  const [liveText, setLiveText] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Voice Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Speak your thoughts — PathWay captures them instantly.</p>
        </div>

        {/* Drop the component in */}
        <VoiceTranscriber
          onTranscriptChange={(text) => setLiveText(text)}
        />

        {/*
          Optional: consume the live transcript elsewhere on the page.
          `onTranscriptChange` fires on every update (interim + final).
          The component itself is also directly editable as a textarea.
        */}
        {liveText && (
          <p className="mt-4 text-xs text-gray-400 text-right">
            {liveText.trim().split(/\s+/).filter(Boolean).length} words captured
          </p>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
