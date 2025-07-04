import React, { useState } from "react";

interface EditPlaylistHeaderProps {
  handleExport: (
    title: string,
    description: string,
    collaborative: boolean,
    isPublic: boolean
  ) => void;

  handleSave: (title: string, description: string) => void;
}

const EditPlaylistHeader: React.FC<EditPlaylistHeaderProps> = ({
  handleExport,
  handleSave,
}) => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const isPublic = formData.get("isPublic") === "on";
    const collaborative = formData.get("collaborative") === "on";
    if (
      (e.nativeEvent as SubmitEvent).submitter?.getAttribute("name") ===
      "export"
    ) {
      await handleExport(title, description, collaborative, isPublic);
    } else {
      await handleSave(title, description);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create Your Playlist
      </h1>
      <div className="flex justify-center mb-4">
        <form
          className="flex flex-1 flex-col justify-between"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              name="title"
              placeholder="Playlist Title"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-blue-500"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-blue-500 resize-none"
              rows={2}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPublic"
                defaultChecked
                className="form-checkbox"
              />
              <span>Public</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="collaborative"
                className="form-checkbox"
              />
              <span>Collaborative</span>
            </label>
            <button
              type="submit"
              name="export"
              className="ml-auto bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Export to Spotify
            </button>
            <button
              type="submit"
              name="save"
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPlaylistHeader;
