'use client'

import { useEffect, useState, useRef } from 'react'

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedPost, setSelectedPost] = useState<any | null>(null)

  const feedRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      feedRef.current?.scrollTo?.({
        top: 0,
        behavior: 'smooth',
      })
    })
  }

  useEffect(() => {
    setLoading(true)

    const url = selectedCategory
      ? `/api/posts?category=${selectedCategory}`
      : '/api/posts'

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : [])
        setLoading(false)
        setTimeout(() => scrollToTop(), 50)
      })
      .catch(() => {
        setPosts([])
        setLoading(false)
      })
  }, [selectedCategory])

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => setCategories([]))
  }, [])

  // Vista de nota individual
  if (selectedPost) {
    return (
      <div className="h-screen w-full bg-white overflow-y-auto"> {menuOpen && (
  <div
    onClick={() => setMenuOpen(false)}
    className="fixed inset-0 z-[90] bg-black/40"
  />
)}

<div
  className={`fixed top-0 left-0 z-[100] h-full w-1/2 bg-black/80 text-white backdrop-blur-2xl transition-transform duration-500 ${
    menuOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>
  <div className="flex items-center justify-between border-b border-gray-800 p-5">
   <img
  src="/logo.png"
  className="h-17 w-auto object-contain"
  alt="Hora Política"
/>

    <button
      onClick={() => setMenuOpen(false)}
      className="text-2xl"
    >
      ✕
    </button>
  </div>

  <div className="flex flex-col gap-6 p-8 text-1xl font-normal">
    <button
      onClick={() => {
        setSelectedPost(null)
        setSelectedCategory(null)
        setMenuOpen(false)
      }}
      className="text-left"
    >
      Inicio
    </button>

    {categories.map((cat: any) => (
      <button
        key={cat.id}
        onClick={() => {
          setSelectedCategory(cat.id)
          setSelectedPost(null)
          setMenuOpen(false)
        }}
        className="text-left"
      >
        {cat.name}
      </button>
    ))}
  </div>
</div>
 <div className="sticky top-0 z-50 flex w-full items-center bg-black px-3 py-0 border-b border-white/20">
<button
  onClick={() => {
    console.log('MENU')
    setMenuOpen(true)
  }}
  className="text-white text-3xl"
>
  ☰
</button>

  <img
  src="/logo.png"
  onClick={() => setSelectedPost(null)}
  className="ml-20 h-17 w-auto object-contain cursor-pointer scale-120"
/>
</div>
        <iframe
          src={selectedPost.link}
          className="w-full"
          style={{ height: 'calc(100vh - 52px)', border: 'none' }}
        />
      </div>
    )
  }

if (loading) {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <img
        src="/logo.png"
        alt="Hora Política"
        className="w-72 h-auto animate-pulse"
      />
    </div>
  )
}

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full">
        <div className="relative flex items-center justify-between bg-black/60 px-5 pt-3 pb-3 backdrop-blur-md">

          <button
            onClick={() => setMenuOpen(true)}
            className="z-50 text-3xl text-white"
          >
            ☰
          </button>

          <button
            onClick={() => {
              setSelectedCategory(null)
              setMenuOpen(false)
              scrollToTop()
            }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-0"
          >
            <img src="/logo.png" className="h-60 w-90 object-contain relative top-0 left-3 scale-105" />
            <div className="header-title ml-[1px]">
  
</div>
          </button>

          <div className="w-8" />
        </div>
        <div className="h-[4px] w-full bg-white/80" />
      </header>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-[90] bg-black/40"
        />
      )}

      <div
        className={`fixed top-0 left-0 z-[100] h-full w-1/2 bg-black/80 text-white backdrop-blur-2xl transition-transform duration-500 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
<div className="flex items-center justify-between border-b border-gray-800 p-5">
  <img
    src="/logo.png"
    className="h-14 w-auto object-contain"
    alt="Hora Política"
  />

  <button onClick={() => setMenuOpen(false)} className="text-2xl">
    ✕
  </button>
</div>
        <div className="flex flex-col gap-6 p-10 text-1xl font-normal">
          <button
            onClick={() => {
              setSelectedCategory(null)
              setMenuOpen(false)
              scrollToTop()
            }}
            className="text-left"
          >
            Inicio
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setMenuOpen(false)
              }}
              className="text-left"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <main
        ref={feedRef}
        className="h-screen overflow-y-scroll bg-black snap-y snap-mandatory"
      >
        {posts.map((post: any) => {
          const image =
          post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            'https://images.unsplash.com/photo-1504711434969-e33886168f5c'

          const video = post.video_destacado || null

          const category =
            post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Sin categoría'

          return (
            <section
              key={post.id}
              className="relative h-screen overflow-hidden snap-start"
            >
<div
  className="absolute inset-0 cursor-pointer"
  onClick={() => setSelectedPost(post)}
>
  {video ? (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="h-full w-full object-cover"
    >
      <source src={video} type="video/mp4" />
    </video>
  ) : (
    <>
      {/* Fondo desenfocado */}
      <img
        src={image}
        className="absolute inset-0 h-full w-full object-cover scale-110 blur-xl"
      />

     {/* Imagen principal */}
<div className="absolute inset-0 overflow-hidden">
<img
  src={image}
  className="absolute inset-0 h-full w-full object-cover"
  style={{
    objectPosition: 'center center',
    transform: 'scale(1.00)',
  }}
/>

</div>
    </>
  )}
</div>

      <div className="absolute inset-0 bg-black/6 pointer-events-none" />

              <div className="relative z-10 flex h-full flex-col justify-end pb-20 px-6">
                <div className="max-w-5xl">
                  <div className="mb-5">
                    <span className="border-b-2 border-white pb-1 text-xs font-black uppercase text-white">
                      {category}
                    </span>
                  </div>
<h1
  onClick={() => setSelectedPost(post)}
  className="title-highlight text-3xl font-black text-black md:text-5xl cursor-pointer"
  dangerouslySetInnerHTML={{
    __html: post.title.rendered,
  }}
/>
                  
                </div>
              </div>
            </section>
          )
        })}
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

        html, body {
          background: black;
          margin: 0;
          padding: 0;
        }

        .header-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: 1.5rem;
          color: white;
          letter-spacing: 0.01em;
          white-space: nowrap;
          line-height: 1;
        }

        .title-highlight {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  text-transform: uppercase;

  display: inline;
  background: white;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;

  line-height: 1.8;
  padding: 0.02em 0.15em;
}
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}
