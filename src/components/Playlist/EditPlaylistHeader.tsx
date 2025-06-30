import React, { useState } from "react";

interface EditPlaylistHeaderProps {
  handleExport: (
    title: string,
    description: string,
    collaborative: boolean,
    isPublic: boolean
  ) => Promise<void>;

  handleSave: (title: string, description: string) => Promise<void>;
}

const EditPlaylistHeader: React.FC<EditPlaylistHeaderProps> = ({
  handleExport,
  handleSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [collaborative, setCollaborative] = useState(false);

  const onExport = () => {
    handleExport(title, description, collaborative, isPublic);
  };

  const onSave = () => {
    handleSave(title, description);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create Your Playlist
      </h1>
      <div className="flex justify-center mb-4">
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              placeholder="Playlist Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-blue-500"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-blue-500 resize-none"
              rows={2}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="form-checkbox"
              />
              <span>Public</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={collaborative}
                onChange={(e) => setCollaborative(e.target.checked)}
                className="form-checkbox"
              />
              <span>Collaborative</span>
            </label>
            <button
              className="ml-auto bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors"
              onClick={onExport}
            >
              Export to Spotify
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPlaylistHeader;
