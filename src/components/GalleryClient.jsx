import { useEffect, useState } from "react";

export default function GalleryClient({ apiUrl, tag, limit }) {
  const [images, setImages] = useState([]);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}?tag=${tag}&limit=${limit}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 429 || res.status === 500) {
            setApiError(true);
            return Promise.reject(new Error(`HTTP error ${res.status}`));
          }
          return Promise.reject(new Error(`HTTP error ${res.status}`));
        }
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          setApiError(true);
          return;
        }
        if (data.error) {
          setApiError(true);
          return;
        }
        setImages(data);
      })
      .catch(() => {
        setApiError(true);
        setImages([]);
      });
  }, [apiUrl, tag, limit]);

  if (apiError) {
    return null;
  }

  if (images.length === 0) {
    return <div>画像を取得中...</div>;
  }

  return (
    <section className="flex-1 px-6 py-10 bg-[#111a24] bg-opacity-30 backdrop-blur-md rounded-2xl shadow-2xl">
      <header className="mb-8 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold break-words font-['Fira_Mono']">#{tag}</h2>
      </header>
      <div className="columns-1 sm:columns-2 lg:columns2 gap-6">
        {images.map(({ imageUrl, noteUrl }) => (
          <a href={noteUrl} target="_blank" rel="noopener noreferrer" key={imageUrl}>
            <div
              className="break-inside-avoid relative overflow-hidden p-2 border-2 border-white border-opacity-50 rounded-md shadow-lg group mb-6"
              style={{
                clipPath:
                  "polygon(20px 0%, calc(100% - 20px) 0%, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0% calc(100% - 20px), 0% 20px)",
              }}
            >
              <img
                src={imageUrl}
                alt="Misskey Image"
                className="w-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}